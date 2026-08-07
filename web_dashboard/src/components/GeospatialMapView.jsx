// File: web_dashboard/src/components/GeospatialMapView.jsx
import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';

const GeospatialMapView = ({ issues = [], onSelectIssue }) => {
    const mapContainerRef = useRef(null);
    const leafletMapRef = useRef(null);
    const markersLayerRef = useRef(null);

    const [selectedCategory, setSelectedCategory] = useState('ALL');
    const [severityFilter, setSeverityFilter] = useState('ALL');
    const [selectedWard, setSelectedWard] = useState('ALL');
    const [tileMode, setTileMode] = useState('dark'); // 'dark' or 'street'
    const [activeMarker, setActiveMarker] = useState(null);
    const [mapSearch, setMapSearch] = useState('');

    const categories = ['ALL', 'Pothole Repair', 'Garbage & Sanitation', 'Water & Sewage', 'Electrical & Lighting', 'Public Safety'];

    // Filter issues based on UI selections
    const filteredIssues = issues.filter((issue) => {
        const matchesCategory = selectedCategory === 'ALL' || issue.category === selectedCategory;
        const score = issue.severityScore || issue.dispatchData?.severityScore || 50;
        let matchesSeverity = true;
        if (severityFilter === 'EMERGENCY') matchesSeverity = score >= 75;
        if (severityFilter === 'HIGH') matchesSeverity = score >= 50 && score < 75;
        if (severityFilter === 'NORMAL') matchesSeverity = score < 50;

        let matchesWard = true;
        const issueWardNum = (issue.id % 4) + 1;
        if (selectedWard !== 'ALL' && `Ward ${issueWardNum}` !== selectedWard) {
            matchesWard = false;
        }

        const matchesSearch = !mapSearch ||
            (issue.address && issue.address.toLowerCase().includes(mapSearch.toLowerCase())) ||
            (issue.category && issue.category.toLowerCase().includes(mapSearch.toLowerCase())) ||
            (issue.description && issue.description.toLowerCase().includes(mapSearch.toLowerCase()));

        return matchesCategory && matchesSeverity && matchesWard && matchesSearch;
    });

    // Initialize Real Leaflet Map with CartoDB High-Reliability CDN Tiles
    useEffect(() => {
        if (!mapContainerRef.current) return;

        // Clean up previous map instance if any
        if (leafletMapRef.current) {
            leafletMapRef.current.remove();
        }

        // Center on default Ranchi coordinates
        const map = L.map(mapContainerRef.current, {
            center: [23.3441, 85.3096],
            zoom: 13,
            zoomControl: false,
            fadeAnimation: true,
            zoomAnimation: true
        });

        L.control.zoom({ position: 'bottomright' }).addTo(map);

        // Reliable CartoDB CDN Tile Layers (No rate limiting or black block dropouts)
        const darkTileUrl = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
        const voyagerTileUrl = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';

        const activeTileUrl = tileMode === 'dark' ? darkTileUrl : voyagerTileUrl;

        L.tileLayer(activeTileUrl, {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
            maxZoom: 19,
            subdomains: 'abcd'
        }).addTo(map);

        const markersGroup = L.layerGroup().addTo(map);
        markersLayerRef.current = markersGroup;
        leafletMapRef.current = map;

        // Invalidate size immediately and on intervals to ensure clean tile loading
        const t1 = setTimeout(() => map.invalidateSize(), 100);
        const t2 = setTimeout(() => map.invalidateSize(), 500);

        const handleResize = () => map.invalidateSize();
        window.addEventListener('resize', handleResize);

        return () => {
            clearTimeout(t1);
            clearTimeout(t2);
            window.removeEventListener('resize', handleResize);
            map.remove();
            leafletMapRef.current = null;
        };
    }, [tileMode]);

    // Render Markers on Map when filteredIssues change
    useEffect(() => {
        if (!leafletMapRef.current || !markersLayerRef.current) return;

        markersLayerRef.current.clearLayers();
        const bounds = [];

        filteredIssues.forEach((issue) => {
            const lat = (issue.latitude && issue.latitude !== 0) ? issue.latitude : 23.3441;
            const lng = (issue.longitude && issue.longitude !== 0) ? issue.longitude : 85.3096;

            bounds.push([lat, lng]);

            const score = issue.severityScore || issue.dispatchData?.severityScore || 50;
            const isEmergency = score >= 75;
            const isHigh = score >= 50 && score < 75;
            const pinColor = isEmergency ? '#ef4444' : (isHigh ? '#f59e0b' : '#3b82f6');

            // Custom Leaflet DivIcon with neon glow
            const customIcon = L.divIcon({
                className: 'custom-leaflet-pin',
                html: `
                    <div style="
                        padding: 6px 12px;
                        border-radius: 20px;
                        background: rgba(9, 13, 22, 0.95);
                        color: #ffffff;
                        border: 2px solid ${pinColor};
                        box-shadow: ${isEmergency ? `0 0 20px ${pinColor}` : `0 0 10px ${pinColor}80`};
                        display: flex;
                        align-items: center;
                        gap: 6px;
                        font-size: 11px;
                        font-weight: 800;
                        white-space: nowrap;
                        cursor: pointer;
                    ">
                        ${isEmergency ? '<span style="width:7px;height:7px;border-radius:50%;background:#ef4444;box-shadow:0 0 8px #ef4444;"></span>' : ''}
                        <span>#${issue.id} ${issue.category.split(' ')[0]}</span>
                        <span style="background:${pinColor}40;padding:2px 6px;border-radius:10px;font-size:10px;color:#fff;">${score}</span>
                    </div>
                `,
                iconSize: [130, 36],
                iconAnchor: [65, 18]
            });

            const marker = L.marker([lat, lng], { icon: customIcon }).addTo(markersLayerRef.current);

            // Popup HTML
            const popupHtml = `
                <div style="padding: 4px; font-family: 'Plus Jakarta Sans', sans-serif;">
                    <div style="font-weight:800; font-size:13px; color:#ffffff; margin-bottom:4px;">
                        ${issue.category}
                    </div>
                    <div style="font-size:11px; color:#60a5fa; margin-bottom:6px;">
                        ${issue.address || 'Location Address'}
                    </div>
                    <div style="font-size:11px; color:#94a3b8;">
                        Severity Priority Score: <b style="color:${pinColor};">${score}/100</b>
                    </div>
                </div>
            `;

            marker.bindPopup(popupHtml);
            marker.on('click', () => {
                setActiveMarker(issue);
            });
        });

        // Fit map bounds or center on first issue
        if (bounds.length > 0 && leafletMapRef.current) {
            if (bounds.length === 1) {
                leafletMapRef.current.setView(bounds[0], 14);
            } else {
                leafletMapRef.current.fitBounds(bounds, { padding: [60, 60], maxZoom: 15 });
            }
        }
    }, [filteredIssues]);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Organic Header Telemetry Bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', padding: '16px 20px', borderRadius: '16px', background: 'rgba(15, 23, 42, 0.4)', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                <div>
                    <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        GEOSPATIAL TELEMETRY RADAR & WARD GRID
                    </h3>
                    <p style={{ color: '#94a3b8', fontSize: '13px', marginTop: '2px' }}>
                        Real CartoDB geographic map tiles with zoom, pan, and live incident markers for {filteredIssues.length} active reports.
                    </p>
                </div>

                {/* Ward Filter Pills */}
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {['ALL', 'Ward 1', 'Ward 2', 'Ward 3', 'Ward 4'].map(w => (
                        <button
                            key={w}
                            onClick={() => setSelectedWard(w)}
                            className="glass-pill"
                            style={{
                                cursor: 'pointer',
                                padding: '6px 14px',
                                background: selectedWard === w ? '#3b82f6' : 'rgba(255,255,255,0.04)',
                                color: selectedWard === w ? '#ffffff' : '#94a3b8',
                                borderColor: selectedWard === w ? '#3b82f6' : 'rgba(255,255,255,0.1)',
                                fontSize: '12px'
                            }}
                        >
                            {w === 'ALL' ? 'All Wards' : w}
                        </button>
                    ))}
                </div>
            </div>

            {/* Map Canvas with Floating HUD Controls */}
            <div style={{ position: 'relative', height: '620px', borderRadius: '24px', overflow: 'hidden', border: '1px solid rgba(255, 255, 255, 0.1)', boxShadow: '0 25px 60px rgba(0, 0, 0, 0.7)' }}>
                {/* Floating Top Control HUD */}
                <div style={{ position: 'absolute', top: '16px', left: '16px', right: '16px', zIndex: 1000, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', pointerEvents: 'none' }}>
                    <div className="hud-pill-bar" style={{ display: 'flex', gap: '10px', alignItems: 'center', pointerEvents: 'auto' }}>
                        <select
                            className="form-input"
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            style={{ maxWidth: '160px', padding: '6px 10px', fontSize: '12px', cursor: 'pointer' }}
                        >
                            {categories.map(cat => <option key={cat} value={cat}>{cat === 'ALL' ? 'Category' : cat}</option>)}
                        </select>

                        <select
                            className="form-input"
                            value={severityFilter}
                            onChange={(e) => setSeverityFilter(e.target.value)}
                            style={{ maxWidth: '150px', padding: '6px 10px', fontSize: '12px', cursor: 'pointer' }}
                        >
                            <option value="ALL">Severity</option>
                            <option value="EMERGENCY">Urgent (≥75)</option>
                            <option value="HIGH">High (50-74)</option>
                            <option value="NORMAL">Normal (&lt;50)</option>
                        </select>

                        <input
                            type="text"
                            className="form-input"
                            placeholder="Search map street..."
                            value={mapSearch}
                            onChange={(e) => setMapSearch(e.target.value)}
                            style={{ width: '180px', padding: '6px 10px', fontSize: '12px' }}
                        />
                    </div>

                    <div className="hud-pill-bar" style={{ display: 'flex', gap: '8px', alignItems: 'center', pointerEvents: 'auto' }}>
                        <button
                            onClick={() => setTileMode(tileMode === 'dark' ? 'street' : 'dark')}
                            style={{ background: 'transparent', border: 'none', color: '#60a5fa', fontWeight: '700', fontSize: '12px', cursor: 'pointer' }}
                        >
                            {tileMode === 'dark' ? 'Switch to Street Map' : 'Switch to Dark Radar'}
                        </button>
                    </div>
                </div>

                {/* Real Leaflet Map Container */}
                <div id="leaflet-container-id" ref={mapContainerRef} style={{ width: '100%', height: '100%', zIndex: 1 }} />

                {/* Sliding Glass Incident Drawer */}
                {activeMarker && (
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        bottom: 0,
                        width: '360px',
                        zIndex: 1001,
                        background: 'rgba(9, 13, 22, 0.94)',
                        backdropFilter: 'blur(20px)',
                        borderLeft: '1px solid rgba(255, 255, 255, 0.1)',
                        padding: '24px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '16px',
                        boxShadow: '-10px 0 40px rgba(0,0,0,0.8)'
                    }}>
                        <button
                            onClick={() => setActiveMarker(null)}
                            style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', width: '28px', height: '28px', borderRadius: '50%', cursor: 'pointer' }}
                        >
                            ✕
                        </button>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span className="glass-pill glass-pill-blue">Incident #{activeMarker.id}</span>
                            <span className={`glass-pill ${(activeMarker.severityScore || 50) >= 75 ? 'glass-pill-ruby' : 'glass-pill-amber'}`}>
                                Score: {activeMarker.severityScore || 50}/100
                            </span>
                        </div>

                        <h4 style={{ fontSize: '16px', fontWeight: '800', color: '#ffffff' }}>
                            {activeMarker.category}
                        </h4>

                        {/* Evidence Photo */}
                        {activeMarker.photoPath ? (
                            <img
                                src={`http://localhost:8080/api/images/${activeMarker.photoPath}`}
                                alt="Telemetry"
                                style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}
                            />
                        ) : (
                            <div style={{ padding: '30px', textAlign: 'center', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', color: '#94a3b8', fontSize: '12px' }}>
                                No Photo Evidence Attached
                            </div>
                        )}

                        <div>
                            <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '700', textTransform: 'uppercase' }}>Reverse Geocoded Location</span>
                            <p style={{ fontSize: '13px', color: '#f8fafc', fontWeight: '700', marginTop: '2px' }}>
                                {activeMarker.address || 'Ranchi Main Road'}
                            </p>
                        </div>

                        <div>
                            <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '700', textTransform: 'uppercase' }}>Issue Description</span>
                            <p style={{ fontSize: '12px', color: '#cbd5e1', marginTop: '2px', lineHeight: '1.4' }}>
                                {activeMarker.description || 'No description entered.'}
                            </p>
                        </div>

                        <div style={{ display: 'flex', gap: '10px', marginTop: 'auto' }}>
                            <button
                                onClick={() => onSelectIssue(activeMarker)}
                                className="btn-primary"
                                style={{ flex: 1, fontSize: '12px', padding: '10px' }}
                            >
                                Inspect & Dispatch
                            </button>
                            <a
                                href={`https://www.google.com/maps/search/?api=1&query=${activeMarker.latitude || 0},${activeMarker.longitude || 0}`}
                                target="_blank"
                                rel="noreferrer"
                                className="btn-primary btn-secondary"
                                style={{ padding: '10px 14px', textDecoration: 'none', fontSize: '12px' }}
                            >
                                Maps
                            </a>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GeospatialMapView;
