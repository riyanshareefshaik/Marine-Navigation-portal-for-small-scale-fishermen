"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/lib/i18n";
import { LocationSearch } from "@/components/LocationSearch";
import { cn } from "@/lib/utils";
import { useFavorites } from "@/hooks/useFavorites";
import { useWeatherAlerts } from "@/hooks/useWeatherAlerts";
import { WeatherChart } from "@/components/WeatherChart";
import { Heart, Wind, Waves, Thermometer, Droplets, ArrowDown, MapPin, RefreshCw, Sun, Cloud, CloudRain, ShieldAlert } from "lucide-react";

type LocationData = {
    id: string;
    name: string;
    lat: number;
    lng: number;
    waveHeight: number;
    windSpeed: number;
    seaTemperature: number;
    visibility: number;
    pressure: number;
    humidity: number;
    tide: number;
    sunrise: string;
    sunset: string;
    status: string;
    advisory: string;
    windDirection: number;
    waveDirection: number;
    aqi?: number;
    alerts?: any[];
    forecast14?: {
        date: string;
        maxtemp_c: number;
        mintemp_c: number;
        condition: string;
        icon: string;
        daily_chance_of_rain: number;
        sunrise: string;
        sunset: string;
    }[];
};

// Weather forecast mock data
const hourlyForecast = [
    { time: "Now", temp: 28, condition: "sunny", icon: Sun },
    { time: "14:00", temp: 29, condition: "cloudy", icon: Cloud },
    { time: "15:00", temp: 28, condition: "rain", icon: CloudRain },
    { time: "16:00", temp: 27, condition: "rain", icon: CloudRain },
    { time: "17:00", temp: 26, condition: "cloudy", icon: Cloud },
    { time: "18:00", temp: 25, condition: "sunny", icon: Sun },
];

export default function WeatherForecast() {
    const { t } = useLanguage();
    const [locations, setLocations] = useState<LocationData[]>([]);
    const [activeLocId, setActiveLocId] = useState<string>("visakhapatnam");
    const [loading, setLoading] = useState(true);
    const { favorites, toggleFavorite, isFavorite } = useFavorites();

    const fetchLocations = async () => {
        setLoading(true);
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
            const res = await fetch(`${apiUrl}/api/locations`);
            const data = await res.json();
            setLocations(data);
            if (!locations.find(l => l.id === activeLocId) && data.length > 0) {
                // Default to a favorite if available, else first location
                if (favorites.length > 0) {
                    setActiveLocId(favorites[0]);
                } else {
                    setActiveLocId(data[0].id);
                }
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLocations();
    }, []);

    const activeLoc = locations.find(l => l.id === activeLocId);

    // Trigger severe weather alerts
    useWeatherAlerts(activeLoc?.name || "", activeLoc?.windSpeed, activeLoc?.waveHeight);

    if (loading || !activeLoc) {
        return (
            <div className="flex h-[80vh] items-center justify-center">
                <div className="animate-spin text-sky-500"><RefreshCw className="w-8 h-8" /></div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto animation-fade-in pb-24">
            {/* Location Selector */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 glass p-4 rounded-2xl shadow-sm">
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <div className="bg-sky-500/20 p-2 rounded-lg text-sky-400">
                        <MapPin className="w-5 h-5" />
                    </div>
                    <LocationSearch
                        locations={locations.map(loc => ({ id: loc.id, name: loc.name }))}
                        value={activeLocId}
                        onChange={setActiveLocId}
                    />
                    {activeLoc && (
                        <button
                            onClick={() => toggleFavorite(activeLoc.id)}
                            className={cn(
                                "p-2 rounded-xl transition-all",
                                isFavorite(activeLoc.id) ? "bg-red-500/20 text-red-500" : "bg-white/5 text-white/50 hover:bg-white/10"
                            )}>
                            <Heart className={cn("w-5 h-5", isFavorite(activeLoc.id) && "fill-current")} />
                        </button>
                    )}
                </div>
                <button onClick={fetchLocations} className="flex items-center gap-2 px-4 py-2 text-sky-400 bg-sky-500/10 hover:bg-sky-500/20 transition-colors border border-sky-500/30 rounded-full text-sm font-semibold shadow-sm">
                    <RefreshCw className="w-4 h-4" /> Refresh
                </button>
            </div>

            {/* Active Alerts Banner */}
            {activeLoc?.alerts && activeLoc.alerts.length > 0 && (
                <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-2xl flex items-start gap-4 animate-pulse">
                    <ShieldAlert className="w-6 h-6 text-red-500 shrink-0 mt-0.5" />
                    <div className="flex flex-col gap-2">
                        {activeLoc.alerts.map((alert: any, i: number) => (
                            <div key={i}>
                                <h4 className="text-red-400 font-bold">{alert.headline || alert.event}</h4>
                                <p className="text-white/80 text-sm mt-1 line-clamp-2">{alert.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Main Weather Card */}
                <div className="lg:col-span-2 relative overflow-hidden glass rounded-[2rem] p-8 text-white shadow-xl transition-all duration-500 flex flex-col justify-between min-h-[380px] bg-gradient-to-br from-[#0284c7] via-[#0ea5e9] to-[#38bdf8]">
                    <div className="absolute top-0 right-0 p-8 opacity-20">
                        <Sun className="w-64 h-64" />
                    </div>

                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-2 bg-black/10 w-max px-3 py-1 rounded-full backdrop-blur-md">
                            <span className="text-white/90 font-medium text-sm">Today, {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight drop-shadow-md mt-6">
                            {activeLoc.seaTemperature}°C
                        </h1>
                        <p className="text-white/90 text-2xl mt-2 font-medium drop-shadow-sm flex items-center gap-2">
                            <Sun className="w-6 h-6 text-yellow-300" /> {activeLoc.forecast14?.[0]?.condition || "Mostly Sunny"}
                        </p>
                        <p className="text-white/70 text-lg mt-1">High: {activeLoc.forecast14?.[0]?.maxtemp_c || 31}° • Low: {activeLoc.forecast14?.[0]?.mintemp_c || 24}°</p>

                        {/* Summary Pill */}
                        <div className="mt-4 bg-sky-900/40 border border-sky-400/20 px-4 py-2 rounded-xl text-sky-100 max-w-md backdrop-blur-sm">
                            <p className="text-sm font-medium">{activeLoc.advisory}</p>
                        </div>
                    </div>

                    <div className="relative z-10 mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 bg-black/20 p-6 rounded-3xl backdrop-blur-md border border-white/10">
                        <div className="flex flex-col">
                            <span className="text-white/60 text-sm font-medium flex items-center gap-1.5"><Thermometer className="w-4 h-4" /> Pressure</span>
                            <span className="text-white font-bold text-lg mt-1">{activeLoc.pressure} hPa</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-white/60 text-sm font-medium flex items-center gap-1.5"><Droplets className="w-4 h-4" /> Humidity</span>
                            <span className="text-white font-bold text-lg mt-1">{activeLoc.humidity}%</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-white/60 text-sm font-medium flex items-center gap-1.5"><Wind className="w-4 h-4" /> Wind</span>
                            <span className="text-white font-bold text-lg mt-1">{activeLoc.windSpeed} km/h</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-white/60 text-sm font-medium flex items-center gap-1.5"><Waves className="w-4 h-4" /> Waves</span>
                            <span className="text-white font-bold text-lg mt-1">{activeLoc.waveHeight}m</span>
                        </div>
                        <div className="flex flex-col sm:col-span-4 mt-2 pt-4 border-t border-white/10">
                            <div className="flex justify-between items-center">
                                <span className="text-white/60 text-sm font-medium">Air Quality Index</span>
                                <span className={cn(
                                    "px-2 py-0.5 rounded text-xs font-bold",
                                    activeLoc.aqi! <= 2 ? "bg-emerald-500/20 text-emerald-400" :
                                        activeLoc.aqi! <= 4 ? "bg-orange-500/20 text-orange-400" : "bg-red-500/20 text-red-400"
                                )}>
                                    US-EPA {activeLoc.aqi || 1}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sea Forecasting Details Panel */}
                <div className="glass rounded-[2rem] p-6 flex flex-col gap-6 shadow-sm border-2 border-sky-400/20">
                    <h3 className="font-extrabold text-white text-xl tracking-wide flex items-center gap-2 border-b border-white/10 pb-4">
                        <Waves className="w-6 h-6 text-sky-400" /> Sea Forecast
                    </h3>

                    <div className="flex flex-col gap-5 flex-1 justify-center">

                        <div className="flex items-center justify-between p-4 bg-sky-500/10 rounded-2xl border border-sky-500/20">
                            <div className="flex items-center gap-3">
                                <div className="bg-sky-500/20 p-2.5 rounded-xl text-sky-400">
                                    <ArrowDown className="w-5 h-5" />
                                </div>
                                <div>
                                    <span className="text-white/60 text-xs font-bold uppercase block">Tide Level</span>
                                    <span className="font-semibold text-white text-lg">{activeLoc.tide} m</span>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="text-emerald-400 font-medium text-sm block">Falling Tide</span>
                                <span className="text-white/50 text-xs">Low at 14:30</span>
                            </div>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-orange-500/10 rounded-2xl border border-orange-500/20">
                            <div className="flex items-center gap-3">
                                <div className="bg-orange-500/20 p-2.5 rounded-xl text-orange-400">
                                    <Thermometer className="w-5 h-5" />
                                </div>
                                <div>
                                    <span className="text-white/60 text-xs font-bold uppercase block">Sea Temp</span>
                                    <span className="font-semibold text-white text-lg">{activeLoc.seaTemperature}°C</span>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="text-orange-400 font-medium text-sm block">Warm</span>
                                <span className="text-white/50 text-xs">Avg for season</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-indigo-500/10 rounded-2xl border border-indigo-500/20 flex flex-col items-center text-center">
                                <span className="text-white/60 text-xs font-bold uppercase block mb-1">Sunrise</span>
                                <span className="font-bold text-white text-lg">{activeLoc.sunrise}</span>
                            </div>
                            <div className="p-4 bg-rose-500/10 rounded-2xl border border-rose-500/20 flex flex-col items-center text-center">
                                <span className="text-white/60 text-xs font-bold uppercase block mb-1">Sunset</span>
                                <span className="font-bold text-white text-lg">{activeLoc.sunset}</span>
                            </div>
                        </div>

                    </div>
                </div>

            </div>

            {/* Weather Trends Graph */}
            <div className="mt-8">
                <WeatherChart forecastData={activeLoc.forecast14 || []} />
            </div>

            {/* Extended 14-Day Forecast Grid */}
            {activeLoc.forecast14 && activeLoc.forecast14.length > 0 && (
                <div className="glass rounded-[2rem] p-6 shadow-sm border border-sky-400/20 mt-6 mb-8">
                    <h3 className="font-extrabold text-white text-lg tracking-wide mb-6">14-Day Outlook</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
                        {activeLoc.forecast14.slice(0, 14).map((day, i) => (
                            <div key={i} className="flex flex-col items-center justify-between p-4 rounded-2xl bg-[#031525]/40 border border-sky-900/50 hover:border-sky-500/50 transition-colors h-full">
                                <div className="text-center mb-3">
                                    <span className="text-sm font-bold text-white block">{new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}</span>
                                    <span className="text-xs text-sky-200/60">{new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                                </div>

                                {day.icon ? (
                                    <img src={day.icon} alt={day.condition} className="w-12 h-12 my-2" />
                                ) : (
                                    <Cloud className="w-8 h-8 text-sky-300 my-2 opacity-50" />
                                )}

                                <div className="flex items-center gap-2 mt-3 text-sm">
                                    <span className="font-bold text-white">{day.maxtemp_c}°</span>
                                    <span className="text-sky-200/50">{day.mintemp_c}°</span>
                                </div>

                                <div className="mt-3 flex items-center gap-1 text-xs font-medium text-sky-400 bg-sky-500/10 px-2 py-1 rounded">
                                    <Droplets className="w-3 h-3" />
                                    {day.daily_chance_of_rain}%
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

        </div>
    );
}
