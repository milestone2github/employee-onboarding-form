import React from 'react';

const ALLOWED_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
  'application/msword' // .doc
];

const EducationDetails = ({ data = {}, onChange }) => {
  const handleFileUpload = (e) => {
    const { name, files } = e.target;
    const file = files[0];
    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      alert("Only PDF, DOC, or DOCX files are allowed.");
      return;
    }

    onChange({ ...data, [name]: file }); // Save File object directly
  };

  return (
  <>
    <h4 className="mb-4">🎓 Educational Certificates & Degree</h4>

    {/* 10th Marksheet */}
    <div className="mb-4">
      <label className="form-label fw-semibold">10th Marksheet</label>
      <input
        type="file"
        className="form-control"
        name="tenthMarksheetFile"
        onChange={handleFileUpload}
      />
    </div>

    {/* Last Education File */}
    <div className="mb-4">
      <label className="form-label fw-semibold">Last Education File</label>
      <input
        type="file"
        className="form-control"
        name="lastEducationFileUpload"
        onChange={handleFileUpload}
      />
    </div>

    {/* Latest Updated CV */}
    <div className="mb-4">
      <label className="form-label fw-semibold">Latest Updated CV</label>
      <input
        type="file"
        className="form-control"
        name="latestUpdateCvUpload"
        onChange={handleFileUpload}
      />
    </div>
  </>
);

};

export default EducationDetails;
