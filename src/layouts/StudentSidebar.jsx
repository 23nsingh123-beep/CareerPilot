import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth, getInitials } from '../context/AuthContext.jsx'

const studentLinks = [
  { icon: 'dashboard',            label: 'Dashboard',    path: '/dashboard/student' },
  { icon: 'description',          label: 'Resume',       path: '/resume/upload' },
  { icon: 'work',                 label: 'Jobs',         path: '/jobs' },
  { icon: 'assignment_turned_in', label: 'Applications', path: '/applications' },
  { icon: 'person',               label: 'Profile',      path: '/profile' },
  { icon: 'settings',             label: 'Settings',     path: '/settings' },
]

const recruiterLinks = [
  { icon: 'dashboard',   label: 'Dashboard',       path: '/dashboard/recruiter' },
  { icon: 'add_circle',  label: 'Post Job',        path: '/recruiter/post-job' },
  { icon: 'work',        label: 'Manage Jobs',     path: '/recruiter/manage-jobs' },
  { icon: 'groups',      label: 'Applicants',      path: '/recruiter/applicants' },
  { icon: 'business',    label: 'Company Profile', path: '/recruiter/company-profile' },
  { icon: 'settings',    label: 'Settings',        path: '/recruiter/settings' },
]

const adminLinks = [
  { icon: 'dashboard', label: 'Dashboard',           path: '/admin' },
  { icon: 'group',     label: 'User Management',     path: '/admin/users' },
  { icon: 'analytics', label: 'Reports & Analytics', path: '/admin/reports' },
  { icon: 'campaign',  label: 'Announcements',       path: '/admin/announcements' },
]

function StudentSidebar({ mobileOpen, onClose, variant = 'student', onActionClick }) {
  const location = useLocation()
  const { currentUser, logout } = useAuth()

  const layoutConfig = {
    student: {
      subtitle: "Student Professional Tool",
      links: studentLinks,
      actionIcon: "upload",
      actionText: "Upload Resume",
      actionPath: "/resume/upload",
      userRole: "Student Professional",
      userName: currentUser.name,
      avatar: currentUser.profileImage,
    },
    recruiter: {
      subtitle: "Recruiter Portal",
      links: recruiterLinks,
      actionIcon: "add",
      actionText: "Post New Job",
      actionPath: "/recruiter/post-job",
      userRole: [currentUser?.jobTitle, currentUser?.companyName].filter(Boolean).join(' • ') || 'Recruiter',
      userName: currentUser?.name || 'Recruiter',
      avatar: currentUser?.profileImage || null,
    },
    admin: {
      subtitle: "Admin Portal",
      links: adminLinks,
      actionIcon: "campaign",
      actionText: "Create Announcement",
      actionPath: "/admin/announcements?create=true",
      actionDisabled: false,
      actionType: "link",
      userRole: [currentUser?.jobTitle, currentUser?.companyName].filter(Boolean).join(' • ') || 'CareerPilot Admin',
      userName: currentUser?.name || 'System Administrator',
      avatar: currentUser?.profileImage || null,
    }
  }

  const config = layoutConfig[variant]

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/30 z-40 lg:hidden" onClick={onClose} />
      )}

      <aside
        className={`fixed left-0 top-0 h-full flex flex-col p-md gap-lg w-64 border-r border-outline-variant bg-surface z-50 transition-transform duration-300 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Logo */}
        <div className="flex items-center gap-sm px-sm mb-xl">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-on-primary">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
              flight_takeoff
            </span>
          </div>
          <div className="flex flex-col gap-0">
            <Link to="/" className="font-headline-md text-headline-md font-bold text-primary hover:opacity-90 transition-opacity">
              CareerPilot
            </Link>
            <p className="text-label-sm font-medium text-outline leading-tight">{config.subtitle}</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-xs flex-1">
          {config.links.map(({ icon, label, path }) => {
            const isActive = location.pathname === path || (location.pathname.startsWith(path) && path !== '/dashboard/student' && path !== '/resume/upload' && path !== '/dashboard/recruiter' && path !== '/admin')
            // More precise active checking for dashboard and resume
            const isExactActive = (path === '/dashboard/student' && (location.pathname === '/dashboard/student' || location.pathname === '/dashboard')) ||
                                  (path === '/dashboard/recruiter' && (location.pathname === '/dashboard/recruiter' || location.pathname === '/recruiter')) ||
                                  (path === '/resume/upload' && (location.pathname === '/resume/upload' || location.pathname === '/resume')) || isActive;

            return (
              <Link
                key={path}
                to={path}
                onClick={onClose}
                className={`flex items-center gap-md px-md py-sm rounded-lg transition-all duration-200 active:scale-[0.98] ${
                  isExactActive
                    ? 'bg-primary-container text-on-primary-container font-bold'
                    : 'text-on-surface-variant hover:bg-surface-container-high'
                }`}
              >
                <span className="material-symbols-outlined" style={isExactActive ? { fontVariationSettings: "'FILL' 1" } : {}}>{icon}</span>
                <span className="font-body-md text-body-md">{label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="mt-auto pt-lg border-t border-outline-variant">
          {config.actionDisabled ? (
            <button 
              type="button"
              disabled
              aria-disabled="true"
              title={config.actionTooltip}
              className="w-full bg-surface-variant text-on-surface-variant font-label-md text-label-md py-sm px-md rounded-lg flex items-center justify-center gap-sm transition-all cursor-not-allowed opacity-70"
            >
              <span className="material-symbols-outlined text-[20px]">{config.actionIcon}</span>
              {config.actionText}
            </button>
          ) : config.actionType === 'button' ? (
            <button 
              type="button"
              onClick={() => {
                if (onActionClick) onActionClick();
                if (mobileOpen) onClose();
              }}
              className="w-full bg-primary text-on-primary font-label-md text-label-md py-sm px-md rounded-lg flex items-center justify-center gap-sm transition-all duration-200 active:scale-[0.98] hover:bg-primary/90"
            >
              <span className="material-symbols-outlined text-[20px]">{config.actionIcon}</span>
              {config.actionText}
            </button>
          ) : (
            <Link to={config.actionPath} onClick={onClose} className="w-full bg-primary text-on-primary font-label-md text-label-md py-sm px-md rounded-lg flex items-center justify-center gap-sm transition-all duration-200 active:scale-[0.98] hover:bg-primary/90">
              <span className="material-symbols-outlined text-[20px]">{config.actionIcon}</span>
              {config.actionText}
            </Link>
          )}

          <div className="flex items-center gap-sm mt-lg px-sm">
            {config.avatar ? (
              <img
                className="w-10 h-10 rounded-full border-2 border-primary-container object-cover"
                src={config.avatar}
                alt={config.userName}
              />
            ) : (
              <div className="w-10 h-10 rounded-full border-2 border-primary-container bg-primary text-on-primary font-bold flex items-center justify-center">
                {getInitials(config.userName)}
              </div>
            )}
            <div className="overflow-hidden flex-1">
              <p className="font-label-md text-label-md font-bold truncate text-on-surface">{config.userName}</p>
              <p className="font-label-sm text-label-sm text-on-surface-variant truncate">{config.userRole}</p>
            </div>
            <button 
              onClick={logout} 
              className="p-2 text-on-surface-variant hover:bg-error-container hover:text-on-error-container rounded-lg transition-colors ml-auto"
              title="Logout"
            >
              <span className="material-symbols-outlined text-[20px]">logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}

export default StudentSidebar
