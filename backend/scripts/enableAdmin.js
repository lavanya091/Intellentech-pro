const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config();

const enableAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB...');

    const user = await User.findOneAndUpdate(
      { email: 'rahul.sharma@taskapp.dev' },
      { status: 'Active' },
      { new: true }
    );

    if (!user) {
      console.log('❌ User not found! Check the email address.');
      process.exit(1);
    }

    console.log(`✅ Admin re-enabled successfully!`);
    console.log(`   Name  : ${user.name}`);
    console.log(`   Email : ${user.email}`);
    console.log(`   Role  : ${user.role}`);
    console.log(`   Status: ${user.status}`);
    process.exit(0);
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
};

enableAdmin();
