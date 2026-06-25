const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");
const { createPool, getNearbyPools ,joinPool, getMyPools,getPoolDetails,lockPool,getNearbyBuyerPools} = require("../controllers/poolController");


// 🌾 CREATE POOL
router.post("/", authMiddleware, createPool);

router.post("/join",authMiddleware,joinPool);
router.get("/nearby",authMiddleware,getNearbyPools);
router.get("/my",authMiddleware,getMyPools);
router.get("/:id", authMiddleware, getPoolDetails);
router.put("/:id/lock",authMiddleware,lockPool);


router.get("/buyer/nearby", authMiddleware, getNearbyBuyerPools);

module.exports = router;