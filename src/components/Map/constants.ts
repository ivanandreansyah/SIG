// Map-specific constants

export const FOCUS_ZOOM = 18;

export const GEOJSON_STYLE = {
  fillColor: "#8b5cf6", // Purple to match theme
  weight: 3, // Thicker border
  opacity: 1,
  color: "#a78bfa", // Lighter purple for border
  dashArray: "5, 5", // Dashed border
  fillOpacity: 0.2, // More visible fill
} as const;

export const STYLE_URLS: Record<string, string> = {
  streets: "streets-v2",
  outdoor: "outdoor-v2",
  dark: "dataviz-dark",
  light: "dataviz-light",
  satellite: "satellite",
};
