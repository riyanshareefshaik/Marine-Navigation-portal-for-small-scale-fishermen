"use client";

import { useState } from "react";
import { Ship, User, Phone, Anchor, CheckCircle } from "lucide-react";

export default function RegisterPage() {
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
    };

    if (submitted) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center animation-fade-in px-4">
                <div className="bg-[#1fb97e]/20 p-6 rounded-full border-4 border-[#1fb97e]/30 mb-6 text-[#1fb97e] shadow-[0_0_30px_rgba(31,185,126,0.2)]">
                    <CheckCircle className="w-16 h-16" />
                </div>
                <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight drop-shadow-sm mb-4">
                    Registration Successful!
                </h1>
                <p className="text-white/80 text-lg md:text-xl max-w-lg leading-relaxed font-medium">
                    Your vessel has been successfully registered with the Maritime Safety Authority. You will now receive emergency SMS broadcasts.
                </p>
                <button onClick={() => setSubmitted(false)} className="mt-8 px-6 py-3 bg-sky-500 hover:bg-sky-400 text-white font-bold rounded-full transition-all shadow-[0_0_15px_rgba(14,165,233,0.4)] hover:shadow-[0_0_25px_rgba(14,165,233,0.6)]">
                    Register Another Vessel
                </button>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6 w-full max-w-2xl mx-auto animation-fade-in pb-24 relative pt-10 px-4">
            <div className="glass rounded-[2rem] p-8 md:p-12 text-white shadow-xl flex flex-col relative overflow-hidden">
                {/* Decorative background anchor */}
                <Anchor className="absolute -right-8 -bottom-8 w-64 h-64 text-sky-900/10 rotate-12 pointer-events-none" />

                <div className="flex flex-col items-center text-center mb-10 relative z-10">
                    <div className="bg-sky-500/20 p-4 rounded-xl border border-sky-400/30 text-sky-400 mb-4 inline-flex shadow-[0_0_20px_rgba(14,165,233,0.15)]">
                        <Ship className="w-10 h-10 stroke-[2]" />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight drop-shadow-sm mb-2">
                        Fishermen Registration
                    </h1>
                    <p className="text-white/60 font-medium">
                        Register your vessel to receive real-time oceanic safety warnings and emergency broadcasts via SMS.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-6 relative z-10">
                    {/* Full Name */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-sky-200/80 uppercase tracking-wider ml-1">Captain's Full Name</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-sky-400">
                                <User className="w-5 h-5" />
                            </div>
                            <input
                                type="text"
                                required
                                placeholder="Enter full name"
                                className="w-full bg-[#010a17]/50 border border-sky-500/30 text-white rounded-xl py-3.5 pl-12 pr-4 focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400/50 transition-all placeholder:text-white/30"
                            />
                        </div>
                    </div>

                    {/* Phone Number */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-sky-200/80 uppercase tracking-wider ml-1">Mobile Contact Number</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-sky-400">
                                <Phone className="w-5 h-5" />
                            </div>
                            <input
                                type="tel"
                                required
                                pattern="[0-9]{10}"
                                placeholder="10-digit mobile number"
                                className="w-full bg-[#010a17]/50 border border-sky-500/30 text-white rounded-xl py-3.5 pl-12 pr-4 focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400/50 transition-all placeholder:text-white/30"
                            />
                        </div>
                    </div>

                    {/* Registration Numbers Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-sky-200/80 uppercase tracking-wider ml-1">Boat Reg No.</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-sky-400">
                                    <Ship className="w-5 h-5" />
                                </div>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. IND-AP-1234"
                                    className="w-full bg-[#010a17]/50 border border-sky-500/30 text-white rounded-xl py-3.5 pl-12 pr-4 focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400/50 transition-all placeholder:text-white/30"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-sky-200/80 uppercase tracking-wider ml-1">Local Harbor / Port</label>
                            <div className="relative">
                                <select
                                    required
                                    defaultValue=""
                                    className="w-full bg-[#010a17]/50 border border-sky-500/30 text-white rounded-xl py-3.5 px-4 appearance-none focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400/50 transition-all"
                                >
                                    <option value="" disabled>Select home port...</option>
                                    <option value="visakhapatnam">Visakhapatnam</option>
                                    <option value="kakinada">Kakinada</option>
                                    <option value="machilipatnam">Machilipatnam</option>
                                    <option value="chennai">Chennai Kasimedu</option>
                                    <option value="tuticorin">Tuticorin</option>
                                    <option value="mumbai">Mumbai Port</option>
                                    <option value="kochi">Kochi</option>
                                    <option value="mangalore">Mangalore</option>
                                    <option value="veraval">Veraval</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="mt-4 pt-6 border-t border-sky-500/20">
                        <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold text-lg rounded-xl py-4 transition-all shadow-[0_0_15px_rgba(14,165,233,0.3)] hover:shadow-[0_0_25px_rgba(14,165,233,0.5)] transform hover:-translate-y-0.5"
                        >
                            Complete Registration
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
