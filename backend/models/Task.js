const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a task title'],
    trim: true,
  },
  description: {
    type: String,
  },
  status: {
    type: String,
    enum: ['To Do', 'In Progress', 'Done'],
    default: 'To Do',
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium',
  },
  dueDate: {
    type: Date,
  },
  project: {
    type: mongoose.Schema.ObjectId,
    ref: 'Project',
    required: true,
  },
  assignedTo: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
  comments: [
    {
      text: String,
      user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Task', TaskSchema);
