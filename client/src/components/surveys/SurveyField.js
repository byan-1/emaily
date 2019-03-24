import React from 'react';
import PropTypes from 'prop-types';

const SurveyField = ({ input, label }) => {
  return (
    <div>
      <label>{label}</label>
      <input {...input} />
    </div>
  );
};

SurveyField.propTypes = {
  input: PropTypes.object,
  label: PropTypes.node
};

export default SurveyField;
