"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export type Role = "user" | "admin";

export interface UserProfile {
    name: string;
    phone: string;
    role: Role;
    location?: string;
}

interface AuthContextType {
    user: UserProfile | null;
    login: (name: string, phone: string, location?: string) => void;
    logout: () => void;
    isLoaded: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const router = useRouter();

    useEffect(() => {
        // Check local storage for existing session
        try {
            const stored = localStorage.getItem("marine_user_session");
            if (stored) {
                setUser(JSON.parse(stored));
            }
        } catch (e) {
            console.error("Failed to parse auth session", e);
        } finally {
            setIsLoaded(true);
        }
    }, []);

    const login = (name: string, phone: string, location: string = "Visakhapatnam Coast") => {
        // Special Admin Check
        const role: Role =
            name.toLowerCase() === "shaik riyan shareef" && phone === "7660935035"
                ? "admin"
                : "user";

        const newUser: UserProfile = { name, phone, role, location };

        setUser(newUser);
        try {
            localStorage.setItem("marine_user_session", JSON.stringify(newUser));
        } catch (e) {
            console.error("Failed to save session", e);
        }

        // Redirect to profile upon login
        router.push("/profile");
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("marine_user_session");
        router.push("/");
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isLoaded }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
