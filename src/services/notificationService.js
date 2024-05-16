const Notification = require('../models/notificationModel');

async function createNotification(user, message, type) {
  try {
    const notification = new Notification({
      recipient: user._id, 
      message,
      type
    });

     await notification.save();
   

    console.log('Notification saved to the database:', notification);
    return notification; 
  } catch (error) {
    console.error('Error saving notification:', error);
    throw error; 
  }
}

module.exports = {
  createNotification
};