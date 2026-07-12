import React, { useState, useRef, useEffect } from 'react'
import { useAuth, getInitials } from '../context/AuthContext.jsx'

function StudentTopbar({ onMenuToggle, variant = 'student' }) {
  const { currentUser, logout } = useAuth()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const layoutConfig = {
    student: {
      searchPlaceholder: "Search for jobs, skills, or mentors...",
      userName: currentUser?.name,
      avatar: currentUser?.profileImage,
    },
    recruiter: {
      searchPlaceholder: "Search candidates, jobs, or companies...",
      userName: currentUser?.name || "Recruiter",
      avatar: currentUser?.profileImage || null,
    },
    admin: {
      searchPlaceholder: "Search users, reports, or platform activity...",
      userName: currentUser?.name || "Admin User",
      avatar: currentUser?.profileImage || null,
    }
  }

  const config = layoutConfig[variant]

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between px-xl h-16 w-full bg-surface/80 backdrop-blur-md border-b border-outline-variant">
      {/* Mobile menu button */}
      <button
        onClick={onMenuToggle}
        className="lg:hidden p-2 text-on-surface-variant hover:text-primary rounded-lg mr-md"
      >
        <span className="material-symbols-outlined">menu</span>
      </button>

      {/* Search */}
      <div className="flex-1 max-w-xl min-w-0 mr-md">
        <div className="relative group flex items-center w-full">
          <span className="material-symbols-outlined absolute left-3 text-outline group-focus-within:text-primary transition-colors">
            search
          </span>
          <input
            type="text"
            placeholder={config.searchPlaceholder}
            className="w-full pl-10 pr-4 py-2 bg-surface-container-low border border-outline-variant rounded-full text-body-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-on-surface truncate"
          />
        </div>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-md shrink-0">
        <button className="p-2 text-on-surface-variant hover:text-primary hover:bg-surface-container-high rounded-full transition-all relative">
          <span className="material-symbols-outlined">notifications</span>
          <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full border-2 border-surface" />
        </button>
        <button className="p-2 text-on-surface-variant hover:text-primary hover:bg-surface-container-high rounded-full transition-all hidden sm:block">
          <span className="material-symbols-outlined">help_outline</span>
        </button>
        <div className="h-8 w-[1px] bg-outline-variant mx-sm hidden md:block" />
        
        <div className="relative hidden md:block" ref={dropdownRef}>
          <div 
            className="flex items-center gap-sm cursor-pointer hover:bg-surface-container-low px-2 py-1 rounded-full transition-colors"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            {config.avatar ? (
              <img 
                className="w-8 h-8 rounded-full object-cover border border-outline-variant/30" 
                src={config.avatar} 
                alt={config.userName} 
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-primary text-on-primary font-bold flex items-center justify-center text-xs">
                {getInitials(config.userName)}
              </div>
            )}
            <span className="font-label-md text-label-md text-on-surface ml-xs">{config.userName}</span>
            <span className="material-symbols-outlined text-outline ml-xs">expand_more</span>
          </div>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-surface rounded-xl shadow-lg border border-outline-variant py-2 z-50">
              <button 
                onClick={logout}
                className="w-full text-left px-4 py-2 hover:bg-surface-container-low flex items-center gap-sm text-error hover:text-error transition-colors"
              >
                <span className="material-symbols-outlined">logout</span>
                <span className="font-label-md">Logout</span>
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  )
}

export default StudentTopbar
