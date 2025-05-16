// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import OtpVerify from './components/OtpVerify';
import OnboardingForm from './components/OnboardingForm';
import ProtectedRoute from './components/ProtectedRoute';

function App() {

  return (
    <div className="position-relative min-vh-100" style={{ backgroundColor: '#d4fcdc' }}>
      <img src="/mnivesh-logo.png" alt="mNivesh Logo" className="position-absolute"
        style={{top: '10px', left: '20px',width: '160px',height: 'auto',zIndex: 999,
        }} />

      <Router>
        <Routes>
          <Route path="/" element={<OtpVerify />} />
          <Route path="/onboarding" element={ <ProtectedRoute> <OnboardingForm /> </ProtectedRoute> }/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
