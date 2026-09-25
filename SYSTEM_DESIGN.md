# System Design & Scaling Strategy — ShopAI (Assignment 2)

> **One-Page Production Architecture & Scaling Blueprint**  
> Technical interview reference for **ShopAI — Mini AI E-Commerce Application**.

---

## 1. High-Level System Architecture

```text
                               ┌────────────────────────────────┐
                               │   React 19 + TypeScript + Vite │
                               │   Tailwind CSS · Lucide Icons  │
                               └───────────────┬────────────────┘
                                               │
                                      HTTPS / REST (JSON)
                                   Authorization: Bearer <JWT>
                                               │
                                               ▼
                               ┌────────────────────────────────┐
                               │      FastAPI REST Gateway      │
                               │  Async ASGI · Pydantic Schemas │
                               │  FastAPI Dependency RBAC Layer │
                               └───────┬──────────────┬─────────┘
                                       │              │
                   ┌───────────────────┼──────────────┼───────────────────┐
                   │                   │              │                   │
                   ▼                   ▼              ▼                   ▼
        ┌──────────────────┐  ┌────────────────┐┌──────────────┐ ┌────────────────┐
        │  PostgreSQL 18   │  │   Auth & RBAC  ││    Stripe    │ │    AI Agent    │
        │  SQLAlchemy 2.0  │  │ Google Identity││ Test Checkout│ │   LangGraph    │
        │  Alembic Schema  │  │  HMAC-SHA256   ││ Cryptographic│ │LangChain Tools │
        │ ACID Transactions│  │  Signed JWT    ││   Webhooks   │ │   PostgreSQL   │
        └──────────────────┘  └────────────────┘└──────────────┘ └────────────────┘
```

---

## 2. Core Request & Data Workflows

### Flow A: Frontend → FastAPI → Database (Standard E-Commerce Transactions)
1. **Catalog Browsing (`GET /api/v1/products`)**:
   - The React frontend requests active products.
   - FastAPI queries PostgreSQL via SQLAlchemy session using indexed `is_active` filters.
   - Returned models are serialized with Pydantic v2 schemas and formatted in INR.
2. **Atomic Order Placement (`POST /api/v1/orders`)**:
   - The frontend submits cart items (`product_id` and `quantity`).
   - `OrderService.create_order` opens an ACID database transaction.
   - Prices submitted by the client are discarded; unit prices and active statuses are queried directly from PostgreSQL.
   - Available stock is checked. If sufficient, the backend computes total amounts server-side, decreases inventory stock, inserts `Order` and `OrderItem` records, and commits atomically.
3. **Stripe Payments & Cryptographic Confirmation (`POST /payments/webhook`)**:
   - Customer initiates payment; backend calls Stripe's Checkout API creating a hosted session.
   - Upon payment completion, Stripe issues a signed webhook event (`checkout.session.completed`).
   - FastAPI verifies the cryptographic `Stripe-Signature` using `STRIPE_WEBHOOK_SECRET`.
   - The order's `payment_status` is transitioned to `PAID` and `status` to `CONFIRMED`.

---

### Flow B: Frontend → FastAPI → AI Support Agent → Tools → Database
```text
User Message ("Where is my order #1?")
   │
   ▼
FastAPI `/api/v1/ai/chat` (Requires valid Bearer JWT)
   │
   ▼
LangGraph Workflow (`StateGraph`)
   │
   ├─► Node 1: Intent & Reasoning (`plan_step`)
   │     Identifies target entity (Order ID, product search, store policy)
   │
   ├─► Node 2: LangChain Tool Execution (`execute_step`)
   │     Invokes official LangChain `@tool` instance:
   │     • `tool_check_order(order_id)` ──► SQL Query on `orders` (IDOR verified)
   │     • `tool_search_products(query)` ─► SQL Query on `products` (Price & Stock)
   │     • `tool_get_policy(topic)` ──────► Store knowledge base lookup
   │
   └─► Node 3: Synthesized Output
         Returns structured JSON with response text and `tools_used` telemetry.
```

- **Zero Hallucination Guarantee**: The LLM is strictly prohibited from inventing prices, stock, or order states. All facts originate from PostgreSQL tool results.
- **Privacy Enforcement**: Customer inquiries for foreign order IDs trigger a database-level authorization check (`order.user_id == current_user.id`), returning an explicit ownership error rather than leaking customer data.

---

## 3. Production Scaling Strategy

### A. Backend Compute Scaling
* **Stateless API Tier**: FastAPI endpoints authenticate via self-contained HMAC-SHA256 JWTs without requiring server-side session memory.
* **Horizontal Replication**: Deploy multiple containerized FastAPI instances across an AWS Application Load Balancer (ALB) or ECS Fargate cluster with CPU/memory auto-scaling.
* **Async ASGI Workers**: Utilize Uvicorn running under Gunicorn process management (`gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker`) to saturate multi-core hardware.

### B. Database Tier & Connection Pooling
* **Managed Database**: Amazon RDS for PostgreSQL with automated Multi-AZ failover and point-in-time recovery.
* **Connection Pooling**: Deploy **PgBouncer** or utilize SQLAlchemy's `QueuePool` with bounded pool sizes (`pool_size=20`, `max_overflow=10`) to protect against connection exhaustion during high-concurrency bursts.
* **Read-Replica Routing**: Direct read-intensive product catalog queries (`GET /products`) to PostgreSQL read replicas while reserving the primary writer instance for checkout and admin order updates.

### C. Caching Layer (Redis)
* **Catalog Caching**: Store hot product listing payloads and category filters in Amazon ElastiCache (Redis) with short TTLs (e.g., 60 seconds) or event-driven cache invalidation triggered on product edits.
* **AI Tool Caching**: Cache idempotent read queries (such as product keyword searches and static store policies) to eliminate redundant SQL executions.

### D. Asynchronous Background Task Queue
* **Job Offloading**: Decouple heavy operations (transactional customer emails, Stripe invoice generation, push notifications) using a distributed queue (Celery or ARQ backed by Redis / AWS SQS).
* **Payment Reliability**: Webhook handlers acknowledge Stripe quickly (HTTP 200 within 2 seconds) and delegate prolonged side-effects to worker processes.

### E. AI Request Scaling & Resilience
* **Rate Limiting**: Protect the `/api/v1/ai/chat` endpoint using token-bucket rate limiting (e.g., `slowapi` or Redis token buckets) to guard against denial-of-wallet and quota exhaustion.
* **Timeout & Fallback Circuit Breaker**: If external LLM API latencies exceed 4 seconds, fail over gracefully to the local deterministic intent dispatcher.
* **Dedicated AI Service**: For high traffic, extract the LangGraph agent into an isolated microservice, allowing backend e-commerce operations to remain fast and unaffected by LLM latency.

---

## 4. Realistic Cloud Deployment Architecture (AWS)

```text
[ Route 53 DNS ]
       │
       ▼
[ CloudFront CDN ] ──► S3 Bucket (Vite React SPA Production Bundle)
       │
       ▼ (API Traffic)
[ AWS ALB (Application Load Balancer) ]
       │
       ├─► ECS Fargate Cluster (FastAPI Docker Containers)
       │         │
       │         ├─► Amazon ElastiCache (Redis Cache & Queue)
       │         │
       │         ├─► Amazon RDS PostgreSQL (Primary + Read Replica)
       │         │
       │         └─► External Integrations: Stripe API & Google OAuth 2.0
```
