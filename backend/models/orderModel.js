const db = require("../config/db");

const getMyOrders = (buyerId, callback) => {
    // First, get the actual COUNT of contributors using a simpler approach
    const query = `
        SELECT 
            o.id,
            o.quantity,
            o.status,
            o.created_at,
            o.pool_id,

            p.crop_name AS cropName,
            p.price,
            p.id AS poolId,
            p.created_by,
            p.target_quantity,
            p.current_quantity,
            p.pickup_location AS pickupLocation,

            u.name AS farmerName,
            u.mobile AS farmerMobile,

            (SELECT COUNT(DISTINCT farmer_id) FROM contributions WHERE pool_id = p.id) AS totalContributors,
            CAST(o.quantity * p.price AS DECIMAL(10,2)) AS totalAmount

        FROM orders o
        JOIN pools p ON o.pool_id = p.id
        JOIN users u ON p.created_by = u.id
        WHERE o.buyer_id = ?
        ORDER BY o.created_at DESC
    `;

    db.query(query, [buyerId], (err, result) => {
        callback(err, result);
    });
};

module.exports = {
    getMyOrders
};