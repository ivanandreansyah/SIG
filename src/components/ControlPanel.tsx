"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect, useMemo, useCallback } from "react";
import { Category, Location } from "@/types";
import {
  NAVBAR_HEIGHT,
  PANEL_WIDTH,
  TOGGLE_BUTTON_SIZE,
  ViewType,
} from "@/constants";
import { LayersView } from "./ControlPanel/LayersView";
import { SettingsView } from "./ControlPanel/SettingsView";
import { ProfileSection } from "./ControlPanel/ProfileSection";
import { ListView } from "./ControlPanel/ListView";
import { StatisticsView } from "./ControlPanel/StatisticsView";
import { ReportView } from "./ControlPanel/ReportView";

// Panel header configuration
const PANEL_HEADERS: Record<ViewType, { title: string; subtitle: string }> = {
  layers: { title: "Peta Desa Mulyoharjo", subtitle: "Dashboard SIG" },
  list: { title: "Direktori Lokasi", subtitle: "Fasilitas & Infrastruktur" },
  statistics: { title: "Statistik Desa", subtitle: "Data & Informasi" },
  profile: { title: "Profil", subtitle: "Akses Pengguna" },
  settings: { title: "Pengaturan Peta", subtitle: "Tampilan & Gaya" },
  report: { title: "Lapor Pembaruan", subtitle: "Partisipasi Warga" },
};

interface ControlPanelProps {
  categories: Category[];
  locations: Location[];
  allLocations?: Location[]; // Added allLocations prop
  selectedSubcategories: string[];
  onSubcategoriesChange: (subcategories: string[]) => void;
  selectedConditions: string[];
  onConditionsChange: (conditions: string[]) => void;
  loading: boolean;
  currentView?: ViewType;
  currentStyle?: string;
  onStyleChange?: (style: string) => void;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  onLocationClick?: (location: Location) => void;
}

const ControlPanel = ({
  categories,
  locations,
  allLocations,
  selectedSubcategories,
  onSubcategoriesChange,
  selectedConditions,
  onConditionsChange,
  loading,
  currentView = "layers",
  currentStyle = "streets",
  onStyleChange,
  isOpen,
  onOpenChange,
  searchQuery = "",
  onSearchChange,
  onLocationClick,
}: ControlPanelProps) => {
  // Internal state removed, using controlled isOpen prop

  const handleClose = useCallback(() => {
    onOpenChange(false);
  }, [onOpenChange]);

  const handleSubcategoryChange = useCallback(
    (id: string) => {
      const updated = selectedSubcategories.includes(id)
        ? selectedSubcategories.filter((item) => item !== id)
        : [...selectedSubcategories, id];
      onSubcategoriesChange(updated);
    },
    [selectedSubcategories, onSubcategoriesChange]
  );

  const handleConditionChange = useCallback(
    (condition: string) => {
      const updated = selectedConditions.includes(condition)
        ? selectedConditions.filter((item) => item !== condition)
        : [...selectedConditions, condition];
      onConditionsChange(updated);
    },
    [selectedConditions, onConditionsChange]
  );

  const handleReset = useCallback(() => {
    onSubcategoriesChange([]);
    onConditionsChange([]);
    onSearchChange?.("");
  }, [onSubcategoriesChange, onConditionsChange, onSearchChange]);

  const header = PANEL_HEADERS[currentView];

  return (
    <>
      {/* Panel Container */}
      <div
        className={`${isOpen
          ? "translate-y-0 opacity-100 pointer-events-auto md:translate-x-0"
          : "-translate-y-[110%] opacity-0 pointer-events-none md:translate-y-0 md:-translate-x-4"
          } fixed z-40 flex flex-col bg-slate-900/95 backdrop-blur-xl border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.4)] transition-all duration-300 cubic-bezier(0.4, 0, 0.2, 1) overflow-hidden
          
          /* Mobile: Top Floating Sheet */
          left-3 right-3 top-4 h-[55vh] rounded-2xl
          
          /* Desktop: Left Side Panel */
          md:left-4 md:top-4 md:bottom-24 md:right-auto md:w-80 md:h-auto md:rounded-2xl
        `}
      >
        {/* Header */}
        <div className="p-5 border-b border-white/10 bg-gradient-to-r from-violet-600/20 via-purple-600/20 to-fuchsia-600/20 flex justify-between items-start">
          <div>
            <h1 className="text-lg font-bold text-white whitespace-nowrap tracking-wide">
              {header.title}
            </h1>
            <p className="text-xs text-slate-300 mt-1 whitespace-nowrap font-medium">
              {header.subtitle}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-3 overflow-y-auto flex-1 custom-scrollbar">
          {currentView === "layers" && (
            <LayersView
              categories={categories}
              locations={allLocations || locations}
              selectedSubcategories={selectedSubcategories}
              selectedConditions={selectedConditions}
              loading={loading}
              searchQuery={searchQuery}
              onSearchChange={(query) => onSearchChange?.(query)}
              onReset={handleReset}
              onSubcategoryChange={handleSubcategoryChange}
              onSubcategoriesChange={onSubcategoriesChange}
              onConditionChange={handleConditionChange}
              onLocationClick={onLocationClick}
            />
          )}
          {currentView === "list" && (
            <ListView
              locations={locations}
              loading={loading}
              onLocationClick={onLocationClick}
            />
          )}
          {currentView === "statistics" && (
            <StatisticsView locations={locations} categories={categories} />
          )}
          {currentView === "profile" && <ProfileSection />}
          {currentView === "settings" && (
            <SettingsView
              currentStyle={currentStyle}
              onStyleChange={(style) => onStyleChange?.(style)}
            />
          )}
          {currentView === "report" && (
            <ReportView locations={allLocations || locations} />
          )}
        </div>
      </div>
    </>
  );
};

export default ControlPanel;
