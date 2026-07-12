import React, { useState, useEffect } from 'react';
import applicationService from '../services/applicationService';
import jobService from '../services/jobService';

const STATUS_COLORS = {
  'Applied': 'bg-surface-container-high text-on-surface',
  'Under Review': 'bg-tertiary-fixed text-tertiary',
  'Shortlisted': 'bg-secondary-fixed text-secondary',
  'Interview': 'bg-secondary-container text-white',
  'Rejected': 'bg-error-container text-error',
  'Hired': 'bg-primary-fixed text-primary',
};

function RecruiterApplicants() {
  const [applications, setApplications] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Filters and Pagination
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [jobFilter, setJobFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Drawer state
  const [selectedAppId, setSelectedAppId] = useState(null);
  const [selectedApp, setSelectedApp] = useState(null);
  const [drawerLoading, setDrawerLoading] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    fetchApplications();
  }, [page, search, statusFilter, jobFilter]);

  const fetchJobs = async () => {
    try {
      const res = await jobService.getRecruiterJobs();
      if (res && res.success) {
        setJobs(res.jobs);
      }
    } catch (err) {
      console.error('Failed to fetch jobs', err);
    }
  };

  const fetchApplications = async () => {
    setLoading(true);
    setError('');
    try {
      const params = { page, limit: 10 };
      if (search) params.search = search;
      if (statusFilter !== 'All') params.status = statusFilter;
      if (jobFilter) params.jobId = jobFilter;

      const res = await applicationService.getRecruiterApplications(params);
      if (res && res.success) {
        setError('');
        setApplications(res.applications);
        setTotalPages(res.pagination.pages);
        setTotalCount(res.pagination.total);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const openDrawer = async (appId) => {
    setSelectedAppId(appId);
    setDrawerLoading(true);
    try {
      const res = await applicationService.getApplicationById(appId);
      if (res && res.success) {
        setSelectedApp(res.application);
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || 'Failed to load details');
    } finally {
      setDrawerLoading(false);
    }
  };

  const closeDrawer = () => {
    setSelectedAppId(null);
    setSelectedApp(null);
  };

  const handleStatusUpdate = async (newStatus) => {
    if (newStatus === 'Rejected' || newStatus === 'Hired') {
      if (!window.confirm(`Are you sure you want to mark this applicant as ${newStatus}?`)) {
        return;
      }
    }
    
    try {
      const res = await applicationService.updateApplicationStatus(selectedAppId, newStatus);
      if (res && res.success) {
        setSelectedApp(res.application);
        // Update list and explicitly refetch
        setApplications(prev => prev.map(app => app._id === selectedAppId ? { ...app, status: newStatus } : app));
        fetchApplications();
      }
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to update status');
    }
  };

  const API_ORIGIN =
  import.meta.env.VITE_API_ORIGIN ||
  import.meta.env.VITE_API_URL?.replace(/\/api\/?$/, '') ||
  'http://localhost:5000';

const getResumeUrl = (resumePath) => {
  if (!resumePath) return '#';

  if (resumePath.startsWith('http')) {
    return resumePath;
  }

  return `${API_ORIGIN}${resumePath.startsWith('/') ? '' : '/'}${resumePath}`;
};

  return (
    <div className="relative">
      {/* Header Section */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-md mb-xl">
        <div className="space-y-xs">
          <h2 className="font-headline-lg text-headline-lg text-on-surface">Applicants</h2>
          <p className="text-on-surface-variant font-body-md text-body-md max-w-2xl">
            Review candidates, evaluate Resume Scores, and manage the hiring process.
          </p>
        </div>
      </section>

      {/* Main Workspace Area */}
      <div className="flex flex-col xl:flex-row gap-xl relative">
        
        {/* Filters and List */}
        <div className="flex-grow space-y-lg min-w-0">
          
          {/* Filter Bar */}
          <div className="bg-white p-md rounded-2xl shadow-sm border border-outline-variant flex flex-wrap items-center gap-md">
            <div className="flex-grow max-w-xs relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">search</span>
              <input 
                className="w-full pl-10 pr-md py-xs bg-surface-container-low border-none rounded-lg text-sm focus:ring-1 focus:ring-primary outline-none" 
                placeholder="Filter by name or email..." 
                type="text" 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <select 
              className="text-sm bg-surface-container-low border-none rounded-lg py-xs px-md focus:ring-1 focus:ring-primary cursor-pointer outline-none"
              value={jobFilter}
              onChange={(e) => setJobFilter(e.target.value)}
            >
              <option value="">Job Role: All</option>
              {jobs.map(job => (
                <option key={job._id} value={job._id}>{job.title}</option>
              ))}
            </select>
            <select 
              className="text-sm bg-surface-container-low border-none rounded-lg py-xs px-md focus:ring-1 focus:ring-primary cursor-pointer outline-none"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">Status: All</option>
              {['Applied', 'Under Review', 'Shortlisted', 'Interview', 'Rejected', 'Hired'].map(st => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </div>

          {/* Error / Loading */}
          {error && <div className="p-4 bg-error-container text-error rounded-xl">{error}</div>}
          
          {/* Applicants Table Container */}
          <div className="bg-white rounded-2xl shadow-sm border border-outline-variant overflow-hidden relative">
            {loading && (
              <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-10 flex items-center justify-center">
                <span className="material-symbols-outlined animate-spin text-primary text-3xl">refresh</span>
              </div>
            )}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead className="bg-surface-container-low border-b border-outline-variant text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider">
                  <tr>
                    <th className="px-lg py-md">Candidate</th>
                    <th className="px-lg py-md">Applied Role</th>
                    <th className="px-lg py-md text-center">Resume Score</th>
                    <th className="px-lg py-md text-center">Est. ATS Score</th>
                    <th className="px-lg py-md">Status</th>
                    <th className="px-lg py-md">Applied Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant">
                  {!loading && applications.length === 0 && (
                    <tr>
                      <td colSpan="6" className="px-lg py-xl text-center text-on-surface-variant">
                        No applicants found.
                      </td>
                    </tr>
                  )}
                  {applications.map(app => (
                    <tr 
                      key={app._id} 
                      onClick={() => openDrawer(app._id)}
                      className={`hover:bg-surface-container-lowest transition-colors cursor-pointer ${selectedAppId === app._id ? 'bg-surface-container-lowest' : ''}`}
                    >
                      <td className="px-lg py-lg align-middle">
                        <div className="flex items-center gap-md">
                          {app.student?.profileImage ? (
                            <img className="w-10 h-10 rounded-full object-cover border border-outline-variant" src={app.student.profileImage} alt={app.student.name} />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center font-bold text-on-surface-variant border border-outline-variant">
                              {app.student?.name?.charAt(0) || '?'}
                            </div>
                          )}
                          <div>
                            <p className="font-bold text-on-surface">{app.student?.name}</p>
                            <p className="text-xs text-on-surface-variant">{app.student?.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-lg py-lg align-middle">
                        <p className="text-sm font-medium text-on-surface">{app.job?.title}</p>
                      </td>
                      <td className="px-lg py-lg text-center align-middle">
                        {app.student?.resumeAnalysis?.overallScore ? (
                           <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary-container text-primary font-bold">
                             {app.student.resumeAnalysis.overallScore}
                           </div>
                        ) : (
                          <span className="text-xs text-on-surface-variant">N/A</span>
                        )}
                      </td>
                      <td className="px-lg py-lg text-center align-middle">
                         {app.student?.resumeAnalysis?.atsScore ? (
                           <span className="text-sm font-bold text-on-surface">{app.student.resumeAnalysis.atsScore} / 100</span>
                         ) : (
                           <span className="text-xs text-on-surface-variant">N/A</span>
                         )}
                      </td>
                      <td className="px-lg py-lg align-middle">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full font-label-sm text-label-sm whitespace-nowrap ${STATUS_COLORS[app.status] || 'bg-surface-container-high text-on-surface'}`}>
                          {app.status}
                        </span>
                      </td>
                      <td className="px-lg py-lg text-sm text-on-surface-variant align-middle">
                        {new Date(app.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            <div className="px-lg py-md flex items-center justify-between border-t border-outline-variant bg-surface-container-low">
              <p className="text-xs text-on-surface-variant">Showing {applications.length} of {totalCount} applicants</p>
              <div className="flex gap-sm">
                <button 
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-xs rounded-lg border border-outline-variant hover:bg-white transition-colors disabled:opacity-50 cursor-pointer"
                >
                  <span className="material-symbols-outlined">chevron_left</span>
                </button>
                <button 
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages || totalPages === 0}
                  className="p-xs rounded-lg border border-outline-variant hover:bg-white transition-colors disabled:opacity-50 cursor-pointer"
                >
                  <span className="material-symbols-outlined">chevron_right</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Backdrop for mobile when drawer is open */}
        {selectedAppId && (
          <div 
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 xl:hidden"
            onClick={closeDrawer}
          ></div>
        )}

        {/* Drawer / Details Panel */}
        <aside className={`fixed inset-y-0 right-0 w-full md:w-[400px] bg-surface z-50 shadow-2xl border-l border-outline-variant transform transition-transform duration-300 ease-in-out ${selectedAppId ? 'translate-x-0' : 'translate-x-full'} xl:relative xl:translate-x-0 xl:w-96 xl:z-0 xl:shadow-none xl:border-none xl:bg-transparent ${!selectedAppId ? 'xl:hidden' : ''} overflow-y-auto`}>
          
          <div className="p-lg bg-white xl:rounded-2xl shadow-sm border border-outline-variant min-h-full">
            {drawerLoading ? (
               <div className="flex flex-col items-center justify-center h-64 text-on-surface-variant">
                 <span className="material-symbols-outlined animate-spin text-primary text-3xl mb-4">refresh</span>
                 <p>Loading candidate details...</p>
               </div>
            ) : selectedApp ? (
              <div className="space-y-lg">
                <div className="flex justify-between items-start">
                  <h3 className="font-headline-sm font-bold">Candidate Details</h3>
                  <button onClick={closeDrawer} className="p-1 hover:bg-surface-container rounded-full xl:hidden">
                    <span className="material-symbols-outlined">close</span>
                  </button>
                </div>

                <div className="flex items-center gap-md">
                   {selectedApp.student?.profileImage ? (
                      <img className="w-16 h-16 rounded-full object-cover border border-outline-variant" src={selectedApp.student.profileImage} alt={selectedApp.student.name} />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-surface-container-high flex items-center justify-center text-xl font-bold text-on-surface-variant border border-outline-variant">
                        {selectedApp.student?.name?.charAt(0) || '?'}
                      </div>
                    )}
                    <div>
                      <p className="font-bold text-lg text-on-surface">{selectedApp.student?.name}</p>
                      <p className="text-sm text-on-surface-variant">{selectedApp.student?.email}</p>
                      {selectedApp.student?.phone && <p className="text-xs text-on-surface-variant mt-1">📞 {selectedApp.student.phone}</p>}
                    </div>
                </div>

                {/* Status Update */}
                <div className="bg-surface-container-low p-md rounded-xl space-y-sm">
                  <p className="text-xs font-bold text-on-surface-variant uppercase">Current Status</p>
                  <select 
                    value={selectedApp.status}
                    onChange={(e) => handleStatusUpdate(e.target.value)}
                    className={`w-full p-2 rounded-lg border border-outline text-sm font-medium outline-none cursor-pointer ${STATUS_COLORS[selectedApp.status]}`}
                  >
                    <option value="Applied">Applied</option>
                    <option value="Under Review">Under Review</option>
                    <option value="Shortlisted">Shortlisted</option>
                    <option value="Interview">Interview</option>
                    <option value="Hired">Hired</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>

                {/* Cover Letter */}
                {selectedApp.coverLetter && (
                  <div className="space-y-xs">
                    <p className="text-xs font-bold text-on-surface-variant uppercase">Cover Letter</p>
                    <div className="bg-surface-container-lowest border border-outline-variant p-md rounded-xl text-sm text-on-surface whitespace-pre-wrap max-h-40 overflow-y-auto">
                      {selectedApp.coverLetter}
                    </div>
                  </div>
                )}

                {/* Resume Access */}
                <div className="space-y-xs">
                  <p className="text-xs font-bold text-on-surface-variant uppercase">Resume</p>
                  <div className="flex items-center justify-between bg-surface-container-low p-md rounded-xl border border-outline-variant">
                    <div className="flex items-center gap-2 overflow-hidden">
                      <span className="material-symbols-outlined text-on-surface-variant">description</span>
                      <span className="text-sm truncate font-medium">{selectedApp.student?.resumeOriginalName || 'Resume.pdf'}</span>
                    </div>
                    {selectedApp.student?.resume ? (
                      <a 
                        href={getResumeUrl(selectedApp.student.resume)} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary text-sm font-bold hover:underline whitespace-nowrap"
                      >
                        View File
                      </a>
                    ) : (
                      <span className="text-xs text-on-surface-variant">Resume not available</span>
                    )}
                  </div>
                </div>

                {/* AI Insights */}
                <div className="space-y-sm border-t border-outline-variant pt-lg">
                  <h4 className="font-bold text-on-surface flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-xl">auto_awesome</span>
                    Resume AI Analysis
                  </h4>
                  
                  {selectedApp.student?.resumeAnalysis?.overallScore ? (
                    <div className="space-y-md">
                      <div className="grid grid-cols-2 gap-sm">
                         <div className="bg-primary-container text-on-primary-container p-md rounded-xl flex flex-col items-center justify-center">
                           <span className="text-2xl font-bold">{selectedApp.student.resumeAnalysis.overallScore}</span>
                           <span className="text-xs font-medium">Resume Score</span>
                         </div>
                         <div className="bg-surface-container-low p-md rounded-xl border border-outline-variant flex flex-col items-center justify-center">
                           <span className="text-2xl font-bold">{selectedApp.student.resumeAnalysis.atsScore}</span>
                           <span className="text-xs font-medium">Est. ATS Score</span>
                         </div>
                      </div>

                      <div className="space-y-xs">
                        <p className="text-xs font-bold text-on-surface-variant uppercase">AI Summary</p>
                        <p className="text-sm text-on-surface bg-surface-container-lowest p-md rounded-xl border border-outline-variant">
                          {selectedApp.student.resumeAnalysis.summary}
                        </p>
                      </div>

                      {selectedApp.student.resumeAnalysis.strengths?.length > 0 && (
                        <div className="space-y-xs">
                          <p className="text-xs font-bold text-on-surface-variant uppercase">Key Strengths</p>
                          <ul className="list-disc pl-5 text-sm text-on-surface space-y-1">
                            {selectedApp.student.resumeAnalysis.strengths.map((str, i) => <li key={i}>{str}</li>)}
                          </ul>
                        </div>
                      )}

                       {selectedApp.student.resumeAnalysis.missingSkills?.length > 0 && (
                        <div className="space-y-xs">
                          <p className="text-xs font-bold text-error uppercase">Missing Skills</p>
                          <ul className="list-disc pl-5 text-sm text-error space-y-1">
                            {selectedApp.student.resumeAnalysis.missingSkills.map((str, i) => <li key={i}>{str}</li>)}
                          </ul>
                        </div>
                      )}

                    </div>
                  ) : (
                    <div className="bg-surface-container-low p-md rounded-xl border border-outline-variant text-center space-y-2">
                      <span className="material-symbols-outlined text-on-surface-variant text-3xl">analytics</span>
                      <p className="text-sm text-on-surface-variant font-medium">Analysis not available</p>
                      <p className="text-xs text-on-surface-variant">The candidate's resume has not been analyzed by AI yet.</p>
                    </div>
                  )}

                </div>

              </div>
            ) : null}
          </div>
        </aside>
      </div>
    </div>
  );
}

export default RecruiterApplicants;
