"use client";

import { useSearchParams } from "next/navigation";
import { WeatherWidget } from "@/components/WeatherWidget";
import { Suspense } from "react";

function WidgetLoader() {
    const searchParams = useSearchParams();
    const id = searchParams.get("id") || "visakhapatnam";
    const theme = (searchParams.get("theme") as "light" | "dark" | "transparent") || "dark";

    return (
        <div className="w-full h-full min-h-screen bg-transparent flex items-center justify-center p-4">
            <WeatherWidget locationId={id} theme={theme} />
        </div>
    );
}

export default function WidgetPage() {
    // We use Suspense boundaries here since we use Next.js searchParams client-side
    return (
        <Suspense fallback={<div className="p-4 text-center">Loading widget...</div>}>
            <WidgetLoader />
        </Suspense>
    );
}
