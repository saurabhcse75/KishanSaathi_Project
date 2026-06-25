const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const { createOrder ,getMyOrders, getPoolOrders, getFarmerOrders} = require("../controllers/orderController");

const {  acceptOrder ,rejectOrder } = require("../controllers/orderController");

router.post("/", authMiddleware, createOrder);
router.get("/my", authMiddleware, getMyOrders);
router.get("/farmer", authMiddleware, getFarmerOrders);
router.get("/pool/:poolId", authMiddleware, getPoolOrders);

router.put("/:id/accept", authMiddleware, acceptOrder);
router.put("/:id/reject", authMiddleware, rejectOrder);

module.exports = router;