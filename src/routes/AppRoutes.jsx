import React, { Suspense, lazy } from 'react'
import { Routes, Route } from 'react-router-dom'
import LandingLayout from '../layouts/LandingLayout.jsx'
import StudentLayout from '../layouts/StudentLayout.jsx'

const LandingPage = lazy(() => import('../pages/LandingPage.jsx'))
const LoginPage = lazy(() => import('../pages/LoginPage.jsx'))
const SignUpPage = lazy(() => import('../pages/SignUpPage.jsx'))
const StudentDashboard = lazy(() => import('../pages/StudentDashboard.jsx'))
const ResumeUpload = lazy(() => import('../pages/ResumeUpload.jsx'))
const ResumeAnalysis = lazy(() => import('../pages/ResumeAnalysis.jsx'))
const JobListings = lazy(() => import('../pages/JobListings.jsx'))
const JobDetails = lazy(() => import('../pages/JobDetails.jsx'))
const Applications = lazy(() => import('../pages/Applications.jsx'))
const Profile = lazy(() => import('../pages/Profile.jsx'))
const Settings = lazy(() => import('../pages/Settings.jsx'))
const RecruiterDashboard = lazy(() => import('../pages/RecruiterDashboard.jsx'))
const RecruiterPostJob = lazy(() => import('../pages/RecruiterPostJob.jsx'))
const RecruiterManageJobs = lazy(() => import('../pages/RecruiterManageJobs.jsx'))
const RecruiterApplicants = lazy(() => import('../pages/RecruiterApplicants.jsx'))
const RecruiterCompanyProfile = lazy(() => import('../pages/RecruiterCompanyProfile.jsx'))
const RecruiterSettings = lazy(() => import('../pages/RecruiterSettings.jsx'))
const AdminDashboard = lazy(() => import('../pages/AdminDashboard.jsx'))
const AdminUserManagement = lazy(() => import('../pages/AdminUserManagement.jsx'))
const AdminReportsAnalytics = lazy(() => import('../pages/AdminReportsAnalytics.jsx'))
const AdminAnnouncements = lazy(() => import('../pages/AdminAnnouncements.jsx'))

function AppRoutes() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-surface"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>}>
      <Routes>
        {/* Landing route uses light Stitch theme layout */}
        <Route path="/" element={<LandingLayout />}>
          <Route index element={<LandingPage />} />
        </Route>

        {/* Auth routes — standalone layouts, untouched */}
        <Route path="/login"  element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />

        {/* Student Layout Routes */}
        <Route element={<StudentLayout variant="student" />}>
          {/* Student Dashboard */}
          <Route path="/dashboard/student" element={<StudentDashboard />} />
          <Route path="/dashboard" element={<StudentDashboard />} />

          {/* Resume Management */}
          <Route path="/resume/upload" element={<ResumeUpload />} />
          <Route path="/resume/analysis" element={<ResumeAnalysis />} />
          <Route path="/resume"        element={<ResumeUpload />} />

          {/* Jobs */}
          <Route path="/jobs"         element={<JobListings />} />
          <Route path="/jobs/:id"     element={<JobDetails />} />
          <Route path="/applications" element={<Applications />} />
          <Route path="/profile"      element={<Profile />} />
          <Route path="/settings"     element={<Settings />} />
        </Route>

        {/* Recruiter Layout Routes */}
        <Route element={<StudentLayout variant="recruiter" />}>
          <Route path="/recruiter" element={<RecruiterDashboard />} />
          <Route path="/dashboard/recruiter" element={<RecruiterDashboard />} />
          <Route path="/recruiter/post-job" element={<RecruiterPostJob />} />
          <Route path="/recruiter/manage-jobs" element={<RecruiterManageJobs />} />
          <Route path="/recruiter/jobs/:id" element={<JobDetails />} />
          <Route path="/recruiter/applicants" element={<RecruiterApplicants />} />
          <Route path="/recruiter/company-profile" element={<RecruiterCompanyProfile />} />
          <Route path="/recruiter/settings" element={<RecruiterSettings />} />
        </Route>

        {/* Admin Layout Routes */}
        <Route element={<StudentLayout variant="admin" />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminUserManagement />} />
          <Route path="/admin/reports" element={<AdminReportsAnalytics />} />
          <Route path="/admin/announcements" element={<AdminAnnouncements />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<LandingPage />} />
      </Routes>
    </Suspense>
  )
}

export default AppRoutes
