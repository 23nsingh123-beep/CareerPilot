import React, { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import applicationService from '../services/applicationService'

const upcomingInterviews = [
  { company: 'Google', date: 'Oct 28', time: '10:00 AM', type: 'Video' },
  { company: 'Stripe', date: 'Oct 30', time: '2:00 PM', type: 'Video' }
]

function Applications() {
  const [applications, setApplications] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('All Statuses')

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const data = await applicationService.getMyApplications()
        setApplications(data.applications)
      } catch (err) {
        setError('Failed to fetch applications.')
      } finally {
        setIsLoading(false)
      }
    }
    fetchApplications()
  }, [])

  const filteredApps = useMemo(() => {
    return applications.filter(app => {
      const matchSearch = app.job?.companyName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          app.job?.title.toLowerCase().includes(searchQuery.toLowerCase())
      const matchStatus = statusFilter === 'All Statuses' || app.status === statusFilter
      return matchSearch && matchStatus
    })
  }, [applications, searchQuery, statusFilter])

  const stats = useMemo(() => {
    return [
      { label: 'Applications Sent', value: applications.length, icon: 'send', color: 'primary' },
      { label: 'Under Review', value: applications.filter(a => a.status === 'Under Review').length, icon: 'visibility', color: 'tertiary' },
      { label: 'Interviews', value: applications.filter(a => a.status === 'Interview').length, icon: 'event', color: 'secondary' },
      { label: 'Offers Received', value: applications.filter(a => a.status === 'Hired').length, icon: 'verified', color: 'primary' }
    ]
  }, [applications])

  const getStages = (currentStatus) => {
    const defaultStages = ['Applied', 'Under Review', 'Interview', 'Offer', 'Hired']
    let currentIndex = defaultStages.indexOf(currentStatus)
    
    // Fallback mapping
    if (currentStatus === 'Shortlisted') currentIndex = 1 // Mapping to under review / between interview
    if (currentStatus === 'Rejected') currentIndex = defaultStages.indexOf('Under Review') // Stalled

    return defaultStages.map((name, idx) => ({
      name,
      status: currentStatus === 'Rejected' && idx > currentIndex ? 'pending' 
            : currentStatus === 'Rejected' && idx === currentIndex ? 'completed' // Failed here
            : idx < currentIndex ? 'completed' 
            : idx === currentIndex ? 'current' 
            : 'pending'
    }))
  }

  return (
    <div className="max-w-[1400px] mx-auto space-y-xl">
      {/* ── Page Header ──────────────────────────────────────── */}
      <header className="mb-xl">
        <h2 className="font-headline-lg text-headline-lg text-on-surface">My Applications</h2>
        <p className="font-body-md text-on-surface-variant mt-xs">
          Track the progress of your job applications and stay updated on every opportunity.
        </p>
      </header>

      {/* ── Summary Stats Bento ──────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-lg mb-2xl">
        {stats.map(stat => (
          <div key={stat.label} className="bg-surface-container-lowest p-lg rounded-2xl border border-outline-variant shadow-sm flex items-center gap-lg">
            <div className={`w-12 h-12 rounded-xl bg-${stat.color}/10 flex items-center justify-center text-${stat.color}`}>
              <span className="material-symbols-outlined">{stat.icon}</span>
            </div>
            <div>
              <p className="text-label-sm text-on-surface-variant uppercase tracking-wider">{stat.label}</p>
              <p className="text-headline-md font-bold text-on-surface">{isLoading ? '-' : stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-2xl">
        
        {/* ── Left Column: Application List ──────────────────── */}
        <div className="flex-1 space-y-lg">
          
          {/* Controls */}
          <div className="flex flex-wrap items-center gap-md bg-surface-container p-md rounded-2xl border border-outline-variant">
            <div className="flex-1 min-w-[200px]">
              <input 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl py-sm px-md text-body-sm focus:ring-primary focus:border-primary outline-none" 
                placeholder="Search by company or role..." 
                type="text" 
              />
            </div>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="bg-surface-container-lowest border border-outline-variant rounded-xl py-sm pl-md pr-lg text-body-sm text-on-surface-variant outline-none cursor-pointer">
              <option>All Statuses</option>
              <option>Applied</option>
              <option>Under Review</option>
              <option>Shortlisted</option>
              <option>Interview</option>
              <option>Rejected</option>
              <option>Hired</option>
            </select>
          </div>

          {/* Application Cards */}
          <div className="space-y-lg">
            {isLoading ? (
              <div className="flex justify-center p-2xl"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>
            ) : error ? (
              <div className="p-xl bg-error-container text-on-error-container rounded-2xl text-center">{error}</div>
            ) : filteredApps.length === 0 ? (
              <div className="p-2xl bg-surface-container-lowest border border-outline-variant rounded-2xl text-center text-on-surface-variant">
                No applications found matching your criteria.
              </div>
            ) : (
              filteredApps.map((app) => {
                const stages = getStages(app.status)
                const currentStageIndex = stages.findIndex(s => s.status === 'current')

                return (
                  <div key={app._id} className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-xl shadow-sm hover:shadow-md transition-shadow">
                    
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-lg mb-xl">
                      <div className="flex items-center gap-lg">
                        <div className={`w-14 h-14 rounded-xl flex items-center justify-center border border-outline-variant bg-surface-container-high`}>
                          <span className="material-symbols-outlined text-[32px] text-on-surface-variant">business</span>
                        </div>
                        <div>
                          <h3 className="font-headline-md text-headline-md leading-tight">{app.job?.companyName || 'Unknown Company'}</h3>
                          <div className="flex flex-wrap items-center gap-sm mt-xs">
                            <span className="text-body-md font-medium">{app.job?.title || 'Removed Job'}</span>
                            <span className="text-outline-variant hidden sm:inline">•</span>
                            <span className="text-body-sm text-on-surface-variant">{app.job?.location || 'Unknown'}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-start md:items-end gap-xs w-full md:w-auto">
                        <span className={`px-md py-xs rounded-full font-label-md ${
                          app.status === 'Rejected' ? 'bg-error/10 text-error' :
                          app.status === 'Hired' ? 'bg-primary text-on-primary' :
                          'bg-primary/10 text-primary'
                        }`}>
                          {app.status}
                        </span>
                        <span className="text-label-sm text-on-surface-variant">Applied: {new Date(app.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    {/* Timeline */}
                    <div className="relative py-xl">
                      <div className="absolute top-1/2 left-0 w-full h-[2px] bg-surface-container-highest -translate-y-1/2"></div>
                      
                      {/* Dynamic Progress Line Fill */}
                      <div 
                        className={`absolute top-1/2 left-0 h-[2px] -translate-y-1/2 transition-all duration-500 ${app.status === 'Rejected' ? 'bg-error' : 'bg-primary'}`}
                        style={{
                          width: `${(Math.max(currentStageIndex, 0) + 0.5) / stages.length * 100}%`
                        }}
                      ></div>

                      <div className="relative flex justify-between">
                        {stages.map((stage, i) => {
                          let nodeClass = "w-4 h-4 rounded-full z-10 "
                          let textClass = "text-label-sm "
                          
                          if (stage.status === 'completed' || stage.status === 'current') {
                            if (app.status === 'Rejected' && stage.status === 'current') {
                              nodeClass += "bg-error ring-4 ring-error/20"
                              textClass += "font-semibold text-error"
                            } else {
                              nodeClass += "bg-primary ring-4 ring-primary/20"
                              textClass += "font-semibold text-primary"
                            }
                          } else {
                            nodeClass += "bg-surface-container-highest"
                            textClass += "text-on-surface-variant"
                          }

                          return (
                            <div key={stage.name} className="flex flex-col items-center gap-sm">
                              <div className={nodeClass}></div>
                              <span className={textClass}>{stage.name}</span>
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-lg mt-lg pt-lg border-t border-outline-variant">
                      <div className="flex items-center gap-md">
                        <div className="flex items-center gap-xs text-on-surface-variant text-body-sm">
                           No AI Match Score Available
                        </div>
                      </div>
                      <div className="flex items-center gap-md w-full md:w-auto">
                        <Link to={`/jobs/${app.job?._id}`} className="flex-1 md:flex-none px-lg py-sm bg-primary text-on-primary rounded-xl text-body-sm font-semibold hover:bg-primary/90 transition-all shadow-sm block text-center">
                          View Job Details
                        </Link>
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* ── Right Column: Widgets ──────────────────────────── */}
        <aside className="w-full lg:w-80 space-y-xl">
          
          {/* Upcoming Interviews */}
          <section className="bg-surface-container-lowest rounded-2xl border border-outline-variant p-lg shadow-sm">
            <div className="flex items-center justify-between mb-lg">
              <h4 className="font-headline-md text-[18px] font-bold">Interviews</h4>
              <span className="text-label-sm bg-primary/10 text-primary px-sm py-1 rounded">Next 3 days</span>
            </div>
            <div className="space-y-md">
              {upcomingInterviews.map(interview => (
                <div key={interview.company} className="p-md rounded-xl bg-surface-container-low border border-outline-variant/50">
                  <div className="flex justify-between items-start mb-sm">
                    <p className="text-body-md font-semibold">{interview.company}</p>
                    <span className="text-label-sm text-on-surface-variant">{interview.date}</span>
                  </div>
                  <div className="flex items-center gap-xs text-body-sm text-on-surface-variant mb-md">
                    <span className="material-symbols-outlined text-[16px]">videocam</span>
                    {interview.time} • {interview.type}
                  </div>
                  <button className="w-full py-xs bg-primary text-on-primary rounded-lg text-label-md font-semibold hover:bg-primary/90 transition-all">
                    Join Meeting
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Help/Support Banner */}
          <div className="bg-surface-container-highest/30 p-lg rounded-2xl border border-dashed border-outline-variant flex flex-col items-center text-center">
            <span className="material-symbols-outlined text-outline mb-sm text-[32px]">support_agent</span>
            <p className="text-body-sm font-semibold mb-xs">Need Interview Prep?</p>
            <p className="text-label-sm text-on-surface-variant mb-md">
              Practice with our AI interviewer to boost your confidence.
            </p>
            <button className="text-primary font-semibold text-body-sm hover:underline">
              Start Practice Session →
            </button>
          </div>
          
        </aside>
      </div>
    </div>
  )
}

export default Applications
