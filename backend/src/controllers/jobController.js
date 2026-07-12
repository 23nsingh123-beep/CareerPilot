const Job = require('../models/Job');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

exports.createJob = async (req, res) => {
  try {
    const { recruiter, applicantCount, ...jobData } = req.body;

    const job = await Job.create({
      ...jobData,
      recruiter: req.user._id
    });

    res.status(201).json({ success: true, job });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAllJobs = async (req, res) => {
  try {
    const { search, employmentType, workMode, location, status, page = 1, limit = 10, sort } = req.query;

    let userRole = 'public';
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      const token = req.headers.authorization.split(' ')[1];
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId);
        if (user && user.isActive) userRole = user.role;
      } catch (err) {}
    }

    let query = {};

    if (userRole === 'public' || userRole === 'student') {
      query.status = 'active';
    } else if (status) {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { companyName: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    if (employmentType && ['full-time', 'part-time', 'internship', 'contract'].includes(employmentType)) {
      query.employmentType = employmentType;
    }
    if (workMode) query.workMode = workMode;
    if (location) query.location = { $regex: location, $options: 'i' };

    let sortQuery = { createdAt: -1 };
    if (sort) {
      const sortParts = sort.split(':');
      sortQuery = { [sortParts[0]]: sortParts[1] === 'desc' ? -1 : 1 };
    }

    const limitNum = parseInt(limit, 10);
    const skipNum = (parseInt(page, 10) - 1) * limitNum;

    const jobs = await Job.find(query)
      .populate('recruiter', 'name email profileImage')
      .sort(sortQuery)
      .skip(skipNum)
      .limit(limitNum);

    const total = await Job.countDocuments(query);

    res.status(200).json({
      success: true,
      count: jobs.length,
      total,
      page: parseInt(page, 10),
      totalPages: Math.ceil(total / limitNum),
      jobs
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getJobById = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(404).json({ error: 'Invalid Job ID' });
    }

    const job = await Job.findById(req.params.id).populate('recruiter', 'name email profileImage');

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    res.status(200).json({ success: true, job });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getRecruiterJobs = async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'recruiter') {
      query.recruiter = req.user._id;
    }

    const jobs = await Job.find(query).sort({ createdAt: -1 }).populate('recruiter', 'name email profileImage');

    res.status(200).json({ success: true, count: jobs.length, jobs });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateJob = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(404).json({ error: 'Invalid Job ID' });
    }

    let job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    if (req.user.role === 'recruiter' && job.recruiter.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized to update this job' });
    }

    const { recruiter, applicantCount, ...updateData } = req.body;
    Object.assign(job, updateData);

    await job.save();

    res.status(200).json({ success: true, job });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteJob = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(404).json({ error: 'Invalid Job ID' });
    }

    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    if (req.user.role === 'recruiter' && job.recruiter.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized to delete this job' });
    }

    await job.deleteOne();

    res.status(200).json({ success: true, message: 'Job deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateJobStatus = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(404).json({ error: 'Invalid Job ID' });
    }

    const { status } = req.body;
    if (!['draft', 'active', 'closed', 'expired'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    let job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    if (req.user.role === 'recruiter' && job.recruiter.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized to update this job status' });
    }

    job.status = status;
    await job.save();

    res.status(200).json({ success: true, job });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
