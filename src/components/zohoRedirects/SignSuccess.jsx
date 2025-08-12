import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useSearchParams, Navigate } from 'react-router-dom';

const SignSuccess = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [statusUpdated, setStatusUpdated] = useState(false);

  const [searchParams] = useSearchParams();
  const userId = searchParams.get('userId');

  const isValidObjectId = (id) => /^[a-f\d]{24}$/i.test(id);
  const invalidUserId = !userId || !isValidObjectId(userId);

  useEffect(() => {
    // 🔄 Replace current history entry (so Back won't go to onboarding)
    window.history.replaceState(null, '', window.location.href);

    // 🚫 Disable back navigation while on this page
    window.history.pushState(null, '', window.location.href);
    const blockBack = () => {
      window.history.go(1);
    };
    window.addEventListener('popstate', blockBack);

    return () => {
      window.removeEventListener('popstate', blockBack);
    };
  }, []);

  useEffect(() => {
    if (invalidUserId) return;

    const updateStatus = async () => {
      try {
        await axios.get(
          `${process.env.REACT_APP_API_URL}/api/onboarding/ndaSignStatus`,
          {
            params: { status: 'success', userId },
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );
        setStatusUpdated(true);
      } catch (err) {
        console.error('❌ Error reporting NDA success:', err);
      }
    };

    updateStatus();
  }, [token, userId, invalidUserId]);

  // ✅ This happens after hooks — safe for conditional rendering
  if (invalidUserId) {
    return <Navigate to="/404" replace />;
  }

  const handleFinish = () => {
    if (window.top !== window.self) {
      // ✅ Break out of iframe
      window.top.location.href = '/';
      // window.top.location.href = 'http://localhost:3000/';
    } else {
      // Normal navigation if not in iframe
      navigate('/', { replace: true });
    }
  };

  return (
    <div className="min-vh-100" style={{ backgroundColor: '#d4fcdc', paddingTop: '100px' }}>
      <div className="text-center">
        <h2 className="text-success">✅ Signing was successful!</h2>
        <p>Your NDA was signed successfully.</p>
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

export default SignSuccess;
