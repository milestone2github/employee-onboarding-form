import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useSearchParams } from 'react-router-dom';

const SignDeclined = () => {
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
            params: { status: 'declined', userId },
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true
          }
        );
        // localStorage.setItem('nda_completed', 'true');
        setStatusUpdated(true);
      } catch (err) {
        console.error('❌ Error reporting NDA declined:', err);
      }
    };
    
     updateStatus();
  }, [token]);

//  if (localStorage.getItem('nda_completed') === 'true') {
//       navigate('/', { replace: true });
//     } else {
//       updateStatus();
//     }
//   }, [token, navigate]);

  const handleBackHome = () => {
    navigate('/');
  };

  return (
    <div className="min-vh-100" style={{ backgroundColor: '#fceaea', paddingTop: '100px' }}>
      <div className="text-center">
        <h2 className="text-danger">❌ NDA Signing Declined</h2>
        <p>You declined to sign the NDA. Please contact HR if this was unintentional.</p>
        {statusUpdated ? (
          <button className="btn btn-outline-danger mt-3" onClick={handleBackHome}>
            Back to Home
          </button>
        ) : (
          <p className="text-muted">Updating status, please wait...</p>
        )}
      </div>
    </div>
  );
};

export default SignDeclined;
