import React from 'react';

function DynamicWorkExperienceForm({ arrayElements, setArrayElements }) {
  const handleInputChange = (key, index, event) => {
    const { value } = event.target;
    const updatedElements = { ...arrayElements };
    updatedElements.workExperience[index][key] = value;
    setArrayElements(updatedElements);
  };

  const handleAddSection = () => {
    const updatedElements = { ...arrayElements };

    updatedElements.workExperience.push({
      company_name: '',
      job_title: '',
      responsibilities: '',
      start_date: '',
      end_date: '',
    });

    setArrayElements(updatedElements);
  };

  const handleDeleteSection = (index) => {
    const updatedElements = { ...arrayElements };
    updatedElements.workExperience.splice(index, 1);

    setArrayElements(updatedElements);
  };

  return (
    <div className="mb-3">
      {arrayElements.workExperience.map((item, index) => (
        <div key={index} className="mb-3">
          <div class="col mb-3">
            <div class="row mb-1">
              <div class="col">
                <label className="form-label">{index + 1}.</label>
              </div>
              {index !== 0 && (
                <div class="col text-end">
                  <i
                    class="bi bi-trash text-danger clickable"
                    onClick={() => handleDeleteSection(index)}
                  ></i>
                </div>
              )}
            </div>
            <input
              type="text"
              className="form-control"
              value={arrayElements.workExperience[index].company_name}
              onChange={(e) => handleInputChange('company_name', index, e)}
              placeholder="Company Name"
              required
            />
          </div>
          <div class="col mb-3">
            <input
              type="text"
              className="form-control"
              value={arrayElements.workExperience[index].job_title}
              onChange={(e) => handleInputChange('job_title', index, e)}
              placeholder="Job Title"
              required
            />
          </div>
          <div class="col mb-3">
            <textarea
              className="form-control"
              value={arrayElements.workExperience[index].responsibilities}
              onChange={(e) => handleInputChange('responsibilities', index, e)}
              placeholder="Responsibilities"
              rows="3"
              required
            />
          </div>
          <div class="row mb-3">
            <div class="col">
              <div class="input-group">
                <span class="input-group-text">Start</span>
                <input
                  type="date"
                  className="form-control"
                  value={arrayElements.workExperience[index].start_date}
                  onChange={(e) => handleInputChange('start_date', index, e)}
                  required
                />
              </div>
            </div>
            <div class="col">
              <div class="input-group">
                <span class="input-group-text">End</span>
                <input
                  type="date"
                  className="form-control"
                  value={arrayElements.workExperience[index].end_date}
                  onChange={(e) => handleInputChange('end_date', index, e)}
                  required
                />
              </div>
            </div>
          </div>
        </div>
      ))}
      <div
        className="btn text-primary mt-2"
        style={{
          width: '100%',
          border: '1px dashed #007bff',
          padding: '0.375rem 0.75rem',
          cursor: 'pointer',
        }}
        onClick={() => handleAddSection()}
      >
        <i class="bi bi-plus-lg"></i> Add field
      </div>
    </div>
  );
}

export default DynamicWorkExperienceForm;
