import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import resumeService from '../services/resumeService'
import { useToast } from '../components/useToast'

function ResumeAnalysis() {
  const { showToast, ToastComponent } = useToast()
  const navigate = useNavigate()
  
  const [analysisData, setAnalysisData] = useState(null)
  const [resumeMeta, setResumeMeta] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  useEffect(() => {
    // Add hover effect matching stitch design for cards
    const addHoverEffects = () => {
      const cards = document.querySelectorAll('.card-border')
      cards.forEach((card) => {
        card.addEventListener('mouseenter', () => {
          card.style.transform = 'translateY(-2px)'
          card.style.transition = 'all 0.2s ease-out'
          card.style.boxShadow = '0px 10px 15px -3px rgba(0,0,0,0.1)'
        })
        card.addEventListener('mouseleave', () => {
          card.style.transform = 'translateY(0)'
          card.style.boxShadow = '0px 4px 6px -1px rgba(0,0,0,0.05)'
        })
      })
    }

    const fetchData = async () => {
      setIsLoading(true)
      try {
        const [metaRes, analysisRes] = await Promise.all([
          resumeService.getCurrentResume().catch(() => null),
          resumeService.getResumeAnalysis().catch(() => null)
        ])

        if (metaRes && metaRes.resume) {
          setResumeMeta(metaRes.resume)
        }
        if (analysisRes && analysisRes.analysis) {
          setAnalysisData(analysisRes.analysis)
        }
      } catch (error) {
        console.error(error)
      } finally {
        setIsLoading(false)
        setTimeout(addHoverEffects, 100)
      }
    }

    fetchData()
  }, [])

  const handleAnalyze = async () => {
    setIsAnalyzing(true)
    try {
      const response = await resumeService.analyzeResume()
      if (response && response.analysis) {
        setAnalysisData(response.analysis)
        showToast('Analysis completed successfully!', 'success')
      }
    } catch (error) {
      const errorMsg = error.response?.data?.error || 'Analysis failed. Please try again later.'
      showToast(errorMsg, 'error')
    } finally {
      setIsAnalyzing(false)
    }
  }

  // Dynamic ATS Cards Mapping based on section scores
  const getAtsCards = () => {
    if (!analysisData) return []
    const scores = analysisData.sectionScores || {}
    
    return [
      {
        icon: 'analytics',
        color: scores.skills > 80 ? 'text-primary' : 'text-error',
        badge: scores.skills > 80 ? 'EXCELLENT' : 'NEEDS WORK',
        badgeClass: scores.skills > 80 ? 'bg-primary-container text-on-primary-container' : 'bg-error-container text-on-error-container',
        title: 'Keyword Optimization (Skills)',
        desc: `Scored ${scores.skills}/100 based on industry relevance.`,
      },
      {
        icon: 'work',
        color: scores.experience > 80 ? 'text-secondary' : 'text-tertiary',
        badge: scores.experience > 80 ? 'GOOD' : 'OPTIMIZE',
        badgeClass: scores.experience > 80 ? 'bg-secondary-container text-on-secondary-container' : 'bg-tertiary-fixed text-on-tertiary-fixed',
        title: 'Experience Impact',
        desc: `Scored ${scores.experience}/100. Check bullet points for measurable metrics.`,
      },
      {
        icon: 'school',
        color: scores.education > 80 ? 'text-primary' : 'text-outline',
        badge: scores.education > 80 ? 'VALIDATED' : 'AVERAGE',
        badgeClass: scores.education > 80 ? 'bg-primary-container text-on-primary-container' : 'bg-surface-container-high text-on-surface',
        title: 'Education & Training',
        desc: `Scored ${scores.education}/100.`,
      },
      {
        icon: 'account_tree',
        color: scores.projects > 75 ? 'text-secondary' : 'text-outline',
        badge: scores.projects > 75 ? 'GOOD' : 'FAIR',
        badgeClass: scores.projects > 75 ? 'bg-secondary-container text-on-secondary-container' : 'bg-surface-container-high text-on-surface',
        title: 'Project Depth',
        desc: `Scored ${scores.projects}/100 on project descriptions.`,
      },
      {
        icon: 'stars',
        color: scores.certifications > 70 ? 'text-tertiary' : 'text-outline',
        badge: scores.certifications > 70 ? 'PASSED' : 'OPTIONAL',
        badgeClass: scores.certifications > 70 ? 'bg-primary-container text-on-primary-container' : 'bg-surface-container-high text-on-surface',
        title: 'Certifications',
        desc: `Scored ${scores.certifications}/100.`,
      },
      {
        icon: 'description',
        color: scores.summary > 80 ? 'text-primary' : 'text-error',
        badge: scores.summary > 80 ? 'EXCELLENT' : 'NEEDS WORK',
        badgeClass: scores.summary > 80 ? 'bg-primary-container text-on-primary-container' : 'bg-error-container text-on-error-container',
        title: 'Professional Summary',
        desc: `Scored ${scores.summary}/100. Make sure it highlights core strengths.`,
      }
    ]
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-md text-on-surface-variant">
        <span className="material-symbols-outlined text-5xl animate-spin">sync</span>
        <p className="font-bold">Loading your analysis dashboard...</p>
      </div>
    )
  }

  return (
    <>
      <ToastComponent />
      {/* ── Header Section ───────────────────────────────────────── */}
      <section className="mb-2xl">
        <h1 className="font-headline-lg text-headline-lg text-on-surface">AI Resume Analysis</h1>
        <p className="font-body-md text-body-md text-on-surface-variant mt-xs">
          Receive AI-powered feedback to improve your resume, ATS score, and job matching potential.
        </p>
      </section>

      {/* ── Top Grid: Overview & Score ──────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-lg mb-2xl">
        {/* Resume Overview Card */}
        <div className="xl:col-span-2 bg-surface-container-lowest border border-outline-variant rounded-2xl p-lg shadow-soft card-border flex flex-col justify-between">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-lg gap-md">
            <div>
              <h2 className="font-headline-md text-on-surface font-bold">
                {resumeMeta?.filename || 'No Resume Uploaded'}
              </h2>
              {resumeMeta?.uploadedAt && (
                <p className="text-body-sm text-on-surface-variant">Uploaded: {new Date(resumeMeta.uploadedAt).toLocaleString()}</p>
              )}
            </div>
            <div className="flex gap-sm w-full md:w-auto">
              <button onClick={() => navigate('/resume')} className="flex-1 md:flex-none border border-outline-variant px-4 py-2 rounded-lg text-label-md font-bold hover:bg-surface-container-low transition-all">
                {resumeMeta ? 'Replace Resume' : 'Upload Resume'}
              </button>
              <button 
                onClick={handleAnalyze}
                disabled={isAnalyzing || !resumeMeta} 
                className="flex-1 md:flex-none bg-primary text-on-primary px-4 py-2 rounded-lg text-label-md font-bold hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isAnalyzing ? <span className="material-symbols-outlined animate-spin text-sm">sync</span> : null}
                {isAnalyzing ? 'Analyzing...' : (analysisData ? 'Analyze Again' : 'Analyze Now')}
              </button>
            </div>
          </div>
          
          {analysisData ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-lg">
              <div>
                <p className="text-label-sm text-outline uppercase font-bold tracking-wider">Overall AI Score</p>
                <p className="text-headline-md font-bold text-primary">{analysisData.overallScore}/100</p>
              </div>
              <div>
                <p className="text-label-sm text-outline uppercase font-bold tracking-wider">Estimated ATS Score</p>
                <p className="text-headline-md font-bold text-secondary">{analysisData.atsScore}/100</p>
              </div>
              <div>
                <p className="text-label-sm text-outline uppercase font-bold tracking-wider">Analyzed On</p>
                <p className="text-headline-sm font-bold text-tertiary">
                  {new Date(analysisData.analyzedAt).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-label-sm text-outline uppercase font-bold tracking-wider">Model</p>
                <p className="text-headline-sm font-bold text-on-surface">{analysisData.model || 'Gemini AI'}</p>
              </div>
            </div>
          ) : (
            <div className="bg-surface-container-low p-md rounded-xl text-on-surface-variant text-center">
              Click "Analyze Now" to generate your personalized AI report.
            </div>
          )}
        </div>

        {/* Overall Score Card */}
        {analysisData && (
          <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-lg shadow-soft card-border flex flex-col items-center justify-center text-center">
            <h3 className="text-label-md font-bold text-outline mb-md uppercase tracking-wider">Estimated ATS Score</h3>
            <div className="relative w-36 h-36 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90 transform-origin-center" viewBox="0 0 100 100">
                <circle
                  className="text-surface-container-high stroke-current"
                  cx="50" cy="50" r="40"
                  fill="transparent" strokeWidth="8"
                />
                <circle
                  className={`${analysisData.atsScore > 75 ? 'text-primary' : (analysisData.atsScore > 50 ? 'text-secondary' : 'text-error')} stroke-current transition-all duration-1000 ease-out`}
                  cx="50" cy="50" r="40"
                  fill="transparent" strokeWidth="8"
                  strokeLinecap="round"
                  style={{ strokeDasharray: 251.327, strokeDashoffset: 251.327 - ((analysisData.atsScore / 100) * 251.327) }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-headline-lg font-bold text-on-surface leading-none">{analysisData.atsScore}</span>
                <span className="text-label-sm text-on-surface-variant">/ 100</span>
              </div>
            </div>
            <p className="mt-lg text-body-sm text-on-surface-variant px-4">
              {analysisData.atsScore > 80 ? "Your resume is highly optimized for Applicant Tracking Systems." : "There is room for improvement in ATS compatibility."}
            </p>
          </div>
        )}
      </div>

      {analysisData && (
        <>
          {/* ── Summary & Strengths ─────────────────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-lg mb-2xl">
            <div className="lg:col-span-8 space-y-lg">
              
              <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-lg shadow-soft card-border">
                <h3 className="font-headline-md font-bold mb-sm text-on-surface">AI Summary</h3>
                <p className="text-body-md text-on-surface-variant leading-relaxed">
                  {analysisData.summary}
                </p>
              </div>

              {/* Strengths & Weaknesses */}
              <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-lg shadow-soft card-border">
                <h3 className="font-headline-md font-bold mb-lg text-on-surface">Strengths & Critical Improvements</h3>
                <div className="space-y-lg">
                  
                  {/* Strengths */}
                  <div>
                    <p className="text-label-sm font-bold text-outline uppercase tracking-widest flex items-center gap-sm mb-md">
                      <span className="material-symbols-outlined text-green-500" style={{ fontVariationSettings: "'FILL' 1" }}>
                        check_circle
                      </span>
                      Strong Findings
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                      {analysisData.strengths.slice(0, 4).map((str, idx) => (
                        <div key={idx} className="bg-green-50 p-md rounded-xl border border-green-100">
                          <p className="text-body-sm text-green-800 font-medium">
                            {str}
                          </p>
                        </div>
                      ))}
                      {analysisData.strengths.length === 0 && <p className="text-on-surface-variant italic text-sm">No specific strengths highlighted.</p>}
                    </div>
                  </div>

                  {/* Priority Fixes (Weaknesses) */}
                  <div>
                    <p className="text-label-sm font-bold text-outline uppercase tracking-widest flex items-center gap-sm mb-md">
                      <span className="material-symbols-outlined text-error" style={{ fontVariationSettings: "'FILL' 1" }}>
                        warning
                      </span>
                      Priority Fixes
                    </p>
                    <div className="space-y-sm">
                      {analysisData.weaknesses.slice(0, 4).map((weakness, idx) => (
                        <div key={idx} className="bg-error-container/10 p-md rounded-xl border border-error-container flex items-start gap-md">
                          <div className="w-8 h-8 rounded-full bg-error text-on-error flex items-center justify-center shrink-0 font-bold">{idx + 1}</div>
                          <div>
                            <p className="text-body-sm text-on-error-container font-medium mt-1">
                              {weakness}
                            </p>
                          </div>
                        </div>
                      ))}
                      {analysisData.weaknesses.length === 0 && <p className="text-on-surface-variant italic text-sm">No major weaknesses detected!</p>}
                    </div>
                  </div>
                </div>
              </div>

              {/* Missing Skills */}
              <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-lg shadow-soft card-border">
                <h3 className="font-headline-md font-bold mb-md text-on-surface">Missing Key Industry Skills</h3>
                <p className="text-body-sm text-on-surface-variant mb-lg">
                  AI identified these missing keywords that could boost your ATS compatibility.
                </p>
                <div className="flex flex-wrap gap-sm">
                  {analysisData.missingSkills.length > 0 ? analysisData.missingSkills.map((skill, idx) => (
                    <span key={idx} className="bg-surface-container-high text-on-surface px-3 py-1.5 rounded-full font-label-md border border-outline-variant flex items-center gap-xs">
                      <span className="material-symbols-outlined text-[16px]">add</span> {skill}
                    </span>
                  )) : (
                    <span className="text-on-surface-variant italic">No critical skills appear to be missing.</span>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column: AI Recommendations, Job Match */}
            <div className="lg:col-span-4 space-y-lg">
              
              {/* AI Recommendations */}
              <div className="bg-primary-container text-on-primary-container rounded-2xl p-lg shadow-soft relative overflow-hidden">
                <div className="relative z-10">
                  <div className="flex items-center gap-sm mb-lg">
                    <span className="material-symbols-outlined text-[24px]">auto_awesome</span>
                    <h3 className="font-bold text-headline-md">AI Action Plan</h3>
                  </div>
                  <div className="space-y-md">
                    {analysisData.recommendations.map((rec, idx) => (
                      <div key={idx} className="bg-white/10 backdrop-blur-md p-md rounded-xl border border-white/20">
                        <p className="text-[13px] opacity-95 font-medium leading-relaxed">
                          {rec}
                        </p>
                      </div>
                    ))}
                    {analysisData.recommendations.length === 0 && <p className="text-sm opacity-90">Your resume is looking great.</p>}
                  </div>
                </div>
                <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/5 rounded-full blur-3xl" />
              </div>

              {/* Job Match Prediction */}
              <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-lg shadow-soft card-border">
                <h3 className="font-bold text-label-sm uppercase text-outline mb-lg tracking-widest">
                  Recommended Roles
                </h3>
                <div className="space-y-sm">
                  {analysisData.recommendedRoles.map((role, idx) => (
                    <div key={idx} className="flex items-center gap-md p-3 hover:bg-surface-container-low border border-transparent hover:border-outline-variant rounded-xl transition-all">
                      <span className="material-symbols-outlined text-secondary">work</span>
                      <p className="font-bold text-body-md text-on-surface flex-1">{role}</p>
                    </div>
                  ))}
                  {analysisData.recommendedRoles.length === 0 && <p className="text-sm text-on-surface-variant">No roles suggested.</p>}
                </div>
              </div>
            </div>
          </div>

          {/* ── ATS Section Breakdown Grid ────────────────────────────────────── */}
          <section className="mb-2xl">
            <h3 className="text-headline-md font-bold mb-lg text-on-surface">ATS Section Breakdown</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-md">
              {getAtsCards().map((card, idx) => (
                <div key={idx} className="bg-surface-container-lowest border border-outline-variant p-md rounded-xl hover:shadow-soft transition-all">
                  <div className="flex justify-between items-center mb-sm">
                    <span className={`material-symbols-outlined ${card.color}`}>{card.icon}</span>
                    <span className={`${card.badgeClass} px-2 py-0.5 rounded text-[10px] font-bold`}>
                      {card.badge}
                    </span>
                  </div>
                  <h4 className="font-bold text-body-md text-on-surface">{card.title}</h4>
                  <p className="text-body-sm text-on-surface-variant mt-xs">{card.desc}</p>
                </div>
              ))}
            </div>
          </section>
        </>
      )}
    </>
  )
}

export default ResumeAnalysis
