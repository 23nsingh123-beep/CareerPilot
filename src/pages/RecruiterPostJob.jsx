import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import jobService from '../services/jobService'
import { useToast } from '../components/useToast'

function RecruiterPostJob() {
  const navigate = useNavigate()
  const { showToast, ToastComponent } = useToast()

  const [formData, setFormData] = useState({
    title: '',
    companyName: '',
    location: '',
    employmentType: 'full-time',
    workMode: 'on-site',
    description: '',
    currency: 'USD',
    salaryMin: '',
    salaryMax: '',
    applicationDeadline: '',
    requiredSkills: []
  })

  const [skillInput, setSkillInput] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const handleAddSkill = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (skillInput.trim() && !formData.requiredSkills.includes(skillInput.trim())) {
        setFormData({ ...formData, requiredSkills: [...formData.requiredSkills, skillInput.trim()] })
      }
      setSkillInput('')
    }
  }

  const handleRemoveSkill = (skill) => {
    setFormData({ ...formData, requiredSkills: formData.requiredSkills.filter(s => s !== skill) })
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (status) => {
    setError(null)
    
    // Basic validation
    if (!formData.title || !formData.companyName || !formData.location || !formData.description || !formData.applicationDeadline) {
      setError('Please fill out all required fields (Title, Company Name, Location, Description, Deadline).')
      window.scrollTo(0, 0)
      return
    }

    let sMin = formData.salaryMin ? Number(formData.salaryMin) : null;
    let sMax = formData.salaryMax ? Number(formData.salaryMax) : null;

    if (sMin !== null && sMax !== null && sMax < sMin) {
      setError('Salary Max cannot be lower than Salary Min.')
      window.scrollTo(0, 0)
      return
    }

    setIsSubmitting(true)
    try {
      const payload = {
        title: formData.title,
        companyName: formData.companyName,
        location: formData.location,
        description: formData.description,
        employmentType: formData.employmentType,
        workMode: formData.workMode,
        requiredSkills: formData.requiredSkills,
        currency: formData.currency,
        applicationDeadline: new Date(formData.applicationDeadline).toISOString(),
        status: status
      }

      if (sMin !== null) payload.salaryMin = sMin;
      if (sMax !== null) payload.salaryMax = sMax;

      await jobService.createJob(payload)
      showToast(`Job successfully ${status === 'active' ? 'published' : 'saved as draft'}!`, 'success')
      setTimeout(() => navigate('/recruiter/manage-jobs'), 1500)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save job. Please try again.')
      window.scrollTo(0, 0)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <ToastComponent />
      
      {/* Header Section */}
      <div className="mb-xl">
        <h2 className="text-display-lg font-display-lg text-on-surface mb-xs">Post a Job</h2>
        <p className="text-body-lg font-body-lg text-on-surface-variant">Create a job or internship opportunity and find the best-matched candidates.</p>
      </div>

      <div className="grid grid-cols-12 gap-xl">
        {/* Left Column: Form */}
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-lg">
          
          {error && (
            <div className="p-4 bg-error-container text-on-error-container rounded-xl border border-error/20 font-medium shadow-sm">
              {error}
            </div>
          )}

          {/* Basic Info Section */}
          <section className="bg-surface-container-lowest rounded-2xl p-xl shadow-sm border border-outline-variant/30">
            <div className="flex items-center gap-md mb-lg">
              <div className="w-10 h-10 rounded-lg bg-primary-fixed flex items-center justify-center text-primary">
                <span className="material-symbols-outlined">info</span>
              </div>
              <h3 className="text-headline-md font-headline-md">Basic Information</h3>
            </div>
            <div className="grid grid-cols-2 gap-lg">
              <div className="col-span-2">
                <label className="flex items-center gap-xs block text-label-md font-label-md text-on-surface mb-xs">
                  Job Title <span className="text-error text-xs">*</span>
                </label>
                <input name="title" value={formData.title} onChange={handleChange} disabled={isSubmitting} className="w-full p-md border border-outline-variant rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-body-md" placeholder="e.g. Senior Frontend Developer" type="text" />
              </div>
              <div className="col-span-1">
                <label className="flex items-center gap-xs block text-label-md font-label-md text-on-surface mb-xs">
                  Company Name <span className="text-error text-xs">*</span>
                </label>
                <input name="companyName" value={formData.companyName} onChange={handleChange} disabled={isSubmitting} className="w-full p-md border border-outline-variant rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-body-md" placeholder="e.g. TechFlow Systems" type="text" />
              </div>
              <div className="col-span-1">
                <label className="flex items-center gap-xs block text-label-md font-label-md text-on-surface mb-xs">
                  Location <span className="text-error text-xs">*</span>
                </label>
                <input name="location" value={formData.location} onChange={handleChange} disabled={isSubmitting} className="w-full p-md border border-outline-variant rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-body-md" placeholder="e.g. San Francisco, CA" type="text" />
              </div>
              <div className="col-span-1">
                <label className="block text-label-md font-label-md text-on-surface mb-xs">Employment Type</label>
                <select name="employmentType" value={formData.employmentType} onChange={handleChange} disabled={isSubmitting} className="w-full p-md border border-outline-variant rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-body-md">
                  <option value="full-time">Full-time</option>
                  <option value="part-time">Part-time</option>
                  <option value="internship">Internship</option>
                  <option value="contract">Contract</option>
                </select>
              </div>
              <div className="col-span-1">
                <label className="block text-label-md font-label-md text-on-surface mb-xs">Work Model</label>
                <select name="workMode" value={formData.workMode} onChange={handleChange} disabled={isSubmitting} className="w-full p-md border border-outline-variant rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-body-md">
                  <option value="on-site">On-site</option>
                  <option value="remote">Remote</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </div>
            </div>
          </section>

          {/* Job Description Section */}
          <section className="bg-surface-container-lowest rounded-2xl p-xl shadow-sm border border-outline-variant/30">
            <div className="flex items-center gap-md mb-lg">
              <div className="w-10 h-10 rounded-lg bg-primary-fixed flex items-center justify-center text-primary">
                <span className="material-symbols-outlined">description</span>
              </div>
              <h3 className="text-headline-md font-headline-md">Job Description <span className="text-error text-xs">*</span></h3>
            </div>
            <div className="relative">
              <div className="flex gap-md mb-sm">
                <button type="button" className="p-2 hover:bg-surface-variant rounded-lg text-on-surface-variant transition-colors"><span className="material-symbols-outlined">format_bold</span></button>
                <button type="button" className="p-2 hover:bg-surface-variant rounded-lg text-on-surface-variant transition-colors"><span className="material-symbols-outlined">format_italic</span></button>
                <button type="button" className="p-2 hover:bg-surface-variant rounded-lg text-on-surface-variant transition-colors"><span className="material-symbols-outlined">format_list_bulleted</span></button>
                <div className="h-6 w-px bg-outline-variant self-center"></div>
                <button type="button" className="flex items-center gap-xs px-3 py-1 bg-secondary-container text-on-secondary-container rounded-lg font-label-md text-label-sm hover:opacity-90 transition-opacity group">
                  <span className="material-symbols-outlined text-[16px] group-hover:animate-pulse">auto_awesome</span>
                  AI Assist
                </button>
              </div>
              <textarea name="description" value={formData.description} onChange={handleChange} disabled={isSubmitting} className="w-full p-md border border-outline-variant rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-body-md" placeholder="Tell students about the role, day-to-day responsibilities, and team culture..." rows={8}></textarea>
            </div>
          </section>

          {/* Skills & Experience Section */}
          <section className="bg-surface-container-lowest rounded-2xl p-xl shadow-sm border border-outline-variant/30">
            <div className="flex items-center gap-md mb-lg">
              <div className="w-10 h-10 rounded-lg bg-primary-fixed flex items-center justify-center text-primary">
                <span className="material-symbols-outlined">psychology</span>
              </div>
              <h3 className="text-headline-md font-headline-md">Skills &amp; Requirements</h3>
            </div>
            <div className="space-y-lg">
              <div>
                <label className="block text-label-md font-label-md text-on-surface mb-xs">Required Skills (Press Enter to add)</label>
                <div className="w-full p-xs border border-outline-variant rounded-xl flex flex-wrap gap-xs focus-within:border-primary transition-all">
                  {formData.requiredSkills.map(skill => (
                    <div key={skill} className="flex items-center gap-xs px-3 py-1.5 bg-primary-fixed text-on-primary-fixed rounded-full text-label-sm font-label-sm">
                      {skill} <span onClick={() => handleRemoveSkill(skill)} className="material-symbols-outlined text-[14px] cursor-pointer hover:text-primary">close</span>
                    </div>
                  ))}
                  <input value={skillInput} onChange={(e) => setSkillInput(e.target.value)} onKeyDown={handleAddSkill} disabled={isSubmitting} className="flex-1 min-w-[120px] border-none focus:outline-none focus:ring-0 text-body-sm p-1.5 bg-transparent" placeholder="Add skill..." type="text" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-lg">
                <div>
                  <label className="block text-label-md font-label-md text-on-surface mb-xs">Min. Experience</label>
                  <select disabled={isSubmitting} className="w-full p-md border border-outline-variant rounded-xl focus:border-primary transition-all text-body-md">
                    <option>Entry Level (0-1 yrs)</option>
                    <option>Associate (2-3 yrs)</option>
                    <option>Mid-Senior (4-7 yrs)</option>
                    <option>Director (8+ yrs)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-label-md font-label-md text-on-surface mb-xs">Education Level</label>
                  <select disabled={isSubmitting} className="w-full p-md border border-outline-variant rounded-xl focus:border-primary transition-all text-body-md">
                    <option>Bachelor's Degree</option>
                    <option>Master's Degree</option>
                    <option>PhD</option>
                    <option>High School / Equivalent</option>
                  </select>
                </div>
              </div>
            </div>
          </section>

          {/* Compensation & Details */}
          <section className="bg-surface-container-lowest rounded-2xl p-xl shadow-sm border border-outline-variant/30">
            <div className="flex items-center gap-md mb-lg">
              <div className="w-10 h-10 rounded-lg bg-primary-fixed flex items-center justify-center text-primary">
                <span className="material-symbols-outlined">payments</span>
              </div>
              <h3 className="text-headline-md font-headline-md">Compensation &amp; Deadlines</h3>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-lg mb-lg">
              <div>
                <label className="block text-label-md font-label-md text-on-surface mb-xs">Currency</label>
                <select name="currency" value={formData.currency} onChange={handleChange} disabled={isSubmitting} className="w-full p-md border border-outline-variant rounded-xl text-body-md focus:border-primary">
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                </select>
              </div>
              <div className="col-span-1 lg:col-span-2">
                <label className="block text-label-md font-label-md text-on-surface mb-xs">Salary Range (Annual)</label>
                <div className="flex items-center gap-md">
                  <input name="salaryMin" value={formData.salaryMin} onChange={handleChange} disabled={isSubmitting} className="w-full p-md border border-outline-variant rounded-xl text-body-md focus:border-primary" placeholder="Min" type="number" />
                  <span className="text-outline">to</span>
                  <input name="salaryMax" value={formData.salaryMax} onChange={handleChange} disabled={isSubmitting} className="w-full p-md border border-outline-variant rounded-xl text-body-md focus:border-primary" placeholder="Max" type="number" />
                </div>
              </div>
              <div className="col-span-2 lg:col-span-3">
                <label className="flex items-center gap-xs block text-label-md font-label-md text-on-surface mb-xs">
                  Application Deadline <span className="text-error text-xs">*</span>
                </label>
                <input name="applicationDeadline" value={formData.applicationDeadline} onChange={handleChange} disabled={isSubmitting} className="w-full p-md border border-outline-variant rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-body-md" type="date" />
              </div>
            </div>
          </section>

          {/* AI Matching Settings */}
          <section className="bg-gradient-to-br from-primary-fixed to-surface-variant rounded-2xl p-xl shadow-sm border border-primary/20">
            <div className="flex items-center justify-between mb-lg">
              <div className="flex items-center gap-md">
                <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-on-primary">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>auto_fix_high</span>
                </div>
                <div>
                  <h3 className="text-headline-md font-headline-md">AI Discovery Settings</h3>
                  <p className="text-label-sm text-primary">Optimize how we match candidates to your role</p>
                </div>
              </div>
              <div className="flex items-center gap-sm">
                <span className="text-label-md font-bold text-primary">ENABLED</span>
                <div className="w-12 h-6 bg-primary rounded-full relative cursor-pointer">
                  <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                </div>
              </div>
            </div>
          </section>

          {/* Footer Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-between pt-xl mb-xl border-t border-outline-variant gap-md">
            <button type="button" onClick={() => navigate('/recruiter/manage-jobs')} disabled={isSubmitting} className="w-full sm:w-auto px-lg py-md text-on-surface-variant font-label-md hover:bg-surface-variant/50 rounded-xl transition-all disabled:opacity-50">Cancel</button>
            <div className="flex flex-col sm:flex-row items-center gap-md w-full sm:w-auto">
              <button type="button" onClick={() => handleSubmit('draft')} disabled={isSubmitting} className="w-full sm:w-auto px-lg py-md text-primary font-label-md border border-primary hover:bg-primary/5 rounded-xl transition-all disabled:opacity-50">Save as Draft</button>
              <button type="button" disabled={isSubmitting} className="w-full sm:w-auto px-lg py-md text-primary font-label-md border border-primary hover:bg-primary/5 rounded-xl transition-all disabled:opacity-50">Preview Job</button>
              <button type="button" onClick={() => handleSubmit('active')} disabled={isSubmitting} className="w-full sm:w-auto px-xl py-md bg-primary text-on-primary font-label-md font-bold rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed">
                {isSubmitting ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> : null}
                Publish Job
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Sticky Preview & Summary */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-lg lg:sticky lg:top-[90px] h-fit">
          
          {/* Live Preview Card */}
          <div className="bg-surface-container-lowest rounded-2xl shadow-xl border border-outline-variant/30 overflow-hidden">
            <div className="bg-surface-variant/30 px-lg py-md border-b border-outline-variant/30 flex items-center justify-between">
              <span className="text-label-sm font-black text-on-surface-variant uppercase tracking-widest">Live Job Preview</span>
            </div>
            <div className="p-lg">
              <div className="flex gap-md mb-lg">
                <div className="w-16 h-16 bg-surface-container rounded-2xl flex items-center justify-center text-primary-container">
                  <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>business</span>
                </div>
                <div>
                  <h4 className="text-headline-sm font-headline-sm text-on-surface">{formData.title || 'Job Title'}</h4>
                  <p className="text-body-sm text-on-surface-variant">{formData.companyName || 'Company'} • {formData.location || 'Location'}</p>
                  <div className="flex gap-xs mt-sm">
                    <span className="px-2 py-0.5 bg-surface-variant rounded text-[10px] font-bold uppercase text-on-surface-variant">{formData.workMode}</span>
                    <span className="px-2 py-0.5 bg-surface-variant rounded text-[10px] font-bold uppercase text-on-surface-variant">{formData.employmentType}</span>
                  </div>
                </div>
              </div>
              <button className="w-full py-md bg-secondary text-on-secondary rounded-xl font-bold text-label-md opacity-50 cursor-not-allowed">
                Apply Now
              </button>
            </div>
          </div>

        </div>
      </div>
    </>
  )
}

export default RecruiterPostJob
