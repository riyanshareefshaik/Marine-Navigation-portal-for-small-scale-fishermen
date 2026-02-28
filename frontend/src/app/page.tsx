"use client";

import { useState, useEffect, useRef } from "react";
import { Info, MapPin, RefreshCw, AlertTriangle, Wind, Waves, Thermometer, Eye, Droplets, Sun, Moon, ArrowDown, Compass } from "lucide-react";
import { cn } from "@/lib/utils";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useLanguage } from "@/lib/i18n";
import { LocationSearch } from "@/components/LocationSearch";

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
};

// Mock chart data
const forecastData = [
  { time: "00:00", waveHeight: 1.2, windSpeed: 15 },
  { time: "04:00", waveHeight: 1.5, windSpeed: 18 },
  { time: "08:00", waveHeight: 2.1, windSpeed: 25 },
  { time: "12:00", waveHeight: 2.5, windSpeed: 28 },
  { time: "16:00", waveHeight: 2.3, windSpeed: 24 },
  { time: "20:00", waveHeight: 1.8, windSpeed: 20 },
];

export default function Home() {
  const { t } = useLanguage();
  const [locations, setLocations] = useState<LocationData[]>([]);
  const [activeLocId, setActiveLocId] = useState<string>("visakhapatnam");
  const [loading, setLoading] = useState(true);

  // Pull-to-refresh state
  const [pullDownDistance, setPullDownDistance] = useState(0);
  const [isPulling, setIsPulling] = useState(false);
  const touchStartY = useRef(0);
  const minPullDist = 80;

  const fetchLocations = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:8000/api/locations");
      const data = await res.json();
      setLocations(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  // Pull-to-refresh logic
  const handleTouchStart = (e: React.TouchEvent) => {
    if (window.scrollY === 0) {
      touchStartY.current = e.touches[0].clientY;
      setIsPulling(true);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isPulling) return;

    // Calculate distance
    const currentY = e.touches[0].clientY;
    const distance = currentY - touchStartY.current;

    // Only register downwards pull if we're at the top of the window
    if (distance > 0 && window.scrollY === 0) {
      // Add resistance to the pull
      setPullDownDistance(Math.min(distance * 0.4, minPullDist + 20));
      // Prevent browser's default refresh
      if (e.cancelable) e.preventDefault();
    }
  };

  const handleTouchEnd = () => {
    if (!isPulling) return;
    setIsPulling(false);

    if (pullDownDistance >= minPullDist) {
      // trigger refresh
      fetchLocations();
    }

    // Reset visual
    setPullDownDistance(0);
  };

  const activeLoc = locations.find(l => l.id === activeLocId) || null;

  if (loading || !activeLoc) {
    return <div className="flex h-[80vh] items-center justify-center">
      <div className="animate-spin text-sky-500"><RefreshCw className="w-8 h-8" /></div>
    </div>;
  }

  const isDanger = activeLoc.status === "DO NOT GO";
  const isCaution = activeLoc.status === "Caution";
  const isSafe = activeLoc.status === "SAFE TO GO";

  return (
    <div
      className="flex flex-col gap-6 w-full max-w-7xl mx-auto animation-fade-in pb-24 relative"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >

      {/* Pull to refresh visual indicator */}
      <div
        className={cn(
          "absolute top-0 left-0 right-0 flex justify-center items-center overflow-hidden transition-all duration-300 pointer-events-none z-10",
        )}
        style={{
          height: isPulling ? pullDownDistance : 0,
          opacity: Math.min(pullDownDistance / minPullDist, 1)
        }}
      >
        <div className="bg-white/80 backdrop-blur-md rounded-full p-2 text-sky-500 shadow-md">
          <RefreshCw className={cn("w-6 h-6", (isPulling && pullDownDistance >= minPullDist) || loading ? "animate-spin" : "")} />
        </div>
      </div>
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
        </div>

        <button onClick={fetchLocations} className="flex items-center gap-2 px-4 py-2 text-sky-400 bg-sky-500/10 hover:bg-sky-500/20 transition-colors border border-sky-500/30 rounded-full text-sm font-semibold shadow-sm">
          <RefreshCw className="w-4 h-4" /> {t("refresh")}
        </button>
      </div>

      {/* Hero Caution / Status Panel */}
      <div className={cn(
        "relative overflow-hidden rounded-[2rem] p-8 text-white shadow-xl transition-all duration-500 min-h-[300px] flex flex-col items-center justify-center text-center bg-water-flow",
        isDanger ? "bg-gradient-to-br from-red-500 via-red-600 to-red-500" :
          isCaution ? "bg-gradient-to-br from-orange-500 via-amber-500 to-orange-500" :
            "bg-gradient-to-br from-[#1fb97e] via-[#2cd994] to-[#149162]"
      )}>
        {/* Decorative Wave Overlay - Matching top & bottom waves from screenshot */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          {/* Top Waves */}
          <svg viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg" className="absolute top-0 w-full h-auto opacity-60 animate-water-bob">
            <path fill="none" stroke="#fff" strokeWidth="4" d="M0,96L80,112C160,128,320,160,480,160C640,160,800,128,960,138.7C1120,149,1280,203,1360,229.3L1440,256"></path>
            <path fill="none" stroke="#fff" strokeWidth="4" d="M0,32L80,37.3C160,43,320,53,480,85.3C640,117,800,171,960,181.3C1120,192,1280,160,1360,144L1440,128"></path>
          </svg>
          {/* Bottom Waves */}
          <svg viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg" className="absolute bottom-0 w-full h-auto opacity-60 animate-water-bob-reverse">
            <path fill="none" stroke="#fff" strokeWidth="4" d="M0,224L80,213.3C160,203,320,181,480,181.3C640,181,800,203,960,234.7C1120,267,1280,309,1360,330.7L1440,352"></path>
            <path fill="none" stroke="#fff" strokeWidth="4" d="M0,128L80,149.3C160,171,320,213,480,240C640,267,800,277,960,250.7C1120,224,1280,160,1360,128L1440,96"></path>
            <path fill="none" stroke="#fff" strokeWidth="4" d="M0,320L80,309.3C160,299,320,277,480,277.3C640,277,800,299,960,330.7C1120,363,1280,405,1360,426.7L1440,448"></path>
          </svg>
        </div>

        <div className="relative z-10 flex flex-col items-center gap-6 mt-4">
          {/* Status Icon inside transparent ring */}
          <div className="bg-white/20 p-5 rounded-full backdrop-blur-sm border-4 border-white/20 mb-2">
            {isDanger ? <AlertTriangle className="w-12 h-12 stroke-[2.5]" /> : isCaution ? <Info className="w-12 h-12 stroke-[2.5]" /> : <MapPin className="w-12 h-12 stroke-[2.5]" />}
          </div>

          <div className="flex flex-col items-center gap-3">
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight drop-shadow-sm">
              {t(`status.${activeLoc.status}` as const)?.toUpperCase() || activeLoc.status.replace("SAFE TO GO", "SAFE TO GO").toUpperCase()}
            </h1>
            <div className="flex items-center gap-2 mt-2 bg-black/20 px-4 py-1.5 rounded-full border border-white/10 backdrop-blur-md">
              <MapPin className="w-4 h-4 text-white/70" />
              <span className="text-white/90 font-mono text-sm tracking-wider">
                {activeLoc.lat.toFixed(4)}° N, {activeLoc.lng.toFixed(4)}° E
              </span>
            </div>
            <p className="text-white/95 text-lg md:text-xl max-w-2xl leading-relaxed font-medium">
              {isSafe ? t("advisory.safe") : activeLoc.advisory}
            </p>
          </div>

          <div className="text-sm font-medium text-white/80 flex items-center gap-2 mt-4">
            <RefreshCw className="w-4 h-4" /> {t("lastUpdated")} {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}
          </div>
        </div>
      </div>

      {/* Grid for Primary Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">

        {/* Metric 1 */}
        <div className="glass rounded-[1.5rem] p-6 flex flex-col justify-between group hover:-translate-y-1 transition-transform border-2 border-sky-400/30 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-start mb-12">
            <div className="bg-sky-400/20 p-2.5 rounded-xl text-sky-400">
              <Waves className="w-6 h-6 stroke-[2]" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-white/60 font-bold tracking-wider text-xs uppercase mb-1">{t("metrics.waveHeight")}</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-4xl font-extrabold text-white">{activeLoc.waveHeight.toFixed(1)}</span>
              <span className="text-lg font-bold text-white/40">m</span>
            </div>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="glass rounded-[1.5rem] p-6 flex flex-col justify-between group hover:-translate-y-1 transition-transform border-2 border-[#1fb97e]/30 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-start mb-12">
            <div className="bg-[#1fb97e]/20 p-2.5 rounded-xl text-[#1fb97e]">
              <Wind className="w-6 h-6 stroke-[2]" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-white/60 font-bold tracking-wider text-xs uppercase mb-1">{t("metrics.windSpeed")}</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-4xl font-extrabold text-white">{activeLoc.windSpeed.toFixed(1)}</span>
              <span className="text-lg font-bold text-white/40">km/h</span>
            </div>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="glass rounded-[1.5rem] p-6 flex flex-col justify-between group hover:-translate-y-1 transition-transform border-2 border-orange-400/30 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-start mb-12">
            <div className="bg-orange-400/20 p-2.5 rounded-xl text-orange-400">
              <Thermometer className="w-6 h-6 stroke-[2]" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-white/60 font-bold tracking-wider text-xs uppercase mb-1">{t("metrics.seaTemp")}</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-4xl font-extrabold text-white">{activeLoc.seaTemperature}</span>
              <span className="text-lg font-bold text-white/40">°C</span>
            </div>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="glass rounded-[1.5rem] p-6 flex flex-col justify-between group hover:-translate-y-1 transition-transform border-2 border-indigo-400/30 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-start mb-12">
            <div className="bg-indigo-400/20 p-2.5 rounded-xl text-indigo-400">
              <Eye className="w-6 h-6 stroke-[2]" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-white/60 font-bold tracking-wider text-xs uppercase mb-1">{t("metrics.visibility")}</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-4xl font-extrabold text-white">{activeLoc.visibility}</span>
              <span className="text-lg font-bold text-white/40">nm</span>
            </div>
          </div>
        </div>

        {/* Metric 5 */}
        <div className="glass rounded-[1.5rem] p-6 flex flex-col justify-between group hover:-translate-y-1 transition-transform border-2 border-slate-400/30 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-start mb-4">
            <div className="bg-slate-400/20 p-2.5 rounded-xl text-slate-300">
              <Compass className="w-6 h-6 stroke-[2]" />
            </div>
            <span className="text-white/60 font-bold tracking-wider text-xs uppercase">{t("metrics.windDir")}</span>
          </div>
          <div className="flex flex-col items-center justify-center py-2 relative z-10">
            <div className="relative w-24 h-24 rounded-full border-4 border-slate-500/50 flex items-center justify-center shadow-inner">
              <span className="absolute top-1 text-[10px] font-bold text-slate-400">N</span>
              <span className="absolute bottom-1 text-[10px] font-bold text-slate-400">S</span>
              <span className="absolute left-1 text-[10px] font-bold text-slate-400">W</span>
              <span className="absolute right-1 text-[10px] font-bold text-slate-400">E</span>
              <div
                className="absolute w-1 h-10 bg-gradient-to-t from-transparent to-red-500 origin-bottom transition-transform duration-1000 ease-out"
                style={{ transform: `rotate(${activeLoc.windDirection}deg) translateY(-50%)` }}
              >
                <div className="absolute -top-1 -left-1 w-3 h-3 bg-red-500 rounded-sm rotate-45"></div>
              </div>
            </div>
            <div className="mt-4 flex items-baseline gap-1.5">
              <span className="text-3xl font-extrabold text-white">{activeLoc.windDirection}°</span>
            </div>
          </div>
        </div>

        {/* Metric 6 */}
        <div className="relative overflow-hidden glass rounded-[1.5rem] p-6 flex flex-col justify-between group hover:-translate-y-1 transition-transform border-2 border-cyan-400/30 shadow-sm bg-water-flow">
          {/* Animated Background Flow */}
          <div className="absolute inset-x-0 bottom-0 opacity-40 pointer-events-none mix-blend-overlay">
            <svg viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg" className="absolute bottom-0 w-[200%] h-auto animate-water-bob-reverse" style={{ left: '-50%' }}>
              <path fill="#0ea5e9" d="M0,128L80,149.3C160,171,320,213,480,240C640,267,800,277,960,250.7C1120,224,1280,160,1360,128L1440,96L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"></path>
            </svg>
            <svg viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg" className="absolute bottom-0 w-[200%] h-auto animate-water-bob opacity-50" style={{ left: '0%' }}>
              <path fill="#38bdf8" d="M0,224L80,213.3C160,203,320,181,480,181.3C640,181,800,203,960,234.7C1120,267,1280,309,1360,330.7L1440,352L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"></path>
            </svg>
          </div>
          <div className="relative z-10 flex justify-between items-start mb-6">
            <div className="bg-cyan-400/20 p-2.5 rounded-xl text-cyan-400 backdrop-blur-md">
              <Waves className="w-6 h-6 stroke-[2]" />
            </div>
          </div>
          <div className="relative z-10 flex flex-col mt-auto pt-8">
            <span className="text-white/80 font-bold tracking-wider text-xs uppercase mb-1 drop-shadow-md">{t("metrics.waveDir")}</span>
            <div className="flex items-baseline gap-1.5 drop-shadow-md">
              <span className="text-4xl font-extrabold text-white">{activeLoc.waveDirection}°</span>
            </div>
            <div className="mt-1 text-xs font-semibold text-white/70">{t("metrics.realtime")}</div>
          </div>
        </div>

      </div>

      {/* Section Title */}
      <div className="pt-4">
        <h2 className="text-2xl font-extrabold text-white tracking-tight">{t("forecast.title")}</h2>
      </div>

      {/* Grid for 24-Hour Forecast Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Wave Height Chart Card */}
        <div className="glass rounded-3xl p-6 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-white tracking-wide">{t("metrics.waveHeight")}</h3>
            <div className="bg-sky-500/20 text-sky-400 border border-sky-500/30 font-semibold text-xs px-3 py-1.5 rounded-full flex items-center gap-1">
              Max: 2.5m
            </div>
          </div>
          <div className="flex-1 w-full min-h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={forecastData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorWaveHeight" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 11 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: '1px solid rgba(255,255,255,0.2)', backgroundColor: 'rgba(12, 21, 39, 0.9)' }}
                  cursor={{ stroke: 'rgba(255,255,255,0.2)', strokeWidth: 1, strokeDasharray: '4 4' }}
                />
                <Area type="monotone" dataKey="waveHeight" stroke="#0ea5e9" strokeWidth={2.5} fillOpacity={1} fill="url(#colorWaveHeight)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Wind Speed Chart Card */}
        <div className="glass rounded-3xl p-6 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-white tracking-wide">{t("metrics.windSpeed")}</h3>
            <div className="bg-[#1fb97e]/20 text-[#1fb97e] border border-[#1fb97e]/30 font-semibold text-xs px-3 py-1.5 rounded-full flex items-center gap-1">
              Max: 28km/h
            </div>
          </div>
          <div className="flex-1 w-full min-h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={forecastData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorWindSpeed" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1fb97e" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#1fb97e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 11 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: '1px solid rgba(255,255,255,0.2)', backgroundColor: 'rgba(12, 21, 39, 0.9)' }}
                  cursor={{ stroke: 'rgba(255,255,255,0.2)', strokeWidth: 1, strokeDasharray: '4 4' }}
                />
                <Area type="monotone" dataKey="windSpeed" stroke="#1fb97e" strokeWidth={2.5} fillOpacity={1} fill="url(#colorWindSpeed)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Section Title */}
      <div className="pt-6">
        <h2 className="text-2xl font-extrabold text-white tracking-tight">{t("trend.title")}</h2>
      </div>

      {/* Grid for 7-Day Trend and Thresholds */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* 7-Day Trend Line Chart (Takes up 2/3) */}
        <div className="lg:col-span-2 glass rounded-3xl p-6 shadow-sm flex flex-col">
          <div className="mb-6">
            <h3 className="font-bold text-white tracking-wide">{t("metrics.seaTemp")}</h3>
          </div>
          <div className="flex-1 w-full min-h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={forecastData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSeaTemp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 11 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: '1px solid rgba(255,255,255,0.2)', backgroundColor: 'rgba(12, 21, 39, 0.9)' }}
                  cursor={{ stroke: 'rgba(255,255,255,0.2)', strokeWidth: 1, strokeDasharray: '4 4' }}
                />
                <Area type="monotone" dataKey="windSpeed" stroke="#f97316" strokeWidth={2.5} fillOpacity={1} fill="url(#colorSeaTemp)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Safe Thresholds Card (Takes up 1/3) */}
        <div className="glass rounded-3xl p-6 shadow-[inset_0_0_0_2px_rgba(255,255,255,0.1)] flex flex-col">
          <h3 className="font-extrabold text-white/80 tracking-wide text-sm uppercase mb-6">{t("trend.safeThresholds")}</h3>

          <div className="flex flex-col gap-5 flex-1 justify-center">

            <div className="flex items-center gap-4">
              <div className="bg-sky-500/20 p-2.5 rounded-xl text-sky-400 shrink-0 border border-sky-400/30">
                <Waves className="w-5 h-5" />
              </div>
              <span className="font-semibold text-white/90 text-[15px]">{t("trend.waveThreshold")}</span>
            </div>

            <div className="flex items-center gap-4">
              <div className="bg-[#1fb97e]/20 p-2.5 rounded-xl text-[#1fb97e] shrink-0 border border-[#1fb97e]/30">
                <Wind className="w-5 h-5" />
              </div>
              <span className="font-semibold text-white/90 text-[15px]">{t("trend.windThreshold")}</span>
            </div>

            <div className="flex items-center gap-4">
              <div className="bg-indigo-500/20 p-2.5 rounded-xl text-indigo-400 shrink-0 border border-indigo-400/30">
                <Eye className="w-5 h-5" />
              </div>
              <span className="font-semibold text-white/90 text-[15px]">{t("trend.visThreshold")}</span>
            </div>

          </div>
        </div>

      </div>

      {/* Weekly Pills Row */}
      <div className="flex items-center justify-between gap-4 overflow-x-auto pb-4 pt-2 -mx-4 px-4 sm:mx-0 sm:px-0 hide-scrollbar">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((day) => (
          <div key={day} className="flex flex-col items-center justify-center p-3 px-6 rounded-2xl border-2 border-[#1fb97e]/40 bg-[#1fb97e]/10 min-w-[100px] shadow-sm">
            <span className="text-sm font-bold text-white mb-2">{day}</span>
            <div className="bg-[#1fb97e] text-white p-1 rounded-full"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg></div>
          </div>
        ))}
        {['Sat', 'Sun'].map((day) => (
          <div key={day} className="flex flex-col items-center justify-center p-3 px-6 rounded-2xl border-2 border-orange-400/30 bg-orange-400/10 min-w-[100px] shadow-sm">
            <span className="text-sm font-bold text-white/50 mb-2">{day}</span>
            <div className="bg-orange-400 text-white p-1 rounded-full w-6 h-6 flex items-center justify-center text-lg font-bold">-</div>
          </div>
        ))}
      </div>

    </div>
  );
}
