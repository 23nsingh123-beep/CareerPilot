import React, { useState } from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import StudentSidebar from './StudentSidebar'
import StudentTopbar from './StudentTopbar'
import { useAuth } from '../context/AuthContext'

function StudentLayout({ variant = 'student' }) {
  const [mobileMenu, setMobileMenu] = useState(false)
  const { currentUser, logout } = useAuth()

  if (!currentUser) {
    return <Navigate to="/login" replace />
  }

  // Clear stale auth data if the role is not properly normalized
  const validRoles = ['student', 'recruiter', 'admin'];
  if (!validRoles.includes(currentUser.role)) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
    return null;
  }

  // Ensure recruiter UI is shown only when: user.role === "recruiter" (or admin)
  if (variant === 'recruiter' && currentUser.role !== 'recruiter' && currentUser.role !== 'admin') {
    return <Navigate to="/dashboard/student" replace />
  }

  // Ensure admin UI is shown only to admins
  if (variant === 'admin' && currentUser.role !== 'admin') {
    return <Navigate to="/dashboard/student" replace />
  }

  const toggleMenu = () => setMobileMenu(!mobileMenu)
  const closeMenu = () => setMobileMenu(false)

  return (
    <div className="bg-surface text-on-surface min-h-screen flex flex-col md:flex-row">
      {/* Shared Sidebar */}
      <StudentSidebar 
        mobileOpen={mobileMenu} 
        onClose={closeMenu} 
        variant={variant} 
      />

      {/* Main Content Area */}
      <div className="lg:ml-64 min-h-screen flex flex-col flex-1 min-w-0 max-w-full overflow-x-hidden">
        {/* Shared Topbar */}
        <StudentTopbar onMenuToggle={toggleMenu} variant={variant} />

        {/* Scrollable Canvas for child routes */}
        <main className="flex-1 p-xl max-w-container-max mx-auto w-full">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default StudentLayout
