import React, { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import resumeService from '../services/resumeService'
import { useToast } from '../components/useToast'

const bottomInfoItems = [
  {
    icon: 'shield',
    title: 'Secure Storage',
    text: 'Your documents are encrypted and only accessible by verified recruiters you apply to.',
  },
  {
    icon: 'smart_toy',
    title: 'ATS Optimization',
    text: 'We ensure your formatting is readable by all major Applicant Tracking Systems.',
  },
  {
    icon: 'speed',
    title: 'Instant Feedback',
    text: 'Get immediate scores on grammar, layout, and impact after analysis.',
  },
]

const resumePreviewBg = 'https://lh3.googleusercontent.com/aida-public/AB6AXuDi3oUdeTZbeuTAzbzK1d6Z5ZdDqOvbEVcsixiG-ve0rOAU-hCtAFor-ChRVFOhCZLLnN4FwmIoT5uMMTAM1dST77tBuDr9H75YdSRhB67c_LuJ68tmskMe2RIeq37EGZPUAC4I04Ndzm0stsl1lKWPK1zi-Jf1QAvPY7lP3AimSEySO5knbS_k-2oPfyNbhkXtOsyhK3HytK7dKY0AnYS9Mkw5SlJMjf8b7MPHKTtOUDMhSYv78s45Ng'

function ResumeUpload() {
  const { showToast, ToastComponent } = useToast()
  const navigate = useNavigate()
  
  const [isDragging, setIsDragging] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [currentFile, setCurrentFile] = useState(null)
  
  const [resumeData, setResumeData] = useState(null)
  const [analysisData, setAnalysisData] = useState(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const fileInputRef = useRef(null)
  const dropzoneRef = useRef(null)

  const fetchData = async () => {
    try {
      const [metaRes, analysisRes] = await Promise.all([
        resumeService.getCurrentResume().catch(() => null),
        resumeService.getResumeAnalysis().catch(() => null)
      ])
      
      if (metaRes && metaRes.resume) {
        setResumeData(metaRes.resume)
      } else {
        setResumeData(null)
      }

      if (analysisRes && analysisRes.analysis) {
        setAnalysisData(analysisRes.analysis)
      } else {
        setAnalysisData(null)
      }
    } catch (error) {
      console.error('Failed to fetch resume metadata')
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }
  const handleDragLeave = () => setIsDragging(false)
  
  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelection(e.dataTransfer.files[0])
    }
  }

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelection(e.target.files[0])
    }
  }

  const handleFileSelection = async (file) => {
    const allowedExtensions = ['pdf', 'doc', 'docx']
    const ext = file.name.split('.').pop().toLowerCase()
    
    if (!allowedExtensions.includes(ext)) {
      showToast('Unsupported file format. Please upload a PDF or Word document.', 'error')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast('File size exceeds 5MB limit.', 'error')
      return
    }

    setCurrentFile(file)
    setIsUploading(true)
    setUploadProgress(0)

    try {
      const response = await resumeService.uploadResume(file, (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
        setUploadProgress(percentCompleted)
      })

      showToast('Resume uploaded and text extracted successfully!', 'success')
      await fetchData()
      
      try {
        const userData = JSON.parse(localStorage.getItem('user')) || {}
        userData.resume = response.resumeUrl
        localStorage.setItem('user', JSON.stringify(userData))
      } catch (e) {}

    } catch (error) {
      const errorMsg = error.response?.data?.error || 'An error occurred during upload.'
      showToast(errorMsg, 'error')
    } finally {
      setIsUploading(false)
      setCurrentFile(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const triggerFileSelect = () => {
    if (!isUploading && fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleAnalyze = async () => {
    if (analysisData) {
      // If already analyzed, just navigate
      navigate('/resume/analysis')
      return
    }

    setIsAnalyzing(true)
    try {
      await resumeService.analyzeResume()
      showToast('Analysis completed successfully!', 'success')
      navigate('/resume/analysis')
    } catch (error) {
      const errorMsg = error.response?.data?.error || 'Analysis failed. Please try again later.'
      showToast(errorMsg, 'error')
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto w-full">
      <ToastComponent />
      
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileSelect} 
        accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" 
        className="hidden" 
      />

      {/* ── Page Header ──────────────────────────────────────── */}
      <div className="mb-2xl">
        <h2 className="font-headline-lg text-headline-lg text-on-surface mb-xs">
          Resume Management
        </h2>
        <p className="text-on-surface-variant font-body-md">
          Upload and manage your professional credentials for AI-driven job matching.
        </p>
      </div>

      {/* ── Bento Layout ─────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-lg">
        {/* Left Column (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-lg">
          {/* ── Drag & Drop Zone ─────────────────────────────── */}
          <div
            ref={dropzoneRef}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={triggerFileSelect}
            className={`dashed-dropzone p-2xl text-center group ${isUploading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:bg-surface-container-low'} transition-all duration-300 relative overflow-hidden h-80 flex flex-col items-center justify-center ${
              isDragging ? 'bg-primary-fixed-dim scale-[1.01]' : ''
            }`}
          >
            <div className={`w-16 h-16 bg-primary-fixed text-primary rounded-2xl flex items-center justify-center mb-lg transition-transform duration-300 ${!isUploading ? 'group-hover:scale-110' : ''}`}>
              <span className="material-symbols-outlined text-4xl">upload_file</span>
            </div>

            <h3 className="font-headline-md text-headline-md text-on-surface mb-sm">
              Drop your resume here
            </h3>
            <p className="text-on-surface-variant mb-xl max-w-sm mx-auto">
              Click to browse or drag and drop your document to begin your professional journey.
            </p>

            <button disabled={isUploading} className="bg-primary text-on-primary px-xl py-md rounded-xl font-bold flex items-center gap-sm shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-80">
              <span className="material-symbols-outlined">add</span>
              Select File
            </button>

            <div className="mt-xl pt-lg border-t border-outline-variant w-full max-w-xs">
              <p className="text-xs text-on-surface-variant">
                Supported formats: <span className="font-bold">PDF, DOCX</span> (Max 5MB)
              </p>
            </div>
          </div>

          {/* ── Uploading Status ──────────────────────────────── */}
          {isUploading && currentFile && (
            <div className="custom-card p-lg border-primary/20 bg-surface-container-lowest shadow-soft rounded-2xl animate-fade-in">
              <div className="flex items-center gap-md mb-md">
                <div className="w-12 h-12 bg-surface-container-highest rounded-lg flex items-center justify-center text-primary flex-shrink-0">
                  <span className="material-symbols-outlined">description</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-xs">
                    <span className="font-bold text-on-surface truncate">{currentFile.name}</span>
                    <span className="text-xs text-on-surface-variant flex-shrink-0 ml-sm">{(currentFile.size / (1024 * 1024)).toFixed(2)} MB</span>
                  </div>
                  <div className="w-full h-2 bg-surface-container-high rounded-full overflow-hidden relative">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-between text-xs text-on-surface-variant">
                <span>{uploadProgress === 100 ? 'Processing...' : 'Uploading to secure cloud...'}</span>
                <span>{uploadProgress}% complete</span>
              </div>
            </div>
          )}
        </div>

        {/* Right Column (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-lg">
          {/* ── Preview Card ──────────────────────────────────── */}
          <div className="custom-card overflow-hidden bg-surface-container-lowest shadow-soft rounded-2xl">
            {/* Preview Image */}
            <div className="h-48 bg-surface-container-highest flex items-center justify-center relative group">
              <div
                className={`absolute inset-0 bg-cover bg-top opacity-60 ${!resumeData ? 'grayscale' : ''}`}
                style={{ backgroundImage: `url('${resumePreviewBg}')` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface to-transparent" />
              <div className="z-10 bg-white shadow-xl p-md rounded-lg border border-outline-variant flex flex-col gap-xs scale-90 group-hover:scale-95 transition-transform duration-300">
                {resumeData ? (
                  <>
                    <span className="material-symbols-outlined text-primary text-3xl">check_circle</span>
                    <p className="font-bold text-sm text-on-surface">File Ready</p>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-outline text-3xl">hourglass_empty</span>
                    <p className="font-bold text-sm text-on-surface">No Resume</p>
                  </>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="p-lg">
              <div className="mb-xl">
                <h4 className="font-bold text-on-surface mb-xs">Current Document</h4>
                {resumeData ? (
                  <>
                    <p className="text-sm text-primary font-semibold truncate" title={resumeData.filename}>
                      {resumeData.filename}
                    </p>
                    <div className="text-xs text-on-surface-variant mt-xs space-y-1">
                      {resumeData.uploadedAt && <p>Uploaded: {new Date(resumeData.uploadedAt).toLocaleDateString()}</p>}
                      {resumeData.textExtracted && <p className="text-secondary font-medium mt-1">✓ Ready for AI analysis ({resumeData.characterCount} chars)</p>}
                    </div>
                  </>
                ) : (
                  <p className="text-sm text-on-surface-variant italic">
                    None uploaded yet
                  </p>
                )}
              </div>
              <div className="space-y-md">
                <button 
                  onClick={handleAnalyze}
                  disabled={!resumeData || isAnalyzing} 
                  className="w-full bg-primary text-on-primary py-md rounded-xl font-bold flex items-center justify-center gap-sm hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isAnalyzing ? (
                    <span className="material-symbols-outlined animate-spin text-sm">sync</span>
                  ) : (
                    <span className="material-symbols-outlined">bolt</span>
                  )}
                  {isAnalyzing ? 'Analyzing...' : (analysisData ? 'View Full Analysis' : 'Run AI Analysis')}
                </button>
                <button onClick={triggerFileSelect} disabled={isUploading} className="w-full bg-white border border-outline-variant text-on-surface py-md rounded-xl font-bold flex items-center justify-center gap-sm hover:bg-surface-container-low transition-all disabled:opacity-50">
                  <span className="material-symbols-outlined text-primary">sync</span>
                  {resumeData ? 'Replace File' : 'Upload File'}
                </button>
              </div>
            </div>
          </div>

          {/* ── AI Insights Placeholder ───────────────────────── */}
          <div className="ai-container p-lg rounded-2xl bg-surface-container-lowest shadow-soft border border-primary/10">
            <div className="flex items-center gap-sm mb-md">
              <span
                className="material-symbols-outlined text-secondary"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                auto_awesome
              </span>
              <span className="font-bold text-sm text-on-surface">CareerPilot AI</span>
            </div>
            {analysisData ? (
              <div className="space-y-sm">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-on-surface-variant">Overall Score</span>
                  <span className="text-sm font-bold text-primary">{analysisData.overallScore}/100</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-on-surface-variant">Est. ATS Score</span>
                  <span className="text-sm font-bold text-secondary">{analysisData.atsScore}/100</span>
                </div>
                <p className="text-xs text-on-surface-variant mt-sm leading-relaxed line-clamp-2">
                  {analysisData.summary}
                </p>
              </div>
            ) : (
              <p className="text-sm text-on-surface-variant leading-relaxed italic">
                "Once uploaded, our AI will scan for 50+ industry-specific keywords and match your
                profile against 2,000+ student-friendly job openings."
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ── Bottom Information Section ────────────────────────── */}
      <div className="mt-2xl grid grid-cols-1 md:grid-cols-3 gap-lg border-t border-outline-variant pt-2xl">
        {bottomInfoItems.map(({ icon, title, text }) => (
          <div key={title} className="flex gap-md items-start">
            <span className="material-symbols-outlined text-primary bg-primary-fixed p-sm rounded-lg flex-shrink-0">
              {icon}
            </span>
            <div>
              <h5 className="font-bold text-sm mb-xs text-on-surface">{title}</h5>
              <p className="text-xs text-on-surface-variant">{text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ResumeUpload
