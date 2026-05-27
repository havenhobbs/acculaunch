from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import os 
import json

try:
    from dotenv import load_dotenv
    load_dotenv()
except Exception:
    pass

app = Flask(__name__)
CORS(app)

OPENWEATHER_API_KEY = os.getenv("OPENWEATHER_API_KEY")
BASE_URL = "https://api.openweathermap.org/data/2.5/weather"
FORECAST_URL = "https://api.openweathermap.org/data/2.5/forecast"
SETTINGS_FILE = "settings.json"

@app.route("/api/weather", methods=["GET"])
def get_weather():
    if not OPENWEATHER_API_KEY:
        return jsonify({"error": "Server missing OPENWEATHER_API_KEY"}), 500

    lat = request.args.get("lat")
    lon = request.args.get("lon")

    if not lat or not lon:
        return jsonify({"ERROR": "Provide lat + lon."}), 400

    params = {
        "lat": lat,
        "lon": lon,
        "appid": OPENWEATHER_API_KEY,
        "units": "imperial"
    }

    try:
        response = requests.get(BASE_URL, params=params, timeout=8)
        data = response.json()
    except requests.RequestException as e:
        return jsonify({"error": "Upstream request failed.", "detail": str(e)}), 502

    if response.status_code != 200 or "main" not in data:
        return jsonify({"error": "Could not fetch weather for that location."}), 404

    result = {
        "location": data.get("name", "Unknown"),
        "temperature": data["main"]["temp"],
        "humidity": data["main"]["humidity"],
        "pressure": data["main"]["pressure"],
        
        "wind_speed": data.get("wind", {}).get("speed", 0),
        "wind_gust": data.get("wind", {}).get("gust"),
        "visibility": data.get("visibility"),
        "rain": data.get("rain", {}).get("1h", 0),
        "cloud_cover": data.get("clouds", {}).get("all", 0),
        "clouds_all": data.get("clouds", {}).get("all"),

        "status": data["weather"][0]["description"], 
        "timestamp": data.get("dt", 0)

    }

    return jsonify(result), 200


@app.route("/api/launch/status", methods=["GET"])
def launch_status():

    if not OPENWEATHER_API_KEY:
        return jsonify({"error": "Server missing OPENWEATHER_API_KEY"}), 500

    lat = request.args.get("lat")
    lon = request.args.get("lon")

    if not lat or not lon:
        return jsonify({"ERROR": "Provide lat + lon."}), 400

    params = {
        "lat": lat,
        "lon": lon,
        "appid": OPENWEATHER_API_KEY,
        "units": "imperial"
    }

    try:
        response = requests.get(BASE_URL, params=params, timeout=8)
        data = response.json()
    except requests.RequestException as e:
        return jsonify({"error": "Upstream request failed.", "detail": str(e)}), 502

    if response.status_code != 200 or "main" not in data:
        return jsonify({"error": "Could not fetch weather for that location."}), 404

    # --- GO/NO-GO Decision Logic ---
    temp = safe_float(data["main"]["temp"])
    humidity = safe_float(data["main"]["humidity"])

    wind = safe_float(data.get("wind", {}).get("speed", 0) or 0)
    gust = safe_float(data.get("wind", {}).get("gust", 0) or 0)
    visibility = safe_float(data.get("visibility"))
    rain = safe_float(data.get("rain", {}).get("1h", 0))

    temp_min = safe_float(settings.get("temperature_min"), 0)
    temp_max = safe_float(settings.get("temperature_max"), 38)
    humidity_limit = safe_float(settings.get("humidity"), 90)

    wind_limit = safe_float(settings.get("wind_speed"), 20)
    gust_limit = safe_float(settings.get("wind_gust"), 30)
    visibility_min = safe_float(settings.get("visibility_min"), 1000)
    rain_max = safe_float(settings.get("rain"), 5)

    go_status = "GO"
    reasons = []

    if wind > wind_limit:
        go_status = "NO-GO"; reasons.append("Wind speed too high.")
    if gust > gust_limit:
        go_status = "NO-GO"; reasons.append("Wind gust too high.")
    if visibility < visibility_min:
        go_status = "NO-GO"; reasons.append("Visibility too low.")
    if rain > rain_max:
        go_status = "NO-GO"; reasons.append("Rain too heavy.")
    
    result = {
        "location": data.get("name", "Unknown"),
        "temperature": temp,
        "humidity": humidity,

        "wind_speed": wind,
        "wind_gust": gust,
        "visibility": visibility,
        "rain": rain,

        "decision": go_status,
        "reasons": reasons
    }

    return jsonify(result), 200

@app.route("/api/forecast", methods=["GET"])
def get_forecast():
    if not OPENWEATHER_API_KEY:
        return jsonify({"error": "Server missing OPEN_WEATHER_API_KEY"}), 500

    lat = request.args.get("lat")
    lon = request.args.get("lon")

    if not lat or not lon:
        return jsonify({"error": "Provide lat + lon."}), 400

    params = {
        "lat": lat, 
        "lon": lon,
        "appid": OPENWEATHER_API_KEY,
        "units": "imperial"
    }

    try:
        response = requests.get(FORECAST_URL, params=params, timeout=8)
        data = response.json()
    except requests.RequestException as e:
        return jsonify({"error": "Upstream forecast request failed", "detail": str(e)}), 502

    return jsonify(data), 200

def safe_float(value, default=0.0):
    try:
        return float(value)
    except (ValueError, TypeError):
        return default
    
def load_settings():
    if os.path.exists(SETTINGS_FILE):
        try: 
            with open(SETTINGS_FILE, 'r') as f:
                return json.load(f)
        except json.JSONDecodeError:
            pass
    
    return {
        "temperature": "",
        "wind_speed": "",
        "humidity": "",
        "mission_date": ""
    }

settings = load_settings()

def save_settings():
    with open(SETTINGS_FILE, "w") as f:
        json.dump(settings, f, indent=2)

@app.route("/api/settings", methods=["GET", "POST"])
def manage_settings():
    global settings
    if request.method == "POST":
        data = request.get_json()

        for key in ["temperature", "wind_speed", "humidity", "mission_date"]:
            if key in data: 
                settings[key] = data[key]
        save_settings()

        return jsonify(settings), 200
    return jsonify(settings), 200

if __name__ == "__main__":
    app.run(debug=True)
