import { Search, Filter, Layers, ChevronDown, Check, Minus, Map as MapIcon, RotateCcw } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { Category, Location } from "@/types";
import { CONDITION_FILTERS } from "@/constants";
import { useState, useMemo } from "react";
import { LocationItem } from "./LocationItem";

// Helper to render dynamic icons safely
const DynamicIcon = ({ name, className }: { name?: string | null; className?: string }) => {
  if (!name) return <Layers className={className} />;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let Icon = (LucideIcons as any)[name];

  // Try PascalCase
  if (!Icon) {
    const pascalName = name
      .split("-")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
      .join("");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Icon = (LucideIcons as any)[pascalName];
  }

  // Fallback: Case-insensitive search
  if (!Icon) {
    const lowerName = name.toLowerCase().replace(/-/g, "");
    const foundKey = Object.keys(LucideIcons).find(
      (key) => key.toLowerCase() === lowerName
    );
    if (foundKey) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      Icon = (LucideIcons as any)[foundKey];
    }
  }

  if (!Icon) return <Layers className={className} />;
  return <Icon className={className} />;
};

interface LayersViewProps {
  categories: Category[];
  locations: Location[];
  selectedSubcategories: string[];
  selectedConditions: string[];
  loading: boolean;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onReset: () => void;
  onSubcategoryChange: (id: string) => void;
  onSubcategoriesChange: (ids: string[]) => void;
  onConditionChange: (condition: string) => void;
  onLocationClick?: (location: Location) => void;
}

export const LayersView = ({
  categories,
  locations,
  selectedSubcategories,
  selectedConditions,
  loading,
  searchQuery,
  onSearchChange,
  onReset,
  onSubcategoryChange,
  onSubcategoriesChange,
  onConditionChange,
  onLocationClick,
}: LayersViewProps) => {
  // Calculate used subcategory IDs
  const usedSubcategoryIds = useMemo(() => {
    const ids = new Set<string>();
    locations.forEach((loc) => {
      if (loc.subcategory_id) {
        ids.add(loc.subcategory_id);
      }
    });
    return ids;
  }, [locations]);

  // Filter locations based on search query
  const filteredLocations = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    return locations.filter(
      (loc) =>
        loc.name?.toLowerCase().includes(query) ||
        loc.description?.toLowerCase().includes(query) ||
        loc.address?.toLowerCase().includes(query)
    );
  }, [locations, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <div className="space-y-4">
        <div className="relative group">
          <input
            type="text"
            placeholder="Cari lokasi, alamat..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="block w-full px-3 py-3 bg-slate-900/40 border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all shadow-sm group-hover:border-white/20"
          />
        </div>
      </div>

      {searchQuery.trim() ? (
        // Search Results View
        <div className="space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Search className="w-3 h-3 text-purple-400" />
              Hasil Pencarian
            </h2>
            <span className="px-2 py-0.5 rounded-full bg-white/10 text-[10px] font-medium text-slate-300">
              {filteredLocations.length}
            </span>
          </div>

          {filteredLocations.length === 0 ? (
            <div className="text-center py-10 opacity-60">
              <MapIcon className="w-8 h-8 mx-auto mb-2 text-slate-600" />
              <p className="text-sm text-slate-400">Tidak ada lokasi ditemukan.</p>
            </div>
          ) : (
            <div className="space-y-2">
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
      ) : (
        // Default Layers View
        <>
          {/* Categories Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Layers className="w-3 h-3 text-purple-400" />
                Layer Peta
              </h2>
              {(selectedSubcategories.length > 0 || selectedConditions.length > 0) && (
                <button
                  onClick={onReset}
                  className="flex items-center gap-1 text-[10px] text-purple-300 hover:text-white transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  Reset Filter
                </button>
              )}
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-12 gap-3 opacity-60">
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-purple-500"></div>
                <p className="text-xs text-slate-400">Memuat data layer...</p>
              </div>
            ) : (
              <div className="space-y-2">
                {categories.map((category) => (
                  <CategoryItem
                    key={category.id}
                    category={category}
                    usedSubcategoryIds={usedSubcategoryIds}
                    selectedSubcategories={selectedSubcategories}
                    onSubcategoryChange={onSubcategoryChange}
                    onSubcategoriesChange={onSubcategoriesChange}
                    onCategoryToggle={(cat, isChecked) => {
                      // Logic handled in child or parent, here we pass generic
                      const visibleSubcategories = cat.subcategories?.filter(s => usedSubcategoryIds.has(s.id)) || [];
                      const subIds = visibleSubcategories.map((s) => s.id);
                      const allIds = [...subIds, cat.id];

                      if (isChecked) {
                        const toAdd = allIds.filter((id) => !selectedSubcategories.includes(id));
                        onSubcategoriesChange([...selectedSubcategories, ...toAdd]);
                      } else {
                        const newSelected = selectedSubcategories.filter((id) => !allIds.includes(id));
                        onSubcategoriesChange(newSelected);
                      }
                    }}
                  />
                ))}
                {categories.length === 0 && (
                  <div className="text-center py-8 border border-dashed border-white/10 rounded-xl bg-white/5">
                    <p className="text-sm text-slate-400">
                      Layer tidak tersedia
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Condition Filters */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Filter className="w-3 h-3 text-purple-400" />
                Filter Kondisi
              </h2>
            </div>

            <div className="flex flex-wrap gap-2">
              {CONDITION_FILTERS.map((status) => {
                const isSelected = selectedConditions.includes(status);
                let colorClass = "";

                // Dynamic color classes based on condition type (heuristic)
                if (status.includes("Baik")) colorClass = isSelected ? "bg-emerald-600 border-emerald-500 shadow-emerald-900/20" : "hover:text-emerald-400 hover:border-emerald-500/30";
                else if (status.includes("Ringan")) colorClass = isSelected ? "bg-amber-600 border-amber-500 shadow-amber-900/20" : "hover:text-amber-400 hover:border-amber-500/30";
                else if (status.includes("Berat")) colorClass = isSelected ? "bg-red-600 border-red-500 shadow-red-900/20" : "hover:text-red-400 hover:border-red-500/30";
                else colorClass = isSelected ? "bg-blue-600 border-blue-500" : "hover:text-blue-400";

                return (
                  <button
                    key={status}
                    onClick={() => onConditionChange(status)}
                    className={`px-3 py-1.5 text-[11px] font-medium rounded-lg transition-all duration-200 cursor-pointer border ${isSelected
                      ? `${colorClass} text-white shadow-lg`
                      : "bg-slate-900/40 border-white/10 text-slate-400 hover:bg-slate-800 " + colorClass
                      }`}
                  >
                    {status}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// Extracted sub-component for category items
interface CategoryItemProps {
  category: Category;
  usedSubcategoryIds: Set<string>;
  selectedSubcategories: string[];
  onSubcategoryChange: (id: string) => void;
  onSubcategoriesChange: (ids: string[]) => void;
  onCategoryToggle: (category: Category, isChecked: boolean) => void;
}

const CategoryItem = ({
  category,
  usedSubcategoryIds,
  selectedSubcategories,
  onSubcategoryChange,
  onCategoryToggle,
}: CategoryItemProps) => {
  const [isExpanded, setIsExpanded] = useState(false); // Default collapsed for cleaner look

  // Filter subcategories based on usage
  const visibleSubcategories = useMemo(() => {
    return category.subcategories?.filter(sub => usedSubcategoryIds.has(sub.id)) || [];
  }, [category.subcategories, usedSubcategoryIds]);

  const hasSubcategories = visibleSubcategories.length > 0;

  // Check if all visible subcategories are selected
  const isAllSelected = useMemo(() => {
    if (!hasSubcategories) {
      return selectedSubcategories.includes(category.id);
    }
    return (
      visibleSubcategories.every((sub) =>
        selectedSubcategories.includes(sub.id)
      ) && selectedSubcategories.includes(category.id)
    );
  }, [category.id, selectedSubcategories, hasSubcategories, visibleSubcategories]);

  const handleToggleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onCategoryToggle(category, !isAllSelected);
  };

  return (
    <div className={`rounded-xl overflow-hidden transition-all duration-300 border ${isAllSelected ? "bg-slate-800/80 border-purple-500/30 shadow-lg shadow-purple-900/10" : "bg-slate-900/30 border-white/5 hover:bg-slate-800/50"
      }`}>
      <div
        className="flex items-center justify-between p-3 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <div className={`p-1.5 rounded-lg ${isAllSelected ? "bg-purple-500 text-white" : "bg-white/5 text-slate-400"}`}>
            <DynamicIcon name={category.icon} className="w-4 h-4" />
          </div>
          <span className={`text-sm font-medium transition-colors ${isAllSelected ? "text-white" : "text-slate-300"}`}>
            {category.name}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {hasSubcategories && (
            <div className={`text-slate-500 transition-transform duration-300 ${isExpanded ? 'rotate-180' : 'rotate-0'}`}>
              <ChevronDown className="w-4 h-4" />
            </div>
          )}
          <div
            onClick={handleToggleClick}
            className={`w-9 h-5 rounded-full relative transition-colors duration-200 ease-in-out cursor-pointer ${isAllSelected ? 'bg-purple-600' : 'bg-slate-700'
              }`}
          >
            <div className={`absolute top-1 left-1 bg-white w-3 h-3 rounded-full shadow-sm transition-transform duration-200 ${isAllSelected ? 'translate-x-4' : 'translate-x-0'
              }`} />
          </div>
        </div>
      </div>

      <div
        className={`transition-all duration-300 ease-in-out border-t border-white/5 overflow-hidden bg-slate-950/20 ${isExpanded && hasSubcategories ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
          }`}
      >
        <div className="py-1">
          {hasSubcategories && visibleSubcategories.map((sub) => (
            <ToggleItem
              key={sub.id}
              label={sub.name}
              checked={selectedSubcategories.includes(sub.id)}
              onChange={() => onSubcategoryChange(sub.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// Reusable toggle component
interface ToggleItemProps {
  label: string;
  checked: boolean;
  onChange: () => void;
}

const ToggleItem = ({
  label,
  checked,
  onChange,
}: ToggleItemProps) => (
  <div
    onClick={onChange}
    className="flex items-center justify-between py-2.5 px-4 pl-12 hover:bg-white/5 cursor-pointer group transition-colors"
  >
    <span className={`text-xs transition-colors ${checked ? "text-purple-300 font-medium" : "text-slate-500 group-hover:text-slate-400"
      }`}>
      {label}
    </span>

    <div className={`w-2 h-2 rounded-full ring-2 ring-offset-2 ring-offset-slate-900 transition-all ${checked ? "bg-purple-500 ring-purple-500" : "bg-transparent ring-slate-700 group-hover:ring-slate-600"
      }`} />
  </div>
);
