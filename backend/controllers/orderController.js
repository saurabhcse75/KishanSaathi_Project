const { getMyOrders } = require("../models/orderModel");

const db = require("../config/db");

exports.createOrder = (req, res) => {
    const { poolId, quantity } = req.body;
    const user = req.user;

    // 🔒 ROLE CHECK
    if (user.role !== "buyer") {
        return res.status(403).json({ message: "Only buyers can place orders" });
    }

    if (!poolId || !quantity || quantity <= 0) {
        return res.status(400).json({ message: "Invalid data" });
    }

    db.beginTransaction((err) => {
        if (err) return res.status(500).json({ message: "Transaction error" });

        // 🔒 LOCK POOL - Prevents concurrent modifications
        const lockQuery = "SELECT * FROM pools WHERE id = ? FOR UPDATE";

        db.query(lockQuery, [poolId], (err, results) => {
            if (err || results.length === 0) {
                return db.rollback(() => {
                    res.status(404).json({ message: "Pool not found" });
                });
            }

            const pool = results[0];

            // 🔒 MUST BE LOCKED
            if (pool.status !== "LOCKED") {
                return db.rollback(() => {
                    res.status(400).json({ message: "Pool is not ready for orders" });
                });
            }

            // 🔒 LOCK ORDERS - Prevent race conditions on sold quantity calculation
            const lockOrdersQuery = `
                SELECT id FROM orders 
                WHERE pool_id = ? 
                FOR UPDATE
            `;

            db.query(lockOrdersQuery, [poolId], (err, lockedOrders) => {
                if (err) {
                    return db.rollback(() => {
                        res.status(500).json({ message: "Failed to lock orders" });
                    });
                }

                // 🔒 GET ALREADY SOLD QUANTITY (with lock)
                const getSoldQuery = `
                    SELECT COALESCE(SUM(quantity), 0) AS soldQuantity
                    FROM orders
                    WHERE pool_id = ? AND status = 'ACCEPTED'
                `;

                db.query(getSoldQuery, [poolId], (err, soldResults) => {
                    if (err) {
                        return db.rollback(() => {
                            res.status(500).json({ message: "Failed to fetch sold quantity" });
                        });
                    }

                    const soldQuantity = soldResults[0].soldQuantity;
                    const availableQuantity = pool.current_quantity - soldQuantity;

                    if (quantity > availableQuantity) {
                        return db.rollback(() => {
                            res.status(400).json({ message: `Not enough quantity available. Available: ${availableQuantity} kg` });
                        });
                    }

                    // 🟢 CREATE ORDER (within transaction with locks)
                    const insertOrder = `
                        INSERT INTO orders (pool_id, buyer_id, quantity, status)
                        VALUES (?, ?, ?, 'PENDING')
                    `;

                    db.query(insertOrder, [poolId, user.id, quantity], (err) => {
                        if (err) {
                            return db.rollback(() => {
                                res.status(500).json({ message: "Order failed" });
                            });
                        }

                        db.commit((err) => {
                            if (err) {
                                return db.rollback(() => {
                                    res.status(500).json({ message: "Commit failed" });
                                });
                            }

                            res.json({ message: "Order placed successfully" });
                        });
                    });
                });
            });
        });
    });
};


// exports.acceptOrder = (req, res) => {
//     const { id } = req.params;
//     const user = req.user;

//     db.beginTransaction((err) => {
//         if (err) return res.status(500).json({ message: "Transaction error" });

//         // 🔒 LOCK ORDER
//         const orderQuery = "SELECT * FROM orders WHERE id = ? FOR UPDATE";

//         db.query(orderQuery, [id], (err, orderRes) => {
//             if (err || orderRes.length === 0) {
//                 return db.rollback(() => {
//                     res.status(404).json({ message: "Order not found" });
//                 });
//             }

//             const order = orderRes[0];

//             if (order.status !== "PENDING") {
//                 return db.rollback(() => {
//                     res.status(400).json({ message: "Invalid order state" });
//                 });
//             }

//             // 🔒 LOCK POOL
//             const poolQuery = "SELECT * FROM pools WHERE id = ? FOR UPDATE";

//             db.query(poolQuery, [order.pool_id], (err, poolRes) => {
//                 if (err || poolRes.length === 0) {
//                     return db.rollback(() => {
//                         res.status(404).json({ message: "Pool not found" });
//                     });
//                 }

//                 const pool = poolRes[0];

//                 // 🔒 ONLY OWNER CAN ACCEPT
//                 if (pool.created_by !== user.id) {
//                     return db.rollback(() => {
//                         res.status(403).json({ message: "Unauthorized" });
//                     });
//                 }

//                 const remaining =
//                     pool.target_quantity - pool.current_quantity;

//                 if (order.quantity > remaining) {
//                     return db.rollback(() => {
//                         res.status(400).json({ message: "Not enough quantity" });
//                     });
//                 }

//                 // 🟢 UPDATE ORDER
//                 const updateOrder = `
//                     UPDATE orders SET status = 'ACCEPTED'
//                     WHERE id = ?
//                 `;

//                 db.query(updateOrder, [id], (err) => {
//                     if (err) {
//                         return db.rollback(() => {
//                             res.status(500).json({ message: "Order update failed" });
//                         });
//                     }

//                     // 🟢 UPDATE POOL
//                     const updatePool = `
//                         UPDATE pools
//                         SET current_quantity = current_quantity + ?
//                         WHERE id = ?
//                     `;

//                     db.query(updatePool, [order.quantity, order.pool_id], (err) => {
//                         if (err) {
//                             return db.rollback(() => {
//                                 res.status(500).json({ message: "Pool update failed" });
//                             });
//                         }

//                         db.commit((err) => {
//                             if (err) {
//                                 return db.rollback(() => {
//                                     res.status(500).json({ message: "Commit failed" });
//                                 });
//                             }

//                             res.json({ message: "Order accepted" });
//                         });
//                     });
//                 });
//             });
//         });
//     });
// };

exports.acceptOrder = (req, res) => {
    const { id } = req.params;
    const user = req.user;

    db.beginTransaction((err) => {
        if (err) return res.status(500).json({ message: "Transaction error" });

        // 🔒 LOCK ORDER
        const orderQuery = "SELECT * FROM orders WHERE id = ? FOR UPDATE";

        db.query(orderQuery, [id], (err, orderRes) => {
            if (err || orderRes.length === 0) {
                return db.rollback(() => {
                    res.status(404).json({ message: "Order not found" });
                });
            }

            const order = orderRes[0];

            if (order.status !== "PENDING") {
                return db.rollback(() => {
                    res.status(400).json({ message: "Invalid order state" });
                });
            }

            // 🔒 LOCK POOL
            const poolQuery = "SELECT * FROM pools WHERE id = ? FOR UPDATE";

            db.query(poolQuery, [order.pool_id], (err, poolRes) => {
                if (err || poolRes.length === 0) {
                    return db.rollback(() => {
                        res.status(404).json({ message: "Pool not found" });
                    });
                }

                const pool = poolRes[0];

                // 🔒 ONLY OWNER CAN ACCEPT
                if (pool.created_by !== user.id) {
                    return db.rollback(() => {
                        res.status(403).json({ message: "Unauthorized" });
                    });
                }

                // 🔒 GET ALREADY ACCEPTED ORDERS (not including this one)
                const getSoldQuery = `
                    SELECT COALESCE(SUM(quantity), 0) AS soldQuantity
                    FROM orders 
                    WHERE pool_id = ? AND status = 'ACCEPTED' AND id != ?
                `;

                db.query(getSoldQuery, [order.pool_id, id], (err, soldRes) => {
                    if (err) {
                        return db.rollback(() => {
                            res.status(500).json({ message: "Error calculating sold quantity" });
                        });
                    }

                    const soldQuantity = soldRes[0].soldQuantity;
                    const availableQuantity = pool.current_quantity - soldQuantity;

                    if (order.quantity > availableQuantity) {
                        return db.rollback(() => {
                            res.status(400).json({ message: "Not enough quantity available" });
                        });
                    }

                    // 🟢 UPDATE ORDER ONLY (no pool update)
                    const updateOrder = `
                        UPDATE orders SET status = 'ACCEPTED'
                        WHERE id = ?
                    `;

                    db.query(updateOrder, [id], (err) => {
                        if (err) {
                            return db.rollback(() => {
                                res.status(500).json({ message: "Order update failed" });
                            });
                        }

                        db.commit((err) => {
                            if (err) {
                                return db.rollback(() => {
                                    res.status(500).json({ message: "Commit failed" });
                                });
                            }

                            res.json({ message: "Order accepted" });
                        });
                    });
                });
            });
        });
    });
};

exports.rejectOrder = (req, res) => {
    const { id } = req.params;
    const user = req.user;

    db.beginTransaction((err) => {
        if (err) return res.status(500).json({ message: "Transaction error" });

        // 🔒 LOCK ORDER
        const orderQuery = "SELECT * FROM orders WHERE id = ? FOR UPDATE";

        db.query(orderQuery, [id], (err, orderRes) => {
            if (err || orderRes.length === 0) {
                return db.rollback(() => {
                    res.status(404).json({ message: "Order not found" });
                });
            }

            const order = orderRes[0];

            if (order.status !== "PENDING") {
                return db.rollback(() => {
                    res.status(400).json({ message: "Invalid order state" });
                });
            }

            // 🔒 LOCK POOL - Verify ownership
            const poolQuery = "SELECT * FROM pools WHERE id = ? FOR UPDATE";

            db.query(poolQuery, [order.pool_id], (err, poolRes) => {
                if (err || poolRes.length === 0) {
                    return db.rollback(() => {
                        res.status(404).json({ message: "Pool not found" });
                    });
                }

                const pool = poolRes[0];

                // 🔒 ONLY OWNER CAN REJECT
                if (pool.created_by !== user.id) {
                    return db.rollback(() => {
                        res.status(403).json({ message: "Not authorized" });
                    });
                }

                // 🟢 UPDATE ORDER
                const updateQuery = `
                    UPDATE orders
                    SET status = 'REJECTED'
                    WHERE id = ?
                `;

                db.query(updateQuery, [id], (err) => {
                    if (err) {
                        return db.rollback(() => {
                            res.status(500).json({ message: "Order rejection failed" });
                        });
                    }

                    db.commit((err) => {
                        if (err) {
                            return db.rollback(() => {
                                res.status(500).json({ message: "Commit failed" });
                            });
                        }

                        res.json({ message: "Order rejected" });
                    });
                });
            });
        });
    });
};


exports.getMyOrders = (req, res) => {
    const user = req.user;
    // 🔒 Only buyer
    if (user.role !== "buyer") {
        return res.status(403).json({ message: "Only buyers allowed" });
    }
    
    getMyOrders(user.id, (err, results) => {
        if (err) {
            console.error("Error fetching orders:", err);
            return res.status(500).json({ message: "Failed to fetch orders" });
        }

        res.json(results);
    });
};

// 📋 GET PENDING ORDERS FOR POOL OWNER
exports.getPoolOrders = (req, res) => {
    const { poolId } = req.params;
    const user = req.user;

    if (user.role !== "farmer") {
        return res.status(403).json({ message: "Only farmers allowed" });
    }

    if (!poolId) {
        return res.status(400).json({ message: "Pool ID required" });
    }

    // 🔒 First verify pool ownership
    const poolQuery = "SELECT created_by FROM pools WHERE id = ?";
    
    db.query(poolQuery, [poolId], (err, poolResults) => {
        if (err || poolResults.length === 0) {
            return res.status(404).json({ message: "Pool not found" });
        }

        const pool = poolResults[0];
        
        if (pool.created_by !== user.id) {
            return res.status(403).json({ message: "Not authorized" });
        }

        // 📋 Get all orders for this pool with buyer details
        const ordersQuery = `
            SELECT 
                o.id,
                o.quantity,
                o.status,
                o.created_at,
                u.name AS buyerName,
                u.mobile AS buyerMobile
            FROM orders o
            JOIN users u ON o.buyer_id = u.id
            WHERE o.pool_id = ?
            ORDER BY o.status ASC, o.created_at DESC
        `;

        db.query(ordersQuery, [poolId], (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: "DB Error" });
            }

            res.json(results);
        });
    });
};

// 📋 GET ALL PENDING ORDERS FOR FARMER'S POOLS
exports.getFarmerOrders = (req, res) => {
    const user = req.user;

    if (user.role !== "farmer") {
        return res.status(403).json({ message: "Only farmers allowed" });
    }

    const ordersQuery = `
        SELECT 
            o.id,
            o.quantity,
            o.status,
            o.created_at,
            u.name AS buyerName,
            u.mobile AS buyerMobile,
            p.id AS poolId,
            p.crop_name AS cropName,
            p.price AS poolPrice,
            p.status AS poolStatus
        FROM orders o
        JOIN users u ON o.buyer_id = u.id
        JOIN pools p ON o.pool_id = p.id
        WHERE p.created_by = ?
        ORDER BY o.status ASC, o.created_at DESC
    `;

    db.query(ordersQuery, [user.id], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "DB Error" });
        }

        res.json(results);
    });
};