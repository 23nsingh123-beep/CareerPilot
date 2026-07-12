import React from 'react'
import { Link } from 'react-router-dom'
import { Compass, Github, Linkedin, Twitter } from 'lucide-react'

function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-slate-950 border-t border-slate-900 pt-16 pb-8 relative z-10">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-6 mb-12">
        {/* Logo and Tagline */}
        <div className="flex flex-col gap-4">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30">
              <Compass size={18} />
            </div>
            <span className="font-outfit text-lg font-bold tracking-tight text-white">
              Career<span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">Pilot</span>
            </span>
          </Link>
          <p className="text-sm text-slate-400 leading-relaxed max-w-xs">
            Empowering professionals with AI-driven roadmap tracking, customized preparation, and smart job matchmaking.
          </p>
          <div className="flex items-center gap-4 mt-2">
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="text-slate-500 hover:text-slate-300 transition-colors">
              <Twitter size={18} />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="text-slate-500 hover:text-slate-300 transition-colors">
              <Linkedin size={18} />
            </a>
            <a href="https://github.com" target="_blank" rel="noreferrer" className="text-slate-500 hover:text-slate-300 transition-colors">
              <Github size={18} />
            </a>
          </div>
        </div>

        {/* Column 2 - Product */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4">Platform</h4>
          <ul className="flex flex-col gap-2.5 text-sm text-slate-400">
            <li><a href="#features" className="hover:text-slate-100 transition-colors">Features</a></li>
            <li><a href="#how-it-works" className="hover:text-slate-100 transition-colors">How it Works</a></li>
            <li><a href="#faq" className="hover:text-slate-100 transition-colors">FAQ</a></li>
          </ul>
        </div>

        {/* Column 3 - Company */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4">Company</h4>
          <ul className="flex flex-col gap-2.5 text-sm text-slate-400">
            <li><a href="#about" className="hover:text-slate-100 transition-colors">About Us</a></li>
            <li><a href="#careers" className="hover:text-slate-100 transition-colors">Careers</a></li>
            <li><a href="#contact" className="hover:text-slate-100 transition-colors">Contact</a></li>
          </ul>
        </div>

        {/* Column 4 - Legal */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4">Legal</h4>
          <ul className="flex flex-col gap-2.5 text-sm text-slate-400">
            <li><a href="#privacy" className="hover:text-slate-100 transition-colors">Privacy Policy</a></li>
            <li><a href="#terms" className="hover:text-slate-100 transition-colors">Terms of Service</a></li>
            <li><a href="#cookies" className="hover:text-slate-100 transition-colors">Cookie Settings</a></li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 border-t border-slate-900 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-xs text-slate-500">
          &copy; {currentYear} CareerPilot Inc. All rights reserved.
        </p>
        <p className="text-xs text-slate-600 flex items-center gap-1">
          Designed with ❤️ for future leaders.
        </p>
      </div>
    </footer>
  )
}

export default Footer
