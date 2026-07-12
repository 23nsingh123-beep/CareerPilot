import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import authService from '../services/authService'
import { useAuth } from '../context/AuthContext'

/* ─────────────────────────────────────────────────────
   Google Logo SVG — same component as SignUpPage
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
   LoginPage — visually consistent with SignUpPage
───────────────────────────────────────────────────── */
function LoginPage() {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('student') // Added role state
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [error, setError] = useState(null)
  const { setCurrentUser, baseDummyData } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const data = await authService.login(email, password)
      const actualRole = data.user?.role
      
      if (setCurrentUser) setCurrentUser({ ...baseDummyData, ...data.user })
      
      // Enforce actual role for routing, optionally show mismatch message if they picked wrong
      if (actualRole === 'admin') {
        navigate('/admin')
      } else if (actualRole === 'recruiter') {
        if (role === 'admin') alert('Logged in as Recruiter. Admin access denied.');
        navigate('/dashboard/recruiter')
      } else {
        if (role === 'admin' || role === 'recruiter') alert('Logged in as Student.');
        navigate('/dashboard/student')
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please check your credentials.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-surface text-on-surface min-h-screen flex flex-col font-sans antialiased">

      {/* ── Header — matches Stitch login & Sign Up branding ──────── */}
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
          <span className="font-body-sm text-on-surface-variant">Don't have an account?</span>
          <Link to="/signup" className="font-label-md text-primary font-bold hover:underline">
            Sign Up
          </Link>
        </div>
      </header>

      {/* ── Main Content ─────────────────────────────────────────── */}
      <main className="flex-grow flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-[580px]">

          {/* ── Login Card ─────────────────────────────────────────── */}
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-soft overflow-hidden">
            <div className="p-8 md:p-12">

              {/* Heading */}
              <div className="text-center mb-10">
                <h1 className="font-headline-lg text-headline-lg text-on-surface mb-3">
                  Welcome Back
                </h1>
                <p className="font-body-md text-body-md text-on-surface-variant max-w-md mx-auto">
                  Sign in to continue your AI-powered career journey.
                </p>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm font-medium">
                  {error}
                </div>
              )}

              {/* ── Login Form ───────────────────────────────────────── */}
              <form onSubmit={handleSubmit} className="space-y-6">

                {/* Role Selection Cards */}
                <div className="space-y-3">
                  <span className="font-label-md text-on-surface-variant block ml-1">
                    Login as
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Student */}
                    <button
                      type="button"
                      onClick={() => setRole('student')}
                      className={`text-left p-3 rounded-xl border transition-all focus:outline-none flex flex-col items-center justify-center ${
                        role === 'student'
                          ? 'border-primary bg-primary/5 shadow-sm'
                          : 'border-outline-variant hover:bg-surface-container-low'
                      }`}
                    >
                      <span
                        className={`material-symbols-outlined mb-1 ${role === 'student' ? 'text-primary' : 'text-on-surface-variant'}`}
                        style={{ fontVariationSettings: role === 'student' ? "'FILL' 1" : "'FILL' 0" }}
                      >
                        school
                      </span>
                      <span className="font-label-md font-bold text-on-surface">Student</span>
                    </button>

                    {/* Recruiter */}
                    <button
                      type="button"
                      onClick={() => setRole('recruiter')}
                      className={`text-left p-3 rounded-xl border transition-all focus:outline-none flex flex-col items-center justify-center ${
                        role === 'recruiter'
                          ? 'border-primary bg-primary/5 shadow-sm'
                          : 'border-outline-variant hover:bg-surface-container-low'
                      }`}
                    >
                      <span
                        className={`material-symbols-outlined mb-1 ${role === 'recruiter' ? 'text-primary' : 'text-on-surface-variant'}`}
                        style={{ fontVariationSettings: role === 'recruiter' ? "'FILL' 1" : "'FILL' 0" }}
                      >
                        work
                      </span>
                      <span className="font-label-md font-bold text-on-surface">Recruiter</span>
                    </button>

                    {/* Admin */}
                    <button
                      type="button"
                      onClick={() => setRole('admin')}
                      className={`text-left p-3 rounded-xl border transition-all focus:outline-none flex flex-col items-center justify-center ${
                        role === 'admin'
                          ? 'border-primary bg-primary/5 shadow-sm'
                          : 'border-outline-variant hover:bg-surface-container-low'
                      }`}
                    >
                      <span
                        className={`material-symbols-outlined mb-1 ${role === 'admin' ? 'text-primary' : 'text-on-surface-variant'}`}
                        style={{ fontVariationSettings: role === 'admin' ? "'FILL' 1" : "'FILL' 0" }}
                      >
                        admin_panel_settings
                      </span>
                      <span className="font-label-md font-bold text-on-surface">Admin</span>
                    </button>
                  </div>
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

                {/* Password */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center px-1">
                    <label htmlFor="password" className="font-label-md text-on-surface-variant">
                      Password
                    </label>
                    <a href="#" className="font-label-sm text-primary font-semibold hover:underline">
                      Forgot Password?
                    </a>
                  </div>
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

                {/* Remember Me */}
                <div className="flex items-center gap-3 py-1">
                  <input
                    id="remember"
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    disabled={isSubmitting}
                    className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary/20 transition-all cursor-pointer"
                  />
                  <label htmlFor="remember" className="font-body-sm text-on-surface-variant cursor-pointer select-none">
                    Remember me
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
                      Logging in...
                    </>
                  ) : (
                    'Login'
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

              {/* Mobile Signup Link */}
              <div className="mt-8 text-center md:hidden">
                <p className="font-body-sm text-on-surface-variant">
                  Don't have an account?{' '}
                  <Link to="/signup" className="text-primary font-bold hover:underline">
                    Sign up
                  </Link>
                </p>
              </div>
            </div>
          </div>

          {/* ── Footer Links ─────────────────────────────────────── */}
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

export default LoginPage
