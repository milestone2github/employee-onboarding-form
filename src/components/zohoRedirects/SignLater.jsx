import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SignLater = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleBackHome = async () => {
    try {
      await axios.post(
        `${process.env.REACT_APP_NDA_API_HOST}/api/onboarding/ndaSignStatus`,
        { status: 'later' },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true
        }
      );
      navigate('/');
    } catch (err) {
      console.error('❌ Error reporting NDA later:', err);
    }
  };

  return (
    <div className="min-vh-100" style={{ backgroundColor: '#fff3cd', paddingTop: '100px' }}>
      <div className="text-center">
        <h2 className="text-warning">⏳ NDA Signing Deferred</h2>
        <p>You chose to sign the NDA later. Please ensure to complete it soon.</p>
        <button className="btn btn-outline-warning mt-3" onClick={handleBackHome}>
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default SignLater;
