const { chekRateLimiter } = require('../services/rateLimit.Service');

module.exports = async function rateLimiter(req, res, next) {
    try {
        const userId = req.headers['userid'];
        if (!userId) {
            return res.status(400).json({ message: 'User ID is required in headers' });
        }

        const ip = req.headers['x-forwarded-for']?. split(',') [0]  || 
        req.ip;

        const userAllowed = await
            chekRateLimiter(userId, 'user', 5);
            if (!userAllowed) {
                return res.status(429).json({ message: 'user rate limit exceeded.' });

            }

            const ipAllowed = await
                chekRateLimiter(ip, 'ip', 20);
                if (!ipAllowed) {
                    return res.status(429).json({ message: 'IP rate limit exceeded.' });
                }

        next();
            }catch (error) {
                console.error(error);
                res.status(500).json({ message: 'Internal server error' });
            }
};