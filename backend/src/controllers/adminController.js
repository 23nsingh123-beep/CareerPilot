const User = require('../models/User');
const Job = require('../models/Job');
const Application = require('../models/Application');
const Announcement = require('../models/Announcement');

exports.getDashboardData = async (req, res) => {
  try {
    // 1. Stats
    const totalUsers = await User.countDocuments();
    const students = await User.countDocuments({ role: 'student' });
    const recruiters = await User.countDocuments({ role: 'recruiter' });
    const activeUsers = await User.countDocuments({ isActive: true });
    
    const activeJobs = await Job.countDocuments({ status: 'active' });
    const totalJobs = await Job.countDocuments();
    
    const totalApplications = await Application.countDocuments();
    const pendingApplications = await Application.countDocuments({ status: { $in: ['Applied', 'Under Review'] } });
    const shortlistedApplications = await Application.countDocuments({ status: 'Shortlisted' });
    const interviews = await Application.countDocuments({ status: 'Interview' });
    const hired = await Application.countDocuments({ status: 'Hired' });
    
    const resumeAnalyses = await User.countDocuments({ 'resumeAnalysis.analyzedAt': { $exists: true, $ne: null } });

    // 2. Recent Users (latest 5, safe fields)
    const recentUsers = await User.find()
      .select('name email role isActive createdAt profileImage')
      .sort({ createdAt: -1 })
      .limit(5);

    // 3. Recent Jobs (latest 5, safe fields)
    const recentJobs = await Job.find()
      .select('title companyName location employmentType status createdAt applicantCount recruiter')
      .populate('recruiter', 'name email')
      .sort({ createdAt: -1 })
      .limit(5);

    // 4. Recent Applications (latest 5, safe fields)
    const recentApplications = await Application.find()
      .select('student job status createdAt')
      .populate('student', 'name email profileImage')
      .populate('job', 'title companyName')
      .sort({ createdAt: -1 })
      .limit(5);

    // 5. Growth Data (Weekly or Monthly)
    const period = req.query.period === 'weekly' ? 'weekly' : 'monthly';
    const growthData = [];

    if (period === 'weekly') {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
      sevenDaysAgo.setHours(0,0,0,0);

      const matchStage = { $match: { createdAt: { $gte: sevenDaysAgo } } };
      const groupStage = {
        $group: {
          _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" }, day: { $dayOfMonth: "$createdAt" } },
          count: { $sum: 1 }
        }
      };
      const sortStage = { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } };

      const [userGrowth, jobGrowth, appGrowth] = await Promise.all([
        User.aggregate([matchStage, groupStage, sortStage]),
        Job.aggregate([matchStage, groupStage, sortStage]),
        Application.aggregate([matchStage, groupStage, sortStage])
      ]);

      const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      for (let i = 0; i < 7; i++) {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i));
        const year = d.getFullYear();
        const month = d.getMonth() + 1;
        const day = d.getDate();
        
        const userCount = userGrowth.find(g => g._id.year === year && g._id.month === month && g._id.day === day)?.count || 0;
        const jobCount = jobGrowth.find(g => g._id.year === year && g._id.month === month && g._id.day === day)?.count || 0;
        const appCount = appGrowth.find(g => g._id.year === year && g._id.month === month && g._id.day === day)?.count || 0;

        growthData.push({
          label: daysOfWeek[d.getDay()],
          year,
          month,
          day,
          users: userCount,
          jobs: jobCount,
          applications: appCount
        });
      }
    } else {
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
      sixMonthsAgo.setDate(1);
      sixMonthsAgo.setHours(0,0,0,0);

      const matchStage = { $match: { createdAt: { $gte: sixMonthsAgo } } };
      const groupStage = {
        $group: {
          _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
          count: { $sum: 1 }
        }
      };
      const sortStage = { $sort: { "_id.year": 1, "_id.month": 1 } };

      const [userGrowth, jobGrowth, appGrowth] = await Promise.all([
        User.aggregate([matchStage, groupStage, sortStage]),
        Job.aggregate([matchStage, groupStage, sortStage]),
        Application.aggregate([matchStage, groupStage, sortStage])
      ]);

      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      for (let i = 0; i < 6; i++) {
        const d = new Date();
        d.setMonth(d.getMonth() - (5 - i));
        const year = d.getFullYear();
        const month = d.getMonth() + 1;
        
        const userCount = userGrowth.find(g => g._id.year === year && g._id.month === month)?.count || 0;
        const jobCount = jobGrowth.find(g => g._id.year === year && g._id.month === month)?.count || 0;
        const appCount = appGrowth.find(g => g._id.year === year && g._id.month === month)?.count || 0;

        growthData.push({
          label: monthNames[month - 1],
          month: monthNames[month - 1], // For backward compatibility if needed by export
          year,
          users: userCount,
          jobs: jobCount,
          applications: appCount
        });
      }
    }

    res.status(200).json({
      success: true,
      period,
      stats: {
        totalUsers,
        students,
        recruiters,
        activeUsers,
        activeJobs,
        totalJobs,
        totalApplications,
        pendingApplications,
        shortlistedApplications,
        interviews,
        hired,
        resumeAnalyses
      },
      recentUsers,
      recentJobs,
      recentApplications,
      growthData
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const { search, role, status, page = 1, limit = 10, sort } = req.query;
    let query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    if (role && role !== 'All') {
      query.role = role.toLowerCase();
    }

    if (status && status !== 'All') {
      query.isActive = status.toLowerCase() === 'active';
    }

    let sortQuery = { createdAt: -1 };
    if (sort) {
      // If we implement sorting logic like 'Newest' etc.
      if (sort === 'Newest') sortQuery = { createdAt: -1 };
      else if (sort === 'Oldest') sortQuery = { createdAt: 1 };
    }

    const limitNum = parseInt(limit, 10);
    const skipNum = (parseInt(page, 10) - 1) * limitNum;

    const users = await User.find(query)
      .select('_id name email role profileImage phone location isActive lastLogin createdAt resumeOriginalName resumeUploadedAt resumeAnalysis.analyzedAt')
      .sort(sortQuery)
      .skip(skipNum)
      .limit(limitNum);

    const total = await User.countDocuments(query);

    res.status(200).json({
      success: true,
      count: users.length,
      total,
      page: parseInt(page, 10),
      totalPages: Math.ceil(total / limitNum),
      users
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('_id name email role profileImage phone location isActive lastLogin createdAt resumeOriginalName resumeUploadedAt resumeAnalysis.analyzedAt');
      
    if (!user) return res.status(404).json({ error: 'User not found' });

    let extraStats = {};
    if (user.role === 'recruiter') {
      extraStats.jobCount = await Job.countDocuments({ recruiter: user._id });
    } else if (user.role === 'student') {
      extraStats.applicationCount = await Application.countDocuments({ student: user._id });
    }

    res.status(200).json({ success: true, user: { ...user.toObject(), ...extraStats } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateUserStatus = async (req, res) => {
  try {
    const { isActive } = req.body;
    
    if (req.user._id.toString() === req.params.id) {
      return res.status(400).json({ error: 'You cannot disable your own account' });
    }

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.isActive = isActive;
    await user.save();

    res.status(200).json({ 
      success: true, 
      user: {
        _id: user._id, name: user.name, email: user.email, role: user.role, isActive: user.isActive
      } 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateUserRole = async (req, res) => {
  try {
    let { role } = req.body;
    
    if (!['student', 'recruiter', 'admin'].includes(role.toLowerCase())) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    role = role.toLowerCase();

    if (req.user._id.toString() === req.params.id && req.user.role === 'admin' && role !== 'admin') {
      return res.status(400).json({ error: 'You cannot remove your own admin privileges' });
    }

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.role = role;
    await user.save();

    res.status(200).json({ 
      success: true, 
      user: {
        _id: user._id, name: user.name, email: user.email, role: user.role, isActive: user.isActive
      } 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    if (req.user._id.toString() === req.params.id) {
      return res.status(400).json({ error: 'You cannot delete your own account' });
    }

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (user.role === 'student') {
      const appCount = await Application.countDocuments({ student: user._id });
      if (appCount > 0) {
         return res.status(400).json({ error: `Cannot delete user: ${appCount} associated applications exist.` });
      }
    } else if (user.role === 'recruiter') {
      const jobCount = await Job.countDocuments({ recruiter: user._id });
      if (jobCount > 0) {
         return res.status(400).json({ error: `Cannot delete user: ${jobCount} associated jobs exist.` });
      }
    }

    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

exports.getReports = async (req, res) => {
  try {
    let { range } = req.query;
    const allowedRanges = ['7d', '30d', '90d', '6m', '1y'];
    if (!allowedRanges.includes(range)) {
      range = '30d';
    }

    const now = new Date();
    let startDate = new Date();
    let prevStartDate = new Date();
    let groupByFormat = '%Y-%m-%d';

    if (range === '7d') {
      startDate.setDate(now.getDate() - 7);
      prevStartDate.setDate(now.getDate() - 14);
    } else if (range === '30d') {
      startDate.setDate(now.getDate() - 30);
      prevStartDate.setDate(now.getDate() - 60);
    } else if (range === '90d') {
      startDate.setDate(now.getDate() - 90);
      prevStartDate.setDate(now.getDate() - 180);
    } else if (range === '6m') {
      startDate.setMonth(now.getMonth() - 6);
      prevStartDate.setMonth(now.getMonth() - 12);
      groupByFormat = '%Y-%m';
    } else if (range === '1y') {
      startDate.setFullYear(now.getFullYear() - 1);
      prevStartDate.setFullYear(now.getFullYear() - 2);
      groupByFormat = '%Y-%m';
    }

    // 1. Summary Metrics
    const totalUsers = await User.countDocuments();
    const totalApplications = await Application.countDocuments();
    const activeJobs = await Job.countDocuments({ status: 'active' });
    const resumeAnalyses = await User.countDocuments({ 'resumeAnalysis.analyzedAt': { $exists: true, $ne: null } });

    // Platform Growth (Users in current period vs prev period)
    const currentUsers = await User.countDocuments({ createdAt: { $gte: startDate, $lt: now } });
    const prevUsers = await User.countDocuments({ createdAt: { $gte: prevStartDate, $lt: startDate } });
    let platformGrowth = 0;
    if (prevUsers > 0) {
      platformGrowth = ((currentUsers - prevUsers) / prevUsers) * 100;
    } else if (currentUsers > 0) {
      platformGrowth = 100;
    }

    // Average Resume Scores
    const scoredUsers = await User.find({ 'resumeAnalysis.overallScore': { $gt: 0 } }).select('resumeAnalysis');
    let avgResumeScore = 0;
    let avgAtsScore = 0;
    if (scoredUsers.length > 0) {
      avgResumeScore = scoredUsers.reduce((sum, u) => sum + (u.resumeAnalysis.overallScore || 0), 0) / scoredUsers.length;
      avgAtsScore = scoredUsers.reduce((sum, u) => sum + (u.resumeAnalysis.atsScore || 0), 0) / scoredUsers.length;
    }

    // Hiring Success Rate
    const hiredApps = await Application.countDocuments({ status: 'Hired' });
    let hiringSuccessRate = 0;
    if (totalApplications > 0) {
      hiringSuccessRate = (hiredApps / totalApplications) * 100;
    }

    // 2. Time Series
    const generateDateBuckets = (start, end, format) => {
      const buckets = [];
      let current = new Date(start);
      while (current <= end) {
        let key = '';
        if (format === '%Y-%m-%d') {
          key = current.toISOString().split('T')[0];
          current.setDate(current.getDate() + 1);
        } else {
          key = `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, '0')}`;
          current.setMonth(current.getMonth() + 1);
        }
        buckets.push({ date: key, count: 0 });
      }
      return buckets;
    };

    const buckets = generateDateBuckets(startDate, now, groupByFormat);
    
    const getTimeSeries = async (Model, dateField) => {
      const match = { [dateField]: { $gte: startDate, $lte: now } };
      if (Model.modelName === 'User' && dateField === 'resumeAnalysis.analyzedAt') {
        match[dateField] = { $gte: startDate, $lte: now, $ne: null };
      }
      
      const agg = await Model.aggregate([
        { $match: match },
        { $group: { _id: { $dateToString: { format: groupByFormat, date: `$${dateField}` } }, count: { $sum: 1 } } }
      ]);
      const series = JSON.parse(JSON.stringify(buckets));
      agg.forEach(item => {
        const bucket = series.find(b => b.date === item._id);
        if (bucket) bucket.count = item.count;
      });
      return series;
    };

    const usersSeries = await getTimeSeries(User, 'createdAt');
    const jobsSeries = await getTimeSeries(Job, 'createdAt');
    const appsSeries = await getTimeSeries(Application, 'createdAt');
    const resumeAnalysesSeries = await getTimeSeries(User, 'resumeAnalysis.analyzedAt');

    // 3. Recruitment Analytics
    const topCompanies = await Job.aggregate([
      { $group: { _id: "$companyName", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    const mostAppliedJobs = await Application.aggregate([
      { $group: { _id: "$job", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
      { $lookup: { from: 'jobs', localField: '_id', foreignField: '_id', as: 'jobDetails' } },
      { $unwind: "$jobDetails" },
      { $project: { title: "$jobDetails.title", company: "$jobDetails.companyName", count: 1 } }
    ]);

    const appStatusBreakdown = await Application.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const topRecruitersJobs = await Job.aggregate([
      { $group: { _id: "$recruiter", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
      { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'user' } },
      { $unwind: "$user" },
      { $project: { name: "$user.name", email: "$user.email", count: 1 } }
    ]);

    const topJobRoles = await Application.aggregate([
      { $lookup: { from: 'jobs', localField: 'job', foreignField: '_id', as: 'jobDetails' } },
      { $unwind: "$jobDetails" },
      { $group: { _id: "$jobDetails.title", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    // 4. AI Performance Analytics
    const topMissingSkills = await User.aggregate([
      { $match: { 'resumeAnalysis.missingSkills': { $exists: true, $ne: [] } } },
      { $unwind: '$resumeAnalysis.missingSkills' },
      { $group: { _id: '$resumeAnalysis.missingSkills', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    const topRecommendedRoles = await User.aggregate([
      { $match: { 'resumeAnalysis.recommendedRoles': { $exists: true, $ne: [] } } },
      { $unwind: '$resumeAnalysis.recommendedRoles' },
      { $group: { _id: '$resumeAnalysis.recommendedRoles', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    const sectionScores = await User.aggregate([
      { $match: { 'resumeAnalysis.overallScore': { $gt: 0 } } },
      { $group: {
        _id: null,
        summary: { $avg: '$resumeAnalysis.sectionScores.summary' },
        experience: { $avg: '$resumeAnalysis.sectionScores.experience' },
        education: { $avg: '$resumeAnalysis.sectionScores.education' },
        skills: { $avg: '$resumeAnalysis.sectionScores.skills' },
        projects: { $avg: '$resumeAnalysis.sectionScores.projects' },
        certifications: { $avg: '$resumeAnalysis.sectionScores.certifications' }
      }}
    ]);

    // 5. System Health
    const dbStatus = mongoose.connection.readyState === 1 ? 'online' : 'offline';
    const apiStatus = 'online';
    const authStatus = process.env.JWT_SECRET ? 'online' : 'offline';
    const geminiStatus = process.env.GEMINI_API_KEY ? 'available' : 'unavailable';
    
    let storageStatus = 'unavailable';
    try {
      // Use process.cwd() or path relative to app to safely check standard uploads dir
      const uploadDir = path.join(__dirname, '../../uploads');
      if (fs.existsSync(uploadDir)) {
        storageStatus = 'available';
      }
    } catch (e) {}

    res.status(200).json({
      success: true,
      range,
      summary: {
        totalUsers,
        totalApplications,
        activeJobs,
        resumeAnalyses,
        platformGrowth: Math.round(platformGrowth * 10) / 10,
        averageResumeScore: Math.round(avgResumeScore * 10) / 10,
        averageAtsScore: Math.round(avgAtsScore * 10) / 10,
        averageJobMatchScore: 0, // AI Job Match module not implemented yet
        hiringSuccessRate: Math.round(hiringSuccessRate * 10) / 10
      },
      timeSeries: {
        users: usersSeries,
        jobs: jobsSeries,
        applications: appsSeries,
        resumeAnalyses: resumeAnalysesSeries
      },
      recruitment: {
        topCompanies: topCompanies.map(c => ({ name: c._id, count: c.count })),
        topJobRoles: topJobRoles.map(c => ({ name: c._id, count: c.count })),
        mostAppliedJobs: mostAppliedJobs,
        applicationStatusBreakdown: appStatusBreakdown.map(s => ({ status: s._id, count: s.count })),
        topRecruiters: topRecruitersJobs
      },
      aiPerformance: {
        topMissingSkills: topMissingSkills.map(s => ({ skill: s._id, count: s.count })),
        topRecommendedSkills: [], // Unused due to sentence contamination
        topRecommendedRoles: topRecommendedRoles.map(s => ({ role: s._id, count: s.count })),
        averageSectionScores: sectionScores.length > 0 ? {
          summary: Math.round(sectionScores[0].summary || 0),
          experience: Math.round(sectionScores[0].experience || 0),
          education: Math.round(sectionScores[0].education || 0),
          skills: Math.round(sectionScores[0].skills || 0),
          projects: Math.round(sectionScores[0].projects || 0),
          certifications: Math.round(sectionScores[0].certifications || 0)
        } : {}
      },
      systemHealth: {
        api: apiStatus,
        database: dbStatus,
        gemini: geminiStatus,
        authentication: authStatus,
        storage: storageStatus
      }
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createAnnouncement = async (req, res) => {
  try {
    const { title, message, audience } = req.body;
    
    if (!title || !title.trim()) return res.status(400).json({ error: 'Title is required' });
    if (!message || !message.trim()) return res.status(400).json({ error: 'Message is required' });
    
    const announcement = await Announcement.create({
      title: title.trim(),
      message: message.trim(),
      audience: ['all', 'student', 'recruiter'].includes(audience) ? audience : 'all',
      createdBy: req.user._id
    });
    
    res.status(201).json({ success: true, announcement });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find()
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, announcements });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateAnnouncementStatus = async (req, res) => {
  try {
    const { isActive } = req.body;
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid announcement ID' });
    }
    
    const announcement = await Announcement.findById(req.params.id);
    if (!announcement) return res.status(404).json({ error: 'Announcement not found' });
    
    announcement.isActive = isActive;
    await announcement.save();
    
    res.status(200).json({ success: true, announcement });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteAnnouncement = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid announcement ID' });
    }
    
    const announcement = await Announcement.findByIdAndDelete(req.params.id);
    if (!announcement) return res.status(404).json({ error: 'Announcement not found' });
    
    res.status(200).json({ success: true, message: 'Announcement deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.updateAnnouncement = async (req, res) => {
  try {
    const { title, message, audience } = req.body;

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid announcement ID' });
    }

    if (!title || !title.trim()) return res.status(400).json({ error: 'Title is required' });
    if (!message || !message.trim()) return res.status(400).json({ error: 'Message is required' });
    if (!['all', 'student', 'recruiter'].includes(audience)) {
      return res.status(400).json({ error: 'Invalid audience' });
    }

    const announcement = await Announcement.findById(req.params.id);
    if (!announcement) return res.status(404).json({ error: 'Announcement not found' });

    announcement.title = title.trim();
    announcement.message = message.trim();
    announcement.audience = audience;

    await announcement.save();

    res.status(200).json({ success: true, announcement });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
