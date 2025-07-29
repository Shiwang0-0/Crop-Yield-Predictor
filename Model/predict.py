from catboost import CatBoostRegressor
from flask import Flask, request, jsonify
import numpy as np
import pandas as pd

app=Flask(__name__)

model= CatBoostRegressor()
model.load_model("model.cbm")

epsilon= 1e-5 

@app.route('/predict',methods=["POST"])
def predict():
    data=request.json
    crop = str(data['crop']).strip()  # object → str
    crop_year = int(data['crop_year'])  # must match model (int64)
    season = str(data['season']).strip()
    state = str(data['state']).strip()

    area = float(data['area'])
    rainfall = float(data['rainfall'])
    fertilizer = float(data['fertilizer'])
    pesticide = float(data['pesticide'])


    fertilizer_per_area = np.log((fertilizer / area) + epsilon)
    pesticide_per_area = np.log((pesticide / area) + epsilon)
    log_annual_rainfall = np.log(rainfall + epsilon)


    features = [crop, crop_year, season, state, fertilizer_per_area, pesticide_per_area, log_annual_rainfall]
    

    input_df = pd.DataFrame([features], columns=["Crop", "Crop_Year", "Season", "State","Fertilizer_per_area", "Pesticide_per_area","log_Annual_Rainfall"])

    input_df = input_df.astype({
        'Crop': 'object',
        'Crop_Year': 'int64',
        'Season': 'object',
        'State': 'object',
        'Fertilizer_per_area': 'float64',
        'Pesticide_per_area': 'float64',
        'log_Annual_Rainfall': 'float64'
    })

    y_pred_log = model.predict(input_df)[0]
    y_pred = np.exp(y_pred_log)
    print(y_pred)

    return jsonify({ 'yield': y_pred })

if __name__ == '__main__':
    app.run(port=5000)