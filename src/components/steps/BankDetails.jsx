import React from 'react';

const BankDetails = ({ data = {}, onChange }) => {
  const handleInput = (e) => onChange({ ...data, [e.target.name]: e.target.value });

  return (
    <>
      <h4 className="mb-4">🏦 Bank Details</h4>

      <div className="row">
        <div className="mb-3 col-md-6">
          <label className="form-label">Beneficiary Name</label>
          <input
            className="form-control"
            name="beneficiaryName"
            value={data.beneficiaryName || ''}
            onChange={handleInput}
          />
        </div>

        <div className="mb-3 col-md-6">
          <label className="form-label">Account Number</label>
          <input
            className="form-control"
            name="accountNumber"
            value={data.accountNumber || ''}
            onChange={handleInput}
            type="text"
            inputMode="numeric"
          />
        </div>
      </div>

      <div className="row">
        <div className="mb-3 col-md-6">
          <label className="form-label">IFSC Code</label>
          <input
            className="form-control"
            name="ifscCode"
            value={data.ifscCode || ''}
            onChange={handleInput}
            style={{ textTransform: 'uppercase' }}
          />
        </div>

        <div className="mb-3 col-md-6">
          <label className="form-label">Bank Name</label>
          <input
            className="form-control"
            name="bankName"
            value={data.bankName || ''}
            onChange={handleInput}
          />
        </div>
      </div>

      <div className="mb-3">
        <label className="form-label">Bank Verification Document (URL or Path)</label>
        <input
          className="form-control"
          name="bankVerificationDoc"
          value={data.bankVerificationDoc || ''}
          onChange={handleInput}
        />
      </div>
    </>
  );
};

export default BankDetails;
