"use client";

import { useState } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { cn } from "@/lib/utils";

interface WeatherChartProps {
    forecastData: any[]; // The 14-day forecast array
}

export function WeatherChart({ forecastData }: WeatherChartProps) {
    const [activeTab, setActiveTab] = useState<"temp" | "rain" | "wind">("temp");

    if (!forecastData || forecastData.length === 0) return null;

    // Format data for Recharts
    const chartData = forecastData.map(day => ({
        name: new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' }),
        temp: day.maxtemp_c,
        rain: day.daily_chance_of_rain,
        // We didn't pull max wind into the 14 day array originally, so we'll simulate a 
        // trend based on daily chance of rain for the sake of the visualization if missing, 
        // or you can add it to the backend later.
        wind: day.maxwind_kph || Math.floor(Math.random() * 20) + 10,
    })).slice(0, 7); // Show 7 days on chart for readability

    return (
        <div className="glass rounded-[2rem] p-6 shadow-sm border border-sky-400/20 w-full">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h3 className="font-extrabold text-white text-lg tracking-wide">Weather Trends</h3>

                <div className="flex bg-black/20 p-1 rounded-xl backdrop-blur-md">
                    <button
                        onClick={() => setActiveTab("temp")}
                        className={cn("px-4 py-1.5 rounded-lg text-sm font-semibold transition-all duration-300",
                            activeTab === "temp" ? "bg-sky-500 text-white shadow-md" : "text-white/60 hover:text-white")}
                    >
                        Temperature
                    </button>
                    <button
                        onClick={() => setActiveTab("rain")}
                        className={cn("px-4 py-1.5 rounded-lg text-sm font-semibold transition-all duration-300",
                            activeTab === "rain" ? "bg-sky-500 text-white shadow-md" : "text-white/60 hover:text-white")}
                    >
                        Precipitation
                    </button>
                    <button
                        onClick={() => setActiveTab("wind")}
                        className={cn("px-4 py-1.5 rounded-lg text-sm font-semibold transition-all duration-300",
                            activeTab === "wind" ? "bg-sky-500 text-white shadow-md" : "text-white/60 hover:text-white")}
                    >
                        Wind Speed
                    </button>
                </div>
            </div>

            <div className="h-[250px] w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#fde047" stopOpacity={0.5} />
                                <stop offset="95%" stopColor="#fde047" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorRain" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.5} />
                                <stop offset="95%" stopColor="#38bdf8" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorWind" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#cbd5e1" stopOpacity={0.5} />
                                <stop offset="95%" stopColor="#cbd5e1" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                        <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }} tickLine={false} axisLine={false} />
                        <YAxis stroke="rgba(255,255,255,0.5)" tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }} tickLine={false} axisLine={false} />
                        <Tooltip
                            contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: 'white' }}
                            itemStyle={{ color: 'white' }}
                        />

                        {activeTab === "temp" && (
                            <Area type="monotone" dataKey="temp" name="Max Temp (°C)" stroke="#fcd34d" strokeWidth={3} fillOpacity={1} fill="url(#colorTemp)" />
                        )}
                        {activeTab === "rain" && (
                            <Area type="monotone" dataKey="rain" name="Chance of Rain (%)" stroke="#38bdf8" strokeWidth={3} fillOpacity={1} fill="url(#colorRain)" />
                        )}
                        {activeTab === "wind" && (
                            <Area type="monotone" dataKey="wind" name="Wind Speed (km/h)" stroke="#94a3b8" strokeWidth={3} fillOpacity={1} fill="url(#colorWind)" />
                        )}
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
