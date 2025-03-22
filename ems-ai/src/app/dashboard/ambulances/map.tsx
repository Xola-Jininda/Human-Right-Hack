import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Create a custom pinpoint icon
const pinIcon = new L.Icon({
  iconUrl: '/leaflet/pin-icon.png',
  iconRetinaUrl: '/leaflet/pin-icon-2x.png',
  shadowUrl: '/leaflet/pin-shadow.png',
  iconSize: [25, 41],     // size of the icon
  iconAnchor: [12, 41],   // point of the icon which will correspond to marker's location
  popupAnchor: [1, -34],  // point from which the popup should open relative to the iconAnchor
  shadowSize: [41, 41]
});

type AmbulanceType = {
  id: number;
  callSign: string;
  district: string;
  location: { lat: number; lng: number };
  status: string;
  batteryLevel: number;
  lastMaintenance: string;
  crew: string[];
  contact: string;
};

interface MapProps {
  ambulances: AmbulanceType[];
  selectedAmbulance: number | null;
  onAmbulanceSelect: (id: number) => void;
}

export default function Map({ ambulances, selectedAmbulance, onAmbulanceSelect }: MapProps) {
  return (
    <MapContainer 
      center={[-32.2968, 26.4194]} // Eastern Cape center
      zoom={7} 
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {ambulances.map((ambulance) => (
        <Marker 
          key={ambulance.id}
          position={[ambulance.location.lat, ambulance.location.lng]}
          icon={pinIcon}
          interactive={false}
        >
          <Popup>
            <div>
              <h3 className="font-medium">{ambulance.callSign}</h3>
              <p>Status: {ambulance.status}</p>
              <p>District: {ambulance.district}</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
} 