import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import OtpVerify from './components/OtpVerify';
import OnboardingForm from './components/OnboardingForm';
import ProtectedRoute from './components/ProtectedRoute';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// 🔽 Import redirect pages
import SignSuccess from './components/zohoRedirects/SignSuccess';
import SignCompleted from './components/zohoRedirects/SignCompleted';
import SignDeclined from './components/zohoRedirects/SignDeclined';
import SignLater from './components/zohoRedirects/SignLater';

import NotFound from './pages/NotFound';

function App() {
  return (
    <div className="position-relative min-vh-100" style={{ backgroundColor: '#d4fcdc' }}>
      <img
        src="/mnivesh-logo.png"
        alt="mNivesh Logo"
        className="position-absolute"
        style={{ top: '10px', left: '20px', width: '160px', height: 'auto', zIndex: 999 }}
      />

      <Router>
        <Routes>
          <Route path="/" element={<OtpVerify />} />
          <Route path="/onboarding" element={<ProtectedRoute><OnboardingForm /></ProtectedRoute>} />
          
          {/* 🔽 Zoho redirect routes */}
          <Route path="/sign-success" element={<SignSuccess />} />
          <Route path="/sign-completed" element={<SignCompleted />} />
          <Route path="/sign-declined" element={<SignDeclined />} />
          <Route path="/sign-later" element={<SignLater />} />

          {/* 404 route + catch-all redirect */}
          <Route path="/404" element={<NotFound />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </Router>

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </div>
  );
}

export default App;
