"use client";

import { useEffect, useState } from "react";
import { History as HistoryIcon, MapPin, Wind, Waves, Thermometer, Calendar } from "lucide-react";

type HistoryItem = {
    id: string;
    date: string;
    location: string;
    lat: number;
    lng: number;
    waveHeight: number;
    windSpeed: number;
    seaTemperature: number;
    status: string;
};

export default function HistoryPage() {
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
                const res = await fetch(`${apiUrl}/api/history`);
                const data = await res.json();
                setHistory(data);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, []);

    return (
        <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto animation-fade-in pb-24 relative pt-10 px-4">
            <div className="glass rounded-[2rem] p-8 text-white shadow-xl min-h-[50vh] flex flex-col">
                <div className="flex items-center gap-4 border-b border-white/10 pb-6 mb-6">
                    <div className="bg-sky-500/20 p-4 rounded-xl backdrop-blur-sm border border-sky-400/30 text-sky-400">
                        <HistoryIcon className="w-8 h-8 stroke-[2]" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight drop-shadow-sm">
                            Historical Logs
                        </h1>
                        <p className="text-white/60 font-medium mt-1">
                            Past marine conditions and warnings for your locations.
                        </p>
                    </div>
                </div>

                {loading ? (
                    <div className="flex-1 flex items-center justify-center">
                        <div className="animate-spin text-sky-500 rounded-full border-t-2 border-r-2 border-sky-400 w-10 h-10"></div>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/10 text-white/50 text-sm tracking-wider uppercase bg-white/5 font-semibold">
                                    <th className="p-4 rounded-tl-xl"><div className="flex items-center gap-2"><Calendar className="w-4 h-4" /> Date</div></th>
                                    <th className="p-4"><div className="flex items-center gap-2"><MapPin className="w-4 h-4" /> Location</div></th>
                                    <th className="p-4"><div className="flex items-center gap-2"><Waves className="w-4 h-4" /> Wave</div></th>
                                    <th className="p-4"><div className="flex items-center gap-2"><Wind className="w-4 h-4" /> Wind</div></th>
                                    <th className="p-4"><div className="flex items-center gap-2"><Thermometer className="w-4 h-4" /> Temp</div></th>
                                    <th className="p-4 rounded-tr-xl">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {history.map((item, idx) => (
                                    <tr key={item.id} className="hover:bg-white/[0.03] transition-colors group">
                                        <td className="p-4 text-white/80 whitespace-nowrap">
                                            {new Date(item.date).toLocaleDateString()}
                                            <div className="text-xs text-white/40">{new Date(item.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                        </td>
                                        <td className="p-4">
                                            <div className="font-semibold text-white/90">{item.location}</div>
                                            <div className="text-xs text-white/50">{item.lat.toFixed(2)}°N, {item.lng.toFixed(2)}°E</div>
                                        </td>
                                        <td className="p-4 font-mono text-sky-200">{item.waveHeight.toFixed(1)}m</td>
                                        <td className="p-4 font-mono text-[#1fb97e]">{item.windSpeed.toFixed(1)}km/h</td>
                                        <td className="p-4 font-mono text-orange-300">{item.seaTemperature.toFixed(1)}°C</td>
                                        <td className="p-4">
                                            <span className={`px-3 py-1 text-xs font-bold rounded-full border ${item.status === 'SAFE TO GO' ? 'bg-[#1fb97e]/20 text-[#2cd994] border-[#1fb97e]/30' :
                                                item.status === 'Caution' ? 'bg-orange-500/20 text-orange-400 border-orange-500/30' :
                                                    'bg-red-500/20 text-red-400 border-red-500/30'
                                                }`}>
                                                {item.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
