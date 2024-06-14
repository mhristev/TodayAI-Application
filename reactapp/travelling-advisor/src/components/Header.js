import React from 'react';
import './Header.css';
import axios from 'axios';
import { useEffect, useState } from 'react';

function Header({ setBoxmeerData, setHertogenboschData }) {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const trafficConditions = ["none", "light", "medium", "heavy"];
  const [selectedButton, setSelectedButton] = useState('thisWeek');

  const transformPredictions = (predictions) => {
    return predictions.map(prediction => trafficConditions[prediction]);
  }

  const getPredictionThisWeek = () => {
    setSelectedButton('thisWeek');
    axios.post('http://127.0.0.1:5000/predict/this_week')
      .then(response => {
        console.log(response.data);
        const transformedPredictions = {
          boxmeer_to_home: transformPredictions(response.data.predictions.boxmeer_to_home),
          den_bosch_to_home: transformPredictions(response.data.predictions.den_bosch_to_home),
          home_to_boxmeer: transformPredictions(response.data.predictions.home_to_boxmeer),
          home_to_den_bosch: transformPredictions(response.data.predictions.home_to_den_bosch)
        };
        // console.log(transformedPredictions);
        const transformedPredictionsDict = transformedPredictions.home_to_boxmeer.map((prediction, index) => {
          return {
            day: days[index],
            morning: prediction
          };
        });

        const boxmeerToHomePredictions = transformedPredictions.boxmeer_to_home;

        const finalPredictions_Boxmeer = transformedPredictionsDict.map((prediction, index) => {
          return {
            ...prediction,
            afternoon: boxmeerToHomePredictions[index]
          };
        });

        const transformedPredictionsDict2 = transformedPredictions.home_to_den_bosch.map((prediction, index) => {
          return {
            day: days[index],
            morning: prediction
          };
        });

        const denBoschToHomePredictions = transformedPredictions.den_bosch_to_home;

        const finalPredictions_denbosch = transformedPredictionsDict2.map((prediction, index) => {
          return {
            ...prediction,
            afternoon: denBoschToHomePredictions[index]
          };
        });

        console.log(finalPredictions_Boxmeer);
        console.log(finalPredictions_denbosch);

        setBoxmeerData(finalPredictions_Boxmeer);
        setHertogenboschData(finalPredictions_denbosch);
      });
  };

  const getPredictionNextWeek = () => {
    setSelectedButton('nextWeek');
    axios.post('http://127.0.0.1:5000/predict/next_week')
      .then(response => {
        console.log(response.data);
        const transformedPredictions = {
          boxmeer_to_home: transformPredictions(response.data.predictions.boxmeer_to_home),
          den_bosch_to_home: transformPredictions(response.data.predictions.den_bosch_to_home),
          home_to_boxmeer: transformPredictions(response.data.predictions.home_to_boxmeer),
          home_to_den_bosch: transformPredictions(response.data.predictions.home_to_den_bosch)
        };
        // console.log(transformedPredictions);
        const transformedPredictionsDict = transformedPredictions.home_to_boxmeer.map((prediction, index) => {
          return {
            day: days[index],
            morning: prediction
          };
        });

        const boxmeerToHomePredictions = transformedPredictions.boxmeer_to_home;

        const finalPredictions_Boxmeer = transformedPredictionsDict.map((prediction, index) => {
          return {
            ...prediction,
            afternoon: boxmeerToHomePredictions[index]
          };
        });

        const transformedPredictionsDict2 = transformedPredictions.home_to_den_bosch.map((prediction, index) => {
          return {
            day: days[index],
            morning: prediction
          };
        });

        const denBoschToHomePredictions = transformedPredictions.den_bosch_to_home;

        const finalPredictions_denbosch = transformedPredictionsDict2.map((prediction, index) => {
          return {
            ...prediction,
            afternoon: denBoschToHomePredictions[index]
          };
        });

        console.log(finalPredictions_Boxmeer);
        console.log(finalPredictions_denbosch);

        setBoxmeerData(finalPredictions_Boxmeer);
        setHertogenboschData(finalPredictions_denbosch);
      });
  };

  useEffect(() => {
    getPredictionThisWeek();
  }, []);

  return (
    <div className="header">
      <h1>Theo's travelling advisor</h1>
      <div className="week-selector">
        <span>Week of the advice:</span>
        <button style={{ border: '1px solid black', backgroundColor: selectedButton === 'thisWeek' ? 'lightblue' : 'transparent'  }} onClick={getPredictionThisWeek}>This week</button>
        <button style={{ border: '1px solid black', backgroundColor: selectedButton === 'nextWeek' ? 'lightblue' : 'transparent' }} onClick={getPredictionNextWeek}>Next week</button>
      </div>
    </div>
  );
};

export default Header;
