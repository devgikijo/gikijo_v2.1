import React from 'react';
import { LANGUAGE_LEVELS } from '../utils/constants';

function DynamicLanguagesForm({ arrayElements, setArrayElements }) {
  const handleInputChange = (key, index, event) => {
    const { value } = event.target;
    const updatedElements = { ...arrayElements };
    updatedElements.languages[index][key] = value;
    setArrayElements(updatedElements);
  };

  const handleAddSection = () => {
    const updatedElements = { ...arrayElements };

    updatedElements.languages.push({
      name: '',
      level: '',
      remarks: '',
    });

    setArrayElements(updatedElements);
  };

  const handleDeleteSection = (index) => {
    const updatedElements = { ...arrayElements };
    updatedElements.languages.splice(index, 1);

    setArrayElements(updatedElements);
  };

  return (
    <div className="mb-3">
      {arrayElements.languages.map((item, index) => (
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
              value={arrayElements.languages[index].name}
              onChange={(e) => handleInputChange('name', index, e)}
              placeholder="Skill Name"
              required
            />
          </div>
          <div class="col mb-3">
            <div class="input-group">
              <span class="input-group-text">Level</span>
              <select
                class="form-select"
                id="select-level"
                value={arrayElements.languages[index].level}
                onChange={(e) => handleInputChange('level', index, e)}
                required
              >
                <option value="" disabled>
                  Please select
                </option>
                {LANGUAGE_LEVELS.map((item, index) => {
                  return (
                    <option value={item.value} key={index}>
                      {item.name}
                    </option>
                  );
                })}
              </select>
            </div>
            <textarea
              className="form-control mt-3"
              value={arrayElements.languages[index].remarks}
              onChange={(e) => handleInputChange('remarks', index, e)}
              placeholder="Remarks"
              rows="3"
            />
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

export default DynamicLanguagesForm;
