# from flask import Flask, render_template, request
# import joblib
# import numpy as np

# app = Flask(__name__)


# # 🚀 Home Routes
# @app.route('/')
# @app.route('/home-main')
# def main():
#     return render_template('home-main.html')

# @app.route('/home')
# def home():
#     return render_template('home.html')


# if __name__ == '__main__':
#     app.run(debug=True)
from flask import Flask, render_template, request, jsonify
import joblib
import pandas as pd
import numpy as np
import requests

app = Flask(__name__)

df = pd.read_csv(r"C:\Users\HP\OneDrive\Desktop\agri\Dataset_Crop Recomendation.csv")

# 🚀 Home Routes
@app.route('/')
@app.route('/home-main')
def main():
    return render_template('home-main.html')

@app.route('/marketprice')
def marketprice():
    return render_template('marketprice.html')


@app.route('/predict')
def predict():
    return render_template('index.html')
 # Load the crop prediction form page

@app.route('/form', methods=["POST"])
def form_handler():
    city = request.form['city']
    temperature, humidity = get_weather_data(city)
    
    if temperature is not None and humidity is not None:
        Nitrogen = float(request.form['Nitrogen'])
        Phosphorus = float(request.form['Phosphorus'])
        Potassium = float(request.form['Potassium'])
        Ph = float(request.form['ph'])
        Rainfall = float(request.form['Rainfall'])
        
        prediction_result = brain(Nitrogen, Phosphorus, Potassium, temperature, humidity, Ph, Rainfall)
        return render_template('result.html', prediction=prediction_result['prediction'], ml_link=prediction_result['ml_link'])
    else:
        return "Failed to fetch weather data for the specified city"

def get_weather_data(city):
    api_key = '632c9c8733727bc87ef366a47fda17d4'
    url = f"http://api.openweathermap.org/data/2.5/weather?q={city}&appid={api_key}&units=metric"
    response = requests.get(url)
    if response.status_code == 200:
        data = response.json()
        if 'main' in data:
            temp = data['main'].get('temp')
            humidity = data['main'].get('humidity')
            return temp, humidity
        else:
            return None, None
    else:
        return None, None

def brain(Nitrogen, Phosphorus, Potassium, Temperature, Humidity, Ph, Rainfall):
    values = [Nitrogen, Phosphorus, Potassium, Temperature, Humidity, Ph, Rainfall]
    if 0 < Ph <= 14 and Temperature < 100 and Humidity > 0:
        model_path = "C:\\Users\\HP\\OneDrive\\Desktop\\agri\\models\\model.pkl"
        model = joblib.load(model_path)
        input_data = np.array(values).reshape(1, -1)
        predicted_crop_label = model.predict(input_data)[0]
        predicted_crop_row = df.loc[df['label'] == predicted_crop_label]
        youtube_link = predicted_crop_row['youtube link'].values[0]
        return {'prediction': str(predicted_crop_label), 'ml_link': youtube_link}
    else:
        return {"prediction": "Invalid input values", "ml_link": None}

if __name__ == '__main__':
    app.run(debug=True)

