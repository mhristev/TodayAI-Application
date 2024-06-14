import React from 'react';
import Header from './components/Header';
import Graph from './components/Graph';
import AdviceSummary from './components/AdviceSummary';
import './App.css';
import { useState, useEffect } from 'react';
const App = () => {
  const [prediction, setPrediction] = React.useState(null); 
  const [boxmeerData, setBoxmeerData] = useState([]);
  const [hertogenboschData, setHertogenboschData] = useState([]);

  const [bestDaysBoxmeer, setBestDaysBoxmeer] = useState([]);
  const [bestDayDenBosch, setBestDayDenBosch] = useState('');
  const trafficValues = {
    'none' : 0,
    'light': 1,
    'medium': 2,
    'heavy': 3
  };
  useEffect(() => {
    // Combine the data for both cities
    const combinedData = [...boxmeerData, ...hertogenboschData];
  
    // Sort the combined data
    const sortedData = combinedData.sort((a, b) => (trafficValues[a.morning] + trafficValues[a.afternoon]) - (trafficValues[b.morning] + trafficValues[b.afternoon]));
  
    // Get the best days for both cities
    const bestDays = sortedData.slice(0, 3).map(item => item.day);
  
    // Set the best days for Boxmeer and Den Bosch
    setBestDaysBoxmeer(bestDays.slice(0, 2));
    setBestDayDenBosch(bestDays[2]);
  }, [boxmeerData, hertogenboschData]);

  return (
    <div className="App" style={{ overflow: 'hidden' }}>
         <Header setBoxmeerData={setBoxmeerData} setHertogenboschData={setHertogenboschData} />
      <div>
      {prediction && <p>Prediction: {prediction}</p>}
    </div>
    <div className='section-graph'>
      <div className='header-graph'>
        <div className='title-graph'>Travel duration in minutes per weekday</div>
        <p className='sub-title-graph'>Morning hour is 6 AM. Afternoon hour is 5 PM.</p>
      </div>
      <hr></hr>
        <div className="graph-container" >
          <Graph title="Boxmeer" data={boxmeerData} dataKey1="morning" dataKey2="afternoon" />
          <Graph title="'s-Hertogenbosch" data={hertogenboschData} dataKey1="morning" dataKey2="afternoon" />
        </div>
      </div>
      <div className="bottom-element">
        <AdviceSummary boxmeer={bestDaysBoxmeer.join(' and ')} hertogenbosch={bestDayDenBosch} style={{ minHeight: '100vh' }}/>
      </div>
    </div>
  );
};

export default App;
