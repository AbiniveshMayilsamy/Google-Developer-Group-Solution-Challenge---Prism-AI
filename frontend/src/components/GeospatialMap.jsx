import { useEffect, useRef, useState, useMemo } from 'react';

const containerStyle = {
  width: '100%',
  height: '400px',
  borderRadius: '12px',
  overflow: 'hidden',
  border: '1px solid var(--border-color)'
};

const fallbackCenterGoogle = { lat: 11.0168, lng: 76.9558 };

export default function GeospatialMap({ data, config }) {
  const googleMapRef = useRef(null);
  const [mapError, setMapError] = useState('');

  const REGION_COORDS = {
    'North': { lat: 28.6139, lng: 77.2090, label: 'North India (Delhi Hub)' },
    'South': { lat: 12.9716, lng: 77.5946, label: 'South India (Bengaluru Hub)' },
    'East': { lat: 22.5726, lng: 88.3639, label: 'East India (Kolkata Hub)' },
    'West': { lat: 19.0760, lng: 72.8777, label: 'West India (Mumbai Hub)' },
    'Tamil Nadu': { lat: 11.1271, lng: 78.6569, label: 'Tamil Nadu' },
    'Karnataka': { lat: 15.3173, lng: 75.7139, label: 'Karnataka' },
    'Maharashtra': { lat: 19.7515, lng: 75.7139, label: 'Maharashtra' },
    'Delhi': { lat: 28.7041, lng: 77.1025, label: 'Delhi NCR' },
    'West Bengal': { lat: 22.9868, lng: 87.8550, label: 'West Bengal' },
    'Bihar': { lat: 25.0961, lng: 85.3131, label: 'Bihar' },
    'Uttar Pradesh': { lat: 26.8467, lng: 80.9462, label: 'Uttar Pradesh' },
    'Kerala': { lat: 10.8505, lng: 76.2711, label: 'Kerala' },
    'Telangana': { lat: 18.1124, lng: 79.0193, label: 'Telangana' },
    'Gujarat': { lat: 22.2587, lng: 71.1924, label: 'Gujarat' },
    'US-East': { lat: 37.9268, lng: -78.0249, label: 'US East Region' },
    'US-West': { lat: 37.7749, lng: -122.4194, label: 'US West Region' },
    'Midwest': { lat: 41.8781, lng: -87.6298, label: 'US Midwest Region' },
    'South-US': { lat: 32.7767, lng: -96.7970, label: 'US South Region' }
  };

  const biasData = useMemo(() => {
    if (!data || data.length === 0 || !config) {
      return [
        { lat: 11.0168, lng: 76.9558, weight: 3, label: "Central Zone (Coimbatore)", di: 0.72, privRate: 75, unprivRate: 54, privTotal: 100, unprivTotal: 80 },
        { lat: 11.0200, lng: 76.9600, weight: 2, label: "North East District", di: 0.82, privRate: 80, unprivRate: 66, privTotal: 90, unprivTotal: 75 },
        { lat: 11.0100, lng: 76.9500, weight: 5, label: "Critical Bias Zone", di: 0.45, privRate: 90, unprivRate: 40, privTotal: 110, unprivTotal: 95 }, 
        { lat: 11.0300, lng: 76.9700, weight: 1, label: "Outer Rim Industrial Belt", di: 0.95, privRate: 70, unprivRate: 67, privTotal: 85, unprivTotal: 80 },
        { lat: 11.0000, lng: 76.9400, weight: 4, label: "Southern Technology Corridor", di: 0.58, privRate: 85, unprivRate: 49, privTotal: 120, unprivTotal: 100 },
      ];
    }

    const geoColumn = Object.keys(data[0]).find(k => 
      /state|region|city|location|zip|country|geography/i.test(k)
    );

    if (!geoColumn) {
      return [
        { lat: 11.0168, lng: 76.9558, weight: 3, label: "Central Zone (Coimbatore)", di: 0.72, privRate: 75, unprivRate: 54, privTotal: 100, unprivTotal: 80 },
      ];
    }

    const groups = {};
    data.forEach(row => {
      const loc = row[geoColumn]?.toString().trim();
      if (!loc) return;
      if (!groups[loc]) {
        groups[loc] = { privTotal: 0, privFav: 0, unprivTotal: 0, unprivFav: 0 };
      }
      
      const sensitiveVal = row[config.sensitiveAttribute]?.toString().trim();
      const targetVal = row[config.targetAttribute]?.toString().trim();
      const isFavorable = targetVal === config.favorableOutcome;

      if (sensitiveVal === config.privilegedGroup) {
        groups[loc].privTotal++;
        if (isFavorable) groups[loc].privFav++;
      } else if (sensitiveVal === config.unprivilegedGroup) {
        groups[loc].unprivTotal++;
        if (isFavorable) groups[loc].unprivFav++;
      }
    });

    const points = [];
    Object.entries(groups).forEach(([loc, stats]) => {
      const privRate = stats.privTotal > 0 ? stats.privFav / stats.privTotal : 0;
      const unprivRate = stats.unprivTotal > 0 ? stats.unprivFav / stats.unprivTotal : 0;
      const di = privRate > 0 ? unprivRate / privRate : 1.0;
      
      let weight = 1;
      if (di < 0.5) weight = 5;
      else if (di < 0.7) weight = 4;
      else if (di < 0.8) weight = 3;
      else if (di < 0.9) weight = 2;

      let coords = REGION_COORDS[loc];
      if (!coords) {
        const matchingKey = Object.keys(REGION_COORDS).find(k => 
          k.toLowerCase().includes(loc.toLowerCase()) || loc.toLowerCase().includes(k.toLowerCase())
        );
        coords = matchingKey ? REGION_COORDS[matchingKey] : null;
      }

      if (!coords) {
        const hash = loc.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        coords = {
          lat: 11.0168 + ((hash % 100) / 1000 - 0.05),
          lng: 76.9558 + (((hash * 17) % 100) / 1000 - 0.05),
          label: loc
        };
      }

      points.push({
        lat: coords.lat,
        lng: coords.lng,
        weight: weight,
        label: coords.label || loc,
        di: di,
        privRate: (privRate * 100).toFixed(0),
        unprivRate: (unprivRate * 100).toFixed(0),
        privTotal: stats.privTotal,
        unprivTotal: stats.unprivTotal
      });
    });

    return points;
  }, [data, config]);

  const mapCenter = useMemo(() => {
    if (biasData && biasData.length > 0 && data && data.length > 0) {
      const sumLat = biasData.reduce((acc, p) => acc + p.lat, 0);
      const sumLng = biasData.reduce((acc, p) => acc + p.lng, 0);
      return { lat: sumLat / biasData.length, lng: sumLng / biasData.length };
    }
    return fallbackCenterGoogle;
  }, [biasData, data]);

  const mapZoom = useMemo(() => {
    if (data && data.length > 0) {
      return 5;
    }
    return 13;
  }, [data]);

  const googleMapsKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

  useEffect(() => {
    if (!googleMapsKey) {
      setMapError('VITE_GOOGLE_MAPS_API_KEY is missing. Configure it in your frontend/.env file.');
      return;
    }

    let isMounted = true;
    let checkInterval = null;
    
    const loadGoogleMap = () => {
      const isLoaded = window.google && window.google.maps && window.google.maps.Map;
      if (isLoaded) {
        initMap();
        return;
      }

      // Check if script is already present in document
      const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
      if (existingScript) {
        checkInterval = setInterval(() => {
          if (window.google && window.google.maps && window.google.maps.Map) {
            clearInterval(checkInterval);
            if (isMounted) initMap();
          }
        }, 100);
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${googleMapsKey}`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        if (isMounted) initMap();
      };
      script.onerror = () => {
        console.error('Google Maps API failed to load.');
        if (isMounted) setMapError('Google Maps API failed to load.');
      };
      document.head.appendChild(script);
    };

    const initMap = () => {
      if (!googleMapRef.current) return;
      
      try {
        const map = new window.google.maps.Map(googleMapRef.current, {
          center: mapCenter,
          zoom: mapZoom,
          styles: [
            { elementType: "geometry", stylers: [{ color: "#1a1a24" }] },
            { elementType: "labels.text.stroke", stylers: [{ color: "#1a1a24" }] },
            { elementType: "labels.text.fill", stylers: [{ color: "#75758a" }] },
            {
              featureType: "administrative.locality",
              elementType: "labels.text.fill",
              stylers: [{ color: "#9eff00" }],
            },
            {
              featureType: "poi",
              elementType: "labels.text.fill",
              stylers: [{ color: "#9eff00" }],
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
            radius: 3000 + (point.weight * 1000),
          });

          const marker = new window.google.maps.Marker({
            position: { lat: point.lat, lng: point.lng },
            map: map,
            title: `${point.label} (Bias: ${point.weight}/5)`,
            icon: {
              path: window.google?.maps?.SymbolPath?.CIRCLE || 0,
              scale: 7,
              fillColor: color,
              fillOpacity: 0.9,
              strokeColor: '#ffffff',
              strokeWeight: 1.5,
            }
          });

          const biasLevel = point.weight === 1 ? 'Compliant' : point.weight === 2 ? 'Minimal' : point.weight === 3 ? 'Moderate' : point.weight === 4 ? 'High' : 'Critical';
          const biasColor = point.weight > 3 ? '#b91c1c' : '#b45309';

          const infoWindow = new window.google.maps.InfoWindow({
            content: `
              <div style="color: #000; font-family: sans-serif; padding: 6px; font-size: 11px; line-height: 1.4; min-width: 180px;">
                <strong style="font-size: 12px; display: block; margin-bottom: 4px;">${point.label}</strong>
                Disparate Impact: <strong>${Number(point.di).toFixed(3)}</strong><br/>
                Selection Rates:<br/>
                • Privileged: ${point.privRate}% (${point.privTotal} samples)<br/>
                • Unprivileged: ${point.unprivRate}% (${point.unprivTotal} samples)<br/>
                <span style="color: ${biasColor}; font-weight: bold; display: block; margin-top: 4px;">
                  Bias Level: ${biasLevel}
                </span>
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
        setMapError(`Error initializing Google Maps: ${err.message || err.toString()}`);
      }
    };

    loadGoogleMap();
    
    return () => {
      isMounted = false;
      if (checkInterval) clearInterval(checkInterval);
    };
  }, [googleMapsKey, biasData, mapCenter, mapZoom]);

  return (
    <div className="glass-panel" style={{ marginTop: '2rem' }}>
      <div className="flex-between" style={{ marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h3 style={{ color: 'var(--accent-color)' }}>Geospatial Bias Heatmap</h3>
          <p style={{ color: 'var(--text-secondary)' }}>
            Visualizing geographic "Redlining" using Google Maps API.
          </p>
        </div>
      </div>

      <div style={containerStyle}>
        {mapError ? (
          <div style={{ display: 'flex', height: '100%', width: '100%', alignItems: 'center', justifyContent: 'center', color: 'var(--danger)', padding: '2rem', textAlign: 'center', background: 'rgba(248,113,113,0.05)' }}>
            ⚠️ {mapError}
          </div>
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
