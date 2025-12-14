"use client";

import { MapPin, Search } from "lucide-react";
import { Location } from "@/types";
import { useState, useMemo } from "react";
import { LocationItem } from "./LocationItem";

interface ListViewProps {
  locations: Location[];
  loading: boolean;
  onLocationClick?: (location: Location) => void;
}

export const ListView = ({
  locations,
  loading,
  onLocationClick,
}: ListViewProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredLocations = useMemo(() => {
    if (!searchQuery.trim()) return locations;
    const query = searchQuery.toLowerCase();
    return locations.filter(
      (loc) =>
        loc.name?.toLowerCase().includes(query) ||
        loc.description?.toLowerCase().includes(query) ||
        loc.address?.toLowerCase().includes(query)
    );
  }, [locations, searchQuery]);

  return (
    <>
      {/* Search */}
      <div className="relative mb-4">
        <input
          type="text"
          placeholder="Cari lokasi..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all backdrop-blur-sm"
        />
      </div>

      {/* Location List */}
      <div className="space-y-2">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-semibold text-white flex items-center gap-1.5 tracking-wide">
            <MapPin className="w-3.5 h-3.5" />
            Semua Lokasi
          </h2>
          <span className="text-[10px] text-slate-400">
            {filteredLocations.length} lokasi
          </span>
        </div>

        {loading ? (
          <div className="text-xs text-slate-400">Memuat lokasi...</div>
        ) : filteredLocations.length === 0 ? (
          <div className="text-xs text-slate-400 italic">
            {searchQuery ? "Lokasi tidak ditemukan." : "Belum ada lokasi."}
          </div>
        ) : (
          <div className="space-y-1">
            {filteredLocations.map((location) => (
              <LocationItem
                key={location.id}
                location={location}
                onClick={() => onLocationClick?.(location)}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
};


