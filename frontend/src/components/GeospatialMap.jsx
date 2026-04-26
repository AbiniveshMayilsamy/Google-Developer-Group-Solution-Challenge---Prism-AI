import { MapContainer, TileLayer, Circle, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useMemo } from 'react';

const containerStyle = {
  width: '100%',
  height: '400px',
  borderRadius: '12px',
  overflow: 'hidden',
  border: '1px solid var(--border-color)'
};

const center = [11.0168, 76.9558]; // Coimbatore / Tamil Nadu region

// Simulated geographic bias data
const generateHeatData = () => {
  return [
    { lat: 11.0168, lng: 76.9558, weight: 3, label: "Central Zone" },
    { lat: 11.0200, lng: 76.9600, weight: 2, label: "North East" },
    { lat: 11.0100, lng: 76.9500, weight: 5, label: "Critical Bias Zone" }, 
    { lat: 11.0300, lng: 76.9700, weight: 1, label: "Outer Rim" },
    { lat: 11.0000, lng: 76.9400, weight: 4, label: "Southern Corridor" },
  ];
};

export default function GeospatialMap() {
  const biasData = useMemo(() => generateHeatData(), []);

  return (
    <div className="glass-panel" style={{ marginTop: '2rem' }}>
      <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
        <div>
          <h3 style={{ color: 'var(--accent-color)' }}>Geospatial Bias Heatmap</h3>
          <p style={{ color: 'var(--text-secondary)' }}>
            Visualizing geographic "Redlining" using OpenStreetMap.
          </p>
        </div>
        <div style={{ padding: '0.5rem 1rem', background: 'rgba(0, 255, 135, 0.1)', borderRadius: '20px', fontSize: '0.8rem', color: 'var(--accent-secondary)' }}>
          ● API-Free Mode Active
        </div>
      </div>

      <div style={containerStyle}>
        <MapContainer 
          center={center} 
          zoom={13} 
          scrollWheelZoom={false}
          style={{ height: '100%', width: '100%', background: '#1a1a1a' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />
          
          {biasData.map((point, index) => (
            <Circle
              key={index}
              center={[point.lat, point.lng]}
              pathOptions={{ 
                fillColor: point.weight > 3 ? '#ff4444' : '#ffaa00',
                color: 'transparent',
                fillOpacity: point.weight * 0.15
              }}
              radius={500 + (point.weight * 200)}
            >
              <Tooltip permanent={false}>
                <div style={{ color: '#000' }}>
                  <strong>{point.label}</strong><br/>
                  Bias Intensity: {point.weight}/5
                </div>
              </Tooltip>
            </Circle>
          ))}
        </MapContainer>
      </div>

      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '1rem', fontStyle: 'italic' }}>
        Regions in red indicate significantly lower approval rates for unprivileged groups in specific zip codes.
      </p>
    </div>
  );
}
