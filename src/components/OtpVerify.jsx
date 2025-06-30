import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API = `${process.env.REACT_APP_API_URL}/api/onboarding/otp`;

const OtpVerify = () => {
  const [contact, setContact] = useState('');
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' | 'error'
  const [otpSent, setOtpSent] = useState(false);
  const navigate = useNavigate();

  const sendOTP = async () => {
    try {
      const payload = { phone: contact };
      await axios.post(`${API}/send`, payload);
      setOtpSent(true);
      setMessage('✅ OTP sent successfully ✅');
      setMessageType('success');
    } catch (error) {
      setMessage(error.response?.data?.error || '❌ Failed to send OTP ❌');
      setMessageType('error');
    }
  };

  const verifyOTP = async (e) => {
    e.preventDefault();
    try {
      const payload = contact.includes('@') ? { email: contact, otp } : { phone: contact, otp };
      const response = await axios.post(`${API}/verify`, payload, { withCredentials: true, });
      localStorage.setItem('token', response.data.data.token);
      
      if (!response.data.data.otpVerified) {
        alert("OTP not verified. Redirecting to verification page")
        // navigate('/')
        return;
      }
      navigate('/onboarding');
    } catch (error) {
      setMessage(error.response?.data?.error || ' ❌ OTP verification failed ❌');
      setMessageType('error');
    }
  };


  return (
    <div className="min-vh-100 d-flex justify-content-center align-items-center" style={{ backgroundColor: '#d4fcdc' }}>
      <div className="card p-4 shadow-sm" style={{ width: '100%', maxWidth: '500px' }}>
        <h3 className="mb-4 text-center">🔐 Employee Onboarding Access</h3>
        <form onSubmit={verifyOTP}>

          <div className="mb-3">
            <label className="form-label">Phone</label>
            <input
              type="text"
              className="form-control"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              placeholder="e.g. 9876543210"
              required
            />
          </div>
          {!otpSent ? (
            <button type="button" className="btn btn-primary w-100" onClick={sendOTP}>
              📤 Send OTP
            </button>
          ) : (
            <>
              <div className="mb-3">
                <label className="form-label mt-3">Enter OTP</label>
                <input
                  type="text"
                  className="form-control"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter the 4-digit OTP"
                  required
                />
              </div>
              <button type="submit" className="btn btn-success w-100 mt-2">
                Verify & Proceed
              </button>
            </>
          )}

          {message && (
            <div
              className={`alert mt-4 mb-0 text-center  fw-semibold ${messageType === 'success' ? 'alert-success' : 'alert-danger'
                }`}
              role="alert"
            >
              {message}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default OtpVerify;
