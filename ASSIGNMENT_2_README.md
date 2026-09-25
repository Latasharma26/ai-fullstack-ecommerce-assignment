# ShopAI — Mini AI E-Commerce Application (Assignment 2)

> **Production-oriented AI Full Stack E-Commerce Application** built for the AI Full Stack Developer Technical Interview.
>
> **Architecture Flow:**
> `React 19 UI` → `FastAPI 0.141` → `PostgreSQL 18` → `Google OAuth / JWT Auth` → `RBAC` → `Atomic Business Logic` → `Stripe Payments` → `AI Support Agent`

---

## 🏗️ System Architecture & Data Flow

```text
┌────────────────────────────────────────────────────────┐
│                   React 19 Frontend                    │
│      TypeScript · Vite · Tailwind CSS · React Router   │
└───────────────────────────┬────────────────────────────┘
                            │ HTTP (REST + JWT Bearer)
                            ▼
┌────────────────────────────────────────────────────────┐
│                   FastAPI Backend                      │
│     Pydantic · Dependency Injection · RBAC Security    │
└──────┬─────────────┬─────────────┬─────────────┬───────┘
       │             │             │             │
       ▼             ▼             ▼             ▼
┌──────────────┐┌──────────────┐┌──────────────┐┌──────────────┐
│  PostgreSQL  ││  Auth & RBAC ││    Stripe    ││   AI Agent   │
│  SQLAlchemy  ││  Google ID   ││  Checkout &  ││  LangChain / │
│   Alembic    ││  Signed JWT  ││   Webhooks   ││ Tool Calling │
└──────────────┘└──────────────┘└──────────────┘└──────────────┘
```

---

## 🛠️ Technology Stack

| Layer | Technologies | Purpose |
|---|---|---|
| **Frontend** | React 19, TypeScript, Vite, Tailwind CSS, Lucide Icons | Responsive UI, state management, animated carts & chat |
| **Backend** | Python 3.14, FastAPI, Pydantic v2, Starlette | High-performance async REST API with type validation |
| **Database** | PostgreSQL 18, SQLAlchemy 2.0 (ORM), Alembic, psycopg v3 | Relational schema, ACID transactions, stock consistency |
| **Authentication** | Google OAuth 2.0, Signed JWT (HS256), Role-Based Access Control | Secure session tokens, Customer vs Admin roles |
| **Payments** | Stripe Test Mode, Stripe Checkout Sessions, Webhooks | Payment processing, automatic order confirmation |
| **AI Agent** | OpenAI API / LangChain / Tool Calling Architecture | Real-time customer support querying PostgreSQL tools |

---

## 📦 Implemented Phases & Features

### 1. Database Schema & Models (`backend/app/models/`)
- **`User`**: `id`, `google_id`, `name`, `email`, `role` (`CUSTOMER` / `ADMIN`), `created_at`, `updated_at`.
- **`Product`**: `id`, `name`, `description`, `price`, `stock`, `image_url`, `is_active`, `created_at`, `updated_at`.
- **`Order`**: `id`, `user_id`, `total_amount`, `status` (`PENDING`, `CONFIRMED`, `SHIPPED`, `DELIVERED`, `CANCELLED`), `payment_status` (`PENDING`, `PAID`, `FAILED`), `stripe_session_id`, `created_at`, `updated_at`.
- **`OrderItem`**: `id`, `order_id`, `product_id`, `quantity`, `price` (historical purchase snapshot).
- **Alembic Migrations**: Fully version-controlled migration `6d8f5d214a21`.
- **Seeded Catalog**: 9 electronic and accessory products pre-loaded with realistic stock.

### 2. Cart Management & Orders API (`Phase 3`)
- **Frontend CartContext**:
  - Add to cart with live inventory stock validation.
  - Increment/decrement quantity with hard upper-limit clamping.
  - Automatic subtotal and cart total calculation.
  - LocalStorage persistence surviving page refreshes.
- **Backend OrderService (`backend/app/services/order_service.py`)**:
  - **Source of Truth**: The backend recalculates item prices and order totals from PostgreSQL. Never trusts frontend prices!
  - **Atomic DB Transaction**: Stock deduction and order item creation execute in a single ACID commit.
  - **Error Handling**: `404` for missing products, `400` for insufficient inventory, `422` for invalid quantities, `403` for cross-user order access.

### 3. Google OAuth, JWT & RBAC (`Phase 4`)
- **JWT Security (`app/core/security.py`)**:
  - Secure signed tokens using HMAC-SHA256 (`HS256`).
- **Endpoints (`app/api/auth.py`)**:
  - `POST /api/v1/auth/google`: Verifies Google ID tokens and creates or logs in users.
  - `POST /api/v1/auth/demo-login`: 1-click login for interviewers (`customer@shopai.com`, `admin@shopai.com`).
  - `GET /api/v1/auth/me`: Retrieves authenticated user profile and permissions.
- **RBAC Dependencies (`app/dependencies/auth.py`)**:
  - `get_current_user`: Validates `Authorization: Bearer <JWT>` with graceful testing fallback.
  - `require_admin`: Strictly blocks non-admin users with `403 Forbidden`.
- **Frontend Protected Routes (`frontend/src/components/ProtectedRoute.tsx`)**:
  - Automatically redirects unauthorized users attempting to access `/admin/*`.

### 4. Stripe Payment Integration (`Phase 5`)
- **Endpoints (`app/api/payments.py`)**:
  - `POST /api/v1/payments/create-checkout-session`: Generates Stripe Checkout sessions for pending orders.
  - `POST /api/v1/payments/webhook`: Listens for `checkout.session.completed` events and automatically marks orders as `PAID` and `CONFIRMED`.
  - `POST /api/v1/payments/simulate/{order_id}`: Dedicated interview simulation endpoint allowing reviewers to verify payment workflows without needing external ngrok/Stripe CLI tunnels.
- **Frontend Flow**:
  - Live payment status badges (`PENDING`, `PAID`, `FAILED`).
  - Interactive "Pay with Stripe" and "Instant Test Pay" triggers.

### 5. AI Customer Support Agent (`Phase 6`)
- **Architecture (`app/services/ai_agent_service.py`)**:
  - Implemented using **LangGraph (`StateGraph`)** and official **LangChain Tool Calling (`@tool`)**:
    1. `check_order_tool(order_id)`: Fetches live order status, line items, and payment state from PostgreSQL (enforces customer IDOR protection).
    2. `search_products_tool(query)`: Queries active products, live prices, and available stock units from PostgreSQL.
    3. `get_policy_tool(topic)`: Returns store shipping, return, refund, and warranty policies.
  - Dual Mode: Operates via LangGraph state workflow with dynamic OpenAI execution when an API key is present, and deterministic tool-calling state resolution for local testing and offline reviewer evaluation.
- **Frontend Chat Widget (`/ai-support`)**:
  - Real-time conversation history.
  - Visible tool invocation badges (e.g. `tools: tool_check_order`).
  - One-click suggestion chips for common customer questions.

### 6. Admin Control Center (`Phase 7`)
- **Endpoints (`app/api/admin.py`)**:
  - `GET /api/v1/admin/stats`: KPI metrics (Total Revenue, Total Orders, Paid Orders, Catalog Health).
  - `GET /api/v1/admin/orders`: List of all customer orders across the platform.
  - `PATCH /api/v1/admin/orders/{id}/status`: Live order status updater (`SHIPPED`, `DELIVERED`, etc.).
- **Frontend Admin Pages (`/admin`, `/admin/orders`, `/admin/products`)**:
  - Visual KPI cards with Indian Rupee formatting.
  - Interactive status dropdowns with instant PostgreSQL updates.
  - Product catalog CRUD: add new products, adjust inventory, toggle active/inactive status.

---

## 🚀 Quick Start Guide

### Prerequisites
- Python 3.11+
- Node.js 18+
- PostgreSQL 14+

### 1. Database Setup
```bash
# PostgreSQL should be running on port 5433 (or 5432 configured in backend/.env)
# The database name is: shopai_db
```

### 2. Backend Setup
```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows: venv\Scripts\activate, Linux/macOS: source venv/bin/activate
pip install -r requirements.txt

# Run migrations & seed data
alembic upgrade head
python seed.py

# Start FastAPI server
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
API Documentation will be live at: `http://127.0.0.1:8000/docs`

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:5174` (or `http://localhost:5173`) in your browser.

---

## 🧪 Automated Test Suite Execution

We provide a comprehensive, automated test runner covering all backend integration flows:

```bash
python backend/tests/run_all_tests.py
```

### Test Coverage Summary:
- ✅ **Auth & RBAC**: Demo customer login, demo admin login, `/me` profile check, invalid token rejection (401).
- ✅ **Orders API**: Atomic creation, backend price calculation, stock deduction, insufficient stock rejection (400), cross-user access block (403).
- ✅ **Payments**: Stripe session creation, webhook processing, test payment simulation, double-payment rejection.
- ✅ **AI Agent**: Greeting intent, `tool_check_order`, `tool_search_products`, `tool_get_policy`.
- ✅ **Admin Dashboard**: RBAC customer blocking (403), revenue/order KPI calculation, live status updates.
- ✅ **Frontend Build**: Zero TypeScript errors, 100% clean production bundle (`npm run build`).

---

## 🔑 Interview Demo Accounts

For instant reviewer evaluation, the application includes pre-configured demo credentials on the Login page:

| Role | Email | Permissions |
|---|---|---|
| **Customer** | `customer@shopai.com` | Browse products, manage cart, place orders, pay via Stripe, chat with AI |
| **Administrator** | `admin@shopai.com` | Access `/admin`, view store revenue KPIs, modify order statuses, edit catalog |

---

## ⏱️ Total Development Time Breakdown

The project was constructed across structured, iterative phases with real-time test verification:

| Development Phase | Focus & Deliverables | Approx. Time |
|---|---|:---:|
| **Phase 1: Architecture & Setup** | FastAPI project scaffolding, React + TypeScript Vite initialization, Docker & environment configuration | ~30 mins |
| **Phase 2: Database Schema & Seeds** | SQLAlchemy 2.0 models (`User`, `Product`, `Order`, `OrderItem`), Alembic versioned migration, 9 seeded products | ~35 mins |
| **Phase 3: Cart Management & Orders API** | React `CartContext`, local storage persistence, atomic PostgreSQL transactions, stock deduction & price recalculation | ~45 mins |
| **Phase 4: Google Auth & RBAC** | Google Identity Services SDK, JWT signing (`HS256`), role guards, protected routes, customer vs admin isolation | ~40 mins |
| **Phase 5: Stripe Payment Integration** | Stripe Checkout Session creation, webhook processing (`Stripe-Signature`), cancelled/failed payment UI, offline simulation | ~40 mins |
| **Phase 6: AI Support Agent** | LangGraph (`StateGraph`) + LangChain (`@tool`), PostgreSQL database tools (pricing, stock, order lookup, policies) | ~45 mins |
| **Phase 7: Admin Control Center** | Admin KPI dashboards, cross-platform order inspection, live status transitions (`SHIPPED`, `DELIVERED`) | ~30 mins |
| **Phase 8: Security Audit & Hardening** | 11-point security audit, IDOR protection, production gating, secret bit-length hardening, token validation | ~45 mins |
| **Phase 9: Documentation & System Design** | One-page `SYSTEM_DESIGN.md`, AWS scaling strategy, API docs, requirements compliance verification | ~30 mins |
| **Total AI-Assisted Time** | **Complete end-to-end implementation with verified test suites** | **~5.5 Hours** |
| *Estimated Manual Equivalent* | *Building identical frontend, backend, ORM, Stripe webhooks, RBAC, and AI tools manually* | *35 – 45 Hours* |

---

## 🤖 AI Tools & Development Methodology

### 1. AI Tools Utilized
- **Google Antigravity & Gemini 3.8 Flash (High)**: Primary autonomous coding agent for architecture planning, full-stack implementation, dependency management, and refactoring.
- **Cursor / Claude Code**: Master prompt design and structured prompt decomposition for phase-by-phase execution.
- **PostgreSQL & Python Diagnostics**: Real-time terminal inspection, AST linting, and automated test runners.

### 2. How AI Was Leveraged Throughout Development
1. **Phase-Driven Iteration**: Rather than generating an unmaintainable monolithic code dump, the development was divided into 9 modular, verifiable phases (DB → APIs → Frontend → Auth → Payments → AI Agent → Admin → Security → Docs).
2. **Automated Integration & Security Test Suites**: AI wrote comprehensive, real-world test scripts executing against live endpoints (`backend/tests/run_all_tests.py`), covering authentication edge cases, stock race conditions, IDOR attacks, and Stripe webhook signatures.
3. **Rigorous Security Auditing**: Employed AI to perform static analysis and dynamic penetration testing across JWT validation, unauthenticated fallbacks, parameter tampering, and environment gating.
4. **Human Verification & Validation**: Every generated file, model, schema, and API route was actively compiled, tested with live database connections, and validated before advancing to the next phase.

---

Developed with ❤️ using **React**, **FastAPI**, **PostgreSQL**, **Stripe**, **LangChain**, and **LangGraph**.

