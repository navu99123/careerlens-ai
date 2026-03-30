import { SignIn, SignUp } from '@clerk/clerk-react'
import { useState } from 'react'

export default function LandingPage() {
  const [showSignUp, setShowSignUp] = useState(false)

  return (
    <div style={styles.page}>
      {/* Left Side */}
      <div style={styles.left}>
        <div style={styles.logo}>CareerLens AI</div>

        <div style={styles.heroText}>
          <h1 style={styles.heading}>
            Land your <span style={styles.highlight}>dream job</span><br />
            with AI-powered<br />resume insights
          </h1>
          <p style={styles.subtext}>
            Upload your resume, pick your target role, and get instant AI feedback —
            strengths, skill gaps, career paths & interview tips tailored just for you.
          </p>
        </div>

        <div style={styles.features}>
          {[
            { icon: '📄', text: 'Resume Analysis in seconds' },
            { icon: '🎯', text: 'Role-specific skill gap detection' },
            { icon: '🚀', text: 'Personalised career path guidance' },
            { icon: '💬', text: 'Interview tips just for you' },
          ].map((f, i) => (
            <div key={i} style={styles.featureItem}>
              <span style={styles.featureIcon}>{f.icon}</span>
              <span style={styles.featureText}>{f.text}</span>
            </div>
          ))}
        </div>

        <div style={styles.badge}>
          Powered by Google Gemini AI
        </div>
      </div>

      {/* Right Side — Auth */}
      <div style={styles.right}>
        <div style={styles.authBox}>
          <div style={styles.authToggle}>
            <button
              style={showSignUp ? styles.toggleBtn : styles.toggleBtnActive}
              onClick={() => setShowSignUp(false)}
            >
              Sign In
            </button>
            <button
              style={showSignUp ? styles.toggleBtnActive : styles.toggleBtn}
              onClick={() => setShowSignUp(true)}
            >
              Sign Up
            </button>
          </div>

          <div style={styles.clerkWrapper}>
            {showSignUp ? (
              <SignUp
                routing="hash"
                afterSignUpUrl="/dashboard"
                appearance={{
                  elements: {
                    rootBox: { width: '100%' },
                    card: { boxShadow: 'none', background: 'transparent', padding: 0 },
                    headerTitle: { fontFamily: 'Syne, sans-serif', fontSize: '20px' },
                    formButtonPrimary: {
                      background: '#6C63FF',
                      fontFamily: 'DM Sans, sans-serif',
                      borderRadius: '12px',
                      fontSize: '15px',
                    },
                    footerActionLink: { color: '#6C63FF' },
                  }
                }}
              />
            ) : (
              <SignIn
                routing="hash"
                afterSignInUrl="/dashboard"
                appearance={{
                  elements: {
                    rootBox: { width: '100%' },
                    card: { boxShadow: 'none', background: 'transparent', padding: 0 },
                    headerTitle: { fontFamily: 'Syne, sans-serif', fontSize: '20px' },
                    formButtonPrimary: {
                      background: '#6C63FF',
                      fontFamily: 'DM Sans, sans-serif',
                      borderRadius: '12px',
                      fontSize: '15px',
                    },
                    footerActionLink: { color: '#6C63FF' },
                  }
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

const styles = {
  page: {
    display: 'flex',
    minHeight: '100vh',
    background: 'var(--bg)',
  },
  left: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: '60px',
    background: 'linear-gradient(135deg, #0D0D0D 0%, #1a1a2e 100%)',
    color: '#fff',
    gap: '36px',
  },
  logo: {
    fontFamily: 'Syne, sans-serif',
    fontSize: '22px',
    fontWeight: '800',
    letterSpacing: '-0.5px',
    color: '#6C63FF',
  },
  heroText: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  heading: {
    fontSize: '48px',
    fontWeight: '800',
    lineHeight: '1.15',
    color: '#fff',
    letterSpacing: '-1px',
  },
  highlight: {
    color: '#6C63FF',
  },
  subtext: {
    fontSize: '16px',
    lineHeight: '1.7',
    color: 'rgba(255,255,255,0.6)',
    maxWidth: '440px',
  },
  features: {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
  },
  featureItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    background: 'rgba(255,255,255,0.05)',
    borderRadius: '12px',
    padding: '12px 18px',
    border: '1px solid rgba(255,255,255,0.08)',
  },
  featureIcon: {
    fontSize: '20px',
  },
  featureText: {
    fontSize: '15px',
    color: 'rgba(255,255,255,0.85)',
  },
  badge: {
    display: 'inline-block',
    background: 'rgba(108,99,255,0.15)',
    border: '1px solid rgba(108,99,255,0.4)',
    color: '#a09bf8',
    padding: '8px 18px',
    borderRadius: '100px',
    fontSize: '13px',
    width: 'fit-content',
  },
  right: {
    width: '520px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px',
    background: '#fff',
  },
  authBox: {
    width: '100%',
    maxWidth: '420px',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  authToggle: {
    display: 'flex',
    background: '#F4F4F8',
    borderRadius: '12px',
    padding: '4px',
    gap: '4px',
  },
  toggleBtn: {
    flex: 1,
    padding: '10px',
    borderRadius: '10px',
    background: 'transparent',
    color: '#6B7280',
    fontSize: '15px',
    fontWeight: '500',
    fontFamily: 'DM Sans, sans-serif',
  },
  toggleBtnActive: {
    flex: 1,
    padding: '10px',
    borderRadius: '10px',
    background: '#fff',
    color: '#6C63FF',
    fontSize: '15px',
    fontWeight: '600',
    fontFamily: 'DM Sans, sans-serif',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  },
  clerkWrapper: {
    width: '100%',
  },
}