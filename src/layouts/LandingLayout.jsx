import React from 'react'
import { Outlet } from 'react-router-dom'

/**
 * LandingLayout — wraps ONLY the landing page ( / ).
 * Uses the Stitch light theme (bg-surface / text-on-surface).
 * Login & Signup use their own standalone layouts and are unaffected.
 */
function LandingLayout() {
  return (
    <div className="bg-surface text-on-surface font-sans antialiased overflow-x-hidden">
      <Outlet />
    </div>
  )
}

export default LandingLayout
