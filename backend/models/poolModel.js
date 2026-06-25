const db = require("../config/db");

// CREATE POOL
// const createPool = (data, callback) => {
//   const {
//     cropName,
//     targetQuantity,
//     price,
//     latitude,
//     longitude,
//     pickupLocation,
//     createdBy,
//   } = data;

//   const query = `
//     INSERT INTO pools 
//     (crop_name, target_quantity, current_quantity, price, latitude, longitude, pickup_location, status, created_by)
//     VALUES (?, ?, 0, ?, ?, ?, ?, 'OPEN', ?)
//   `;

//   db.query(
//     query,
//     [cropName, targetQuantity, price, latitude, longitude, pickupLocation, createdBy],
//     callback
//   );
// };




// FARMER NEARBY (OPEN)
const getNearbyPools = (lat, lng, radius, callback) => {
  const query = `
    SELECT 
      p.id,
      p.crop_name AS cropName,
      p.target_quantity AS targetQuantity,
      p.current_quantity AS currentQuantity,
      p.price,
      p.status,
      p.created_by AS createdBy,
      u.name AS creatorName,
      u.mobile AS creatorMobile,
      (
        6371 * ACOS(
          COS(RADIANS(?)) 
          * COS(RADIANS(p.latitude)) 
          * COS(RADIANS(p.longitude) - RADIANS(?)) 
          + SIN(RADIANS(?)) 
          * SIN(RADIANS(p.latitude))
        )
      ) AS distance
    FROM pools p
    JOIN users u ON p.created_by = u.id
    WHERE p.status = 'OPEN'
    HAVING distance <= ?
    ORDER BY distance ASC
  `;

  db.query(query, [lat, lng, lat, radius], callback);
};

// BUYER NEARBY (LOCKED)
const getNearbyLockedPools = (lat, lng, radius, callback) => {
  const query = `
    SELECT 
      p.id,
      p.crop_name AS cropName,
      p.price,
      p.current_quantity AS currentQuantity,
      p.pickup_location AS pickupLocation,
      u.name AS ownerName,
      u.mobile AS ownerMobile,

      (
        SELECT COALESCE(SUM(o.quantity),0)
        FROM orders o
        WHERE o.pool_id = p.id AND o.status = 'ACCEPTED'
      ) AS soldQuantity,

      (
        p.current_quantity - 
        (
          SELECT COALESCE(SUM(o.quantity),0)
          FROM orders o
          WHERE o.pool_id = p.id AND o.status = 'ACCEPTED'
        )
      ) AS remaining,

      (
        6371 * ACOS(
          COS(RADIANS(?)) 
          * COS(RADIANS(p.latitude)) 
          * COS(RADIANS(p.longitude) - RADIANS(?)) 
          + SIN(RADIANS(?)) 
          * SIN(RADIANS(p.latitude))
        )
      ) AS distance

    FROM pools p
    JOIN users u ON p.created_by = u.id
    WHERE p.status = 'LOCKED'
    HAVING remaining > 0 AND distance <= ?
    ORDER BY distance ASC
  `;

  db.query(query, [lat, lng, lat, radius], callback);
};





// MY POOLS - NOW RETURNS CALCULATED STATUS
const getMyPools = (userId, callback) => {
  const createdQuery = `
    SELECT 
      id,
      crop_name AS cropName,
      target_quantity AS targetQuantity,
      current_quantity AS currentQuantity,
      (target_quantity - current_quantity) AS remaining,
      price,
      status,
      created_at,
      created_by
    FROM pools
    WHERE created_by = ?
    ORDER BY id DESC
  `;

  const joinedQuery = `
    SELECT 
      p.id,
      p.crop_name AS cropName,
      p.target_quantity AS targetQuantity,
      p.current_quantity AS currentQuantity,
      (p.target_quantity - p.current_quantity) AS remaining,
      p.price,
      p.status,
      c.quantity AS contributed_quantity,
      p.created_by
    FROM pools p
    JOIN contributions c ON p.id = c.pool_id
    WHERE c.farmer_id = ? AND p.created_by != ?
    ORDER BY p.id DESC
  `;

  db.query(createdQuery, [userId], (err, created) => {
    if (err) return callback(err);

    db.query(joinedQuery, [userId, userId], (err, joined) => {
      if (err) return callback(err);

      // Calculate SELLING status for created pools
      const enrichedCreated = created.map(pool => {
        if (pool.status === "LOCKED" || pool.status === "SELLING" || pool.status === "SOLD") {
          // Check if pool has orders and calculate sold quantity
          const soldQuery = `
            SELECT COALESCE(SUM(o.quantity), 0) AS soldQuantity
            FROM orders o
            WHERE o.pool_id = ? AND o.status = 'ACCEPTED'
          `;
          
          // We need to handle this async, so return promise wrapper
          return new Promise((resolve) => {
            db.query(soldQuery, [pool.id], (err, result) => {
              if (err) {
                resolve({ ...pool, soldQuantity: 0 });
                return;
              }
              
              const soldQuantity = result[0].soldQuantity;
              let calculatedStatus = pool.status;
              
              if (pool.status === "LOCKED") {
                const availableQuantity = pool.currentQuantity - soldQuantity;
                if (soldQuantity > 0 && availableQuantity > 0) {
                  calculatedStatus = "SELLING";
                } else if (availableQuantity <= 0) {
                  calculatedStatus = "SOLD";
                }
              }
              
              resolve({
                ...pool,
                status: calculatedStatus,
                soldQuantity: soldQuantity
              });
            });
          });
        }
        return Promise.resolve({ ...pool, soldQuantity: 0 });
      });

      // Calculate SELLING status for joined pools
      const enrichedJoined = joined.map(pool => {
        if (pool.status === "LOCKED" || pool.status === "SELLING" || pool.status === "SOLD") {
          // Check if pool has orders and calculate sold quantity
          const soldQuery = `
            SELECT COALESCE(SUM(o.quantity), 0) AS soldQuantity
            FROM orders o
            WHERE o.pool_id = ? AND o.status = 'ACCEPTED'
          `;
          
          // We need to handle this async, so return promise wrapper
          return new Promise((resolve) => {
            db.query(soldQuery, [pool.id], (err, result) => {
              if (err) {
                resolve({ ...pool, soldQuantity: 0 });
                return;
              }
              
              const soldQuantity = result[0].soldQuantity;
              let calculatedStatus = pool.status;
              
              if (pool.status === "LOCKED") {
                const availableQuantity = pool.currentQuantity - soldQuantity;
                if (soldQuantity > 0 && availableQuantity > 0) {
                  calculatedStatus = "SELLING";
                } else if (availableQuantity <= 0) {
                  calculatedStatus = "SOLD";
                }
              }
              
              resolve({
                ...pool,
                status: calculatedStatus,
                soldQuantity: soldQuantity
              });
            });
          });
        }
        return Promise.resolve({ ...pool, soldQuantity: 0 });
      });

      // Wait for all enriched pools
      Promise.all([...enrichedCreated, ...enrichedJoined]).then(allPools => {
        const enrichedPoolsCreated = allPools.slice(0, enrichedCreated.length);
        const enrichedPoolsJoined = allPools.slice(enrichedCreated.length);
        callback(null, { created: enrichedPoolsCreated, joined: enrichedPoolsJoined });
      });
    });
  });
};








// POOL DETAILS (MAIN LOGIC)
const getPoolDetails = (poolId, callback) => {
  const poolQuery = `
    SELECT 
      id,
      crop_name AS cropName,
      target_quantity AS targetQuantity,
      current_quantity AS currentQuantity,
      price,
      status,
      created_by AS createdBy
    FROM pools
    WHERE id = ?
  `;

  const contributorsQuery = `
    SELECT 
      c.id,
      c.farmer_id,
      c.quantity,
      u.name AS farmerName,
      u.mobile,
      p.price
    FROM contributions c
    JOIN users u ON c.farmer_id = u.id
    JOIN pools p ON c.pool_id = p.id
    WHERE c.pool_id = ?
  `;

  const ordersQuery = `
    SELECT id, buyer_id, quantity, status
    FROM orders
    WHERE pool_id = ?
  `;

  const soldQuery = `
    SELECT COALESCE(SUM(quantity), 0) AS soldQuantity
    FROM orders
    WHERE pool_id = ? AND status = 'ACCEPTED'
  `;

  db.query(poolQuery, [poolId], (err, poolResult) => {
    if (err || poolResult.length === 0)
      return callback(err || "Pool not found");

    const pool = poolResult[0];

    db.query(contributorsQuery, [poolId], (err, contributors) => {
      if (err) return callback(err);


      db.query(ordersQuery, [poolId], (err, orders) => {
        if (err) return callback(err);


        // 🟢 COLLECTION PHASE
        if (pool.status === "OPEN") {
          const remaining =
            pool.targetQuantity - pool.currentQuantity;

          const percent =
            (pool.currentQuantity / pool.targetQuantity) * 100;

          return callback(null, {
            ...pool,
            remaining,
            percent,
            phase: "COLLECTION",
            contributors,
            orders,
          });
        }

        // 🔒 SELLING PHASE
        db.query(soldQuery, [poolId], (err, soldResult) => {
          if (err) return callback(err);

          const soldQuantity = soldResult[0].soldQuantity;

          let remaining;

          if (pool.status === "OPEN") {
            remaining = pool.targetQuantity - pool.currentQuantity;
          } else {
            remaining = pool.currentQuantity - soldQuantity;
          }

          let status = "LOCKED";

          if (soldQuantity > 0 && remaining > 0)
            status = "SELLING";
          else if (remaining <= 0)
            status = "SOLD";

          callback(null, {
            ...pool,
            soldQuantity,
            remaining,
            status,
            phase: "SELLING",
            contributors,
            orders,
          });
        });
      });
    });
  });
};


// GET POOL BY ID
const getPoolById = (poolId, callback) => {
  const query = `
    SELECT * FROM pools WHERE id = ?`;
  db.query(query, [poolId], callback);
};



// LOCK POOL
const lockPoolById = (poolId, callback) => {
  const query = `
    UPDATE pools
    SET status = 'LOCKED'
    WHERE id = ? AND status = 'OPEN'
  `;

  db.query(query, [poolId], callback);
};

module.exports = {
 // createPool,
  getNearbyPools,
  getNearbyLockedPools,
  getMyPools,
  getPoolDetails,
  getPoolById,
  lockPoolById,
};