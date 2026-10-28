"use client";

import { useEffect, useRef, useState } from "react";

export interface MapMarker {
  id: string;
  latitude: number;
  longitude: number;
  title: string;
  address?: string;
  category?: string;
  weight?: number;
  vehicleRec?: string;
  status?: string;
  isDriver?: boolean;
  vehicleType?: string;
}

interface LeafletMapProps {
  markers?: MapMarker[];
  center?: [number, number];
  zoom?: number;
  onLocationSelect?: (lat: number, lng: number) => void;
  selectedLocation?: { lat: number; lng: number; label?: string } | null;
  height?: string;
  interactivePicker?: boolean;
}

export default function LeafletMap({
  markers = [],
  center = [-5.405, 105.261], // Default: Bandar Lampung
  zoom = 13,
  onLocationSelect,
  selectedLocation,
  height = "420px",
  interactivePicker = false,
}: LeafletMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersGroupRef = useRef<any>(null);
  const pickerMarkerRef = useRef<any>(null);
  const prevCenterRef = useRef<[number, number]>(center);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || !mapContainerRef.current) return;

    let isMounted = true;

    import("leaflet").then((L) => {
      if (!isMounted || !mapContainerRef.current) return;

      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      if (!mapInstanceRef.current) {
        const map = L.map(mapContainerRef.current, {
          zoomControl: false,
        }).setView(center, zoom);

        L.control.zoom({ position: "bottomright" }).addTo(map);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        const markersLayer = L.layerGroup().addTo(map);
        markersGroupRef.current = markersLayer;
        mapInstanceRef.current = map;

        map.on("click", (e: any) => {
          const { lat, lng } = e.latlng;
          if (onLocationSelect) {
            onLocationSelect(Number(lat.toFixed(6)), Number(lng.toFixed(6)));
          }
        });
      }

      const map = mapInstanceRef.current;
      const markersLayer = markersGroupRef.current;
      if (!map || !markersLayer) return;

      // Fly to new center if center coordinates changed
      if (
        prevCenterRef.current[0] !== center[0] ||
        prevCenterRef.current[1] !== center[1]
      ) {
        map.flyTo(center, zoom, { duration: 1.0 });
        prevCenterRef.current = center;
      }

      markersLayer.clearLayers();

      // Lucide Trash2 SVG icon for waste report markers
      const trash2Svg = `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>`;

      // Lucide Truck SVG icon for driver markers
      const truckSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/></svg>`;

      // Create custom Trash2 / Driver marker with pin pointer
      const createTrashMarkerIcon = (bgColor: string, badgeText: string, isDriver?: boolean) => {
        return L.divIcon({
          className: "custom-morph-marker",
          html: `
            <div style="
              position: relative;
              display: inline-flex;
              align-items: center;
              gap: 6px;
              background-color: ${bgColor};
              color: #ffffff;
              padding: 6px 11px;
              border-radius: 9999px;
              font-weight: 800;
              font-size: 11px;
              font-family: system-ui, -apple-system, sans-serif;
              box-shadow: 0 6px 16px rgba(0,0,0,0.28);
              border: 2.5px solid #ffffff;
              white-space: nowrap;
              transform: translate(-50%, -100%);
            ">
              <span style="display:flex;align-items:center;justify-content:center;background:rgba(255,255,255,0.2);padding:3px;border-radius:9999px;">
                ${isDriver ? truckSvg : trash2Svg}
              </span>
              <span>${badgeText}</span>
              <div style="
                position: absolute;
                bottom: -7px;
                left: 50%;
                transform: translateX(-50%);
                width: 0;
                height: 0;
                border-left: 6px solid transparent;
                border-right: 6px solid transparent;
                border-top: 7px solid ${bgColor};
              "></div>
            </div>
          `,
          iconSize: [40, 40],
          iconAnchor: [20, 40],
        });
      };

      // Render markers on map
      markers.forEach((m) => {
        let color = "#16a34a"; // Eco Green default
        let label = `${m.weight || 0} kg`;

        if (m.isDriver) {
          color = "#2563eb"; // Blue for active driver
          label = `Driver (${m.vehicleType || "Armada"})`;
        } else if (m.status === "COMPLETED") {
          color = "#64748b"; // Completed slate
          label = `Selesai (${m.weight || 0} kg)`;
        } else if (m.status === "ACCEPTED") {
          color = "#0284c7"; // Sky blue in-progress
          label = `Dijemput • ${m.weight || 0} kg`;
        } else if (m.vehicleRec === "TRUCK") {
          color = "#ea580c"; // Heavy load orange
          label = `${m.weight || 0} kg (Truk)`;
        } else if (m.vehicleRec === "PICKUP") {
          color = "#0d9488"; // Pickup teal
          label = `${m.weight || 0} kg (Pickup)`;
        } else {
          color = "#16a34a"; // Eco Green
          label = `${m.weight || 0} kg (Motor)`;
        }

        const icon = createTrashMarkerIcon(color, label, m.isDriver);
        const marker = L.marker([m.latitude, m.longitude], { icon }).addTo(markersLayer);

        const popupContent = `
          <div style="font-family: system-ui, sans-serif; padding: 4px; min-width: 200px;">
            <div style="font-weight: 800; font-size: 13px; margin-bottom: 4px; color: #0f172a;">
              ${m.title}
            </div>
            ${
              m.address
                ? `<div style="font-size: 11px; color: #64748b; margin-bottom: 6px;">📍 ${m.address}</div>`
                : ""
            }
            ${
              m.isDriver
                ? `
              <div style="font-size: 12px; color: #2563eb; font-weight: 700;">Status: Mitra Driver Siaga</div>
              <div style="font-size: 12px; color: #475569;">Armada: <strong>${m.vehicleType}</strong></div>
            `
                : `
              <div style="font-size: 12px; color: #475569; margin-bottom: 3px;">Kategori: <strong>${m.category || "Sampah"}</strong></div>
              <div style="font-size: 12px; color: #475569; margin-bottom: 3px;">Total Berat: <strong>${m.weight} kg</strong></div>
              <div style="font-size: 12px; color: #16a34a; font-weight: 700; margin-bottom: 6px;">Armada AI: ${m.vehicleRec}</div>
              <div style="font-size: 11px; padding: 3px 8px; border-radius: 6px; background: #f0fdf4; color: #16a34a; border: 1px solid #bbf7d0; display: inline-block; font-weight: 700;">
                Status: ${m.status || "PENDING"}
              </div>
            `
            }
          </div>
        `;
        marker.bindPopup(popupContent);
      });

      // Handle interactive selected location pin (click OR drag)
      if (selectedLocation) {
        if (pickerMarkerRef.current) {
          map.removeLayer(pickerMarkerRef.current);
        }

        const pinTitle = selectedLocation.label || "Titik GPS Terpilih";

        const pickerPinHtml = `
          <div style="
            position: relative;
            display: inline-flex;
            align-items: center;
            gap: 6px;
            background-color: #16a34a;
            color: #ffffff;
            padding: 7px 13px;
            border-radius: 9999px;
            font-weight: 800;
            font-size: 12px;
            box-shadow: 0 8px 20px rgba(22, 163, 74, 0.45);
            border: 2.5px solid #ffffff;
            white-space: nowrap;
            transform: translate(-50%, -100%);
            cursor: grab;
          ">
            ${trash2Svg}
            <span>${pinTitle}</span>
            <div style="
              position: absolute;
              bottom: -8px;
              left: 50%;
              transform: translateX(-50%);
              width: 0;
              height: 0;
              border-left: 7px solid transparent;
              border-right: 7px solid transparent;
              border-top: 8px solid #16a34a;
            "></div>
          </div>
        `;

        const pickerIcon = L.divIcon({
          className: "custom-picker-marker",
          html: pickerPinHtml,
          iconSize: [40, 40],
          iconAnchor: [20, 40],
        });

        const pickerMarker = L.marker([selectedLocation.lat, selectedLocation.lng], {
          icon: pickerIcon,
          draggable: true,
        }).addTo(map);

        pickerMarker.on("dragend", (event: any) => {
          const pos = event.target.getLatLng();
          if (onLocationSelect && pos) {
            onLocationSelect(Number(pos.lat.toFixed(6)), Number(pos.lng.toFixed(6)));
          }
        });

        pickerMarkerRef.current = pickerMarker;
        map.panTo([selectedLocation.lat, selectedLocation.lng]);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [isClient, markers, selectedLocation, interactivePicker, onLocationSelect, center, zoom]);

  if (!isClient) {
    return (
      <div
        style={{ height }}
        className="w-full bg-[#f0fdf4] rounded-2xl flex flex-col items-center justify-center text-slate-400 border border-emerald-200 animate-pulse"
      >
        <div className="w-8 h-8 rounded-full border-2 border-[#16a34a] border-t-transparent animate-spin mb-2" />
        <span className="text-xs font-bold text-[#16a34a]">
          Memuat Peta Interaktif Bandar Lampung...
        </span>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden border border-emerald-200 shadow-xs">
      <div ref={mapContainerRef} style={{ height }} className="w-full z-0" />

      {/* Interactive Picker Helper Pill */}
      {interactivePicker && (
        <div className="absolute bottom-3 left-3 z-[1000] bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-xl border border-emerald-200 text-[11px] font-bold text-slate-800 shadow-md flex items-center gap-2 pointer-events-none">
          <span className="w-2.5 h-2.5 rounded-full bg-[#16a34a] animate-ping" />
          <span>Klik peta atau geser pin hijau untuk mengatur titik koordinat GPS</span>
        </div>
      )}
    </div>
  );
}
