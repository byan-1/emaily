import React from 'react';
import PropTypes from 'prop-types';

const SurveyField = ({ input, label, meta: { error, touched } }) => {
  return (
    <div>
      <label>{label}</label>
      <input {...input} style={{ marginBottom: '5px' }} />
      <div className="red-text" style={{ marginBottom: '20px' }}>
        {touched && error}
      </div>
    </div>
  );
};

SurveyField.propTypes = {
  input: PropTypes.object,
  meta: PropTypes.object,
  label: PropTypes.node
};

export default SurveyField;
