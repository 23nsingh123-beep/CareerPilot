import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'

function RootLayout() {
  return (
    <div className="flex flex-col min-h-screen grid-bg relative">
      {/* Background glow orbs for visual style */}
      <div className="absolute top-[10%] left-[15%] w-[400px] h-[400px] rounded-full bg-indigo-600/10 glow-orb"></div>
      <div className="absolute top-[60%] right-[10%] w-[500px] h-[500px] rounded-full bg-blue-600/10 glow-orb"></div>

      <Navbar />
      
      <main className="flex-grow pt-20">
        <Outlet />
      </main>

      <Footer />
    </div>
  )
}

export default RootLayout
