import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'

function Settings() {
  const { currentUser } = useAuth()
  const [activeSection, setActiveSection] = useState('account')

  const scrollToSection = (id) => {
    setActiveSection(id)
    const element = document.getElementById(id)
    if (element) {
      // scrollIntoView with an offset for the sticky header could be tricky, 
      // but standard smooth scroll is usually fine
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const sections = [
    { id: 'account', label: 'Account', icon: 'account_circle' },
    { id: 'notifications', label: 'Notifications', icon: 'notifications_active' },
    { id: 'appearance', label: 'Appearance', icon: 'dark_mode' },
    { id: 'resume', label: 'Resume Preferences', icon: 'description' },
    { id: 'privacy', label: 'Privacy & Security', icon: 'security' },
    { id: 'ai', label: 'AI Preferences', icon: 'smart_toy' },
    { id: 'connected', label: 'Connected Accounts', icon: 'link' },
    { id: 'danger', label: 'Danger Zone', icon: 'report', isDanger: true }
  ]

  return (
    <div className="flex-grow flex flex-col relative h-full">
      <div className="flex-grow overflow-y-auto px-md md:px-lg py-xl">
        <div className="max-w-container-max mx-auto flex flex-col gap-xl">
          
          {/* Header */}
          <div className="flex flex-col gap-xs">
            <h1 className="font-headline-lg text-headline-lg text-on-surface">Settings</h1>
            <p className="font-body-md text-body-md text-on-surface-variant">Manage your account, notifications, privacy, and CareerPilot preferences.</p>
          </div>

          {/* Two-Column Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-lg items-start">
            
            {/* Left: Category Navigation */}
            <div className="md:col-span-4 lg:col-span-3 flex md:flex-col gap-xs overflow-x-auto md:overflow-visible pb-md md:pb-0 md:sticky md:top-24 z-10 bg-surface md:bg-transparent">
              {sections.map(section => (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={`flex items-center gap-sm px-md py-sm rounded-lg transition-all duration-200 text-left whitespace-nowrap md:whitespace-normal flex-shrink-0 ${
                    activeSection === section.id
                      ? 'bg-primary-container/10 text-primary font-bold'
                      : section.isDanger 
                        ? 'text-error hover:bg-error/10 font-medium'
                        : 'text-on-surface-variant hover:bg-surface-container font-medium'
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]">{section.icon}</span>
                  <span className="font-body-md text-body-md">{section.label}</span>
                  {activeSection === section.id && !section.isDanger && (
                    <span className="material-symbols-outlined text-sm ml-auto hidden md:block">chevron_right</span>
                  )}
                </button>
              ))}
            </div>

            {/* Right: Active Panels */}
            <div className="md:col-span-8 lg:col-span-9 flex flex-col gap-lg pb-32">
              
              {/* Account Panel */}
              <section id="account" className="bg-surface border border-outline-variant shadow-sm rounded-2xl p-lg flex flex-col gap-lg scroll-mt-24">
                <div className="flex items-center gap-md border-b border-outline-variant/30 pb-md">
                  <span className="material-symbols-outlined text-primary">account_circle</span>
                  <h3 className="font-headline-md text-headline-md">Account Settings</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
                  <div className="flex flex-col gap-xs">
                    <label className="font-label-md text-label-md text-on-surface-variant">Full Name</label>
                    <input type="text" className="border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary rounded-lg p-md bg-surface text-on-surface transition-all" defaultValue={currentUser.name} />
                  </div>
                  <div className="flex flex-col gap-xs">
                    <label className="font-label-md text-label-md text-on-surface-variant">Email Address</label>
                    <input type="email" className="border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary rounded-lg p-md bg-surface text-on-surface transition-all" defaultValue={currentUser.email} />
                  </div>
                  <div className="flex flex-col gap-xs">
                    <label className="font-label-md text-label-md text-on-surface-variant">Phone Number</label>
                    <input type="tel" className="border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary rounded-lg p-md bg-surface text-on-surface transition-all" defaultValue={currentUser.phone} />
                  </div>
                  <div className="flex flex-col gap-xs justify-end">
                    <button className="text-primary font-bold hover:underline flex items-center gap-xs self-start p-md md:p-0">
                      Change Password <span className="material-symbols-outlined text-sm">open_in_new</span>
                    </button>
                  </div>
                </div>
              </section>

              {/* Notifications Panel */}
              <section id="notifications" className="bg-surface border border-outline-variant shadow-sm rounded-2xl p-lg flex flex-col gap-lg scroll-mt-24">
                <div className="flex items-center gap-md border-b border-outline-variant/30 pb-md">
                  <span className="material-symbols-outlined text-primary">notifications_active</span>
                  <h3 className="font-headline-md text-headline-md">Notifications</h3>
                </div>
                <div className="flex flex-col gap-md">
                  {[
                    { title: "Application Status Updates", desc: "Get notified when a recruiter views or updates your application.", checked: true },
                    { title: "Interview Reminders", desc: "Sync with your calendar for upcoming technical assessments.", checked: true },
                    { title: "Weekly Job Recommendations", desc: "Weekly digest of matches based on your skills and preferences.", checked: false },
                    { title: "Resume Analysis Updates", desc: "Alerts when AI finishes processing your new resume.", checked: true },
                    { title: "Recruiter Messages", desc: "Notifications for direct outreach from verified employers.", checked: true },
                    { title: "Product Announcements", desc: "Updates about new CareerPilot features and tools.", checked: false },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-md bg-surface-container-low rounded-xl border border-outline-variant/10">
                      <div>
                        <p className="font-bold text-on-surface">{item.title}</p>
                        <p className="text-body-sm text-on-surface-variant">{item.desc}</p>
                      </div>
                      <input type="checkbox" defaultChecked={item.checked} className="w-11 h-6 rounded-full bg-outline-variant checked:bg-primary appearance-none cursor-pointer transition-all relative before:absolute before:w-5 before:h-5 before:bg-white before:rounded-full before:top-0.5 before:left-0.5 checked:before:translate-x-5 before:transition-transform before:shadow-sm" />
                    </div>
                  ))}
                </div>
              </section>

              {/* Appearance Panel */}
              <section id="appearance" className="bg-surface border border-outline-variant shadow-sm rounded-2xl p-lg flex flex-col gap-lg scroll-mt-24">
                <div className="flex items-center gap-md border-b border-outline-variant/30 pb-md">
                  <span className="material-symbols-outlined text-primary">dark_mode</span>
                  <h3 className="font-headline-md text-headline-md">Appearance & Region</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-md">
                  <label className="flex flex-col gap-sm p-md border-2 border-primary bg-primary/5 rounded-xl cursor-pointer">
                    <div className="aspect-video rounded bg-white shadow-sm border border-outline-variant flex items-center justify-center">
                      <span className="material-symbols-outlined text-on-surface-variant">light_mode</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-bold">Light</span>
                      <input type="radio" name="theme" defaultChecked className="text-primary focus:ring-primary" />
                    </div>
                  </label>
                  <label className="flex flex-col gap-sm p-md border border-outline-variant rounded-xl cursor-pointer hover:bg-surface-container transition-colors">
                    <div className="aspect-video rounded bg-slate-900 shadow-sm border border-outline-variant flex items-center justify-center">
                      <span className="material-symbols-outlined text-white">dark_mode</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-on-surface-variant">Dark</span>
                      <input type="radio" name="theme" className="text-primary focus:ring-primary" />
                    </div>
                  </label>
                  <label className="flex flex-col gap-sm p-md border border-outline-variant rounded-xl cursor-pointer hover:bg-surface-container transition-colors">
                    <div className="aspect-video rounded bg-gradient-to-br from-white to-slate-900 shadow-sm border border-outline-variant flex items-center justify-center">
                      <span className="material-symbols-outlined text-on-surface">settings_brightness</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-on-surface-variant">System</span>
                      <input type="radio" name="theme" className="text-primary focus:ring-primary" />
                    </div>
                  </label>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-lg mt-sm pt-md border-t border-outline-variant/30">
                  <div className="flex flex-col gap-xs">
                    <label className="font-label-md text-label-md text-on-surface-variant">Language</label>
                    <select className="border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary rounded-lg p-md bg-surface text-on-surface transition-all">
                      <option>English (US)</option>
                      <option>Spanish</option>
                      <option>French</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-xs">
                    <label className="font-label-md text-label-md text-on-surface-variant">Time Zone</label>
                    <select className="border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary rounded-lg p-md bg-surface text-on-surface transition-all">
                      <option>Pacific Time (PT)</option>
                      <option>Eastern Time (ET)</option>
                      <option>Central European Time (CET)</option>
                    </select>
                  </div>
                </div>
              </section>

              {/* Resume Preferences Panel */}
              <section id="resume" className="bg-surface border border-outline-variant shadow-sm rounded-2xl p-lg flex flex-col gap-lg scroll-mt-24">
                <div className="flex items-center gap-md border-b border-outline-variant/30 pb-md">
                  <span className="material-symbols-outlined text-primary">description</span>
                  <h3 className="font-headline-md text-headline-md">Resume Preferences</h3>
                </div>
                
                <div className="flex flex-col gap-xs">
                  <label className="font-label-md text-label-md text-on-surface-variant">Default Resume</label>
                  <select className="border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary rounded-lg p-md bg-surface text-on-surface transition-all max-w-md">
                    <option>Software_Engineer_Resume_v2.pdf</option>
                    <option>Cloud_Architect_Resume.pdf</option>
                  </select>
                </div>

                <div className="flex flex-col gap-md">
                  {[
                    { title: "Automatically analyze new resumes", desc: "Auto-scan uploaded PDF files for skill extraction.", checked: true },
                    { title: "Allow recruiters to view profile", desc: "Let verified recruiters find your profile via search.", checked: true },
                    { title: "Show resume score on profile", desc: "Display CareerPilot match score on your public portfolio.", checked: false },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <div>
                        <p className="font-bold text-on-surface">{item.title}</p>
                        <p className="text-body-sm text-on-surface-variant">{item.desc}</p>
                      </div>
                      <input type="checkbox" defaultChecked={item.checked} className="w-11 h-6 rounded-full bg-outline-variant checked:bg-primary appearance-none cursor-pointer transition-all relative before:absolute before:w-5 before:h-5 before:bg-white before:rounded-full before:top-0.5 before:left-0.5 checked:before:translate-x-5 before:transition-transform before:shadow-sm" />
                    </div>
                  ))}
                </div>

                <div className="flex flex-col gap-xs pt-md border-t border-outline-variant/30">
                  <label className="font-label-md text-label-md text-on-surface-variant">Preferred Job Categories</label>
                  <input type="text" className="border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary rounded-lg p-md bg-surface text-on-surface transition-all" placeholder="e.g. Cloud Engineering, DevOps, Backend" defaultValue="DevOps, Cloud Infrastructure" />
                </div>
              </section>

              {/* Privacy & Security Panel */}
              <section id="privacy" className="bg-surface border border-outline-variant shadow-sm rounded-2xl p-lg flex flex-col gap-lg scroll-mt-24">
                <div className="flex items-center gap-md border-b border-outline-variant/30 pb-md">
                  <span className="material-symbols-outlined text-primary">security</span>
                  <h3 className="font-headline-md text-headline-md">Privacy & Security</h3>
                </div>
                
                <div className="grid grid-cols-1 gap-md">
                  <div className="flex items-center justify-between p-md border border-outline-variant rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors cursor-pointer">
                    <div>
                      <p className="font-bold text-on-surface">Change Password</p>
                      <p className="text-body-sm text-on-surface-variant">Update your account password</p>
                    </div>
                    <span className="material-symbols-outlined text-outline">chevron_right</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-md border border-outline-variant rounded-xl bg-surface-container-low">
                    <div>
                      <p className="font-bold text-on-surface flex items-center gap-xs">
                        Two-Factor Authentication
                        <span className="px-2 py-0.5 rounded-full bg-error/10 text-error text-[10px] uppercase font-bold tracking-wide">Off</span>
                      </p>
                      <p className="text-body-sm text-on-surface-variant">Add an extra layer of security to your account</p>
                    </div>
                    <button className="px-md py-sm bg-surface-container-high hover:bg-surface-container-highest rounded-lg font-bold text-sm transition-colors border border-outline-variant/50">Enable</button>
                  </div>
                  
                  <div className="flex items-center justify-between p-md border border-outline-variant rounded-xl bg-surface-container-low hover:bg-bg-surface-container transition-colors cursor-pointer">
                    <div>
                      <p className="font-bold text-on-surface">Active Sessions</p>
                      <p className="text-body-sm text-on-surface-variant">Manage devices logged into your account</p>
                    </div>
                    <span className="material-symbols-outlined text-outline">chevron_right</span>
                  </div>

                  <div className="flex items-center justify-between p-md border border-outline-variant rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors cursor-pointer">
                    <div>
                      <p className="font-bold text-on-surface">Download Account Data</p>
                      <p className="text-body-sm text-on-surface-variant">Get a copy of your personal data</p>
                    </div>
                    <span className="material-symbols-outlined text-outline">download</span>
                  </div>
                </div>

                <div className="flex flex-col gap-xs pt-md border-t border-outline-variant/30">
                  <label className="font-label-md text-label-md text-on-surface-variant">Profile Visibility</label>
                  <select className="border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary rounded-lg p-md bg-surface text-on-surface transition-all max-w-md">
                    <option>Public (Visible to verified recruiters)</option>
                    <option>Private (Only you can see your profile)</option>
                  </select>
                </div>
              </section>

              {/* AI Preferences Panel */}
              <section id="ai" className="bg-surface border border-outline-variant shadow-sm rounded-2xl p-lg flex flex-col gap-lg scroll-mt-24">
                <div className="flex items-center gap-md border-b border-outline-variant/30 pb-md">
                  <span className="material-symbols-outlined text-primary">smart_toy</span>
                  <h3 className="font-headline-md text-headline-md">AI Preferences</h3>
                </div>
                <div className="flex flex-col gap-md">
                  {[
                    { title: "AI Resume Suggestions", desc: "Get real-time feedback on how to improve your resume bullets.", checked: true },
                    { title: "AI Job Matching", desc: "Use CareerPilot's matching algorithm for better job recommendations.", checked: true },
                    { title: "AI Career Insights", desc: "Receive automated insights about salary trends and skill demands.", checked: false },
                    { title: "Personalized Recommendations", desc: "Allow AI to suggest courses and certifications.", checked: true },
                    { title: "Use profile data to improve matches", desc: "Allow your anonymized data to improve the matching engine.", checked: true },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <div>
                        <p className="font-bold text-on-surface">{item.title}</p>
                        <p className="text-body-sm text-on-surface-variant">{item.desc}</p>
                      </div>
                      <input type="checkbox" defaultChecked={item.checked} className="w-11 h-6 rounded-full bg-outline-variant checked:bg-primary appearance-none cursor-pointer transition-all relative before:absolute before:w-5 before:h-5 before:bg-white before:rounded-full before:top-0.5 before:left-0.5 checked:before:translate-x-5 before:transition-transform before:shadow-sm" />
                    </div>
                  ))}
                </div>
              </section>

              {/* Connected Accounts */}
              <section id="connected" className="bg-surface border border-outline-variant shadow-sm rounded-2xl p-lg flex flex-col gap-lg scroll-mt-24">
                <div className="flex items-center gap-md border-b border-outline-variant/30 pb-md">
                  <span className="material-symbols-outlined text-primary">link</span>
                  <h3 className="font-headline-md text-headline-md">Connected Accounts</h3>
                </div>
                <div className="grid grid-cols-1 gap-md">
                  <div className="flex items-center justify-between p-md border border-outline-variant rounded-xl bg-surface-container-low">
                    <div className="flex items-center gap-md">
                      <div className="w-10 h-10 flex items-center justify-center bg-white rounded-lg shadow-sm border border-outline-variant/20">
                        <span className="material-symbols-outlined text-primary">account_circle</span>
                      </div>
                      <div>
                        <p className="font-bold text-on-surface">Google</p>
                        <p className="text-body-sm text-on-surface-variant">Connected as {currentUser.email}</p>
                      </div>
                    </div>
                    <button className="text-error font-bold hover:underline">Disconnect</button>
                  </div>
                  <div className="flex items-center justify-between p-md border border-outline-variant rounded-xl bg-surface-container-low">
                    <div className="flex items-center gap-md">
                      <div className="w-10 h-10 flex items-center justify-center bg-white rounded-lg shadow-sm border border-outline-variant/20">
                        <span className="material-symbols-outlined text-[#0077b5]">share</span>
                      </div>
                      <div>
                        <p className="font-bold text-on-surface">LinkedIn</p>
                        <p className="text-body-sm text-on-surface-variant">Not connected</p>
                      </div>
                    </div>
                    <button className="text-primary font-bold hover:underline border border-primary/20 px-sm py-1 rounded bg-primary/5">Connect</button>
                  </div>
                  <div className="flex items-center justify-between p-md border border-outline-variant rounded-xl bg-surface-container-low">
                    <div className="flex items-center gap-md">
                      <div className="w-10 h-10 flex items-center justify-center bg-white rounded-lg shadow-sm border border-outline-variant/20">
                        <span className="material-symbols-outlined text-on-surface">code</span>
                      </div>
                      <div>
                        <p className="font-bold text-on-surface">GitHub</p>
                        <p className="text-body-sm text-on-surface-variant">Connected as @{currentUser.github.split('/').pop()}</p>
                      </div>
                    </div>
                    <button className="text-error font-bold hover:underline">Disconnect</button>
                  </div>
                </div>
              </section>

              {/* Danger Zone */}
              <section id="danger" className="bg-error-container/5 border border-error/20 rounded-2xl p-lg flex flex-col gap-lg scroll-mt-24">
                <div className="flex items-center gap-md border-b border-error/20 pb-md">
                  <span className="material-symbols-outlined text-error">report</span>
                  <h3 className="font-headline-md text-headline-md text-error">Danger Zone</h3>
                </div>
                <div className="p-md bg-error-container/20 border border-error/20 rounded-xl">
                  <p className="text-body-sm text-on-error-container font-medium">
                    Deleting your account will permanently remove your profile, resumes, applications, and saved jobs. This action cannot be undone.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-md">
                  <button className="flex-1 bg-white border border-outline-variant px-lg py-md rounded-xl font-bold hover:bg-surface-container transition-colors shadow-sm text-on-surface">
                    Log Out All Devices
                  </button>
                  <button className="flex-1 bg-error text-on-error px-lg py-md rounded-xl font-bold hover:bg-error/90 transition-colors shadow-sm">
                    Delete Account
                  </button>
                </div>
              </section>

            </div>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Actions */}
      <div className="fixed bottom-0 left-0 lg:left-64 right-0 p-md md:p-lg bg-surface/90 backdrop-blur-md border-t border-outline-variant flex flex-col sm:flex-row justify-end gap-sm md:gap-md z-40 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <button className="px-lg py-sm md:py-md rounded-xl font-bold text-on-surface-variant hover:bg-surface-container-high transition-colors w-full sm:w-auto">
          Cancel
        </button>
        <button className="px-lg py-sm md:py-md rounded-xl font-bold bg-surface-container-highest text-on-surface hover:opacity-80 transition-colors w-full sm:w-auto">
          Reset to Default
        </button>
        <button className="px-xl py-sm md:py-md rounded-xl font-bold bg-primary text-on-primary shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all w-full sm:w-auto">
          Save Changes
        </button>
      </div>
    </div>
  )
}

export default Settings
