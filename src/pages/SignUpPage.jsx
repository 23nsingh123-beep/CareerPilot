import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import authService from '../services/authService'
import { useAuth } from '../context/AuthContext'

/* ─────────────────────────────────────────────────────
   Google Logo SVG — same component as LoginPage
───────────────────────────────────────────────────── */
function GoogleLogo() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  )
}

/* ─────────────────────────────────────────────────────
   SignUpPage — visually consistent with LoginPage
───────────────────────────────────────────────────── */
function SignUpPage() {
  const navigate = useNavigate()

  const [role, setRole] = useState('student')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [terms, setTerms] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [error, setError] = useState(null)
  const { setCurrentUser, baseDummyData } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const data = await authService.register({ name, email, password, role })
      const userRole = data.user?.role
      if (setCurrentUser) setCurrentUser({ ...baseDummyData, ...data.user })
      if (userRole === 'student') navigate('/dashboard/student')
      else if (userRole === 'recruiter') navigate('/dashboard/recruiter')
      else if (userRole === 'admin') navigate('/admin')
      else navigate('/')
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-surface text-on-surface min-h-screen flex flex-col font-sans antialiased">

      {/* ── Header — identical to LoginPage ──────────────────────── */}
      <header className="w-full h-20 flex items-center justify-between px-6 md:px-12 max-w-container-max mx-auto shrink-0">
        <Link to="/" className="flex items-center gap-sm px-sm">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-on-primary">
            <span
              className="material-symbols-outlined"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              flight_takeoff
            </span>
          </div>
          <div>
            <h1 className="font-headline-md text-headline-md font-bold text-primary">CareerPilot</h1>
            <p className="font-label-sm text-label-sm text-on-surface-variant">Student Professional Tool</p>
          </div>
        </Link>
        <div className="hidden md:flex items-center gap-2">
          <span className="font-body-sm text-on-surface-variant">Already have an account?</span>
          <Link to="/login" className="font-label-md text-primary font-bold hover:underline">
            Login
          </Link>
        </div>
      </header>

      {/* ── Main Content ─────────────────────────────────────────── */}
      <main className="flex-grow flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-[580px]">

          {/* ── Sign Up Card ───────────────────────────────────────── */}
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-soft overflow-hidden">
            <div className="p-8 md:p-12">

              {/* Heading */}
              <div className="text-center mb-10">
                <h1 className="font-headline-lg text-headline-lg text-on-surface mb-3">
                  Welcome to CareerPilot
                </h1>
                <p className="font-body-md text-body-md text-on-surface-variant max-w-md mx-auto">
                  Start your AI-powered career journey.
                </p>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm font-medium">
                  {error}
                </div>
              )}

              {/* ── Registration Form ────────────────────────────────── */}
              <form onSubmit={handleSubmit} className="space-y-6">

                {/* Full Name */}
                <div className="space-y-2">
                  <label htmlFor="fullName" className="font-label-md text-on-surface-variant block ml-1">
                    Full Name
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    required
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={isSubmitting}
                    className="w-full px-4 py-3 rounded-lg border border-outline-variant bg-surface-container-lowest focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-on-surface font-body-md"
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label htmlFor="email" className="font-label-md text-on-surface-variant block ml-1">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    placeholder="john@university.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isSubmitting}
                    className="w-full px-4 py-3 rounded-lg border border-outline-variant bg-surface-container-lowest focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-on-surface font-body-md"
                  />
                </div>

                {/* Password + Confirm Password (side by side on desktop) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="password" className="font-label-md text-on-surface-variant block ml-1">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        required
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={isSubmitting}
                        className="w-full px-4 py-3 rounded-lg border border-outline-variant bg-surface-container-lowest focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-on-surface font-body-md pr-12"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-primary transition-colors flex items-center justify-center"
                      >
                        <span className="material-symbols-outlined text-[20px]">
                          {showPassword ? 'visibility_off' : 'visibility'}
                        </span>
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="confirmPassword" className="font-label-md text-on-surface-variant block ml-1">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <input
                        id="confirmPassword"
                        type={showConfirm ? 'text' : 'password'}
                        required
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        disabled={isSubmitting}
                        className="w-full px-4 py-3 rounded-lg border border-outline-variant bg-surface-container-lowest focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-on-surface font-body-md pr-12"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirm(!showConfirm)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-primary transition-colors flex items-center justify-center"
                      >
                        <span className="material-symbols-outlined text-[20px]">
                          {showConfirm ? 'visibility_off' : 'visibility'}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Role Selection Cards */}
                <div className="space-y-3 pt-2">
                  <span className="font-label-md text-on-surface-variant block ml-1">
                    Select your account type
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Student */}
                    <button
                      type="button"
                      onClick={() => setRole('student')}
                      className={`text-left p-4 rounded-xl border transition-all focus:outline-none ${
                        role === 'student'
                          ? 'border-primary bg-primary/5 shadow-sm'
                          : 'border-outline-variant hover:bg-surface-container-low'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className={`material-symbols-outlined ${role === 'student' ? 'text-primary' : 'text-on-surface-variant'}`}
                          style={{ fontVariationSettings: role === 'student' ? "'FILL' 1" : "'FILL' 0" }}
                        >
                          school
                        </span>
                        <span className="font-label-md font-bold text-on-surface">Student</span>
                      </div>
                      <p className="font-body-sm text-[12px] leading-tight text-on-surface-variant">
                        Upload your resume, receive AI feedback, discover jobs, and track applications.
                      </p>
                    </button>

                    {/* Recruiter */}
                    <button
                      type="button"
                      onClick={() => setRole('recruiter')}
                      className={`text-left p-4 rounded-xl border transition-all focus:outline-none ${
                        role === 'recruiter'
                          ? 'border-primary bg-primary/5 shadow-sm'
                          : 'border-outline-variant hover:bg-surface-container-low'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className={`material-symbols-outlined ${role === 'recruiter' ? 'text-primary' : 'text-on-surface-variant'}`}
                          style={{ fontVariationSettings: role === 'recruiter' ? "'FILL' 1" : "'FILL' 0" }}
                        >
                          work
                        </span>
                        <span className="font-label-md font-bold text-on-surface">Recruiter</span>
                      </div>
                      <p className="font-body-sm text-[12px] leading-tight text-on-surface-variant">
                        Post opportunities, manage applicants, and discover qualified candidates.
                      </p>
                    </button>
                  </div>
                </div>

                {/* Terms Checkbox */}
                <div className="flex items-start gap-3 py-2">
                  <input
                    id="terms"
                    type="checkbox"
                    required
                    checked={terms}
                    onChange={(e) => setTerms(e.target.checked)}
                    disabled={isSubmitting}
                    className="mt-1 w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary/20 transition-all"
                  />
                  <label htmlFor="terms" className="font-body-sm text-on-surface-variant leading-snug">
                    I agree to the{' '}
                    <a href="#" className="text-primary hover:underline">Terms of Service</a>
                    {' '}and{' '}
                    <a href="#" className="text-primary hover:underline">Privacy Policy</a>.
                  </label>
                </div>

                {/* Primary Action */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary text-on-primary py-4 rounded-lg font-label-md font-bold hover:bg-primary/90 active:scale-[0.98] transition-all shadow-soft disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <span className="w-4 h-4 border-2 border-on-primary/30 border-t-on-primary rounded-full animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    'Create Account'
                  )}
                </button>

                {/* Divider */}
                <div className="relative flex items-center py-2">
                  <div className="flex-grow border-t border-outline-variant/30" />
                  <span className="flex-shrink mx-4 font-label-sm text-outline uppercase">or</span>
                  <div className="flex-grow border-t border-outline-variant/30" />
                </div>

                {/* Google Auth */}
                <button
                  type="button"
                  className="w-full bg-surface-container-lowest text-on-surface py-3.5 rounded-lg border border-outline-variant font-label-md font-medium hover:bg-surface-container-low transition-all flex items-center justify-center gap-3"
                >
                  <GoogleLogo />
                  Continue with Google
                </button>
              </form>

              {/* Mobile Login Link */}
              <div className="mt-8 text-center md:hidden">
                <p className="font-body-sm text-on-surface-variant">
                  Already have an account?{' '}
                  <Link to="/login" className="text-primary font-bold hover:underline">
                    Log in
                  </Link>
                </p>
              </div>
            </div>
          </div>

          {/* ── Footer Links — identical to LoginPage ────────────── */}
          <div className="mt-12 text-center">
            <div className="flex items-center justify-center gap-6 mb-4">
              <a href="#" className="font-label-sm text-on-surface-variant hover:text-primary transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="font-label-sm text-on-surface-variant hover:text-primary transition-colors">
                Terms of Service
              </a>
              <a href="#" className="font-label-sm text-on-surface-variant hover:text-primary transition-colors">
                Contact Support
              </a>
            </div>
            <p className="font-body-sm text-on-surface-variant opacity-60">
              © 2024 CareerPilot AI. Empowering the next generation of professionals.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}

export default SignUpPage
