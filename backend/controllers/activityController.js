const ActivityLog = require('../models/ActivityLog');
const Project = require('../models/Project');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Get activity logs
// @route   GET /api/activity
// @access  Private (Admin see all, Manager see project-related)
exports.getActivityLogs = asyncHandler(async (req, res, next) => {
  let filter = {};

  // Managers only see activity related to their own projects (all actions on those projects/tasks)
  if (req.user.role === 'Manager') {
    const Task = require('../models/Task');

    // Get all projects the manager owns
    const projects = await Project.find({ manager: req.user.id });
    const projectIds = projects.map(p => p._id);

    // Get all tasks in those projects
    const tasks = await Task.find({ project: { $in: projectIds } });
    const taskIds = tasks.map(t => t._id);

    // Filter: activity where entityType is Project (in manager's projects)
    //      OR entityType is Task (in manager's projects)
    //      OR performed by the manager themselves
    filter = {
      $or: [
        { entityType: 'Project', entityId: { $in: projectIds } },
        { entityType: 'Task', entityId: { $in: taskIds } },
        { user: req.user.id },
      ],
    };
  }


  // Support Query Filters
  if (req.query.user) filter.user = req.query.user;
  if (req.query.action) filter.action = req.query.action;
  
  // Date Range Filter
  if (req.query.startDate || req.query.endDate) {
    filter.timestamp = {};
    if (req.query.startDate) {
      filter.timestamp.$gte = new Date(req.query.startDate);
    }
    if (req.query.endDate) {
      const endDate = new Date(req.query.endDate);
      // Set to the very end of the day in UTC to make the filter inclusive
      endDate.setUTCHours(23, 59, 59, 999);
      filter.timestamp.$lte = endDate;
    }
  }

  const logs = await ActivityLog.find(filter)
    .sort('-timestamp')
    .populate('user', 'name email');

  res.status(200).json({ success: true, count: logs.length, data: logs });
});
