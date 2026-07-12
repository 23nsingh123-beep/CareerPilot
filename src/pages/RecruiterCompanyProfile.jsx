import React from 'react'
import { useAuth, getInitials } from '../context/AuthContext.jsx'

function RecruiterCompanyProfile() {
  const { currentUser } = useAuth()
  
  return (
    <div className="flex-1 max-w-container-max mx-auto w-full pb-24">
      {/* Page Header */}
      <div className="mb-xl">
        <h2 className="text-headline-lg font-headline-lg text-on-surface mb-xs">Company Profile</h2>
        <p className="text-body-md text-on-surface-variant">Manage your organization details that students and applicants will see.</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-lg items-start">
        {/* Left Column (Main Content) */}
        <div className="lg:col-span-8 flex flex-col gap-lg">
          
          {/* Section 1: Company Information */}
          <section className="bg-surface-container-lowest rounded-2xl p-lg shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] border border-outline-variant/30">
            <div className="flex flex-col md:flex-row gap-lg md:gap-xl items-start">
              
              {/* Logo */}
              <div className="w-28 h-28 rounded-2xl bg-surface-container-high border border-outline-variant flex items-center justify-center overflow-hidden shrink-0">
                <img 
                  className="w-20 h-20 object-contain" 
                  alt="TechCorp Solutions Logo" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCWB9hMzttxgiSXj4GunvFJIvysRUWvepX0bt9EE69sd2y3fwYwkJ9jgRavKNXNn397eVLt87d5fBonOPK1EsOdT6ydT7yMqzPEO3opPg5-xYVyNyXjelj4Vnv3ciPnNGS7BKzOJYDK0YARJm0b-sZK7VQuELF9KnH7PlpK70sNfJnzzhHA3pmPA42IzGaRRBsLK7Loc28THFI8pvGgjvUCg_Nf7KYq3U1VA_TZ-ckG50x44uqquTS99A"
                />
              </div>
              
              {/* Content and Actions */}
              <div className="flex-1 w-full flex flex-col xl:flex-row justify-between items-start gap-lg xl:gap-2xl">
                
                {/* Information */}
                <div className="flex-1 min-w-0 w-full">
                  <div className="mb-lg">
                    <h3 className="text-headline-md font-headline-md sm:whitespace-nowrap">TechCorp Solutions</h3>
                    <p className="text-label-md text-primary font-bold">Software &amp; Technology</p>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-md gap-x-lg">
                    <div className="flex items-center gap-md">
                      <span className="material-symbols-outlined text-outline">location_on</span>
                      <div>
                        <p className="text-label-sm text-on-surface-variant">Headquarters</p>
                        <p className="text-body-sm font-medium">San Francisco, CA</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-md">
                      <span className="material-symbols-outlined text-outline">language</span>
                      <div>
                        <p className="text-label-sm text-on-surface-variant">Website</p>
                        <p className="text-body-sm font-medium text-primary cursor-pointer hover:underline">www.techcorp.io</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-md">
                      <span className="material-symbols-outlined text-outline">groups</span>
                      <div>
                        <p className="text-label-sm text-on-surface-variant">Company Size</p>
                        <p className="text-body-sm font-medium">501-1000 employees</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-md">
                      <span className="material-symbols-outlined text-outline">calendar_today</span>
                      <div>
                        <p className="text-label-sm text-on-surface-variant">Founded</p>
                        <p className="text-body-sm font-medium">2015</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-md">
                      <span className="material-symbols-outlined text-outline">mail</span>
                      <div>
                        <p className="text-label-sm text-on-surface-variant">Public Email</p>
                        <p className="text-body-sm font-medium">hr@techcorp.io</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-md">
                      <span className="material-symbols-outlined text-outline">call</span>
                      <div>
                        <p className="text-label-sm text-on-surface-variant">Phone</p>
                        <p className="text-body-sm font-medium">+1 (555) 012-3456</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-sm w-full xl:w-auto shrink-0">
                  <button className="flex-1 sm:flex-none px-md py-sm border border-outline-variant rounded-xl text-label-md font-bold hover:bg-surface-variant/20 transition-all active:scale-95">Change Logo</button>
                  <button className="flex-1 sm:flex-none px-md py-sm bg-primary text-on-primary rounded-xl text-label-md font-bold hover:brightness-95 transition-all active:scale-95 shadow-sm">Edit Company</button>
                </div>

              </div>
            </div>
          </section>

          {/* Section 2: About the Company */}
          <section className="bg-surface-container-lowest rounded-2xl p-lg shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] border border-outline-variant/30 flex flex-col gap-lg">
            <div className="flex items-center justify-between border-b border-outline-variant/30 pb-md">
              <h3 className="text-headline-md font-headline-md flex items-center gap-md">
                <span className="material-symbols-outlined text-primary">info</span>
                About the Company
              </h3>
              <button className="text-primary text-label-md font-bold hover:underline">Edit Content</button>
            </div>
            <div className="space-y-xl">
              <div>
                <h4 className="text-label-md font-bold text-on-surface mb-xs uppercase tracking-wider">Overview</h4>
                <p className="text-body-md text-on-surface-variant leading-relaxed">
                  TechCorp Solutions is a global leader in providing next-generation software architecture and cloud infrastructure. We empower organizations to scale their operations through intelligent automation and robust data analytics.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
                <div>
                  <h4 className="text-label-md font-bold text-on-surface mb-xs uppercase tracking-wider">Mission</h4>
                  <p className="text-body-md text-on-surface-variant italic">
                    "To bridge the gap between complex technology and human-centric design, making digital transformation accessible for every enterprise."
                  </p>
                </div>
                <div>
                  <h4 className="text-label-md font-bold text-on-surface mb-xs uppercase tracking-wider">Vision</h4>
                  <p className="text-body-md text-on-surface-variant">
                    Becoming the primary architectural backbone for the world's most innovative decentralized applications by 2030.
                  </p>
                </div>
              </div>
              <div>
                <h4 className="text-label-md font-bold text-on-surface mb-xs uppercase tracking-wider">Culture</h4>
                <div className="flex flex-wrap gap-sm mt-xs">
                  <span className="bg-primary-fixed text-on-primary-fixed px-md py-xs rounded-full text-label-sm">Hybrid-First</span>
                  <span className="bg-primary-fixed text-on-primary-fixed px-md py-xs rounded-full text-label-sm">Learning Budget</span>
                  <span className="bg-primary-fixed text-on-primary-fixed px-md py-xs rounded-full text-label-sm">Inclusive Design</span>
                  <span className="bg-primary-fixed text-on-primary-fixed px-md py-xs rounded-full text-label-sm">Mental Wellness</span>
                </div>
              </div>
            </div>
          </section>

          {/* Section 3: Hiring Information */}
          <section className="flex flex-col gap-md">
            <h3 className="text-headline-md font-headline-md px-xs">Hiring Overview</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-md">
              <div className="bg-surface-container-lowest p-md rounded-2xl border border-outline-variant/30 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] flex flex-col items-center justify-center text-center py-lg">
                <span className="text-headline-md font-black text-primary mb-xs">12</span>
                <span className="text-label-sm text-on-surface-variant">Active Jobs</span>
              </div>
              <div className="bg-surface-container-lowest p-md rounded-2xl border border-outline-variant/30 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] flex flex-col items-center justify-center text-center py-lg">
                <span className="text-headline-md font-black text-primary mb-xs">24</span>
                <span className="text-label-sm text-on-surface-variant">Open Roles</span>
              </div>
              <div className="bg-surface-container-lowest p-md rounded-2xl border border-outline-variant/30 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] flex flex-col items-center justify-center text-center py-lg">
                <span className="text-headline-md font-black text-primary mb-xs">148</span>
                <span className="text-label-sm text-on-surface-variant">Applicants</span>
              </div>
              <div className="bg-surface-container-lowest p-md rounded-2xl border border-outline-variant/30 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] flex flex-col items-center justify-center text-center py-lg">
                <span className="text-headline-md font-black text-primary mb-xs">8</span>
                <span className="text-label-sm text-on-surface-variant">Interviews</span>
              </div>
              <div className="bg-surface-container-lowest p-md rounded-2xl border border-outline-variant/30 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] flex flex-col items-center justify-center text-center py-lg">
                <span className="text-headline-md font-black text-primary mb-xs">4</span>
                <span className="text-label-sm text-on-surface-variant">Hires</span>
              </div>
            </div>
          </section>

          {/* Section 4: Social Links & Contact */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
            <section className="bg-surface-container-lowest rounded-2xl p-lg shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] border border-outline-variant/30">
              <h3 className="text-headline-md font-headline-md mb-md">Social Presence</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-sm">
                <button className="flex items-center gap-sm p-sm rounded-xl border border-outline-variant hover:bg-surface-variant/20 transition-all text-left">
                  <span className="material-symbols-outlined text-[#0077b5]">share</span>
                  <span className="text-label-md font-bold">LinkedIn</span>
                </button>
                <button className="flex items-center gap-sm p-sm rounded-xl border border-outline-variant hover:bg-surface-variant/20 transition-all text-left">
                  <span className="material-symbols-outlined text-primary">public</span>
                  <span className="text-label-md font-bold">Website</span>
                </button>
                <button className="flex items-center gap-sm p-sm rounded-xl border border-outline-variant hover:bg-surface-variant/20 transition-all text-left">
                  <span className="material-symbols-outlined text-on-surface">code</span>
                  <span className="text-label-md font-bold">GitHub</span>
                </button>
                <button className="flex items-center gap-sm p-sm rounded-xl border border-outline-variant hover:bg-surface-variant/20 transition-all text-left">
                  <span className="material-symbols-outlined text-on-surface">alternate_email</span>
                  <span className="text-label-md font-bold">Twitter/X</span>
                </button>
              </div>
            </section>
            
            <section className="bg-surface-container-lowest rounded-2xl p-lg shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] border border-outline-variant/30">
              <h3 className="text-headline-md font-headline-md mb-md">Main Recruiter</h3>
              <div className="flex items-center gap-md mb-md">
                {currentUser?.profileImage ? (
                  <img 
                    className="w-12 h-12 rounded-full border-2 border-primary-container object-cover" 
                    alt={currentUser?.name || "Recruiter"} 
                    src={currentUser.profileImage}
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full border-2 border-primary-container bg-primary text-on-primary font-bold flex items-center justify-center text-xl">
                    {getInitials(currentUser?.name || 'Recruiter')}
                  </div>
                )}
                <div>
                  <p className="text-label-md font-bold">{currentUser?.name || 'Recruiter'}</p>
                  <p className="text-label-sm text-on-surface-variant">
                    {[currentUser?.jobTitle, currentUser?.companyName].filter(Boolean).join(' • ') || 'Recruiter'}
                  </p>
                </div>
              </div>
              <div className="space-y-sm">
                <div className="flex items-center gap-md text-on-surface-variant">
                  <span className="material-symbols-outlined text-sm">mail</span>
                  <span className="text-body-sm">{currentUser?.email || 'recruiter@company.com'}</span>
                </div>
                <div className="flex items-center gap-md text-on-surface-variant">
                  <span className="material-symbols-outlined text-sm">call</span>
                  <span className="text-body-sm">+1 (555) 987-6543</span>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* Right Column (Sidebar/Utility) */}
        <aside className="lg:col-span-4 flex flex-col gap-lg">
          
          {/* Profile Completion Card */}
          <div className="bg-surface-container-lowest rounded-2xl p-lg shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] border border-outline-variant/30 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-surface-container">
              <div className="h-full bg-primary" style={{ width: '92%' }}></div>
            </div>
            <div className="flex justify-between items-center mb-md mt-sm">
              <h3 className="text-label-md font-black uppercase tracking-widest text-on-surface-variant">Profile Completion</h3>
              <span className="text-headline-md font-black text-primary">92%</span>
            </div>
            <ul className="space-y-sm mb-lg">
              <li className="flex items-center gap-md">
                <span className="material-symbols-outlined text-primary text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                <span className="text-label-md">Logo Uploaded</span>
              </li>
              <li className="flex items-center gap-md">
                <span className="material-symbols-outlined text-primary text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                <span className="text-label-md">About Section</span>
              </li>
              <li className="flex items-center gap-md">
                <span className="material-symbols-outlined text-primary text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                <span className="text-label-md">Contact Info</span>
              </li>
              <li className="flex items-center gap-md">
                <span className="material-symbols-outlined text-outline-variant text-lg">radio_button_unchecked</span>
                <span className="text-label-md text-on-surface-variant">Social Links</span>
              </li>
            </ul>
            <div className="flex flex-col gap-sm">
              <button className="w-full bg-primary text-on-primary py-sm rounded-xl font-bold transition-all active:scale-95 shadow-sm hover:brightness-95">Edit Profile</button>
              <button className="w-full border border-outline-variant py-sm rounded-xl font-bold text-on-surface-variant hover:bg-surface-variant/20 transition-all active:scale-95">View Public Profile</button>
            </div>
          </div>

          {/* Company Statistics Card */}
          <div className="bg-surface-container-lowest rounded-2xl p-lg shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] border border-outline-variant/30">
            <h3 className="text-label-md font-black uppercase tracking-widest text-on-surface-variant mb-md">Analytics Snapshot</h3>
            <div className="grid grid-cols-2 gap-lg">
              <div>
                <p className="text-label-sm text-on-surface-variant">Total Jobs</p>
                <p className="text-headline-md font-black">84</p>
              </div>
              <div>
                <p className="text-label-sm text-on-surface-variant">Avg Applicants</p>
                <p className="text-headline-md font-black">18</p>
              </div>
              <div>
                <p className="text-label-sm text-on-surface-variant">Avg AI Match</p>
                <p className="text-headline-md font-black text-secondary">88%</p>
              </div>
              <div>
                <p className="text-label-sm text-on-surface-variant">Hiring Success</p>
                <p className="text-headline-md font-black text-primary">94%</p>
              </div>
            </div>
          </div>

          {/* Recent Activity List */}
          <div className="bg-surface-container-lowest rounded-2xl p-lg shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] border border-outline-variant/30">
            <h3 className="text-label-md font-black uppercase tracking-widest text-on-surface-variant mb-md">Recent Activity</h3>
            <div className="flex flex-col gap-lg">
              <div className="flex gap-md">
                <div className="w-8 h-8 rounded-full bg-primary-container/20 text-primary flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-sm">edit</span>
                </div>
                <div>
                  <p className="text-label-md font-bold text-on-surface">Profile updated</p>
                  <p className="text-label-sm text-on-surface-variant">2h ago • by {currentUser?.name || 'Recruiter'}</p>
                </div>
              </div>
              <div className="flex gap-md">
                <div className="w-8 h-8 rounded-full bg-secondary-container/20 text-secondary flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-sm">rocket_launch</span>
                </div>
                <div>
                  <p className="text-label-md font-bold text-on-surface">New job published</p>
                  <p className="text-label-sm text-on-surface-variant">5h ago • Product Designer</p>
                </div>
              </div>
              <div className="flex gap-md">
                <div className="w-8 h-8 rounded-full bg-tertiary-fixed text-tertiary flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-sm">person_add</span>
                </div>
                <div>
                  <p className="text-label-md font-bold text-on-surface">New contact added</p>
                  <p className="text-label-sm text-on-surface-variant">Yesterday • {currentUser?.name || 'Recruiter'}</p>
                </div>
              </div>
            </div>
            <button className="w-full text-center mt-lg text-label-sm font-bold text-primary hover:underline">View All Activity</button>
          </div>

        </aside>
      </div>

      {/* Floating Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 lg:left-64 right-0 bg-surface/80 backdrop-blur-md border-t border-outline-variant px-lg py-md flex justify-end items-center gap-md z-40">
        <button className="px-lg py-sm text-label-md font-bold text-on-surface-variant hover:text-on-surface transition-colors active:scale-95">Cancel</button>
        <button className="px-xl py-sm bg-primary text-on-primary rounded-xl font-bold transition-all active:scale-95 shadow-md hover:brightness-110">Save Changes</button>
      </div>
    </div>
  )
}

export default RecruiterCompanyProfile
