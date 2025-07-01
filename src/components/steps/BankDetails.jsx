import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';



const BankDetails = ({ data = {}, onChange }) => {
  const handleInput = (e) => onChange({ ...data, [e.target.name]: e.target.value });
const [ifscError, setIfscError] = useState('');
const [accountError, setAccountError] = useState('');


  const handleBlur = (e) => {
  const { name, value } = e.target;

  if (name === 'ifscCode') {
    const upper = value.toUpperCase();
    if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(upper)) {
      setIfscError('Invalid IFSC format. Example: HDFC0123456');
    } else {
      setIfscError('');
      onChange({ ...data, [name]: upper });
    }
  }

  if (name === 'accountNumber') {
    if (!/^\d{6,}$/.test(value)) {
      setAccountError('Account number must be at least 6 digits.');
    } else {
      setAccountError('');
    }
  }
};



  const [showCamera, setShowCamera] = useState(false);
  const webcamRef = useRef(null);

  const capturePhoto = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    fetch(imageSrc)
      .then(res => res.blob())
      .then(blob => {
        const file = new File([blob], 'bank-verification.jpg', { type: 'image/jpeg' });
        onChange({ ...data, bankVerificationDoc: file });
        setShowCamera(false);
      });
  };

  return (
    <>
      <h4 className="mb-4">🏦 Bank Details</h4>

      <div className="row">
        <div className="mb-3 col-md-6">
          <label className="form-label">Beneficiary Name</label>
          <input className="form-control" name="beneficiaryName" value={data.beneficiaryName || ''} onChange={handleInput} />
        </div>
        <div className="mb-3 col-md-6">
          <label className="form-label">Account Number</label>
         <input
  className={`form-control ${accountError ? 'is-invalid' : ''}`}
  name="accountNumber"
  value={data.accountNumber || ''}
  onChange={handleInput}
  onBlur={handleBlur}
  type="text"
  inputMode="numeric"
/>
{accountError && <div className="invalid-feedback">{accountError}</div>}

        </div>
      </div>

      <div className="row">
        <div className="mb-3 col-md-6">
          <label className="form-label">IFSC Code</label>
          <input
    className={`form-control ${ifscError ? 'is-invalid' : ''}`}
    name="ifscCode"
    value={data.ifscCode || ''}
    onChange={handleInput}
    onBlur={handleBlur}
  />
  {ifscError && <div className="invalid-feedback">{ifscError}</div>}
        </div>
        <div className="mb-3 col-md-6">
          <label className="form-label">Bank Name</label>
          <input className="form-control" name="bankName" value={data.bankName || ''} onChange={handleInput} />
        </div>
      </div>

      {/* ✅ Replacing input with file + camera */}
      <div className="mb-3">
        <label className="form-label">Bank Verification Document (jpg/jpeg/png)</label>
        <input
          type="file"
          className="form-control"
          accept="image/jpeg, image/png"
          onChange={(e) => onChange({ ...data, bankVerificationDoc: e.target.files[0] })}
        />
        <button type="button" className="btn btn-outline-primary mt-2" onClick={() => setShowCamera(true)}>
          Use Camera
        </button>

      {data.bankVerificationDoc instanceof File && (
  <img
    src={URL.createObjectURL(data.bankVerificationDoc)}
    alt="Bank Verification Preview"
    className="img-thumbnail mt-2"
    style={{ maxWidth: '200px' }}
  />
)}


  <div className="form-text mt-1" style={{ fontSize: '0.85rem', color: '#6c757d' }}>
    Name Printed Cheque image, Passbook (1st and last page), or Bank Statement
  </div>
      </div>

      {showCamera && (
        <div className="camera-modal bg-dark bg-opacity-75 position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ zIndex: 1050 }}>
          <div className="bg-white p-4 rounded shadow text-center position-relative" style={{ maxWidth: '400px', width: '100%' }}>
            <h5 className="mb-3">Capture Bank Verification</h5>
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              videoConstraints={{ facingMode: "user" }}
              style={{ width: '100%', borderRadius: '8px' }}
            />
            <div className="d-flex justify-content-between gap-2 mt-3">
              <button className="btn btn-success w-100" onClick={capturePhoto}>📸 Capture</button>
              <button className="btn btn-secondary w-100" onClick={() => setShowCamera(false)}>❌ Cancel</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BankDetails;
