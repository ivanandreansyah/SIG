import { Location, Category } from "@/types";
import { useMemo } from "react";
import { MapPin, LayoutGrid, CheckCircle2, AlertTriangle, Activity } from "lucide-react";
import { CATEGORY_COLORS } from "@/constants";

interface StatisticsViewProps {
    locations: Location[];
    categories: Category[];
}

export const StatisticsView = ({ locations, categories }: StatisticsViewProps) => {
    // Calculate stats
    const stats = useMemo(() => {
        const totalLocations = locations.length;

        // Count by category
        const categoryCounts = categories.map((cat, index) => {
            const count = locations.filter(l => l.category_id === cat.id).length;
            return {
                name: cat.name,
                count,
                color: CATEGORY_COLORS[index % CATEGORY_COLORS.length]
            };
        }).sort((a, b) => b.count - a.count);

        // Count by condition
        const conditionCounts = {
            baik: locations.filter(l => l.condition === "Baik").length,
            rusakRingan: locations.filter(l => l.condition === "Rusak Ringan").length,
            rusakBerat: locations.filter(l => l.condition === "Rusak Berat").length,
        };

        return {
            totalLocations,
            categoryCounts,
            conditionCounts
        };
    }, [locations, categories]);

    return (
        <div className="space-y-6 pb-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-2 gap-3">
                <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 p-4 rounded-2xl border border-blue-500/20 backdrop-blur-sm flex flex-col justify-between group hover:border-blue-500/40 transition-all">
                    <div className="flex items-start justify-between mb-2">
                        <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400 group-hover:text-blue-300 group-hover:scale-110 transition-all">
                            <MapPin size={18} />
                        </div>
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-white tracking-tight">{stats.totalLocations}</p>
                        <p className="text-xs text-blue-300/80 font-medium uppercase tracking-wider mt-0.5">Total Lokasi</p>
                    </div>
                </div>
                <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 p-4 rounded-2xl border border-emerald-500/20 backdrop-blur-sm flex flex-col justify-between group hover:border-emerald-500/40 transition-all">
                    <div className="flex items-start justify-between mb-2">
                        <div className="p-2 bg-emerald-500/20 rounded-lg text-emerald-400 group-hover:text-emerald-300 group-hover:scale-110 transition-all">
                            <LayoutGrid size={18} />
                        </div>
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-white tracking-tight">{categories.length}</p>
                        <p className="text-xs text-emerald-300/80 font-medium uppercase tracking-wider mt-0.5">Kategori</p>
                    </div>
                </div>
            </div>

            {/* Category List */}
            <div>
                <h3 className="text-sm font-bold text-white mb-4 tracking-wide">Distribusi Kategori</h3>
                <div className="space-y-4">
                    {stats.categoryCounts.map((cat) => (
                        <div key={cat.name} className="group">
                            <div className="flex justify-between items-center mb-1.5">
                                <span className="text-sm text-slate-300 font-medium group-hover:text-white transition-colors">
                                    {cat.name}
                                </span>
                                <span className="text-sm font-bold text-white">
                                    {cat.count}
                                </span>
                            </div>
                            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                <div
                                    className="h-full rounded-full transition-all duration-500 group-hover:opacity-80"
                                    style={{
                                        width: `${stats.totalLocations > 0 ? (cat.count / stats.totalLocations) * 100 : 0}%`,
                                        backgroundColor: cat.color
                                    }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Condition Stats */}
            <div>
                <h3 className="text-sm font-bold text-white mb-3 tracking-wide">Kondisi Infrastruktur</h3>
                <div className="space-y-3">
                    <div className="bg-gradient-to-r from-emerald-500/10 to-emerald-600/5 p-3 rounded-xl border border-emerald-500/20 flex items-center justify-between group hover:border-emerald-500/40 transition-all">
                        <div className="flex items-center gap-3">
                            <div className="p-1.5 bg-emerald-500/20 rounded-lg text-emerald-400 group-hover:scale-110 transition-transform">
                                <CheckCircle2 size={16} />
                            </div>
                            <span className="text-sm font-medium text-slate-200">Baik</span>
                        </div>
                        <span className="text-lg font-bold text-white font-mono">{stats.conditionCounts.baik}</span>
                    </div>

                    <div className="bg-gradient-to-r from-amber-500/10 to-amber-600/5 p-3 rounded-xl border border-amber-500/20 flex items-center justify-between group hover:border-amber-500/40 transition-all">
                        <div className="flex items-center gap-3">
                            <div className="p-1.5 bg-amber-500/20 rounded-lg text-amber-400 group-hover:scale-110 transition-transform">
                                <AlertTriangle size={16} />
                            </div>
                            <span className="text-sm font-medium text-slate-200">Rusak Ringan</span>
                        </div>
                        <span className="text-lg font-bold text-white font-mono">{stats.conditionCounts.rusakRingan}</span>
                    </div>

                    <div className="bg-gradient-to-r from-red-500/10 to-red-600/5 p-3 rounded-xl border border-red-500/20 flex items-center justify-between group hover:border-red-500/40 transition-all">
                        <div className="flex items-center gap-3">
                            <div className="p-1.5 bg-red-500/20 rounded-lg text-red-400 group-hover:scale-110 transition-transform">
                                <Activity size={16} />
                            </div>
                            <span className="text-sm font-medium text-slate-200">Rusak Berat</span>
                        </div>
                        <span className="text-lg font-bold text-white font-mono">{stats.conditionCounts.rusakBerat}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
