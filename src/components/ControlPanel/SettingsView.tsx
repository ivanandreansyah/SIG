"use client";

import { Settings, Map as MapIcon, Sun, Moon, Mountain, Satellite, Layout } from "lucide-react";
import { MAP_STYLES } from "@/constants";
import type { LucideIcon } from "lucide-react";

// Extended configuration for styles with descriptions and colors
const STYLE_CONFIG: Record<string, { icon: LucideIcon; desc: string; color: string }> = {
  streets: {
    icon: MapIcon,
    desc: "Tampilan jalan standar & detail lengkap",
    color: "from-blue-500/20 to-cyan-500/20"
  },
  outdoor: {
    icon: Mountain,
    desc: "Topografi & kontur alam",
    color: "from-green-500/20 to-emerald-500/20"
  },
  dark: {
    icon: Moon,
    desc: "Mode gelap kontras tinggi",
    color: "from-slate-700/50 to-slate-900/50"
  },
  light: {
    icon: Sun,
    desc: "Tampilan terang & bersih",
    color: "from-orange-500/20 to-amber-500/20"
  },
  satellite: {
    icon: Satellite,
    desc: "Citra satelit bumi nyata",
    color: "from-indigo-500/20 to-violet-500/20"
  },
};

interface SettingsViewProps {
  currentStyle: string;
  onStyleChange: (style: string) => void;
}

export const SettingsView = ({
  currentStyle,
  onStyleChange,
}: SettingsViewProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b border-white/10">
        <div className="p-2 rounded-lg bg-gradient-to-br from-slate-700 to-slate-800 shadow-inner">
          <Settings className="w-5 h-5 text-purple-300" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-white tracking-wide">
            Pengaturan Peta
          </h2>
          <p className="text-[10px] text-slate-400">
            Personalisasi tampilan visual
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider pl-1 flex items-center gap-2">
          <Layout className="w-3 h-3" />
          Gaya Peta
        </h3>

        <div className="grid grid-cols-1 gap-2.5">
          {MAP_STYLES.map((style) => {
            const config = STYLE_CONFIG[style.id] || STYLE_CONFIG.streets;
            const Icon = config.icon;
            const isSelected = currentStyle === style.id;

            return (
              <button
                key={style.id}
                onClick={() => onStyleChange(style.id)}
                className={`relative group flex items-center gap-3 p-3 rounded-xl border text-left transition-all duration-300 ${isSelected
                    ? "bg-slate-800 border-purple-500/50 shadow-lg shadow-purple-900/20"
                    : "bg-slate-900/40 border-white/5 hover:border-white/10 hover:bg-slate-800/60"
                  }`}
              >
                {/* Background glow effect for selected state */}
                {isSelected && (
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-transparent rounded-xl pointer-events-none" />
                )}

                <div
                  className={`p-2.5 rounded-lg border flex-shrink-0 transition-colors ${isSelected
                      ? "bg-purple-500 text-white border-purple-400"
                      : `bg-gradient-to-br ${config.color} text-slate-400 border-white/5 group-hover:text-white`
                    }`}
                >
                  <Icon className="w-5 h-5" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className={`text-sm font-medium transition-colors ${isSelected ? "text-white" : "text-slate-300 group-hover:text-white"
                      }`}>
                      {style.name}
                    </span>
                    {isSelected && (
                      <span className="flex h-2 w-2 rounded-full bg-purple-400 shadow-[0_0_8px_rgba(192,132,252,0.6)]" />
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 truncate mt-0.5 group-hover:text-slate-400 transition-colors">
                    {config.desc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Additional Settings Section Placeholder - can be expanded later */}
      <div className="pt-4 border-t border-white/10 opacity-50 pointer-events-none grayscale">
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider pl-1 mb-3">
          Layer Tambahan
        </h3>
        <div className="p-3 rounded-xl border border-white/5 bg-slate-900/20 flex items-center justify-between">
          <span className="text-sm text-slate-500">Batas Administrasi</span>
          <div className="w-8 h-4 bg-slate-700/50 rounded-full" />
        </div>
      </div>
    </div>
  );
};
