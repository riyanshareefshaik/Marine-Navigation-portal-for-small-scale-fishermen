"use client";

import { useState, useEffect } from "react";

export function useFavorites() {
    const [favorites, setFavorites] = useState<string[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        try {
            const stored = localStorage.getItem("marine_favorites");
            if (stored) {
                setFavorites(JSON.parse(stored));
            }
        } catch (e) {
            console.error("Failed to load favorites", e);
        }
        setIsLoaded(true);
    }, []);

    const toggleFavorite = (locationId: string) => {
        let newFavorites: string[];

        if (favorites.includes(locationId)) {
            newFavorites = favorites.filter(id => id !== locationId);
        } else {
            newFavorites = [...favorites, locationId];
        }

        setFavorites(newFavorites);
        try {
            localStorage.setItem("marine_favorites", JSON.stringify(newFavorites));
        } catch (e) {
            console.error("Failed to save favorites", e);
        }
    };

    const isFavorite = (locationId: string) => favorites.includes(locationId);

    return { favorites, toggleFavorite, isFavorite, isLoaded };
}
