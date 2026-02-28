"use client";

import { useEffect, useState } from "react";
import { Cloud, Sun, Droplets, Wind, RefreshCw, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface WeatherWidgetProps {
    locationId: string;
    theme?: "light" | "dark" | "transparent";
}

export function WeatherWidget({ locationId, theme = "dark" }: WeatherWidgetProps) {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLoc = async () => {
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
                const res = await fetch(`${apiUrl}/api/locations/${locationId}`);
                const locData = await res.json();
                // Fallback to empty if id is invalid
                if (locData.id) setData(locData);
            } catch (e) {
                console.error("Widget fetch error", e);
            } finally {
                setLoading(false);
            }
        };
        if (locationId) fetchLoc();
    }, [locationId]);

    if (loading) {
        return (
            <div className={cn(
                "w-full max-w-sm rounded-[1.5rem] p-6 flex flex-col items-center justify-center min-h-[200px] shadow-lg",
                theme === "dark" ? "bg-slate-900 text-white" : theme === "light" ? "bg-white text-slate-800 border" : "bg-black/40 backdrop-blur-md text-white border border-white/10"
            )}>
                <RefreshCw className="w-6 h-6 animate-spin text-sky-500" />
            </div>
        );
    }

    if (!data) {
        return (
            <div className={cn(
                "w-full max-w-sm rounded-[1.5rem] p-6 text-center shadow-lg",
                theme === "dark" ? "bg-slate-900 text-white" : theme === "light" ? "bg-white text-slate-800 border" : "bg-black/40 text-white"
            )}>
                <p className="opacity-70">Location not found.</p>
            </div>
        );
    }

    return (
        <div className={cn(
            "w-full max-w-sm rounded-[1.5rem] p-6 shadow-xl transition-all relative overflow-hidden",
            theme === "dark" ? "bg-gradient-to-br from-[#0284c7] to-[#0369a1] text-white" :
                theme === "light" ? "bg-gradient-to-br from-sky-50 to-white text-slate-800 border border-slate-200" :
                    "bg-sky-900/40 backdrop-blur-xl text-white border border-white/20"
        )}>

            {/* Background Decor */}
            <div className="absolute -top-4 -right-4 opacity-10 pointer-events-none">
                <Sun className="w-32 h-32" />
            </div>

            <div className="relative z-10 flex justify-between items-start">
                <div>
                    <h3 className="font-bold text-lg tracking-tight">{data.name}</h3>
                    <p className={cn("text-xs font-medium mt-0.5", theme === "light" ? "text-slate-500" : "text-white/70")}>
                        {data.forecast14?.[0]?.condition || "Sunny"}
                    </p>
                </div>

                {data.status === "DO NOT GO" && (
                    <span className="bg-red-500 text-white shadow-sm text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" /> NO GO
                    </span>
                )}
            </div>

            <div className="relative z-10 mt-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    {data.forecast14?.[0]?.icon ? (
                        <img src={data.forecast14[0].icon} alt="Weather" className="w-12 h-12 drop-shadow-sm" />
                    ) : (
                        <Sun className={cn("w-10 h-10", theme === "light" ? "text-amber-500" : "text-yellow-300")} />
                    )}
                    <span className="text-4xl font-extrabold tracking-tighter">
                        {data.seaTemperature}°
                    </span>
                </div>
                <div className="text-right">
                    <p className={cn("font-medium text-sm", theme === "light" ? "text-slate-600" : "text-white/80")}>High: {data.forecast14?.[0]?.maxtemp_c || "--"}°</p>
                    <p className={cn("text-xs mt-0.5", theme === "light" ? "text-slate-500" : "text-white/60")}>Low: {data.forecast14?.[0]?.mintemp_c || "--"}°</p>
                </div>
            </div>

            <div className={cn(
                "relative z-10 grid grid-cols-2 gap-3 mt-6 p-4 rounded-xl",
                theme === "light" ? "bg-slate-50" : "bg-black/20 border border-white/5"
            )}>
                <div className="flex items-center gap-2">
                    <Droplets className={cn("w-4 h-4", theme === "light" ? "text-sky-500" : "text-sky-300")} />
                    <div className="flex flex-col">
                        <span className={cn("text-[10px] font-bold uppercase", theme === "light" ? "text-slate-500" : "text-white/60")}>Air Qual.</span>
                        <span className="text-sm font-semibold mt-0.5">AQI {data.aqi || "--"}</span>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Wind className={cn("w-4 h-4", theme === "light" ? "text-sky-500" : "text-sky-300")} />
                    <div className="flex flex-col">
                        <span className={cn("text-[10px] font-bold uppercase", theme === "light" ? "text-slate-500" : "text-white/60")}>Wind</span>
                        <span className="text-sm font-semibold mt-0.5">{data.windSpeed} km/h</span>
                    </div>
                </div>
            </div>

        </div>
    );
}
