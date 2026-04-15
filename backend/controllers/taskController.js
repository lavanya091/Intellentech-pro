const Task = require('../models/Task');
const Project = require('../models/Project');
const logActivity = require('../utils/logger');

// @desc    Get all tasks
// @route   GET /api/tasks
// @access  Private
exports.getTasks = async (req, res, next) => {
  let query;

  if (req.user.role === 'Admin') {
    query = Task.find().populate('project assignedTo', 'name title email');
  } else if (req.user.role === 'Manager') {
    // Find projects managed by this user
    const projects = await Project.find({ manager: req.user.id });
    const projectIds = projects.map(p => p._id);
    query = Task.find({ project: { $in: projectIds } }).populate('project assignedTo', 'name title email');
  } else {
    // Developer: only assigned tasks
    query = Task.find({ assignedTo: req.user.id }).populate('project assignedTo', 'name title email');
  }

  const tasks = await query;
  res.status(200).json({ success: true, count: tasks.length, data: tasks });
};

// @desc    Create task
// @route   POST /api/tasks
// @access  Private/Manager
exports.createTask = async (req, res, next) => {
  const project = await Project.findById(req.body.project);

  if (!project) {
    return res.status(404).json({ success: false, message: 'Project not found' });
  }

  // Ensure user is the manager of the project
  if (project.manager.toString() !== req.user.id && req.user.role !== 'Admin') {
    return res.status(401).json({ success: false, message: 'User not authorized to add tasks to this project' });
  }

  const task = await Task.create(req.body);

  await logActivity(req.user, 'Task Created', 'Task', task._id, `Manager created task ${task.title}`);

  res.status(201).json({ success: true, data: task });
};

// @desc    Update task (Status, assignment, comments)
// @route   PUT /api/tasks/:id
// @access  Private
exports.updateTask = async (req, res, next) => {
  let task = await Task.findById(req.params.id);

  if (!task) {
    return res.status(404).json({ success: false, message: 'Task not found' });
  }

  // Authorization logic
  const isAssignedDeveloper = task.assignedTo && task.assignedTo.toString() === req.user.id;
  const isAdminOrManager = req.user.role === 'Admin' || req.user.role === 'Manager';

  if (!isAssignedDeveloper && !isAdminOrManager) {
    return res.status(403).json({ success: false, message: 'Not authorized to update this task' });
  }

  // If developer, restrict updates to status and comments
  if (req.user.role === 'Developer' && !isAdminOrManager) {
    const allowedUpdates = ['status', 'comment'];
    const updates = Object.keys(req.body);
    const isValidOperation = updates.every(u => allowedUpdates.includes(u));

    if (!isValidOperation) {
      return res.status(400).json({ success: false, message: 'Developers can only update status and add comments' });
    }
  }

  // Handle comments separately
  if (req.body.comment) {
    task.comments.push({
      text: req.body.comment,
      user: req.user.id
    });
    delete req.body.comment;
  }

  // Update fields
  Object.assign(task, req.body);
  await task.save();

  await logActivity(req.user, 'Task Updated', 'Task', task._id, `${req.user.role} updated task ${task.title}`);

  res.status(200).json({ success: true, data: task });
};
