import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser, useClerk } from '@clerk/clerk-react'

const ROLES = [
  'Software Engineer',
  'Full Stack Developer',
  'Frontend Developer',
  'Backend Developer',
  'Data Scientist',
  'Data Analyst',
  'Machine Learning Engineer',
  'DevOps Engineer',
  'UI/UX Designer',
  'Product Manager',
  'Cybersecurity Analyst',
  'Cloud Engineer',
]

export default function UploadResume() {
  const { user } = useUser()
  const { signOut } = useClerk()
  const navigate = useNavigate()
  const fileRef = useRef()

  const [file, setFile] = useState(null)
  const [role, setRole] = useState('Software Engineer')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [dragging, setDragging] = useState(false)

  const handleLogout = async () => {
    await signOut()
    navigate('/')
  }

  const handleFile = (f) => {
    if (f && f.type === 'application/pdf') {
      setFile(f)
      setError('')
    } else {
      setError('Please upload a PDF file only.')
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    const f = e.dataTransfer.files[0]
    handleFile(f)
  }

  const handleAnalyze = async () => {
    if (!file) { setError('Please select a resume PDF first.'); return }
    setLoading(true)
    setError('')

    const formData = new FormData()
    formData.append('resume', file)
    formData.append('role', role)

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/analyze`, {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Analysis failed')

      // Store result and navigate
      localStorage.setItem('careerlens_result', JSON.stringify(data))
      localStorage.setItem('careerlens_role', role)
      navigate('/results')
    } catch (err) {
      setError(err.message || 'Something went wrong. Make sure the backend is running.')
    } finally {
      setLoading(false)
    }
  }

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
        <button style={styles.backBtn} onClick={() => navigate('/dashboard')}>
          ← Back to Dashboard
        </button>

        <h1 style={styles.title}>Upload Your Resume</h1>
        <p style={styles.subtitle}>
          Upload your resume as a PDF and select your target job role to get AI-powered insights.
        </p>

        {/* Drop Zone */}
        <div
          style={{ ...styles.dropZone, ...(dragging ? styles.dropZoneActive : {}), ...(file ? styles.dropZoneDone : {}) }}
          onClick={() => fileRef.current.click()}
          onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
        >
          <input
            ref={fileRef}
            type="file"
            accept=".pdf"
            style={{ display: 'none' }}
            onChange={(e) => handleFile(e.target.files[0])}
          />
          {file ? (
            <>
              <div style={styles.fileIcon}>📄</div>
              <div style={styles.fileName}>{file.name}</div>
              <div style={styles.fileSize}>{(file.size / 1024).toFixed(1)} KB</div>
              <div style={styles.changeFile}>Click to change file</div>
            </>
          ) : (
            <>
              <div style={styles.uploadIcon}>☁️</div>
              <div style={styles.uploadText}>Drag & drop your resume here</div>
              <div style={styles.uploadSub}>or click to browse — PDF only</div>
            </>
          )}
        </div>

        {/* Role Selector */}
        <div style={styles.roleSection}>
          <label style={styles.label}>Target Job Role</label>
          <select
            style={styles.select}
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>

        {error && <div style={styles.error}>{error}</div>}

        <button
          style={{ ...styles.analyzeBtn, ...(loading ? styles.analyzeBtnLoading : {}) }}
          onClick={handleAnalyze}
          disabled={loading}
        >
          {loading ? (
            <span style={styles.loadingContent}>
              <span style={styles.spinner} /> Analyzing with Gemini AI...
            </span>
          ) : (
            'Analyze My Resume →'
          )}
        </button>

        {loading && (
          <p style={styles.loadingNote}>
            This usually takes 10–20 seconds. Please wait...
          </p>
        )}
      </div>
    </div>
  )
}

const styles = {
  page: {
    minHeight: '100vh',
    background: 'var(--bg)',
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
    cursor: 'pointer',
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
  },
  container: {
    maxWidth: '640px',
    margin: '0 auto',
    padding: '48px 24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  backBtn: {
    background: 'transparent',
    border: 'none',
    color: 'var(--muted)',
    fontSize: '14px',
    padding: 0,
    cursor: 'pointer',
    width: 'fit-content',
  },
  title: {
    fontSize: '36px',
    fontWeight: '800',
    color: 'var(--text)',
    letterSpacing: '-0.5px',
  },
  subtitle: {
    fontSize: '16px',
    color: 'var(--muted)',
    lineHeight: '1.6',
    marginTop: '-10px',
  },
  dropZone: {
    border: '2px dashed var(--border)',
    borderRadius: '20px',
    padding: '60px 40px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '10px',
    cursor: 'pointer',
    background: '#fff',
    transition: 'all 0.2s',
    textAlign: 'center',
  },
  dropZoneActive: {
    borderColor: '#6C63FF',
    background: 'rgba(108,99,255,0.04)',
  },
  dropZoneDone: {
    borderColor: '#10B981',
    background: 'rgba(16,185,129,0.04)',
  },
  uploadIcon: { fontSize: '40px' },
  uploadText: { fontSize: '18px', fontWeight: '600', color: 'var(--text)' },
  uploadSub: { fontSize: '14px', color: 'var(--muted)' },
  fileIcon: { fontSize: '40px' },
  fileName: { fontSize: '17px', fontWeight: '600', color: '#10B981' },
  fileSize: { fontSize: '13px', color: 'var(--muted)' },
  changeFile: { fontSize: '13px', color: '#6C63FF', marginTop: '4px' },
  roleSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  label: {
    fontSize: '15px',
    fontWeight: '600',
    color: 'var(--text)',
  },
  select: {
    padding: '14px 18px',
    borderRadius: '12px',
    border: '1.5px solid var(--border)',
    fontSize: '15px',
    background: '#fff',
    color: 'var(--text)',
    cursor: 'pointer',
  },
  error: {
    background: 'rgba(239,68,68,0.08)',
    border: '1px solid rgba(239,68,68,0.25)',
    borderRadius: '12px',
    padding: '14px 18px',
    color: '#EF4444',
    fontSize: '14px',
  },
  analyzeBtn: {
    background: '#6C63FF',
    color: '#fff',
    borderRadius: '14px',
    padding: '18px',
    fontSize: '17px',
    fontWeight: '700',
    border: 'none',
    transition: 'background 0.2s',
    width: '100%',
  },
  analyzeBtnLoading: {
    background: '#9991f5',
    cursor: 'not-allowed',
  },
  loadingContent: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
  },
  spinner: {
    display: 'inline-block',
    width: '18px',
    height: '18px',
    border: '2px solid rgba(255,255,255,0.3)',
    borderTopColor: '#fff',
    borderRadius: '50%',
    animation: 'spin 0.7s linear infinite',
  },
  loadingNote: {
    textAlign: 'center',
    fontSize: '14px',
    color: 'var(--muted)',
    marginTop: '-10px',
  },
}