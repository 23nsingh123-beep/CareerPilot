import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import adminService from '../services/adminService'
import { useToast } from '../components/useToast'

function AdminDashboard() {
  const { showToast, ToastComponent } = useToast()
  const [data, setData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isPeriodLoading, setIsPeriodLoading] = useState(false)
  const [error, setError] = useState(null)
  const [analyticsPeriod, setAnalyticsPeriod] = useState("monthly")

  const fetchDashboard = async () => {
    if (!data) setIsLoading(true);
    else setIsPeriodLoading(true);
    setError(null);
    try {
      const res = await adminService.getDashboardData(analyticsPeriod);
      setData(res);
    } catch (err) {
      if (!data) {
        setError(err.response?.data?.error || err.message || 'Failed to load dashboard data.');
      } else {
        showToast("Failed to fetch updated analytics.", "error");
      }
    } finally {
      setIsLoading(false);
      setIsPeriodLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, [analyticsPeriod]);

  const escapeCsvCell = (value) => {
    if (value === null || value === undefined) return '""';
    const stringValue = String(value);
    if (stringValue.includes('"') || stringValue.includes(',') || stringValue.includes('\n') || stringValue.includes('\r')) {
      return `"${stringValue.replace(/"/g, '""')}"`;
    }
    return stringValue;
  };

  const handleExportData = () => {
    if (!data) return;
    try {
      let csvContent = "\uFEFF"; // UTF-8 BOM

      // 1. Summary
      csvContent += "=== DASHBOARD SUMMARY ===\n";
      csvContent += "Metric,Value\n";
      const stats = [
        ["Total Users", data.stats.totalUsers],
        ["Students", data.stats.students],
        ["Recruiters", data.stats.recruiters],
        ["Active Users", data.stats.activeUsers],
        ["Active Jobs", data.stats.activeJobs],
        ["Total Jobs", data.stats.totalJobs],
        ["Total Applications", data.stats.totalApplications],
        ["Pending Applications", data.stats.pendingApplications],
        ["Shortlisted Applications", data.stats.shortlistedApplications],
        ["Interviews", data.stats.interviews],
        ["Hired", data.stats.hired],
        ["Resume Analyses", data.stats.resumeAnalyses]
      ];
      stats.forEach(([key, val]) => {
        csvContent += `${escapeCsvCell(key)},${escapeCsvCell(val)}\n`;
      });
      csvContent += "\n";

      // 2. Recent Users
      csvContent += "=== RECENT USERS ===\n";
      csvContent += "Name,Email,Role,Status,Joined Date\n";
      data.recentUsers.forEach(u => {
        csvContent += `${escapeCsvCell(u.name)},${escapeCsvCell(u.email)},${escapeCsvCell(u.role)},${escapeCsvCell(u.isActive ? 'Active' : 'Inactive')},${escapeCsvCell(new Date(u.createdAt).toLocaleDateString())}\n`;
      });
      csvContent += "\n";

      // 3. Recent Jobs
      csvContent += "=== RECENT JOBS ===\n";
      csvContent += "Title,Company,Location,Type,Status,Recruiter,Date Posted\n";
      data.recentJobs.forEach(j => {
        const recEmail = j.recruiter ? j.recruiter.email : 'Unknown';
        csvContent += `${escapeCsvCell(j.title)},${escapeCsvCell(j.companyName)},${escapeCsvCell(j.location)},${escapeCsvCell(j.employmentType)},${escapeCsvCell(j.status)},${escapeCsvCell(recEmail)},${escapeCsvCell(new Date(j.createdAt).toLocaleDateString())}\n`;
      });
      csvContent += "\n";

      // 4. Growth Trends
      csvContent += `=== ${analyticsPeriod.toUpperCase()} GROWTH ===\n`;
      csvContent += "Period,New Users,New Jobs,New Applications\n";
      if (data.growthData) {
        data.growthData.forEach(m => {
          csvContent += `${escapeCsvCell(m.label)},${escapeCsvCell(m.users)},${escapeCsvCell(m.jobs)},${escapeCsvCell(m.applications)}\n`;
        });
      }

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `careerpilot-dashboard-export-${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast("Data exported successfully.", "success");
    } catch (e) {
      showToast("Failed to export data.", "error");
    }
  };

  return (
    <div className="max-w-container-max mx-auto w-full flex-1 mb-24 relative">
      <ToastComponent />
      {/* Dashboard Header */}
      <header className="mb-2xl flex flex-col md:flex-row md:items-center justify-between gap-md">
        <div>
          <h1 className="text-headline-lg font-headline-lg text-on-surface">Admin Dashboard</h1>
          <p className="text-body-md text-on-surface-variant mt-xs">Monitor platform activity, oversee users, and manage CareerPilot operations.</p>
        </div>
        <button type="button" onClick={handleExportData} className="flex items-center gap-xs px-lg py-sm bg-surface-container-highest text-primary font-bold rounded-xl hover:bg-primary-fixed transition-colors active:scale-95 shadow-soft border border-outline-variant/30">
          <span className="material-symbols-outlined">download</span>
          <span>Export Data</span>
        </button>
      </header>

      {error && (
        <div className="p-4 bg-error-container text-on-error-container rounded-xl flex items-center justify-between mb-xl">
          <span>{error}</span>
          <button onClick={fetchDashboard} className="underline font-bold">Retry</button>
        </div>
      )}

      {isLoading && !error && (
        <div className="flex flex-col items-center justify-center py-2xl">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-md"></div>
          <p className="text-on-surface-variant font-label-md">Loading live dashboard data...</p>
        </div>
      )}

      {!isLoading && !error && data && (
        <>
          {/* KPI Summary Cards */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-lg mb-2xl">
            <Link to="/admin/users" className="bg-surface-container-lowest p-lg rounded-2xl border border-outline-variant/30 shadow-soft hover:shadow-md transition-shadow group">
              <div className="flex items-center justify-between mb-lg">
                <div className="p-2 bg-primary/10 rounded-lg text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                  <span className="material-symbols-outlined">group</span>
                </div>
                <span className="text-label-sm font-bold text-tertiary">Live</span>
              </div>
              <p className="text-label-md text-on-surface-variant mb-xs">Total Users</p>
              <p className="text-headline-lg font-bold text-on-surface">{data.stats.totalUsers}</p>
            </Link>
            <Link to="/admin/users?role=student" className="bg-surface-container-lowest p-lg rounded-2xl border border-outline-variant/30 shadow-soft hover:shadow-md transition-shadow group">
              <div className="flex items-center justify-between mb-lg">
                <div className="p-2 bg-secondary/10 rounded-lg text-secondary group-hover:bg-secondary group-hover:text-white transition-colors">
                  <span className="material-symbols-outlined">school</span>
                </div>
                <span className="text-label-sm font-bold text-tertiary">Live</span>
              </div>
              <p className="text-label-md text-on-surface-variant mb-xs">Total Students</p>
              <p className="text-headline-lg font-bold text-on-surface">{data.stats.students}</p>
            </Link>
            <Link to="/admin/users?role=recruiter" className="bg-surface-container-lowest p-lg rounded-2xl border border-outline-variant/30 shadow-soft hover:shadow-md transition-shadow group">
              <div className="flex items-center justify-between mb-lg">
                <div className="p-2 bg-tertiary/10 rounded-lg text-tertiary group-hover:bg-tertiary group-hover:text-white transition-colors">
                  <span className="material-symbols-outlined">work</span>
                </div>
                <span className="text-label-sm font-bold text-tertiary">Live</span>
              </div>
              <p className="text-label-md text-on-surface-variant mb-xs">Total Recruiters</p>
              <p className="text-headline-lg font-bold text-on-surface">{data.stats.recruiters}</p>
            </Link>
            <Link to="/admin/users?status=active" className="bg-surface-container-lowest p-lg rounded-2xl border border-outline-variant/30 shadow-soft hover:shadow-md transition-shadow group">
              <div className="flex items-center justify-between mb-lg">
                <div className="p-2 bg-surface-container-high rounded-lg text-on-surface group-hover:bg-on-surface group-hover:text-surface transition-colors">
                  <span className="material-symbols-outlined">assignment</span>
                </div>
                <span className="text-label-sm font-bold text-primary">Live</span>
              </div>
              <p className="text-label-md text-on-surface-variant mb-xs">Active Jobs</p>
              <p className="text-headline-lg font-bold text-on-surface">{data.stats.activeJobs}</p>
            </Link>
            <div className="bg-surface-container-lowest p-lg rounded-2xl border border-outline-variant/30 shadow-soft">
              <div className="flex items-center justify-between mb-lg">
                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                  <span className="material-symbols-outlined">send</span>
                </div>
                <span className="text-label-sm font-bold text-primary">Live</span>
              </div>
              <p className="text-label-md text-on-surface-variant mb-xs">Applications</p>
              <p className="text-headline-lg font-bold text-on-surface">{data.stats.totalApplications}</p>
            </div>
            <div className="bg-error-container/10 p-lg rounded-2xl border border-error/20 shadow-soft">
              <div className="flex items-center justify-between mb-lg">
                <div className="p-2 bg-error-container rounded-lg text-error">
                  <span className="material-symbols-outlined">warning</span>
                </div>
                <span className="text-label-sm font-bold text-error">Warning</span>
              </div>
              <p className="text-label-md text-on-surface-variant mb-xs">Job Approvals</p>
              <p className="text-headline-lg font-bold text-error">0</p>
            </div>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-xl">
            {/* Left Column */}
            <div className="lg:col-span-8 flex flex-col gap-xl">
              {/* Platform Analytics */}
              <section className="bg-surface-container-lowest p-xl rounded-2xl border border-outline-variant/30 shadow-soft">
                <div className="flex justify-between items-center mb-lg">
                  <h3 className="text-headline-md font-headline-md text-on-surface flex items-center gap-sm">
                    Platform Analytics
                    {isPeriodLoading && <span className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></span>}
                  </h3>
                  <div className="flex gap-xs bg-surface-container-low p-1 rounded-lg">
                    <button type="button" onClick={() => setAnalyticsPeriod('weekly')} className={`px-sm py-xs text-label-sm rounded-lg transition-colors ${analyticsPeriod === 'weekly' ? 'bg-primary text-on-primary shadow-sm' : 'hover:bg-white'}`}>Weekly</button>
                    <button type="button" onClick={() => setAnalyticsPeriod('monthly')} className={`px-sm py-xs text-label-sm rounded-lg transition-colors ${analyticsPeriod === 'monthly' ? 'bg-primary text-on-primary shadow-sm' : 'hover:bg-white'}`}>Monthly</button>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-xl">
                  {/* Visual Chart Mock mapped to growthData */}
                  <div className="h-64 bg-surface-container-low rounded-2xl relative overflow-hidden flex items-end px-md gap-sm border border-outline-variant/10">
                    {data.growthData && data.growthData.map((periodData, idx) => {
                      const maxApp = Math.max(...data.growthData.map(m => m.applications), 1);
                      const heightPercent = Math.max(10, Math.round((periodData.applications / maxApp) * 80));
                      return (
                        <div key={idx} className="w-full bg-primary/20 h-[80%] rounded-t-lg relative group flex flex-col justify-end">
                          <div style={{ height: `${heightPercent}%` }} className="absolute inset-x-0 bottom-0 bg-primary rounded-t-lg transition-all duration-700"></div>
                          <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-on-surface-variant whitespace-nowrap">{periodData.label}</span>
                        </div>
                      );
                    })}
                    <div className="absolute top-md right-md flex items-center gap-xs bg-white/90 backdrop-blur px-sm py-xs rounded-lg shadow-sm border border-outline-variant/30">
                      <span className="w-2 h-2 rounded-full bg-primary"></span>
                      <span className="text-label-sm">{analyticsPeriod === 'weekly' ? 'Weekly Applications' : 'Monthly Applications'}</span>
                    </div>
                  </div>
                  {/* Metrics List */}
                  <div className="space-y-md">
                    <div className="space-y-xs">
                      <div className="flex justify-between items-end">
                        <span className="text-label-md font-label-md">Active Users</span>
                        <span className="text-primary font-bold">{data.stats.activeUsers} Users</span>
                      </div>
                      <div className="w-full h-2 bg-surface-container-high rounded-full overflow-hidden">
                        <div className="h-full bg-primary" style={{ width: `${Math.min(100, (data.stats.activeUsers / Math.max(1, data.stats.totalUsers)) * 100)}%` }}></div>
                      </div>
                    </div>
                    <div className="space-y-xs">
                      <div className="flex justify-between items-end">
                        <span className="text-label-md font-label-md">Resume Analyses</span>
                        <span className="text-secondary font-bold">{data.stats.resumeAnalyses} Resumes</span>
                      </div>
                      <div className="w-full h-2 bg-surface-container-high rounded-full overflow-hidden">
                        <div className="h-full bg-secondary" style={{ width: `${Math.min(100, (data.stats.resumeAnalyses / Math.max(1, data.stats.students)) * 100)}%` }}></div>
                      </div>
                    </div>
                    <div className="space-y-xs">
                      <div className="flex justify-between items-end">
                        <span className="text-label-md font-label-md">Pending Applications</span>
                        <span className="text-tertiary font-bold">{data.stats.pendingApplications} Apps</span>
                      </div>
                      <div className="w-full h-2 bg-surface-container-high rounded-full overflow-hidden">
                        <div className="h-full bg-tertiary" style={{ width: `${Math.min(100, (data.stats.pendingApplications / Math.max(1, data.stats.totalApplications)) * 100)}%` }}></div>
                      </div>
                    </div>
                    <div className="space-y-xs">
                      <div className="flex justify-between items-end">
                        <span className="text-label-md font-label-md">Hired Candidates</span>
                        <span className="text-on-surface font-bold">{data.stats.hired} Candidates</span>
                      </div>
                      <div className="w-full h-2 bg-surface-container-high rounded-full overflow-hidden">
                        <div className="h-full bg-on-surface" style={{ width: `${Math.min(100, (data.stats.hired / Math.max(1, data.stats.totalApplications)) * 100)}%` }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* User Management Preview */}
              <section className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-soft overflow-hidden">
                <div className="px-xl py-lg border-b border-outline-variant flex justify-between items-center bg-surface-container-low">
                  <h2 className="text-label-md font-bold text-on-surface uppercase tracking-wider">Recent Users</h2>
                  <Link to="/admin/users" className="text-primary text-label-md font-bold hover:underline">View All Users</Link>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-surface-container-low text-label-sm text-on-surface-variant border-b border-outline-variant">
                      <tr>
                        <th className="px-xl py-md font-medium">Name</th>
                        <th className="px-xl py-md font-medium">Role</th>
                        <th className="px-xl py-md font-medium">Email</th>
                        <th className="px-xl py-md font-medium">Status</th>
                        <th className="px-xl py-md font-medium">Joined Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant/30">
                      {data.recentUsers.length === 0 && (
                        <tr><td colSpan="5" className="p-xl text-center text-on-surface-variant">No users found.</td></tr>
                      )}
                      {data.recentUsers.map(user => (
                        <tr key={user._id} className="hover:bg-surface-container-low/50 transition-colors">
                          <td className="px-xl py-md">
                            <Link to={`/admin/users?email=${encodeURIComponent(user.email)}`} className="flex items-center gap-md hover:underline cursor-pointer group">
                              {user.profileImage ? (
                                <img alt={user.name} className="w-8 h-8 rounded-full object-cover border border-outline-variant/50" src={user.profileImage} />
                              ) : (
                                <div className="w-8 h-8 rounded-full bg-surface-variant flex items-center justify-center font-bold text-[10px] text-on-surface-variant">{user.name?.charAt(0)}</div>
                              )}
                              <span className="text-body-sm font-medium group-hover:text-primary transition-colors">{user.name}</span>
                            </Link>
                          </td>
                          <td className="px-xl py-md">
                            <span className={`px-sm py-0.5 text-[10px] font-bold rounded-full uppercase ${user.role === 'student' ? 'bg-secondary-fixed text-on-secondary-fixed-variant' : user.role === 'recruiter' ? 'bg-tertiary-fixed text-on-tertiary-fixed-variant' : 'bg-primary-fixed text-on-primary-fixed-variant'}`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="px-xl py-md text-body-sm text-on-surface-variant">{user.email}</td>
                          <td className="px-xl py-md">
                            {user.isActive ? (
                              <span className="flex items-center gap-xs text-green-600 text-[10px] font-bold uppercase">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-600"></span> Active
                              </span>
                            ) : (
                              <span className="flex items-center gap-xs text-error text-[10px] font-bold uppercase">
                                <span className="w-1.5 h-1.5 rounded-full bg-error"></span> Inactive
                              </span>
                            )}
                          </td>
                          <td className="px-xl py-md text-body-sm text-on-surface-variant">{new Date(user.createdAt).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            </div>

            {/* Right Column */}
            <div className="lg:col-span-4 flex flex-col gap-xl">
              {/* Pending Approvals */}
              <section className="bg-surface-container-lowest p-xl rounded-2xl border border-outline-variant/30 shadow-soft">
                <div className="flex justify-between items-center mb-lg">
                  <h3 className="text-label-md font-bold uppercase tracking-wider text-on-surface">Pending Approvals</h3>
                  <span className="px-sm py-xs bg-surface-variant text-on-surface-variant text-[10px] font-black rounded-lg">0 NEW</span>
                </div>
                <div className="space-y-md">
                  <p className="text-center text-on-surface-variant text-sm py-md">No pending approvals available.</p>
                  <button 
                    type="button" 
                    disabled 
                    aria-disabled="true" 
                    title="Job moderation is not included in this MVP." 
                    className="w-full text-center text-on-surface-variant font-bold text-label-sm py-xs opacity-50 cursor-not-allowed"
                  >
                    View Moderation Queue
                  </button>
                </div>
              </section>

              {/* Recent Activity Feed */}
              <section className="bg-surface-container-lowest p-xl rounded-2xl border border-outline-variant/30 shadow-soft">
                <h3 className="text-label-md font-bold uppercase tracking-wider text-on-surface mb-lg">Recent Activity</h3>
                <div className="space-y-lg relative">
                  <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-outline-variant opacity-20"></div>
                  
                  {data.recentApplications.length === 0 && data.recentJobs.length === 0 && (
                    <p className="text-center text-on-surface-variant text-sm py-md relative pl-xl">No recent activity.</p>
                  )}

                  {data.recentApplications.slice(0,3).map(app => (
                    <div key={app._id} className="relative pl-xl">
                      <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="material-symbols-outlined text-primary text-[14px]">send</span>
                      </div>
                      <p className="text-body-sm"><span className="font-bold text-on-surface">{app.student?.name}</span> applied for {app.job?.title}</p>
                      <p className="text-label-sm text-on-surface-variant">{new Date(app.createdAt).toLocaleDateString()}</p>
                    </div>
                  ))}

                  {data.recentJobs.slice(0,2).map(job => (
                    <Link key={job._id} to={`/jobs/${job._id}`} className="relative pl-xl block group hover:bg-surface-container-lowest p-2 rounded-lg -ml-2 transition-colors">
                      <div className="absolute left-2 top-3 w-6 h-6 rounded-full bg-secondary/10 flex items-center justify-center group-hover:bg-secondary/20 transition-colors">
                        <span className="material-symbols-outlined text-secondary text-[14px]">business</span>
                      </div>
                      <p className="text-body-sm group-hover:text-primary transition-colors"><span className="font-bold text-on-surface">{job.companyName}</span> posted a job: {job.title}</p>
                      <p className="text-label-sm text-on-surface-variant">{new Date(job.createdAt).toLocaleDateString()}</p>
                    </Link>
                  ))}

                </div>
              </section>
            </div>
          </div>

          {/* Bottom Section: AI Accent */}
          <section className="mt-2xl p-xl rounded-2xl bg-primary/5 border border-primary/10 flex flex-col md:flex-row items-center justify-between gap-lg relative overflow-hidden">
            <div className="flex items-center gap-lg max-w-2xl relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-white shadow-soft flex items-center justify-center shrink-0 border border-primary/20">
                <span className="material-symbols-outlined text-primary text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
              </div>
              <div>
                <h3 className="text-headline-md font-headline-md text-primary">System Smart Insight</h3>
                <p className="text-body-md text-on-surface-variant mt-xs">CareerPilot has recorded {data.stats.totalApplications} total applications. AI Resume analysis is active for {data.stats.resumeAnalyses} students.</p>
              </div>
            </div>
            <Link to="/admin/reports" className="whitespace-nowrap px-xl py-md bg-primary text-on-primary rounded-xl font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all active:scale-95 relative z-10">
              Generate Report
            </Link>
          </section>
        </>
      )}
    </div>
  )
}

export default AdminDashboard
