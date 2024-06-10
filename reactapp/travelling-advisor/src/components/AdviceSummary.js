import React from 'react';
import './AdviceSummary.css';

const AdviceSummary = ({ boxmeer, hertogenbosch }) => {
  return (
    <div className='section-advice'>
      <div className='header-advice'>
        <p>Advice summary</p>
        <hr></hr>
      </div>
      <div className="advice-summary">
        <p className='first-p-summary'>The best travelling time to <span className='city'>Boxmeer</span> is <strong>{boxmeer}</strong>.</p>
        <p className='second-p-summary'>The best travelling time to <span className='city'>'s-Hertogenbosch</span> is <strong>{hertogenbosch}</strong>.</p>
      </div>
    </div>
  );
};

export default AdviceSummary;
