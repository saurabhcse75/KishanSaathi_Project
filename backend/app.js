const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const poolRoutes=require("./routes/poolRoutes");
const orderRoutes=require("./routes/orderRoutes");

const app = express();

app.use(cors(
    {
        origin: process.env.FRONTEND_URL || "http://localhost:5173"
    }
));
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ limit: '10kb' })); //not much necessary but just in case

app.use("/api/auth", authRoutes);
app.use("/api/pools",poolRoutes);
app.use("/api/orders",orderRoutes);

module.exports = app;