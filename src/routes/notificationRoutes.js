const express = require('express');
const router = express.Router();
const { 
    getNotificationsByUserId,
    createAnnouncement,
} = require('../controllers/notificationController');
const  validateToken = require('../middleware/validateTokenHandler');

// Use token validation middleware
router.use(validateToken);

// Route to retrieve notifications for a specific user
router.get('/', getNotificationsByUserId);
router.post('/announcement',  createAnnouncement);

module.exports = router;