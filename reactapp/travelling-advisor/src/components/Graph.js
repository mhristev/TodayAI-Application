import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import './Graph.css';

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const formatValue = (value) => {
      return value === 2 ? 'light' : value === 3 ? 'medium' : value === 4 ? 'heavy' : 'none';
    };

    return (
      <div className="custom-tooltip">
        <p className="intro">{`Morning : ${formatValue(payload[0].value)}`}</p>
        <p className="intro">{`Afternoon : ${formatValue(payload[1].value)}`}</p>
      </div>
    );
  }

  return null;
};


const Graph = ({ title, data }) => {

  const mappedData = data.map(item => ({
    ...item,
    morning: item.morning === 'light' ? 2 : item.morning === 'medium' ? 3 : 4,
    afternoon: item.afternoon === 'light' ? 2 : item.afternoon === 'medium' ? 3 : 4,
  }));

  // Custom tick formatter
  const formatTick = (tick) => {
    return tick === 1 ? 'No delay' : tick === 2 ? 'Up to 15 mins.': tick === 3 ? '15-30 mins.' : '\n30+ mins.';
  };

  const trafficValues = {
    'light': 1,
    'medium': 2,
    'heavy': 3
  };
  
  // Sort the data based on the morning and afternoon values
  const sortedData = mappedData.sort((a, b) => (trafficValues[a.morning] + trafficValues[a.afternoon]) - (trafficValues[b.morning] + trafficValues[b.afternoon]));
  
  // Get the best days for traveling
  const bestDaysBoxmeer = sortedData.slice(0, 2).map(item => item.day);
  const bestDayDenBoschItem = sortedData.find(item => !bestDaysBoxmeer.includes(item.day));
  
  // Check if a day was found for Den Bosch
  if (bestDayDenBoschItem) {
    const bestDayDenBosch = bestDayDenBoschItem.day;
    console.log(`Best day for Den Bosch: ${bestDayDenBosch}`);
  } else {
    console.log('No best day found for Den Bosch');
  }
  
  console.log(`Best days for Boxmeer: ${bestDaysBoxmeer.join(', ')}`);
  return (
    <div className="graph">
      <h2>{title}</h2>
      <BarChart
        width={700}
        height={300}
        data={mappedData}
        margin={{
          top: 5, right: 30, left: 20, bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="day" />
        <YAxis domain={[1, 4]} ticks={[1, 2, 3, 4]} tickFormatter={formatTick} />
        {/* <Tooltip content={<CustomTooltip />}/> */}
        <Legend />
        <Bar dataKey="morning" fill="#D06A30" />
        <Bar dataKey="afternoon" fill="#1B3454" />
      </BarChart>
    </div>
  );
};

export default Graph;