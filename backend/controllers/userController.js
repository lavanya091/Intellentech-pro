const User = require('../models/User');
const Project = require('../models/Project');
const Task = require('../models/Task');
const logActivity = require('../utils/logger');
const bcrypt = require('bcryptjs');

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
exports.getUsers = async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({ success: true, count: users.length, data: users });
};

// @desc    Create user
// @route   POST /api/users
// @access  Private/Admin
exports.createUser = async (req, res, next) => {
  const user = await User.create(req.body);
  await logActivity(req.user, 'User Created', 'User', user._id, `Admin created user ${user.email}`);
  res.status(201).json({ success: true, data: user });
};

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
exports.updateUser = async (req, res, next) => {
  const updateData = { ...req.body };

  // Remove empty password so it doesn't fail minlength validation
  if (!updateData.password) {
    delete updateData.password;
  } else {
    // Hash password manually since findByIdAndUpdate bypasses pre('save')
    const salt = await bcrypt.genSalt(10);
    updateData.password = await bcrypt.hash(updateData.password, salt);
  }

  const user = await User.findByIdAndUpdate(req.params.id, updateData, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  await logActivity(req.user, 'User Updated', 'User', user._id, `Admin updated user ${user.email}`);
  res.status(200).json({ success: true, data: user });
};

// @desc    Get system stats
// @route   GET /api/users/stats
// @access  Private/Admin
exports.getStats = async (req, res, next) => {
  const userCount = await User.countDocuments();
  const projectCount = await Project.countDocuments();
  const taskCount = await Task.countDocuments();

  const usersByRole = await User.aggregate([
    { $group: { _id: '$role', count: { $sum: 1 } } }
  ]);

  const tasksByStatus = await Task.aggregate([
    { $group: { _id: '$status', count: { $sum: 1 } } }
  ]);

  res.status(200).json({
    success: true,
    data: {
      totalUsers: userCount,
      totalProjects: projectCount,
      totalTasks: taskCount,
      usersByRole,
      tasksByStatus
    }
  });
};
