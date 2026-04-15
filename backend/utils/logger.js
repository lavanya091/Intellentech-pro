const ActivityLog = require('../models/ActivityLog');

const logActivity = async (user, action, entityType, entityId, details) => {
  try {
    await ActivityLog.create({
      user: user._id,
      action,
      entityType,
      entityId,
      details,
    });
  } catch (err) {
    console.error('Error logging activity:', err.message);
  }
};

module.exports = logActivity;
