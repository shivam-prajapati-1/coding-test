const express = require('express');
const rateLimiter = require('../middleware/rateLimiter');


const router = express.Router();

router.get('/data', rateLimiter, (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Data fetched successfully',
     });
});

module.exports = router;
