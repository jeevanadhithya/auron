'use client';

import React, { useState, useEffect } from 'react';
import { Sun, Camera, Music, Search, Calculator, RefreshCw, Activity } from 'lucide-react';

export default function WidgetsPanel({ onSendPrompt }) {
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
      {/* COGNITIVE SYSTEM DIAGNOSTICS */}
      <div className="clay-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--primary-color)', fontWeight: '700' }}>
            <Activity style={{ width: '15px', height: '15px' }} />
            <span>SYSTEM MONITOR</span>
          </div>
          <div className="badge-jarvis badge-stable" style={{ fontSize: '0.65rem', fontWeight: 700 }}>STABLE</div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', fontSize: '0.85rem' }}>
          <div style={{ background: 'rgba(0,0,0,0.05)', padding: '12px 14px', borderRadius: '16px', boxShadow: 'var(--clay-shadow-inner)', border: '1px solid var(--clay-border)' }}>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.72rem', fontWeight: 600 }}>CORE LOAD</div>
            <div style={{ color: 'var(--primary-color)', fontWeight: '800', fontSize: '1.2rem', marginTop: '4px' }}>14.2%</div>
          </div>
          <div style={{ background: 'rgba(0,0,0,0.05)', padding: '12px 14px', borderRadius: '16px', boxShadow: 'var(--clay-shadow-inner)', border: '1px solid var(--clay-border)' }}>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.72rem', fontWeight: 600 }}>LATENCY</div>
            <div style={{ color: 'var(--secondary-color)', fontWeight: '800', fontSize: '1.2rem', marginTop: '4px' }}>24ms</div>
          </div>
        </div>
      </div>

      {/* QUICK ACTIONS PANEL */}
      <div className="clay-card">
        <div style={{ fontSize: '0.85rem', color: 'var(--primary-color)', fontWeight: '700', marginBottom: '14px' }}>
          COGNITIVE TOOLS
        </div>

        <div className="widget-grid">
          <button onClick={() => onSendPrompt('Capture a screenshot and describe what you see')} className="btn-clay btn-clay-primary" style={{ padding: '10px 14px', fontSize: '0.8rem', borderRadius: '16px' }}>
            <Camera style={{ width: '15px', height: '15px' }} />
            <span>SCREENSHOT</span>
          </button>

          <button onClick={() => setIsPlayingMusic(!isPlayingMusic)} className="btn-clay" style={{ padding: '10px 14px', fontSize: '0.8rem', borderRadius: '16px' }}>
            <Music style={{ width: '15px', height: '15px', color: 'var(--secondary-color)' }} />
            <span>{isPlayingMusic ? 'PAUSE' : 'SYNTHESIZER'}</span>
          </button>

          <button onClick={() => onSendPrompt('What is 512 multiplied by 1337?')} className="btn-clay" style={{ padding: '10px 14px', fontSize: '0.8rem', borderRadius: '16px' }}>
            <Calculator style={{ width: '15px', height: '15px', color: 'var(--success-color)' }} />
            <span>CALCULATE</span>
          </button>

          <button onClick={() => onSendPrompt('Search for the latest AI news and summarize top 3 headlines')} className="btn-clay" style={{ padding: '10px 14px', fontSize: '0.8rem', borderRadius: '16px' }}>
            <Search style={{ width: '15px', height: '15px', color: 'var(--primary-color)' }} />
            <span>WEB SEARCH</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// Named export for the weather widget
export function WeatherWidget() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWeather();
  }, []);

  const fetchWeather = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/weather?city=New%20York');
      const data = await res.json();
      setWeather(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="clay-card">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--primary-color)', fontWeight: '700' }}>
          <Sun style={{ width: '16px', height: '16px' }} />
          <span>ENVIRONMENT MONITOR</span>
        </div>
        <button onClick={fetchWeather} className="btn-clay" style={{ width: '28px', height: '28px', padding: 0, borderRadius: '8px', boxShadow: 'none', background: 'none', border: 'none' }}>
          <RefreshCw style={{ width: '13px', height: '13px', color: 'var(--text-muted)', animation: loading ? 'spin 1.5s linear infinite' : 'none' }} />
        </button>
      </div>

      {weather ? (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--text-color)' }}>{weather.temp}°C</div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '4px', fontWeight: 500 }}>{weather.city} • {weather.condition}</div>
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textAlign: 'right', fontWeight: 500, lineHeight: 1.5 }}>
            <div>Humidity: <span style={{ color: 'var(--text-color)', fontWeight: 600 }}>{weather.humidity}%</span></div>
            <div>Wind: <span style={{ color: 'var(--text-color)', fontWeight: 600 }}>{weather.wind} km/h</span></div>
          </div>
        </div>
      ) : (
        <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Retrieving microclimate stream...</div>
      )}
    </div>
  );
}
