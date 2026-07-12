import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Compass, Menu, X } from 'lucide-react'
import Button from './Button.jsx'
import { navLinks } from '../data/landingData.js'

function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleNavClick = (e, href) => {
    e.preventDefault()
    setIsOpen(false)
    
    // If not on landing page, navigate to landing page with anchor hash
    if (location.pathname !== '/') {
      navigate('/' + href)
    } else {
      const element = document.querySelector(href)
      if (element) {
        const offset = 80 // height of navbar
        const bodyRect = document.body.getBoundingClientRect().top
        const elementRect = element.getBoundingClientRect().top
        const elementPosition = elementRect - bodyRect
        const offsetPosition = elementPosition - offset

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        })
      }
    }
  }

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-slate-950/85 backdrop-blur-md border-b border-slate-900 py-3 shadow-md' 
        : 'bg-transparent py-5'
    }`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30 group-hover:scale-105 transition-all duration-300">
            <Compass size={22} className="group-hover:rotate-45 transition-transform duration-500" />
          </div>
          <span className="font-outfit text-xl font-bold tracking-tight text-white">
            Career<span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">Pilot</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link, idx) => (
            <a
              key={idx}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="text-sm font-medium text-slate-400 hover:text-slate-100 transition-colors duration-200"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Desktop CTAs */}
        <div className="hidden md:flex items-center gap-4">
          <Link to="/login">
            <Button variant="ghost" size="sm">Sign In</Button>
          </Link>
          <Link to="/signup">
            <Button variant="primary" size="sm">Get Started</Button>
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 text-slate-400 hover:text-white transition-colors focus:outline-none"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-slate-950/95 backdrop-blur-lg border-b border-slate-900 py-6 px-6 flex flex-col gap-6 animate-fade-in">
          <div className="flex flex-col gap-4">
            {navLinks.map((link, idx) => (
              <a
                key={idx}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="text-base font-medium text-slate-400 hover:text-slate-100 transition-colors py-2 border-b border-slate-900"
              >
                {link.label}
              </a>
            ))}
          </div>
          <div className="flex flex-col gap-3">
            <Link to="/login" onClick={() => setIsOpen(false)} className="w-full">
              <Button variant="secondary" size="md" className="w-full">Sign In</Button>
            </Link>
            <Link to="/signup" onClick={() => setIsOpen(false)} className="w-full">
              <Button variant="primary" size="md" className="w-full">Get Started</Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
