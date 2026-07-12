import { FileText, Sparkles, Briefcase, ClipboardList, UserCheck, ShieldCheck } from 'lucide-react'

export const navLinks = [
  { label: 'Features', href: '#features' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Jobs', href: '#jobs' },
  { label: 'For Recruiters', href: '#recruiters' },
]

export const stats = [
  { value: '50K+', label: 'Resumes Analyzed' },
  { value: '92%', label: 'ATS Pass Rate' },
  { value: '10K+', label: 'Jobs & Internships' },
  { value: '3x', label: 'Faster Job Matches' },
]

export const features = [
  {
    icon: FileText,
    title: 'Resume Upload & Parsing',
    description: 'Upload your PDF or Word resume and let our parser instantly extract your skills, education, and experience for analysis.',
  },
  {
    icon: Sparkles,
    title: 'AI Resume Feedback',
    description: 'Receive section-by-section AI feedback on your resume — from formatting and keyword density to clarity and impact scores.',
  },
  {
    icon: Briefcase,
    title: 'Smart Job Matching',
    description: 'Get matched with jobs and internships that align with your skills and resume, ranked by compatibility percentage.',
  },
  {
    icon: ClipboardList,
    title: 'Application Tracking',
    description: 'Track every application in one dashboard — monitor status, deadlines, follow-ups, and outcomes all in one place.',
  },
  {
    icon: UserCheck,
    title: 'Recruiter Job Posting',
    description: 'Recruiters can post openings and instantly surface the most qualified student candidates ranked by resume match score.',
  },
  {
    icon: ShieldCheck,
    title: 'Admin Management',
    description: 'Admins get full oversight of users, job listings, applications, and platform analytics through a secure control panel.',
  },
]

export const steps = [
  {
    number: '01',
    title: 'Upload Your Resume',
    description: 'Drop your resume in PDF or Word format. Our parser extracts all key sections in seconds.',
  },
  {
    number: '02',
    title: 'Get AI Feedback',
    description: 'Receive a detailed resume score, ATS compatibility rating, skill gap analysis, and improvement suggestions.',
  },
  {
    number: '03',
    title: 'Discover Matched Jobs',
    description: 'Browse curated job and internship listings ranked by how closely they match your resume profile.',
  },
  {
    number: '04',
    title: 'Track Your Applications',
    description: 'Apply directly through CareerPilot and track every application, interview, and offer in your personal dashboard.',
  },
]

export const testimonials = [
  {
    quote: "I uploaded my resume and within minutes had a full AI breakdown of what was missing. Fixed it, reapplied, and landed two interview calls the same week.",
    author: "Priya Sharma",
    role: "Computer Science Student, IIT Delhi",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&h=120&q=80",
  },
  {
    quote: "The job matching is scarily accurate. Every listing it surfaced was relevant to my skills. I stopped wasting time on roles I'd never get.",
    author: "Marcus Webb",
    role: "Final Year Engineering Student",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80",
  },
  {
    quote: "As a recruiter, the candidate matching saved us hours of screening. We post a role and instantly see ranked applicants — it's a game changer.",
    author: "Elena Rostova",
    role: "Talent Acquisition, Horizon Tech",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&h=120&q=80",
  },
]

export const faqs = [
  {
    question: 'What file formats does CareerPilot accept for resume upload?',
    answer: 'CareerPilot currently supports PDF and DOCX (Microsoft Word) formats. We recommend PDF for best parsing accuracy.',
  },
  {
    question: 'How does the AI resume feedback work?',
    answer: 'Our AI analyzes your resume across multiple dimensions: ATS keyword compatibility, formatting clarity, section completeness, action verb strength, and quantifiable achievements. You receive a score and specific, actionable suggestions.',
  },
  {
    question: 'How are jobs matched to my resume?',
    answer: 'We extract skills, experience level, education, and keywords from your resume, then compare them against job requirements using semantic matching models. Each listing is assigned a match percentage so you can prioritize accordingly.',
  },
  {
    question: 'Is CareerPilot free for students?',
    answer: 'Yes — students can upload resumes, receive AI feedback, and browse matched jobs for free. Premium plans unlock unlimited applications, advanced analytics, and recruiter visibility.',
  },
]
