import { useEffect, useRef, useState, useMemo } from 'react';
import { MapContainer, TileLayer, Circle, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const containerStyle = {
  width: '100%',
  height: '400px',
  borderRadius: '12px',
  overflow: 'hidden',
  border: '1px solid var(--border-color)'
};

const centerCoords = [11.0168, 76.9558]; // Coimbatore / Tamil Nadu region
const centerGoogle = { lat: 11.0168, lng: 76.9558 };

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
  const [mapMode, setMapMode] = useState('leaflet'); // 'leaflet' or 'google'
  const googleMapRef = useRef(null);
  const biasData = useMemo(() => generateHeatData(), []);
  
  const googleMapsKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';
  const isGoogleKeyConfigured = googleMapsKey && !googleMapsKey.includes('YOUR_') && !googleMapsKey.includes('AlozzCD2fu');

  useEffect(() => {
    if (mapMode === 'google' && googleMapsKey) {
      let isMounted = true;
      
      const loadGoogleMap = () => {
        if (!window.google) {
          const script = document.createElement('script');
          script.src = `https://maps.googleapis.com/maps/api/js?key=${googleMapsKey}`;
          script.async = true;
          script.defer = true;
          script.onload = () => {
            if (isMounted) initMap();
          };
          script.onerror = () => {
            console.error('Google Maps API failed to load.');
            setMapMode('leaflet');
          };
          document.head.appendChild(script);
        } else {
          initMap();
        }
      };

      const initMap = () => {
        if (!googleMapRef.current) return;
        
        try {
          const map = new window.google.maps.Map(googleMapRef.current, {
            center: centerGoogle,
            zoom: 13,
            styles: [
              { elementType: "geometry", stylers: [{ color: "#1a1a24" }] },
              { elementType: "labels.text.stroke", stylers: [{ color: "#1a1a24" }] },
              { elementType: "labels.text.fill", stylers: [{ color: "#75758a" }] },
              {
                featureType: "administrative.locality",
                elementType: "labels.text.fill",
                stylers: [{ color: "#a855f7" }],
              },
              {
                featureType: "poi",
                elementType: "labels.text.fill",
                stylers: [{ color: "#a855f7" }],
              },
              {
                featureType: "road",
                elementType: "geometry",
                stylers: [{ color: "#2d2d3d" }],
              },
              {
                featureType: "road",
                elementType: "geometry.stroke",
                stylers: [{ color: "#1e1e2b" }],
              },
              {
                featureType: "road",
                elementType: "labels.text.fill",
                stylers: [{ color: "#8a8a9e" }],
              },
              {
                featureType: "water",
                elementType: "geometry",
                stylers: [{ color: "#0d0d14" }],
              },
            ],
          });

          biasData.forEach((point) => {
            const color = point.weight > 3 ? '#ff4444' : '#ffaa00';
            
            new window.google.maps.Circle({
              strokeColor: 'transparent',
              strokeOpacity: 0,
              strokeWeight: 0,
              fillColor: color,
              fillOpacity: point.weight * 0.15,
              map: map,
              center: { lat: point.lat, lng: point.lng },
              radius: 500 + (point.weight * 200),
            });

            const marker = new window.google.maps.Marker({
              position: { lat: point.lat, lng: point.lng },
              map: map,
              title: `${point.label} (Bias: ${point.weight}/5)`,
              icon: {
                path: window.google?.maps?.SymbolPath?.CIRCLE || 0,
                scale: 6,
                fillColor: color,
                fillOpacity: 0.9,
                strokeColor: '#ffffff',
                strokeWeight: 1,
              }
            });

            const infoWindow = new window.google.maps.InfoWindow({
              content: `
                <div style="color: #000; font-family: sans-serif; padding: 4px; font-size: 12px;">
                  <strong>${point.label}</strong><br/>
                  Bias Intensity: ${point.weight}/5
                </div>
              `
            });

            marker.addListener("click", () => {
              infoWindow.open({
                anchor: marker,
                map,
              });
            });
          });
        } catch (err) {
          console.error("Error loading Google Maps API map:", err);
          setMapMode('leaflet');
        }
      };

      loadGoogleMap();
      
      return () => {
        isMounted = false;
      };
    }
  }, [mapMode, googleMapsKey, biasData]);

  return (
    <div className="glass-panel" style={{ marginTop: '2rem' }}>
      <div className="flex-between" style={{ marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h3 style={{ color: 'var(--accent-color)' }}>Geospatial Bias Heatmap</h3>
          <p style={{ color: 'var(--text-secondary)' }}>
            {mapMode === 'google' 
              ? 'Visualizing geographic "Redlining" using Google Maps API.' 
              : 'Visualizing geographic "Redlining" using OpenStreetMap.'}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <button 
            className={mapMode === 'google' ? 'btn-primary' : 'btn-secondary'}
            onClick={() => {
              if (!googleMapsKey || googleMapsKey.includes('YOUR_') || googleMapsKey.includes('AlozzCD2fu')) {
                alert("Please configure a valid VITE_GOOGLE_MAPS_API_KEY in your frontend/.env file.");
                return;
              }
              setMapMode('google');
            }}
            style={{ fontSize: '0.75rem', padding: '0.4rem 0.8rem', whiteSpace: 'nowrap' }}
          >
            🗺️ Google Maps
          </button>
          <button 
            className={mapMode === 'leaflet' ? 'btn-primary' : 'btn-secondary'}
            onClick={() => setMapMode('leaflet')}
            style={{ fontSize: '0.75rem', padding: '0.4rem 0.8rem', whiteSpace: 'nowrap' }}
          >
            🍃 OpenStreetMap
          </button>
        </div>
      </div>

      <div style={containerStyle}>
        {mapMode === 'leaflet' ? (
          <MapContainer 
            center={centerCoords} 
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
        ) : (
          <div ref={googleMapRef} style={{ width: '100%', height: '100%', background: '#1a1a24' }}></div>
        )}
      </div>

      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '1rem', fontStyle: 'italic' }}>
        Regions in red indicate significantly lower approval rates for unprivileged groups in specific zip codes.
      </p>
    </div>
  );
}
