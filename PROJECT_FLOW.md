# KishanSaathi - Project Flow & Features

## 📋 Project Overview
KishanSaathi is a platform that connects farmers and buyers through pooled agricultural trading. Farmers can create collection pools, invite other farmers to join, and then sell the aggregated produce to buyers.

---

## 🌾 FARMER WORKFLOW

### Phase 1: Pool Creation (OPEN Status)
**What Happens:**
1. Farmer creates a pool with:
   - Crop name
   - Target quantity (goal amount)
   - Initial quantity (farmer's own contribution)
   - Price per unit
   - Location (latitude/longitude)

2. Pool status automatically set to `OPEN`
3. Farmer becomes the pool owner
4. Farmer's initial quantity is recorded as a contribution

**Visibility:** Only other farmers can see OPEN pools

**Data Shown to Farmer (OPEN Phase):**
- ✅ Target Quantity
- ✅ Current Quantity (collected so far)
- ✅ Remaining Quantity (target - current)
- ✅ Progress bar showing collection percentage

---

### Phase 2: Pool Participation (OPEN Status)
**What Happens:**
1. Other farmers can see nearby OPEN pools
2. Farmers can join pools by contributing their produce
3. Each farmer specifies how much quantity they want to contribute
4. Current quantity of pool increases with each farmer's contribution
5. Pool remains OPEN until owner decides to lock it

**Frontend Pages:**
- `/nearby-pools` - Shows OPEN pools within 50km radius
- Farmer can join multiple pools

**Farmer Actions:**
- View pool details
- Contribute quantity
- See their contribution

---

### Phase 3: Pool Locking (OPEN → LOCKED)
**What Happens:**
1. Only pool **owner** can lock the pool
2. Pool lock button visible only in OPEN phase on pool details
3. When locked, status changes to `LOCKED`
4. Pool becomes visible to buyers

**Prerequisites to Lock:**
- Pool must have at least some quantity (current_quantity > 0)
- Status must be OPEN

**After Locking:**
- Pool visible to buyers for purchasing
- Farmers can no longer join
- Buyers can place orders

---

## 💰 BUYER WORKFLOW

### Phase 1: Browse Available Pools (LOCKED Status)
**What Happens:**
1. Buyer sees all LOCKED pools within 50km radius
2. Each locked pool shows:
   - ✅ Crop name
   - ✅ Current Available Quantity (not target!)
   - ✅ Price per unit
   - ✅ Distance from buyer

**Important:** Buyers can ONLY see:
- `current_quantity` (available stock)
- They CANNOT see target_quantity or remaining_quantity
- This encourages buying what's available now

**Frontend Pages:**
- `/buyer/nearby` - Browse LOCKED/SELLING pools

---

### Phase 2: Place Orders (LOCKED Status)
**What Happens:**
1. Buyer specifies quantity they want to buy
2. System validates:
   - Quantity > 0
   - Quantity ≤ current_available_quantity
3. Order created with status `PENDING`
4. Farmer (pool owner) receives the order notification

**Order Status:**
- **PENDING** - Waiting for farmer approval
- **ACCEPTED** - Farmer approved, order confirmed
- **REJECTED** - Farmer rejected the order

---

### Phase 3: Track Orders
**What Happens:**
1. Buyer can view all their orders
2. See order status (PENDING, ACCEPTED, REJECTED)
3. See crop name, quantity, price

**Frontend Pages:**
- `/buyer/orders` - My Orders

---

## 🚜 POOL OWNER (FARMER) ACTIONS

### Managing Orders (LOCKED Phase)
**Pool Owner Can:**
1. View all pending orders from buyers
2. Accept orders → Status changes to `ACCEPTED`
3. Reject orders → Status changes to `REJECTED`

**Pool Details Page Shows:**
- List of all buyer orders with buyer details
- Accept/Reject buttons for PENDING orders
- Order history (ACCEPTED/REJECTED)

**Frontend Pages:**
- `/pool/:id` - Pool details with order management

---

## 📊 STATUS TRANSITIONS

```
OPEN (Collection Phase)
  ↓ (Pool owner locks)
LOCKED (Selling Phase Starts)
  ↓ (Based on sales)
LOCKED → SELLING (if sales > 0 and remaining > 0)
LOCKED → SOLD (if all quantity sold)
```

---

## 🔒 DATA VISIBILITY RULES

### OPEN Phase - Farmer View
| Data | Visible? |
|------|----------|
| Target Quantity | ✅ Yes |
| Current Quantity | ✅ Yes |
| Remaining to Collect | ✅ Yes |
| Progress % | ✅ Yes |
| Contributors List | ✅ Yes |

### LOCKED/SELLING Phase - Farmer View
| Data | Visible? |
|------|----------|
| Target Quantity | ❌ No (not needed) |
| Current Available Quantity | ✅ Yes |
| Sold Quantity | ✅ Yes |
| Remaining to Sell | ✅ Yes |
| Buyer Orders | ✅ Yes (with accept/reject) |

### LOCKED/SELLING Phase - Buyer View
| Data | Visible? |
|------|----------|
| Available Stock | ✅ Yes |
| Price | ✅ Yes |
| Target Quantity | ❌ No |
| Remaining to Collect | ❌ No |
| Contributors | ❌ No |

---

## 📱 ROUTES & ENDPOINTS

### Farmer Routes
- `GET /pools/nearby?lat=X&lng=Y` - Nearby OPEN pools
- `POST /pools/join` - Join a pool
- `GET /pools/my` - My created & joined pools
- `GET /pools/:id` - Pool details
- `PUT /pools/:id/lock` - Lock pool
- `GET /orders/pool/:poolId` - Orders for my pool
- `PUT /orders/:id/accept` - Accept buyer order
- `PUT /orders/:id/reject` - Reject buyer order

### Buyer Routes
- `GET /pools/buyer/nearby?lat=X&lng=Y` - Nearby LOCKED pools
- `POST /orders` - Place order
- `GET /orders/my` - My orders
- `PUT /orders/:id/accept` - Accept (farmer only)
- `PUT /orders/:id/reject` - Reject (farmer only)

---

## 📍 Database Schema

### Pools Table
```
id, crop_name, target_quantity, current_quantity, price, 
latitude, longitude, pickup_location, status, created_by
```

### Contributions Table
```
id, pool_id, farmer_id, quantity
```

### Orders Table
```
id, pool_id, buyer_id, quantity, status
```

### Users Table
```
id, name, mobile, password, role (farmer/buyer)
```

---

## 🎯 KEY FEATURES IMPLEMENTED

✅ **Farmer Module:**
- Create pools with initial quantity
- Join other farmers' pools
- Lock pools to start selling
- Manage buyer orders (accept/reject)
- View pool contributors and orders
- See different info based on pool status

✅ **Buyer Module:**
- Search nearby locked pools
- Place orders on available quantity
- Track order status
- Cannot see pool target/collection details

✅ **Status Management:**
- Pool status changes: OPEN → LOCKED → SELLING/SOLD
- Order status: PENDING → ACCEPTED/REJECTED

✅ **Security:**
- Role-based access (farmer vs buyer)
- Owner validation (only pool owner can lock/manage orders)
- Transaction safety for quantity updates

✅ **Location-based Search:**
- Geolocation enabled
- Radius-based pool discovery (50km default)

---

## 🚀 NEXT STEPS (Optional Enhancements)

1. **Payment Integration** - Process payments for accepted orders
2. **Ratings & Reviews** - Rate farmers and buyers
3. **Notifications** - Real-time notifications for orders
4. **Analytics Dashboard** - Track sales, orders, revenue
5. **Delivery Management** - Manage logistics
6. **Pool History** - Archive completed pools
7. **Farmer Certification** - Verify organic/certified products
8. **Bulk Pricing** - Dynamic pricing based on quantity

---

## 🧪 TESTING CHECKLIST

### Farmer Flow
- [ ] Create a pool with OPEN status
- [ ] Join another farmer's pool
- [ ] See target, current, remaining quantities
- [ ] Lock pool and see status change to LOCKED
- [ ] See available stock instead of target after locking

### Buyer Flow
- [ ] Search nearby LOCKED pools
- [ ] Cannot see target/collection details
- [ ] Place order on available stock
- [ ] See order status (PENDING)
- [ ] Track orders in my orders

### Order Management
- [ ] Accept buyer order
- [ ] Reject buyer order
- [ ] See updated order status
- [ ] See order history

---

**Last Updated:** April 19, 2026
**Version:** 1.0.0
