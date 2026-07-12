import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import jobService from '../services/jobService'
import applicationService from '../services/applicationService'
import { useToast } from '../components/useToast'

import { useAuth } from '../context/AuthContext'

function JobDetails() {
  const { id } = useParams()
  const { showToast, ToastComponent } = useToast()
  const { currentUser } = useAuth()

  const [job, setJob] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  // Apply Modal State
  const [showApplyModal, setShowApplyModal] = useState(false)
  const [coverLetter, setCoverLetter] = useState('')
  const [isApplying, setIsApplying] = useState(false)
  const [applyError, setApplyError] = useState(null)

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const data = await jobService.getJobById(id)
        setJob(data.job)
      } catch (err) {
        setError('Failed to load job details. The job may have been removed.')
      } finally {
        setIsLoading(false)
      }
    }
    fetchJob()
  }, [id])

  const handleApply = async () => {
    setApplyError(null)
    setIsApplying(true)
    try {
      await applicationService.applyForJob({
        jobId: job._id,
        coverLetter,
        resume: '' // Send empty for now as per instructions (backend makes it optional)
      })
      showToast('Application submitted successfully!', 'success')
      setShowApplyModal(false)
    } catch (err) {
      setApplyError(err.response?.data?.error || 'Failed to submit application.')
      if (err.response?.data?.error?.includes('already applied')) {
        showToast('You have already applied for this job.', 'error')
      }
    } finally {
      setIsApplying(false)
    }
  }

  if (isLoading) {
    return <div className="flex justify-center p-2xl"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>
  }

  if (error || !job) {
    return <div className="p-xl bg-error-container text-on-error-container rounded-2xl text-center">{error || 'Job not found.'}</div>
  }

  const isExpired = new Date(job.applicationDeadline) < new Date() || job.status !== 'active'
  const isRecruiter = currentUser?.role === 'recruiter' || currentUser?.role === 'admin'
  const dashboardLink = isRecruiter ? "/dashboard/recruiter" : "/dashboard/student"
  const jobsLink = isRecruiter ? "/recruiter/manage-jobs" : "/jobs"

  return (
    <div className="max-w-7xl mx-auto relative">
      <ToastComponent />
      
      {/* ── Breadcrumb ───────────────────────────────────────── */}
      <nav className="flex items-center gap-xs text-outline font-label-md text-label-md mb-md">
        <Link to={dashboardLink} className="hover:text-primary">Dashboard</Link>
        <span className="material-symbols-outlined text-[16px]">chevron_right</span>
        <Link to={jobsLink} className="hover:text-primary">{isRecruiter ? 'Manage Jobs' : 'Jobs'}</Link>
        <span className="material-symbols-outlined text-[16px]">chevron_right</span>
        <span className="text-on-surface">Job Details</span>
      </nav>

      {/* ── Apply Modal ──────────────────────────────────────── */}
      {showApplyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-surface rounded-2xl p-xl w-full max-w-lg shadow-2xl relative animate-fade-in">
            <button onClick={() => setShowApplyModal(false)} disabled={isApplying} className="absolute top-4 right-4 text-on-surface-variant hover:text-on-surface">
              <span className="material-symbols-outlined">close</span>
            </button>
            <h3 className="text-headline-sm font-headline-sm mb-xs">Apply to {job.companyName}</h3>
            <p className="text-body-sm text-on-surface-variant mb-lg">You are applying for the <span className="font-bold">{job.title}</span> position.</p>
            
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

            <div className="flex gap-md mt-xl pt-md border-t border-outline-variant">
              <button onClick={() => setShowApplyModal(false)} disabled={isApplying} className="flex-1 py-sm font-label-md border border-outline-variant rounded-xl hover:bg-surface-container transition-colors disabled:opacity-50">Cancel</button>
              <button onClick={handleApply} disabled={isApplying} className="flex-1 py-sm font-label-md bg-primary text-on-primary rounded-xl hover:bg-primary/90 transition-colors shadow-sm flex justify-center items-center gap-sm disabled:opacity-70">
                {isApplying ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> : null}
                {isApplying ? 'Submitting...' : 'Submit Application'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Page Header ──────────────────────────────────────── */}
      <header className="mb-xl">
        <h2 className="font-headline-lg text-headline-lg text-on-surface mb-xs">Job Details</h2>
        <p className="font-body-md text-body-md text-outline">
          Review the role, compare your skills, and decide whether this opportunity is right for you.
        </p>
      </header>

      <div className="flex flex-col lg:flex-row gap-xl items-start relative">
        {/* ── Left Column (Main Content) ─────────────────────── */}
        <div className="w-full lg:w-[70%] space-y-lg">
          {/* Main Job Header Card */}
          <section className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant p-xl animate-fade-in">
            <div className="flex flex-col md:flex-row gap-lg">
              <div className="w-24 h-24 rounded-xl bg-primary/10 border border-outline-variant flex items-center justify-center flex-shrink-0 text-primary">
                <span className="material-symbols-outlined text-[48px]">business</span>
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap justify-between items-start gap-md mb-lg">
                  <div>
                    <h3 className="font-headline-lg text-headline-lg text-on-surface mb-xs">{job.title}</h3>
                    <p className="font-body-lg text-body-lg text-primary font-semibold">{job.companyName}</p>
                  </div>
                  <div className="flex gap-sm">
                    {isExpired ? (
                      <button disabled className="px-xl py-md bg-surface-variant text-on-surface-variant font-label-md text-label-md rounded-lg cursor-not-allowed">
                        {job.status !== 'active' ? 'Position Closed' : 'Deadline Expired'}
                      </button>
                    ) : (
                      <button onClick={() => setShowApplyModal(true)} className="px-xl py-md bg-primary text-on-primary font-label-md text-label-md rounded-lg hover:shadow-md transition-all active:scale-95">
                        Apply Now
                      </button>
                    )}
                    <button className="flex items-center gap-xs px-lg py-md border border-outline-variant rounded-lg hover:bg-surface-container transition-all text-on-surface-variant font-label-md">
                      <span className="material-symbols-outlined">bookmark</span> Save
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-md pt-lg border-t border-outline-variant">
                  <div className="bg-surface-container-low border border-outline-variant rounded-lg p-md flex flex-col gap-xs">
                    <p className="font-label-sm text-label-sm text-outline uppercase">Location</p>
                    <p className="font-body-sm text-body-sm text-on-surface flex items-center gap-sm">
                      <span className="material-symbols-outlined text-[18px]">location_on</span> {job.location}
                    </p>
                  </div>

                  <div className="bg-surface-container-low border border-outline-variant rounded-lg p-md flex flex-col gap-xs">
                    <p className="font-label-sm text-label-sm text-outline uppercase">Type</p>
                    <p className="font-body-sm text-body-sm text-on-surface flex items-center gap-sm capitalize">
                      <span className="material-symbols-outlined text-[18px]">schedule</span> {job.employmentType.replace('-', ' ')}
                    </p>
                  </div>

                  <div className="bg-surface-container-low border border-outline-variant rounded-lg p-md flex flex-col gap-xs">
                    <p className="font-label-sm text-label-sm text-outline uppercase">Salary</p>
                    <p className="font-body-sm text-body-sm text-on-surface font-semibold flex items-center gap-sm">
                      <span className="material-symbols-outlined text-[18px]">payments</span> 
                      {job.salaryMin && job.salaryMax ? `${job.currency} ${job.salaryMin} - ${job.salaryMax}` : 'TBA'}
                    </p>
                  </div>

                  <div className="bg-surface-container-low border border-outline-variant rounded-lg p-md flex flex-col gap-xs">
                    <p className="font-label-sm text-label-sm text-outline uppercase">Work Mode</p>
                    <p className="font-body-sm text-body-sm text-on-surface flex items-center gap-sm capitalize">
                      <span className="material-symbols-outlined text-[18px]">home_work</span> {job.workMode}
                    </p>
                  </div>

                  <div className="bg-surface-container-low border border-outline-variant rounded-lg p-md flex flex-col gap-xs">
                    <p className="font-label-sm text-label-sm text-outline uppercase">Posted</p>
                    <p className="font-body-sm text-body-sm text-on-surface flex items-center gap-sm">
                      <span className="material-symbols-outlined text-[18px]">history</span> {new Date(job.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="bg-surface-container-low border border-outline-variant rounded-lg p-md flex flex-col gap-xs">
                    <p className="font-label-sm text-label-sm text-outline uppercase">Deadline</p>
                    <p className={`font-body-sm text-body-sm flex items-center gap-sm ${isExpired ? 'text-error' : 'text-on-surface'}`}>
                      <span className="material-symbols-outlined text-[18px]">event</span> {new Date(job.applicationDeadline).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Job Details Sections */}
          <section className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant p-xl space-y-xl animate-fade-in">
            <div>
              <h4 className="font-headline-md text-headline-md text-on-surface mb-md">Job Overview</h4>
              <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed text-[16px] whitespace-pre-wrap">
                {job.description}
              </p>
            </div>
            
            {job.responsibilities && job.responsibilities.length > 0 && (
              <div className="pt-lg border-t border-outline-variant">
                <h4 className="font-headline-md text-headline-md text-on-surface mb-md">Responsibilities</h4>
                <ul className="space-y-sm">
                  {job.responsibilities.map((resp, i) => (
                    <li key={i} className="flex items-start gap-md font-body-md text-body-md text-on-surface-variant">
                      <span className="material-symbols-outlined text-primary mt-0.5 text-[18px]">check_circle</span>
                      {resp}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {job.requiredSkills && job.requiredSkills.length > 0 && (
              <div className="pt-lg border-t border-outline-variant">
                <h4 className="font-headline-md text-headline-md text-on-surface mb-md">Required Skills</h4>
                <div className="flex flex-wrap gap-sm mb-lg">
                  {job.requiredSkills.map(skill => (
                    <span key={skill} className="px-md py-xs bg-primary/10 text-primary rounded-full font-label-md text-label-md border border-primary/20">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {job.requirements && job.requirements.length > 0 && (
              <div className="pt-lg border-t border-outline-variant">
                <h4 className="font-headline-md text-headline-md text-on-surface mb-md">Requirements</h4>
                <ul className="space-y-sm">
                  {job.requirements.map((req, i) => (
                    <li key={i} className="flex items-start gap-md font-body-md text-body-md text-on-surface-variant">
                      <span className="material-symbols-outlined text-outline mt-0.5 text-[18px]">fiber_manual_record</span>
                      {req}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>
        </div>

        {/* ── Right Column (AI Match & Sidebar) ──────────────── */}
        <aside className="w-full lg:w-[30%] space-y-lg lg:sticky lg:top-24">
          
          {/* AI Match Insights */}
          <div className="bg-primary-container text-on-primary-container rounded-xl p-lg shadow-soft border border-primary/20">
            <div className="flex items-center gap-sm mb-md">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
              <h4 className="font-headline-md text-headline-md">AI Match Pending</h4>
            </div>
            <p className="font-body-sm text-body-sm mb-lg opacity-90">
              Upload a resume to unlock detailed AI match scoring against this job description.
            </p>
            <Link to="/resume/upload" className="block w-full py-2 bg-white text-primary text-center rounded-lg font-bold hover:shadow-md transition-shadow">Upload Resume</Link>
          </div>
          
          {/* Hiring Manager Card */}
          <div className="bg-surface-container-lowest rounded-xl p-lg border border-outline-variant shadow-soft">
            <h4 className="font-label-md text-label-md font-bold text-on-surface mb-md">Hiring Manager</h4>
            <div className="flex items-center gap-md mb-lg">
              <div className="w-12 h-12 rounded-full bg-surface-variant flex items-center justify-center text-on-surface-variant">
                <span className="material-symbols-outlined">person</span>
              </div>
              <div>
                <p className="font-label-md text-label-md font-bold text-on-surface">Recruiter</p>
                <p className="font-body-sm text-body-sm text-on-surface-variant">Hiring Team at {job.companyName}</p>
              </div>
            </div>
          </div>
          
        </aside>
      </div>
    </div>
  )
}

export default JobDetails
