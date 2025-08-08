import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useSearchParams } from 'react-router-dom';

const SignCompleted = () => {
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
            params: { status: 'completed', userId },
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true
          }
        );
        // localStorage.setItem('nda_completed', 'true');
        setStatusUpdated(true);
      } catch (err) {
        console.error('❌ Error reporting NDA completion:', err);
      }
    };

     updateStatus();
     // eslint-disable-next-line
  }, [token]);

// if (localStorage.getItem('nda_completed') === 'true') {
//       navigate('/', { replace: true });
//     } else {
//       updateStatus();
//     }
//   }, [token, navigate]);

  const handleFinish = () => {
    navigate('/', { replace: true });
  };

  return (
    <div className="min-vh-100" style={{ backgroundColor: '#d4fcdc', paddingTop: '100px' }}>
      <div className="text-center">
        <h2 className="text-success">✅ NDA Signing Completed</h2>
        <p>Your NDA signing process is fully complete.</p>
        {statusUpdated ? (
          <button className="btn btn-primary mt-3" onClick={handleFinish}>
            Finish
          </button>
        ) : (
          <p className="text-muted">Updating status, please wait...</p>
        )}
      </div>
    </div>
  );
};

export default SignCompleted;
