'use client';

import React, { useState, useEffect } from 'react';
import { Sun, Camera, Music, Search, Calculator, RefreshCw, Activity } from 'lucide-react';

export default function WidgetsPanel({ onSendPrompt }) {
  const [weather, setWeather] = useState(null);
  const [loadingWeather, setLoadingWeather] = useState(true);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);

  useEffect(() => {
    fetchWeather();
  }, []);

  const fetchWeather = async () => {
    setLoadingWeather(true);
    try {
      const res = await fetch('/api/weather?city=New%20York');
      const data = await res.json();
      setWeather(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingWeather(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* SYSTEM DIAGNOSTICS */}
      <div className="jarvis-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--cyan-bright)', fontWeight: '700' }}>
            <Activity style={{ width: '14px', height: '14px' }} />
            <span>SYSTEM DIAGNOSTICS</span>
          </div>
          <div className="badge-jarvis" style={{ fontSize: '0.65rem' }}>STABLE</div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', fontSize: '0.8rem', fontFamily: 'var(--font-mono)' }}>
          <div style={{ background: 'rgba(3, 7, 18, 0.6)', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-hud)' }}>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>ARC CORE LOAD</div>
            <div style={{ color: 'var(--cyan-bright)', fontWeight: '700', fontSize: '1.1rem', marginTop: '2px' }}>14.2%</div>
          </div>
          <div style={{ background: 'rgba(3, 7, 18, 0.6)', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-hud)' }}>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>REACTION TIME</div>
            <div style={{ color: 'var(--gold-glow)', fontWeight: '700', fontSize: '1.1rem', marginTop: '2px' }}>24ms</div>
          </div>
        </div>
      </div>

      {/* TACTICAL QUICK ACTIONS */}
      <div className="jarvis-card">
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--cyan-bright)', fontWeight: '700', marginBottom: '12px' }}>
          TACTICAL PROTOCOLS
        </div>

        <div className="widget-grid">
          <button onClick={() => onSendPrompt('Capture a screenshot and describe what you see')} className="btn-action">
            <Camera style={{ width: '15px', height: '15px', color: 'var(--cyan-bright)' }} />
            <span>SCREENSHOT</span>
          </button>

          <button onClick={() => setIsPlayingMusic(!isPlayingMusic)} className="btn-action">
            <Music style={{ width: '15px', height: '15px', color: 'var(--gold-glow)' }} />
            <span>{isPlayingMusic ? 'PAUSE' : 'PLAY SYNTH'}</span>
          </button>

          <button onClick={() => onSendPrompt('What is 512 multiplied by 1337?')} className="btn-action">
            <Calculator style={{ width: '15px', height: '15px', color: '#4ade80' }} />
            <span>CALCULATE</span>
          </button>

          <button onClick={() => onSendPrompt('Search for the latest AI news and summarize top 3 headlines')} className="btn-action">
            <Search style={{ width: '15px', height: '15px', color: 'var(--blue-energy)' }} />
            <span>WEB SEARCH</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// Separate named export for the weather widget (rendered on right side)
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
    <div className="jarvis-card">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--cyan-bright)', fontWeight: '700' }}>
          <Sun style={{ width: '14px', height: '14px' }} />
          <span>ATMOSPHERIC RADAR</span>
        </div>
        <button onClick={fetchWeather} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
          <RefreshCw style={{ width: '13px', height: '13px', animation: loading ? 'spin 1s linear infinite' : 'none' }} />
        </button>
      </div>

      {weather ? (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '1.7rem', fontFamily: 'var(--font-title)', fontWeight: '700', color: '#ffffff' }}>{weather.temp}°C</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>{weather.city} • {weather.condition}</div>
          </div>
          <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textAlign: 'right' }}>
            <div>Humidity: <span style={{ color: 'var(--text-bright)' }}>{weather.humidity}%</span></div>
            <div>Wind: <span style={{ color: 'var(--text-bright)' }}>{weather.wind} km/h</span></div>
          </div>
        </div>
      ) : (
        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>Loading radar data...</div>
      )}
    </div>
  );
}
