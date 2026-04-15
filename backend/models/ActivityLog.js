const mongoose = require('mongoose');

const ActivityLogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  action: {
    type: String,
    required: true,
  },
  entityType: {
    type: String,
    enum: ['User', 'Project', 'Task'],
    required: true,
  },
  entityId: {
    type: mongoose.Schema.ObjectId,
    required: true,
  },
  details: {
    type: String,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('ActivityLog', ActivityLogSchema);
