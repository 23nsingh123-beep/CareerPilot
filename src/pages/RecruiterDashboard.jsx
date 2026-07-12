import React, { useState, useEffect } from 'react'
import jobService from '../services/jobService'
import applicationService from '../services/applicationService'
import AnnouncementBanner from '../components/AnnouncementBanner'

function RecruiterDashboard() {
  const [jobs, setJobs] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchJobs = async () => {
    try {
      const data = await jobService.getRecruiterJobs()
      setJobs(data.jobs || [])
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchJobs()
  }, [])

  const activeJobsList = jobs.filter(j => j.status === 'active')
  const activeJobs = activeJobsList.length
  const totalApplications = jobs.reduce((sum, j) => sum + (j.applicantCount || 0), 0)

  return (
    <div className="max-w-container-max mx-auto w-full flex-1 mb-24 relative">
      <AnnouncementBanner />
      
      {/* Dashboard Header */}
      <header className="mb-2xl">
        <h1 className="text-headline-lg font-headline-lg text-on-surface">Recruiter Dashboard</h1>
        <p className="text-body-md text-on-surface-variant mt-xs">Manage job postings, review applicants, and discover the best candidates.</p>
      </header>

      {/* Summary Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-lg mb-2xl">
        <div className="bg-surface-container-lowest p-xl rounded-2xl card-border shadow-soft">
          <div className="flex items-center justify-between mb-lg">
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
              <span className="material-symbols-outlined">work</span>
            </div>
          </div>
          <p className="text-label-md text-on-surface-variant mb-xs">Active Jobs</p>
          <p className="text-display-lg font-bold text-on-surface">{isLoading ? '--' : activeJobs}</p>
        </div>
        <div className="bg-surface-container-lowest p-xl rounded-2xl card-border shadow-soft">
          <div className="flex items-center justify-between mb-lg">
            <div className="p-2 bg-secondary/10 rounded-lg text-secondary">
              <span className="material-symbols-outlined">groups</span>
            </div>
          </div>
          <p className="text-label-md text-on-surface-variant mb-xs">Total Applicants</p>
          <p className="text-display-lg font-bold text-on-surface">{isLoading ? '--' : totalApplications}</p>
        </div>
        <div className="bg-surface-container-lowest p-xl rounded-2xl card-border shadow-soft opacity-60">
          <div className="flex items-center justify-between mb-lg">
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
              <span className="material-symbols-outlined">calendar_today</span>
            </div>
          </div>
          <p className="text-label-md text-on-surface-variant mb-xs">Interviews Scheduled</p>
          <p className="text-display-lg font-bold text-on-surface">0</p>
        </div>
        <div className="bg-surface-container-lowest p-xl rounded-2xl card-border shadow-soft opacity-60">
          <div className="flex items-center justify-between mb-lg">
            <div className="p-2 bg-tertiary/10 rounded-lg text-tertiary">
              <span className="material-symbols-outlined">verified_user</span>
            </div>
          </div>
          <p className="text-label-md text-on-surface-variant mb-xs">Hires This Month</p>
          <p className="text-display-lg font-bold text-on-surface">0</p>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-xl">
        <div className="lg:col-span-8 flex flex-col gap-2xl">
          {/* Active Job Posts Grid */}
          <section>
            <div className="flex items-center justify-between mb-lg">
              <h2 className="text-headline-md font-headline-md text-on-surface">Active Job Posts</h2>
            </div>
            
            {isLoading ? (
               <div className="flex justify-center p-xl"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-md"></div></div>
            ) : activeJobsList.length === 0 ? (
               <div className="p-xl bg-surface-container-lowest rounded-2xl border text-center text-on-surface-variant">No active job posts.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
                {activeJobsList.slice(0, 4).map(job => (
                  <div key={job._id} className="bg-surface-container-lowest p-xl rounded-2xl card-border shadow-soft flex flex-col group min-h-[320px]">
                    <div className="flex justify-between items-start mb-lg">
                      <div className="w-12 h-12 bg-primary/5 rounded-xl flex items-center justify-center">
                        <span className="material-symbols-outlined text-primary text-[24px]">terminal</span>
                      </div>
                      <span className="text-label-sm text-on-surface-variant bg-surface-container-low px-md py-xs rounded-full">Active</span>
                    </div>
                    <h3 className="text-body-lg font-bold text-on-surface mb-xs group-hover:text-primary transition-colors">{job.title}</h3>
                    <p className="text-body-sm text-on-surface-variant mb-xl">{job.companyName} • {job.location}</p>
                    <div className="flex items-center gap-2xl mb-xl">
                      <div className="flex flex-col gap-xs">
                        <span className="text-label-sm text-on-surface-variant">Applicants</span>
                        <span className="text-headline-md font-bold">{job.applicantCount || 0}</span>
                      </div>
                      <div className="flex flex-col gap-xs">
                        <span className="text-label-sm text-on-surface-variant">Deadline</span>
                        <span className="text-headline-md font-bold">{new Date(job.applicationDeadline).toLocaleDateString(undefined, {month: 'short', day: 'numeric'})}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  )
}

export default RecruiterDashboard
