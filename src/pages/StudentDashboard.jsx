import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import applicationService from '../services/applicationService'
import AnnouncementBanner from '../components/AnnouncementBanner'

/* ─────────────────────────────────────────────────────────────
   Toast Notification (Dashboard-specific interactive element)
───────────────────────────────────────────────────────────── */
function ToastNotification() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 1000)
    return () => clearTimeout(timer)
  }, [])

  if (!visible) return null

  return (
    <div className="fixed bottom-xl right-xl z-50 animate-slide-up">
      <div className="bg-inverse-surface text-inverse-on-surface p-md rounded-xl shadow-xl flex items-center gap-md max-w-sm">
        <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
          <span className="material-symbols-outlined text-on-primary">celebration</span>
        </div>
        <div className="min-w-0">
          <p className="font-label-md text-label-md font-bold">New Match!</p>
          <p className="font-body-sm text-body-sm text-inverse-on-surface/80">
            NVIDIA just posted a Product Designer role that matches your skills.
          </p>
        </div>
        <button
          onClick={() => setVisible(false)}
          className="ml-auto text-inverse-on-surface/50 hover:text-inverse-on-surface flex-shrink-0"
        >
          <span className="material-symbols-outlined">close</span>
        </button>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────
   Main Dashboard Page Content
───────────────────────────────────────────────────────────── */
function StudentDashboard() {
  const communityAvatars = [
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCjJvTF7MmYu67icKsFuSVO-253KyLVh1PlYs7YPBwm1M1x_KtTAPfDgr7VzaQKlV5srR9L1k5XkowEzMacce8wQ_bXghW1-Rjp9y8VL4w6AC978SnQQHSd20ubcSBRjOwarQUrS8aQb_WBcRljTvA8qxNgqKUh4y26_EECAswHzL4v-5PKM5IFywq3Xfz13emVDxisaJ3bs4iFQ_tBgV16UDk5F-gIosGfdLfiRKFQ0JDrQf9yD4UIMQ',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBeuV7vTlJMd2kBmY1QzfV_3bekwso6_rpiVwJ6RsFqo-6oQOlgDkZ8CaJZ_13iAlLfHv5GHagG6khXDmTLLu2lODy3OvicwLHZpo1ABLHhtcmPiH-XgMbNbx9K-WPjyDu3z8VPCZrdgpAdDF8hSemhK6j1qXUNxuXYB1wDoh5KGRFNnEYruFZMNjy6oqeTeeSlpV1WAXf1ZpYVQTsM5n_zRldhZRQyNhYA9fuE2bPNOZ0AFb9JTTCfQA',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuB0p2J6-Pk93KKon8NiJ0oc58ADZDsy-Qex-vbX1f2N9_gmNLA4W_8-VbW0ZBtxHeKsvjIZ8gDxK9V5PzCIOr4c0mDnogY2YWQmx4Fmq0jdJMZVXzAcSXTV3-FDxziCGCX-V2ET1UMlP5q_PAQWf8Hgi5uxmBpSt4IB4Qud_ja0REqQKo10Y11nQuhFvLeRxgvD_7ueQpuYOPc67KkxyWyjZtf_CzJWjqqNBfSbHO8tUefUmj8r71DNvQ',
  ]

  const feedbackItems = [
    {
      icon: 'report',
      color: 'text-error',
      borderColor: 'border-error/20',
      title: 'Missing Action Verbs',
      text: 'Your experience bullets start with "Responsible for" instead of "Led" or "Architected".',
    },
    {
      icon: 'update',
      color: 'text-tertiary',
      borderColor: 'border-tertiary/20',
      title: 'Skills section needs update',
      text: 'Industry standards suggest grouping tools like "Figma" and "Adobe XD" under "Design Stack".',
    },
    {
      icon: 'tips_and_updates',
      color: 'text-primary',
      borderColor: 'border-primary/10',
      bgClass: 'bg-white/50',
      title: 'Suggestion',
      text: 'Quantify your impact in the "Internship" role. Use percentages or dollar values.',
    },
  ]

  const recommendedJobs = [
    {
      initial: 'G', bgColor: 'bg-[#E6F3FF]', textColor: 'text-[#0061FF]',
      company: 'Google', role: 'UX Designer • Mountain View, CA',
      match: 94, time: '2 days ago',
    },
    {
      initial: 'S', bgColor: 'bg-[#635BFF]', textColor: 'text-white',
      company: 'Stripe', role: 'Interaction Designer • Remote',
      match: 88, time: '5 hours ago',
    },
    {
      initial: 'A', bgColor: 'bg-[#000000]', textColor: 'text-white',
      company: 'Airbnb', role: 'Product Design Intern • SF, CA',
      match: 82, time: 'Yesterday',
    },
  ]

  const recentApplications = [
    {
      company: 'Apple', role: 'Design System Engineer',
      status: 'Under Review', statusClass: 'bg-surface-container-highest text-on-surface-variant',
      progress: 45, extra: null,
    },
    {
      company: 'Meta', role: 'Product Design Lead',
      status: 'Interview Scheduled', statusClass: 'bg-primary-container text-on-primary-container',
      progress: 80, extra: { icon: 'calendar_today', text: 'Tuesday, 10:00 AM' },
    },
    {
      company: 'Figma', role: 'Visual Design Intern',
      status: 'Applied', statusClass: 'bg-surface-container-highest text-on-surface-variant',
      progress: 20, extra: null,
    },
  ]

  return (
    <>
      <div className="max-w-container-max mx-auto w-full flex-1 mb-24">
      <AnnouncementBanner />
      
      {/* Dashboard Header */}
      {/* ── Welcome Section ────────────────────────────────────────── */}
      <section className="mb-2xl flex justify-between items-end">
        <div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface">
            Welcome back, Alex!
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant mt-xs">
            You're making great progress. Your profile is in the top 10% for Product Design roles.
          </p>
        </div>
        <div className="hidden lg:flex items-center gap-md p-sm bg-surface-container-high rounded-xl">
          <div className="flex -space-x-2">
            {communityAvatars.map((src, i) => (
              <img
                key={i}
                className="w-8 h-8 rounded-full border-2 border-surface object-cover"
                src={src}
                alt="Student avatar"
              />
            ))}
          </div>
          <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">
            +12 Students applying today
          </span>
        </div>
      </section>

      {/* ── Metrics Row (Bento Style) ────────────────────────────── */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-lg mb-2xl">
        {/* Resume Score */}
        <div className="bg-surface-container-lowest rounded-2xl p-lg shadow-soft card-border flex flex-col items-center justify-center text-center hover:translate-y-[-2px] transition-transform duration-200 hover:shadow-md">
          <div className="relative w-32 h-32 mb-md">
            <svg className="w-full h-full -rotate-90 transform-origin-center" viewBox="0 0 100 100">
              <circle
                className="text-surface-container-high stroke-current"
                cx="50" cy="50" r="40"
                fill="transparent" strokeWidth="8"
              />
              <circle
                className="text-primary stroke-current transition-all duration-1000 ease-out"
                cx="50" cy="50" r="40"
                fill="transparent" strokeWidth="8"
                strokeLinecap="round"
                style={{ strokeDasharray: 251.327, strokeDashoffset: 37.6 }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-headline-lg text-headline-lg text-on-surface">85</span>
              <span className="font-label-sm text-label-sm text-on-surface-variant">/ 100</span>
            </div>
          </div>
          <h3 className="font-label-md text-label-md font-bold text-on-surface">Resume Score</h3>
          <p className="font-label-sm text-label-sm text-primary font-medium mt-1">Targeting Product Design</p>
        </div>

        {/* ATS Score */}
        <div className="bg-surface-container-lowest rounded-2xl p-lg shadow-soft card-border flex flex-col justify-between hover:translate-y-[-2px] transition-transform duration-200 hover:shadow-md">
          <div className="flex justify-between items-start">
            <div className="p-2 bg-secondary-container/10 rounded-lg text-secondary">
              <span className="material-symbols-outlined">analytics</span>
            </div>
            <span className="px-2 py-1 bg-tertiary-fixed text-on-tertiary-fixed rounded-full font-label-sm text-label-sm">
              Highly Optimized
            </span>
          </div>
          <div>
            <span className="font-display-lg text-display-lg text-on-surface">92%</span>
            <h3 className="font-label-md text-label-md font-bold text-on-surface mt-xs">ATS Optimization Score</h3>
          </div>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-sm">
            Your resume is highly optimized for current industry standards and keyword matching.
          </p>
        </div>

        {/* Job Match */}
        <div className="bg-primary-container rounded-2xl p-lg shadow-soft relative overflow-hidden flex flex-col justify-between group">
          <div className="relative z-10 flex justify-between items-start">
            <div className="p-2 bg-white/20 rounded-lg text-white">
              <span className="material-symbols-outlined">auto_awesome</span>
            </div>
            <span className="text-white/80 font-label-sm text-label-sm">Daily Update</span>
          </div>
          <div className="relative z-10">
            <span className="font-display-lg text-display-lg text-on-primary">14</span>
            <h3 className="font-label-md text-label-md font-bold text-on-primary mt-xs">New Job Matches</h3>
          </div>
          <button className="relative z-10 w-full mt-sm py-2 bg-white/10 hover:bg-white/20 text-on-primary font-label-md text-label-md rounded-lg transition-colors flex items-center justify-center gap-xs">
            View Matches <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>
          <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
        </div>
      </section>

      {/* ── AI Feedback & Upload ─────────────────────────────────── */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-lg mb-2xl">
        {/* AI Feedback Card */}
        <div className="bg-surface-container-lowest rounded-2xl p-xl shadow-soft card-border ai-gradient-glow relative hover:translate-y-[-2px] transition-transform duration-200 hover:shadow-md">
          <div className="flex items-center gap-sm mb-lg">
            <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
              smart_toy
            </span>
            <h2 className="font-headline-md text-headline-md text-on-surface">AI Resume Feedback</h2>
          </div>
          <div className="space-y-md">
            {feedbackItems.map((item, idx) => (
              <div key={idx} className={`flex gap-md p-md rounded-xl border shadow-sm ${item.bgClass || 'bg-white'} ${item.borderColor}`}>
                <span className={`material-symbols-outlined mt-0.5 ${item.color}`}>{item.icon}</span>
                <div>
                  <p className="font-label-md text-label-md font-bold text-on-surface">{item.title}</p>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upload Card */}
        <div className="bg-surface-container-lowest rounded-2xl p-xl shadow-soft card-border flex flex-col hover:translate-y-[-2px] transition-transform duration-200 hover:shadow-md">
          <div className="flex justify-between items-center mb-lg">
            <h2 className="font-headline-md text-headline-md text-on-surface">Resume Upload</h2>
            <span className="font-label-sm text-label-sm text-on-surface-variant px-sm py-1 bg-surface-container-high rounded-full">
              Last uploaded 2 days ago
            </span>
          </div>

          <div className="flex-1 border-2 border-dashed border-outline-variant rounded-2xl flex flex-col items-center justify-center p-xl hover:border-primary hover:bg-primary/5 transition-all cursor-pointer group">
            <div className="w-16 h-16 bg-surface-container-high group-hover:bg-primary-container group-hover:text-on-primary-container rounded-full flex items-center justify-center mb-md transition-colors">
              <span className="material-symbols-outlined text-[32px]">upload_file</span>
            </div>
            <p className="font-label-md text-label-md font-bold text-on-surface">
              Click to upload or drag and drop
            </p>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-xs">
              PDF, DOCX up to 10MB
            </p>
          </div>

          <div className="mt-lg flex items-center justify-between p-md bg-surface-container-low rounded-xl">
            <div className="flex items-center gap-md">
              <div className="p-2 bg-primary/10 text-primary rounded-lg">
                <span className="material-symbols-outlined">picture_as_pdf</span>
              </div>
              <div>
                <p className="font-label-md text-label-md font-bold text-on-surface">Alex_Chen_Product_Design_v2.pdf</p>
                <p className="font-label-sm text-label-sm text-on-surface-variant">1.4 MB • Updated July 20</p>
              </div>
            </div>
            <button className="p-2 text-on-surface-variant hover:text-error transition-colors">
              <span className="material-symbols-outlined">delete</span>
            </button>
          </div>
        </div>
      </section>

      {/* ── Jobs and Applications Row ────────────────────────────── */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-lg">
        {/* Recommended Jobs */}
        <div className="bg-surface-container-lowest rounded-2xl p-xl shadow-soft card-border hover:translate-y-[-2px] transition-transform duration-200 hover:shadow-md">
          <div className="flex justify-between items-center mb-lg">
            <h2 className="font-headline-md text-headline-md text-on-surface">Recommended Jobs</h2>
            <Link to="/jobs" className="text-primary font-label-md text-label-md hover:underline">
              See all
            </Link>
          </div>
          <div className="space-y-md">
            {recommendedJobs.map((job, idx) => (
              <div
                key={idx}
                className="group flex items-center justify-between p-md hover:bg-surface-container-low rounded-xl transition-all cursor-pointer border border-transparent hover:border-outline-variant"
              >
                <div className="flex items-center gap-md">
                  <div className={`w-12 h-12 ${job.bgColor} rounded-lg flex items-center justify-center`}>
                    <span className={`font-bold ${job.textColor} text-xl`}>{job.initial}</span>
                  </div>
                  <div>
                    <p className="font-label-md text-label-md font-bold text-on-surface">{job.company}</p>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">{job.role}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="px-2 py-1 bg-primary/10 text-primary rounded-full font-label-sm text-label-sm font-bold">
                    {job.match}% Match
                  </span>
                  <p className="font-label-sm text-label-sm text-on-surface-variant mt-1">{job.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Applications */}
        <div className="bg-surface-container-lowest rounded-2xl p-xl shadow-soft card-border hover:translate-y-[-2px] transition-transform duration-200 hover:shadow-md">
          <div className="flex justify-between items-center mb-lg">
            <h2 className="font-headline-md text-headline-md text-on-surface">Recent Applications</h2>
            <Link to="/applications" className="text-primary font-label-md text-label-md hover:underline">
              Track all
            </Link>
          </div>
          <div className="space-y-md">
            {recentApplications.map((app, idx) => (
              <div key={idx} className="p-md bg-surface-container-low rounded-xl">
                <div className="flex justify-between items-start mb-sm">
                  <div>
                    <p className="font-label-md text-label-md font-bold text-on-surface">{app.company}</p>
                    <p className="font-label-sm text-label-sm text-on-surface-variant">{app.role}</p>
                  </div>
                  <span className={`px-2 py-1 rounded font-label-sm text-label-sm ${app.statusClass}`}>
                    {app.status}
                  </span>
                </div>
                <div className="w-full bg-outline-variant h-1 rounded-full overflow-hidden">
                  <div className="bg-primary h-full rounded-full" style={{ width: `${app.progress}%` }} />
                </div>
                {app.extra && (
                  <p className="font-label-sm text-label-sm text-primary font-medium mt-2 flex items-center gap-xs">
                    <span className="material-symbols-outlined text-[16px]">{app.extra.icon}</span>
                    {app.extra.text}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
      </div>
      <ToastNotification />
    </>
  )
}

export default StudentDashboard
