import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser, useClerk } from '@clerk/clerk-react'

export default function Results() {
  const { user } = useUser()
  const { signOut } = useClerk()
  const navigate = useNavigate()
  const [result, setResult] = useState(null)
  const [role, setRole] = useState('')

  useEffect(() => {
    const stored = localStorage.getItem('careerlens_result')
    const storedRole = localStorage.getItem('careerlens_role')
    if (!stored) { navigate('/upload'); return }
    setResult(JSON.parse(stored))
    setRole(storedRole || 'Software Engineer')
  }, [])

  const handleLogout = async () => {
    await signOut()
    navigate('/')
  }

  const getScoreColor = (score) => {
    if (score >= 75) return '#10B981'
    if (score >= 50) return '#F59E0B'
    return '#EF4444'
  }

  const getScoreLabel = (score) => {
    if (score >= 75) return 'Strong Profile'
    if (score >= 50) return 'Good Profile'
    return 'Needs Improvement'
  }

  if (!result) return null

  return (
    <div style={styles.page}>
      {/* Navbar */}
      <nav style={styles.nav}>
        <div style={styles.navLogo} onClick={() => navigate('/dashboard')} role="button">
          CareerLens AI
        </div>
        <div style={styles.navRight}>
          <span style={styles.userName}>
            {user?.firstName || user?.emailAddresses[0]?.emailAddress.split('@')[0]}
          </span>
          <button style={styles.logoutBtn} onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      <div style={styles.container}>
        <button style={styles.backBtn} onClick={() => navigate('/upload')}>
          ← Analyze Another Resume
        </button>

        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>Your Resume Analysis</h1>
            <p style={styles.subtitle}>Target Role: <strong>{role}</strong></p>
          </div>
        </div>

        {/* Score Card */}
        <div style={styles.scoreCard}>
          <div style={styles.scoreLeft}>
            <div style={styles.scoreCircle}>
              <svg viewBox="0 0 120 120" width="120" height="120">
                <circle cx="60" cy="60" r="52" fill="none" stroke="#F3F4F6" strokeWidth="10"/>
                <circle
                  cx="60" cy="60" r="52" fill="none"
                  stroke={getScoreColor(result.overall_score)}
                  strokeWidth="10"
                  strokeDasharray={`${(result.overall_score / 100) * 327} 327`}
                  strokeLinecap="round"
                  transform="rotate(-90 60 60)"
                />
                <text x="60" y="55" textAnchor="middle" fontSize="26" fontWeight="800" fill={getScoreColor(result.overall_score)} fontFamily="Syne, sans-serif">
                  {result.overall_score}
                </text>
                <text x="60" y="73" textAnchor="middle" fontSize="12" fill="#9CA3AF" fontFamily="DM Sans, sans-serif">
                  / 100
                </text>
              </svg>
            </div>
            <div style={styles.scoreLabel}>
              <div style={{ ...styles.scoreBadge, background: getScoreColor(result.overall_score) + '18', color: getScoreColor(result.overall_score) }}>
                {getScoreLabel(result.overall_score)}
              </div>
            </div>
          </div>
          <div style={styles.scoreSummary}>
            <h2 style={styles.summaryTitle}>Overall Summary</h2>
            <p style={styles.summaryText}>{result.summary}</p>
          </div>
        </div>

        {/* Grid Cards */}
        <div style={styles.grid}>
          {/* Strengths */}
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <span style={styles.cardIcon}>✅</span>
              <h3 style={styles.cardTitle}>Strengths</h3>
            </div>
            <ul style={styles.list}>
              {result.strengths?.map((s, i) => (
                <li key={i} style={styles.listItem}>
                  <span style={{ ...styles.dot, background: '#10B981' }} />
                  {s}
                </li>
              ))}
            </ul>
          </div>

          {/* Weaknesses */}
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <span style={styles.cardIcon}>⚠️</span>
              <h3 style={styles.cardTitle}>Areas to Improve</h3>
            </div>
            <ul style={styles.list}>
              {result.weaknesses?.map((w, i) => (
                <li key={i} style={styles.listItem}>
                  <span style={{ ...styles.dot, background: '#F59E0B' }} />
                  {w}
                </li>
              ))}
            </ul>
          </div>

          {/* Missing Skills */}
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <span style={styles.cardIcon}>🎯</span>
              <h3 style={styles.cardTitle}>Missing Skills</h3>
            </div>
            <div style={styles.tagGrid}>
              {result.missing_skills?.map((s, i) => (
                <span key={i} style={styles.tag}>{s}</span>
              ))}
            </div>
          </div>

          {/* Career Paths */}
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <span style={styles.cardIcon}>🚀</span>
              <h3 style={styles.cardTitle}>Career Paths</h3>
            </div>
            <ul style={styles.list}>
              {result.career_paths?.map((c, i) => (
                <li key={i} style={styles.listItem}>
                  <span style={{ ...styles.dot, background: '#6C63FF' }} />
                  {c}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Interview Tips */}
        <div style={styles.tipsCard}>
          <div style={styles.cardHeader}>
            <span style={styles.cardIcon}>💬</span>
            <h3 style={styles.cardTitle}>Interview Tips</h3>
          </div>
          <div style={styles.tipsGrid}>
            {result.interview_tips?.map((t, i) => (
              <div key={i} style={styles.tipItem}>
                <span style={styles.tipNum}>0{i + 1}</span>
                <p style={styles.tipText}>{t}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Analyze Again */}
        <div style={styles.bottomActions}>
          <button style={styles.analyzeAgainBtn} onClick={() => navigate('/upload')}>
            Analyze Another Resume →
          </button>
          <button style={styles.dashboardBtn} onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  )
}

const styles = {
  page: { minHeight: '100vh', background: 'var(--bg)' },
  nav: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '20px 48px', background: '#fff', borderBottom: '1px solid var(--border)',
    position: 'sticky', top: 0, zIndex: 100,
  },
  navLogo: { fontFamily: 'Syne, sans-serif', fontSize: '20px', fontWeight: '800', color: '#6C63FF', cursor: 'pointer' },
  navRight: { display: 'flex', alignItems: 'center', gap: '20px' },
  userName: { fontSize: '15px', color: 'var(--muted)' },
  logoutBtn: { background: 'transparent', border: '1.5px solid var(--border)', borderRadius: '10px', padding: '8px 20px', fontSize: '14px', color: 'var(--muted)' },
  container: { maxWidth: '900px', margin: '0 auto', padding: '48px 24px', display: 'flex', flexDirection: 'column', gap: '28px' },
  backBtn: { background: 'transparent', border: 'none', color: 'var(--muted)', fontSize: '14px', padding: 0, cursor: 'pointer', width: 'fit-content' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' },
  title: { fontSize: '36px', fontWeight: '800', color: 'var(--text)', letterSpacing: '-0.5px' },
  subtitle: { fontSize: '16px', color: 'var(--muted)', marginTop: '6px' },
  scoreCard: {
    background: '#fff', borderRadius: '20px', padding: '36px',
    border: '1px solid var(--border)', display: 'flex', gap: '36px', alignItems: 'center',
    boxShadow: 'var(--shadow)',
  },
  scoreLeft: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' },
  scoreCircle: {},
  scoreLabel: {},
  scoreBadge: { padding: '6px 16px', borderRadius: '100px', fontSize: '13px', fontWeight: '600' },
  scoreSummary: { flex: 1 },
  summaryTitle: { fontSize: '20px', fontWeight: '700', marginBottom: '12px' },
  summaryText: { fontSize: '15px', color: 'var(--muted)', lineHeight: '1.7' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' },
  card: {
    background: '#fff', borderRadius: '20px', padding: '28px',
    border: '1px solid var(--border)', boxShadow: 'var(--shadow)', display: 'flex', flexDirection: 'column', gap: '18px',
  },
  cardHeader: { display: 'flex', alignItems: 'center', gap: '10px' },
  cardIcon: { fontSize: '20px' },
  cardTitle: { fontFamily: 'Syne, sans-serif', fontSize: '18px', fontWeight: '700' },
  list: { listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' },
  listItem: { display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '14px', color: 'var(--muted)', lineHeight: '1.5' },
  dot: { width: '8px', height: '8px', borderRadius: '50%', flexShrink: 0, marginTop: '5px' },
  tagGrid: { display: 'flex', flexWrap: 'wrap', gap: '8px' },
  tag: {
    background: 'rgba(108,99,255,0.08)', color: '#6C63FF',
    border: '1px solid rgba(108,99,255,0.2)', borderRadius: '8px',
    padding: '6px 14px', fontSize: '13px', fontWeight: '500',
  },
  tipsCard: {
    background: 'linear-gradient(135deg, #0D0D0D 0%, #1a1a2e 100%)',
    borderRadius: '20px', padding: '36px', display: 'flex', flexDirection: 'column', gap: '24px',
  },
  tipsGrid: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' },
  tipItem: { display: 'flex', flexDirection: 'column', gap: '8px' },
  tipNum: { fontFamily: 'Syne, sans-serif', fontSize: '28px', fontWeight: '800', color: 'rgba(108,99,255,0.4)' },
  tipText: { fontSize: '14px', color: 'rgba(255,255,255,0.75)', lineHeight: '1.6' },
  bottomActions: { display: 'flex', gap: '16px', paddingBottom: '40px' },
  analyzeAgainBtn: {
    background: '#6C63FF', color: '#fff', borderRadius: '14px',
    padding: '16px 32px', fontSize: '16px', fontWeight: '600', border: 'none',
  },
  dashboardBtn: {
    background: '#fff', color: 'var(--muted)', borderRadius: '14px',
    padding: '16px 32px', fontSize: '16px', border: '1.5px solid var(--border)',
  },
}