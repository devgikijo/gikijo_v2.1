import React from 'react';

function DynamicEducationBackgroundForm({ arrayElements, setArrayElements }) {
  const handleInputChange = (key, index, event) => {
    const { value } = event.target;
    const updatedElements = { ...arrayElements };
    updatedElements.educationBackground[index][key] = value;
    setArrayElements(updatedElements);
  };

  const handleAddSection = () => {
    const updatedElements = { ...arrayElements };

    updatedElements.educationBackground.push({
      institution_name: '',
      field_of_study: '',
      start_date: '',
      end_date: '',
    });

    setArrayElements(updatedElements);
  };

  const handleDeleteSection = (index) => {
    const updatedElements = { ...arrayElements };
    updatedElements.educationBackground.splice(index, 1);

    setArrayElements(updatedElements);
  };

  return (
    <div className="mb-3">
      {arrayElements.educationBackground.map((item, index) => (
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
              value={arrayElements.educationBackground[index].institution_name}
              onChange={(e) => handleInputChange('institution_name', index, e)}
              placeholder="Institution Name"
              required
            />
          </div>
          <div class="col mb-3">
            <input
              type="text"
              className="form-control"
              value={arrayElements.educationBackground[index].field_of_study}
              onChange={(e) => handleInputChange('field_of_study', index, e)}
              placeholder="Field of Study"
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
                  value={arrayElements.educationBackground[index].start_date}
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
                  value={arrayElements.educationBackground[index].end_date}
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

export default DynamicEducationBackgroundForm;
