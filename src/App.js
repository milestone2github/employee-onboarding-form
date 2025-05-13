import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import OtpVerify from './components/OtpVerify';
import OnboardingForm from './components/OnboardingForm';
import './App.css';

function App() {
  return (
    <div className="position-relative min-vh-100" style={{ backgroundColor: '#d4fcdc' }}>
      {/* ✅ Logo fixed in top-right */}
      <img
        src="/mnivesh-logo.png"
        alt="mNivesh Logo"
        className="position-absolute"
        style={{
          top: '1px',
          right: '10px',
          width: '160px',
          height: 'auto',
          zIndex: 999
        }}
      />

      <Router>
        <Routes>
          <Route path="/" element={<OtpVerify />} />
          <Route path="/onboarding" element={<OnboardingForm />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
