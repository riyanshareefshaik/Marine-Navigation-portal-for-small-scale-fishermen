"use client";

import { useState, useEffect } from "react";
import { User, AlertTriangle, LogOut, ShieldAlert, Key } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export default function ProfilePage() {
    const { user, isLoaded, logout } = useAuth();
    const router = useRouter();
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    useEffect(() => {
        // Protect Route
        if (isLoaded && !user) {
            router.push("/login");
        }
    }, [user, isLoaded, router]);

    if (!isLoaded || !user) {
        return <div className="min-h-screen text-white text-center pt-32">Loading profile state...</div>;
    }

    const handleDeleteAccount = () => {
        alert("Account deleted successfully.");
        logout();
    };

    return (
        <div className="flex flex-col gap-6 animate-in fade-in duration-500 max-w-2xl mx-auto pb-24 px-4 pt-20">
            <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2">
                Profile Settings
            </h1>

            <div className="glass rounded-xl p-6 flex flex-col sm:flex-row items-center gap-6">
                <div className={cn(
                    "rounded-full p-6 border",
                    user.role === 'admin' ? "bg-amber-500/20 border-amber-400/30" : "bg-sky-500/20 border-sky-400/30"
                )}>
                    {user.role === 'admin' ? (
                        <Key className="w-12 h-12 text-amber-400" />
                    ) : (
                        <User className="w-12 h-12 text-sky-400" />
                    )}
                </div>
                <div className="text-center sm:text-left">
                    <div className="flex items-center gap-3 justify-center sm:justify-start">
                        <h2 className="text-2xl font-bold text-white capitalize">{user.name}</h2>
                        {user.role === 'admin' && (
                            <span className="bg-amber-500 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded shadow-sm">
                                Admin
                            </span>
                        )}
                    </div>
                    <p className="text-sky-200/80 font-medium mt-1">{user.phone}</p>
                    <p className="text-sky-200/50 text-sm mt-0.5">{user.location}</p>
                </div>
            </div>

            {/* Admin Dashboard */}
            {user.role === 'admin' && (
                <div className="mt-4 border border-amber-500/30 bg-amber-500/10 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-amber-400 flex items-center gap-2 mb-4">
                        <ShieldAlert className="w-5 h-5" /> Admin Dashboard
                    </h3>
                    <p className="text-white/80 text-sm mb-4 leading-relaxed">
                        Welcome to the administrative portal. From here you can manage global application alerts, reset caches, and view systemic user data.
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                        <button className="bg-amber-500/20 hover:bg-amber-500/40 text-amber-200 py-3 rounded-lg border border-amber-500/20 transition-all font-semibold text-sm">
                            Broadcast Emergency
                        </button>
                        <button className="bg-white/5 hover:bg-white/10 text-white py-3 rounded-lg border border-white/10 transition-all font-semibold text-sm">
                            View System Logs
                        </button>
                    </div>
                </div>
            )}

            <div className="flex flex-col gap-4 mt-6 border-t border-sky-400/20 pt-6">
                <h3 className="text-lg font-semibold text-red-400 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    Danger Zone
                </h3>

                <div className="glass rounded-xl p-4 border border-red-500/30 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between shadow-[inset_0_0_10px_rgba(239,68,68,0.1)]">
                    <div>
                        <h4 className="font-semibold text-white">Delete Account</h4>
                        <p className="text-sm text-red-200/60 mt-1">
                            Permanently delete your account and all associated data. This action cannot be undone.
                        </p>
                    </div>

                    {!showDeleteConfirm ? (
                        <button
                            onClick={() => setShowDeleteConfirm(true)}
                            className="whitespace-nowrap px-4 py-2 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-colors border border-red-500/30 rounded-lg font-medium"
                        >
                            Delete Account
                        </button>
                    ) : (
                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleDeleteAccount}
                                className="whitespace-nowrap px-4 py-2 bg-red-500 text-white hover:bg-red-600 transition-colors rounded-lg font-medium shadow-sm"
                            >
                                Confirm
                            </button>
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                className="whitespace-nowrap px-4 py-2 bg-[#0c1527] text-white hover:bg-[#0c1527]/80 border border-white/20 transition-colors rounded-lg font-medium"
                            >
                                Cancel
                            </button>
                        </div>
                    )}
                </div>

                <div className="glass rounded-xl p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mt-2">
                    <div>
                        <h4 className="font-semibold text-white">Logout</h4>
                    </div>
                    <button
                        onClick={logout}
                        className="whitespace-nowrap px-4 py-2 bg-sky-500/10 text-sky-400 hover:bg-sky-500 hover:text-white transition-colors border border-sky-500/30 rounded-lg font-medium flex items-center gap-2"
                    >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                    </button>
                </div>
            </div>
        </div>
    );
}
