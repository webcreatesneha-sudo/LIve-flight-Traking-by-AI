import React, { useEffect, useRef } from 'react';
import { Flight } from '../types';
import L from 'leaflet';
import { PLANE_SVG_ICON } from '../constants';

interface MapProps {
  flights: Flight[];
  selectedFlight: Flight | null;
  onSelectFlight: (flight: Flight) => void;
  center: [number, number];
  zoom: number;
}

// FIX: Renamed component from `Map` to `FlightMap` to resolve a name collision
// with the native JavaScript `Map` object, which caused an error when creating a new Map instance inside the component.
const FlightMap: React.FC<MapProps> = ({ flights, selectedFlight, onSelectFlight, center, zoom }) => {
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Map<string, L.Marker>>(new Map());

  // This effect handles map initialization and cleanup.
  // It runs only once when the component mounts.
  useEffect(() => {
    const map = L.map('map', {
      zoomControl: false,
    });
    mapRef.current = map;

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(map);

    L.control.zoom({
      position: 'bottomright',
    }).addTo(map);
    
    // Cleanup function to run when the component is unmounted.
    // This is crucial for compatibility with React.StrictMode.
    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []); // Empty dependency array ensures this runs only once.

  // This effect handles updating the map's view (center and zoom).
  // It runs whenever `center` or `zoom` props change.
  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.flyTo(center, zoom, {
        animate: true,
        duration: 1.5,
      });
    }
  }, [center, zoom]);

  // This effect handles adding, updating, and removing flight markers.
  useEffect(() => {
    if (!mapRef.current) return;

    const map = mapRef.current;
    const markers = markersRef.current;
    const currentFlightIds = new Set(flights.map(f => f.icao24));

    // Update or add markers
    flights.forEach(flight => {
      const isSelected = selectedFlight?.icao24 === flight.icao24;
      const iconHtml = `<div style="transform: rotate(${flight.heading}deg);" class="transition-transform duration-1000 ease-linear">${PLANE_SVG_ICON(isSelected)}</div>`;
      
      const icon = L.divIcon({
        html: iconHtml,
        className: '', // No default class
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      if (markers.has(flight.icao24)) {
        const marker = markers.get(flight.icao24)!;
        marker.setLatLng([flight.latitude, flight.longitude]);
        marker.setIcon(icon);
      } else {
        const marker = L.marker([flight.latitude, flight.longitude], { icon })
          .addTo(map)
          .on('click', () => onSelectFlight(flight));
        
        marker.bindTooltip(`<b>${flight.callsign}</b><br>${flight.originCode} to ${flight.destinationCode}`, {
            permanent: false, 
            direction: 'top',
            offset: [0, -10],
            className: 'bg-slate-800 text-white border-slate-700'
        });

        markers.set(flight.icao24, marker);
      }
    });

    // Remove old markers
    markers.forEach((marker, icao24) => {
      if (!currentFlightIds.has(icao24)) {
        map.removeLayer(marker);
        markers.delete(icao24);
      }
    });

  }, [flights, onSelectFlight, selectedFlight]);

  return <div id="map" className="h-full w-full" />;
};

export default FlightMap;
