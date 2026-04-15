const Project = require('../models/Project');
const logActivity = require('../utils/logger');

// @desc    Get all projects
// @route   GET /api/projects
// @access  Private (Admin see all, Manager see own)
exports.getProjects = async (req, res, next) => {
  let query;

  if (req.user.role === 'Admin') {
    query = Project.find().populate('manager', 'name email');
  } else if (req.user.role === 'Manager') {
    query = Project.find({ manager: req.user.id }).populate('manager', 'name email');
  } else {
    return res.status(403).json({ success: false, message: 'Developers cannot list projects directly' });
  }

  const projects = await query;
  res.status(200).json({ success: true, count: projects.length, data: projects });
};

// @desc    Create project
// @route   POST /api/projects
// @access  Private/Manager
exports.createProject = async (req, res, next) => {
  req.body.manager = req.user.id;

  const project = await Project.create(req.body);
  
  await logActivity(req.user, 'Project Created', 'Project', project._id, `Manager created project ${project.name}`);
  
  res.status(201).json({ success: true, data: project });
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private/Manager
exports.updateProject = async (req, res, next) => {
  let project = await Project.findById(req.params.id);

  if (!project) {
    return res.status(404).json({ success: false, message: 'Project not found' });
  }

  // Make sure user is project manager
  if (project.manager.toString() !== req.user.id && req.user.role !== 'Admin') {
    return res.status(401).json({ success: false, message: 'User not authorized to update this project' });
  }

  project = await Project.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  await logActivity(req.user, 'Project Updated', 'Project', project._id, `Manager updated project ${project.name}`);

  res.status(200).json({ success: true, data: project });
};
