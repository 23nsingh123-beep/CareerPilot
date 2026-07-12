import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import AIChatAssistant from '../components/AIChatAssistant'

/* ─────────────────────────────────────────────────────────────
   Scroll-reveal hook — IntersectionObserver for bento cards
───────────────────────────────────────────────────────────── */
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal-item')
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('opacity-100', 'translate-y-0')
            entry.target.classList.remove('opacity-0', 'translate-y-8')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1 }
    )
    els.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])
}

/* ─────────────────────────────────────────────────────────────
   Data
───────────────────────────────────────────────────────────── */
const navLinks = [
  { label: 'Features',       href: '#features' },
  { label: 'How It Works',   href: '#how-it-works' },
  { label: 'For Recruiters', href: '#recruiters' },
  { label: 'Contact',        href: '#contact' },
]

const howItWorksSteps = [
  { icon: 'person_add',    title: 'Create Account',         text: 'Set up your profile in seconds and define your career goals.' },
  { icon: 'cloud_upload',  title: 'Upload Resume',          text: 'Securely upload your CV in any format for AI processing.' },
  { icon: 'analytics',     title: 'Receive AI Analysis',    text: 'Get instant feedback on scores, keywords, and recruiter visibility.' },
  { icon: 'verified',      title: 'Apply with Confidence',  text: 'Use optimized applications to land interviews 3x faster.' },
]

const testimonials = [
  {
    quote: '"I was getting zero callbacks before CareerPilot. After following the AI resume suggestions, I landed three interviews in one week at top tech companies."',
    name: 'Sarah Chen',
    role: 'Software Engineering Intern @ Meta',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDDTsCa-EQmR7FeQgTjdNr54vM5HifRvHLMLl-sA6vo9w0_VjnbJgtDG8p5EXXw1QEJq7G152UOCImiJgkC1RHVdLgALYLpD4ir0tS1eMK796J2IrOJEFKs6UcL-vtB-Vl4DUiMp3HhYy8jYYnHZok_Pu4_QlGG3H5SAFB9ba9xV0invc-wwK21726IUGjKeYT7NWHaflBGOEElHoGSi-iB98twjt_n2CgGHuk2q03ftz5dirEyfLrpkw',
  },
  {
    quote: '"The ATS optimization tool is a game changer. I never realized how my formatting was holding me back. CareerPilot is essential for every student."',
    name: 'Jameson Brooks',
    role: 'Marketing Associate @ Hubspot',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA1eQzE3-RhdNSG4KFRXoIGOQbVz_v6R4E4shyMJcHVUTcL9AhIrVx0F6A2LaBmOjk7f62sIJA7BVUkbU-PUf8IpvE8OD2lvMLk4GF986HWf5DMrESqUxpVo4NIpWtFk5muab8RHvnu0duWMzo1ET-jgFxG6WDoU_1L-3mGawJQR4NVAYdutXw9taEci0Wbvlm_fuEpMdd37_qrsA68IqivTem6lFGvFpIhxl1JTHZx3E3hjLHsjjbxag',
  },
  {
    quote: '"The smart job matching actually suggests roles I\'m excited about. It feels like having a personal career coach who knows exactly what I need."',
    name: 'Maya Patel',
    role: 'Data Analyst @ Deloitte',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCov1f8riANwS1EVQZrMvr8jffBqueyfhq93g25EwjxYe7BKSs5RUoIAID0sUOx9J-LkHa594F0A-sQYgw7GYuq7TVNqVlqoOTEk1qY06aVcGSOTyHir25LgQaATPwR0tOTH5PlaVjd2RVU3zt-IgqfIWgYWAHwNqt9QSj0wMY8Hlr3dONRgV4gKRsqjj6GO63ZDcJZmOl2o3eQGhC7z0agLwOtGvzSFxFtNdvE1VSfSO2eKYBdIYZOLA',
  },
]

const faqItems = [
  {
    question: 'How accurate is the AI resume score?',
    answer: 'Our scoring engine is calibrated against thousands of successful real-world resumes and official ATS documentation. It maintains a 94% correlation with actual recruiter preferences.',
  },
  {
    question: 'Is my data secure?',
    answer: 'Yes. We use bank-level encryption for all resume uploads and profile data. We never share your personal information with third parties without your explicit consent.',
  },
  {
    question: 'Can I use this for international jobs?',
    answer: 'Absolutely. CareerPilot supports major international markets and can adjust its analysis based on regional hiring norms in Europe, Asia, and the Americas.',
  },
]

/* ─────────────────────────────────────────────────────────────
   1. TopNavBar — matches Login/SignUp branding exactly
───────────────────────────────────────────────────────────── */
function LandingNav() {
  return (
    <header className="bg-surface/80 backdrop-blur-md border-b border-outline-variant/30 fixed top-0 left-0 w-full z-50 flex justify-between items-center px-6 py-4 max-w-container-max mx-auto">
      {/* Logo — identical to Login/SignUp */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-on-primary">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
            flight_takeoff
          </span>
        </div>
        <div className="flex flex-col">
          <span className="font-headline-md text-headline-md font-bold text-primary leading-tight">
            CareerPilot
          </span>
          <span className="font-label-sm text-label-sm text-[#6B7280] -mt-1">
            Student Professional Tool
          </span>
        </div>
      </div>

      {/* Desktop nav links */}
      <nav className="hidden md:flex items-center gap-8">
        {navLinks.map(({ label, href }) => (
          <a
            key={label}
            href={href}
            className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-opacity hover:opacity-80"
          >
            {label}
          </a>
        ))}
      </nav>

      {/* Auth buttons */}
      <div className="flex items-center gap-4">
        <Link
          to="/login"
          className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-opacity active:scale-95"
        >
          Login
        </Link>
        <Link
          to="/signup"
          className="bg-primary text-on-primary px-6 py-2.5 rounded-full font-label-md text-label-md hover:opacity-90 transition-all active:scale-95 shadow-md shadow-primary/20"
        >
          Sign Up
        </Link>
      </div>
    </header>
  )
}

/* ─────────────────────────────────────────────────────────────
   2. Hero Section — with inline Dashboard Preview
───────────────────────────────────────────────────────────── */
function HeroSection() {
  return (
    <section className="relative px-6 py-12 md:py-24 max-w-container-max mx-auto pt-32 md:pt-40">
      <div className="flex flex-col lg:flex-row items-center gap-16">

        {/* Left: text */}
        <div className="flex-1 text-center lg:text-left z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-fixed text-on-primary-fixed rounded-full mb-6">
            <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              auto_awesome
            </span>
            <span className="font-label-sm text-label-sm">Next-Gen AI Career Coaching</span>
          </div>

          <h1 className="font-display-lg text-display-lg mb-6 tracking-tight">
            Launch Your Career <br className="hidden lg:block" />{' '}
            <span className="text-primary italic">with AI</span>
          </h1>

          <p className="font-body-lg text-body-lg text-on-surface-variant mb-10 max-w-2xl mx-auto lg:mx-0">
            Analyze your resume, improve your ATS score, and discover jobs matched to your skills.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
            <Link
              to="/signup"
              className="w-full sm:w-auto bg-primary text-on-primary px-8 py-4 rounded-2xl font-headline-md text-headline-md hover:shadow-xl hover:shadow-primary/30 transition-all active:scale-95"
            >
              Get Started
            </Link>
            <a
              href="#how-it-works"
              className="w-full sm:w-auto border border-outline-variant bg-surface/50 backdrop-blur px-8 py-4 rounded-2xl font-headline-md text-headline-md hover:bg-surface-container transition-all active:scale-95"
            >
              See How It Works
            </a>
          </div>
        </div>

        {/* Right: Dashboard Preview */}
        <div className="flex-1 relative w-full">
          <div className="relative z-10 glass-card p-6 rounded-2xl shadow-2xl animate-float">
            {/* Window chrome */}
            <div className="flex items-center justify-between mb-6 border-b border-outline-variant/30 pb-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-error" />
                <div className="w-3 h-3 rounded-full bg-tertiary" />
                <div className="w-3 h-3 rounded-full bg-secondary" />
              </div>
              <div className="px-3 py-1 bg-surface-container rounded-lg text-label-sm font-label-sm text-on-surface-variant">
                Dashboard Preview
              </div>
            </div>

            {/* Score cards */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-primary/5 p-4 rounded-xl border border-primary/10">
                <p className="text-label-sm font-label-sm text-on-surface-variant mb-1">Resume Score</p>
                <p className="text-headline-lg font-bold text-primary">
                  85<span className="text-label-sm">/100</span>
                </p>
              </div>
              <div className="bg-secondary/5 p-4 rounded-xl border border-secondary/10">
                <p className="text-label-sm font-label-sm text-on-surface-variant mb-1">ATS Score</p>
                <p className="text-headline-lg font-bold text-secondary">92%</p>
              </div>
            </div>

            {/* Feedback + Job match */}
            <div className="space-y-3">
              <div className="p-3 bg-surface-container-low rounded-lg border border-outline-variant/20">
                <p className="text-label-sm font-bold">AI Feedback</p>
                <p className="text-[12px] text-on-surface-variant">Missing action verbs in experience.</p>
              </div>
              <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
                <p className="text-label-sm font-bold text-primary">Recommended Job</p>
                <p className="text-[12px] text-primary">UX Designer • Google (94% Match)</p>
              </div>
            </div>
          </div>

          {/* Decorative blobs */}
          <div className="absolute -top-10 -right-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl -z-0" />
          <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-secondary/10 rounded-full blur-3xl -z-0" />
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────────────────────
   Trust Section
───────────────────────────────────────────────────────────── */
function TrustSection() {
  return (
    <section className="py-8 bg-surface-container-lowest border-y border-outline-variant/30">
      <div className="max-w-container-max mx-auto px-6 flex flex-wrap justify-center md:justify-between items-center gap-6 text-on-surface-variant">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">verified</span>
          <span className="font-label-md font-medium">AI-Powered Resume Analysis</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-secondary">shield</span>
          <span className="font-label-md font-medium">Secure Role-Based Platform</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-tertiary">track_changes</span>
          <span className="font-label-md font-medium">Real-Time Application Tracking</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">groups</span>
          <span className="font-label-md font-medium">Built for Students &amp; Recruiters</span>
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────────────────────
   3. Features Bento Grid
───────────────────────────────────────────────────────────── */
function FeaturesSection() {
  return (
    <section className="py-24 bg-surface-container-low px-6" id="features">
      <div className="max-w-container-max mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-headline-lg text-headline-lg mb-4">Precision Tools for Modern Careers</h2>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl mx-auto">
            Everything you need to build a stronger resume and discover better career opportunities.
          </p>
        </div>

        <div className="bento-grid">
          {/* Large: AI Resume Analysis */}
          <div className="col-span-12 md:col-span-8 bg-surface rounded-2xl p-8 border border-outline-variant/30 flex flex-col md:flex-row gap-8 items-center shadow-sm hover:shadow-md transition-shadow ai-glow reveal-item opacity-0 translate-y-8 transition-all duration-700">
            <div className="flex-1">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-primary">psychology</span>
              </div>
              <h3 className="font-headline-md text-headline-md mb-3">AI Resume Analysis</h3>
              <p className="text-on-surface-variant font-body-md mb-6">
                Deep neural networks scan your resume for keyword density, formatting issues, and impact phrases used by FAANG recruiters.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-2 text-label-md font-label-md">
                  <span className="material-symbols-outlined text-primary text-[20px]">done</span> Structural integrity check
                </li>
                <li className="flex items-center gap-2 text-label-md font-label-md">
                  <span className="material-symbols-outlined text-primary text-[20px]">done</span> Tone &amp; sentiment analysis
                </li>
              </ul>
            </div>
            <div className="flex-1 w-full p-6 bg-surface-container-lowest border border-outline-variant/30 rounded-2xl shadow-inner relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-bl-full -z-0" />
              <div className="flex items-center justify-between mb-4 relative z-10">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[20px]">description</span>
                  <span className="font-bold text-label-sm text-on-surface">Alex_Resume.pdf</span>
                </div>
                <div className="px-2 py-1 bg-green-100 text-green-700 rounded text-[10px] font-bold border border-green-200">ANALYZED</div>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4 relative z-10">
                <div className="bg-white p-3 rounded-xl border border-outline-variant/20 flex flex-col items-center shadow-sm">
                  <span className="text-headline-lg font-bold text-primary">82</span>
                  <span className="text-[10px] text-on-surface-variant uppercase font-bold mt-1">Resume Score</span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-outline-variant/20 flex flex-col items-center shadow-sm">
                  <span className="text-headline-lg font-bold text-secondary">76%</span>
                  <span className="text-[10px] text-on-surface-variant uppercase font-bold mt-1">ATS Match</span>
                </div>
              </div>
              <div className="space-y-3 relative z-10 bg-white p-3 rounded-xl border border-outline-variant/20 shadow-sm">
                <div className="flex justify-between items-center text-label-sm">
                  <span className="text-on-surface-variant">Top Strengths:</span>
                  <span className="text-primary font-bold text-right">Leadership, React</span>
                </div>
                <div className="flex justify-between items-center text-label-sm">
                  <span className="text-on-surface-variant">Missing Skills:</span>
                  <span className="text-error font-bold text-right">TypeScript, Jest</span>
                </div>
                <div className="w-full bg-surface-container-high h-1.5 rounded-full mt-2 overflow-hidden">
                  <div className="bg-primary h-full w-[82%] rounded-full"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Small: ATS Optimization */}
          <div className="col-span-12 md:col-span-4 bg-surface rounded-2xl p-8 border border-outline-variant/30 shadow-sm hover:shadow-md transition-shadow reveal-item opacity-0 translate-y-8 transition-all duration-700">
            <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-secondary">settings_suggest</span>
            </div>
            <h3 className="font-headline-md text-headline-md mb-3">ATS Optimization</h3>
            <p className="text-on-surface-variant font-body-md mb-6">
              Bypass gatekeeping software with precision-engineered resume formats designed for readability.
            </p>
            <div className="mt-auto space-y-2">
              <div className="h-1.5 w-full bg-surface-container-high rounded-full overflow-hidden"><div className="w-[92%] h-full bg-secondary"></div></div>
              <div className="flex justify-between text-[10px] text-on-surface-variant font-bold uppercase"><span>Parser Readability</span><span>92%</span></div>
            </div>
          </div>

          {/* Small: Smart Job Matching */}
          <div className="col-span-12 md:col-span-4 bg-surface rounded-2xl p-8 border border-outline-variant/30 shadow-sm hover:shadow-md transition-shadow reveal-item opacity-0 translate-y-8 transition-all duration-700">
            <div className="w-12 h-12 bg-tertiary/10 rounded-xl flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-tertiary">hub</span>
            </div>
            <h3 className="font-headline-md text-headline-md mb-3">Smart Job Matching</h3>
            <p className="text-on-surface-variant font-body-md mb-6">
              Our algorithm connects your unique skill set with roles that actually match your career trajectory.
            </p>
            <div className="mt-auto flex flex-wrap gap-2">
              <span className="px-2 py-1 bg-tertiary/10 text-tertiary border border-tertiary/20 rounded text-[10px] font-bold">PRODUCT DESIGN</span>
              <span className="px-2 py-1 bg-tertiary/10 text-tertiary border border-tertiary/20 rounded text-[10px] font-bold">94% MATCH</span>
            </div>
          </div>

          {/* Large: Application Tracking */}
          <div className="col-span-12 md:col-span-8 bg-surface rounded-2xl p-8 border border-outline-variant/30 flex flex-col md:flex-row gap-8 items-center shadow-sm hover:shadow-md transition-shadow reveal-item opacity-0 translate-y-8 transition-all duration-700">
            <div className="flex-1 w-full order-2 md:order-1">
              <div className="space-y-3 p-4 bg-surface-container rounded-xl">
                <div className="h-10 w-full bg-white rounded flex items-center px-4 border border-outline-variant/20">
                  <div className="w-4 h-4 bg-green-500 rounded-full mr-3" />
                  <div className="h-2 w-32 bg-outline-variant rounded" />
                </div>
                <div className="h-10 w-full bg-white rounded flex items-center px-4 border border-outline-variant/20 opacity-60">
                  <div className="w-4 h-4 bg-yellow-500 rounded-full mr-3" />
                  <div className="h-2 w-24 bg-outline-variant rounded" />
                </div>
                <div className="h-10 w-full bg-white rounded flex items-center px-4 border border-outline-variant/20 opacity-30">
                  <div className="w-4 h-4 bg-blue-500 rounded-full mr-3" />
                  <div className="h-2 w-40 bg-outline-variant rounded" />
                </div>
              </div>
            </div>
            <div className="flex-1 order-1 md:order-2">
              <div className="w-12 h-12 bg-on-background/5 rounded-xl flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-on-background">track_changes</span>
              </div>
              <h3 className="font-headline-md text-headline-md mb-3">Application Tracking</h3>
              <p className="text-on-surface-variant font-body-md mb-6">
                A unified dashboard to manage every stage of your job hunt, from first contact to signed offer letter.
              </p>
            </div>
          </div>

          {/* Recruiter Portal */}
          <div id="recruiters" className="col-span-12 md:col-span-6 bg-surface rounded-2xl p-8 border border-outline-variant/30 shadow-sm hover:shadow-md transition-shadow reveal-item opacity-0 translate-y-8 transition-all duration-700">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-primary">groups</span>
              </div>
              <div>
                <h3 className="font-headline-md text-headline-md mb-2">Recruiter Portal</h3>
                <p className="text-on-surface-variant font-body-md mb-4">
                  Connect directly with recruiters seeking verified candidates with your specific profile and score.
                </p>
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full bg-primary/20 border-2 border-surface flex items-center justify-center text-primary text-[10px] font-bold z-20">UX</div>
                  <div className="w-8 h-8 rounded-full bg-secondary/20 border-2 border-surface flex items-center justify-center text-secondary text-[10px] font-bold z-10">DEV</div>
                  <div className="w-8 h-8 rounded-full bg-surface-container-high border-2 border-surface flex items-center justify-center text-on-surface-variant text-[10px] font-bold z-0">+5</div>
                </div>
              </div>
            </div>
          </div>

          {/* Career Insights */}
          <div className="col-span-12 md:col-span-6 bg-surface rounded-2xl p-8 border border-outline-variant/30 shadow-sm hover:shadow-md transition-shadow reveal-item opacity-0 translate-y-8 transition-all duration-700">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-secondary">trending_up</span>
              </div>
              <div>
                <h3 className="font-headline-md text-headline-md mb-2">Career Insights</h3>
                <p className="text-on-surface-variant font-body-md mb-4">
                  Weekly market reports and salary data tailored to your location and expertise level.
                </p>
                <div className="flex items-end gap-1.5 h-10 mt-2">
                  <div className="w-6 h-4 bg-secondary/30 rounded-t"></div>
                  <div className="w-6 h-6 bg-secondary/50 rounded-t"></div>
                  <div className="w-6 h-8 bg-secondary/70 rounded-t"></div>
                  <div className="w-6 h-10 bg-secondary rounded-t relative">
                    <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] font-bold text-secondary">+14%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────────────────────
   4. How It Works — 4 steps
───────────────────────────────────────────────────────────── */
function HowItWorksSection() {
  return (
    <section className="py-24 px-6 max-w-container-max mx-auto" id="how-it-works">
      <div className="text-center mb-20">
        <h2 className="font-headline-lg text-headline-lg mb-4">How CareerPilot Works</h2>
        <p className="font-body-md text-body-md text-on-surface-variant">
          Your journey to a dream job in four simple steps.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
        {/* Connector line */}
        <div className="hidden md:block absolute top-12 left-1/4 right-1/4 h-px bg-outline-variant/50 -z-10" />

        {howItWorksSteps.map(({ icon, title, text }) => (
          <div key={title} className="text-center group">
            <div className="w-16 h-16 bg-surface-container rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-primary transition-colors border-4 border-surface shadow-md">
              <span className="material-symbols-outlined text-on-surface group-hover:text-on-primary">
                {icon}
              </span>
            </div>
            <h4 className="font-headline-md text-headline-md mb-2">{title}</h4>
            <p className="font-body-sm text-body-sm text-on-surface-variant px-4">{text}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────────────────────
   5. Testimonials
───────────────────────────────────────────────────────────── */
function TestimonialsSection() {
  return (
    <section className="py-24 bg-surface-container-highest/30 px-6">
      <div className="max-w-container-max mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <h2 className="font-headline-lg text-headline-lg mb-4">Trusted by over 50,000 students</h2>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Hear from those who transformed their job search with CareerPilot.
            </p>
          </div>
          <div className="flex gap-2">
            <button className="p-2 border border-outline-variant rounded-full hover:bg-surface transition-colors">
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            <button className="p-2 border border-outline-variant rounded-full hover:bg-surface transition-colors">
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map(({ quote, name, role, img }) => (
            <div key={name} className="bg-surface p-8 rounded-2xl border border-outline-variant/30 shadow-sm">
              {/* Stars */}
              <div className="flex items-center gap-1 mb-6 text-tertiary">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className="material-symbols-outlined text-[20px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    star
                  </span>
                ))}
              </div>
              <p className="font-body-md text-body-md italic mb-8">{quote}</p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-surface-container-high overflow-hidden">
                  <img className="w-full h-full object-cover" src={img} alt={name} />
                </div>
                <div>
                  <h5 className="font-label-md text-label-md">{name}</h5>
                  <p className="text-label-sm text-on-surface-variant">{role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────────────────────
   6. FAQ Section
───────────────────────────────────────────────────────────── */
function FAQSection() {
  const [openIndex, setOpenIndex] = useState(0)

  return (
    <section className="py-24 px-6 max-w-3xl mx-auto" id="faq">
      <h2 className="font-headline-lg text-headline-lg text-center mb-12">Frequently Asked Questions</h2>
      <div className="space-y-4">
        {faqItems.map(({ question, answer }, i) => (
          <div key={i} className="bg-surface rounded-2xl border border-outline-variant/30 overflow-hidden">
            <button
              onClick={() => setOpenIndex(openIndex === i ? -1 : i)}
              className="w-full flex justify-between items-center p-6 cursor-pointer text-left"
            >
              <span className="font-headline-md text-headline-md pr-4">{question}</span>
              <span
                className={`material-symbols-outlined transition-transform duration-200 ${
                  openIndex === i ? 'rotate-180' : ''
                }`}
              >
                expand_more
              </span>
            </button>
            {openIndex === i && (
              <div className="px-6 pb-6 text-on-surface-variant font-body-md">{answer}</div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────────────────────
   7. CTA Section
───────────────────────────────────────────────────────────── */
function CTASection() {
  return (
    <section className="py-24 px-6" id="contact">
      <div className="max-w-container-max mx-auto bg-primary rounded-3xl p-12 text-center text-on-primary relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="font-display-lg text-display-lg mb-6">Ready to Take Command?</h2>
          <p className="font-body-lg text-body-lg mb-10 max-w-2xl mx-auto opacity-90">
            Join thousands of students building their future with CareerPilot AI. Sign up today and get your first analysis for free.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/signup"
              className="bg-on-primary text-primary px-10 py-4 rounded-2xl font-headline-md text-headline-md hover:bg-primary-fixed transition-all active:scale-95 shadow-xl"
            >
              Get Started Now
            </Link>
            <a
              href="#contact"
              className="bg-transparent border border-on-primary/30 text-on-primary px-10 py-4 rounded-2xl font-headline-md text-headline-md hover:bg-white/10 transition-all"
            >
              Contact Sales
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────────────────────
   8. Footer — matches Login/SignUp branding
───────────────────────────────────────────────────────────── */
function LandingFooter() {
  return (
    <footer className="bg-surface-container-lowest border-t border-outline-variant/20">
      <div className="w-full py-12 px-8 flex flex-col md:flex-row justify-between items-center gap-6 max-w-container-max mx-auto">
        {/* Brand */}
        <div className="flex flex-col items-center md:items-start gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-on-primary">
              <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                flight_takeoff
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-headline-md text-headline-md font-bold text-primary leading-tight">
                CareerPilot
              </span>
              <span className="font-label-sm text-label-sm text-[#6B7280] -mt-1">
                Student Professional Tool
              </span>
            </div>
          </div>
          <p className="font-body-sm text-body-sm text-on-surface-variant max-w-xs text-center md:text-left">
            Building the future of recruitment with AI-driven clarity and student-first tools.
          </p>
        </div>

        {/* Links */}
        <nav className="flex flex-wrap justify-center gap-x-12 gap-y-4">
          <a href="#privacy" className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors">Privacy Policy</a>
          <a href="#terms" className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors">Terms of Service</a>
          <a href="#contact" className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors">Contact Us</a>
          <a href="#twitter" className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors">Twitter</a>
          <a href="#linkedin" className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors">LinkedIn</a>
        </nav>

        <p className="font-body-sm text-body-sm text-on-surface-variant">
          © 2024 CareerPilot AI. All rights reserved.
        </p>
      </div>
    </footer>
  )
}

/* ─────────────────────────────────────────────────────────────
   Root LandingPage component
───────────────────────────────────────────────────────────── */
function LandingPage() {
  useReveal()

  return (
    <div className="bg-surface text-on-surface font-body-md selection:bg-primary-fixed selection:text-on-primary-fixed">
      <LandingNav />
      <main className="overflow-hidden">
        <HeroSection />
        <TrustSection />
        <FeaturesSection />
        <HowItWorksSection />
        <TestimonialsSection />
        <FAQSection />
        <CTASection />
      </main>
      <LandingFooter />
      <AIChatAssistant />
    </div>
  )
}

export default LandingPage
