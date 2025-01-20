const express = require('express');
const router = express.Router();

/**
 * @swagger
 * /api/hello:
 */
router.get('/api/hello', (req, res) => {
    res.send('Hello, world!');
});

// Export the router
module.exports = router;
