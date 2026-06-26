# 🌾 KishanSaathi - Agricultural Produce Pooling & Aggregation Platform

Welcome to **KishanSaathi**, a comprehensive, role-based platform designed to empower farmers through collective produce aggregation (pooling) and connect them seamlessly with potential buyers.

```
┌─────────────────────────────────────────────────────────────┐
│                   KISHAN SAATHI PLATFORM                    │
│                                                             │
│  👨‍🌾 Farmers: Create pools, aggregate stock, lock & sell     │
│  🛒 Buyers: Discover pools, view available stock, order     │
│  🛡️ System: Role-Based Access, Secure Transactions, JWT     │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔑 Core Domain & Key Concepts

KishanSaathi solves agricultural logistics challenges by enabling smallholder farmers to pool their harvests together to meet bulk buyer requirements efficiently.

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

### 👨‍🌾 Farmer Module
- **Pool Creation & Management:** Create produce pools with specific target quantities, prices, and pickup locations.
- **Collaborative Pooling:** Fellow farmers can join open pools to contribute their produce toward the target.
- **Auto-Lock / Manual Lock:** Pools automatically lock when target quantities are met, or owners can lock them manually to initiate selling.
- **Order Management:** Review, accept, or reject incoming orders from buyers.
- **Contribution Tracking:** Real-time visibility into fellow farmer contributions and remaining pool targets.

### 🛒 Buyer Module
- **Marketplace Discovery:** Discover nearby locked/selling pools with available stock.
- **Advanced Search & Filtering:** Filter pools by crop, price, and location.
- **Order Placement:** Place orders against available stock with atomic inventory verification.
- **Order Tracking:** Monitor order approval status and view seller contact details upon confirmation.

### ⚙️ Backend & Security
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
└── frontend/                 # React + Vite Single Page Application (SPA)
    ├── src/
    │   ├── components/       # Reusable UI components (PoolCard, BuyerPoolCard, Layout, Section)
    │   ├── context/          # Global state & AuthContext
    │   ├── pages/            # View pages grouped by feature/role
    │   │   ├── auth/         # Login, Register
    │   │   ├── buyer/        # Buyer Dashboard, NearbyPoolsBuyer, MyOrders
    │   │   └── farmer/       # Farmer Dashboard, CreatePool, MyPools, NearbyPools, PoolDetails
    │   ├── routes/           # AppRoutes and ProtectedRoute wrappers
    │   ├── services/         # API integration & validation helpers (api.js, authService, validation)
    │   ├── App.jsx           # Root component
    │   ├── main.jsx          # DOM entry point
    │   └── index.css         # Global styling & Tailwind directives
    └── package.json          # Frontend dependencies
```

---

## 🎓 Technology Stack

* **Backend Environment:** Node.js, Express.js
* **Frontend Architecture:** React.js, Vite, React Router
* **Database Management:** MySQL (via `mysql2` wrapper)
* **Authentication:** JSON Web Tokens (JWT), `bcrypt` password hashing
* **Styling & UI:** Tailwind CSS

---

**Version:** 1.0.0  
**Happy Coding! 🚀**
