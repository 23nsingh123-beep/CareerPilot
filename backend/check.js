require('dotenv').config();
const mongoose = require('mongoose');
const Job = require('./src/models/Job');

async function check() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const jobs = await Job.find({ title: 'DevOps Engineer' });
    console.log(`Found ${jobs.length} jobs.`);
    jobs.forEach(j => {
      console.log(`Job ID: ${j._id} | Company: ${j.companyName} | Owner: ${j.recruiter}`);
    });
  } catch (error) {
    console.error(error);
  } finally {
    await mongoose.disconnect();
  }
}
check();
