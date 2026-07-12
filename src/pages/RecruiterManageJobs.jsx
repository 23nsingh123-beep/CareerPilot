import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import jobService from '../services/jobService'
import { useToast } from '../components/useToast'

function RecruiterManageJobs() {
  const { showToast, ToastComponent } = useToast()
  
  const [jobs, setJobs] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  
  const fetchJobs = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await jobService.getRecruiterJobs()
      setJobs(data.jobs || [])
    } catch (err) {
      setError('Failed to load your jobs. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchJobs()
  }, [])

  const handleUpdateStatus = async (id, status) => {
    try {
      // Optimistic update
      setJobs(prevJobs => prevJobs.map(job => job._id === id ? { ...job, status } : job))
      await jobService.updateJobStatus(id, status)
      showToast(`Job status updated to ${status}.`, 'success')
    } catch (err) {
      showToast('Failed to update status.', 'error')
      fetchJobs() // revert
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this job? This action cannot be undone.')) return;
    
    try {
      setJobs(prevJobs => prevJobs.filter(job => job._id !== id))
      await jobService.deleteJob(id)
      showToast('Job deleted successfully.', 'success')
    } catch (err) {
      showToast('Failed to delete job.', 'error')
      fetchJobs() // revert
    }
  }

  // Calculate KPIs
  const activeJobs = jobs.filter(j => j.status === 'active').length
  const draftJobs = jobs.filter(j => j.status === 'draft').length
  const closedJobs = jobs.filter(j => j.status === 'closed' || j.status === 'expired').length
  const totalApplications = jobs.reduce((sum, j) => sum + (j.applicantCount || 0), 0)

  return (
    <>
      <ToastComponent />
      
      {/* Page Header */}
      <div className="mb-xl flex flex-col sm:flex-row justify-between items-start sm:items-end gap-md">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface">Manage Jobs</h2>
          <p className="text-on-surface-variant font-body-md text-body-md mt-xs">View, edit, monitor, and manage all your active and archived job postings.</p>
        </div>
        <Link to="/recruiter/post-job" className="bg-primary text-on-primary px-lg py-md rounded-xl font-label-md text-label-md flex items-center gap-sm hover:bg-primary-container transition-all active:scale-95 shadow-lg shadow-primary/20 shrink-0">
          <span className="material-symbols-outlined">add</span>
          <span>New Job</span>
        </Link>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-lg mb-xl">
        <div className="bg-surface-container-lowest p-lg rounded-2xl border border-outline-variant/30 shadow-sm">
          <div className="flex justify-between items-start mb-md">
            <div className="p-sm bg-primary/10 text-primary rounded-lg">
              <span className="material-symbols-outlined">work</span>
            </div>
          </div>
          <p className="text-on-surface-variant font-label-md text-label-md">Active Jobs</p>
          <h3 className="font-headline-md text-headline-md mt-xs">{isLoading ? '--' : activeJobs}</h3>
        </div>
        <div className="bg-surface-container-lowest p-lg rounded-2xl border border-outline-variant/30 shadow-sm">
          <div className="flex justify-between items-start mb-md">
            <div className="p-sm bg-surface-variant text-on-surface-variant rounded-lg">
              <span className="material-symbols-outlined">edit_document</span>
            </div>
          </div>
          <p className="text-on-surface-variant font-label-md text-label-md">Draft Jobs</p>
          <h3 className="font-headline-md text-headline-md mt-xs">{isLoading ? '--' : draftJobs}</h3>
        </div>
        <div className="bg-surface-container-lowest p-lg rounded-2xl border border-outline-variant/30 shadow-sm">
          <div className="flex justify-between items-start mb-md">
            <div className="p-sm bg-error-container/20 text-error rounded-lg">
              <span className="material-symbols-outlined">archive</span>
            </div>
          </div>
          <p className="text-on-surface-variant font-label-md text-label-md">Closed Jobs</p>
          <h3 className="font-headline-md text-headline-md mt-xs">{isLoading ? '--' : closedJobs}</h3>
        </div>
        <div className="bg-surface-container-lowest p-lg rounded-2xl border border-outline-variant/30 shadow-sm">
          <div className="flex justify-between items-start mb-md">
            <div className="p-sm bg-secondary/10 text-secondary rounded-lg">
              <span className="material-symbols-outlined">groups</span>
            </div>
          </div>
          <p className="text-on-surface-variant font-label-md text-label-md">Total Applications</p>
          <h3 className="font-headline-md text-headline-md mt-xs">{isLoading ? '--' : totalApplications}</h3>
        </div>
      </div>

      {/* Content Grid Layout */}
      <div className="grid grid-cols-12 gap-xl">
        
        {/* Main Job Column */}
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-lg">
          
          {error && (
            <div className="p-4 bg-error-container text-on-error-container rounded-xl flex items-center justify-between">
              <span>{error}</span>
              <button onClick={fetchJobs} className="underline font-bold">Retry</button>
            </div>
          )}

          {isLoading && !error && (
            <div className="flex flex-col items-center justify-center p-xl">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-md"></div>
              <p className="text-on-surface-variant font-label-md">Loading your jobs...</p>
            </div>
          )}

          {!isLoading && !error && jobs.length === 0 && (
            <div className="flex flex-col items-center justify-center p-2xl bg-surface-container-lowest rounded-2xl border border-outline-variant/30 text-center">
              <div className="w-16 h-16 bg-surface-variant/50 rounded-full flex items-center justify-center text-on-surface-variant mb-lg">
                <span className="material-symbols-outlined text-[32px]">work_off</span>
              </div>
              <h3 className="text-headline-sm font-headline-sm text-on-surface mb-xs">No Jobs Found</h3>
              <p className="text-body-md text-on-surface-variant max-w-md">You haven't created any job postings yet. Click "New Job" to get started.</p>
            </div>
          )}

          {/* Job List */}
          <div className="flex flex-col gap-lg">
            {!isLoading && jobs.map(job => (
              <div key={job._id} className={`bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-lg hover:shadow-lg transition-all duration-300 flex flex-col gap-lg relative group ${job.status === 'closed' || job.status === 'expired' ? 'grayscale opacity-80' : ''}`}>
                <div className="flex justify-between items-start">
                  <div className="flex gap-md">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${job.status === 'active' ? 'bg-primary/10 text-primary' : job.status === 'draft' ? 'bg-surface-variant/50 text-on-surface-variant' : 'bg-error-container/10 text-error'}`}>
                      <span className="material-symbols-outlined text-[28px]">{job.status === 'draft' ? 'brush' : job.status === 'active' ? 'terminal' : 'ads_click'}</span>
                    </div>
                    <div>
                      <h4 className="font-headline-md text-headline-md text-on-surface">{job.title}</h4>
                      <div className="flex flex-wrap gap-sm mt-xs">
                        {job.department && <span className="bg-surface-variant/50 text-on-surface-variant px-sm py-0.5 rounded-full text-[12px] font-medium">{job.department}</span>}
                        <span className="bg-surface-variant/50 text-on-surface-variant px-sm py-0.5 rounded-full text-[12px] font-medium capitalize">{job.employmentType.replace('-', ' ')}</span>
                        <span className="bg-surface-variant/50 text-on-surface-variant px-sm py-0.5 rounded-full text-[12px] font-medium capitalize">{job.workMode}</span>
                        <span className="bg-surface-variant/50 text-on-surface-variant px-sm py-0.5 rounded-full text-[12px] font-medium">{job.location}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-sm">
                    <span className={`px-md py-1 rounded-full text-label-sm font-label-sm uppercase tracking-wider ${job.status === 'active' ? 'bg-[#e7f9f2] text-[#00875a]' : job.status === 'draft' ? 'bg-tertiary-container/20 text-tertiary bg-[#fef3c7] text-[#d97706]' : 'bg-error-container/30 text-error bg-[#f3f4f6] text-[#4b5563]'}`}>
                      {job.status}
                    </span>
                    <p className="text-on-surface-variant text-[12px]">Created {new Date(job.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-md border-y border-outline-variant/20 py-lg">
                  <div className="text-center">
                    <p className="text-on-surface-variant text-label-sm font-label-sm uppercase tracking-tighter">Applicants</p>
                    <p className="text-headline-md font-headline-md text-on-surface mt-xs">{job.applicantCount || 0}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-on-surface-variant text-label-sm font-label-sm uppercase tracking-tighter">Interviewed</p>
                    <p className="text-headline-md font-headline-md text-outline mt-xs">--</p>
                  </div>
                  <div className="text-center">
                    <p className="text-on-surface-variant text-label-sm font-label-sm uppercase tracking-tighter">Shortlisted</p>
                    <p className="text-headline-md font-headline-md text-outline mt-xs">--</p>
                  </div>
                  <div className="text-center">
                    <p className="text-on-surface-variant text-label-sm font-label-sm uppercase tracking-tighter">Hired</p>
                    <p className="text-headline-md font-headline-md text-outline mt-xs">--</p>
                  </div>
                  <div className="text-center bg-surface-container-high/30 rounded-xl py-xs">
                    <p className="text-on-surface-variant text-label-sm font-label-sm uppercase tracking-tighter">AI Match</p>
                    <p className="text-headline-md font-headline-md text-outline mt-xs">--</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-center gap-md sm:gap-0">
                  <div className="flex items-center gap-md text-on-surface-variant text-body-sm font-body-sm">
                    {job.salaryMin || job.salaryMax ? (
                      <div className="flex items-center gap-xs">
                        <span className="material-symbols-outlined text-[18px]">payments</span>
                        <span>
                          {job.salaryMin ? `${job.currency} ${job.salaryMin}` : ''} 
                          {job.salaryMin && job.salaryMax ? ' - ' : ''} 
                          {job.salaryMax ? `${job.currency} ${job.salaryMax}` : ''}
                        </span>
                      </div>
                    ) : null}
                    <div className="flex items-center gap-xs">
                      <span className="material-symbols-outlined text-[18px]">event</span>
                      <span>Deadline: {new Date(job.applicationDeadline).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-md w-full sm:w-auto">
                    <button onClick={() => handleDelete(job._id)} className="p-2 hover:bg-error-container/30 rounded-full text-error transition-colors" title="Delete Job">
                      <span className="material-symbols-outlined">delete</span>
                    </button>
                    
                    {job.status === 'draft' && (
                      <>
                        <button className="flex-1 sm:flex-none px-md py-2 border border-outline text-on-surface rounded-xl font-label-md text-label-md hover:bg-surface-variant/20 transition-all">Edit Job</button>
                        <button onClick={() => handleUpdateStatus(job._id, 'active')} className="flex-1 sm:flex-none px-md py-2 bg-secondary text-on-secondary rounded-xl font-label-md text-label-md hover:shadow-md transition-all">Publish Now</button>
                      </>
                    )}

                    {job.status === 'active' && (
                      <>
                        <button onClick={() => handleUpdateStatus(job._id, 'closed')} className="flex-1 sm:flex-none px-md py-2 border border-error text-error rounded-xl font-label-md text-label-md hover:bg-error/10 transition-all">Close Job</button>
                        {job._id ? (
                          <Link to={`/recruiter/jobs/${job._id}`} className="flex-1 sm:flex-none px-md py-2 bg-primary text-on-primary rounded-xl font-label-md text-label-md hover:shadow-md transition-all text-center flex items-center justify-center">View Job</Link>
                        ) : (
                          <button disabled className="flex-1 sm:flex-none px-md py-2 bg-surface-variant text-on-surface-variant rounded-xl font-label-md text-label-md opacity-50 cursor-not-allowed">View Job</button>
                        )}
                      </>
                    )}

                    {(job.status === 'closed' || job.status === 'expired') && (
                      <>
                        <button onClick={() => handleUpdateStatus(job._id, 'active')} className="flex-1 sm:flex-none px-md py-2 border border-outline text-on-surface rounded-xl font-label-md text-label-md hover:bg-surface-variant/20 transition-all">Reopen Job</button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Right Side Panel */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-xl">
          {/* Recent Activity placeholder removed for brevity, keeping only essential functional blocks matching requested layout */}
          <section className="bg-surface-container-low rounded-2xl border border-outline-variant/30 p-lg">
            <h5 className="font-headline-md text-headline-md text-on-surface mb-lg text-[20px]">Recent Activity</h5>
            <div className="text-on-surface-variant text-body-sm text-center py-xl opacity-70">
              Activity timeline will populate here as candidates apply.
            </div>
          </section>
        </div>
      </div>
    </>
  )
}

export default RecruiterManageJobs
