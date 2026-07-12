const Application = require('../models/Application');
const Job = require('../models/Job');

exports.applyForJob = async (req, res) => {
  try {
    const { jobId, coverLetter, resume } = req.body;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    if (job.status !== 'active') {
      return res.status(400).json({ error: 'Job is not active' });
    }

    if (job.applicationDeadline && new Date(job.applicationDeadline) < new Date()) {
      return res.status(400).json({ error: 'Job application deadline has expired' });
    }

    // Check duplicate
    const existingApp = await Application.findOne({ student: req.user._id, job: jobId });
    if (existingApp) {
      return res.status(400).json({ error: 'You have already applied for this job' });
    }

    const application = await Application.create({
      student: req.user._id,
      job: jobId,
      recruiter: job.recruiter,
      coverLetter: coverLetter || '',
      resume: resume || '' // Optional for now
    });

    // Increment job applicant count
    await Job.findByIdAndUpdate(jobId, {
      $inc: { applicantCount: 1 }
    });

    res.status(201).json({ success: true, application });
  } catch (error) {
    // Catch Mongoose duplicate key error specifically
    if (error.code === 11000) {
      return res.status(400).json({ error: 'You have already applied for this job' });
    }
    res.status(400).json({ error: error.message });
  }
};

exports.getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ student: req.user._id })
      .populate('job', 'title companyName location employmentType workMode applicationDeadline')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, applications });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getJobApplicants = async (req, res) => {
  try {
    const { jobId } = req.params;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    // Security: Only the recruiter who owns the job can see applicants (or an admin)
    if (req.user.role !== 'admin' && job.recruiter.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'You do not have permission to view these applicants' });
    }

    const applications = await Application.find({ job: jobId })
      .populate('student', 'name email profileImage phone')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, applications });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getRecruiterApplications = async (req, res) => {
  try {
    const { jobId, status, search, page = 1, limit = 10, sort = '-createdAt' } = req.query;

    const query = {};

    // Security: Recruiter sees only their own applications. Admin sees all.
    if (req.user.role !== 'admin') {
      query.recruiter = req.user._id;
    }

    if (jobId) {
      query.job = jobId;
    }

    if (status && status !== 'All') {
      query.status = status;
    }

    // Search against student name/email safely
    if (search) {
      const User = require('../models/User');
      const matchingStudents = await User.find({
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } }
        ]
      }).select('_id');
      const studentIds = matchingStudents.map(s => s._id);
      query.student = { $in: studentIds };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const applications = await Application.find(query)
      .populate('student', 'name email profileImage phone location resume resumeOriginalName resumeUploadedAt resumeAnalysis')
      .populate('job', 'title companyName')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Application.countDocuments(query);

    res.status(200).json({
      success: true,
      applications,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getApplicationById = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate('student', 'name email profileImage phone location resume resumeOriginalName resumeUploadedAt resumeAnalysis')
      .populate('job', 'title companyName location');

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    // Ownership check
    if (req.user.role !== 'admin' && application.recruiter.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'You do not have permission to view this application' });
    }

    res.status(200).json({ success: true, application });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    const validStatuses = ['Applied', 'Under Review', 'Shortlisted', 'Interview', 'Rejected', 'Hired'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const application = await Application.findById(req.params.id)
      .populate('student', 'name email profileImage phone location resume resumeOriginalName resumeUploadedAt resumeAnalysis')
      .populate('job', 'title companyName location');
      
    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    // Ownership check
    if (req.user.role !== 'admin' && application.recruiter.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'You do not have permission to update this application' });
    }

    application.status = status;
    await application.save();

    res.status(200).json({ success: true, application });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
