"use client";

import dynamic from 'next/dynamic';

// Next.js SSR does not like Leaflet using window, so we must load it dynamically.
const MarineMap = dynamic(() => import('@/components/map/MapContainer'), {
    ssr: false,
    loading: () => (
        <div className="w-full h-[70vh] rounded-3xl overflow-hidden shadow-lg border border-slate-200 bg-slate-50 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3 animate-pulse">
                <div className="w-12 h-12 rounded-full border-4 border-slate-200 border-t-sky-500 animate-spin"></div>
                <p className="text-sky-600 font-semibold tracking-wide">Loading Marine Analytics Engine...</p>
            </div>
        </div>
    )
});

export default function MapPage() {
    return (
        <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto animation-fade-in pb-24">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/60 backdrop-blur-md p-4 rounded-2xl shadow-sm border border-white/40">
                <div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-sky-900 to-sky-700 dark:from-sky-100 dark:to-white bg-clip-text text-transparent">
                        Interactive Live Map
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">
                        Real-time geographic status and weather overlays across Indian coastal districts.
                    </p>
                </div>
            </div>

            <div className="w-full h-full relative">
                <MarineMap />
            </div>
        </div>
    );
}
