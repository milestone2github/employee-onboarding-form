import React from 'react';

// Allowed MIME types
const ALLOWED_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
  'application/msword' // .doc
];

// Check if input is a valid Google Drive shared link
const isValidDriveUrl = (url) =>
  /^https:\/\/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)\//.test(url);

// Extract File ID from Google Drive shared URL
const extractFileId = (url) => {
  const match = url.match(/\/d\/([a-zA-Z0-9_-]+)\//);
  return match ? match[1] : null;
};

// Download and convert Google Drive file to Blob → File
const downloadFromDrive = async (url, name, data, onChange) => {
  const fileId = extractFileId(url);
  if (!fileId) return;

  const downloadUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;
  try {
    const response = await fetch(downloadUrl);
    const blob = await response.blob();

    if (!ALLOWED_TYPES.includes(blob.type)) {
      alert("Invalid file format from Drive. Allowed: PDF, DOC, DOCX");
      return;
    }

    const extension = blob.type === 'application/pdf'
      ? 'pdf'
      : blob.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ? 'docx'
      : 'doc';

    const file = new File([blob], `${name}.${extension}`, { type: blob.type });

    // Set both the original link and the downloaded file
    onChange({ ...data, [name]: url, [`${name}File`]: file });

  } catch (err) {
    console.error("Error downloading from Google Drive:", err);
    alert("Failed to download file from Drive.");
  }
};

const EducationDetails = ({ data = {}, onChange }) => {
  const handleInput = async (e) => {
    const { name, value } = e.target;
    onChange({ ...data, [name]: value });

    if (isValidDriveUrl(value)) {
      await downloadFromDrive(value, name, data, onChange);
    }
  };

  const handleFileUpload = (e) => {
    const { name, files } = e.target;
    const file = files[0];
    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      alert("Only PDF, DOC, or DOCX files are allowed.");
      return;
    }

    onChange({ ...data, [name]: file });
  };

  return (
    <>
      <h4 className="mb-4">🎓 Educational Certificates & Degree</h4>

      {/* 10th Marksheet */}
      <div className="mb-4">
        <label className="form-label fw-semibold">10th Marksheet</label>
        <div className="row g-2 align-items-center">
          <div className="col-md-5">
            <input
              className="form-control"
              name="tenthMarksheet"
              value={data.tenthMarksheet || ''}
              onChange={handleInput}
              placeholder="Drive/Public Link"
            />
          </div>
          <div className="col-md-1 text-center text-muted">or</div>
          <div className="col-md-6">
            <input
              type="file"
              className="form-control"
              name="tenthMarksheetFile"
              onChange={handleFileUpload}
            />
          </div>
        </div>
      </div>

      {/* Last Education File */}
      <div className="mb-4">
        <label className="form-label fw-semibold">Last Education File</label>
        <div className="row g-2 align-items-center">
          <div className="col-md-5">
            <input
              className="form-control"
              name="lastEducationFile"
              value={data.lastEducationFile || ''}
              onChange={handleInput}
              placeholder="Drive/Public Link"
            />
          </div>
          <div className="col-md-1 text-center text-muted">or</div>
          <div className="col-md-6">
            <input
              type="file"
              className="form-control"
              name="lastEducationFileUpload"
              onChange={handleFileUpload}
            />
          </div>
        </div>
      </div>

      {/* CV */}
      <div className="mb-4">
        <label className="form-label fw-semibold">Latest Updated CV</label>
        <div className="row g-2 align-items-center">
          <div className="col-md-5">
            <input
              className="form-control"
              name="latestUpdateCv"
              value={data.latestUpdateCv || ''}
              onChange={handleInput}
              placeholder="Drive/Public Link"
            />
          </div>
          <div className="col-md-1 text-center text-muted">or</div>
          <div className="col-md-6">
            <input
              type="file"
              className="form-control"
              name="latestUpdateCvUpload"
              onChange={handleFileUpload}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default EducationDetails;
