import { Info, AlertTriangle, ShieldCheck, Anchor, CheckCircle2, XCircle } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

interface SafetyGuidelinesProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function SafetyGuidelines({ open, onOpenChange }: SafetyGuidelinesProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl bg-[#010a17]/95 border-sky-400/30 text-sky-100 max-h-[85vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold flex items-center gap-2 text-white">
                        <Anchor className="w-6 h-6 text-sky-400" />
                        Sea Safety Checklist & Guidelines
                    </DialogTitle>
                    <DialogDescription className="text-sky-200/70">
                        Important safety information for all fishermen before and during voyage.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-8 mt-4">
                    {/* Checklist Section */}
                    <section>
                        <h3 className="text-xl font-semibold mb-4 text-[#0ea5e9] flex items-center gap-2 border-b border-sky-400/20 pb-2">
                            <ShieldCheck className="w-5 h-5" />
                            Pre-Voyage Checklist
                        </h3>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {[
                                "Check Engine performance, Oil & Fuel",
                                "Check for Tools & Spares",
                                "Check Safety Equipments: Life jacket, Lifebuoy",
                                "Check Navigation devices",
                                "Check Communication Equipments",
                                "Check Navigation lights",
                                "Check First Aid Box",
                                "Check all Documents",
                                "Check for enough Food & Water",
                                "Check Weather Forecasts",
                            ].map((item, idx) => (
                                <li key={idx} className="flex items-start gap-2 text-sm bg-sky-500/5 p-2 rounded border border-sky-500/10">
                                    <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-400 shrink-0" />
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </section>

                    {/* DOs Section */}
                    <section>
                        <h3 className="text-xl font-semibold mb-4 text-emerald-400 flex items-center gap-2 border-b border-emerald-400/20 pb-2">
                            <Info className="w-5 h-5" />
                            Safety Guidelines - DO's
                        </h3>
                        <ul className="space-y-2">
                            {[
                                "Carry sufficient life saving equipments onboard",
                                "Conduct proper maintenance of boat and equipments",
                                "Carry essential communication devices onboard",
                                "Keep good look out for other boats and ships while sailing",
                                "Carry the valid registration certificate and fishing license onboard",
                                "Ensure that boat is equipped and crew is trained to handle fire and other accident situations onboard",
                                "Ensure the boat is clean and dry while operating at sea",
                                "Leave information at shore about voyage plan, fishing area and crew members",
                                "Ensure the prescribed standards for Boat design and materials used for boat construction",
                                "Ensure the crew is trained properly on sea safety and navigation",
                                "Follow weather forecasts and warnings carefully",
                                "Conducts proper training and drills on sea safety at sea",
                                "Keep the lifesaving equipments at designated areas onboard."
                            ].map((item, idx) => (
                                <li key={idx} className="flex items-start gap-2 text-sm">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                                    <span className="text-sky-100/90">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </section>

                    {/* DONTs Section */}
                    <section>
                        <h3 className="text-xl font-semibold mb-4 text-rose-400 flex items-center gap-2 border-b border-rose-400/20 pb-2">
                            <AlertTriangle className="w-5 h-5" />
                            Safety Guidelines - DON'Ts
                        </h3>
                        <ul className="space-y-2">
                            {[
                                "Don't use liquors onboard",
                                "Avoid over speed and overconfidence at sea",
                                "Don't carry crew more than the approved capacity of the boat",
                                "Don't use boat in stormy condition",
                                "Don't allow any explosive and hazardous material onboard",
                                "Don't allow overloading",
                                "Don't allow any unauthorized alteration on boat",
                                "Don't allow unauthorized person to get on board",
                                "Don't play with life saving equipments and communication device"
                            ].map((item, idx) => (
                                <li key={idx} className="flex items-start gap-2 text-sm">
                                    <XCircle className="w-4 h-4 mt-0.5 text-rose-400 shrink-0" />
                                    <span className="text-sky-100/90">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </section>

                    {/* Conclusion Text */}
                    <section className="bg-sky-500/10 p-4 rounded-lg border border-sky-500/20">
                        <p className="text-sm text-sky-100/80 leading-relaxed italic">
                            <strong>Conclusion:</strong> Safety at sea is the most important aspect than fishing at sea. Fishermen have to be trained on sea safety and navigation rules to avoid accidents in water. This book is designed for educating fishermen on sea safety and imparting knowledge on the various precautions to be taken while going for fishing. Fishermen must be trained on handling communication devices and safety equipments onboard. Proper awareness on communication and safety devices, and navigation signals and symbols will help fishermen to work without fear at sea.
                        </p>
                    </section>
                </div>
            </DialogContent>
        </Dialog>
    );
}
