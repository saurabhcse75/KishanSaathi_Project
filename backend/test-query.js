const db = require('./config/db');

const testQuery = `
    SELECT 
        o.id,
        o.quantity,
        o.status,
        o.created_at,
        p.crop_name,
        p.price,
        u.name,
        u.mobile
    FROM orders o
    JOIN pools p ON o.pool_id = p.id
    JOIN users u ON p.farmer_id = u.id
    LIMIT 5
`;

db.query(testQuery, (err, results) => {
    if (err) {
        console.log('ERROR:', err.message);
        console.log('Full Error:', err);
    } else {
        console.log('Query successful!');
        console.log('Number of results:', results.length);
        console.log('Results:', JSON.stringify(results, null, 2));
    }
    process.exit();
});
