import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { SignedIn, SignedOut } from '@clerk/clerk-react'
import LandingPage from './pages/LandingPage'
import Dashboard from './pages/Dashboard'
import UploadResume from './pages/UploadResume'
import Results from './pages/Results'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          <>
            <SignedOut><LandingPage /></SignedOut>
            <SignedIn><Navigate to="/dashboard" /></SignedIn>
          </>
        } />
        <Route path="/dashboard" element={
          <>
            <SignedIn><Dashboard /></SignedIn>
            <SignedOut><Navigate to="/" /></SignedOut>
          </>
        } />
        <Route path="/upload" element={
          <>
            <SignedIn><UploadResume /></SignedIn>
            <SignedOut><Navigate to="/" /></SignedOut>
          </>
        } />
        <Route path="/results" element={
          <>
            <SignedIn><Results /></SignedIn>
            <SignedOut><Navigate to="/" /></SignedOut>
          </>
        } />
      </Routes>
    </BrowserRouter>
  )
}

export default App