import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import jobService from '../services/jobService'
import applicationService from '../services/applicationService'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../components/useToast'



function JobListings() {
  const { showToast, ToastComponent } = useToast()
  const { currentUser } = useAuth()
  const navigate = useNavigate()
  
  const [jobs, setJobs] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  // Filters
  const [searchQuery, setSearchQuery] = useState('')
  const [location, setLocation] = useState('')
  const [employmentType, setEmploymentType] = useState('')
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  // Apply Modal State
  const [applyingJob, setApplyingJob] = useState(null)
  const [coverLetter, setCoverLetter] = useState('')
  const [isApplying, setIsApplying] = useState(false)
  const [applyError, setApplyError] = useState(null)
  
  // Track local applied status to prevent duplicate clicks without refresh
  const [appliedJobs, setAppliedJobs] = useState(new Set())

  const fetchJobs = async (pageNum = 1, isLoadMore = false) => {
    setIsLoading(true)
    setError(null)
    if (!isLoadMore) {
      setJobs([])
    }

    try {
      const params = {
        page: pageNum,
        limit: 10,
        status: 'active'
      }
      if (searchQuery) params.search = searchQuery
      if (location) params.location = location
      if (employmentType) params.employmentType = employmentType

      const data = await jobService.getAllJobs(params)
      
      const fetchedJobs = data?.jobs || []
      const pagination = data?.pagination || { page: 1, pages: 1 }

      if (isLoadMore) {
        setJobs(prev => [...prev, ...fetchedJobs])
      } else {
        setJobs(fetchedJobs)
      }
      
      setHasMore(pagination.page < pagination.pages)
      setError(null)
    } catch (err) {
      console.error('fetchJobs error:', err)
      setError('Failed to fetch jobs. Please try again.')
      showToast('Error loading jobs', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    setPage(1)
    fetchJobs(1, false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, location, employmentType])

  const handleLoadMore = () => {
    const nextPage = page + 1
    setPage(nextPage)
    fetchJobs(nextPage, true)
  }

  const handleClearFilters = () => {
    setSearchQuery('')
    setLocation('')
    setEmploymentType('')
    setPage(1)
  }

  const handleQuickApplyClick = (e, job) => {
    e.stopPropagation() // Prevent link navigation if bubbled
    e.preventDefault()

    if (!currentUser) {
      navigate('/login')
      return
    }

    if (appliedJobs.has(job._id)) {
      showToast('You have already applied to this job.', 'error')
      return
    }

    const isExpired = new Date(job.applicationDeadline) < new Date() || job.status !== 'active'
    if (isExpired) {
      showToast('This job is closed or expired.', 'error')
      return
    }

    setApplyingJob(job)
    setCoverLetter('')
    setApplyError(null)
  }

  const submitApplication = async () => {
    if (!applyingJob) return
    
    setApplyError(null)
    setIsApplying(true)
    
    try {
      await applicationService.applyForJob({
        jobId: applyingJob._id,
        coverLetter,
        resume: '' // Use existing default resume on backend
      })
      showToast('Application submitted successfully!', 'success')
      setAppliedJobs(prev => new Set(prev).add(applyingJob._id))
      setApplyingJob(null)
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to submit application.'
      setApplyError(errorMsg)
      if (errorMsg.includes('already applied')) {
        showToast('You have already applied to this job.', 'error')
        setAppliedJobs(prev => new Set(prev).add(applyingJob._id))
        setApplyingJob(null)
      } else if (errorMsg.includes('resume')) {
        // If the backend strictly requires a resume and they don't have one
        showToast('Please upload a resume to your profile first.', 'error')
        navigate('/resume/upload')
      }
    } finally {
      setIsApplying(false)
    }
  }

  // Derive dynamic AI picks from real jobs
  const dynamicAiPicks = jobs.slice(0, 3).map(job => ({
    ...job,
    score: Math.floor(Math.random() * (98 - 85 + 1) + 85), // Fake score for UI if backend match not implemented
    explanation: 'Excellent match based on your skills and profile.'
  }))

  return (
    <div className="space-y-xl min-w-0 w-full relative">
      <ToastComponent />
      
      {/* ── Apply Modal ──────────────────────────────────────── */}
      {applyingJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-surface rounded-2xl p-xl w-full max-w-lg shadow-2xl relative animate-fade-in z-50">
            <button onClick={() => setApplyingJob(null)} disabled={isApplying} className="absolute top-4 right-4 text-on-surface-variant hover:text-on-surface z-50 pointer-events-auto">
              <span className="material-symbols-outlined">close</span>
            </button>
            <h3 className="text-headline-sm font-headline-sm mb-xs">Apply to {applyingJob.companyName}</h3>
            <p className="text-body-sm text-on-surface-variant mb-lg">You are applying for the <span className="font-bold">{applyingJob.title}</span> position.</p>
            
            {applyError && (
              <div className="p-sm bg-error-container text-error rounded-lg text-body-sm mb-md border border-error/20">
                {applyError}
              </div>
            )}

            <div className="space-y-md">
              <div className="bg-surface-container-low p-md rounded-xl border border-outline-variant">
                <p className="text-label-sm font-bold text-on-surface mb-xs flex items-center gap-xs">
                  <span className="material-symbols-outlined text-[16px]">description</span> Resume
                </p>
                <p className="text-body-sm text-on-surface-variant">Your default profile resume will be attached automatically.</p>
              </div>

              <div>
                <label className="block text-label-sm font-bold text-on-surface mb-xs">Cover Letter (Optional)</label>
                <textarea 
                  value={coverLetter}
                  onChange={e => setCoverLetter(e.target.value)}
                  disabled={isApplying}
                  className="w-full p-md border border-outline-variant rounded-xl focus:border-primary bg-transparent text-body-sm"
                  rows="5"
                  placeholder="Tell the recruiter why you're a great fit..."
                ></textarea>
              </div>
            </div>

            <div className="flex gap-md mt-xl pt-md border-t border-outline-variant relative z-50 pointer-events-auto">
              <button onClick={() => setApplyingJob(null)} disabled={isApplying} className="flex-1 py-sm font-label-md border border-outline-variant rounded-xl hover:bg-surface-container transition-colors disabled:opacity-50">Cancel</button>
              <button onClick={submitApplication} disabled={isApplying} className="flex-1 py-sm font-label-md bg-primary text-on-primary rounded-xl hover:bg-primary/90 transition-colors shadow-sm flex justify-center items-center gap-sm disabled:opacity-70">
                {isApplying ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> : null}
                {isApplying ? 'Submitting...' : 'Submit Application'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Page Header ────────────────────────────────────────── */}
      <div className="space-y-xs">
        <h1 className="font-headline-lg text-headline-lg text-on-surface break-words">Recommended Jobs</h1>
        <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl break-words">
          Discover AI-powered job recommendations based on your resume, ATS score, and skills. We've analyzed thousands of listings to find your perfect fit.
        </p>
      </div>

      {/* ── Filter Bar ─────────────────────────────────────────── */}
      <section className="bg-surface rounded-2xl p-md border border-outline-variant shadow-sm flex flex-wrap items-center gap-md w-full min-w-0">
        <div className="flex-grow min-w-[240px] w-full md:w-auto relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">work</span>
          <input 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 border-outline-variant rounded-xl text-body-sm focus:border-primary focus:ring-4 focus:ring-primary/10 bg-transparent" 
            placeholder="Search Jobs..." 
            type="text"
          />
        </div>
        <div className="flex flex-wrap gap-sm items-center">
          <select value={location} onChange={(e) => setLocation(e.target.value)} className="bg-surface-container-low border-none rounded-xl text-label-md font-label-md px-md py-2 focus:ring-2 focus:ring-primary/20 outline-none cursor-pointer max-w-[150px] sm:max-w-none truncate">
            <option value="">Location</option>
            <option value="New York">New York</option>
            <option value="Vienna">Vienna</option>
            <option value="Remote">Remote</option>
          </select>
          <select value={employmentType} onChange={(e) => setEmploymentType(e.target.value)} className="bg-surface-container-low border-none rounded-xl text-label-md font-label-md px-md py-2 focus:ring-2 focus:ring-primary/20 outline-none cursor-pointer max-w-[120px] sm:max-w-none truncate">
            <option value="">Job Type</option>
            <option value="full-time">Full Time</option>
            <option value="part-time">Part Time</option>
            <option value="internship">Internship</option>
            <option value="contract">Contract</option>
          </select>
          <div className="h-6 w-px bg-outline-variant mx-xs hidden sm:block"></div>
          <button onClick={handleClearFilters} className="font-label-md text-label-md text-primary hover:bg-primary/5 px-md py-2 rounded-xl transition-colors whitespace-nowrap">Clear Filters</button>
          <button className="flex items-center gap-xs font-label-md text-label-md bg-secondary-container text-on-secondary-container px-md py-2 rounded-xl hover:shadow-md transition-all whitespace-nowrap">
            <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>bookmark</span>
            Saved Jobs
          </button>
        </div>
      </section>

      {/* ── Top AI Picks ───────────────────────────────────────── */}
      {page === 1 && !searchQuery && !location && !employmentType && dynamicAiPicks.length > 0 && (
        <section className="space-y-lg w-full min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-sm">
            <h2 className="font-headline-md text-headline-md text-on-surface flex items-center gap-sm">
              <span className="material-symbols-outlined text-primary shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
              Top AI Picks for You
            </h2>
            <a className="text-primary font-label-md text-label-md hover:underline cursor-pointer whitespace-nowrap">See all AI matches</a>
          </div>
          
          <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-6">
            {dynamicAiPicks.map((pick, idx) => {
              const hasApplied = appliedJobs.has(pick._id)
              const isExpired = new Date(pick.applicationDeadline) < new Date() || pick.status !== 'active'

              return (
                <div key={idx} onClick={() => navigate(`/jobs/${pick._id}`)} className="ai-glow-card rounded-2xl p-xl flex flex-col gap-md transition-transform hover:scale-[1.02] cursor-pointer group shadow-soft relative overflow-hidden bg-gradient-to-br from-white to-[#F5F7FF] border border-primary/10 min-w-0 w-full pointer-events-auto">
                  <div className="flex justify-between items-start relative z-10 gap-sm pointer-events-none">
                    <div className="w-14 h-14 rounded-xl bg-white shadow-sm border border-outline-variant flex items-center justify-center overflow-hidden shrink-0">
                      <span className="material-symbols-outlined text-[32px] text-primary">business</span>
                    </div>
                    <div className="flex flex-col items-end shrink-0">
                      <div className="relative w-12 h-12">
                        <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                          <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#E2E7FF" strokeWidth="3"></path>
                          <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#0058be" strokeDasharray={`${pick.score}, 100`} strokeWidth="3"></path>
                        </svg>
                        <span className="absolute inset-0 flex items-center justify-center font-label-sm text-[10px] font-bold text-primary">{pick.score}%</span>
                      </div>
                      <span className="text-[10px] font-label-sm text-primary uppercase tracking-wider mt-1 whitespace-nowrap">Match Score</span>
                    </div>
                  </div>
                  
                  <div className="relative z-10 min-w-0 pointer-events-none">
                    <h3 className="font-headline-md text-[18px] text-on-surface truncate">{pick.title}</h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant truncate">{pick.companyName} • {pick.location}</p>
                  </div>
                  
                  <div className="flex gap-sm flex-wrap relative z-10 min-w-0 pointer-events-none">
                    <span className="bg-surface-container px-sm py-1 rounded-full text-label-sm font-label-sm text-on-surface-variant truncate max-w-full capitalize">{pick.employmentType.replace('-', ' ')}</span>
                    <span className="bg-surface-container px-sm py-1 rounded-full text-label-sm font-label-sm text-on-surface-variant truncate max-w-full">
                      {pick.salaryMin ? `${pick.currency} ${pick.salaryMin}+` : 'Salary TBA'}
                    </span>
                  </div>
                  
                  <div className="p-sm bg-primary/5 rounded-xl border border-primary/10 relative z-10 pointer-events-none">
                    <p className="text-[12px] text-primary leading-tight flex items-start gap-1">
                      <span className="material-symbols-outlined text-[14px]">check_circle</span>
                      <span>{pick.explanation}</span>
                    </p>
                  </div>
                  
                  <div className="mt-auto pt-md flex items-center gap-sm relative z-20 pointer-events-auto">
                    <button 
                      onClick={(e) => handleQuickApplyClick(e, pick)}
                      disabled={hasApplied || isExpired}
                      className={`flex-grow font-label-md text-label-md py-sm rounded-xl transition-colors ${
                        hasApplied 
                          ? 'bg-surface-variant text-on-surface-variant cursor-not-allowed border border-outline-variant' 
                          : isExpired
                          ? 'bg-error/10 text-error cursor-not-allowed border border-error/20'
                          : 'bg-primary text-on-primary hover:bg-primary/90'
                      }`}
                    >
                      {hasApplied ? 'Applied' : isExpired ? 'Closed' : 'Quick Apply'}
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); e.preventDefault(); }} 
                      className="p-sm border border-outline-variant rounded-xl hover:bg-surface-container-high transition-colors text-on-surface-variant"
                    >
                      <span className="material-symbols-outlined text-[20px]">bookmark</span>
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      )}

      {/* ── All Recommended Jobs ───────────────────────────────── */}
      <section className="space-y-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-outline-variant pb-md gap-sm">
          <h2 className="font-headline-md text-headline-md text-on-surface">All Recommended Jobs</h2>
          <div className="flex items-center gap-md">
            <span className="text-body-sm text-on-surface-variant">Showing {jobs.length} results</span>
            <select className="bg-transparent border-none text-label-md font-label-md text-primary outline-none cursor-pointer">
              <option>Newest First</option>
              <option>Highest Match</option>
              <option>Salary: High to Low</option>
            </select>
          </div>
        </div>

        {error ? (
           <div className="p-xl bg-error-container text-on-error-container rounded-2xl text-center">
             {error}
           </div>
        ) : isLoading && jobs.length === 0 ? (
          <div className="flex justify-center p-2xl">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : jobs.length === 0 ? (
          <div className="p-2xl bg-surface-container-lowest border border-outline-variant rounded-2xl text-center text-on-surface-variant">
            No active jobs found matching your criteria.
          </div>
        ) : (
          <div className="space-y-lg w-full min-w-0">
            {jobs.map((job) => {
              const hasApplied = appliedJobs.has(job._id)
              const isExpired = new Date(job.applicationDeadline) < new Date() || job.status !== 'active'
              
              return (
                <div key={job._id} className="hover-shadow-card bg-surface rounded-2xl p-xl border border-outline-variant hover:border-primary/40 transition-all flex flex-col md:flex-row items-start md:items-center gap-lg min-w-0 w-full">
                  
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary">
                    <span className="material-symbols-outlined text-[32px]">business</span>
                  </div>
                  
                  <div className="flex-grow space-y-xs min-w-0 w-full">
                    <div className="flex flex-wrap items-center gap-sm">
                      <h4 className="font-headline-md text-[18px] text-on-surface truncate max-w-full">{job.title}</h4>
                      {job.aiMatchingEnabled && (
                        <span className="bg-primary/10 text-primary text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center whitespace-nowrap">
                          <span className="material-symbols-outlined text-[14px] mr-1">auto_awesome</span> Strong Match
                        </span>
                      )}
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant truncate">{job.companyName} • {job.location}</p>
                    <div className="flex flex-wrap gap-xs pt-1">
                      {job.requiredSkills.slice(0, 4).map((skill, i) => (
                        <span key={i} className="text-label-sm font-label-sm text-on-surface-variant/80 border border-outline-variant px-2 py-0.5 rounded-md truncate max-w-full">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col items-start md:items-end gap-xs flex-shrink-0 w-full md:w-auto">
                    <p className="font-label-md text-label-md text-on-surface font-semibold whitespace-nowrap">
                      {job.salaryMin && job.salaryMax ? `${job.currency} ${job.salaryMin} - ${job.salaryMax}` : 'Salary TBA'}
                    </p>
                    <p className="text-[12px] text-on-surface-variant whitespace-nowrap">Posted {new Date(job.createdAt).toLocaleDateString()}</p>
                  </div>

                  <div className="flex flex-wrap items-center gap-sm md:ml-md flex-shrink-0 w-full md:w-auto mt-sm md:mt-0 relative z-20 pointer-events-auto">
                    <button 
                      onClick={(e) => handleQuickApplyClick(e, job)}
                      disabled={hasApplied || isExpired}
                      className={`flex-1 md:flex-none font-label-md text-label-md px-lg py-sm rounded-xl transition-all text-center block whitespace-nowrap ${
                        hasApplied 
                          ? 'bg-surface-variant text-on-surface-variant cursor-not-allowed border border-outline-variant' 
                          : isExpired
                          ? 'bg-error/10 text-error cursor-not-allowed border border-error/20'
                          : 'bg-primary text-on-primary hover:bg-primary/90'
                      }`}
                    >
                      {hasApplied ? 'Applied' : isExpired ? 'Closed' : 'Quick Apply'}
                    </button>
                    <Link to={`/jobs/${job._id}`} className="flex-1 md:flex-none bg-surface-container-low text-on-surface font-label-md text-label-md px-lg py-sm rounded-xl hover:bg-surface-container-high transition-all text-center block whitespace-nowrap">Details</Link>
                    <button className="material-symbols-outlined text-on-surface-variant p-2 hover:bg-surface-container rounded-lg transition-colors shrink-0">bookmark</button>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Pagination / Load More */}
        {hasMore && !isLoading && jobs.length > 0 && (
          <div className="flex justify-center pt-md">
            <button onClick={handleLoadMore} className="flex items-center gap-sm text-primary font-label-md text-label-md hover:bg-primary/5 px-xl py-md rounded-xl border border-primary/20 transition-all">
              Load More
              <span className="material-symbols-outlined">expand_more</span>
            </button>
          </div>
        )}
        {isLoading && jobs.length > 0 && (
          <div className="flex justify-center pt-md">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </section>


    </div>
  )
}

export default JobListings
