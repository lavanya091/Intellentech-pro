const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Project = require('../models/Project');
const Task = require('../models/Task');
const ActivityLog = require('../models/ActivityLog');

dotenv.config();

const users = [
  {
    name: 'Rahul Sharma',
    email: 'rahul.sharma@taskapp.dev',
    password: 'Test@123',
    role: 'Admin',
    status: 'Active',
  },
  {
    name: 'Sneha Rao',
    email: 'sneha.rao@pm.dev',
    password: 'Test@123',
    role: 'Manager',
    status: 'Active',
  },
  {
    name: 'Priya Mehta',
    email: 'priya.mehta@taskapp.dev',
    password: 'Test@123',
    role: 'Developer',
    status: 'Active',
  },
  {
    name: 'Arjun Nair',
    email: 'arjun.nair@taskapp.dev',
    password: 'Test@123',
    role: 'Developer',
    status: 'Active',
  },
  {
    name: 'Rohan Das',
    email: 'rohan.das@taskapp.dev',
    password: 'Test@123',
    role: 'Developer',
    status: 'Disabled',
  },
];

const importData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    // Clear existing data
    await User.deleteMany();
    await Project.deleteMany();
    await Task.deleteMany();
    await ActivityLog.deleteMany();

    console.log('Data Cleared...');

    // Load Users
    const createdUsers = await User.create(users);
    const admin = createdUsers[0];
    const manager = createdUsers[1];
    const dev1 = createdUsers[2];
    const dev2 = createdUsers[3];

    console.log('Users Created...');

    // Load Projects
    const projects = [
      {
        name: 'Website Redesign',
        description: 'Overhaul the company website with modern UI/UX.',
        manager: manager._id,
      },
      {
        name: 'Mobile App Development',
        description: 'Build a cross-platform mobile app for task management.',
        manager: manager._id,
      },
    ];

    const createdProjects = await Project.create(projects);
    const proj1 = createdProjects[0];
    const proj2 = createdProjects[1];

    console.log('Projects Created...');

    // Load Tasks
    const tasks = [
      {
        title: 'Design Hero Section',
        description: 'Create a stunning hero section for the landing page.',
        status: 'Done',
        priority: 'High',
        project: proj1._id,
        assignedTo: dev1._id,
      },
      {
        title: 'Setup Backend API',
        description: 'Implement core API endpoints for users and projects.',
        status: 'In Progress',
        priority: 'Medium',
        project: proj1._id,
        assignedTo: dev2._id,
      },
      {
        title: 'Implement Task List View',
        description: 'Build a responsive list view for tasks.',
        status: 'To Do',
        priority: 'Low',
        project: proj1._id,
        assignedTo: dev1._id,
      },
      {
        title: 'Create Figma Mockups',
        description: 'Design all screens for the mobile app in Figma.',
        status: 'Done',
        priority: 'High',
        project: proj2._id,
        assignedTo: dev2._id,
      },
      {
        title: 'CI/CD Pipeline Setup',
        description: 'Configure GitHub Actions for automated testing and deployment.',
        status: 'To Do',
        priority: 'Medium',
        project: proj2._id,
        assignedTo: dev1._id,
      },
    ];

    await Task.create(tasks);

    console.log('Tasks Created...');
    console.log('Data Imported successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

importData();
