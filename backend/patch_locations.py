import re

new_locations = """# Comprehensive list of Indian Coastal Areas & Local Fishing Harbors
LOCATIONS = [
    # --- Gujarat ---
    {"id": "kandla", "name": "Kandla Port", "lat": 23.0033, "lng": 70.2195, "waveHeight": 1.2, "windSpeed": 15.0, "seaTemperature": 27.5, "visibility": 10.0, "pressure": 1010, "humidity": 75, "tide": 2.1, "sunrise": "06:58", "sunset": "18:55", "status": "SAFE TO GO", "advisory": ""},
    {"id": "mundra", "name": "Mundra", "lat": 22.8427, "lng": 69.7346, "waveHeight": 1.1, "windSpeed": 14.0, "seaTemperature": 27.8, "visibility": 11.0, "pressure": 1010, "humidity": 76, "tide": 2.0, "sunrise": "06:56", "sunset": "18:52", "status": "SAFE TO GO", "advisory": ""},
    {"id": "okha", "name": "Okha Port", "lat": 22.4633, "lng": 69.0706, "waveHeight": 1.4, "windSpeed": 18.0, "seaTemperature": 27.1, "visibility": 12.0, "pressure": 1011, "humidity": 78, "tide": 1.8, "sunrise": "06:59", "sunset": "18:56", "status": "SAFE TO GO", "advisory": ""},
    {"id": "dwarka", "name": "Dwarka", "lat": 22.2394, "lng": 68.9678, "waveHeight": 2.0, "windSpeed": 22.0, "seaTemperature": 26.9, "visibility": 11.0, "pressure": 1010, "humidity": 79, "tide": 1.6, "sunrise": "07:01", "sunset": "18:58", "status": "SAFE TO GO", "advisory": ""},
    {"id": "porbandar", "name": "Porbandar", "lat": 21.6417, "lng": 69.6293, "waveHeight": 2.8, "windSpeed": 35.0, "seaTemperature": 27.5, "visibility": 6.0, "pressure": 1008, "humidity": 83, "tide": 1.6, "sunrise": "06:55", "sunset": "18:50", "status": "Caution", "advisory": ""},
    {"id": "veraval", "name": "Veraval Harbor", "lat": 20.9037, "lng": 70.3667, "waveHeight": 2.5, "windSpeed": 30.0, "seaTemperature": 27.8, "visibility": 7.0, "pressure": 1009, "humidity": 80, "tide": 1.5, "sunrise": "06:52", "sunset": "18:48", "status": "Caution", "advisory": ""},
    {"id": "diu", "name": "Diu Fishery", "lat": 20.7144, "lng": 70.9874, "waveHeight": 1.6, "windSpeed": 16.0, "seaTemperature": 28.0, "visibility": 10.0, "pressure": 1011, "humidity": 78, "tide": 1.3, "sunrise": "06:50", "sunset": "18:45", "status": "SAFE TO GO", "advisory": ""},
    {"id": "bhavnagar", "name": "Bhavnagar", "lat": 21.7645, "lng": 72.1519, "waveHeight": 1.0, "windSpeed": 12.0, "seaTemperature": 28.3, "visibility": 10.0, "pressure": 1010, "humidity": 75, "tide": 2.5, "sunrise": "06:53", "sunset": "18:49", "status": "SAFE TO GO", "advisory": ""},

    # --- Maharashtra ---
    {"id": "dahanu", "name": "Dahanu", "lat": 19.9806, "lng": 72.7303, "waveHeight": 1.3, "windSpeed": 16.0, "seaTemperature": 27.5, "visibility": 10.0, "pressure": 1010, "humidity": 80, "tide": 1.7, "sunrise": "06:50", "sunset": "18:42", "status": "SAFE TO GO", "advisory": ""},
    {"id": "mumbai", "name": "Mumbai Port", "lat": 18.9220, "lng": 72.8347, "waveHeight": 3.5, "windSpeed": 45.0, "seaTemperature": 27.8, "visibility": 4.0, "pressure": 1005, "humidity": 85, "tide": 2.1, "sunrise": "06:50", "sunset": "18:45", "status": "DO NOT GO", "advisory": ""},
    {"id": "alibag", "name": "Alibag", "lat": 18.6416, "lng": 72.8722, "waveHeight": 1.8, "windSpeed": 20.0, "seaTemperature": 27.9, "visibility": 11.0, "pressure": 1011, "humidity": 82, "tide": 1.8, "sunrise": "06:48", "sunset": "18:44", "status": "SAFE TO GO", "advisory": ""},
    {"id": "murud", "name": "Murud-Janjira", "lat": 18.3284, "lng": 72.9642, "waveHeight": 1.7, "windSpeed": 18.0, "seaTemperature": 28.0, "visibility": 12.0, "pressure": 1010, "humidity": 80, "tide": 1.6, "sunrise": "06:46", "sunset": "18:42", "status": "SAFE TO GO", "advisory": ""},
    {"id": "ratnagiri", "name": "Ratnagiri", "lat": 16.9902, "lng": 73.3120, "waveHeight": 2.1, "windSpeed": 24.0, "seaTemperature": 28.1, "visibility": 9.0, "pressure": 1009, "humidity": 78, "tide": 1.5, "sunrise": "06:44", "sunset": "18:40", "status": "Caution", "advisory": ""},
    {"id": "malvan", "name": "Malvan Fishery", "lat": 16.0601, "lng": 73.4682, "waveHeight": 1.5, "windSpeed": 15.0, "seaTemperature": 28.2, "visibility": 12.0, "pressure": 1011, "humidity": 76, "tide": 1.1, "sunrise": "06:42", "sunset": "18:42", "status": "SAFE TO GO", "advisory": ""},
    {"id": "vengurla", "name": "Vengurla", "lat": 15.8617, "lng": 73.6334, "waveHeight": 1.4, "windSpeed": 14.0, "seaTemperature": 28.3, "visibility": 12.0, "pressure": 1011, "humidity": 75, "tide": 1.1, "sunrise": "06:41", "sunset": "18:41", "status": "SAFE TO GO", "advisory": ""},

    # --- Goa ---
    {"id": "goa", "name": "Goa (Panaji)", "lat": 15.4909, "lng": 73.8278, "waveHeight": 1.6, "windSpeed": 18.0, "seaTemperature": 28.5, "visibility": 12.0, "pressure": 1012, "humidity": 75, "tide": 1.0, "sunrise": "06:40", "sunset": "18:40", "status": "SAFE TO GO", "advisory": ""},
    {"id": "mormugao", "name": "Mormugao", "lat": 15.3986, "lng": 73.8058, "waveHeight": 1.7, "windSpeed": 20.0, "seaTemperature": 28.5, "visibility": 11.0, "pressure": 1011, "humidity": 76, "tide": 1.0, "sunrise": "06:39", "sunset": "18:39", "status": "SAFE TO GO", "advisory": ""},
    {"id": "canacona", "name": "Canacona", "lat": 15.0113, "lng": 74.0223, "waveHeight": 1.6, "windSpeed": 17.0, "seaTemperature": 28.6, "visibility": 12.0, "pressure": 1012, "humidity": 74, "tide": 1.0, "sunrise": "06:38", "sunset": "18:38", "status": "SAFE TO GO", "advisory": ""},

    # --- Karnataka ---
    {"id": "karwar", "name": "Karwar", "lat": 14.8053, "lng": 74.1332, "waveHeight": 1.5, "windSpeed": 16.0, "seaTemperature": 28.4, "visibility": 11.0, "pressure": 1010, "humidity": 77, "tide": 1.1, "sunrise": "06:36", "sunset": "18:36", "status": "SAFE TO GO", "advisory": ""},
    {"id": "gokarna", "name": "Gokarna", "lat": 14.5388, "lng": 74.3168, "waveHeight": 1.4, "windSpeed": 15.0, "seaTemperature": 28.5, "visibility": 12.0, "pressure": 1011, "humidity": 78, "tide": 1.1, "sunrise": "06:35", "sunset": "18:35", "status": "SAFE TO GO", "advisory": ""},
    {"id": "honnavar", "name": "Honnavar", "lat": 14.2798, "lng": 74.4439, "waveHeight": 1.6, "windSpeed": 18.0, "seaTemperature": 28.3, "visibility": 10.0, "pressure": 1010, "humidity": 79, "tide": 1.0, "sunrise": "06:34", "sunset": "18:34", "status": "SAFE TO GO", "advisory": ""},
    {"id": "bhatkal", "name": "Bhatkal", "lat": 13.9803, "lng": 74.5583, "waveHeight": 1.7, "windSpeed": 19.0, "seaTemperature": 28.4, "visibility": 9.0, "pressure": 1009, "humidity": 80, "tide": 1.2, "sunrise": "06:33", "sunset": "18:33", "status": "SAFE TO GO", "advisory": ""},
    {"id": "kundapura", "name": "Kundapura", "lat": 13.6272, "lng": 74.6931, "waveHeight": 1.5, "windSpeed": 17.0, "seaTemperature": 28.5, "visibility": 10.0, "pressure": 1011, "humidity": 77, "tide": 1.1, "sunrise": "06:32", "sunset": "18:32", "status": "SAFE TO GO", "advisory": ""},
    {"id": "malpe", "name": "Malpe Fishing Harbor", "lat": 13.3500, "lng": 74.6975, "waveHeight": 1.5, "windSpeed": 18.0, "seaTemperature": 28.5, "visibility": 11.0, "pressure": 1010, "humidity": 78, "tide": 1.2, "sunrise": "06:33", "sunset": "18:38", "status": "SAFE TO GO", "advisory": ""},
    {"id": "mangalore", "name": "Mangalore", "lat": 12.9141, "lng": 74.8560, "waveHeight": 1.9, "windSpeed": 22.0, "seaTemperature": 28.2, "visibility": 10.0, "pressure": 1010, "humidity": 79, "tide": 1.1, "sunrise": "06:30", "sunset": "18:35", "status": "SAFE TO GO", "advisory": ""},

    # --- Kerala ---
    {"id": "kasaragod", "name": "Kasaragod", "lat": 12.5085, "lng": 74.9904, "waveHeight": 1.7, "windSpeed": 20.0, "seaTemperature": 28.6, "visibility": 10.0, "pressure": 1011, "humidity": 80, "tide": 1.2, "sunrise": "06:28", "sunset": "18:33", "status": "SAFE TO GO", "advisory": ""},
    {"id": "kannur", "name": "Kannur", "lat": 11.8745, "lng": 75.3704, "waveHeight": 1.6, "windSpeed": 18.0, "seaTemperature": 28.7, "visibility": 11.0, "pressure": 1011, "humidity": 78, "tide": 1.1, "sunrise": "06:26", "sunset": "18:31", "status": "SAFE TO GO", "advisory": ""},
    {"id": "kozhikode", "name": "Kozhikode", "lat": 11.2588, "lng": 75.7804, "waveHeight": 1.5, "windSpeed": 16.0, "seaTemperature": 28.8, "visibility": 10.0, "pressure": 1010, "humidity": 81, "tide": 1.0, "sunrise": "06:24", "sunset": "18:29", "status": "SAFE TO GO", "advisory": ""},
    {"id": "kochi", "name": "Kochi", "lat": 9.9312, "lng": 76.2673, "waveHeight": 1.8, "windSpeed": 20.0, "seaTemperature": 28.9, "visibility": 11.0, "pressure": 1011, "humidity": 75, "tide": 1.0, "sunrise": "06:20", "sunset": "18:25", "status": "SAFE TO GO", "advisory": ""},
    {"id": "alappuzha", "name": "Alappuzha", "lat": 9.4981, "lng": 76.3388, "waveHeight": 1.7, "windSpeed": 19.0, "seaTemperature": 28.8, "visibility": 12.0, "pressure": 1012, "humidity": 76, "tide": 0.9, "sunrise": "06:18", "sunset": "18:24", "status": "SAFE TO GO", "advisory": ""},
    {"id": "kollam", "name": "Kollam", "lat": 8.8932, "lng": 76.6141, "waveHeight": 1.9, "windSpeed": 22.0, "seaTemperature": 28.7, "visibility": 10.0, "pressure": 1011, "humidity": 77, "tide": 0.9, "sunrise": "06:16", "sunset": "18:22", "status": "SAFE TO GO", "advisory": ""},
    {"id": "thiruvananthapuram", "name": "Thiruvananthapuram", "lat": 8.5241, "lng": 76.9366, "waveHeight": 2.0, "windSpeed": 23.0, "seaTemperature": 28.6, "visibility": 9.0, "pressure": 1010, "humidity": 79, "tide": 1.0, "sunrise": "06:15", "sunset": "18:21", "status": "Caution", "advisory": ""},

    # --- Tamil Nadu ---
    {"id": "kanyakumari", "name": "Kanyakumari", "lat": 8.0883, "lng": 77.5385, "waveHeight": 2.3, "windSpeed": 28.0, "seaTemperature": 28.7, "visibility": 9.0, "pressure": 1010, "humidity": 82, "tide": 1.4, "sunrise": "06:25", "sunset": "18:30", "status": "Caution", "advisory": ""},
    {"id": "tuticorin", "name": "Tuticorin (Thoothukudi)", "lat": 8.7642, "lng": 78.1348, "waveHeight": 1.4, "windSpeed": 19.0, "seaTemperature": 29.3, "visibility": 13.0, "pressure": 1011, "humidity": 74, "tide": 0.9, "sunrise": "06:22", "sunset": "18:27", "status": "SAFE TO GO", "advisory": ""},
    {"id": "rameswaram", "name": "Rameswaram", "lat": 9.2876, "lng": 79.3129, "waveHeight": 1.1, "windSpeed": 12.0, "seaTemperature": 29.5, "visibility": 15.0, "pressure": 1011, "humidity": 76, "tide": 0.8, "sunrise": "06:15", "sunset": "18:22", "status": "SAFE TO GO", "advisory": ""},
    {"id": "nagapattinam", "name": "Nagapattinam", "lat": 10.7656, "lng": 79.8424, "waveHeight": 1.5, "windSpeed": 16.0, "seaTemperature": 29.2, "visibility": 11.0, "pressure": 1010, "humidity": 79, "tide": 0.9, "sunrise": "06:12", "sunset": "18:18", "status": "SAFE TO GO", "advisory": ""},
    {"id": "karaikal", "name": "Karaikal", "lat": 10.9254, "lng": 79.8380, "waveHeight": 1.4, "windSpeed": 15.0, "seaTemperature": 29.3, "visibility": 12.0, "pressure": 1011, "humidity": 78, "tide": 0.8, "sunrise": "06:11", "sunset": "18:17", "status": "SAFE TO GO", "advisory": ""},
    {"id": "cuddalore", "name": "Cuddalore", "lat": 11.7480, "lng": 79.7714, "waveHeight": 1.3, "windSpeed": 14.0, "seaTemperature": 29.1, "visibility": 13.0, "pressure": 1011, "humidity": 77, "tide": 1.0, "sunrise": "06:10", "sunset": "18:16", "status": "SAFE TO GO", "advisory": ""},
    {"id": "puducherry", "name": "Puducherry", "lat": 11.9416, "lng": 79.8083, "waveHeight": 1.4, "windSpeed": 15.0, "seaTemperature": 29.2, "visibility": 12.0, "pressure": 1012, "humidity": 76, "tide": 0.9, "sunrise": "06:09", "sunset": "18:15", "status": "SAFE TO GO", "advisory": ""},
    {"id": "chennai", "name": "Chennai", "lat": 13.0827, "lng": 80.2707, "waveHeight": 1.4, "windSpeed": 15.0, "seaTemperature": 29.1, "visibility": 12.0, "pressure": 1010, "humidity": 80, "tide": 0.9, "sunrise": "06:10", "sunset": "18:15", "status": "SAFE TO GO", "advisory": ""},
    {"id": "kasimedu", "name": "Kasimedu Fishing Harbor", "lat": 13.1251, "lng": 80.2982, "waveHeight": 1.3, "windSpeed": 15.0, "seaTemperature": 29.1, "visibility": 11.0, "pressure": 1010, "humidity": 81, "tide": 0.9, "sunrise": "06:10", "sunset": "18:15", "status": "SAFE TO GO", "advisory": ""},
    {"id": "ennore", "name": "Ennore Creek", "lat": 13.2120, "lng": 80.3236, "waveHeight": 1.2, "windSpeed": 14.0, "seaTemperature": 29.2, "visibility": 10.0, "pressure": 1010, "humidity": 82, "tide": 1.0, "sunrise": "06:09", "sunset": "18:14", "status": "SAFE TO GO", "advisory": ""},
    {"id": "pulicat", "name": "Pulicat", "lat": 13.4182, "lng": 80.3168, "waveHeight": 1.3, "windSpeed": 14.0, "seaTemperature": 29.1, "visibility": 11.0, "pressure": 1010, "humidity": 80, "tide": 1.1, "sunrise": "06:08", "sunset": "18:13", "status": "SAFE TO GO", "advisory": ""},

    # --- Andhra Pradesh ---
    {"id": "krishnapatnam", "name": "Krishnapatnam", "lat": 14.2492, "lng": 80.1415, "waveHeight": 1.5, "windSpeed": 16.0, "seaTemperature": 29.0, "visibility": 10.0, "pressure": 1011, "humidity": 79, "tide": 1.2, "sunrise": "06:07", "sunset": "18:12", "status": "SAFE TO GO", "advisory": ""},
    {"id": "nizampatnam", "name": "Nizampatnam", "lat": 15.8973, "lng": 80.6698, "waveHeight": 1.4, "windSpeed": 15.0, "seaTemperature": 29.0, "visibility": 11.0, "pressure": 1010, "humidity": 79, "tide": 1.1, "sunrise": "06:06", "sunset": "18:13", "status": "SAFE TO GO", "advisory": ""},
    {"id": "machilipatnam", "name": "Machilipatnam", "lat": 16.1833, "lng": 81.1333, "waveHeight": 1.7, "windSpeed": 16.0, "seaTemperature": 29.0, "visibility": 11.0, "pressure": 1009, "humidity": 81, "tide": 1.3, "sunrise": "06:08", "sunset": "18:18", "status": "SAFE TO GO", "advisory": ""},
    {"id": "kakinada", "name": "Kakinada", "lat": 16.9891, "lng": 82.2475, "waveHeight": 1.6, "windSpeed": 18.0, "seaTemperature": 28.8, "visibility": 12.0, "pressure": 1011, "humidity": 78, "tide": 1.2, "sunrise": "06:03", "sunset": "18:12", "status": "SAFE TO GO", "advisory": ""},
    {"id": "visakhapatnam", "name": "Visakhapatnam", "lat": 17.6868, "lng": 83.2185, "waveHeight": 2.1, "windSpeed": 25.5, "seaTemperature": 28.4, "visibility": 10.0, "pressure": 1012, "humidity": 78, "tide": 1.2, "sunrise": "06:05", "sunset": "18:20", "status": "Caution", "advisory": ""},
    {"id": "bheemili", "name": "Bheemunipatnam", "lat": 17.8893, "lng": 83.4542, "waveHeight": 2.2, "windSpeed": 26.0, "seaTemperature": 28.3, "visibility": 9.0, "pressure": 1011, "humidity": 79, "tide": 1.2, "sunrise": "06:04", "sunset": "18:19", "status": "Caution", "advisory": ""},
    {"id": "kalingapatnam", "name": "Kalingapatnam", "lat": 18.3333, "lng": 84.1167, "waveHeight": 2.0, "windSpeed": 23.0, "seaTemperature": 28.5, "visibility": 10.0, "pressure": 1010, "humidity": 80, "tide": 1.3, "sunrise": "06:02", "sunset": "18:16", "status": "Caution", "advisory": ""},

    # --- Odisha ---
    {"id": "gopalpur", "name": "Gopalpur", "lat": 19.2618, "lng": 84.9082, "waveHeight": 2.5, "windSpeed": 28.0, "seaTemperature": 28.2, "visibility": 8.0, "pressure": 1009, "humidity": 82, "tide": 1.4, "sunrise": "06:01", "sunset": "18:14", "status": "Caution", "advisory": ""},
    {"id": "puri", "name": "Puri Beach", "lat": 19.7983, "lng": 85.8245, "waveHeight": 2.8, "windSpeed": 32.0, "seaTemperature": 28.1, "visibility": 7.0, "pressure": 1008, "humidity": 85, "tide": 1.6, "sunrise": "05:58", "sunset": "18:12", "status": "Caution", "advisory": ""},
    {"id": "paradip", "name": "Paradip", "lat": 20.2638, "lng": 86.6669, "waveHeight": 3.2, "windSpeed": 40.0, "seaTemperature": 28.0, "visibility": 5.0, "pressure": 1006, "humidity": 88, "tide": 1.8, "sunrise": "05:55", "sunset": "18:10", "status": "DO NOT GO", "advisory": ""},
    {"id": "dhamra", "name": "Dhamra Port", "lat": 20.7937, "lng": 86.9535, "waveHeight": 2.4, "windSpeed": 26.0, "seaTemperature": 28.1, "visibility": 9.0, "pressure": 1009, "humidity": 83, "tide": 1.9, "sunrise": "05:56", "sunset": "18:11", "status": "Caution", "advisory": ""},
    {"id": "chandipur", "name": "Chandipur", "lat": 21.4429, "lng": 87.0519, "waveHeight": 1.5, "windSpeed": 18.0, "seaTemperature": 28.3, "visibility": 10.0, "pressure": 1010, "humidity": 80, "tide": 2.2, "sunrise": "05:54", "sunset": "18:09", "status": "SAFE TO GO", "advisory": ""},

    # --- West Bengal ---
    {"id": "digha", "name": "Digha Coast", "lat": 21.6266, "lng": 87.5074, "waveHeight": 1.6, "windSpeed": 18.0, "seaTemperature": 28.6, "visibility": 9.0, "pressure": 1009, "humidity": 84, "tide": 2.0, "sunrise": "05:52", "sunset": "18:08", "status": "SAFE TO GO", "advisory": ""},
    {"id": "bakkhali", "name": "Bakkhali", "lat": 21.5647, "lng": 88.2618, "waveHeight": 1.8, "windSpeed": 20.0, "seaTemperature": 28.5, "visibility": 10.0, "pressure": 1010, "humidity": 82, "tide": 2.1, "sunrise": "05:50", "sunset": "18:05", "status": "SAFE TO GO", "advisory": ""},
    {"id": "haldia", "name": "Haldia", "lat": 22.0667, "lng": 88.0698, "waveHeight": 1.3, "windSpeed": 14.0, "seaTemperature": 28.8, "visibility": 8.0, "pressure": 1010, "humidity": 85, "tide": 2.5, "sunrise": "05:50", "sunset": "18:05", "status": "SAFE TO GO", "advisory": ""},
    {"id": "sagar", "name": "Sagar Island", "lat": 21.7317, "lng": 88.1362, "waveHeight": 1.9, "windSpeed": 22.0, "seaTemperature": 28.4, "visibility": 9.0, "pressure": 1008, "humidity": 86, "tide": 2.3, "sunrise": "05:51", "sunset": "18:06", "status": "SAFE TO GO", "advisory": ""},
    
    # --- Andaman & Nicobar / Lakshadweep ---
    {"id": "portblair", "name": "Port Blair (Andaman)", "lat": 11.6234, "lng": 92.7265, "waveHeight": 2.2, "windSpeed": 25.0, "seaTemperature": 29.5, "visibility": 10.0, "pressure": 1009, "humidity": 85, "tide": 1.5, "sunrise": "05:30", "sunset": "17:40", "status": "Caution", "advisory": ""},
    {"id": "havelock", "name": "Havelock Island", "lat": 11.9761, "lng": 92.9876, "waveHeight": 2.0, "windSpeed": 22.0, "seaTemperature": 29.6, "visibility": 11.0, "pressure": 1010, "humidity": 83, "tide": 1.4, "sunrise": "05:28", "sunset": "17:39", "status": "SAFE TO GO", "advisory": ""},
    {"id": "kavaratti", "name": "Kavaratti (Lakshadweep)", "lat": 10.5667, "lng": 72.6369, "waveHeight": 1.5, "windSpeed": 15.0, "seaTemperature": 29.8, "visibility": 14.0, "pressure": 1011, "humidity": 75, "tide": 1.1, "sunrise": "06:45", "sunset": "18:45", "status": "SAFE TO GO", "advisory": ""},
    {"id": "minicoy", "name": "Minicoy Island", "lat": 8.2818, "lng": 73.0489, "waveHeight": 1.6, "windSpeed": 17.0, "seaTemperature": 29.7, "visibility": 13.0, "pressure": 1010, "humidity": 76, "tide": 1.2, "sunrise": "06:40", "sunset": "18:40", "status": "SAFE TO GO", "advisory": ""},
]
"""

with open("main.py", "r") as f:
    code = f.read()

# Replace everything from '# Comprehensive list of Indian Coastal Areas & Local Fishing Harbors\nLOCATIONS = [' up to the closing ']'
pattern = r"# Comprehensive list of Indian Coastal Areas & Local Fishing Harbors\s*\nLOCATIONS\s*=\s*\[(.*?)\]"
new_code = re.sub(pattern, new_locations, code, flags=re.DOTALL)

with open("main.py", "w") as f:
    f.write(new_code)

print("Locations updated successfully.")
