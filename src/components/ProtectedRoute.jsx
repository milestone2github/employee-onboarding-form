import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';

const API = 'http://localhost:5001/api/onboarding';

const ProtectedRoute = ({ children }) => {
  const [authorized, setAuthorized] = useState(null)

  useEffect(() => {
    axios.get(`${API}/check-session`, { withCredentials: true })
      .then(() => setAuthorized(true))
      .catch(() => setAuthorized(false))
  }, [])

  if (authorized === null) return <div>Loading...</div>
  return authorized ? children : <Navigate to="/" replace />
}


export default ProtectedRoute;
