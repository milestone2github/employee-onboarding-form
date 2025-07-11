import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PersonalDetails from './steps/PersonalDetails';
import ReferenceDetails from './steps/ReferenceDetails';
import BankDetails from './steps/BankDetails';
import EducationDetails from './steps/EducationDetails';
import { toast } from 'react-toastify';
const API = `${process.env.REACT_APP_API_URL}/api/onboarding`;


const OnboardingForm = () => {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);
  const [formData, setFormData] = useState({
    personalDetails: {},
    referenceDetails: {},
    bankDetails: {},
    educationalCertificatesAndDegree: {},
  });
  const token = localStorage.getItem('token');

  useEffect(() => {
  if (token) {
    axios
      .get(`${API}/me`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
      })
      .then((res) => {
        const saved = res.data || {};
        setFormData({
          personalDetails: saved.personalDetails || {},
          referenceDetails: saved.referenceDetails || {},
          bankDetails: saved.bankDetails || {},
          educationalCertificatesAndDegree: saved.educationalCertificatesAndDegree || {},
        });

        //  Check if already submitted
        if (saved.submittedAt) {
          setSubmitted(true);
          setAlreadySubmitted(true); 
        }
      })
      .catch((err) => console.error('Failed to load onboarding data', err));
  }
}, [token]);


const saveStepToBackend = async (sectionKey) => {
  try {
    const data = formData[sectionKey];

    // === [STEPS WITH FILE UPLOADS] ===
    if (
      sectionKey === 'educationalCertificatesAndDegree' ||
      sectionKey === 'personalDetails' ||
      sectionKey === 'bankDetails'
    ) {
      const formDataToSend = new FormData();

      // Append text fields
      for (const key in data) {
        const value = data[key];
        if (!(value instanceof File)) {
          formDataToSend.append(`${sectionKey}.${key}`, value || '');
        }
      }

      // Append files
      if (sectionKey === 'educationalCertificatesAndDegree') {
        if (data.tenthMarksheetFile)
          formDataToSend.append('tenthMarksheetFile', data.tenthMarksheetFile);
        if (data.lastEducationFileUpload)
          formDataToSend.append('lastEducationFileUpload', data.lastEducationFileUpload);
        if (data.latestUpdateCvUpload)
          formDataToSend.append('latestUpdateCvUpload', data.latestUpdateCvUpload);
      }

      if (sectionKey === 'personalDetails' && data.photo)
        formDataToSend.append('personalDetails.photo', data.photo);

      if (sectionKey === 'bankDetails' && data.bankVerificationDoc)
        formDataToSend.append('bankDetails.bankVerificationDoc', data.bankVerificationDoc);

      // Append final submit only in the last step
      if (step === steps.length - 1) {
        formDataToSend.append('finalSubmit', 'true');
      }

      await axios.patch(`${API}/onboarding-form`, formDataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      });

    } else {
      // === [OTHER STEPS: JSON PATCH] ===
      const payload = { [sectionKey]: data };

      await axios.patch(`${API}/onboarding-form`, payload, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
    }
  } catch (err) {
    console.error(`❌ Failed to save ${sectionKey}`, err);
  }
};


 const validateStep = () => {
  const sectionKey = Object.keys(formData)[step];
  const data = formData[sectionKey] || {};

  const requiredFields = {
    personalDetails: [
      'firstName', 'lastName', 'email', 'phone', 'panNumber', 'postalZipCode',
      'fatherName', 'motherName', 'dob', 'gender', 'maritalStatus',
      'streetAddress', 'addressLine2', 'city', 'stateRegionProvince', 'photo'
    ],
    referenceDetails: [
      'reference1Name', 'reference1Phone', 'relationshipWithReference1',
      'emergencyContactName', 'emergencyContactPhone', 'relationshipWithEmergencyContact'
    ],
    bankDetails: [
      'beneficiaryName', 'accountNumber', 'ifscCode', 'bankName', 'bankVerificationDoc'
    ],
    educationalCertificatesAndDegree: [
      'tenthMarksheet', 'latestUpdateCv'
    ]
  };

  for (const field of requiredFields[sectionKey] || []) {
    const value = data[field];

    const isMissing = !value || (typeof value === 'string' && value.trim() === '');

    if (isMissing) {
      // Special case for educational file fallback fields
      if (sectionKey === 'educationalCertificatesAndDegree') {
        const fallbackFile =
          data[`${field}File`] || data[`${field}Upload`];
        if (!fallbackFile) {
          toast.error(`Please upload: ${field.replace(/([A-Z])/g, ' $1')}`);
          return false;
        }
      } else {
        toast.error(`Please fill out: ${field.replace(/([A-Z])/g, ' $1')}`);
        return false;
      }
    }
  }

  return true;
};

  const steps = ['Personal Details', 'Reference Details', 'Bank Details', 'Educational Certificates & Degree'];

  const handleNext = async () => {
  if (!validateStep()) return;
  const sectionKey = Object.keys(formData)[step];

  try {
    setLoading(true); // ⏳ Show spinner
    await saveStepToBackend(sectionKey);
    setStep((prev) => prev + 1);
  } finally {
    setLoading(false); // ✅ Hide spinner
  }
};


  const handlePrev = () => setStep((prev) => prev - 1);

  const handleChange = (section, updatedData) => {
    setFormData((prev) => ({ ...prev, [section]: updatedData }));
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <PersonalDetails
            data={formData.personalDetails}
            onChange={(data) => handleChange('personalDetails', data)}
          />
        );
      case 1:
        return (
          <ReferenceDetails
            data={formData.referenceDetails}
            onChange={(data) => handleChange('referenceDetails', data)}
          />
        );
      case 2:
        return (
          <BankDetails
            data={formData.bankDetails}
            onChange={(data) => handleChange('bankDetails', data)}
          />
        );
      case 3:
        return (
          <EducationDetails
            data={formData.educationalCertificatesAndDegree}
            onChange={(data) => handleChange('educationalCertificatesAndDegree', data)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-vh-100" style={{ backgroundColor: '#d4fcdc' }}>
      <div className="container py-5">
        <div className="p-4 shadow bg-white rounded" style={{ maxWidth: '900px', margin: 'auto' }}>
          <h2 className="mb-4">Employee Onboarding</h2>

          {submitted ? (
  <div className="text-center my-5">
    {alreadySubmitted ? (
      <>
        <h3 className="text-success">✅ You have already submitted the form</h3>
        <p>Thanks! We have received your onboarding details.</p>
      </>
    ) : (
      <>
        <h3 className="text-success">✅ Thank you for submitting the form!</h3>
        <p>Your onboarding details have been saved. Our team will contact you shortly.</p>
      </>
    )}
  </div>
) : (
            <>
              {/* Stepper */}
              <div className="d-flex justify-content-between align-items-center mb-4">
                {steps.map((label, index) => (
                  <div key={index} className="flex-fill text-center">
                    <div
                      className={`progress-step fw-bold ${index === step ? 'active' : ''}`}
                      style={{
                        borderBottom: index === step ? '3px solid #1abc9c' : '3px solid #ccc',
                        color: index === step ? '#1abc9c' : '#555',
                        paddingBottom: '6px',
                      }}
                    >
                      {label}
                    </div>
                  </div>
                ))}
              </div>

{loading && (
  <div className="text-center mb-3">
    <div className="spinner-border text-primary" role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
    <div className="text-muted mt-2">Uploading files. Please wait...</div>
  </div>
)}

              {renderStep()}

              <div className="d-flex justify-content-between mt-4">
                {step > 0 && (
                  <button className="btn btn-outline-secondary" onClick={handlePrev}>
                    ← Back
                  </button>
                )}
                {step < steps.length - 1 && (
                  <button className="btn btn-primary ms-auto" onClick={handleNext}>
                    Next →
                  </button>
                )}
                {step === steps.length - 1 && (
  <button
  className="btn btn-success ms-auto"
  onClick={async () => {
    if (!validateStep()) return;
    try {
      setLoading(true);
      await saveStepToBackend("educationalCertificatesAndDegree");
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  }}
  disabled={loading}
>
  {loading ? 'Submitting...' : 'Submit'}
</button>

)}

              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );

};

export default OnboardingForm;
