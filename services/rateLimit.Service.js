const pool = require('../configre/db');
const WINDOW_SIZE = 60 * 1000; 

async function chekRateLimiter(identifier, type, maxRequests) {

    const client = await pool.connect();
    try {
        const now = Date.now();
        const result = await client.query(
            'SELECT * FROM rate_limits WHERE identifier = $1 AND type = $2',
            [identifier, type]
        );
        if (result.rows.length === 0) {
            await client.query(
                'INSERT INTO rate_limits (identifier, type, request_count, window_start) VALUES ($1, $2, 1, $3)',
                [identifier, type, new Date()]
            );
            return true;
        }
        const record = result.rows[0];
        constwindowStart = new
        Date(record.window_start);
          
        if (now - windowStart > WINDOW_SIZE) {
            await client.query(
                'UPDATE rate_limits SET request_count = 1, window_start = $1 WHERE id = $2',
                [new Date(), record.id]
            );
            return true;
        }
        if (record.request_count >= maxRequests) {
            return false;
        }
        await client.query(
            'UPDATE rate_limits SET request_count = request_count + 1 WHERE id = $1',
            [record.id]
        );
        return true;
    } finally {
        client.release();
    }
}

module.exports = {
    chekRateLimiter
};