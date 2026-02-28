"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { AlertTriangle, Info, MapPin } from "lucide-react";

// Fix for default Leaflet icon missing in Next.js
const customIcon = new L.Icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});

// Danger Zone Icon
const dangerIcon = new L.Icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
    iconRetinaUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

// Safe Zone Icon
const safeIcon = new L.Icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
    iconRetinaUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

// Caution Zone Icon
const cautionIcon = new L.Icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png",
    iconRetinaUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

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
};

// Component to recenter map when locations load
function ChangeView({ center, zoom }: { center: [number, number], zoom: number }) {
    const map = useMap();
    map.setView(center, zoom);
    return null;
}

export default function MarineMap() {
    const [locations, setLocations] = useState<LocationData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLocations = async () => {
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
                const res = await fetch(`${apiUrl}/api/locations`);
                const data = await res.json();
                setLocations(data);
            } catch (e) {
                console.error("Failed to fetch locations for map:", e);
            } finally {
                setLoading(false);
            }
        };
        fetchLocations();
    }, []);

    if (loading) {
        return (
            <div className="w-full h-full flex items-center justify-center bg-slate-100/50 rounded-2xl animate-pulse">
                <div className="text-sky-600 font-medium">Loading map constraints...</div>
            </div>
        );
    }

    // Focus near the center of India initially
    const centerPos: [number, number] = [20.5937, 78.9629];

    return (
        <div className="relative w-full h-[70vh] rounded-3xl overflow-hidden shadow-lg border border-slate-200">
            {/* Map Overlay Badge */}
            <div className="absolute top-4 left-4 z-[400] bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl shadow-md border border-slate-200 pointer-events-none">
                <h2 className="font-bold text-slate-800 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-sky-500" />
                    Live Coastal Mapping
                </h2>
            </div>

            <MapContainer
                center={centerPos}
                zoom={10}
                scrollWheelZoom={true}
                className="w-full h-full z-0 relative"
            >
                <TileLayer
                    url="http://mt0.google.com/vt/lyrs=y&hl=en&x={x}&y={y}&z={z}&s=Ga"
                    attribution="&copy; Google Maps"
                    className="map-tiles"
                />

                {locations.map((loc) => {
                    let markerIcon = customIcon;
                    if (loc.status === "DO NOT GO") markerIcon = dangerIcon;
                    if (loc.status === "Caution") markerIcon = cautionIcon;
                    if (loc.status === "SAFE TO GO") markerIcon = safeIcon;

                    return (
                        <Marker
                            key={loc.id}
                            position={[loc.lat, loc.lng]}
                            icon={markerIcon}
                        >
                            <Popup className="marine-popup">
                                <div className="p-1 min-w-[200px]">
                                    <h3 className="font-bold text-lg mb-1">{loc.name}</h3>
                                    <div className="flex items-center gap-1.5 mb-3">
                                        {loc.status === "DO NOT GO" ? (
                                            <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                                                <AlertTriangle className="w-3 h-3" /> {loc.status}
                                            </span>
                                        ) : loc.status === "Caution" ? (
                                            <span className="bg-orange-100 text-orange-600 text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                                                <Info className="w-3 h-3" /> {loc.status}
                                            </span>
                                        ) : (
                                            <span className="bg-emerald-100 text-emerald-600 text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                                                <MapPin className="w-3 h-3" /> {loc.status}
                                            </span>
                                        )}
                                    </div>

                                    <p className="text-sm text-slate-600 mb-3 border-l-2 border-slate-200 pl-2">
                                        {loc.advisory}
                                    </p>

                                    <div className="grid grid-cols-2 gap-2 text-xs">
                                        <div className="bg-slate-50 p-1.5 rounded">
                                            <span className="text-slate-500 block">Wave</span>
                                            <span className="font-bold">{loc.waveHeight}m</span>
                                        </div>
                                        <div className="bg-slate-50 p-1.5 rounded">
                                            <span className="text-slate-500 block">Wind</span>
                                            <span className="font-bold">{loc.windSpeed} km/h</span>
                                        </div>
                                    </div>
                                </div>
                            </Popup>
                        </Marker>
                    );
                })}
            </MapContainer>
        </div>
    );
}
