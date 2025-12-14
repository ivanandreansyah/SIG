"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { MapContainer, TileLayer, GeoJSON, ZoomControl } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Location } from "@/types";
import { MAP_CENTER, DEFAULT_ZOOM } from "@/constants";
import type { GeoJsonObject } from "geojson";

// Sub-components
import { MapEvents } from "./MapEvents";
import { FlyToLocation } from "./FlyToLocation";
import { MapTilerController } from "./MapTilerController";
import { LocationMarker } from "./LocationMarker";
import { GEOJSON_STYLE } from "./constants";

interface MapProps {
  locations?: Location[];
  mapStyle?: string;
  selectedLocation?: Location | null;
  onFlyComplete?: () => void;
  onLocationClick?: (location: Location) => void;
}

const Map = ({
  locations = [],
  mapStyle = "light",
  selectedLocation = null,
  onFlyComplete,
  onLocationClick,
}: MapProps) => {
  const [geoJsonData, setGeoJsonData] = useState<GeoJsonObject | null>(null);
  const [zoom, setZoom] = useState(DEFAULT_ZOOM);

  const apiKey = useMemo(() => process.env.NEXT_PUBLIC_MAPTILER_API_KEY, []);

  const handleZoomChange = useCallback((newZoom: number) => {
    setZoom(newZoom);
  }, []);

  // Fetch GeoJSON data
  useEffect(() => {
    const controller = new AbortController();

    fetch("/data/batas_desa.geojson", { signal: controller.signal })
      .then((res) => res.json())
      .then((data) => setGeoJsonData(data))
      .catch((err) => {
        if (err.name !== "AbortError") {
          console.error("Error loading GeoJSON:", err);
        }
      });

    return () => controller.abort();
  }, []);

  return (
    <MapContainer
      center={MAP_CENTER}
      zoom={DEFAULT_ZOOM}
      scrollWheelZoom={true}
      zoomControl={false}
      className="h-full w-full outline-none"
    >
      <MapEvents onZoomChange={handleZoomChange} />
      <FlyToLocation location={selectedLocation} onComplete={onFlyComplete} />

      {apiKey ? (
        <MapTilerController mapStyle={mapStyle} apiKey={apiKey} />
      ) : (
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
      )}

      <ZoomControl position="bottomright" />

      {geoJsonData && (
        <GeoJSON
          data={geoJsonData}
          style={GEOJSON_STYLE}
          onEachFeature={(feature, layer) => {
            // Add click event
            layer.on({
              click: () => {
                const props = feature.properties;
                const popupContent = `
                  <div style="font-family: var(--font-manrope), sans-serif;">
                    <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600;">
                      ${props?.NAMOBJ || 'Area'}
                    </h3>
                    ${props?.WADMKC ? `<p style="margin: 4px 0;"><strong>Kecamatan:</strong> ${props.WADMKC}</p>` : ''}
                    ${props?.WADMKK ? `<p style="margin: 4px 0;"><strong>Kabupaten:</strong> ${props.WADMKK}</p>` : ''}
                    ${props?.WADMPR ? `<p style="margin: 4px 0;"><strong>Provinsi:</strong> ${props.WADMPR}</p>` : ''}
                    ${props?.DATA_PENDUDUK_LAKI_LAKI ? `<p style="margin: 4px 0;"><strong>Penduduk Laki-laki:</strong> ${props.DATA_PENDUDUK_LAKI_LAKI.toLocaleString()}</p>` : ''}
                    ${props?.DATA_PENDUDUK_PEREMPUAN ? `<p style="margin: 4px 0;"><strong>Penduduk Perempuan:</strong> ${props.DATA_PENDUDUK_PEREMPUAN.toLocaleString()}</p>` : ''}
                    ${props?.RT ? `<p style="margin: 4px 0;"><strong>RT:</strong> ${props.RT}</p>` : ''}
                    ${props?.RW ? `<p style="margin: 4px 0;"><strong>RW:</strong> ${props.RW}</p>` : ''}
                  </div>
                `;
                layer.bindPopup(popupContent).openPopup();
              },
              mouseover: (e) => {
                const layer = e.target;
                layer.setStyle({
                  fillOpacity: 0.3,
                  weight: 3,
                });
              },
              mouseout: (e) => {
                const layer = e.target;
                layer.setStyle(GEOJSON_STYLE);
              },
            });
          }}
        />
      )}

      {locations.map((location) => (
        <LocationMarker
          key={location.id}
          location={location}
          zoom={zoom}
          isSelected={selectedLocation?.id === location.id}
          onClick={onLocationClick}
        />
      ))}
    </MapContainer>
  );
};

export default Map;
