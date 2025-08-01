import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SignCompleted = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleFinish = async () => {
    try {
      await axios.post(
        `${process.env.REACT_APP_NDA_API_HOST}/api/onboarding/ndaSignStatus`,
        { status: 'success' },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true
        }
      );
      navigate('/');
    } catch (err) {
      console.error('❌ Error reporting NDA completion:', err);
    }
  };

  return (
    <div className="min-vh-100" style={{ backgroundColor: '#d4fcdc', paddingTop: '100px' }}>
      <div className="text-center">
        <h2 className="text-success">✅ NDA Signing Completed</h2>
        <p>Your NDA signing process is fully complete.</p>
        <button className="btn btn-primary mt-3" onClick={handleFinish}>
          Finish
        </button>
      </div>
    </div>
  );
};

export default SignCompleted;
