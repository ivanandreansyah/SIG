// Layout dimensions
export const NAVBAR_HEIGHT = 80; // Top navbar height (16px + 64px + 16px for padding)
export const PANEL_WIDTH = 320; // Increased panel width for better UX
export const TOGGLE_BUTTON_SIZE = 40;

// Map configuration
export const MAP_CENTER: [number, number] = [-6.58222, 110.68000];
export const DEFAULT_ZOOM = 14;

// Category colors for markers
export const CATEGORY_COLORS = [
  "#a5b4fc",
  "#f9a8d4",
  "#bbf7d0",
  "#fde68a",
  "#c4b5fd",
  "#fbcfe8",
  "#fed7aa",
  "#bae6fd",
] as const;

// Condition filter options
export const CONDITION_FILTERS = [
  "Baik",
  "Rusak Ringan",
  "Rusak Berat",
] as const;

// Map style options
export const MAP_STYLES = [
  { id: "streets", name: "Streets" },
  { id: "outdoor", name: "Outdoor" },
  { id: "dark", name: "Dark" },
  { id: "light", name: "Light" },
  { id: "satellite", name: "Satellite" },
] as const;

// View types
export type ViewType = "layers" | "list" | "profile" | "settings" | "statistics" | "report";
