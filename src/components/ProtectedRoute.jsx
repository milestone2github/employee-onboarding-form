import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';

const API = `${process.env.REACT_APP_API_URL}/api/onboarding`;

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
