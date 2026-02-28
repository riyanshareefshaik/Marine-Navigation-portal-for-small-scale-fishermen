"use client";

import { useEffect, useRef } from "react";
import { toast } from "sonner"; // Assuming sonner is installed for toasts. we can fall back to standard alert if not

interface WeatherAlertConfig {
    windSpeedThreshold: number; // km/h
    waveHeightThreshold: number; // meters
}

export function useWeatherAlerts(
    locationName: string,
    currentWind: number | undefined,
    currentWave: number | undefined,
    config: WeatherAlertConfig = { windSpeedThreshold: 20, waveHeightThreshold: 2.0 }
) {
    const hasAlertedWind = useRef(false);
    const hasAlertedWave = useRef(false);
    const prevLocation = useRef(locationName);

    useEffect(() => {
        // Reset alerts if location changes
        if (prevLocation.current !== locationName) {
            hasAlertedWind.current = false;
            hasAlertedWave.current = false;
            prevLocation.current = locationName;
        }

        if (currentWind !== undefined && currentWind > config.windSpeedThreshold && !hasAlertedWind.current) {
            toast.warning(`High Wind Alert for ${locationName}`, {
                description: `Current wind speed is ${currentWind} km/h (exceeds ${config.windSpeedThreshold} km/h threshold).`,
                duration: 8000,
            });
            hasAlertedWind.current = true;
        }

        if (currentWave !== undefined && currentWave > config.waveHeightThreshold && !hasAlertedWave.current) {
            toast.warning(`High Wave Alert for ${locationName}`, {
                description: `Current wave height is ${currentWave}m (exceeds ${config.waveHeightThreshold}m threshold).`,
                duration: 8000,
            });
            hasAlertedWave.current = true;
        }
    }, [locationName, currentWind, currentWave, config]);
}
