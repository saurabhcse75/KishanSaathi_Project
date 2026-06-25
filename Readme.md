# 🌾 KishanSaathi - Agricultural Produce Pooling & Aggregation Platform

Welcome to **KishanSaathi**, a comprehensive, role-based platform designed to empower farmers through collective produce aggregation (pooling) and connect them seamlessly with potential buyers.

```
┌─────────────────────────────────────────────────────────────┐
│                   KISHAN SAATHI PLATFORM                    │
│                                                             │
│  👨‍🌾 Farmers: Create pools, aggregate stock, lock & sell     │
│  🛒 Buyers: Discover pools, view available stock, order     │
│  🛡️ System: Role-Based Access, Secure Transactions, JWT     │
│                                                             │
│  Status: BETA READY ✨ | Full Documentation Available       │
└─────────────────────────────────────────────────────────────┘
```

---

## 📑 Quick Navigation & Documentation Index

KishanSaathi features an extensive suite of manuals, design documents, and developer guides.

👉 **Master Documentation Index:** [DOCUMENTATION_INDEX.md](./DOCUMENTATION_INDEX.md)

### 📌 Essential Quick Links
* **[QUICK_START.md](./QUICK_START.md)** — Fast setup guide & step-by-step user workflows (10 min read).
* **[PROJECT_FLOW.md](./PROJECT_FLOW.md)** — Core user journeys, platform workflows, and lifecycle state transitions.
* **[DEVELOPER_REFERENCE.md](./DEVELOPER_REFERENCE.md)** — Quick lookup for environment setup, architecture, and common tasks.
* **[Database.md](./Database.md)** — Complete database relational schema, ER diagrams, foreign keys, and constraints.
* **[Api.md](./Api.md)** — Comprehensive API endpoint specifications, payloads, and response codes.
* **[Dataflow.md](./Dataflow.md)** — Mermaid sequence and flowcharts tracing transaction, location, and auth flows.
* **[TESTING_GUIDE.md](./TESTING_GUIDE.md)** — 28 detailed manual test cases covering all platform features.
* **[SECURITY_CHECKLIST.md](./SECURITY_CHECKLIST.md)** — Security architecture, validation rules, and pre-deployment hardening.
* **[INTERVIEW_QNA.md](./INTERVIEW_QNA.md)** & **[ADVANCED_SYSTEM_DESIGN_QNA.md](./ADVANCED_SYSTEM_DESIGN_QNA.md)** — 200+ detailed Q&As for technical deep dives, system design, scaling, and concurrency.

---

## 🔑 Core Domain & Key Concepts

KishanSaathi solves the agricultural logistics problem by enabling smallholder farmers to pool their harvests together to meet bulk buyer requirements.

### Pool Status Lifecycle
```
┌─────────────────────────────────────┐
│         OPEN (Collection)           │
│  - Farmers see: Target, Current, Rem│
│  - Farmers can: Join, See contrib   │
│  - Buyers: Cannot see               │
└──────────────┬──────────────────────┘
               │ Owner locks pool (or Auto-lock at target)
┌──────────────▼──────────────────────┐
│      LOCKED (Selling Starts)        │
│  - Farmers see: Only available stock│
│  - Farmers can: Accept/Reject orders│
│  - Buyers: Can place orders         │
└──────────────┬──────────────────────┘
               │ Based on active sales & fulfillment
        ┌──────┴─────────┐
        │                │
   ┌────▼───┐      ┌─────▼───┐
   │ SELLING│      │  SOLD   │
   │ (active│      │ (closed)│
   │  sales)│      │         │
   └────────┘      └─────────┘
```

### Information Visibility Rules

| Information | OPEN Phase | LOCKED / SELLING Phase |
| :--- | :---: | :---: |
| **Target Qty** | Farmer ✅ | ❌ |
| **Current Qty** | Farmer ✅ | Farmer ✅ |
| **Remaining** | Farmer ✅ | ❌ |
| **Available Stock**| ❌ | Buyer ✅ |
| **Contributors** | Farmer ✅ | ❌ |
| **Price** | Farmer ✅ | Buyer ✅ |

---

## 🌟 Key Features

### 👨‍🌾 Farmer Module (100% Complete ✅)
- **Pool Creation & Management:** Create produce pools with specific target quantities, prices, and pickup locations.
- **Collaborative Pooling:** Fellow farmers can join open pools to contribute their produce toward the target.
- **Auto-Lock / Manual Lock:** Pools automatically lock when target quantities are met, or owners can lock them manually to initiate selling.
- **Order Management:** Review, accept, or reject incoming orders from buyers.
- **Contribution Tracking:** Real-time visibility into fellow farmer contributions and remaining pool targets.

### 🛒 Buyer Module (100% Complete ✅)
- **Marketplace Discovery:** Discover nearby locked/selling pools with available stock.
- **Advanced Search & Filtering:** Filter pools by crop, price, and location.
- **Order Placement:** Place orders against available stock with atomic inventory verification.
- **Order Tracking:** Monitor order approval status and view seller contact details upon confirmation.

### ⚙️ Backend & Security (100% Complete ✅)
- **Role-Based Access Control (RBAC):** Strict JWT-based authentication preventing cross-role authorization bypasses.
- **Transaction Safety:** ACID-compliant MySQL transactions preventing race conditions and overselling during order placement.
- **Data Validation:** Robust input validation and request size limiting across all routes.
- **Robust Error Handling:** Consistent API error response structures and status codes.

---

## 🚀 Getting Started & Local Setup

### 1. Prerequisites
- Node.js (v18+ recommended)
- MySQL Server (v8.0+)

### 2. Database Configuration
Create a MySQL database and configure your `.env` file in the `backend` directory:
```env
PORT=5000
DB_HOST=localhost
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=kishansaathi
JWT_SECRET=your_jwt_secret_key
```
*(Refer to [Database.md](./Database.md) for table schemas and setup instructions).*

### 3. Running the Application

Open two terminals to start the backend server and frontend development application concurrently:

```bash
# Terminal 1: Backend Server
cd backend
npm install
npm start
```

```bash
# Terminal 2: Frontend Application
cd frontend
npm install
npm run dev
```

### 4. Verification & Testing
- Visit `http://localhost:5173` (or the port specified by Vite).
- Register a test Farmer account and create a pool.
- Register a test Buyer account, discover the pool (once locked), and place an order.
- For complete end-to-end testing instructions, refer to the [TESTING_GUIDE.md](./TESTING_GUIDE.md).

---

## 🗂️ Project Structure

```
KishanSaathi/
├── backend/                  # Express.js REST API Server
│   ├── config/               # Database & environment configurations (db.js)
│   ├── controllers/          # Business logic (authController, poolController, orderController)
│   ├── middleware/           # Authentication & validation middleware (authMiddleware)
│   ├── models/               # Database models & wrapper queries (userModel, poolModel, orderModel)
│   ├── routes/               # API route definitions (authRoutes, poolRoutes, orderRoutes)
│   ├── package.json          # Backend dependencies
│   └── server.js             # Express application entry point
│
├── frontend/                 # React + Vite Single Page Application (SPA)
│   ├── src/
│   │   ├── components/       # Reusable UI components (PoolCard, BuyerPoolCard, Layout, Section)
│   │   ├── context/          # Global state & AuthContext
│   │   ├── pages/            # View pages grouped by feature/role
│   │   │   ├── auth/         # Login, Register
│   │   │   ├── buyer/        # Buyer Dashboard, NearbyPoolsBuyer, MyOrders
│   │   │   └── farmer/       # Farmer Dashboard, CreatePool, MyPools, NearbyPools, PoolDetails
│   │   ├── routes/           # AppRoutes and ProtectedRoute wrappers
│   │   ├── services/         # API integration & validation helpers (api.js, authService, validation)
│   │   ├── App.jsx           # Root component
│   │   ├── main.jsx          # DOM entry point
│   │   └── index.css         # Global styling & Tailwind directives
│   └── package.json          # Frontend dependencies
│
└── *.md                      # Comprehensive project documentation manuals (Root Directory)
```

---

## 🎓 Technology Stack

* **Backend Environment:** Node.js, Express.js
* **Frontend Architecture:** React.js, Vite, React Router
* **Database Management:** MySQL (via `mysql2` wrapper)
* **Authentication:** JSON Web Tokens (JWT), `bcrypt` password hashing
* **Styling & UI:** Tailwind CSS, Custom Glassmorphism / Modern CSS aesthetics
* **API Communication:** Axios / Native Fetch API services

---

## 📊 Current Status & Quality Metrics

Following a comprehensive quality audit and bug fix session, KishanSaathi is operating at high stability and is completely ready for Beta Staging and User Acceptance Testing (UAT).

* **Bug Fix Coverage:** 9 major and minor issues resolved across controllers, models, and middleware.
* **Testing Coverage:** 28 fully documented manual test scenarios ([TESTING_GUIDE.md](./TESTING_GUIDE.md)).
* **Documentation Status:** 16 extensive manuals detailing design, security, databases, APIs, and Q&A preparation.
* **Deployment Status:** ✅ **BETA READY**

---

## 🤝 Need Help or Troubleshooting?

If you encounter any issues during development, testing, or deployment, consult the following dedicated resources:

| Goal / Query | Target Document |
| :--- | :--- |
| **Complete Platform Workflows & API Flows** | [PROJECT_FLOW.md](./PROJECT_FLOW.md) |
| **Developer Troubleshooting & Quick Reference**| [DEVELOPER_REFERENCE.md](./DEVELOPER_REFERENCE.md) |
| **Database Schema, FKs, and Migrations** | [Database.md](./Database.md) |
| **API Endpoints, Headers, and Responses** | [Api.md](./Api.md) |
| **Security Auditing & Production Hardening** | [SECURITY_CHECKLIST.md](./SECURITY_CHECKLIST.md) |
| **System Design & Architecture Deep Dives** | [SYSTEM_DESIGN.md](./SYSTEM_DESIGN.md) |
| **Full Summary of Applied Bug Fixes** | [BUG_FIXES_SUMMARY.md](./BUG_FIXES_SUMMARY.md) |
| **Project Master Documentation Index** | [DOCUMENTATION_INDEX.md](./DOCUMENTATION_INDEX.md) |

---

**Version:** 1.0.0-beta  
**Status:** ✅ COMPLETE & STAGING-READY  
**Happy Coding! 🚀**
