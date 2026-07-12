import React, { useState, useEffect } from 'react';
import adminService from '../services/adminService';
import { useToast } from '../components/useToast';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

function AdminReportsAnalytics() {
  const { showToast, ToastComponent } = useToast();
  const [range, setRange] = useState('30d');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [generatingPdf, setGeneratingPdf] = useState(false);

  useEffect(() => {
    fetchReports();
  }, [range]);

  const fetchReports = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await adminService.getReports(range);
      if (res && res.success) {
        setData(res);
      } else {
        throw new Error('Failed to load reports');
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  const escapeCsvCell = (value) => {
    if (value === null || value === undefined) return '""';
    const stringValue = String(value);
    if (stringValue.includes('"') || stringValue.includes(',') || stringValue.includes('\n') || stringValue.includes('\r')) {
      return `"${stringValue.replace(/"/g, '""')}"`;
    }
    return stringValue;
  };

  const handleExportCSV = () => {
    if (!data) return;

    let csvContent = "\uFEFF"; // UTF-8 BOM

    // Summary Section
    csvContent += "=== SUMMARY ===\n";
    csvContent += `Total Users,${escapeCsvCell(data.summary.totalUsers)}\n`;
    csvContent += `Total Applications,${escapeCsvCell(data.summary.totalApplications)}\n`;
    csvContent += `Active Jobs,${escapeCsvCell(data.summary.activeJobs)}\n`;
    csvContent += `Resume Analyses,${escapeCsvCell(data.summary.resumeAnalyses)}\n`;
    csvContent += `Platform Growth %,${escapeCsvCell(data.summary.platformGrowth)}\n`;
    csvContent += `Average Resume Score,${escapeCsvCell(data.summary.averageResumeScore)}\n`;
    csvContent += `Average ATS Score,${escapeCsvCell(data.summary.averageAtsScore)}\n`;
    csvContent += `Hiring Success Rate %,${escapeCsvCell(data.summary.hiringSuccessRate)}\n`;
    csvContent += "\n";

    // Time Series Section
    csvContent += "=== TIME SERIES ===\n";
    csvContent += "Date,New Users,New Jobs,New Applications,Resume Analyses\n";
    if (data.timeSeries && data.timeSeries.users) {
      data.timeSeries.users.forEach((item, i) => {
        const jobs = data.timeSeries.jobs[i]?.count || 0;
        const apps = data.timeSeries.applications[i]?.count || 0;
        const analyses = data.timeSeries.resumeAnalyses[i]?.count || 0;
        csvContent += `${escapeCsvCell(item.date)},${escapeCsvCell(item.count)},${escapeCsvCell(jobs)},${escapeCsvCell(apps)},${escapeCsvCell(analyses)}\n`;
      });
    }
    csvContent += "\n";

    // Recruitment Section
    csvContent += "=== TOP HIRING COMPANIES ===\n";
    csvContent += "Company,Jobs Posted\n";
    data.recruitment?.topCompanies?.forEach(c => csvContent += `${escapeCsvCell(c.name)},${escapeCsvCell(c.count)}\n`);
    csvContent += "\n";

    csvContent += "=== MOST APPLIED JOBS ===\n";
    csvContent += "Job Title,Company,Applications\n";
    data.recruitment?.mostAppliedJobs?.forEach(j => csvContent += `${escapeCsvCell(j.title)},${escapeCsvCell(j.company)},${escapeCsvCell(j.count)}\n`);
    csvContent += "\n";

    // System Health
    csvContent += "=== SYSTEM HEALTH ===\n";
    csvContent += `API Server,${escapeCsvCell(data.systemHealth.api)}\n`;
    csvContent += `Database,${escapeCsvCell(data.systemHealth.database)}\n`;
    csvContent += `Gemini AI,${escapeCsvCell(data.systemHealth.gemini)}\n`;
    csvContent += `Authentication,${escapeCsvCell(data.systemHealth.authentication)}\n`;
    csvContent += `Storage,${escapeCsvCell(data.systemHealth.storage)}\n`;
    csvContent += "\n";

    // Trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `careerpilot-report-${range}.csv`);
    document.body.appendChild(link);
    link.click();
    link.click();
    document.body.removeChild(link);
    showToast("CSV exported successfully.", "success");
  };

  const handleExportPDF = () => {
    if (!data) return;
    setGeneratingPdf(true);

    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.width;
      
      doc.setFontSize(20);
      doc.setTextColor(40, 40, 40);
      doc.text('CareerPilot Analytics Report', pageWidth / 2, 20, { align: 'center' });
      
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(`Generated Date: ${new Date().toLocaleDateString()}`, 14, 30);
      doc.text(`Selected Range: ${range}`, 14, 35);

      autoTable(doc, {
        startY: 45,
        head: [['Metric', 'Value']],
        body: [
          ['Total Users', data.summary.totalUsers.toString()],
          ['Total Applications', data.summary.totalApplications.toString()],
          ['Active Jobs', data.summary.activeJobs.toString()],
          ['Resume Analyses', data.summary.resumeAnalyses.toString()],
          ['Platform Growth (%)', data.summary.platformGrowth.toString()],
          ['Average Resume Score', data.summary.averageResumeScore.toString()],
          ['Average ATS Score', data.summary.averageAtsScore.toString()],
          ['Hiring Success Rate (%)', data.summary.hiringSuccessRate.toString()]
        ],
        theme: 'striped',
        headStyles: { fillColor: [63, 81, 181] },
        margin: { top: 10 }
      });

      autoTable(doc, {
        startY: doc.lastAutoTable.finalY + 10,
        head: [['Top Companies', 'Jobs Posted']],
        body: data.recruitment?.topCompanies?.length > 0 
          ? data.recruitment.topCompanies.map(c => [c.name, c.count.toString()])
          : [['No data available', '']],
        theme: 'striped',
        headStyles: { fillColor: [63, 81, 181] }
      });

      autoTable(doc, {
        startY: doc.lastAutoTable.finalY + 10,
        head: [['Most Applied Jobs', 'Company', 'Applications']],
        body: data.recruitment?.mostAppliedJobs?.length > 0 
          ? data.recruitment.mostAppliedJobs.map(j => [j.title, j.company, j.count.toString()])
          : [['No data available', '', '']],
        theme: 'striped',
        headStyles: { fillColor: [63, 81, 181] }
      });

      autoTable(doc, {
        startY: doc.lastAutoTable.finalY + 10,
        head: [['Most Missing Skills', 'Count']],
        body: data.aiPerformance?.topMissingSkills?.length > 0
          ? data.aiPerformance.topMissingSkills.map(s => [s.skill, s.count.toString()])
          : [['No data available', '']],
        theme: 'striped',
        headStyles: { fillColor: [63, 81, 181] }
      });

      autoTable(doc, {
        startY: doc.lastAutoTable.finalY + 10,
        head: [['System Component', 'Status']],
        body: [
          ['API Server', data.systemHealth.api],
          ['Database', data.systemHealth.database],
          ['Gemini AI', data.systemHealth.gemini],
          ['Authentication', data.systemHealth.authentication],
          ['Storage', data.systemHealth.storage]
        ],
        theme: 'striped',
        headStyles: { fillColor: [63, 81, 181] }
      });

      doc.save(`careerpilot-report-${range}.pdf`);
      showToast('PDF exported successfully!', 'success');
    } catch (err) {
      console.error(err);
      showToast('Failed to generate PDF.', 'error');
    } finally {
      setGeneratingPdf(false);
    }
  };

  const renderInsights = () => {
    if (!data) return [];
    const insights = [];

    if (data.summary.platformGrowth > 0) {
      insights.push(`Platform registrations increased by ${data.summary.platformGrowth}% compared to the previous period.`);
    } else if (data.summary.platformGrowth < 0) {
      insights.push(`Platform registrations decreased by ${Math.abs(data.summary.platformGrowth)}% compared to the previous period.`);
    }

    if (data.recruitment.mostAppliedJobs?.length > 0) {
      insights.push(`"${data.recruitment.mostAppliedJobs[0].title}" at ${data.recruitment.mostAppliedJobs[0].company} is currently the most popular job.`);
    }

    if (data.aiPerformance.topMissingSkills?.length > 0) {
      insights.push(`"${data.aiPerformance.topMissingSkills[0].skill}" is the most commonly missing skill across all analyzed resumes.`);
    }

    if (data.recruitment.topCompanies?.length > 0) {
      insights.push(`${data.recruitment.topCompanies[0].name} leads in job postings with ${data.recruitment.topCompanies[0].count} active listings.`);
    }

    if (insights.length === 0) {
      insights.push("Not enough data to generate insights yet.");
    }

    return insights;
  };

  // Chart Rendering Logic
  const renderChart = () => {
    if (!data || !data.timeSeries || !data.timeSeries.users || data.timeSeries.users.length === 0) {
      return (
        <div className="flex-1 flex items-center justify-center text-on-surface-variant h-full">
          Not enough data to display chart.
        </div>
      );
    }

    const { users, applications } = data.timeSeries;
    
    // Find maximum combined value to scale heights
    const maxVal = Math.max(1, ...users.map((u, i) => Math.max(u.count, applications[i]?.count || 0)));

    // To prevent overcrowding, if we have 30+ items, we might only want to show every Nth label or group them
    const showLabels = users.length <= 15;

    return users.map((u, i) => {
      const uCount = u.count;
      const aCount = applications[i]?.count || 0;
      
      const uHeight = Math.max(1, (uCount / maxVal) * 100);
      const aHeight = Math.max(1, (aCount / maxVal) * 100);

      // Format date for display
      const dateParts = u.date.split('-');
      const label = dateParts.length === 3 
        ? `${dateParts[1]}/${dateParts[2]}` 
        : `${dateParts[1]}/${dateParts[0].substring(2)}`;

      return (
        <div key={i} className="flex-1 flex flex-col items-center gap-sm h-full justify-end group relative">
          {/* Tooltip on hover */}
          <div className="absolute bottom-full mb-2 bg-surface-container-high px-2 py-1 rounded text-label-sm shadow-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 pointer-events-none">
            {u.date}<br/>
            Users: {uCount}<br/>
            Apps: {aCount}
          </div>
          
          <div className="w-full bg-primary-fixed-dim rounded-t-sm opacity-40 transition-all duration-500 min-w-[4px]" style={{ height: `${aHeight}%` }}></div>
          <div className="w-full bg-primary rounded-t-sm transition-all duration-500 absolute bottom-0 min-w-[4px]" style={{ height: `${uHeight}%` }}></div>
          
          {(showLabels || i % Math.ceil(users.length / 10) === 0) && (
            <span className="text-[10px] text-outline mt-sm absolute -bottom-6 truncate">{label}</span>
          )}
        </div>
      );
    });
  };

  return (
    <div className="max-w-container-max mx-auto w-full flex-1 mb-24 relative">
      <ToastComponent />
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-2xl gap-md">
        <div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface">Reports & Analytics</h1>
          <p className="text-on-surface-variant font-body-md mt-xs">Monitor platform growth, recruitment trends, AI performance, and system health.</p>
        </div>
        <div className="flex flex-wrap gap-md">
          <select 
            value={range}
            onChange={(e) => setRange(e.target.value)}
            className="px-md py-sm bg-surface-container-lowest border border-outline-variant rounded-lg text-on-surface-variant font-label-md hover:bg-surface-container-high transition-colors outline-none cursor-pointer"
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
            <option value="6m">Last 6 Months</option>
            <option value="1y">Last 1 Year</option>
          </select>
          <button 
            type="button"
            onClick={handleExportPDF}
            disabled={loading || !data || generatingPdf} 
            className="px-md py-sm bg-surface-container-lowest border border-outline-variant rounded-lg text-on-surface-variant font-label-md flex items-center gap-xs hover:bg-surface-container-high transition-colors disabled:opacity-50" 
          >
            {generatingPdf ? (
              <span className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <span className="material-symbols-outlined text-md">download</span>
            )}
            Download PDF
          </button>
          <button 
            type="button"
            onClick={handleExportCSV}
            disabled={loading || !data}
            className="px-md py-sm bg-primary text-white rounded-lg font-label-md flex items-center gap-xs shadow-md hover:bg-primary-container transition-all disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-md">ios_share</span>
            Export Report
          </button>
        </div>
      </div>

      {error ? (
        <div className="bg-error-container text-on-error-container p-lg rounded-xl flex flex-col items-center justify-center my-xl">
          <span className="material-symbols-outlined text-4xl mb-md">error</span>
          <p className="text-body-lg font-bold">{error}</p>
          <button onClick={fetchReports} className="mt-md px-lg py-sm bg-error text-white rounded-lg hover:bg-error/90 font-bold">Retry</button>
        </div>
      ) : loading ? (
        <div className="flex flex-col items-center justify-center h-64">
          <span className="material-symbols-outlined animate-spin text-primary text-4xl mb-md">refresh</span>
          <p className="text-on-surface-variant">Crunching the latest analytics...</p>
        </div>
      ) : data ? (
        <>
          {/* 1. Summary KPI Cards */}
          <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-md mb-2xl">
            <div className="bg-surface-container-lowest p-md rounded-2xl border border-outline-variant shadow-sm hover:shadow-md transition-shadow">
              <p className="text-label-sm text-outline font-label-sm uppercase tracking-wider mb-xs">Total Users</p>
              <h3 className="font-headline-md text-headline-md text-primary">{data.summary.totalUsers}</h3>
              <div className="flex items-center gap-xs text-secondary font-label-sm mt-xs">
                <span className="material-symbols-outlined text-sm">group</span>
                <span>All time</span>
              </div>
            </div>
            <div className="bg-surface-container-lowest p-md rounded-2xl border border-outline-variant shadow-sm hover:shadow-md transition-shadow">
              <p className="text-label-sm text-outline font-label-sm uppercase tracking-wider mb-xs">Total Apps</p>
              <h3 className="font-headline-md text-headline-md text-on-surface">{data.summary.totalApplications}</h3>
              <div className="flex items-center gap-xs text-secondary font-label-sm mt-xs">
                <span className="material-symbols-outlined text-sm">description</span>
                <span>All time</span>
              </div>
            </div>
            <div className="bg-surface-container-lowest p-md rounded-2xl border border-outline-variant shadow-sm hover:shadow-md transition-shadow">
              <p className="text-label-sm text-outline font-label-sm uppercase tracking-wider mb-xs">Active Jobs</p>
              <h3 className="font-headline-md text-headline-md text-on-surface">{data.summary.activeJobs}</h3>
              <div className="flex items-center gap-xs text-on-surface-variant font-label-sm mt-xs">
                <span className="material-symbols-outlined text-sm">work</span>
                <span>Current</span>
              </div>
            </div>
            <div className="bg-surface-container-lowest p-md rounded-2xl border border-outline-variant shadow-sm hover:shadow-md transition-shadow">
              <p className="text-label-sm text-outline font-label-sm uppercase tracking-wider mb-xs">AI Analyses</p>
              <h3 className="font-headline-md text-headline-md text-on-surface">{data.summary.resumeAnalyses}</h3>
              <div className="flex items-center gap-xs text-secondary font-label-sm mt-xs">
                <span className="material-symbols-outlined text-sm">auto_awesome</span>
                <span>All time</span>
              </div>
            </div>
            <div className="bg-surface-container-lowest p-md rounded-2xl border border-outline-variant shadow-sm hover:shadow-md transition-shadow">
              <p className="text-label-sm text-outline font-label-sm uppercase tracking-wider mb-xs">Platform Growth</p>
              <h3 className={`font-headline-md text-headline-md ${data.summary.platformGrowth >= 0 ? 'text-secondary' : 'text-error'}`}>
                {data.summary.platformGrowth > 0 ? '+' : ''}{data.summary.platformGrowth}%
              </h3>
              <div className={`flex items-center gap-xs ${data.summary.platformGrowth >= 0 ? 'text-secondary' : 'text-error'} font-label-sm mt-xs`}>
                <span className="material-symbols-outlined text-sm">{data.summary.platformGrowth >= 0 ? 'trending_up' : 'trending_down'}</span>
                <span>vs Prev Period</span>
              </div>
            </div>
            <div className="bg-surface-container-lowest p-md rounded-2xl border border-outline-variant shadow-sm hover:shadow-md transition-shadow">
              <p className="text-label-sm text-outline font-label-sm uppercase tracking-wider mb-xs">Avg Resume Score</p>
              <h3 className="font-headline-md text-headline-md text-on-surface">{data.summary.averageResumeScore}<span className="text-body-sm font-normal text-outline">/100</span></h3>
              <div className="flex items-center gap-xs text-secondary font-label-sm mt-xs">
                <span className="material-symbols-outlined text-sm">score</span>
                <span>Overall</span>
              </div>
            </div>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-xl">
            {/* 2. Platform Analytics (Large Card) */}
            <div className="lg:col-span-8 flex flex-col gap-xl min-w-0 w-full">
              <div className="bg-surface-container-lowest p-xl rounded-2xl border border-outline-variant shadow-sm w-full">
                <div className="flex justify-between items-start mb-lg">
                  <div>
                    <h4 className="font-headline-md text-body-lg text-on-surface">Platform Growth & Activity</h4>
                    <p className="text-body-sm text-outline">Visual breakdown of user engagement and system throughput.</p>
                  </div>
                  <div className="flex gap-sm">
                    <span className="px-sm py-1 bg-primary/10 text-primary text-label-sm rounded-md font-bold">New Users</span>
                    <span className="px-sm py-1 bg-secondary/10 text-secondary text-label-sm rounded-md font-bold text-opacity-40">Applications</span>
                  </div>
                </div>
                <div className="h-[400px] w-full relative flex items-end justify-between px-md gap-[2px] sm:gap-sm overflow-visible pb-8 pt-8">
                  {renderChart()}
                  <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-5 pr-xl pb-10 pt-8">
                    <div className="border-t border-on-surface h-0 w-full"></div>
                    <div className="border-t border-on-surface h-0 w-full"></div>
                    <div className="border-t border-on-surface h-0 w-full"></div>
                    <div className="border-t border-on-surface h-0 w-full"></div>
                  </div>
                </div>
              </div>

              {/* 3. Recruitment Analytics */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-xl">
                <div className="bg-surface-container-lowest p-lg rounded-2xl border border-outline-variant shadow-sm">
                  <h4 className="font-headline-md text-body-lg text-on-surface mb-md">Top Hiring Companies</h4>
                  <div className="space-y-md">
                    {data.recruitment.topCompanies.length === 0 && (
                      <p className="text-body-sm text-on-surface-variant">No data available.</p>
                    )}
                    {data.recruitment.topCompanies.map((company, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-sm">
                          <div className={`w-8 h-8 rounded bg-surface-container-high flex items-center justify-center font-bold ${index === 0 ? 'text-primary' : index === 1 ? 'text-secondary' : 'text-tertiary'}`}>
                            {company.name.charAt(0).toUpperCase()}
                          </div>
                          <span className="text-body-sm font-medium truncate max-w-[150px]">{company.name}</span>
                        </div>
                        <span className="text-label-md text-on-surface">{company.count} Jobs</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-surface-container-lowest p-lg rounded-2xl border border-outline-variant shadow-sm">
                  <h4 className="font-headline-md text-body-lg text-on-surface mb-md">Key Recruitment Stats</h4>
                  <div className="grid grid-cols-2 gap-md">
                    <div className="p-sm bg-surface-container-low rounded-lg">
                      <p className="text-label-sm text-outline mb-xs">Success Rate</p>
                      <p className="text-body-lg font-bold text-secondary">{data.summary.hiringSuccessRate}%</p>
                    </div>
                    <div className="p-sm bg-surface-container-low rounded-lg">
                      <p className="text-label-sm text-outline mb-xs">Active Jobs</p>
                      <p className="text-body-lg font-bold text-primary">{data.summary.activeJobs}</p>
                    </div>
                    <div className="p-sm bg-surface-container-low rounded-lg col-span-2">
                      <p className="text-label-sm text-outline mb-xs">Most Applied Job</p>
                      <p className="text-body-sm font-medium text-on-surface truncate">
                        {data.recruitment.mostAppliedJobs.length > 0 ? `${data.recruitment.mostAppliedJobs[0].title} (${data.recruitment.mostAppliedJobs[0].count} apps)` : 'No applications yet'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar Content */}
            <div className="lg:col-span-4 flex flex-col gap-xl w-full">
              {/* 4. AI Performance */}
              <div className="bg-surface-container-lowest p-lg rounded-2xl border border-primary/20 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5">
                  <span className="material-symbols-outlined text-[60px]">auto_awesome</span>
                </div>
                <div className="flex items-center gap-sm mb-lg">
                  <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                  <h4 className="font-headline-md text-body-lg text-on-surface">AI Performance</h4>
                </div>
                <div className="space-y-lg relative z-10">
                  <div className="flex justify-between items-center">
                    <span className="text-body-sm text-on-surface-variant">Avg ATS Score</span>
                    <span className="font-bold text-primary">{data.summary.averageAtsScore}</span>
                  </div>
                  <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
                    <div className="bg-primary h-full transition-all duration-1000" style={{ width: `${data.summary.averageAtsScore}%` }}></div>
                  </div>
                  <div className="pt-md border-t border-outline-variant">
                    <p className="text-label-md font-medium text-on-surface mb-sm">Most Missing Skills</p>
                    <div className="flex flex-wrap gap-xs">
                      {data.aiPerformance.topMissingSkills.length === 0 && <span className="text-body-sm text-on-surface-variant">No data available.</span>}
                      {data.aiPerformance.topMissingSkills.map((skill, index) => (
                        <span key={index} className="px-sm py-1 bg-error-container text-error rounded-full text-label-sm font-bold">{skill.skill}</span>
                      ))}
                    </div>
                  </div>
                  <div className="pt-md">
                    <p className="text-label-md font-medium text-on-surface mb-sm">Top Recommended Roles</p>
                    <div className="flex flex-wrap gap-xs">
                      {data.aiPerformance.topRecommendedRoles.length === 0 && <span className="text-body-sm text-on-surface-variant">No data available.</span>}
                      {data.aiPerformance.topRecommendedRoles.map((role, index) => (
                        <span key={index} className="px-sm py-1 bg-secondary-container text-secondary rounded-full text-label-sm font-bold">{role.role}</span>
                      ))}
                    </div>
                  </div>
                  <div className="p-md bg-surface-container-low rounded-xl flex justify-between items-center">
                    <div>
                      <p className="text-label-sm text-outline">Total AI Analyses</p>
                      <p className="text-body-lg font-bold text-on-surface">{data.summary.resumeAnalyses}</p>
                    </div>
                    <span className="material-symbols-outlined text-secondary">bolt</span>
                  </div>
                </div>
              </div>

              {/* 5. System Health */}
              <div className="bg-surface-container-lowest p-lg rounded-2xl border border-outline-variant shadow-sm">
                <h4 className="font-headline-md text-body-lg text-on-surface mb-lg">System Health</h4>
                <div className="grid grid-cols-2 gap-md">
                  <div className="flex items-center gap-sm">
                    <span className={`w-2 h-2 rounded-full ${data.systemHealth.api === 'online' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-error'}`}></span>
                    <span className="text-body-sm">API Server</span>
                  </div>
                  <div className="flex items-center gap-sm">
                    <span className={`w-2 h-2 rounded-full ${data.systemHealth.database === 'online' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-error'}`}></span>
                    <span className="text-body-sm">MongoDB</span>
                  </div>
                  <div className="flex items-center gap-sm">
                    <span className={`w-2 h-2 rounded-full ${data.systemHealth.gemini === 'available' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]'}`}></span>
                    <span className="text-body-sm">Gemini AI</span>
                  </div>
                  <div className="flex items-center gap-sm">
                    <span className={`w-2 h-2 rounded-full ${data.systemHealth.storage === 'available' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]'}`}></span>
                    <span className="text-body-sm">Storage</span>
                  </div>
                  <div className="flex items-center gap-sm">
                    <span className={`w-2 h-2 rounded-full ${data.systemHealth.authentication === 'online' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-error'}`}></span>
                    <span className="text-body-sm">Auth</span>
                  </div>
                </div>
              </div>

              {/* 7. Recent Insights (AI Highlight) */}
              <div className="p-lg rounded-2xl bg-white/70 backdrop-blur-md border border-secondary/20 shadow-sm relative overflow-hidden">
                <div className="relative z-10">
                  <div className="flex items-center gap-sm mb-md">
                    <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>lightbulb</span>
                    <h4 className="font-headline-md text-body-lg text-on-surface">Data Insights</h4>
                  </div>
                  <ul className="space-y-sm">
                    {renderInsights().map((insight, index) => (
                      <li key={index} className="flex gap-sm text-body-sm text-on-surface-variant">
                        <span className="text-secondary font-bold">•</span>
                        <span>{insight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none select-none">
                  <svg height="100%" width="100%" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <pattern height="20" id="grid" patternUnits="userSpaceOnUse" width="20">
                        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5"></path>
                      </pattern>
                    </defs>
                    <rect fill="url(#grid)" height="100%" width="100%"></rect>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </div>
  )
}

export default AdminReportsAnalytics
