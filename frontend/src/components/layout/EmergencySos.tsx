"use client";

import { useState } from "react";
import { ShieldAlert, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function EmergencySos() {
    const [isOpen, setIsOpen] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [sendStatus, setSendStatus] = useState<"idle" | "success" | "error">("idle");

    const handleSendSos = async () => {
        setIsSending(true);
        setSendStatus("idle");

        try {
            // Get location if possible, otherwise use fallback coords (e.g., Visakhapatnam)
            let lat = 17.6868;
            let lng = 83.2185;

            if ("geolocation" in navigator) {
                // Wrap in promise to use await
                try {
                    const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
                        navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 });
                    });
                    lat = pos.coords.latitude;
                    lng = pos.coords.longitude;
                } catch (geoError) {
                    console.log("Geolocation failed or denied, using fallback", geoError);
                }
            }

            const reqBody = {
                contactNumber: "+91-9876543210", // Hardcoded for demo
                lat,
                lng,
                message: "EMERGENCY: Immediate assistance required. Fisherman in distress."
            };

            const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
            const res = await fetch(`${apiUrl}/api/sos`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(reqBody)
            });

            if (res.ok) {
                setSendStatus("success");
                setTimeout(() => {
                    setIsOpen(false);
                    setSendStatus("idle");
                }, 3000);
            } else {
                setSendStatus("error");
            }
        } catch (error) {
            console.error(error);
            setSendStatus("error");
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-[60]">
            {!isOpen ? (
                <button
                    onClick={() => setIsOpen(true)}
                    className="bg-red-600 hover:bg-red-700 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg shadow-red-500/40 hover:scale-105 transition-all group"
                    aria-label="Emergency SOS"
                >
                    <ShieldAlert className="w-7 h-7 group-hover:animate-pulse" />
                </button>
            ) : (
                <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-5 border border-red-100 dark:border-red-900/50 w-[300px] sm:w-[320px] animate-in slide-in-from-bottom-5">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-2 text-red-600 dark:text-red-500">
                            <ShieldAlert className="w-5 h-5" />
                            <h3 className="font-bold text-lg">SOS ALERT</h3>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-5">
                        Are you in an emergency? This will send your GPS location via SMS to Coast Guard authorities.
                    </p>

                    {sendStatus === "success" ? (
                        <div className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 p-3 rounded-lg text-center text-sm font-medium border border-emerald-100 dark:border-emerald-800 flex flex-col items-center gap-2">
                            Alert sent successfully! Help is on the way.
                        </div>
                    ) : sendStatus === "error" ? (
                        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-lg text-center text-sm mb-4">
                            Failed to send. Please check your connection or call 112 directly.
                        </div>
                    ) : null}

                    {sendStatus !== "success" && (
                        <button
                            onClick={handleSendSos}
                            disabled={isSending}
                            className={cn(
                                "w-full py-3 rounded-xl font-bold text-white transition-all",
                                isSending ? "bg-red-400 cursor-not-allowed" : "bg-red-600 hover:bg-red-700 active:scale-95 shadow-lg shadow-red-500/30"
                            )}
                        >
                            {isSending ? "SENDING SIGNAL..." : "SEND EMERGENCY SIGNAL"}
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
