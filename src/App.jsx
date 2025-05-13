// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import OtpVerify from './components/OtpVerify';
import OnboardingForm from './components/steps/OnboardingForm';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<OtpVerify />} />
        <Route path="/onboarding" element={<OnboardingForm />} />
      </Routes>
    </Router>
  );
}

export default App;
