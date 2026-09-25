import sys
import json
import urllib.request

if sys.platform.startswith("win"):
    sys.stdout.reconfigure(encoding="utf-8")

BASE_URL = "http://127.0.0.1:8000"

def run_tests():
    print("🚀 Testing AI Support Agent Endpoints...")

    # 1. Login as customer
    login_data = json.dumps({"email": "customer@shopai.com"}).encode("utf-8")
    req_auth = urllib.request.Request(
        f"{BASE_URL}/api/v1/auth/demo-login",
        data=login_data,
        headers={"Content-Type": "application/json"}
    )
    auth_res = json.loads(urllib.request.urlopen(req_auth).read().decode("utf-8"))
    token = auth_res["access_token"]
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {token}",
    }

    # 2. Greeting test
    req_greet = urllib.request.Request(
        f"{BASE_URL}/api/v1/ai/chat",
        data=json.dumps({"message": "Hello"}).encode("utf-8"),
        headers=headers,
    )
    res_greet = json.loads(urllib.request.urlopen(req_greet).read().decode("utf-8"))
    print("✅ Greeting Test:", res_greet["tools_used"])
    assert "ShopAI Customer Support" in res_greet["response"]

    # 3. Order Tracking Tool test
    req_order = urllib.request.Request(
        f"{BASE_URL}/api/v1/ai/chat",
        data=json.dumps({"message": "Where is my order #1?"}).encode("utf-8"),
        headers=headers,
    )
    res_order = json.loads(urllib.request.urlopen(req_order).read().decode("utf-8"))
    print("✅ Order Tracking Tool Test:", res_order["tools_used"])
    assert "tool_check_order" in res_order["tools_used"]
    assert "Order #1" in res_order["response"]

    # 4. Product Search Tool test
    req_prod = urllib.request.Request(
        f"{BASE_URL}/api/v1/ai/chat",
        data=json.dumps({"message": "Do you have Sony headphones in stock?"}).encode("utf-8"),
        headers=headers,
    )
    res_prod = json.loads(urllib.request.urlopen(req_prod).read().decode("utf-8"))
    print("✅ Product Search Tool Test:", res_prod["tools_used"])
    assert "tool_search_products" in res_prod["tools_used"]
    assert "Sony" in res_prod["response"]

    # 5. Store Policy Tool test
    req_policy = urllib.request.Request(
        f"{BASE_URL}/api/v1/ai/chat",
        data=json.dumps({"message": "What is your refund policy?"}).encode("utf-8"),
        headers=headers,
    )
    res_policy = json.loads(urllib.request.urlopen(req_policy).read().decode("utf-8"))
    print("✅ Policy Tool Test:", res_policy["tools_used"])
    assert "tool_get_policy" in res_policy["tools_used"]
    assert "Refunds are processed" in res_policy["response"]

    print("\n🎉 ALL AI AGENT ENDPOINT TESTS PASSED SUCCESSFULLY!")

if __name__ == "__main__":
    run_tests()
