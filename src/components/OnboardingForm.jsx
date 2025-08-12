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
  const [iframeUrl, setIframeUrl] = useState(null);

  const steps = ['Personal Details', 'Reference Details', 'Bank Details', 'Educational Certificates & Degree', 'NDA Signing'];

 useEffect(() => {
  if (!token) return;

  let cancelled = false;

  const load = async () => {
    try {
      const { data } = await axios.get(`${API}/me`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      if (cancelled) return;

      const saved = data || {};
      const savedNdaInfo = saved?.nda || {};

      setFormData({
        personalDetails: saved.personalDetails || {},
        referenceDetails: saved.referenceDetails || {},
        bankDetails: saved.bankDetails || {},
        educationalCertificatesAndDegree: saved.educationalCertificatesAndDegree || {},
      });

      // first 4 steps complete?
      if (saved?.submittedAt) {
        setSubmitted(true);
      }

      // NDA fully complete? (same condition you used earlier)
      if (savedNdaInfo?.signed === true) {
        setAlreadySubmitted(true);
      }

      // auto-jump to NDA if pages 1–4 done but NDA not signed
      if (saved?.submittedAt && !savedNdaInfo?.signed) {
        setStep(4);
      }

      console.log('NDA Info:', savedNdaInfo);
    } catch (err) {
      console.error('Failed to load onboarding data', err);
    }
  };

  load();
  return () => { cancelled = true; };
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
      if (step === steps.length - 2) {
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


  // const handlePrev = () => setStep((prev) => prev - 1);

  const handleChange = (section, updatedData) => {
    setFormData((prev) => ({ ...prev, [section]: updatedData }));
  };

   useEffect(() => {
    const fetchNdaSigningURL = async () => {
      if (step === 4 && !iframeUrl) {
        try {
          setLoading(true);
          const { data } = await axios.get(`${API}/embeddedsigning`, {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true
          });
          if (data?.signingURL) {
            setIframeUrl(data.signingURL);
          } else {
            toast.error("Failed to fetch NDA signing URL.");
          }
        } catch (err) {
          console.error("Error fetching NDA URL", err);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchNdaSigningURL();
  }, [step, token, iframeUrl]);

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
      case 4: return (
        <div className="mt-4">
          <h4>🔐 NDA Signing - Powered by Zoho Sign</h4>
          {iframeUrl ? (
            <iframe src={iframeUrl} width="100%" height="700px" frameBorder="0" title="NDA Signing"></iframe>
          ) : (
            <div>Loading NDA document...</div>
          )}
          <div className="text-muted mt-3">
            After completing the signing, you will be redirected automatically.
          </div>
        </div>
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

                  {alreadySubmitted ? (
  <div className="text-center my-5">
    <h3 className="text-success">✅ You have already submitted the form</h3>
    <p>Thanks! We have received your onboarding details.</p>
  </div>
) : (
  <>
    {/* Optional banner while NDA pending */}
    {submitted && (
      <div className="alert alert-info mb-3">
        Your details are saved. Please complete the NDA to finish onboarding.
      </div>
    )}
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
              {/* {step < steps.length - 2 && (
                <div className="d-flex justify-content-between mt-4">
                  {step > 0 && (
                    <button className="btn btn-outline-secondary" onClick={() => setStep((prev) => prev - 1)}>
                      ← Back
                    </button>
                  )}
                  <button className="btn btn-primary ms-auto" onClick={handleNext}>
                    Next →
                  </button>
                </div>
              )} */}
                <div className="d-flex justify-content-between mt-4">
                  {/* Back button visible until step < steps.length - 1 */}
                  {step > 0 && step < steps.length - 1 && (
                    <button
                      className="btn btn-outline-secondary"
                      onClick={() => setStep((prev) => prev - 1)}
                    >
                      ← Back
                    </button>
                  )}

                  {/* Next button visible until step < steps.length - 2 */}
                  {step < steps.length - 2 && (
                    <button
                      className="btn btn-primary ms-auto"
                      onClick={handleNext}
                    >
                      Next →
                    </button>
                  )}
                </div>

                {step === steps.length - 2 && (
                  <div className="d-flex justify-content-end mt-4">
                  <button
                    className="btn btn-success"
                    onClick={async () => {
                      if (!validateStep()) return;
                      try {
                        setLoading(true);
                        await saveStepToBackend("educationalCertificatesAndDegree");
                        setStep((prev) => prev + 1);
                      } catch (err) {
                        console.error('Submission failed', err);
                      } finally {
                        setLoading(false);
                      }
                    }}
                  >
                    Submit & Proceed to NDA →
                  </button>
              </div>
            )}
            </>
          )}
        </div>
      </div>
    </div>
  );

};

export default OnboardingForm;
