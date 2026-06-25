const db = require("../config/db");
const { 
    getNearbyPools, 
    getMyPools,
    getPoolDetails,
    lockPoolById, 
    getPoolById,
    getNearbyLockedPools
} = require("../models/poolModel");



//***************---------------Pool Creation---------------***************/
exports.createPool = (req, res) => {
    const {
        cropName,
        targetQuantity,
        price,
        latitude,
        longitude,
        pickupLocation,
        initialQuantity
    } = req.body;

    const user = req.user;             //extracting user

    // 🔒 ROLE CHECK
    if (user.role !== "farmer") {
        return res.status(403).json({ message: "Only farmers can create pool" });
    }

    // 🔒 VALIDATION
    if (!cropName || !targetQuantity || !price || !latitude || !longitude || !pickupLocation) {
        return res.status(400).json({ message: "All fields required" });
    }

    const numTarget = Number(targetQuantity);
    const numPrice = Number(price);
    const numInitial = Number(initialQuantity);

    if (isNaN(numTarget) || numTarget <= 0 || isNaN(numPrice) || numPrice <= 0) {
        return res.status(400).json({ message: "Invalid values" });
    }

    if (initialQuantity !== undefined && initialQuantity !== null && initialQuantity !== "") {
        if (isNaN(numInitial) || numInitial <= 0) {
            return res.status(400).json({ message: "Initial quantity must be positive" });
        }
        if (numInitial > numTarget) {
            return res.status(400).json({ message: "Initial quantity cannot exceed target" });
        }
    }

    if (latitude < -180 || latitude > 180 || longitude < -180 || longitude > 180) {
        return res.status(400).json({ message: "Invalid coordinates" });
    }

    // 🚀 START TRANSACTION
    db.beginTransaction((err) => {
        if (err) return res.status(500).json({ message: "Transaction error" });

        // 🟡 STEP 1: CREATE POOL
        const poolQuery = `
            INSERT INTO pools 
            (crop_name, target_quantity, current_quantity, price, latitude, longitude, pickup_location, status, created_by)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        // ✅ Default initialQuantity to 0 if not provided
        const currentQty = initialQuantity || 0;

        const status = currentQty === targetQuantity ? "LOCKED" : "OPEN";

        db.query(
            poolQuery,
            [
                cropName,
                targetQuantity,
                currentQty,
                price,
                latitude,
                longitude,
                pickupLocation,
                status,
                user.id
            ],
            (err, poolResult) => {
                if (err) {
                    return db.rollback(() => {
                        console.error(err);
                        res.status(500).json({ message: "Pool creation failed" });
                    });
                }

                const poolId = poolResult.insertId;


                // 🟢 STEP 2: INSERT OWNER CONTRIBUTION
                const contributionQuery = `
                    INSERT INTO contributions (pool_id, farmer_id, quantity)
                    VALUES (?, ?, ?)
                `;

                db.query(
                    contributionQuery,
                    [poolId, user.id, initialQuantity],
                    (err) => {
                        if (err) {
                            return db.rollback(() => {
                                console.error(err);
                                res.status(500).json({ message: "Contribution failed" });
                            });
                        }

                        // ✅ COMMIT
                        db.commit((err) => {
                            if (err) {
                                return db.rollback(() => {
                                    res.status(500).json({ message: "Commit failed" });
                                });
                            }


                            res.status(201).json({
                                message: "Pool created successfully",
                                poolId
                            });
                        });
                    }
                );
            }
        );
    });
};




///////-----------join Pool with Optimistic Locking and Auto-locking-----------////////

exports.joinPool = (req, res) => {
    const { poolId, quantity } = req.body;
    const user = req.user;

    // 🔒 ROLE CHECK
    if (user.role !== "farmer") {
        return res.status(403).json({ message: "Only farmers can join pool" });
    }

    // 🔒 VALIDATION
    if (!poolId || !quantity || quantity <= 0) {
        return res.status(400).json({ message: "Invalid data" });
    }

    db.beginTransaction((err) => {
        if (err) return res.status(500).json({ message: "Transaction error" });

        // 🔒 LOCK POOL
        const lockQuery = "SELECT * FROM pools WHERE id = ? FOR UPDATE";

        db.query(lockQuery, [poolId], (err, results) => {
            if (err || results.length === 0) {
                return db.rollback(() => {
                    res.status(404).json({ message: "Pool not found" });
                });
            }

            const pool = results[0];

            // 🔒 CHECK STATUS
            if (pool.status !== "OPEN") {
                return db.rollback(() => {
                    res.status(400).json({ message: "Pool is not open" });
                });
            }

            const newQuantity = pool.current_quantity + quantity;

            // 🔒 PREVENT OVERFLOW
            if (newQuantity > pool.target_quantity) {
                return db.rollback(() => {
                    res.status(400).json({ message: "Exceeds pool limit" });
                });
            }

            // 🧠 CHECK EXISTING CONTRIBUTION
            const checkQuery = `
                SELECT * FROM contributions 
                WHERE pool_id = ? AND farmer_id = ?
            `;

            db.query(checkQuery, [poolId, user.id], (err, contribResults) => {
                if (err) {
                    return db.rollback(() => {
                        res.status(500).json({ message: "Check failed" });
                    });
                }

                let contributionQuery;
                let contributionValues;

                if (contribResults.length > 0) {
                    // 🔄 UPDATE EXISTING
                    contributionQuery = `
                        UPDATE contributions 
                        SET quantity = quantity + ?
                        WHERE pool_id = ? AND farmer_id = ?
                    `;
                    contributionValues = [quantity, poolId, user.id];
                } else {
                    // ➕ INSERT NEW
                    contributionQuery = `
                        INSERT INTO contributions (pool_id, farmer_id, quantity)
                        VALUES (?, ?, ?)
                    `;
                    contributionValues = [poolId, user.id, quantity];
                }

                db.query(contributionQuery, contributionValues, (err) => {
                    if (err) {
                        return db.rollback(() => {
                            res.status(500).json({ message: "Contribution failed" });
                        });
                    }

                    // 🟢 UPDATE POOL
                    const updatePool = `
                        UPDATE pools 
                        SET current_quantity = current_quantity + ?
                        WHERE id = ?
                    `;

                    db.query(updatePool, [quantity, poolId], (err) => {
                        if (err) {
                            return db.rollback(() => {
                                res.status(500).json({ message: "Pool update failed" });
                            });
                        }

                        // 🔒 AUTO-LOCK IF TARGET REACHED
                        const checkPoolQuery = `
                            SELECT current_quantity, target_quantity FROM pools WHERE id = ?
                        `;

                        db.query(checkPoolQuery, [poolId], (err, poolCheckResults) => {
                            if (err) {
                                return db.rollback(() => {
                                    res.status(500).json({ message: "Pool check failed" });
                                });
                            }

                            const updatedPool = poolCheckResults[0];
                            
                            // If target reached, auto-lock
                            if (updatedPool.current_quantity >= updatedPool.target_quantity) {
                                const autoLockQuery = `
                                    UPDATE pools 
                                    SET status = 'LOCKED'
                                    WHERE id = ? AND status = 'OPEN'
                                `;

                                db.query(autoLockQuery, [poolId], (err) => {
                                    if (err) {
                                        return db.rollback(() => {
                                            res.status(500).json({ message: "Auto-lock failed" });
                                        });
                                    }

                                    // ✅ COMMIT
                                    db.commit((err) => {
                                        if (err) {
                                            return db.rollback(() => {
                                                res.status(500).json({ message: "Commit failed" });
                                            });
                                        }

                                        res.json({
                                            message: "Successfully joined pool. Pool automatically locked as target reached! 🔒",
                                            autoLocked: true
                                        });
                                    });
                                });
                            } else {
                                // ✅ COMMIT (without lock)
                                db.commit((err) => {
                                    if (err) {
                                        return db.rollback(() => {
                                            res.status(500).json({ message: "Commit failed" });
                                        });
                                    }

                                    res.json({
                                        message: "Successfully joined pool"
                                    });
                                });
                            }
                        });
                    });
                });
            });
        });
    });
};



//find Nearby Pools for farmers to join
exports.getNearbyPools= (req,res)=>{
     const {lat,lng,radius=10 }=req.query;

     const user=req.user;
        if(user.role!=="farmer"){
            return res.status(403).json({ message: "Only farmers allowed" });
        }
        
     if(!lat || !lng){
        return res.status(400).json({message:"Latitude and Longotude Missing"});
     }

     if(lat <-90 || lat >90 || lng < -90 || lng > 90){
        return res.status(400).json({message:"Invalid coordinates"});
     }
     getNearbyPools(lat,lng,radius,(err,result)=>{
        if(err){
            console.error(err);
            return res.status(500).json({message:"DB Error"});
        }
        res.json(result);
     });
};



exports.getMyPools=(req,res)=>{
    const user=req.user;

    if(user.role!=="farmer"){
         return res.status(403).json({ message: "Only farmers allowed" });
    }

    getMyPools(user.id,(err,result)=>{
        if(err){
            console.error(err);
            return res.status(500).json({message:"DB Error"});
        }

        res.json(result);
    })
}



//*****************---------------Poool Details--------- */
exports.getPoolDetails = (req,res)=>{
    const {id}=req.params;

    if(!id){
        return res.status(400).json({message:"Pool ID required"});
    }

    //Sending this Request to Model to fetch the details of the pool with the given ID
    getPoolDetails(id,(err,result)=>{
         if (err) {
            console.error(err);
            return res.status(404).json({ message: "Pool not found" });
        }

        res.json(result);
    });
};



exports.lockPool = (req, res) => {
    const { id } = req.params;
    const user = req.user;

    // 🔒 Role check
    if (user.role !== "farmer") {
        return res.status(403).json({ message: "Only farmers can lock pool" });
    }

    // 🔍 Get pool first
    getPoolById(id, (err, results) => {
        if (err || results.length === 0) {
            return res.status(404).json({ message: "Pool not found" });
        }

        const pool = results[0];

        // 🔒 Ownership check
        if (pool.created_by !== user.id) {
            return res.status(403).json({ message: "Not authorized" });
        }

        // 🔒 Already locked
        if (pool.status !== "OPEN") {
            return res.status(400).json({ message: "Pool already locked or closed" });
        }

        // ⚠️ Optional: prevent locking empty pool
        if (pool.current_quantity <= 0) {
            return res.status(400).json({ message: "Cannot lock empty pool" });
        }

        // 🔐 Lock pool
        lockPoolById(id, (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: "DB Error" });
            }

            res.json({ message: "Pool locked successfully" });
        });
    });
};


exports.getNearbyBuyerPools = (req, res) => {
    const { lat, lng, radius = 10 } = req.query;
    const user = req.user;

    // 🔒 Only buyer
    if (user.role !== "buyer") {
        return res.status(403).json({ message: "Only buyers allowed" });
    }

    if (!lat || !lng) {
        return res.status(400).json({ message: "Coordinates required" });
    }

    getNearbyLockedPools(lat, lng, radius, (err, results) => {
        if (err) {
            return res.status(500).json({ message: "DB Error" });
        }

        res.json(results);
    });
};