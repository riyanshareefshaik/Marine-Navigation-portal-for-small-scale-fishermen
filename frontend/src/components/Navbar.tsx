"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Anchor, Globe, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useLanguage } from "@/lib/i18n";
import { SafetyGuidelines } from "./SafetyGuidelines";
import { useAuth } from "@/context/AuthContext";

export function Navbar() {
    const pathname = usePathname();
    const { language, setLanguage, t } = useLanguage();
    const { user, isLoaded } = useAuth();

    const navItems = [
        { name: t("nav.home"), path: "/" },
        { name: "Weather", path: "/weather" },
        { name: t("nav.history"), path: "/history" },
        { name: t("nav.map"), path: "/map" },
        { name: "Register", path: "/register" },
        { name: user ? t("nav.profile") : "Login", path: user ? "/profile" : "/login" },
    ];

    const [showGuidelines, setShowGuidelines] = useState(false);

    const isHome = pathname === "/";

    return (
        <>
            <nav className="fixed top-0 left-0 right-0 z-50 px-4 py-3 pb-0 pt-[max(0.75rem,env(safe-area-inset-top))]">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                    {/* Logo or Back Button */}
                    <div className="flex items-center gap-2 self-start md:self-auto">
                        {!isHome && (
                            <Link href="/" className="mr-2 p-2 rounded-full hover:bg-white/10 transition-colors">
                                <ChevronLeft className="w-5 h-5 text-sky-400" />
                            </Link>
                        )}
                        <button onClick={() => setShowGuidelines(true)} className="flex items-center gap-2 cursor-pointer transition-transform hover:scale-105">
                            <div className="bg-[#0284c7] rounded-[4px] p-1.5 flex items-center justify-center border border-sky-400/40 shadow-[0_0_15px_rgba(2,132,199,0.5)]">
                                <Anchor className="text-white w-4 h-4 sm:w-5 sm:h-5" />
                            </div>
                        </button>
                    </div>

                    {/* Navigation and Language Tools */}
                    <div className="flex items-center gap-3 self-start md:self-auto">
                        {/* Language Selector */}
                        <div className="hidden sm:block">
                            <Select value={language} onValueChange={(val: any) => setLanguage(val)}>
                                <SelectTrigger className="w-[110px] h-8 bg-[#010a17]/80 border-sky-400/30 text-sky-100 rounded-full text-xs shadow-[inset_0_0_10px_rgba(2,132,199,0.2)] focus:ring-sky-500/50">
                                    <Globe className="w-3.5 h-3.5 mr-1.5 text-sky-400" />
                                    <SelectValue placeholder="Language" />
                                </SelectTrigger>
                                <SelectContent className="bg-[#020817] border-sky-500/30 text-sky-100 max-h-[300px]">
                                    <SelectItem value="en">English</SelectItem>
                                    <SelectItem value="hi">हिंदी (Hindi)</SelectItem>
                                    <SelectItem value="ta">தமிழ் (Tamil)</SelectItem>
                                    <SelectItem value="te">తెలుగు (Telugu)</SelectItem>
                                    <SelectItem value="ml">മലയാളം (Malayalam)</SelectItem>
                                    <SelectItem value="bn">বাংলা (Bengali)</SelectItem>
                                    <SelectItem value="mr">मराठी (Marathi)</SelectItem>
                                    <SelectItem value="gu">ગુજરાતી (Gujarati)</SelectItem>
                                    <SelectItem value="or">ଓଡ଼ିଆ (Odia)</SelectItem>
                                    <SelectItem value="kn">ಕನ್ನಡ (Kannada)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Navigation Tabs */}
                        <div className="flex items-center gap-2 bg-transparent rounded-full border border-sky-400/40 p-1 backdrop-blur-md bg-[#010a17]/80">
                            {navItems.map((item) => {
                                const isActive = pathname === item.path;
                                return (
                                    <Link
                                        key={item.name}
                                        href={item.path}
                                        className={cn(
                                            "px-4 py-1.5 rounded-full text-[13px] font-semibold tracking-wide transition-all duration-200 border",
                                            isActive
                                                ? "bg-gradient-to-r from-[#0ea5e9]/30 to-[#0284c7]/30 text-sky-100 border-[#0ea5e9]/50 shadow-[inset_0_0_15px_rgba(14,165,233,0.3)]"
                                                : "text-sky-200/60 border-transparent hover:text-sky-100 hover:bg-sky-500/10"
                                        )}
                                    >
                                        {item.name}
                                    </Link>
                                );
                            })}
                        </div>

                    </div>
                </div>
            </nav>
            <SafetyGuidelines open={showGuidelines} onOpenChange={setShowGuidelines} />
        </>
    );
}
