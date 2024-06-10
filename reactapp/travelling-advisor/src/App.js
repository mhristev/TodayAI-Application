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

  // const [boxmeerData, setBoxmeerData] = useState([]);
  // const [hertogenboschData, setHertogenboschData] = useState([]);

  // const boxmeerData = [
  //   { day: 'Mon', morning: 'light', afternoon: 'light' },
  //   { day: 'Tue', morning: 'light', afternoon: 'heavy' },
  //   { day: 'Wed', morning: 'heavy', afternoon: 'medium' },
  //   { day: 'Thu', morning: 'light', afternoon: 'light' },
  //   { day: 'Fri', morning: 'medium', afternoon: 'light' },
  // ];

  // const hertogenboschData = [
  //   { day: 'Mon', morning: 'light', afternoon: 'light' },
  //   { day: 'Tue', morning: 'heavy', afternoon: 'heavy' },
  //   { day: 'Wed', morning: 'heavy', afternoon: 'heavy' },
  //   { day: 'Thu', morning: 'light', afternoon: 'light' },
  //   { day: 'Fri', morning: 'medium', afternoon: 'light' },
  // ];

  const [bestDaysBoxmeer, setBestDaysBoxmeer] = useState([]);
  const [bestDayDenBosch, setBestDayDenBosch] = useState('');
  const trafficValues = {
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
    <div className="App">
         <Header setBoxmeerData={setBoxmeerData} setHertogenboschData={setHertogenboschData} />
      <div>

      {/* <button onClick={() => getPrediction({Hour: 12, RoadNumber: 5, Weekday: 2, DayofYear: 150, Year: 2020, DayofMonth: 30, HectometerDirectionNum: 1})}>
        Get Prediction
      </button> */}
      {prediction && <p>Prediction: {prediction}</p>}
    </div>
    <div className='section-graph'>
      <div className='header-graph'>
        <div className='title-graph'>Travel duration in minutes per weekday</div>
        <p className='sub-title-graph'>Morning hours are between 7 and 9 AM. Afternoon hours are between 4 and 6 PM.</p>
      </div>
      <hr></hr>
        <div className="graph-container">
          <Graph title="Boxmeer" data={boxmeerData} dataKey1="morning" dataKey2="afternoon" />
          <Graph title="'s-Hertogenbosch" data={hertogenboschData} dataKey1="morning" dataKey2="afternoon" />
        </div>
      </div>
      <AdviceSummary boxmeer={bestDaysBoxmeer.join(' and ')} hertogenbosch={bestDayDenBosch} />

    </div>
  );
};

export default App;
