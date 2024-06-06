import React from 'react';
import './AdviceSummary.css';

const AdviceSummary = ({ boxmeer, hertogenbosch }) => {
  return (
    <div className="advice-summary">
      <p>The best travelling time to <strong>Boxmeer</strong> is <strong>{boxmeer}</strong>.</p>
      <p>The best travelling time to <strong>'s-Hertogenbosch</strong> is <strong>{hertogenbosch}</strong>.</p>
    </div>
  );
};

export default AdviceSummary;
