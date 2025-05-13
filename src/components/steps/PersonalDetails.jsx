import React from 'react';

const PersonalDetails = ({ data = {}, onChange }) => {
  const handleInput = (e) => onChange({ ...data, [e.target.name]: e.target.value });

  return (
    <>
      <h4 className="mb-4">👤 Personal Details</h4>
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

      <div className="row">
        <div className="mb-3 col-md-6">
          <label className="form-label">PAN Number</label>
          <input className="form-control" name="panNumber" value={data.panNumber || ''} onChange={handleInput} />
        </div>
        <div className="mb-3 col-md-6">
          <label className="form-label">Date of Birth</label>
          <input className="form-control" name="dob" type="date" value={data.dob || ''} onChange={handleInput} />
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
    </>
  );
};

export default PersonalDetails;
