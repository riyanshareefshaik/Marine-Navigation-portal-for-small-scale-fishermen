from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
from pydantic import BaseModel
import uvicorn
import datetime
import os
import httpx
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Marine Safety & Navigation API")

# Setup CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MongoDB Connection
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")
client = AsyncIOMotorClient(MONGO_URL)
db = client.marine_safety

# Dummy Pydantic models
class LocationData(BaseModel):
    id: str
    name: str
    lat: float
    lng: float
    waveHeight: float
    windSpeed: float
    seaTemperature: float
    visibility: float
    pressure: int
    humidity: int
    tide: float
    sunrise: str
    sunset: str
    status: str
    advisory: str
    windDirection: float
    waveDirection: float
    aqi: Optional[int] = None
    alerts: Optional[list] = []
    forecast14: Optional[list] = []


def get_safety_status(wave_height: float, wind_speed: float) -> tuple[str, str]:
    """Calculate status and advisory based on realtime marine inputs."""
    
    # DO NOT GO: Waves > 3.0m OR Wind > 45km/h
    if wave_height > 3.0 or wind_speed > 45.0:
        return ("DO NOT GO", "High winds and large waves. It is not safe to navigate!")
        
    # Caution: Waves > 2.0m OR Wind > 30km/h
    elif wave_height > 2.0 or wind_speed > 30.0:
        return ("Caution", "Moderate waves and gusts. Exercise caution during operations.")
        
    # Safe to Go
    else:
        return ("SAFE TO GO", "Conditions are optimal and safe for navigation.")


async def fetch_realtime_marine_data(loc: dict) -> dict:
    """Invokes WeatherAPI.com to fetch current realtime telemetry and forecasts for given lat/lng."""
    
    api_key = os.getenv("WEATHER_API_KEY")
    updated_loc = loc.copy()
    
    # If no key is provided, we gracefully fallback to the local mock data
    if not api_key:
        print(f"No WEATHER_API_KEY found. Falling back to mock data for {loc['name']}.")
        return updated_loc
        
    url = f"http://api.weatherapi.com/v1/forecast.json?key={api_key}&q={loc['lat']},{loc['lng']}&days=14&aqi=yes&alerts=yes"
    marine_url = f"http://api.weatherapi.com/v1/marine.json?key={api_key}&q={loc['lat']},{loc['lng']}&days=1"
    
    async with httpx.AsyncClient() as client:
        try:
            weather_res = await client.get(url, timeout=10.0)
            marine_res = await client.get(marine_url, timeout=10.0)
            
            if weather_res.status_code == 200 and marine_res.status_code == 200:
                weather_data = weather_res.json()
                marine_data = marine_res.json()
                
                current = weather_data.get("current", {})
                
                # Extract marine data (wave height/direction)
                forecast_day = marine_data.get("forecast", {}).get("forecastday", [])
                if forecast_day:
                    hour_data = forecast_day[0].get("hour", [])
                    # Just grab the first hour for simplicity of current wave data
                    if hour_data:
                        updated_loc["waveHeight"] = round(hour_data[0].get("sig_ht_mt", loc["waveHeight"]), 1)
                        updated_loc["waveDirection"] = round(hour_data[0].get("swell_dir", loc.get("waveDirection", 0.0)), 1)
                        # Note: WeatherAPI marine also has water_temp_c, but we can stick to current temp or grab it
                        updated_loc["seaTemperature"] = round(hour_data[0].get("water_temp_c", loc["seaTemperature"]), 1)
                
                updated_loc["windSpeed"] = round(current.get("wind_kph", loc["windSpeed"]), 1)
                updated_loc["windDirection"] = round(current.get("wind_degree", loc.get("windDirection", 0.0)), 1)
                updated_loc["visibility"] = round(current.get("vis_km", loc["visibility"]) / 1.852, 1) # Convert km to NM
                updated_loc["pressure"] = round(current.get("pressure_mb", loc["pressure"]))
                updated_loc["humidity"] = round(current.get("humidity", loc["humidity"]))
                
                # Add extra fields that WeatherAPI provides
                updated_loc["aqi"] = current.get("air_quality", {}).get("us-epa-index", 1)
                updated_loc["alerts"] = weather_data.get("alerts", {}).get("alert", [])
                
                # Add Forecast Data
                forecast_days = weather_data.get("forecast", {}).get("forecastday", [])
                forecast_mapped = []
                for day in forecast_days:
                    day_data = day.get("day", {})
                    astro_data = day.get("astro", {})
                    
                    forecast_mapped.append({
                        "date": day.get("date"),
                        "maxtemp_c": day_data.get("maxtemp_c"),
                        "mintemp_c": day_data.get("mintemp_c"),
                        "condition": day_data.get("condition", {}).get("text"),
                        "icon": day_data.get("condition", {}).get("icon"),
                        "daily_chance_of_rain": day_data.get("daily_chance_of_rain", 0),
                        "sunrise": astro_data.get("sunrise"),
                        "sunset": astro_data.get("sunset")
                    })
                updated_loc["forecast14"] = forecast_mapped
                
                # Calculate safety boundaries based on real data
                status, advisory = get_safety_status(updated_loc["waveHeight"], updated_loc["windSpeed"])
                updated_loc["status"] = status
                updated_loc["advisory"] = advisory
                
            else:
                 print(f"API Error: WeatherAPI returned {weather_res.status_code}. Falling back to mock values.")

        except Exception as e:
            print(f"Error fetching live data for {loc['name']}: {str(e)}. Falling back to mock values.")
            
    return updated_loc

# Comprehensive list of Indian Coastal Areas & Local Fishing Harbors
LOCATIONS = [
    # --- Gujarat ---
    {"id": "kandla", "name": "Kandla Port", "lat": 23.0033, "lng": 70.2195, "waveHeight": 1.2, "windSpeed": 15.0, "seaTemperature": 27.5, "visibility": 10.0, "pressure": 1010, "humidity": 75, "tide": 2.1, "sunrise": "06:58", "sunset": "18:55", "status": "SAFE TO GO", "advisory": "", "windDirection": 0.0, "waveDirection": 0.0},
    {"id": "mundra", "name": "Mundra", "lat": 22.8427, "lng": 69.7346, "waveHeight": 1.1, "windSpeed": 14.0, "seaTemperature": 27.8, "visibility": 11.0, "pressure": 1010, "humidity": 76, "tide": 2.0, "sunrise": "06:56", "sunset": "18:52", "status": "SAFE TO GO", "advisory": "", "windDirection": 0.0, "waveDirection": 0.0},
    {"id": "okha", "name": "Okha Port", "lat": 22.4633, "lng": 69.0706, "waveHeight": 1.4, "windSpeed": 18.0, "seaTemperature": 27.1, "visibility": 12.0, "pressure": 1011, "humidity": 78, "tide": 1.8, "sunrise": "06:59", "sunset": "18:56", "status": "SAFE TO GO", "advisory": "", "windDirection": 0.0, "waveDirection": 0.0},
    {"id": "dwarka", "name": "Dwarka", "lat": 22.2394, "lng": 68.9678, "waveHeight": 2.0, "windSpeed": 22.0, "seaTemperature": 26.9, "visibility": 11.0, "pressure": 1010, "humidity": 79, "tide": 1.6, "sunrise": "07:01", "sunset": "18:58", "status": "SAFE TO GO", "advisory": "", "windDirection": 0.0, "waveDirection": 0.0},
    {"id": "porbandar", "name": "Porbandar", "lat": 21.6417, "lng": 69.6293, "waveHeight": 2.8, "windSpeed": 35.0, "seaTemperature": 27.5, "visibility": 6.0, "pressure": 1008, "humidity": 83, "tide": 1.6, "sunrise": "06:55", "sunset": "18:50", "status": "Caution", "advisory": "", "windDirection": 0.0, "waveDirection": 0.0},
    {"id": "veraval", "name": "Veraval Harbor", "lat": 20.9037, "lng": 70.3667, "waveHeight": 2.5, "windSpeed": 30.0, "seaTemperature": 27.8, "visibility": 7.0, "pressure": 1009, "humidity": 80, "tide": 1.5, "sunrise": "06:52", "sunset": "18:48", "status": "Caution", "advisory": "", "windDirection": 0.0, "waveDirection": 0.0},
    {"id": "diu", "name": "Diu Fishery", "lat": 20.7144, "lng": 70.9874, "waveHeight": 1.6, "windSpeed": 16.0, "seaTemperature": 28.0, "visibility": 10.0, "pressure": 1011, "humidity": 78, "tide": 1.3, "sunrise": "06:50", "sunset": "18:45", "status": "SAFE TO GO", "advisory": "", "windDirection": 0.0, "waveDirection": 0.0},
    {"id": "bhavnagar", "name": "Bhavnagar", "lat": 21.7645, "lng": 72.1519, "waveHeight": 1.0, "windSpeed": 12.0, "seaTemperature": 28.3, "visibility": 10.0, "pressure": 1010, "humidity": 75, "tide": 2.5, "sunrise": "06:53", "sunset": "18:49", "status": "SAFE TO GO", "advisory": "", "windDirection": 0.0, "waveDirection": 0.0},

    # --- Maharashtra ---
    {"id": "dahanu", "name": "Dahanu", "lat": 19.9806, "lng": 72.7303, "waveHeight": 1.3, "windSpeed": 16.0, "seaTemperature": 27.5, "visibility": 10.0, "pressure": 1010, "humidity": 80, "tide": 1.7, "sunrise": "06:50", "sunset": "18:42", "status": "SAFE TO GO", "advisory": "", "windDirection": 0.0, "waveDirection": 0.0},
    {"id": "mumbai", "name": "Mumbai Port", "lat": 18.9220, "lng": 72.8347, "waveHeight": 3.5, "windSpeed": 45.0, "seaTemperature": 27.8, "visibility": 4.0, "pressure": 1005, "humidity": 85, "tide": 2.1, "sunrise": "06:50", "sunset": "18:45", "status": "DO NOT GO", "advisory": "", "windDirection": 0.0, "waveDirection": 0.0},
    {"id": "alibag", "name": "Alibag", "lat": 18.6416, "lng": 72.8722, "waveHeight": 1.8, "windSpeed": 20.0, "seaTemperature": 27.9, "visibility": 11.0, "pressure": 1011, "humidity": 82, "tide": 1.8, "sunrise": "06:48", "sunset": "18:44", "status": "SAFE TO GO", "advisory": "", "windDirection": 0.0, "waveDirection": 0.0},
    {"id": "murud", "name": "Murud-Janjira", "lat": 18.3284, "lng": 72.9642, "waveHeight": 1.7, "windSpeed": 18.0, "seaTemperature": 28.0, "visibility": 12.0, "pressure": 1010, "humidity": 80, "tide": 1.6, "sunrise": "06:46", "sunset": "18:42", "status": "SAFE TO GO", "advisory": "", "windDirection": 0.0, "waveDirection": 0.0},
    {"id": "ratnagiri", "name": "Ratnagiri", "lat": 16.9902, "lng": 73.3120, "waveHeight": 2.1, "windSpeed": 24.0, "seaTemperature": 28.1, "visibility": 9.0, "pressure": 1009, "humidity": 78, "tide": 1.5, "sunrise": "06:44", "sunset": "18:40", "status": "Caution", "advisory": "", "windDirection": 0.0, "waveDirection": 0.0},
    {"id": "malvan", "name": "Malvan Fishery", "lat": 16.0601, "lng": 73.4682, "waveHeight": 1.5, "windSpeed": 15.0, "seaTemperature": 28.2, "visibility": 12.0, "pressure": 1011, "humidity": 76, "tide": 1.1, "sunrise": "06:42", "sunset": "18:42", "status": "SAFE TO GO", "advisory": "", "windDirection": 0.0, "waveDirection": 0.0},
    {"id": "vengurla", "name": "Vengurla", "lat": 15.8617, "lng": 73.6334, "waveHeight": 1.4, "windSpeed": 14.0, "seaTemperature": 28.3, "visibility": 12.0, "pressure": 1011, "humidity": 75, "tide": 1.1, "sunrise": "06:41", "sunset": "18:41", "status": "SAFE TO GO", "advisory": "", "windDirection": 0.0, "waveDirection": 0.0},

    # --- Goa ---
    {"id": "goa", "name": "Goa (Panaji)", "lat": 15.4909, "lng": 73.8278, "waveHeight": 1.6, "windSpeed": 18.0, "seaTemperature": 28.5, "visibility": 12.0, "pressure": 1012, "humidity": 75, "tide": 1.0, "sunrise": "06:40", "sunset": "18:40", "status": "SAFE TO GO", "advisory": "", "windDirection": 0.0, "waveDirection": 0.0},
    {"id": "mormugao", "name": "Mormugao", "lat": 15.3986, "lng": 73.8058, "waveHeight": 1.7, "windSpeed": 20.0, "seaTemperature": 28.5, "visibility": 11.0, "pressure": 1011, "humidity": 76, "tide": 1.0, "sunrise": "06:39", "sunset": "18:39", "status": "SAFE TO GO", "advisory": "", "windDirection": 0.0, "waveDirection": 0.0},
    {"id": "canacona", "name": "Canacona", "lat": 15.0113, "lng": 74.0223, "waveHeight": 1.6, "windSpeed": 17.0, "seaTemperature": 28.6, "visibility": 12.0, "pressure": 1012, "humidity": 74, "tide": 1.0, "sunrise": "06:38", "sunset": "18:38", "status": "SAFE TO GO", "advisory": "", "windDirection": 0.0, "waveDirection": 0.0},

    # --- Karnataka ---
    {"id": "karwar", "name": "Karwar", "lat": 14.8053, "lng": 74.1332, "waveHeight": 1.5, "windSpeed": 16.0, "seaTemperature": 28.4, "visibility": 11.0, "pressure": 1010, "humidity": 77, "tide": 1.1, "sunrise": "06:36", "sunset": "18:36", "status": "SAFE TO GO", "advisory": "", "windDirection": 0.0, "waveDirection": 0.0},
    {"id": "gokarna", "name": "Gokarna", "lat": 14.5388, "lng": 74.3168, "waveHeight": 1.4, "windSpeed": 15.0, "seaTemperature": 28.5, "visibility": 12.0, "pressure": 1011, "humidity": 78, "tide": 1.1, "sunrise": "06:35", "sunset": "18:35", "status": "SAFE TO GO", "advisory": "", "windDirection": 0.0, "waveDirection": 0.0},
    {"id": "honnavar", "name": "Honnavar", "lat": 14.2798, "lng": 74.4439, "waveHeight": 1.6, "windSpeed": 18.0, "seaTemperature": 28.3, "visibility": 10.0, "pressure": 1010, "humidity": 79, "tide": 1.0, "sunrise": "06:34", "sunset": "18:34", "status": "SAFE TO GO", "advisory": "", "windDirection": 0.0, "waveDirection": 0.0},
    {"id": "bhatkal", "name": "Bhatkal", "lat": 13.9803, "lng": 74.5583, "waveHeight": 1.7, "windSpeed": 19.0, "seaTemperature": 28.4, "visibility": 9.0, "pressure": 1009, "humidity": 80, "tide": 1.2, "sunrise": "06:33", "sunset": "18:33", "status": "SAFE TO GO", "advisory": "", "windDirection": 0.0, "waveDirection": 0.0},
    {"id": "kundapura", "name": "Kundapura", "lat": 13.6272, "lng": 74.6931, "waveHeight": 1.5, "windSpeed": 17.0, "seaTemperature": 28.5, "visibility": 10.0, "pressure": 1011, "humidity": 77, "tide": 1.1, "sunrise": "06:32", "sunset": "18:32", "status": "SAFE TO GO", "advisory": "", "windDirection": 0.0, "waveDirection": 0.0},
    {"id": "malpe", "name": "Malpe Fishing Harbor", "lat": 13.3500, "lng": 74.6975, "waveHeight": 1.5, "windSpeed": 18.0, "seaTemperature": 28.5, "visibility": 11.0, "pressure": 1010, "humidity": 78, "tide": 1.2, "sunrise": "06:33", "sunset": "18:38", "status": "SAFE TO GO", "advisory": "", "windDirection": 0.0, "waveDirection": 0.0},
    {"id": "mangalore", "name": "Mangalore", "lat": 12.9141, "lng": 74.8560, "waveHeight": 1.9, "windSpeed": 22.0, "seaTemperature": 28.2, "visibility": 10.0, "pressure": 1010, "humidity": 79, "tide": 1.1, "sunrise": "06:30", "sunset": "18:35", "status": "SAFE TO GO", "advisory": "", "windDirection": 0.0, "waveDirection": 0.0},

    # --- Kerala ---
    {"id": "kasaragod", "name": "Kasaragod", "lat": 12.5085, "lng": 74.9904, "waveHeight": 1.7, "windSpeed": 20.0, "seaTemperature": 28.6, "visibility": 10.0, "pressure": 1011, "humidity": 80, "tide": 1.2, "sunrise": "06:28", "sunset": "18:33", "status": "SAFE TO GO", "advisory": "", "windDirection": 0.0, "waveDirection": 0.0},
    {"id": "kannur", "name": "Kannur", "lat": 11.8745, "lng": 75.3704, "waveHeight": 1.6, "windSpeed": 18.0, "seaTemperature": 28.7, "visibility": 11.0, "pressure": 1011, "humidity": 78, "tide": 1.1, "sunrise": "06:26", "sunset": "18:31", "status": "SAFE TO GO", "advisory": "", "windDirection": 0.0, "waveDirection": 0.0},
    {"id": "kozhikode", "name": "Kozhikode", "lat": 11.2588, "lng": 75.7804, "waveHeight": 1.5, "windSpeed": 16.0, "seaTemperature": 28.8, "visibility": 10.0, "pressure": 1010, "humidity": 81, "tide": 1.0, "sunrise": "06:24", "sunset": "18:29", "status": "SAFE TO GO", "advisory": "", "windDirection": 0.0, "waveDirection": 0.0},
    {"id": "kochi", "name": "Kochi", "lat": 9.9312, "lng": 76.2673, "waveHeight": 1.8, "windSpeed": 20.0, "seaTemperature": 28.9, "visibility": 11.0, "pressure": 1011, "humidity": 75, "tide": 1.0, "sunrise": "06:20", "sunset": "18:25", "status": "SAFE TO GO", "advisory": "", "windDirection": 0.0, "waveDirection": 0.0},
    {"id": "alappuzha", "name": "Alappuzha", "lat": 9.4981, "lng": 76.3388, "waveHeight": 1.7, "windSpeed": 19.0, "seaTemperature": 28.8, "visibility": 12.0, "pressure": 1012, "humidity": 76, "tide": 0.9, "sunrise": "06:18", "sunset": "18:24", "status": "SAFE TO GO", "advisory": "", "windDirection": 0.0, "waveDirection": 0.0},
    {"id": "kollam", "name": "Kollam", "lat": 8.8932, "lng": 76.6141, "waveHeight": 1.9, "windSpeed": 22.0, "seaTemperature": 28.7, "visibility": 10.0, "pressure": 1011, "humidity": 77, "tide": 0.9, "sunrise": "06:16", "sunset": "18:22", "status": "SAFE TO GO", "advisory": "", "windDirection": 0.0, "waveDirection": 0.0},
    {"id": "thiruvananthapuram", "name": "Thiruvananthapuram", "lat": 8.5241, "lng": 76.9366, "waveHeight": 2.0, "windSpeed": 23.0, "seaTemperature": 28.6, "visibility": 9.0, "pressure": 1010, "humidity": 79, "tide": 1.0, "sunrise": "06:15", "sunset": "18:21", "status": "Caution", "advisory": "", "windDirection": 0.0, "waveDirection": 0.0},

    # --- Tamil Nadu ---
    {"id": "kanyakumari", "name": "Kanyakumari", "lat": 8.0883, "lng": 77.5385, "waveHeight": 2.3, "windSpeed": 28.0, "seaTemperature": 28.7, "visibility": 9.0, "pressure": 1010, "humidity": 82, "tide": 1.4, "sunrise": "06:25", "sunset": "18:30", "status": "Caution", "advisory": "", "windDirection": 0.0, "waveDirection": 0.0},
    {"id": "tuticorin", "name": "Tuticorin (Thoothukudi)", "lat": 8.7642, "lng": 78.1348, "waveHeight": 1.4, "windSpeed": 19.0, "seaTemperature": 29.3, "visibility": 13.0, "pressure": 1011, "humidity": 74, "tide": 0.9, "sunrise": "06:22", "sunset": "18:27", "status": "SAFE TO GO", "advisory": "", "windDirection": 0.0, "waveDirection": 0.0},
    {"id": "rameswaram", "name": "Rameswaram", "lat": 9.2876, "lng": 79.3129, "waveHeight": 1.1, "windSpeed": 12.0, "seaTemperature": 29.5, "visibility": 15.0, "pressure": 1011, "humidity": 76, "tide": 0.8, "sunrise": "06:15", "sunset": "18:22", "status": "SAFE TO GO", "advisory": "", "windDirection": 0.0, "waveDirection": 0.0},
    {"id": "nagapattinam", "name": "Nagapattinam", "lat": 10.7656, "lng": 79.8424, "waveHeight": 1.5, "windSpeed": 16.0, "seaTemperature": 29.2, "visibility": 11.0, "pressure": 1010, "humidity": 79, "tide": 0.9, "sunrise": "06:12", "sunset": "18:18", "status": "SAFE TO GO", "advisory": "", "windDirection": 0.0, "waveDirection": 0.0},
    {"id": "karaikal", "name": "Karaikal", "lat": 10.9254, "lng": 79.8380, "waveHeight": 1.4, "windSpeed": 15.0, "seaTemperature": 29.3, "visibility": 12.0, "pressure": 1011, "humidity": 78, "tide": 0.8, "sunrise": "06:11", "sunset": "18:17", "status": "SAFE TO GO", "advisory": "", "windDirection": 0.0, "waveDirection": 0.0},
    {"id": "cuddalore", "name": "Cuddalore", "lat": 11.7480, "lng": 79.7714, "waveHeight": 1.3, "windSpeed": 14.0, "seaTemperature": 29.1, "visibility": 13.0, "pressure": 1011, "humidity": 77, "tide": 1.0, "sunrise": "06:10", "sunset": "18:16", "status": "SAFE TO GO", "advisory": "", "windDirection": 0.0, "waveDirection": 0.0},
    {"id": "puducherry", "name": "Puducherry", "lat": 11.9416, "lng": 79.8083, "waveHeight": 1.4, "windSpeed": 15.0, "seaTemperature": 29.2, "visibility": 12.0, "pressure": 1012, "humidity": 76, "tide": 0.9, "sunrise": "06:09", "sunset": "18:15", "status": "SAFE TO GO", "advisory": "", "windDirection": 0.0, "waveDirection": 0.0},
    {"id": "chennai", "name": "Chennai", "lat": 13.0827, "lng": 80.2707, "waveHeight": 1.4, "windSpeed": 15.0, "seaTemperature": 29.1, "visibility": 12.0, "pressure": 1010, "humidity": 80, "tide": 0.9, "sunrise": "06:10", "sunset": "18:15", "status": "SAFE TO GO", "advisory": "", "windDirection": 0.0, "waveDirection": 0.0},
    {"id": "kasimedu", "name": "Kasimedu Fishing Harbor", "lat": 13.1251, "lng": 80.2982, "waveHeight": 1.3, "windSpeed": 15.0, "seaTemperature": 29.1, "visibility": 11.0, "pressure": 1010, "humidity": 81, "tide": 0.9, "sunrise": "06:10", "sunset": "18:15", "status": "SAFE TO GO", "advisory": "", "windDirection": 0.0, "waveDirection": 0.0},
    {"id": "ennore", "name": "Ennore Creek", "lat": 13.2120, "lng": 80.3236, "waveHeight": 1.2, "windSpeed": 14.0, "seaTemperature": 29.2, "visibility": 10.0, "pressure": 1010, "humidity": 82, "tide": 1.0, "sunrise": "06:09", "sunset": "18:14", "status": "SAFE TO GO", "advisory": "", "windDirection": 0.0, "waveDirection": 0.0},
    {"id": "pulicat", "name": "Pulicat", "lat": 13.4182, "lng": 80.3168, "waveHeight": 1.3, "windSpeed": 14.0, "seaTemperature": 29.1, "visibility": 11.0, "pressure": 1010, "humidity": 80, "tide": 1.1, "sunrise": "06:08", "sunset": "18:13", "status": "SAFE TO GO", "advisory": "", "windDirection": 0.0, "waveDirection": 0.0},

    # --- Andhra Pradesh ---
    {"id": "krishnapatnam", "name": "Krishnapatnam", "lat": 14.2492, "lng": 80.1415, "waveHeight": 1.5, "windSpeed": 16.0, "seaTemperature": 29.0, "visibility": 10.0, "pressure": 1011, "humidity": 79, "tide": 1.2, "sunrise": "06:07", "sunset": "18:12", "status": "SAFE TO GO", "advisory": "", "windDirection": 0.0, "waveDirection": 0.0},
    {"id": "nizampatnam", "name": "Nizampatnam", "lat": 15.8973, "lng": 80.6698, "waveHeight": 1.4, "windSpeed": 15.0, "seaTemperature": 29.0, "visibility": 11.0, "pressure": 1010, "humidity": 79, "tide": 1.1, "sunrise": "06:06", "sunset": "18:13", "status": "SAFE TO GO", "advisory": "", "windDirection": 0.0, "waveDirection": 0.0},
    {"id": "machilipatnam", "name": "Machilipatnam", "lat": 16.1833, "lng": 81.1333, "waveHeight": 1.7, "windSpeed": 16.0, "seaTemperature": 29.0, "visibility": 11.0, "pressure": 1009, "humidity": 81, "tide": 1.3, "sunrise": "06:08", "sunset": "18:18", "status": "SAFE TO GO", "advisory": "", "windDirection": 0.0, "waveDirection": 0.0},
    {"id": "kakinada", "name": "Kakinada", "lat": 16.9891, "lng": 82.2475, "waveHeight": 1.6, "windSpeed": 18.0, "seaTemperature": 28.8, "visibility": 12.0, "pressure": 1011, "humidity": 78, "tide": 1.2, "sunrise": "06:03", "sunset": "18:12", "status": "SAFE TO GO", "advisory": "", "windDirection": 0.0, "waveDirection": 0.0},
    {"id": "visakhapatnam", "name": "Visakhapatnam", "lat": 17.6868, "lng": 83.2185, "waveHeight": 2.1, "windSpeed": 25.5, "seaTemperature": 28.4, "visibility": 10.0, "pressure": 1012, "humidity": 78, "tide": 1.2, "sunrise": "06:05", "sunset": "18:20", "status": "Caution", "advisory": "", "windDirection": 0.0, "waveDirection": 0.0},
    {"id": "bheemili", "name": "Bheemunipatnam", "lat": 17.8893, "lng": 83.4542, "waveHeight": 2.2, "windSpeed": 26.0, "seaTemperature": 28.3, "visibility": 9.0, "pressure": 1011, "humidity": 79, "tide": 1.2, "sunrise": "06:04", "sunset": "18:19", "status": "Caution", "advisory": "", "windDirection": 0.0, "waveDirection": 0.0},
    {"id": "kalingapatnam", "name": "Kalingapatnam", "lat": 18.3333, "lng": 84.1167, "waveHeight": 2.0, "windSpeed": 23.0, "seaTemperature": 28.5, "visibility": 10.0, "pressure": 1010, "humidity": 80, "tide": 1.3, "sunrise": "06:02", "sunset": "18:16", "status": "Caution", "advisory": "", "windDirection": 0.0, "waveDirection": 0.0},

    # --- Odisha ---
    {"id": "gopalpur", "name": "Gopalpur", "lat": 19.2618, "lng": 84.9082, "waveHeight": 2.5, "windSpeed": 28.0, "seaTemperature": 28.2, "visibility": 8.0, "pressure": 1009, "humidity": 82, "tide": 1.4, "sunrise": "06:01", "sunset": "18:14", "status": "Caution", "advisory": "", "windDirection": 0.0, "waveDirection": 0.0},
    {"id": "puri", "name": "Puri Beach", "lat": 19.7983, "lng": 85.8245, "waveHeight": 2.8, "windSpeed": 32.0, "seaTemperature": 28.1, "visibility": 7.0, "pressure": 1008, "humidity": 85, "tide": 1.6, "sunrise": "05:58", "sunset": "18:12", "status": "Caution", "advisory": "", "windDirection": 0.0, "waveDirection": 0.0},
    {"id": "paradip", "name": "Paradip", "lat": 20.2638, "lng": 86.6669, "waveHeight": 3.2, "windSpeed": 40.0, "seaTemperature": 28.0, "visibility": 5.0, "pressure": 1006, "humidity": 88, "tide": 1.8, "sunrise": "05:55", "sunset": "18:10", "status": "DO NOT GO", "advisory": "", "windDirection": 0.0, "waveDirection": 0.0},
    {"id": "dhamra", "name": "Dhamra Port", "lat": 20.7937, "lng": 86.9535, "waveHeight": 2.4, "windSpeed": 26.0, "seaTemperature": 28.1, "visibility": 9.0, "pressure": 1009, "humidity": 83, "tide": 1.9, "sunrise": "05:56", "sunset": "18:11", "status": "Caution", "advisory": "", "windDirection": 0.0, "waveDirection": 0.0},
    {"id": "chandipur", "name": "Chandipur", "lat": 21.4429, "lng": 87.0519, "waveHeight": 1.5, "windSpeed": 18.0, "seaTemperature": 28.3, "visibility": 10.0, "pressure": 1010, "humidity": 80, "tide": 2.2, "sunrise": "05:54", "sunset": "18:09", "status": "SAFE TO GO", "advisory": "", "windDirection": 0.0, "waveDirection": 0.0},

    # --- West Bengal ---
    {"id": "digha", "name": "Digha Coast", "lat": 21.6266, "lng": 87.5074, "waveHeight": 1.6, "windSpeed": 18.0, "seaTemperature": 28.6, "visibility": 9.0, "pressure": 1009, "humidity": 84, "tide": 2.0, "sunrise": "05:52", "sunset": "18:08", "status": "SAFE TO GO", "advisory": "", "windDirection": 0.0, "waveDirection": 0.0},
    {"id": "bakkhali", "name": "Bakkhali", "lat": 21.5647, "lng": 88.2618, "waveHeight": 1.8, "windSpeed": 20.0, "seaTemperature": 28.5, "visibility": 10.0, "pressure": 1010, "humidity": 82, "tide": 2.1, "sunrise": "05:50", "sunset": "18:05", "status": "SAFE TO GO", "advisory": "", "windDirection": 0.0, "waveDirection": 0.0},
    {"id": "haldia", "name": "Haldia", "lat": 22.0667, "lng": 88.0698, "waveHeight": 1.3, "windSpeed": 14.0, "seaTemperature": 28.8, "visibility": 8.0, "pressure": 1010, "humidity": 85, "tide": 2.5, "sunrise": "05:50", "sunset": "18:05", "status": "SAFE TO GO", "advisory": "", "windDirection": 0.0, "waveDirection": 0.0},
    {"id": "sagar", "name": "Sagar Island", "lat": 21.7317, "lng": 88.1362, "waveHeight": 1.9, "windSpeed": 22.0, "seaTemperature": 28.4, "visibility": 9.0, "pressure": 1008, "humidity": 86, "tide": 2.3, "sunrise": "05:51", "sunset": "18:06", "status": "SAFE TO GO", "advisory": "", "windDirection": 0.0, "waveDirection": 0.0},
    
    # --- Andaman & Nicobar / Lakshadweep ---
    {"id": "portblair", "name": "Port Blair (Andaman)", "lat": 11.6234, "lng": 92.7265, "waveHeight": 2.2, "windSpeed": 25.0, "seaTemperature": 29.5, "visibility": 10.0, "pressure": 1009, "humidity": 85, "tide": 1.5, "sunrise": "05:30", "sunset": "17:40", "status": "Caution", "advisory": "", "windDirection": 0.0, "waveDirection": 0.0},
    {"id": "havelock", "name": "Havelock Island", "lat": 11.9761, "lng": 92.9876, "waveHeight": 2.0, "windSpeed": 22.0, "seaTemperature": 29.6, "visibility": 11.0, "pressure": 1010, "humidity": 83, "tide": 1.4, "sunrise": "05:28", "sunset": "17:39", "status": "SAFE TO GO", "advisory": "", "windDirection": 0.0, "waveDirection": 0.0},
    {"id": "kavaratti", "name": "Kavaratti (Lakshadweep)", "lat": 10.5667, "lng": 72.6369, "waveHeight": 1.5, "windSpeed": 15.0, "seaTemperature": 29.8, "visibility": 14.0, "pressure": 1011, "humidity": 75, "tide": 1.1, "sunrise": "06:45", "sunset": "18:45", "status": "SAFE TO GO", "advisory": "", "windDirection": 0.0, "waveDirection": 0.0},
    {"id": "minicoy", "name": "Minicoy Island", "lat": 8.2818, "lng": 73.0489, "waveHeight": 1.6, "windSpeed": 17.0, "seaTemperature": 29.7, "visibility": 13.0, "pressure": 1010, "humidity": 76, "tide": 1.2, "sunrise": "06:40", "sunset": "18:40", "status": "SAFE TO GO", "advisory": "", "windDirection": 0.0, "waveDirection": 0.0},
]


import asyncio

@app.on_event("startup")
async def startup_db():
    count = await db.locations.count_documents({})
    if count == 0:
        print("Seeding locations database with realtime telemetry...")
        
        # Concurrently fetch real-time data for all mocked locations
        async_tasks = [fetch_realtime_marine_data(loc) for loc in LOCATIONS]
        enriched_locations = await asyncio.gather(*async_tasks)
        
        # Insert the enriched data models
        await db.locations.insert_many(enriched_locations)
        print(f"Successfully seeded {len(enriched_locations)} enriched locations into the DB!")

@app.get("/api/locations", response_model=List[LocationData])
async def get_locations():
    cursor = db.locations.find({}, {"_id": 0})
    locations = await cursor.to_list(length=100)
    return locations

@app.get("/api/locations/{location_id}", response_model=LocationData)
async def get_location(location_id: str):
    loc = await db.locations.find_one({"id": location_id}, {"_id": 0})
    return loc or {}

class SOSRequest(BaseModel):
    contactNumber: str
    lat: float
    lng: float
    message: Optional[str] = "Emergency SOS Alert"

@app.post("/api/sos")
async def send_sos_alert(req: SOSRequest):
    alert_doc = {
        "contactNumber": req.contactNumber,
        "lat": req.lat,
        "lng": req.lng,
        "message": req.message,
        "timestamp": datetime.datetime.now().isoformat()
    }
    
    # Store in DB
    result = await db.sos_alerts.insert_one(alert_doc)
    
    # Mock SMS sending
    print("=" * 40)
    print("🚨 [MOCK SMS ALERT SENT] 🚨")
    print(f"To: {req.contactNumber}")
    print(f"Location: Lat {req.lat}, Lng {req.lng}")
    print(f"Message: {req.message}")
    print("=" * 40)
    
    return {"status": "success", "alert_id": str(result.inserted_id)}

@app.get("/api/history")
def get_history():
    # Generate some dummy history
    history = []
    base_date = datetime.datetime.now()
    for i in range(20):
        # alternate locations
        loc = LOCATIONS[i % len(LOCATIONS)]
        history.append({
            "id": f"hist_{i}",
            "date": (base_date - datetime.timedelta(days=i)).isoformat(),
            "location": loc["name"],
            "lat": loc["lat"],
            "lng": loc["lng"],
            "waveHeight": loc["waveHeight"] + (i * 0.1 % 0.5), # slight variation
            "windSpeed": loc["windSpeed"] + (i % 5),
            "seaTemperature": loc["seaTemperature"] - (i * 0.05 % 0.5),
            "status": loc["status"]
        })
    return history

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
