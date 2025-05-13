import React from 'react';

const ReferenceDetails = ({ data = {}, onChange }) => {
  const handleInput = (e) => onChange({ ...data, [e.target.name]: e.target.value });


  return (
    <>
      <h4 className="mb-4">📇 Reference & Emergency Contacts</h4>

      <div className="row">
        <div className="mb-3 col-md-6">
          <label className="form-label">Reference 1 Name</label>
          <input
            className="form-control"
            name="reference1Name"
            value={data.reference1Name || ''}
            onChange={handleInput}
          />
        </div>
        <div className="mb-3 col-md-6">
          <label className="form-label">Reference 1 Phone</label>
          <input
            className="form-control"
            name="reference1Phone"
            value={data.reference1Phone || ''}
            onChange={handleInput}
          />
        </div>
        <div className="mb-3 col-12">
          <label className="form-label">Relationship with Reference 1</label>
          <input
            className="form-control"
            name="relationshipWithReference1"
            value={data.relationshipWithReference1 || ''}
            onChange={handleInput}
          />
        </div>
      </div>

      <div className="row">
        <div className="mb-3 col-md-6">
          <label className="form-label">Reference 2 Name</label>
          <input
            className="form-control"
            name="reference2Name"
            value={data.reference2Name || ''}
            onChange={handleInput}
          />
        </div>
        <div className="mb-3 col-md-6">
          <label className="form-label">Reference 2 Phone</label>
          <input
            className="form-control"
            name="reference2Phone"
            value={data.reference2Phone || ''}
            onChange={handleInput}
          />
        </div>
        <div className="mb-3 col-12">
          <label className="form-label">Relationship with Reference 2</label>
          <input
            className="form-control"
            name="relationshipWithReference2"
            value={data.relationshipWithReference2 || ''}
            onChange={handleInput}
          />
        </div>
      </div>

      <hr className="my-4" />

      <h5 className="mb-3">🚨 Emergency Contact</h5>
      <div className="row">
        <div className="mb-3 col-md-6">
          <label className="form-label">Emergency Contact Name</label>
          <input
            className="form-control"
            name="emergencyContactName"
            value={data.emergencyContactName || ''}
            onChange={handleInput}
          />
        </div>
        <div className="mb-3 col-md-6">
          <label className="form-label">Emergency Contact Phone</label>
          <input
            className="form-control"
            name="emergencyContactPhone"
            value={data.emergencyContactPhone || ''}
            onChange={handleInput}
          />
        </div>
        <div className="mb-3 col-12">
          <label className="form-label">Relationship with Emergency Contact</label>
          <input
            className="form-control"
            name="relationshipWithEmergencyContact"
            value={data.relationshipWithEmergencyContact || ''}
            onChange={handleInput}
          />
        </div>
      </div>
    </>
  );
};

export default ReferenceDetails;
