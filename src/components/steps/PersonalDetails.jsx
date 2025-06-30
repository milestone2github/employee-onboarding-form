import React, { useState, useRef } from 'react';
import Webcam from 'react-webcam';



const PersonalDetails = ({ data = {}, onChange }) => {
  const [showCamera, setShowCamera] = useState(false);
  const webcamRef = useRef(null);
  const [panError, setPanError] = useState('');


  const handleInput = (e) => onChange({ ...data, [e.target.name]: e.target.value });

  const handleBlur = (e) => {
  const { name, value } = e.target;

  if (name === 'panNumber') {
    const upper = value.toUpperCase();
    if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(upper)) {
      setPanError('Invalid PAN format. Expected: ABCDE1234F');
    } else {
      setPanError('');
      onChange({ ...data, [name]: upper });
    }
  }
};



  const capturePhoto = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    fetch(imageSrc)
      .then(res => res.blob())
      .then(blob => {
        const file = new File([blob], 'photo.jpg', { type: 'image/jpeg' });
        onChange({ ...data, photo: file });
        setShowCamera(false);
      });
  };

  return (
    <>
      <h4 className="mb-4">👤 Personal Details</h4>

      {/* Basic Fields */}
      <div className="row">
        <div className="mb-3 col-md-6">
          <label className="form-label">First Name</label>
          <input className="form-control" name="firstName" value={data.firstName || ''} onChange={handleInput} />
        </div>
        <div className="mb-3 col-md-6">
          <label className="form-label">Last Name</label>
          <input className="form-control" name="lastName" value={data.lastName || ''} onChange={handleInput} />
        </div>
        <div className="mb-3 col-md-6">
          <label className="form-label">Email</label>
          <input className="form-control" name="email" type="email" value={data.email || ''} onChange={handleInput} />
        </div>
        <div className="mb-3 col-md-6">
          <label className="form-label">Phone</label>
          <input className="form-control" name="phone" value={data.phone || ''} onChange={handleInput} />
        </div>
      </div>

      {/* Parent Info */}
      <div className="row">
        <div className="mb-3 col-md-6">
          <label className="form-label">Father's Name</label>
          <input className="form-control" name="fatherName" value={data.fatherName || ''} onChange={handleInput} />
        </div>
        <div className="mb-3 col-md-6">
          <label className="form-label">Mother's Name</label>
          <input className="form-control" name="motherName" value={data.motherName || ''} onChange={handleInput} />
        </div>
      </div>

      {/* PAN, DOB, Gender, Marital */}
      <div className="row">
        <div className="mb-3 col-md-6">
  <label className="form-label">PAN Number</label>
  <input
    className={`form-control ${panError ? 'is-invalid' : ''}`}
    name="panNumber"
    value={data.panNumber || ''}
    onChange={handleInput}
    onBlur={handleBlur}
  />
  {panError && <div className="invalid-feedback">{panError}</div>}

        </div>
        <div className="mb-3 col-md-6">
          <label className="form-label">Date of Birth</label>
          <input className="form-control" type="date" name="dob" value={data.dob || ''} onChange={handleInput} />
        </div>
        <div className="mb-3 col-md-6">
          <label className="form-label">Gender</label>
          <select className="form-select" name="gender" value={data.gender || ''} onChange={handleInput}>
            <option value="">Select</option>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
        </div>
        <div className="mb-3 col-md-6">
          <label className="form-label">Marital Status</label>
          <select className="form-select" name="maritalStatus" value={data.maritalStatus || ''} onChange={handleInput}>
            <option value="">Select</option>
            <option value="single">Single</option>
            <option value="married">Married</option>
            <option value="divorced">Divorced</option>
            <option value="widowed">Widowed</option>
          </select>
        </div>
      </div>

      {/* Address */}
      <div className="row">
        <div className="mb-3 col-md-6">
          <label className="form-label">Street Address</label>
          <input className="form-control" name="streetAddress" value={data.streetAddress || ''} onChange={handleInput} />
        </div>
        <div className="mb-3 col-md-6">
          <label className="form-label">Address Line 2</label>
          <input className="form-control" name="addressLine2" value={data.addressLine2 || ''} onChange={handleInput} />
        </div>
        <div className="mb-3 col-md-4">
          <label className="form-label">City</label>
          <input className="form-control" name="city" value={data.city || ''} onChange={handleInput} />
        </div>
        <div className="mb-3 col-md-4">
          <label className="form-label">State / Province</label>
          <input className="form-control" name="stateRegionProvince" value={data.stateRegionProvince || ''} onChange={handleInput} />
        </div>
        <div className="mb-3 col-md-4">
          <label className="form-label">Postal Code</label>
          <input className="form-control" name="postalZipCode" value={data.postalZipCode || ''} onChange={handleInput} />
        </div>
      </div>

      {/* Photo Upload Section */}
      <div className="row">
        <div className="mb-3 col-md-6">
          <label className="form-label">Upload Photo (jpg/jpeg/png)</label>
          <input
            type="file"
            className="form-control"
            accept="image/jpeg, image/png"
            onChange={(e) => onChange({ ...data, photo: e.target.files[0] })}
          />
          <button type="button" className="btn btn-outline-primary mt-2" onClick={() => setShowCamera(true)}>
            Use Camera
          </button>

          {data.photo instanceof File && (
  <img
    src={URL.createObjectURL(data.photo)}
    alt="Preview"
    className="img-thumbnail mt-2"
    style={{ maxWidth: '200px' }}
  />
)}

        </div>
      </div>

      {/* Camera Modal */}
      {showCamera && (
       <div className="camera-modal bg-dark bg-opacity-75 position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ zIndex: 1050 }}>
  <div className="bg-white p-3 rounded shadow text-center position-relative" style={{ maxWidth: '400px', width: '100%', maxHeight: '90vh', overflowY: 'auto' }}>
    <h5 className="mb-3">Take a Photo</h5>
    
    <Webcam
      audio={false}
      ref={webcamRef}
      screenshotFormat="image/jpeg"
      videoConstraints={{ facingMode: "user" }}
      style={{ width: '100%', height: 'auto', maxHeight: '300px', borderRadius: '8px' }}
    />
    
    <div className="mt-3 d-flex justify-content-between gap-2">
      <button className="btn btn-success w-100" onClick={capturePhoto}>📸 Capture</button>
      <button className="btn btn-outline-danger w-100" onClick={() => setShowCamera(false)}>❌ Cancel</button>
    </div>
  </div>
</div>

      )}
    </>
  );
};

export default PersonalDetails;
