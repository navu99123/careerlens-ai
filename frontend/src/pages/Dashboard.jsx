import { useUser, useClerk } from '@clerk/clerk-react'
import { useNavigate } from 'react-router-dom'

export default function Dashboard() {
  const { user } = useUser()
  const { signOut } = useClerk()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await signOut()
    navigate('/')
  }

  return (
    <div style={styles.page}>
      {/* Navbar */}
      <nav style={styles.nav}>
        <div style={styles.navLogo}>CareerLens AI</div>
        <div style={styles.navRight}>
          <span style={styles.userName}>
            Hey, {user?.firstName || user?.emailAddresses[0]?.emailAddress.split('@')[0]} 👋
          </span>
          <button style={styles.logoutBtn} onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <div style={styles.hero}>
        <div style={styles.heroBadge}>AI-Powered Career Guidance</div>
        <h1 style={styles.heroTitle}>
          Ready to level up<br />your career?
        </h1>
        <p style={styles.heroSub}>
          Upload your resume and get instant AI-powered feedback on your strengths,
          skill gaps, and the best career paths for you.
        </p>
        <button style={styles.ctaBtn} onClick={() => navigate('/upload')}>
          Analyze My Resume →
        </button>
      </div>

      {/* Stats Cards */}
      <div style={styles.statsRow}>
        {[
          { label: 'Resume Analysis', value: 'Instant', icon: '⚡' },
          { label: 'Skills Detected', value: 'AI-Powered', icon: '🎯' },
          { label: 'Career Paths', value: 'Personalised', icon: '🚀' },
          { label: 'Interview Tips', value: 'Tailored', icon: '💬' },
        ].map((s, i) => (
          <div key={i} style={styles.statCard}>
            <div style={styles.statIcon}>{s.icon}</div>
            <div style={styles.statValue}>{s.value}</div>
            <div style={styles.statLabel}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* How it works */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>How it works</h2>
        <div style={styles.stepsRow}>
          {[
            { step: '01', title: 'Upload Resume', desc: 'Upload your resume as a PDF file' },
            { step: '02', title: 'Pick Your Role', desc: 'Select the job role you are targeting' },
            { step: '03', title: 'Get AI Insights', desc: 'Gemini AI analyses your resume instantly' },
            { step: '04', title: 'Land the Job', desc: 'Use the feedback to improve and apply' },
          ].map((s, i) => (
            <div key={i} style={styles.stepCard}>
              <div style={styles.stepNum}>{s.step}</div>
              <h3 style={styles.stepTitle}>{s.title}</h3>
              <p style={styles.stepDesc}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Bottom */}
      <div style={styles.ctaBottom}>
        <h2 style={styles.ctaTitle}>Let's get started!</h2>
        <p style={styles.ctaSub}>Upload your resume now and get your personalized career report in seconds.</p>
        <button style={styles.ctaBtn} onClick={() => navigate('/upload')}>
          Upload Resume Now →
        </button>
      </div>
    </div>
  )
}

const styles = {
  page: {
    minHeight: '100vh',
    background: 'var(--bg)',
    display: 'flex',
    flexDirection: 'column',
  },
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 48px',
    background: '#fff',
    borderBottom: '1px solid var(--border)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  navLogo: {
    fontFamily: 'Syne, sans-serif',
    fontSize: '20px',
    fontWeight: '800',
    color: '#6C63FF',
  },
  navRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
  },
  userName: {
    fontSize: '15px',
    color: 'var(--muted)',
  },
  logoutBtn: {
    background: 'transparent',
    border: '1.5px solid var(--border)',
    borderRadius: '10px',
    padding: '8px 20px',
    fontSize: '14px',
    color: 'var(--muted)',
    transition: 'all 0.2s',
  },
  hero: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    padding: '80px 48px 60px',
    background: 'linear-gradient(135deg, #0D0D0D 0%, #1a1a2e 100%)',
    gap: '20px',
  },
  heroBadge: {
    background: 'rgba(108,99,255,0.15)',
    border: '1px solid rgba(108,99,255,0.4)',
    color: '#a09bf8',
    padding: '6px 18px',
    borderRadius: '100px',
    fontSize: '13px',
  },
  heroTitle: {
    fontSize: '52px',
    fontWeight: '800',
    color: '#fff',
    lineHeight: '1.15',
    letterSpacing: '-1px',
  },
  heroSub: {
    fontSize: '16px',
    color: 'rgba(255,255,255,0.6)',
    maxWidth: '500px',
    lineHeight: '1.7',
  },
  ctaBtn: {
    background: '#6C63FF',
    color: '#fff',
    border: 'none',
    borderRadius: '14px',
    padding: '16px 36px',
    fontSize: '16px',
    fontWeight: '600',
    fontFamily: 'DM Sans, sans-serif',
    transition: 'background 0.2s, transform 0.1s',
    marginTop: '8px',
  },
  statsRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '20px',
    padding: '40px 48px',
  },
  statCard: {
    background: '#fff',
    borderRadius: '16px',
    padding: '28px 20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
    border: '1px solid var(--border)',
    boxShadow: 'var(--shadow)',
  },
  statIcon: {
    fontSize: '28px',
  },
  statValue: {
    fontFamily: 'Syne, sans-serif',
    fontSize: '18px',
    fontWeight: '700',
    color: '#6C63FF',
  },
  statLabel: {
    fontSize: '13px',
    color: 'var(--muted)',
    textAlign: 'center',
  },
  section: {
    padding: '20px 48px 60px',
  },
  sectionTitle: {
    fontSize: '28px',
    fontWeight: '700',
    marginBottom: '28px',
    color: 'var(--text)',
  },
  stepsRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '20px',
  },
  stepCard: {
    background: '#fff',
    borderRadius: '16px',
    padding: '28px 24px',
    border: '1px solid var(--border)',
    boxShadow: 'var(--shadow)',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  stepNum: {
    fontFamily: 'Syne, sans-serif',
    fontSize: '32px',
    fontWeight: '800',
    color: 'rgba(108,99,255,0.15)',
    lineHeight: '1',
  },
  stepTitle: {
    fontFamily: 'Syne, sans-serif',
    fontSize: '17px',
    fontWeight: '700',
    color: 'var(--text)',
  },
  stepDesc: {
    fontSize: '14px',
    color: 'var(--muted)',
    lineHeight: '1.6',
  },
  ctaBottom: {
    background: 'linear-gradient(135deg, #6C63FF 0%, #4F46E5 100%)',
    margin: '0 48px 60px',
    borderRadius: '24px',
    padding: '60px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '16px',
    textAlign: 'center',
  },
  ctaTitle: {
    fontSize: '36px',
    fontWeight: '800',
    color: '#fff',
  },
  ctaSub: {
    fontSize: '16px',
    color: 'rgba(255,255,255,0.75)',
    maxWidth: '440px',
    lineHeight: '1.6',
  },
}