import React from 'react';

const EducationDetails = ({ data = {}, onChange }) => {
  const handleInput = (e) => onChange({ ...data, [e.target.name]: e.target.value });

  return (
    <>
      <h4 className="mb-4">🎓 Educational Certificates & Degree</h4>

      <div className="row">
        <div className="mb-3 col-md-6">
          <label className="form-label">10th Marksheet (File URL or Path)</label>
          <input
            className="form-control"
            name="tenthMarksheet"
            value={data.tenthMarksheet || ''}
            onChange={handleInput}
            placeholder="e.g. https://drive.google.com/file/..."
          />
        </div>

        <div className="mb-3 col-md-6">
          <label className="form-label">Last Education File (File URL or Path)</label>
          <input
            className="form-control"
            name="lastEducationFile"
            value={data.lastEducationFile || ''}
            onChange={handleInput}
            placeholder="e.g. Bachelor Degree certificate"
          />
        </div>
      </div>

      <div className="mb-3">
        <label className="form-label">Latest Updated CV (File URL or Path)</label>
        <input
          className="form-control"
          name="latestUpdateCv"
          value={data.latestUpdateCv || ''}
          onChange={handleInput}
          placeholder="e.g. Resume file on Drive or system path"
        />
      </div>
    </>
  );
};

export default EducationDetails;
