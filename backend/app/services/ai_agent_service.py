import re
import json
import logging
from typing import Optional, List, Dict, Any, TypedDict
from sqlalchemy.orm import Session
from sqlalchemy import or_

from langchain_core.tools import tool
from langgraph.graph import StateGraph, START, END

from app.core.config import settings
from app.models.order import Order
from app.models.product import Product
from app.models.user import User
from app.schemas.ai import ChatMessageResponse

logger = logging.getLogger(__name__)


# Store Policies Knowledge Base
STORE_POLICIES = {
    "shipping": "We offer FREE standard shipping on all orders across India! Orders are typically processed and dispatched within 24 to 48 business hours. Delivery usually takes 3 to 5 business days.",
    "return": "We provide an easy 7-day return policy for unused items in original packaging. To initiate a return, visit your Orders page or contact our support team.",
    "refund": "Refunds are processed within 3 to 5 business days after returned items pass quality inspection. Amount is credited back to your original payment method (Stripe/Card/UPI).",
    "cancellation": "Orders can be cancelled free of charge before they are dispatched. Once shipped, items can be returned within 7 days under our standard return policy.",
    "payment": "We accept major Credit/Debit Cards, Net Banking, and UPI securely processed via Stripe Payments. All transactions are 256-bit SSL encrypted.",
    "warranty": "All electronic devices and accessories come with a 1-year standard manufacturer warranty against manufacturing defects.",
}


class AgentGraphState(TypedDict):
    """
    LangGraph state schema representing conversational context and tool calling history.
    """
    message: str
    user_id: int
    user_name: str
    user_role: str
    intent: Optional[str]
    intent_arg: Optional[str]
    tools_used: List[str]
    metadata: Dict[str, Any]
    response: Optional[str]


class AIAgentService:
    @staticmethod
    def tool_check_order(db: Session, user: User, order_id: int) -> Dict[str, Any]:
        """
        Tool: Query the PostgreSQL database for an order's status and details.
        """
        order = db.query(Order).filter(Order.id == order_id).first()
        if not order:
            return {"error": f"Order #{order_id} could not be found."}

        # Privacy check: customers can only view their own orders
        if user.role != "ADMIN" and order.user_id != user.id:
            return {"error": f"Order #{order_id} does not belong to your account."}

        items = []
        for it in order.items:
            items.append({
                "product": it.product.name if it.product else f"Product #{it.product_id}",
                "quantity": it.quantity,
                "price": float(it.price),
            })

        return {
            "order_id": order.id,
            "status": order.status,
            "payment_status": order.payment_status,
            "total_amount": float(order.total_amount),
            "created_at": order.created_at.strftime("%B %d, %Y at %I:%M %p"),
            "items": items,
        }

    @staticmethod
    def tool_search_products(db: Session, query: str) -> List[Dict[str, Any]]:
        """
        Tool: Search active products in PostgreSQL by keyword or title.
        """
        keywords = query.strip().split()
        if not keywords:
            products = db.query(Product).filter(Product.is_active == True).limit(5).all()
        else:
            filters = [Product.name.ilike(f"%{kw}%") | Product.description.ilike(f"%{kw}%") for kw in keywords]
            products = db.query(Product).filter(Product.is_active == True, or_(*filters)).limit(5).all()

        results = []
        for p in products:
            results.append({
                "id": p.id,
                "name": p.name,
                "price": float(p.price),
                "stock": p.stock,
                "in_stock": p.stock > 0,
                "image_url": p.image_url,
            })
        return results

    @staticmethod
    def tool_get_policy(topic: str) -> str:
        """
        Tool: Retrieve official store policies regarding shipping, returns, refunds, or payments.
        """
        topic_lower = topic.lower()
        for key, text in STORE_POLICIES.items():
            if key in topic_lower:
                return text
        return (
            "ShopAI offers free nationwide shipping, a 7-day hassle-free return policy, "
            "secure Stripe card payments, and 1-year product warranty. "
            "What specific policy would you like to know about?"
        )

    @classmethod
    def create_langchain_tools(cls, db: Session, user: User) -> List[Any]:
        """
        Constructs and binds LangChain official Tool objects for PostgreSQL database lookups.
        """
        @tool
        def check_order_tool(order_id: int) -> str:
            """Check the status, payment, and items for an order by ID."""
            res = cls.tool_check_order(db, user, order_id)
            return json.dumps(res)

        @tool
        def search_products_tool(query: str) -> str:
            """Search available catalog products by name or category, returning live price and stock."""
            res = cls.tool_search_products(db, query)
            return json.dumps(res)

        @tool
        def get_policy_tool(topic: str) -> str:
            """Retrieve store policy regarding shipping, returns, refunds, warranty, or payments."""
            return cls.tool_get_policy(topic)

        return [check_order_tool, search_products_tool, get_policy_tool]

    @classmethod
    def _build_agent_graph(cls, db: Session, user: User):
        """
        Compiles a LangGraph StateGraph connecting the LangChain tools and agent reasoning steps.
        """
        lc_tools = cls.create_langchain_tools(db, user)
        tool_map = {t.name: t for t in lc_tools}

        def plan_step(state: AgentGraphState) -> Dict[str, Any]:
            lower_msg = state["message"].lower()

            # 1. Order ID match
            order_match = re.search(r"(?:order|track|receipt|status).*?#?(\d+)", lower_msg) or re.search(r"#(\d+)", lower_msg)
            if order_match:
                return {"intent": "order_lookup", "intent_arg": order_match.group(1)}

            # 2. General orders list
            if any(w in lower_msg for w in ["my orders", "previous orders", "order history", "past orders"]):
                return {"intent": "list_orders", "intent_arg": None}

            # 3. Policy inquiry
            policy_keywords = ["shipping", "delivery", "ship", "return", "refund", "cancel", "warranty", "payment", "pay", "policy"]
            matched_policy = next((k for k in STORE_POLICIES if k in lower_msg), None)
            if matched_policy or any(p in lower_msg for p in policy_keywords):
                return {"intent": "policy_lookup", "intent_arg": matched_policy or "shipping"}

            # 4. Product search
            product_inquiry = any(w in lower_msg for w in ["price", "cost", "stock", "available", "product", "buy", "headphones", "keyboard", "mouse", "monitor", "watch", "sony", "macbook", "ipad", "airpods", "search"])
            if product_inquiry:
                cleaned = re.sub(r"\b(do you have|how much is|what is the price of|price of|search for|is|the|in stock|available|show me)\b", "", lower_msg).strip()
                return {"intent": "product_search", "intent_arg": cleaned if cleaned else lower_msg}

            # 5. Greeting
            return {"intent": "greeting", "intent_arg": None}

        def execute_step(state: AgentGraphState) -> Dict[str, Any]:
            intent = state.get("intent")
            arg = state.get("intent_arg")
            tools_used = list(state.get("tools_used") or [])
            metadata = dict(state.get("metadata") or {})

            if intent == "order_lookup" and arg:
                tools_used.append("tool_check_order")
                # Invoke LangChain tool
                check_tool = tool_map.get("check_order_tool")
                order_id = int(arg)
                raw_json = check_tool.invoke({"order_id": order_id}) if check_tool else json.dumps(cls.tool_check_order(db, user, order_id))
                order_info = json.loads(raw_json)
                metadata["order"] = order_info

                if "error" in order_info:
                    resp = f"I checked our database for Order #{order_id}, but: {order_info['error']} Please ensure the order number is correct."
                else:
                    items_str = ", ".join([f"{it['product']} (x{it['quantity']})" for it in order_info['items']])
                    resp = (
                        f"📦 **Order #{order_id} Details:**\n\n"
                        f"• **Status:** {order_info['status']}\n"
                        f"• **Payment:** {order_info['payment_status']}\n"
                        f"• **Total Amount:** ₹{order_info['total_amount']:,.2f}\n"
                        f"• **Placed on:** {order_info['created_at']}\n"
                        f"• **Items:** {items_str}\n\n"
                        f"Is there anything else you'd like assistance with for this order?"
                    )
                return {"response": resp, "tools_used": tools_used, "metadata": metadata}

            elif intent == "list_orders":
                tools_used.append("tool_list_orders")
                orders = db.query(Order).filter(Order.user_id == user.id).order_by(Order.id.desc()).limit(3).all()
                if not orders:
                    resp = "You haven't placed any orders yet! Browse our catalog at `/products` to add items to your cart."
                else:
                    lines = [f"• **Order #{o.id}**: ₹{float(o.total_amount):,.2f} — Status: `{o.status}`, Payment: `{o.payment_status}`" for o in orders]
                    resp = "Here are your recent orders from PostgreSQL:\n\n" + "\n".join(lines) + "\n\nReply with any order ID (e.g., *'Track order #1'*) for full itemized details!"
                return {"response": resp, "tools_used": tools_used, "metadata": metadata}

            elif intent == "policy_lookup":
                tools_used.append("tool_get_policy")
                pol_tool = tool_map.get("get_policy_tool")
                topic = arg or "shipping"
                policy_text = pol_tool.invoke({"topic": topic}) if pol_tool else cls.tool_get_policy(topic)
                resp = f"ℹ️ **ShopAI Policy Notice ({topic.capitalize()}):**\n\n{policy_text}\n\nFeel free to ask if you have more questions regarding returns, warranty, or delivery!"
                return {"response": resp, "tools_used": tools_used, "metadata": metadata}

            elif intent == "product_search":
                tools_used.append("tool_search_products")
                search_tool = tool_map.get("search_products_tool")
                query_str = arg or "products"
                raw_json = search_tool.invoke({"query": query_str}) if search_tool else json.dumps(cls.tool_search_products(db, query_str))
                products = json.loads(raw_json)
                metadata["products"] = products

                if not products:
                    resp = f"I searched our catalog for '{query_str}', but no matching active products were found. Try checking our full catalog on the Products page!"
                else:
                    lines = []
                    for p in products:
                        stock_str = f"✅ In Stock ({p['stock']} units)" if p['in_stock'] else "❌ Out of Stock"
                        lines.append(f"• **{p['name']}** — ₹{p['price']:,.2f} ({stock_str})")
                    resp = "🔍 **Catalog Search Results:**\n\n" + "\n".join(lines) + "\n\nWould you like to add any of these to your cart?"
                return {"response": resp, "tools_used": tools_used, "metadata": metadata}

            # Greeting default
            first_name = user.name.split()[0] if user.name else "there"
            resp = (
                f"Hello {first_name}! 👋 I am your **ShopAI Customer Support Agent**.\n\n"
                f"I can help you directly with:\n"
                f"• **Order Tracking**: Ask *'Where is order #1?'* or *'Check my orders'*\n"
                f"• **Product Stock & Pricing**: Ask *'Do you have Sony headphones?'* or *'Check keyboard price'*\n"
                f"• **Store Policies**: Ask about our *shipping, return, refund, or warranty policies*\n\n"
                f"How may I assist you today?"
            )
            return {"response": resp, "tools_used": ["tool_assistant_greeting"], "metadata": metadata}

        workflow = StateGraph(AgentGraphState)
        workflow.add_node("plan", plan_step)
        workflow.add_node("execute", execute_step)
        workflow.add_edge(START, "plan")
        workflow.add_edge("plan", "execute")
        workflow.add_edge("execute", END)
        return workflow.compile()

    @classmethod
    def process_message(
        cls,
        db: Session,
        user: User,
        message: str,
    ) -> ChatMessageResponse:
        """
        Processes customer message through the compiled LangGraph workflow
        and executes genuine LangChain Tools for PostgreSQL lookups.
        """
        graph = cls._build_agent_graph(db, user)
        initial_state: AgentGraphState = {
            "message": message.strip(),
            "user_id": user.id,
            "user_name": user.name,
            "user_role": user.role,
            "intent": None,
            "intent_arg": None,
            "tools_used": [],
            "metadata": {},
            "response": None,
        }

        final_state = graph.invoke(initial_state)
        return ChatMessageResponse(
            response=final_state.get("response") or "I could not process your request.",
            tools_used=final_state.get("tools_used") or [],
            metadata=final_state.get("metadata") or {},
        )
