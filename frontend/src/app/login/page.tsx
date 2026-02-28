"use client";

import { useState } from "react";
import { User, Phone, Anchor, ShieldCheck } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const { login } = useAuth();
    const router = useRouter();

    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [location, setLocation] = useState("Visakhapatnam Coast");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !phone) return;

        // Call our context login
        login(name, phone, location);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 animate-in fade-in duration-500 pt-10">

            <div className="glass rounded-[2rem] p-8 md:p-12 text-white shadow-xl w-full max-w-md relative overflow-hidden">
                {/* Decor */}
                <Anchor className="absolute -left-8 -top-8 w-48 h-48 text-sky-900/20 -rotate-12 pointer-events-none" />

                <div className="flex flex-col items-center text-center mb-10 relative z-10">
                    <div className="bg-sky-500/20 p-4 rounded-xl border border-sky-400/30 text-sky-400 mb-4 shadow-[0_0_20px_rgba(14,165,233,0.15)]">
                        <ShieldCheck className="w-10 h-10" />
                    </div>
                    <h1 className="text-3xl font-extrabold tracking-tight drop-shadow-sm mb-2">
                        Portal Login
                    </h1>
                    <p className="text-white/60 font-medium text-sm">
                        Enter your details to access your personalized fishing dashboard.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-5 relative z-10">

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-sky-200/80 uppercase tracking-wider ml-1">Full Name</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-sky-400">
                                <User className="w-5 h-5" />
                            </div>
                            <input
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Enter your name"
                                className="w-full bg-[#010a17]/50 border border-sky-500/30 text-white rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400/50 transition-all placeholder:text-white/30"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-sky-200/80 uppercase tracking-wider ml-1">Mobile Number</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-sky-400">
                                <Phone className="w-5 h-5" />
                            </div>
                            <input
                                type="tel"
                                required
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                pattern="[0-9]{10}"
                                placeholder="10-digit number"
                                className="w-full bg-[#010a17]/50 border border-sky-500/30 text-white rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400/50 transition-all placeholder:text-white/30"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-sky-200/80 uppercase tracking-wider ml-1">Home Port</label>
                        <select
                            required
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            className="w-full bg-[#010a17]/50 border border-sky-500/30 text-white rounded-xl py-3 px-4 appearance-none focus:outline-none focus:border-sky-400 transition-all"
                        >
                            <option value="Visakhapatnam Coast">Visakhapatnam</option>
                            <option value="Kakinada Coast">Kakinada</option>
                            <option value="Machilipatnam Coast">Machilipatnam</option>
                            <option value="Chennai Kasimedu">Chennai Kasimedu</option>
                            <option value="Mumbai Port">Mumbai Port</option>
                        </select>
                    </div>

                    <div className="mt-4 pt-4 border-t border-sky-500/20">
                        <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold rounded-xl py-3.5 transition-all shadow-[0_0_15px_rgba(14,165,233,0.3)] hover:shadow-[0_0_25px_rgba(14,165,233,0.5)] transform hover:-translate-y-0.5"
                        >
                            Sign In
                        </button>
                    </div>
                </form>

            </div>

        </div>
    );
}
