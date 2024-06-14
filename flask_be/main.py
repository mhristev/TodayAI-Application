from flask import Flask, request
from joblib import load
from flask_cors import CORS
from pandas import DataFrame
from datetime import datetime, timedelta
import pickle

app = Flask(__name__)
CORS(app, origins="http://localhost:3000")
model = load('rf69.joblib')

# 0 is for going to work, 1 is coming back home

@app.route('/predict/next_week', methods=['POST'])
def predict_next_week():
    try:
        print("in predict_next_week")
        next_week_data = get_next_week_data()
        predictions_going_boxmeer, predictions_coming_home_boxmeer= get_predictions_for_boxmeer_week(next_week_data)

        print('-------------------')
        print(predictions_going_boxmeer)
        print(predictions_coming_home_boxmeer)

        predictions_going_den_bosch, predictions_coming_home_den_bosch = get_predictions_for_den_bosch_week(next_week_data)
        print('-------------------')
        print(predictions_going_den_bosch)
        print(predictions_coming_home_den_bosch)
        
        all_predictions = get_all_predictions(predictions_coming_home_boxmeer, predictions_going_boxmeer, predictions_coming_home_den_bosch, predictions_going_den_bosch)
        
        return {'predictions': all_predictions}
    except Exception as e:
        return {'error': str(e)}, 500



@app.route('/predict/this_week', methods=['POST'])
def predict_this_week():

    try:
        this_week_data = get_this_week_data()
        predictions_going_boxmeer, predictions_coming_home_boxmeer  = get_predictions_for_boxmeer_week(this_week_data)

        print(predictions_going_boxmeer)
        print(predictions_coming_home_boxmeer)
        print('-------------------')

        # Going to Den Bosch
        predictions_going_den_bosch, predictions_coming_home_den_bosch = get_predictions_for_den_bosch_week(this_week_data)

        print(predictions_going_den_bosch)
        print(predictions_coming_home_den_bosch)

        all_predictions = get_all_predictions(predictions_coming_home_boxmeer, 
                                              predictions_going_boxmeer, 
                                              predictions_coming_home_den_bosch, 
                                              predictions_going_den_bosch)
        
        return {'predictions': all_predictions}
    except Exception as e:
        return {'error': str(e)}, 500


def get_this_week_data():
    this_week_data = []
     # Get today's date
    today = datetime.now()

    # Calculate the last Monday
    last_monday = today - timedelta(days=today.weekday())

    # Print dates from Monday to Friday
    for i in range(5):
        day = last_monday + timedelta(days=i)
        this_week_data.append({
            "Weekday": day.weekday(),
            "DayofYear": day.timetuple().tm_yday,
            "Year": day.year,
            "DayofMonth": day.day
        })
    
    return this_week_data

def get_next_week_data():
    today = datetime.now()

    # Calculate the next Monday
    next_monday = today - timedelta(days=today.weekday()) + timedelta(days=7)

    # Initialize an empty list
    next_week_data = []

    # Add dates from Monday to Friday to the list
    for i in range(5):
        day = next_monday + timedelta(days=i)
        next_week_data.append({
            "Weekday": day.weekday(),
            "DayofYear": day.timetuple().tm_yday,
            "Year": day.year,
            "DayofMonth": day.day
        })

    return next_week_data

def get_all_predictions(predictions_coming_home_boxmeer, predictions_going_boxmeer, predictions_coming_home_den_bosch, predictions_going_den_bosch):
    all_predictions = {
        "boxmeer_to_home": predictions_coming_home_boxmeer,
        "home_to_boxmeer": predictions_going_boxmeer,
        "den_bosch_to_home": predictions_coming_home_den_bosch,
        "home_to_den_bosch": predictions_going_den_bosch
    }
    return all_predictions

def get_predictions_for_boxmeer_week(data):
    # Going to Boxmeer
    going_boxmeer = prepare_for_going_to_boxmeer(data)
    coming_home_boxmeer = prepare_for_going_home_from_boxmeer(data)

    predictions_coming_home_boxmeer = predict_traffic(coming_home_boxmeer)
    predictions_going_boxmeer = predict_traffic(going_boxmeer)

    return predictions_going_boxmeer, predictions_coming_home_boxmeer, 

def get_predictions_for_den_bosch_week(data):
    going_den_bosch = prepare_for_going_to_den_bosch(data)
    coming_home_den_bosch = prepare_for_going_home_from_den_bosch(data)
    
    predictions_coming_home_den_bosch = predict_traffic(coming_home_den_bosch)
    predictions_going_den_bosch = predict_traffic(going_den_bosch)

    return predictions_going_den_bosch, predictions_coming_home_den_bosch

def prepare_data(week_data, hour, road_number, hectometer_direction_num):
    for day_data in week_data:
        day_data.update({
            "Hour": hour,
            "RoadNumber": road_number,
            "HectometerDirectionNum": hectometer_direction_num
        })
    return week_data

def prepare_for_going_to_den_bosch(week_data):
    return prepare_data(week_data, 7, 2, 0)

def prepare_for_going_to_boxmeer(week_data):
    return prepare_data(week_data, 7, 73, 0)

def prepare_for_going_home_from_den_bosch(week_data):
    return prepare_data(week_data, 17, 2, 1)

def prepare_for_going_home_from_boxmeer(week_data):
    return prepare_data(week_data, 17, 73, 1)

def predict_traffic(week_data):
    predictions = []
    for data in week_data:
        # Convert the dictionary to a DataFrame
        features = DataFrame([data], columns=['Hour', 'RoadNumber', 'Weekday', 'DayofYear', 'Year', 'DayofMonth', 'HectometerDirectionNum'])
        # Make a prediction and add it to the predictions list
        prediction = model.predict(features)
        predictions.append(int(prediction[0]))
    return predictions

if __name__ == '__main__':
    app.run(port=5000, debug=True)

    # export FLASK_APP=main.py
    # flask run