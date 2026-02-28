"use client";

import * as React from "react";
import { Check, ChevronsUpDown, MapPin, Search } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { useLanguage } from "@/lib/i18n";

interface LocationData {
    id: string;
    name: string;
}

interface LocationSearchProps {
    locations: LocationData[];
    value: string;
    onChange: (value: string) => void;
}

export function LocationSearch({ locations, value, onChange }: LocationSearchProps) {
    const [open, setOpen] = React.useState(false);
    const { t } = useLanguage();

    const selectedLocation = locations.find((loc) => loc.id === value);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full sm:w-[280px] justify-between bg-transparent border-0 hover:bg-white/10 text-white hover:text-white px-2 h-10 text-xl font-bold rounded-lg shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                >
                    <div className="flex items-center gap-2 truncate">
                        {selectedLocation ? selectedLocation.name : "Select location..."}
                    </div>
                    <ChevronsUpDown className="ml-2 h-5 w-5 shrink-0 opacity-50 text-white" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[280px] p-0 border-sky-400/30 bg-[#010a17]/95 backdrop-blur-xl text-sky-100 shadow-[0_0_30px_rgba(2,132,199,0.3)]">
                <Command className="bg-transparent">
                    <CommandInput
                        placeholder="Search location..."
                        className="text-sky-100 placeholder:text-sky-200/50"
                    />
                    <CommandList className="max-h-[300px] overflow-y-auto no-scrollbar">
                        <CommandEmpty className="text-sm py-4 text-center text-sky-200/50">No location found.</CommandEmpty>
                        <CommandGroup>
                            {locations.map((loc) => (
                                <CommandItem
                                    key={loc.id}
                                    value={loc.name}
                                    onSelect={() => {
                                        onChange(loc.id);
                                        setOpen(false);
                                    }}
                                    className="aria-selected:bg-sky-500/20 aria-selected:text-white text-sky-100/80 cursor-pointer"
                                >
                                    <MapPin className={cn("mr-2 h-4 w-4", value === loc.id ? "opacity-100 text-sky-400" : "opacity-0")} />
                                    {loc.name}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
