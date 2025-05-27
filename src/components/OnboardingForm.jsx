import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PersonalDetails from './steps/PersonalDetails';
import ReferenceDetails from './steps/ReferenceDetails';
import BankDetails from './steps/BankDetails';
import EducationDetails from './steps/EducationDetails';
import { useNavigate } from 'react-router-dom';
const API = 'http://localhost:5001/api/onboarding';

const OnboardingForm = () => {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    personalDetails: {},
    referenceDetails: {},
    bankDetails: {},
    educationalCertificatesAndDegree: {},
  });
  const navigate = useNavigate();
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
        })
        .catch((err) => console.error('Failed to load onboarding data', err));
    }
  }, [token]);

  const saveStepToBackend = async (sectionKey) => {
    try {
      await axios.patch(
        `${API}/onboarding-form`,
        { [sectionKey]: formData[sectionKey] },
        { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
      );
    } catch (err) {
      console.error(`Failed to save ${sectionKey}`, err);
    }
  };

  const validateStep = () => {
    const sectionKey = Object.keys(formData)[step];
    const data = formData[sectionKey] || {};

    const requiredFields = {
      personalDetails: ['firstName', 'lastName', 'email', 'phone', 'panNumber', 'postalZipCode'],
      referenceDetails: ['reference1Name', 'reference1Phone'],
      bankDetails: ['beneficiaryName', 'accountNumber', 'ifscCode'],
      educationalCertificatesAndDegree: ['tenthMarksheet', 'latestUpdateCv'],
    };

    for (const field of requiredFields[sectionKey] || []) {
      const value = data[field];
      if (!value || (typeof value === 'string' && value.trim() === '')) {
        alert(`Please fill out: ${field.replace(/([A-Z])/g, ' $1')}`);
        return false;
      }
    }

    return true;
  };

  const steps = ['Personal Details', 'Reference Details', 'Bank Details', 'Educational Certificates & Degree'];

  const handleNext = async () => {
    if (!validateStep()) return;
    const sectionKey = Object.keys(formData)[step];
    await saveStepToBackend(sectionKey);
    setStep((prev) => prev + 1);
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
              <h3 className="text-success">✅ Thank you for submitting the form!</h3>
              <p>Your onboarding details have been saved. Our team will contact you shortly.</p>
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
                    onClick={() => setSubmitted(true)}
                  >
                    Submit
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
