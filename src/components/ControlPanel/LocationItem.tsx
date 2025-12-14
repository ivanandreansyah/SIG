import { Location } from "@/types";
import { ChevronRight, MapPin, Image as ImageIcon } from "lucide-react";

interface LocationItemProps {
    location: Location;
    onClick?: () => void;
}

export const LocationItem = ({ location, onClick }: LocationItemProps) => {
    const conditionColor =
        {
            Baik: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
            "Rusak Ringan": "text-amber-400 bg-amber-400/10 border-amber-400/20",
            "Rusak Berat": "text-rose-400 bg-rose-400/10 border-rose-400/20",
        }[location.condition || ""] || "text-slate-400 bg-slate-400/10 border-slate-400/20";

    const hasImage = location.images && location.images.length > 0;

    return (
        <button
            onClick={onClick}
            className="w-full group relative flex items-center gap-3 p-3 bg-slate-900/40 hover:bg-slate-800/60 border border-white/5 hover:border-blue-500/30 rounded-2xl transition-all duration-300 text-left mb-2 backdrop-blur-sm shadow-sm hover:shadow-blue-900/10"
        >
            {/* Thumbnail / Icon */}
            <div className="relative w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-slate-800 border border-white/10 group-hover:border-blue-500/30 transition-colors">
                {hasImage ? (
                    <img
                        src={location.images![0]}
                        alt={location.name}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900">
                        <ImageIcon className="w-5 h-5 text-slate-600 group-hover:text-blue-400 transition-colors" />
                    </div>
                )}
                {/* Status Dot Overlay */}
                <div
                    className="absolute bottom-1 right-1 w-2.5 h-2.5 rounded-full border-2 border-slate-900 shadow-sm"
                    style={{ backgroundColor: location.color || "#3b82f6" }}
                />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 py-0.5">
                <h3 className="text-sm font-semibold text-slate-200 group-hover:text-blue-400 truncate transition-colors pr-6">
                    {location.name}
                </h3>

                <div className="flex items-center gap-2 mt-1">
                    {location.condition && (
                        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${conditionColor}`}>
                            {location.condition}
                        </span>
                    )}
                    {/* Divider */}
                    {location.dusun && (
                        <>
                            <span className="w-1 h-1 rounded-full bg-slate-700"></span>
                            <span className="text-[10px] text-slate-500 truncate">
                                {location.dusun}
                            </span>
                        </>
                    )}
                </div>
            </div>

            {/* Arrow Action */}
            <div className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                <div className="p-1.5 rounded-full bg-blue-500/10 text-blue-400">
                    <ChevronRight className="w-4 h-4" />
                </div>
            </div>

            {/* Address tooltip/subtext fallback if needed could go here, but keeping it clean for now */}
        </button>
    );
};
