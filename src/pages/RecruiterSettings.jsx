import React, { useState } from 'react'
import { useAuth, getInitials } from '../context/AuthContext.jsx'
function ToggleSwitch({ checked, onChange, label, description }) {
  return (
    <div className="flex items-center justify-between p-md border border-outline-variant/50 rounded-xl hover:border-primary/30 transition-colors bg-white">
      <div>
        <p className="font-bold text-on-surface">{label}</p>
        {description && <p className="text-body-sm text-on-surface-variant">{description}</p>}
      </div>
      <button 
        type="button"
        onClick={() => onChange(!checked)}
        className={`w-12 h-6 rounded-full relative transition-colors ${checked ? 'bg-primary' : 'bg-surface-container-high'}`}
      >
        <span 
          className={`absolute top-1 bottom-1 w-4 bg-white rounded-full transition-all shadow-sm ${checked ? 'left-[26px]' : 'left-1'}`}
        />
      </button>
    </div>
  )
}

function RecruiterSettings() {
  const { currentUser } = useAuth()
  const [activeTab, setActiveTab] = useState('account')

  const tabs = [
    { id: 'account', icon: 'account_circle', label: 'Account', danger: false },
    { id: 'notifications', icon: 'notifications', label: 'Notifications', danger: false },
    { id: 'preferences', icon: 'tune', label: 'Hiring Preferences', danger: false },
    { id: 'ai', icon: 'auto_awesome', label: 'AI Matching', danger: false },
    { id: 'team', icon: 'groups', label: 'Team Access', danger: false },
    { id: 'privacy', icon: 'shield', label: 'Privacy & Security', danger: false },
    { id: 'connected', icon: 'link', label: 'Connected Accounts', danger: false },
    { id: 'divider' },
    { id: 'danger', icon: 'report', label: 'Danger Zone', danger: true },
  ]

  // Mock states for toggles
  const [toggles, setToggles] = useState({
    notifNewApplicant: true,
    notifInterview: true,
    notifWeekly: false,
    notifAIMatch: true,
    notifMessages: true,
    notifJobExpiry: true,
    
    aiEnable: true,
    aiPrioritize: true,
    aiATS: false,
    aiResume: true,
    aiHighlight: true,
    
    priv2FA: false
  })

  const toggle = (key) => setToggles(prev => ({ ...prev, [key]: !prev[key] }))

  return (
    <div className="max-w-[1280px] mx-auto w-full flex-1 mb-24 pb-20">
      
      {/* Settings Header */}
      <header className="mb-xl">
        <h1 className="text-headline-lg font-headline-lg text-on-surface">Settings</h1>
        <p className="text-body-md text-on-surface-variant mt-xs">Manage your recruiter account, hiring preferences, notifications, and security.</p>
      </header>

      {/* Settings Layout Grid */}
      <div className="grid grid-cols-12 gap-xl relative items-start">
        
        {/* Left Nav: Categories (25%) */}
        <aside className="col-span-12 lg:col-span-3">
          <nav className="flex flex-col gap-xs sticky top-24">
            {tabs.map((tab, idx) => {
              if (tab.id === 'divider') {
                return <div key={idx} className="my-md border-t border-outline-variant"></div>
              }

              const isActive = activeTab === tab.id
              let btnClass = ""

              if (tab.danger) {
                btnClass = isActive 
                  ? "bg-error/10 text-error font-bold" 
                  : "text-error hover:bg-error/10 transition-all font-bold"
              } else {
                btnClass = isActive 
                  ? "bg-primary-container text-on-primary-container font-bold" 
                  : "text-on-surface-variant hover:bg-surface-container-high transition-all"
              }

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-md px-md py-sm rounded-lg text-left ${btnClass}`}
                >
                  <span className="material-symbols-outlined">{tab.icon}</span>
                  <span className="text-body-md">{tab.label}</span>
                </button>
              )
            })}
          </nav>
        </aside>

        {/* Right Content: Panels (75%) */}
        <div className="col-span-12 lg:col-span-9">
          
          {/* Account Section */}
          {activeTab === 'account' && (
            <section className="space-y-lg animate-in fade-in duration-300">
              <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-xl shadow-sm">
                <div className="flex items-center gap-xl mb-xl">
                  <div className="relative group">
                    {currentUser?.profileImage ? (
                      <img alt={currentUser?.name || "Recruiter"} className="w-24 h-24 rounded-full object-cover border-4 border-surface-container-low shadow-sm" src={currentUser.profileImage}/>
                    ) : (
                      <div className="w-24 h-24 rounded-full border-4 border-surface-container-low bg-primary text-on-primary font-bold flex items-center justify-center text-4xl shadow-sm">
                        {getInitials(currentUser?.name || 'Recruiter')}
                      </div>
                    )}
                    <button className="absolute bottom-0 right-0 p-2 bg-primary text-on-primary rounded-full shadow-lg hover:scale-110 transition-transform flex items-center justify-center">
                      <span className="material-symbols-outlined text-[18px]">photo_camera</span>
                    </button>
                  </div>
                  <div>
                    <h2 className="text-headline-md font-bold text-on-surface">Profile Information</h2>
                    <p className="text-body-sm text-on-surface-variant">Update your personal details and professional identity.</p>
                    <button className="mt-md px-md py-2 border border-outline-variant rounded-lg text-label-md font-bold hover:bg-surface-container-low transition-all">Change Photo</button>
                  </div>
                </div>
                
                <form className="grid grid-cols-1 md:grid-cols-2 gap-lg">
                  <div className="flex flex-col gap-xs">
                    <label className="text-label-md font-bold text-on-surface-variant ml-1">Full Name</label>
                    <input className="px-md py-3 bg-white border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-body-md" type="text" defaultValue={currentUser?.name || "Recruiter"}/>
                  </div>
                  <div className="flex flex-col gap-xs">
                    <label className="text-label-md font-bold text-on-surface-variant ml-1">Work Email</label>
                    <input className="px-md py-3 bg-white border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-body-md" type="email" defaultValue={currentUser?.email || ""}/>
                  </div>
                  <div className="flex flex-col gap-xs">
                    <label className="text-label-md font-bold text-on-surface-variant ml-1">Phone Number</label>
                    <input className="px-md py-3 bg-white border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-body-md" type="tel" defaultValue={currentUser?.phone || ""}/>
                  </div>
                  <div className="flex flex-col gap-xs">
                    <label className="text-label-md font-bold text-on-surface-variant ml-1">Job Title</label>
                    <input className="px-md py-3 bg-white border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-body-md" type="text" defaultValue={currentUser?.jobTitle || ""}/>
                  </div>
                  <div className="flex flex-col gap-xs">
                    <label className="text-label-md font-bold text-on-surface-variant ml-1">Department</label>
                    <input className="px-md py-3 bg-white border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-body-md" type="text" defaultValue=""/>
                  </div>
                  <div className="flex flex-col gap-xs">
                    <label className="text-label-md font-bold text-on-surface-variant ml-1">Company Name</label>
                    <input className="px-md py-3 bg-white border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-body-md" type="text" defaultValue={currentUser?.companyName || ""}/>
                  </div>
                  <div className="md:col-span-2 flex flex-col gap-xs">
                    <label className="text-label-md font-bold text-on-surface-variant ml-1">Bio (Optional)</label>
                    <textarea className="px-md py-3 bg-white border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-body-md resize-none" rows="3" defaultValue="Passionate about connecting world-class engineering talent with innovative teams at Google."></textarea>
                  </div>
                </form>
              </div>

              <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-xl shadow-sm">
                <h3 className="text-body-lg font-bold text-on-surface mb-md">Security Settings</h3>
                <div className="flex items-center justify-between p-md border border-outline-variant rounded-xl">
                  <div className="flex items-center gap-md">
                    <span className="material-symbols-outlined text-outline">key</span>
                    <div>
                      <p className="text-label-md font-bold text-on-surface">Password</p>
                      <p className="text-body-sm text-on-surface-variant">Last updated 3 months ago</p>
                    </div>
                  </div>
                  <button className="px-md py-2 bg-surface-container text-on-surface font-bold rounded-lg hover:bg-surface-container-high transition-all">Change Password</button>
                </div>
              </div>
            </section>
          )}

          {/* Notifications Section */}
          {activeTab === 'notifications' && (
            <section className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-xl shadow-sm animate-in fade-in duration-300 space-y-lg">
              <div>
                <h2 className="text-headline-md font-bold text-on-surface mb-xs">Notifications</h2>
                <p className="text-body-sm text-on-surface-variant mb-xl">Control how and when you want to be alerted about hiring activities.</p>
              </div>

              <div className="space-y-sm">
                <ToggleSwitch 
                  label="New Applicant Alerts" 
                  description="Get notified when a candidate applies to your active job postings."
                  checked={toggles.notifNewApplicant} 
                  onChange={() => toggle('notifNewApplicant')} 
                />
                <ToggleSwitch 
                  label="Interview Reminders" 
                  description="Receive alerts 24 hours and 1 hour before scheduled interviews."
                  checked={toggles.notifInterview} 
                  onChange={() => toggle('notifInterview')} 
                />
                <ToggleSwitch 
                  label="Weekly Hiring Summary" 
                  description="Receive a weekly digest of your job posting performance."
                  checked={toggles.notifWeekly} 
                  onChange={() => toggle('notifWeekly')} 
                />
                <ToggleSwitch 
                  label="AI Candidate Match Alerts" 
                  description="Get pinged when a candidate with an AI match > 90% is found."
                  checked={toggles.notifAIMatch} 
                  onChange={() => toggle('notifAIMatch')} 
                />
                <ToggleSwitch 
                  label="Recruiter Messages" 
                  description="Notify me when an applicant sends a direct message."
                  checked={toggles.notifMessages} 
                  onChange={() => toggle('notifMessages')} 
                />
                <ToggleSwitch 
                  label="Job Expiration Reminders" 
                  description="Alert me 3 days before a job posting is set to expire."
                  checked={toggles.notifJobExpiry} 
                  onChange={() => toggle('notifJobExpiry')} 
                />
              </div>
            </section>
          )}

          {/* Hiring Preferences Section */}
          {activeTab === 'preferences' && (
            <section className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-xl shadow-sm animate-in fade-in duration-300">
              <h2 className="text-headline-md font-bold text-on-surface mb-xs">Hiring Preferences</h2>
              <p className="text-body-sm text-on-surface-variant mb-xl">Set your defaults for creating new job postings faster.</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
                <div className="flex flex-col gap-xs">
                  <label className="text-label-md font-bold text-on-surface-variant ml-1">Default Employment Type</label>
                  <select className="px-md py-3 bg-white border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-body-md appearance-none">
                    <option>Full-time</option>
                    <option>Part-time</option>
                    <option>Contract</option>
                    <option>Internship</option>
                  </select>
                </div>
                <div className="flex flex-col gap-xs">
                  <label className="text-label-md font-bold text-on-surface-variant ml-1">Default Work Mode</label>
                  <select className="px-md py-3 bg-white border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-body-md appearance-none">
                    <option>Remote</option>
                    <option>Hybrid</option>
                    <option>On-site</option>
                  </select>
                </div>
                <div className="flex flex-col gap-xs">
                  <label className="text-label-md font-bold text-on-surface-variant ml-1">Minimum Experience</label>
                  <select className="px-md py-3 bg-white border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-body-md appearance-none">
                    <option>Entry Level (0-2 years)</option>
                    <option>Mid Level (3-5 years)</option>
                    <option>Senior (5+ years)</option>
                    <option>Director</option>
                  </select>
                </div>
                <div className="flex flex-col gap-xs">
                  <label className="text-label-md font-bold text-on-surface-variant ml-1">Default Application Deadline</label>
                  <select className="px-md py-3 bg-white border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-body-md appearance-none">
                    <option>30 Days</option>
                    <option>60 Days</option>
                    <option>90 Days</option>
                    <option>No Deadline</option>
                  </select>
                </div>
                <div className="md:col-span-2 flex flex-col gap-xs">
                  <label className="text-label-md font-bold text-on-surface-variant ml-1">Preferred Departments (Tags)</label>
                  <div className="px-md py-3 bg-white border border-outline-variant rounded-xl flex flex-wrap gap-sm">
                    <span className="bg-primary-container text-on-primary-container px-sm py-1 rounded-md text-label-sm flex items-center gap-xs">
                      Engineering <button className="material-symbols-outlined text-[14px]">close</button>
                    </span>
                    <span className="bg-primary-container text-on-primary-container px-sm py-1 rounded-md text-label-sm flex items-center gap-xs">
                      Product <button className="material-symbols-outlined text-[14px]">close</button>
                    </span>
                    <input type="text" placeholder="Add department..." className="border-none bg-transparent outline-none text-body-md w-32" />
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* AI Matching Section */}
          {activeTab === 'ai' && (
            <section className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-xl shadow-sm animate-in fade-in duration-300 space-y-lg">
              <div>
                <h2 className="text-headline-md font-bold text-on-surface mb-xs flex items-center gap-sm">
                  <span className="material-symbols-outlined text-primary">auto_awesome</span> 
                  AI Matching
                </h2>
                <p className="text-body-sm text-on-surface-variant mb-xl">Configure how CareerPilot AI parses resumes and scores candidates.</p>
              </div>

              <div className="space-y-sm">
                <ToggleSwitch 
                  label="Enable AI Matching" 
                  description="Automatically generate compatibility scores for every candidate."
                  checked={toggles.aiEnable} 
                  onChange={() => toggle('aiEnable')} 
                />
                
                <div className="p-md border border-outline-variant/50 rounded-xl bg-white space-y-sm mt-md">
                  <div className="flex justify-between items-center">
                    <p className="font-bold text-on-surface">Minimum Match Score Visibility</p>
                    <p className="font-bold text-primary">75%</p>
                  </div>
                  <input type="range" className="w-full accent-primary" min="0" max="100" defaultValue="75" />
                  <p className="text-label-sm text-on-surface-variant">Hide candidates with an AI score below this threshold from the main applicant list.</p>
                </div>

                <ToggleSwitch 
                  label="Prioritize Required Skills" 
                  description="Weigh explicitly listed required skills heavily in the AI algorithm."
                  checked={toggles.aiPrioritize} 
                  onChange={() => toggle('aiPrioritize')} 
                />
                <ToggleSwitch 
                  label="Use Traditional ATS Scoring" 
                  description="Combine modern AI analysis with standard keyword-matching ATS logic."
                  checked={toggles.aiATS} 
                  onChange={() => toggle('aiATS')} 
                />
                <ToggleSwitch 
                  label="Include Resume Score" 
                  description="Score the applicant's resume quality, formatting, and brevity."
                  checked={toggles.aiResume} 
                  onChange={() => toggle('aiResume')} 
                />
                <ToggleSwitch 
                  label="Highlight Missing Skills" 
                  description="Automatically flag gaps in a candidate's profile during review."
                  checked={toggles.aiHighlight} 
                  onChange={() => toggle('aiHighlight')} 
                />
              </div>
            </section>
          )}

          {/* Team Access Section */}
          {activeTab === 'team' && (
            <section className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-xl shadow-sm animate-in fade-in duration-300">
              <div className="flex justify-between items-start mb-xl">
                <div>
                  <h2 className="text-headline-md font-bold text-on-surface mb-xs">Team Access</h2>
                  <p className="text-body-sm text-on-surface-variant">Manage who can view applicants and post jobs for your company.</p>
                </div>
                <button className="px-lg py-2 bg-primary text-on-primary rounded-xl font-bold flex items-center gap-sm shadow-sm hover:brightness-110 transition-all">
                  <span className="material-symbols-outlined text-[20px]">person_add</span>
                  Invite Member
                </button>
              </div>

              <div className="border border-outline-variant rounded-xl overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-surface-container-low border-b border-outline-variant">
                    <tr>
                      <th className="px-md py-sm text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider">Name</th>
                      <th className="px-md py-sm text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider">Role</th>
                      <th className="px-md py-sm text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider">Email</th>
                      <th className="px-md py-sm text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider">Permission</th>
                      <th className="px-md py-sm text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant">
                    <tr className="hover:bg-surface-container-lowest transition-colors">
                      <td className="px-md py-md font-bold text-on-surface flex items-center gap-sm">
                        <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-label-sm">SJ</div>
                        Sarah Jenkins
                      </td>
                      <td className="px-md py-md text-body-sm">Senior Recruiter</td>
                      <td className="px-md py-md text-body-sm text-on-surface-variant">s.jenkins@google.com</td>
                      <td className="px-md py-md">
                        <span className="bg-primary/10 text-primary px-sm py-1 rounded-full text-label-sm">Admin</span>
                      </td>
                      <td className="px-md py-md text-right">
                        <button className="text-primary text-label-sm font-bold hover:underline mr-md">Edit</button>
                        <button className="text-error text-label-sm font-bold hover:underline">Remove</button>
                      </td>
                    </tr>
                    <tr className="hover:bg-surface-container-lowest transition-colors">
                      <td className="px-md py-md font-bold text-on-surface flex items-center gap-sm">
                        <div className="w-8 h-8 rounded-full bg-surface-container-high text-on-surface flex items-center justify-center text-label-sm">MC</div>
                        Michael Chen
                      </td>
                      <td className="px-md py-md text-body-sm">Hiring Manager</td>
                      <td className="px-md py-md text-body-sm text-on-surface-variant">m.chen@google.com</td>
                      <td className="px-md py-md">
                        <span className="bg-surface-container-high text-on-surface-variant px-sm py-1 rounded-full text-label-sm">Viewer</span>
                      </td>
                      <td className="px-md py-md text-right">
                        <button className="text-primary text-label-sm font-bold hover:underline mr-md">Edit</button>
                        <button className="text-error text-label-sm font-bold hover:underline">Remove</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* Privacy & Security Section */}
          {activeTab === 'privacy' && (
            <section className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-xl shadow-sm animate-in fade-in duration-300 space-y-lg">
              <div>
                <h2 className="text-headline-md font-bold text-on-surface mb-xs flex items-center gap-sm">
                  <span className="material-symbols-outlined text-on-surface">shield</span> 
                  Privacy & Security
                </h2>
                <p className="text-body-sm text-on-surface-variant mb-xl">Enhance the security of your recruiter account.</p>
              </div>

              <div className="space-y-sm">
                <ToggleSwitch 
                  label="Two-Factor Authentication (2FA)" 
                  description="Require an extra security code during login."
                  checked={toggles.priv2FA} 
                  onChange={() => toggle('priv2FA')} 
                />
              </div>

              <div className="mt-xl border border-outline-variant rounded-2xl overflow-hidden">
                <div className="p-md border-b border-outline-variant bg-surface-container-low flex justify-between items-center">
                  <h3 className="font-bold text-on-surface">Active Sessions</h3>
                  <button className="text-primary text-label-sm font-bold">Sign out all other sessions</button>
                </div>
                <div className="p-md flex items-start gap-md border-b border-outline-variant bg-white">
                  <span className="material-symbols-outlined text-outline text-[24px]">desktop_windows</span>
                  <div>
                    <p className="font-bold text-on-surface">Windows PC • Chrome</p>
                    <p className="text-label-sm text-on-surface-variant">San Francisco, CA • Active now</p>
                  </div>
                </div>
                <div className="p-md flex items-start gap-md bg-white">
                  <span className="material-symbols-outlined text-outline text-[24px]">smartphone</span>
                  <div>
                    <p className="font-bold text-on-surface">iPhone 14 • Safari</p>
                    <p className="text-label-sm text-on-surface-variant">San Francisco, CA • Last active 2h ago</p>
                  </div>
                </div>
              </div>

              <div className="mt-xl flex items-center justify-between p-lg border border-outline-variant rounded-2xl bg-white">
                <div>
                  <h3 className="font-bold text-on-surface">Download Account Data</h3>
                  <p className="text-body-sm text-on-surface-variant">Export all your job postings, candidate notes, and settings.</p>
                </div>
                <button className="px-md py-2 border border-outline-variant rounded-lg font-bold hover:bg-surface-container-low transition-all flex items-center gap-sm">
                  <span className="material-symbols-outlined text-[18px]">download</span> Download
                </button>
              </div>
            </section>
          )}

          {/* Connected Accounts Section */}
          {activeTab === 'connected' && (
            <section className="space-y-lg animate-in fade-in duration-300">
              <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-xl shadow-sm">
                <h2 className="text-headline-md font-bold text-on-surface mb-xs">Connected Accounts</h2>
                <p className="text-body-sm text-on-surface-variant mb-xl">Manage your integrations with third-party professional tools.</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
                  <div className="p-lg border border-outline-variant rounded-2xl hover:border-primary transition-all group flex items-start justify-between bg-white">
                    <div className="flex items-center gap-md">
                      <div className="w-12 h-12 bg-surface-container rounded-xl flex items-center justify-center">
                        <span className="material-symbols-outlined text-primary">mail</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-on-surface">Google</h4>
                        <p className="text-body-sm text-secondary font-medium">Connected</p>
                      </div>
                    </div>
                    <button className="material-symbols-outlined text-outline hover:text-error transition-colors">link_off</button>
                  </div>

                  <div className="p-lg border border-outline-variant rounded-2xl hover:border-primary transition-all group flex items-start justify-between bg-white">
                    <div className="flex items-center gap-md">
                      <div className="w-12 h-12 bg-surface-container rounded-xl flex items-center justify-center">
                        <span className="material-symbols-outlined text-primary">work</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-on-surface">LinkedIn</h4>
                        <p className="text-body-sm text-on-surface-variant">Not connected</p>
                      </div>
                    </div>
                    <button className="px-md py-1 bg-primary text-on-primary rounded-lg text-label-sm font-bold shadow-sm">Connect</button>
                  </div>

                  <div className="p-lg border border-outline-variant rounded-2xl hover:border-primary transition-all group flex items-start justify-between bg-white">
                    <div className="flex items-center gap-md">
                      <div className="w-12 h-12 bg-surface-container rounded-xl flex items-center justify-center">
                        <span className="material-symbols-outlined text-primary">window</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-on-surface">Microsoft Outlook</h4>
                        <p className="text-body-sm text-on-surface-variant">Not connected</p>
                      </div>
                    </div>
                    <button className="px-md py-1 bg-primary text-on-primary rounded-lg text-label-sm font-bold shadow-sm">Connect</button>
                  </div>

                  <div className="p-lg border border-outline-variant rounded-2xl hover:border-primary transition-all group flex items-start justify-between bg-white">
                    <div className="flex items-center gap-md">
                      <div className="w-12 h-12 bg-surface-container rounded-xl flex items-center justify-center">
                        <span className="material-symbols-outlined text-primary">event_available</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-on-surface">Calendar Sync</h4>
                        <p className="text-body-sm text-secondary font-medium">Active</p>
                      </div>
                    </div>
                    <button className="material-symbols-outlined text-outline hover:text-error transition-colors">link_off</button>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Danger Zone Section */}
          {activeTab === 'danger' && (
            <section className="space-y-lg animate-in fade-in duration-300">
              <div className="bg-error/5 rounded-2xl border border-error/20 p-xl shadow-sm">
                <div className="flex items-center gap-md mb-xl">
                  <div className="p-2 bg-error/10 text-error rounded-lg">
                    <span className="material-symbols-outlined text-[28px]">report_problem</span>
                  </div>
                  <div>
                    <h2 className="text-headline-md font-bold text-error">Danger Zone</h2>
                    <p className="text-body-sm text-on-surface-variant">Irreversible actions concerning your account.</p>
                  </div>
                </div>
                
                <div className="space-y-md">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-lg bg-white rounded-2xl border border-outline-variant/30 gap-md">
                    <div>
                      <p className="font-bold text-on-surface">Log Out</p>
                      <p className="text-body-sm text-on-surface-variant">End your current session securely.</p>
                    </div>
                    <button className="w-full sm:w-auto px-lg py-2 bg-surface-variant text-on-surface-variant rounded-full font-bold hover:bg-surface-container-high transition-all shrink-0">Log Out</button>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-lg bg-white rounded-2xl border border-outline-variant/30 gap-md">
                    <div>
                      <p className="font-bold text-on-surface">Remove Company Access</p>
                      <p className="text-body-sm text-on-surface-variant">Disconnect your account from Google. You will lose access to all jobs.</p>
                    </div>
                    <button className="w-full sm:w-auto px-lg py-2 border border-error text-error rounded-full font-bold hover:bg-error/5 transition-all shrink-0">Disconnect</button>
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-lg bg-white rounded-2xl border border-error/30 gap-md">
                    <div>
                      <p className="font-bold text-error">Delete Recruiter Account</p>
                      <p className="text-body-sm text-on-surface-variant">Permanently remove all your data, applicant history, and job postings.</p>
                    </div>
                    <button className="w-full sm:w-auto px-lg py-2 bg-error text-on-error rounded-full font-bold hover:opacity-90 shadow-md transition-all shrink-0">Delete Account</button>
                  </div>
                </div>
              </div>
            </section>
          )}

        </div>
      </div>

      {/* Sticky Footer Action Bar */}
      <footer className="fixed bottom-0 left-0 lg:left-64 right-0 h-20 bg-surface/80 backdrop-blur-md border-t border-outline-variant px-xl flex flex-col sm:flex-row items-center justify-center sm:justify-between z-30 gap-md pb-md sm:pb-0 pt-md sm:pt-0">
        <div className="hidden sm:flex items-center gap-sm text-on-surface-variant">
          <span className="material-symbols-outlined text-[20px]">info</span>
          <p className="text-label-md">Unsaved changes will be lost if you leave without saving.</p>
        </div>
        <div className="flex items-center gap-md w-full sm:w-auto justify-end">
          <button className="px-lg py-2.5 font-bold text-on-surface-variant hover:bg-surface-container-low rounded-full transition-all hidden sm:block">Cancel</button>
          <button className="px-lg py-2.5 font-bold text-on-surface-variant border border-outline-variant/30 hover:bg-surface-container-low rounded-full transition-all text-sm sm:text-base whitespace-nowrap">Reset to Default</button>
          <button className="px-xl py-2.5 bg-primary text-on-primary font-bold rounded-full shadow-md shadow-primary/20 hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] transition-all text-sm sm:text-base whitespace-nowrap">Save Changes</button>
        </div>
      </footer>
    </div>
  )
}

export default RecruiterSettings
