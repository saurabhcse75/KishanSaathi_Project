# KishanSaathi - Quick Start Guide

## 🚀 Getting Started

### Prerequisites
- Node.js installed
- MySQL database running
- .env file configured with DB credentials

---

## 📦 Installation & Setup

### 1. Backend Setup
```bash
cd backend
npm install
npm start
```
Server runs on: `http://localhost:5000`

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Frontend runs on: `http://localhost:5173`

---

## 👤 User Registration

### Farmer Account
1. Go to Register page
2. Enter name, mobile, password
3. Select role: **Farmer**
4. Click Register
5. Redirected to Farmer Dashboard

### Buyer Account
1. Go to Register page
2. Enter name, mobile, password
3. Select role: **Buyer**
4. Click Register
5. Redirected to Buyer Dashboard

---

## 🌾 FARMER WORKFLOW - Step by Step

### Step 1: Create a Pool
1. Go to **Dashboard** → **Create Pool**
2. Fill pool details:
   - **Crop Name:** e.g., "Wheat"
   - **Target Quantity:** 1000 kg
   - **Initial Quantity:** 200 kg (your contribution)
   - **Price:** ₹50 per kg
   - **Location:** Click "Get Location" button
   - **Pickup Location:** Address details
3. Click **Create Pool**
4. Pool created with OPEN status

### Step 2: View Your Pool
1. Go to **My Pools**
2. See your pool under "Created Pools"
3. Shows: Target, Current, Remaining, Progress %
4. Click pool to see details and contributors

### Step 3: Join Another Pool (Optional)
1. Go to **Nearby Pools**
2. Browse OPEN pools nearby
3. Enter quantity to contribute
4. Click **Join Pool**
5. You're now a contributor

### Step 4: Lock Your Pool
1. Go to **My Pools** → Click on your pool
2. Click **🔒 Lock Pool & Start Selling** button
3. Status changes to LOCKED
4. Pool now visible to buyers!

### Step 5: Manage Buyer Orders
1. Pool Details page shows **Buyer Orders** section
2. View pending orders from buyers
3. Click **✅ Accept** to confirm order
4. Click **❌ Reject** to decline order
5. See accepted/rejected order history

---

## 💰 BUYER WORKFLOW - Step by Step

### Step 1: Browse Pools
1. Go to **Dashboard** → **Explore Nearby Pools**
2. Requires location access (click allow)
3. Browse LOCKED pools within 50km
4. See only: Crop name, Available Stock, Price, Distance

### Step 2: Place Order
1. Select a pool
2. Enter quantity to buy (in kg)
3. Click **Request Order**
4. Order placed with PENDING status

### Step 3: Track Orders
1. Go to **My Orders**
2. See all your orders
3. Check status:
   - **PENDING** (yellow) - Waiting for farmer approval
   - **ACCEPTED** (green) - Order confirmed!
   - **REJECTED** (red) - Order declined

---

## 🎯 Key Differences: OPEN vs LOCKED Status

### OPEN Status (Collection Phase)
**Farmer sees:**
- ✅ Target Quantity (goal)
- ✅ Current Quantity (collected)
- ✅ Remaining (need to collect)
- ✅ Progress percentage
- ✅ Contributors list

**Farmers can:** Join other pools, See who's contributing

---

### LOCKED Status (Selling Phase)
**Farmer sees:**
- ✅ Available Stock (current only)
- ✅ Sold Quantity
- ✅ Remaining to Sell
- ✅ Buyer Orders
- ❌ NOT: Target quantity, collection info

**Farmer can:** Accept/Reject orders, Track sales

**Buyers see:** Available Stock, Price, Distance (nothing else!)

---

## 📍 Location Features

### Enable Location Access
- Browser will ask for location permission
- Required for finding nearby pools
- Shows latitude & longitude
- Calculates distance in km

### Search Radius
- Default: 50 km
- Shows all pools within radius
- Sorted by distance (closest first)

---

## 🔄 Complete Transaction Example

### Farmer A Creates Pool
```
Crop: Wheat
Target: 1000 kg
Initial: 200 kg
Price: ₹50/kg
Status: OPEN ← Currently visible to other farmers
```

### Farmer B Joins Pool
```
Farmer B contributes: 300 kg
Pool Current: 200 + 300 = 500 kg
Remaining: 1000 - 500 = 500 kg
```

### Farmer A Locks Pool
```
Status: OPEN → LOCKED
Pool now visible to buyers
```

### Buyer Places Order
```
Order 1: 200 kg
Order 2: 150 kg
Order 3: 100 kg
Total Ordered: 450 kg (within 500 available)
```

### Farmer A Manages Orders
```
Accept Order 1 (200 kg)    → Accepted
Accept Order 2 (150 kg)    → Accepted
Reject Order 3 (100 kg)    → Rejected (can't accept all)
```

### Final State
```
Available: 500 kg
Sold: 350 kg (Order 1 + Order 2)
Remaining: 150 kg
Status: SELLING (because sold > 0 & remaining > 0)
```

---

## ⚠️ Important Rules

### Farmer Rules
- ✅ Only you can lock YOUR pool
- ✅ Only you can accept/reject orders for YOUR pool
- ✅ You can join ANY open pool
- ✅ You can see quantities while OPEN, only stock while LOCKED
- ❌ Cannot join pool after it's locked
- ❌ Cannot join your own pool

### Buyer Rules
- ✅ Can only see LOCKED pools
- ✅ Can only place orders on available stock
- ✅ Can view your order status
- ✅ Can browse multiple pools
- ❌ Cannot see target quantity or collection details
- ❌ Cannot accept/reject orders
- ❌ Cannot create or join pools

---

## 🆘 Troubleshooting

### "Location access denied"
- Check browser permissions
- Allow location access in settings
- Try refreshing page

### "No pools found nearby"
- Ensure at least one open pool exists
- Check search radius (50km default)
- All pools may already be locked

### "Order validation failed"
- Verify quantity > 0
- Verify quantity ≤ available stock
- Check pool status is LOCKED

### "Cannot lock pool"
- Pool must have quantity > 0
- Must be pool owner
- Pool must be in OPEN status

---

## 📊 Dashboard Navigation

### Farmer Dashboard
```
├─ Create Pool      → Create new pool
├─ Nearby Pools     → Join other farmers' pools
├─ My Pools         → View your created & joined pools
└─ Pool Details     → Manage individual pools
```

### Buyer Dashboard
```
├─ Explore Nearby   → Browse and order from pools
└─ My Orders        → Track all your orders
```

---

## 🔐 Account & Security

### Password
- Secure password required
- Used for login verification
- Never shared in responses

### Role-Based Access
- Farmer routes blocked for buyers
- Buyer routes blocked for farmers
- Authentication required for all features

### Ownership Validation
- Only pool owner can lock
- Only pool owner can manage orders
- Other farmers cannot access owner features

---

## 📞 Support

For detailed documentation, see:
- `PROJECT_FLOW.md` - Complete project workflow
- `IMPLEMENTATION_SUMMARY.md` - Feature details

---

## ✅ Checklist for First Use

Farmer User:
- [ ] Register as Farmer
- [ ] Create a test pool
- [ ] Enable location access
- [ ] See pool in "My Pools"
- [ ] Lock the pool
- [ ] See pool details with lock status

Buyer User:
- [ ] Register as Buyer
- [ ] Enable location access
- [ ] Browse nearby locked pools
- [ ] Place a test order
- [ ] Check order in "My Orders"
- [ ] See PENDING status

---

**Happy Trading! 🌾💰**

For issues or questions, refer to the full documentation files.
