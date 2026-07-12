import React, { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import authService from '../services/authService'

function Profile() {
  const { currentUser, setCurrentUser } = useAuth()
  
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: currentUser.name || '',
    headline: currentUser.headline || '',
    location: currentUser.location || '',
    phone: currentUser.phone || '',
    summary: currentUser.summary || ''
  })
  
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  
  const fileInputRef = useRef(null)

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSave = async () => {
    setIsSaving(true)
    setError(null)
    setSuccess(false)
    try {
      const res = await authService.updateProfile(formData)
      if (res.success) {
        if (setCurrentUser) setCurrentUser(res.user) // Update context if available
        setSuccess(true)
        setIsEditing(false)
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update profile')
    } finally {
      setIsSaving(false)
    }
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validation
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg']
    if (!allowedTypes.includes(file.type)) {
      setError('Invalid file type. Please upload a JPG, PNG, or WEBP.')
      return
    }
    if (file.size > 2 * 1024 * 1024) {
      setError('File size too large. Maximum is 2MB.')
      return
    }

    try {
      const res = await authService.uploadProfileImage(file)
      if (res.success && setCurrentUser) {
        setCurrentUser(res.user)
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to upload image')
    }
  }

  return (
    <div className="max-w-container-max mx-auto w-full space-y-lg">
      {/* Page Actions (Top) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-md mb-md">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface">My Profile</h2>
          <p className="text-on-surface-variant font-body-sm text-body-sm">
            Control how you appear to recruiters and track your professional growth.
          </p>
        </div>
        <div className="flex items-center gap-sm">
          <button onClick={() => setIsEditing(!isEditing)} className="px-lg py-sm rounded-lg border border-primary text-primary font-label-md text-label-md hover:bg-primary/5 transition-all flex items-center gap-xs">
            <span className="material-symbols-outlined text-[18px]">{isEditing ? 'visibility' : 'edit'}</span>
            {isEditing ? 'Preview Profile' : 'Edit Profile'}
          </button>
          {isEditing && (
            <button onClick={handleSave} disabled={isSaving} className="px-lg py-sm rounded-lg bg-primary text-on-primary font-label-md text-label-md hover:shadow-md transition-all flex items-center gap-xs disabled:opacity-50">
              {isSaving ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> : <span className="material-symbols-outlined text-[18px]">save</span>}
              Save Changes
            </button>
          )}
        </div>
      </div>

      {error && <div className="p-md bg-error/10 text-error rounded-xl font-medium">{error}</div>}
      {success && <div className="p-md bg-primary/10 text-primary rounded-xl font-medium">Profile updated successfully!</div>}

      {/* Profile Header Card */}
      <section className="bg-surface border border-outline-variant rounded-2xl p-xl flex flex-col md:flex-row items-center md:items-start gap-xl relative overflow-hidden shadow-soft hover:-translate-y-0.5 hover:shadow-md transition-all duration-300">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-3xl pointer-events-none"></div>
        <div className="relative flex-shrink-0">
          <div className="w-32 h-32 rounded-full p-1 bg-gradient-to-tr from-primary to-secondary">
            {currentUser.profileImage ? (
              <img 
                alt="User profile picture" 
                className="w-full h-full rounded-full border-4 border-surface object-cover bg-surface" 
                src={currentUser.profileImage} 
              />
            ) : (
              <div className="w-full h-full rounded-full border-4 border-surface bg-primary text-on-primary text-4xl font-bold flex items-center justify-center">
                {currentUser.name.split(/\s+/).length >= 2 ? (currentUser.name.split(/\s+/)[0][0] + currentUser.name.split(/\s+/)[currentUser.name.split(/\s+/).length - 1][0]).toUpperCase() : currentUser.name.substring(0, 2).toUpperCase()}
              </div>
            )}
          </div>
          <button onClick={() => fileInputRef.current?.click()} className="absolute bottom-1 right-1 w-8 h-8 bg-white border border-outline-variant rounded-full flex items-center justify-center shadow-sm hover:bg-surface-container transition-colors">
            <span className="material-symbols-outlined text-sm">photo_camera</span>
          </button>
          <input type="file" ref={fileInputRef} className="hidden" accept="image/jpeg, image/png, image/webp, image/jpg" onChange={handleImageUpload} />
        </div>
        
        <div className="flex-1 space-y-md text-center md:text-left z-10 w-full">
          <div className="flex flex-col md:flex-row md:items-center gap-sm w-full">
            {isEditing ? (
              <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="text-3xl font-bold text-on-surface border border-outline-variant rounded px-2 py-1 bg-surface-container-low w-full md:w-auto" placeholder="Full Name" />
            ) : (
              <h3 className="text-3xl font-bold text-on-surface">{currentUser.name}</h3>
            )}
            <span className="inline-flex items-center px-sm py-1 rounded-full bg-secondary-container/10 text-secondary text-[10px] font-bold uppercase tracking-wide border border-secondary/10">
              Verified Student
            </span>
          </div>
          {isEditing ? (
            <input type="text" name="headline" value={formData.headline} onChange={handleInputChange} className="text-xl font-medium text-primary border border-primary/30 rounded px-2 py-1 w-full" placeholder="Professional Headline" />
          ) : (
            <p className="text-xl font-medium text-primary">{currentUser.headline}</p>
          )}
          <div className="flex flex-wrap justify-center md:justify-start items-center gap-y-sm gap-x-lg text-on-surface-variant">
            <div className="flex items-center gap-xs text-body-sm font-medium">
              <span className="material-symbols-outlined text-primary text-[18px]">location_on</span>
              {isEditing ? <input type="text" name="location" value={formData.location} onChange={handleInputChange} className="border border-outline-variant rounded px-2 py-1 bg-surface-container-low text-body-sm" placeholder="Location" /> : currentUser.location}
            </div>
            <div className="flex items-center gap-xs text-body-sm font-medium">
              <span className="material-symbols-outlined text-primary text-[18px]">mail</span> {currentUser.email}
            </div>
            <div className="flex items-center gap-xs text-body-sm font-medium">
              <span className="material-symbols-outlined text-primary text-[18px]">phone_iphone</span>
              {isEditing ? <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className="border border-outline-variant rounded px-2 py-1 bg-surface-container-low text-body-sm w-32" placeholder="Phone" /> : currentUser.phone}
            </div>
          </div>
        </div>
        
        <div className="w-full md:w-64 space-y-md border-t md:border-t-0 md:border-l border-outline-variant/30 pt-md md:pt-0 md:pl-xl z-10">
          <div className="flex justify-between items-end">
            <span className="font-label-md text-label-md font-bold text-on-surface">Profile Strength</span>
            <span className="text-2xl font-extrabold text-primary">{Math.min(100, Math.max(0, Number(currentUser.profileStrength) || 0))}%</span>
          </div>
          <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full transition-all duration-1000 ease-out" style={{ width: `${Math.min(100, Math.max(0, Number(currentUser.profileStrength) || 0))}%` }}></div>
          </div>
          <button onClick={() => setIsEditing(true)} className="w-full flex items-center justify-center gap-xs px-lg py-sm rounded-lg bg-surface-container-high text-on-surface font-bold text-label-md hover:bg-surface-container-highest transition-all group">
            <span className="material-symbols-outlined text-[20px] transition-transform group-hover:scale-110">edit</span>
            Edit Profile
          </button>
        </div>
      </section>

      {/* Layout Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-lg items-start">
        
        {/* Left Column */}
        <div className="lg:col-span-4 space-y-lg">
          {/* Professional Links */}
          <div className="bg-surface border border-outline-variant shadow-soft hover:-translate-y-0.5 hover:shadow-md transition-all duration-300 rounded-2xl p-lg space-y-md">
            <h4 className="font-bold text-on-surface flex items-center gap-xs">
              <span className="material-symbols-outlined text-primary">link</span>
              Professional Links
            </h4>
            <div className="space-y-sm">
              <a className="flex items-center gap-sm p-sm rounded-xl hover:bg-surface-container transition-colors group" href="#">
                <div className="w-10 h-10 rounded-lg bg-surface-container-low flex items-center justify-center text-[#0077b5] group-hover:bg-white transition-colors">
                  <span className="material-symbols-outlined">share</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] uppercase font-bold text-outline">LinkedIn</p>
                  <p className="text-sm font-medium truncate text-on-surface">linkedin.com/in/{(currentUser.name || '').replace(/\s+/g, '').toLowerCase()}</p>
                </div>
                <span className="material-symbols-outlined text-outline group-hover:text-primary transition-colors text-sm">open_in_new</span>
              </a>
              <a className="flex items-center gap-sm p-sm rounded-xl hover:bg-surface-container transition-colors group" href="#">
                <div className="w-10 h-10 rounded-lg bg-surface-container-low flex items-center justify-center text-on-surface group-hover:bg-white transition-colors">
                  <span className="material-symbols-outlined">code</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] uppercase font-bold text-outline">GitHub</p>
                  <p className="text-sm font-medium truncate text-on-surface">github.com/{(currentUser.name || '').replace(/\s+/g, '').toLowerCase()}</p>
                </div>
                <span className="material-symbols-outlined text-outline group-hover:text-primary transition-colors text-sm">open_in_new</span>
              </a>
            </div>
          </div>

          {/* Active Resume */}
          <div className="bg-surface border border-outline-variant shadow-soft hover:-translate-y-0.5 hover:shadow-md transition-all duration-300 rounded-2xl p-lg">
            <div className="flex items-center justify-between mb-md">
              <h4 className="font-bold text-on-surface flex items-center gap-xs">
                <span className="material-symbols-outlined text-primary">description</span>
                Active Resume
              </h4>
            </div>
            <div className="bg-surface-container-low p-md rounded-xl space-y-md">
              <div className="flex items-start gap-sm">
                <div className="p-2 bg-error-container/10 text-error rounded-lg">
                  <span className="material-symbols-outlined text-[24px]">picture_as_pdf</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-label-md text-label-md font-bold text-on-surface truncate">{currentUser.resumeOriginalName || 'Resume_v2.pdf'}</p>
                  <p className="text-[10px] text-on-surface-variant">Updated {currentUser.resumeUpdateDate || 'Recently'}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-sm">
                <div className="bg-white p-sm rounded-lg border border-outline-variant/30 flex flex-col items-center">
                  <span className="text-lg font-bold text-primary">{currentUser.resumeScore || 85}</span>
                  <span className="text-[10px] font-bold text-outline uppercase tracking-tight">Score</span>
                </div>
                <div className="bg-white p-sm rounded-lg border border-outline-variant/30 flex flex-col items-center">
                  <span className="text-lg font-bold text-secondary">{currentUser.atsScore || '92%'}</span>
                  <span className="text-[10px] font-bold text-outline uppercase tracking-tight">ATS Match</span>
                </div>
              </div>
              <div className="flex flex-col gap-sm">
                <Link to="/resume/analysis" className="w-full py-2 bg-white border border-outline-variant rounded-lg text-sm font-bold text-on-surface hover:bg-surface-container transition-colors text-center block">
                  {currentUser.resumeAnalysis ? 'View Document' : 'Analyze Resume'}
                </Link>
                <div className="flex gap-sm">
                  <Link to="/resume/upload" className="flex-1 py-2 bg-primary text-on-primary rounded-lg text-sm font-bold hover:shadow-md transition-all text-center block">Replace</Link>
                  <button className="w-10 py-2 border border-outline-variant rounded-lg flex items-center justify-center text-on-surface-variant hover:bg-surface-container transition-colors">
                    <span className="material-symbols-outlined text-[18px]">download</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-inverse-surface text-inverse-on-surface rounded-2xl p-lg shadow-lg">
            <div className="flex items-center gap-xs mb-md">
              <span className="material-symbols-outlined text-primary-fixed-dim" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
              <h4 className="font-bold">Next Steps</h4>
            </div>
            <ul className="space-y-sm">
              <li className="p-sm rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer flex items-start gap-sm">
                <span className="material-symbols-outlined text-primary-fixed-dim text-[18px]">add_circle</span>
                <div>
                  <p className="text-xs font-bold">Add portfolio link</p>
                  <p className="text-[10px] opacity-60">Boost your credibility by 15%</p>
                </div>
              </li>
              <li className="p-sm rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer flex items-start gap-sm">
                <span className="material-symbols-outlined text-primary-fixed-dim text-[18px]">add_circle</span>
                <div>
                  <p className="text-xs font-bold">Add certifications</p>
                  <p className="text-[10px] opacity-60">Recruiters filter by specific certs</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-8 space-y-lg">
          {/* Professional Summary */}
          <section className="bg-surface border border-outline-variant shadow-soft hover:-translate-y-0.5 hover:shadow-md transition-all duration-300 rounded-2xl p-xl">
            <div className="flex items-center justify-between mb-md">
              <h4 className="font-bold text-on-surface text-xl">Professional Summary</h4>
              <button onClick={() => setIsEditing(true)} className="p-sm hover:bg-surface-container rounded-full text-outline transition-colors">
                <span className="material-symbols-outlined">edit_square</span>
              </button>
            </div>
            <div className="relative">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary/20 rounded-full"></div>
              {isEditing ? (
                <textarea 
                  name="summary" 
                  value={formData.summary} 
                  onChange={handleInputChange} 
                  className="w-full ml-lg p-md border border-outline-variant rounded-xl focus:border-primary bg-surface text-body-md" 
                  rows="4" 
                  placeholder="Write a brief professional summary..."
                ></textarea>
              ) : (
                <p className="pl-lg text-on-surface-variant font-body-md leading-relaxed">
                  {currentUser.summary || "No professional summary provided."}
                </p>
              )}
            </div>
          </section>

          {/* Technical Proficiency */}
          <section className="bg-surface border border-outline-variant shadow-soft hover:-translate-y-0.5 hover:shadow-md transition-all duration-300 rounded-2xl p-xl">
            <h4 className="font-bold text-on-surface text-xl mb-lg">Technical Proficiency</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-xl gap-y-lg">
              <div className="space-y-xs">
                <div className="flex justify-between items-end">
                  <span className="font-bold text-sm">Python</span>
                  <span className="text-[10px] font-bold text-primary px-sm py-0.5 bg-primary/5 rounded border border-primary/10">ADVANCED</span>
                </div>
                <div className="h-1.5 w-full bg-surface-container rounded-full">
                  <div className="h-full bg-primary rounded-full" style={{ width: '90%' }}></div>
                </div>
              </div>
              <div className="space-y-xs">
                <div className="flex justify-between items-end">
                  <span className="font-bold text-sm">AWS (Cloud)</span>
                  <span className="text-[10px] font-bold text-primary px-sm py-0.5 bg-primary/5 rounded border border-primary/10">INTERMEDIATE</span>
                </div>
                <div className="h-1.5 w-full bg-surface-container rounded-full">
                  <div className="h-full bg-primary rounded-full" style={{ width: '75%' }}></div>
                </div>
              </div>
            </div>
            <div className="mt-xl pt-lg border-t border-outline-variant/30">
              <p className="text-[10px] font-bold text-outline uppercase tracking-widest mb-sm">Other Skills</p>
              <div className="flex flex-wrap gap-sm">
                <span className="px-sm py-1.5 rounded bg-surface-container-high text-on-surface font-bold text-[10px] border border-outline-variant/30">Docker</span>
                <span className="px-sm py-1.5 rounded bg-surface-container-high text-on-surface font-bold text-[10px] border border-outline-variant/30">Terraform</span>
                <span className="px-sm py-1.5 rounded bg-surface-container-high text-on-surface font-bold text-[10px] border border-outline-variant/30">React</span>
                <span className="px-sm py-1.5 rounded bg-surface-container-high text-on-surface font-bold text-[10px] border border-outline-variant/30">NoSQL</span>
              </div>
            </div>
          </section>

          {/* Education */}
          <section className="bg-surface border border-outline-variant shadow-soft hover:-translate-y-0.5 hover:shadow-md transition-all duration-300 rounded-2xl p-xl">
            <h4 className="font-bold text-on-surface text-xl mb-lg flex items-center gap-xs">
              <span className="material-symbols-outlined text-primary">school</span>
              Education
            </h4>
            <div className="flex items-start gap-lg p-lg rounded-2xl bg-surface-container-low border border-outline-variant/20 hover:border-primary/20 transition-all">
              <div className="w-16 h-16 rounded-xl bg-white shadow-sm flex items-center justify-center text-primary text-3xl font-extrabold flex-shrink-0 border border-outline-variant/10">S</div>
              <div className="flex-1 space-y-sm">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-xs">
                  <h5 className="text-lg font-bold text-on-surface">Stanford University</h5>
                  <span className="text-xs font-bold text-outline">2021 — 2025</span>
                </div>
                <p className="text-primary font-semibold">B.S. in Computer Science</p>
                <div className="flex flex-wrap items-center gap-md">
                  <div className="px-sm py-1 bg-white rounded border border-outline-variant/30 flex items-center gap-xs">
                    <span className="text-[10px] font-bold text-outline uppercase">GPA:</span>
                    <span className="text-sm font-bold text-primary">3.92/4.0</span>
                  </div>
                  <span className="text-sm text-outline font-medium">Minor in Digital Security</span>
                </div>
              </div>
            </div>
          </section>

          {/* Experience */}
          <section className="bg-surface border border-outline-variant shadow-soft hover:-translate-y-0.5 hover:shadow-md transition-all duration-300 rounded-2xl p-xl">
            <h4 className="font-bold text-on-surface text-xl mb-lg flex items-center gap-xs">
              <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>work</span>
              Professional Experience
            </h4>
            <div className="space-y-xl relative before:absolute before:left-[1.25rem] before:top-4 before:bottom-0 before:w-px before:bg-outline-variant/30">
              {/* Experience Item */}
              <div className="relative flex items-start gap-lg pl-sm group">
                <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center relative z-10 shadow-sm border-4 border-surface group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-sm">cloud_queue</span>
                </div>
                <div className="flex-1 space-y-sm -mt-0.5 pb-lg">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-xs">
                    <h5 className="text-lg font-bold text-on-surface">DevOps Intern</h5>
                    <span className="px-sm py-1 bg-surface-container-high rounded-full text-[10px] font-bold text-outline">JUN 2023 — AUG 2023</span>
                  </div>
                  <p className="text-primary font-semibold">TechCorp Solutions</p>
                  <ul className="space-y-xs">
                    <li className="flex items-start gap-xs text-sm text-on-surface-variant leading-relaxed">
                      <span className="text-primary mt-1 text-[10px]">●</span>
                      Automated infrastructure provisioning using Terraform across staging environments.
                    </li>
                    <li className="flex items-start gap-xs text-sm text-on-surface-variant leading-relaxed">
                      <span className="text-primary mt-1 text-[10px]">●</span>
                      Integrated SonarQube into GitLab CI pipelines, improving code coverage by 15%.
                    </li>
                  </ul>
                  <div className="flex flex-wrap gap-xs pt-xs">
                    <span className="px-sm py-0.5 rounded-full border border-outline-variant/30 text-[10px] font-bold text-outline">Terraform</span>
                    <span className="px-sm py-0.5 rounded-full border border-outline-variant/30 text-[10px] font-bold text-outline">AWS</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Grid: Projects & Certifications */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
            {/* Project */}
            <div className="bg-surface border border-outline-variant shadow-soft hover:-translate-y-0.5 hover:shadow-md transition-all duration-300 rounded-2xl p-lg border-t-4 border-t-secondary">
              <h4 className="font-bold text-on-surface mb-md flex items-center gap-xs">
                <span className="material-symbols-outlined text-secondary">deployed_code</span>
                Featured Project
              </h4>
              <div className="space-y-sm">
                <h5 className="font-bold text-on-surface text-lg">CareerPilot Platform</h5>
                <p className="text-sm text-on-surface-variant leading-relaxed">Microservices architecture for real-time career analytics platform.</p>
                <div className="flex flex-wrap gap-xs">
                  <span className="text-[10px] px-sm py-0.5 rounded bg-secondary/5 text-secondary border border-secondary/10 font-bold uppercase">Kubernetes</span>
                  <span className="text-[10px] px-sm py-0.5 rounded bg-secondary/5 text-secondary border border-secondary/10 font-bold uppercase">Go</span>
                </div>
                <div className="pt-md mt-sm border-t border-outline-variant/20 flex items-center justify-between">
                  <a className="text-xs font-bold text-primary flex items-center gap-xs hover:underline" href="#">
                    <span className="material-symbols-outlined text-sm">link</span> GitHub
                  </a>
                  <a className="text-xs font-bold text-primary flex items-center gap-xs hover:underline" href="#">
                    <span className="material-symbols-outlined text-sm">visibility</span> Demo
                  </a>
                </div>
              </div>
            </div>

            {/* Certification */}
            <div className="bg-surface border border-outline-variant shadow-soft hover:-translate-y-0.5 hover:shadow-md transition-all duration-300 rounded-2xl p-lg border-t-4 border-t-tertiary">
              <h4 className="font-bold text-on-surface mb-md flex items-center gap-xs">
                <span className="material-symbols-outlined text-tertiary">verified</span>
                Certifications
              </h4>
              <div className="space-y-md">
                <div className="flex items-center gap-sm p-sm bg-surface-container-low rounded-xl border border-outline-variant/20">
                  <div className="w-10 h-10 rounded bg-white flex items-center justify-center p-xs shadow-sm border border-outline-variant/10">
                    <img alt="AWS Cert Logo" className="object-contain" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA4-I5xm0CJ3i0bSSKmdXXAsPxQen59L0wEH88sK543qJtVQY51rMuIm2lH3vU9QqnA249sbIX-bcTuY7mDdzZJyUeZXfDpnTVGCpmnQ1Wg4x6k4vNzz-EKg2d3zFOLlnEdHJ6yxT8DqJxeBrNFFB-NdKBaBSqF1CSRC8bPXyPiN8ofONRqhLFkHE6iIbPoV2TpTXczPfXxPbGwVqYcr4QvNuVMkBiPRJpUc6unxOMVCWw3ZcDQKBh9ag"/>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-on-surface truncate">AWS Cloud Practitioner</p>
                    <p className="text-[10px] font-bold text-outline">ID: AWS-8493</p>
                  </div>
                </div>
                <button className="w-full py-2 text-xs font-bold text-on-surface hover:bg-surface-container transition-colors rounded-lg border border-outline-variant">
                  Add Certification
                </button>
              </div>
            </div>
          </div>

          {/* Page Actions (Bottom - Mobile) */}
          {isEditing && (
            <div className="md:hidden flex flex-col gap-sm pt-md pb-xl">
              <button onClick={handleSave} disabled={isSaving} className="w-full py-4 bg-primary text-on-primary rounded-xl font-bold hover:shadow-md transition-all flex items-center justify-center gap-xs disabled:opacity-50">
                {isSaving ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> : null}
                Save Changes
              </button>
              <button onClick={() => setIsEditing(false)} className="w-full py-4 bg-white border border-outline-variant text-on-surface rounded-xl font-bold">Cancel</button>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

export default Profile
