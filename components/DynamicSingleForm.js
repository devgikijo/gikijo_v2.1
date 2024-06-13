import React from 'react';

function DynamicSingleForm({
  elements,
  setElements,
  addElement,
  removeElement,
  handleChange,
  label,
}) {
  return (
    <div className="mb-3">
      <label className="form-label">{label}</label>
      {elements.map((item, index) => (
        <div
          key={index}
          style={{ display: 'flex', alignItems: 'center' }}
          class="mb-2"
        >
          {/* <span style={{ marginRight: '0.5rem' }}>&#8226;</span> */}
          <div class="input-group">
            <input
              type="text"
              className="form-control"
              value={item}
              onChange={(e) => handleChange(index, e.target.value)}
              required
            />
            {index !== 0 && (
              <button
                type="button"
                onClick={() => removeElement(index)}
                className="btn btn-outline-secondary"
              >
                <i class="bi bi-trash"></i>
              </button>
            )}
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
        onClick={addElement}
      >
        <i class="bi bi-plus-lg"></i> Add field
      </div>
    </div>
  );
}

export default DynamicSingleForm;
