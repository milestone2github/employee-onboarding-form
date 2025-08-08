import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useSearchParams } from 'react-router-dom';

const SignLater = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [statusUpdated, setStatusUpdated] = useState(false);

  const [searchParams] = useSearchParams();
const userId = searchParams.get('userId');

  useEffect(() => {
    const updateStatus = async () => {
      try {
        await axios.get(
          `${process.env.REACT_APP_NDA_API_HOST}/api/onboarding/ndaSignStatus`,
          {
            params: { status: 'later', userId },
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true
          }
        );
        // localStorage.setItem('nda_completed', 'true');
        setStatusUpdated(true);
      } catch (err) {
        console.error('❌ Error reporting NDA later:', err);
      }
    };
//  if (localStorage.getItem('nda_completed') === 'true') {
//       navigate('/', { replace: true });
//     } else {
//       updateStatus();
//     }
//   }, [token, navigate]);
updateStatus();
  // eslint-disable-next-line
  }, [token]);

  const handleBackHome = () => {
    navigate('/');
  };

  return (
    <div className="min-vh-100" style={{ backgroundColor: '#fff3cd', paddingTop: '100px' }}>
      <div className="text-center">
        <h2 className="text-warning">⏳ NDA Signing Deferred</h2>
        <p>You chose to sign the NDA later. Please ensure to complete it soon.</p>
        {statusUpdated ? (
          <button className="btn btn-outline-warning mt-3" onClick={handleBackHome}>
            Back to Home
          </button>
        ) : (
          <p className="text-muted">Updating status, please wait...</p>
        )}
      </div>
    </div>
  );
};

export default SignLater;
