import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SignDeclined = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleBackHome = async () => {
    try {
      await axios.post(
        `${process.env.REACT_APP_NDA_API_HOST}/api/onboarding/ndaSignStatus`,
        { status: 'declined' },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true
        }
      );
      navigate('/');
    } catch (err) {
      console.error('❌ Error reporting NDA decline:', err);
    }
  };

  return (
    <div className="min-vh-100" style={{ backgroundColor: '#fceaea', paddingTop: '100px' }}>
      <div className="text-center">
        <h2 className="text-danger">❌ NDA Signing Declined</h2>
        <p>You declined to sign the NDA. Please contact HR if this was unintentional.</p>
        <button className="btn btn-outline-danger mt-3" onClick={handleBackHome}>
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default SignDeclined;
