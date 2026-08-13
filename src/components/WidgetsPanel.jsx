'use client';

import React, { useState, useEffect } from 'react';
import {
  Sun, Calculator, RefreshCw, Activity, Cpu, Zap,
  Monitor, Folder, Terminal, FileText, Settings, Globe, Mail
} from 'lucide-react';

// Client-side URI scheme mapping (works on Vercel)
const QUICK_APPS = [
  { label: 'CALC',  app: 'calculator',    icon: Calculator, uri: 'calculator://' },
  { label: 'TERM',  app: 'powershell',    icon: Terminal,   uri: null },
  { label: 'FILES', app: 'file explorer', icon: Folder,     uri: null },
  { label: 'SYS',   app: 'settings',      icon: Settings,   uri: 'ms-settings:' },
  { label: 'WEB',   app: 'chrome',        icon: Globe,      uri: null },
  { label: 'MAIL',  app: 'mail',          icon: Mail,       uri: 'outlookmail:' },
];

async function launchApp(app, uri) {
  if (uri) {
    try {
      window.location.href = uri;
      return { success: true };
    } catch (e) { /* fall through */ }
  }
  try {
    const res = await fetch('/api/launch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ app })
    });
    return await res.json();
  } catch (e) {
    return { success: false, message: 'Launcher requires local server.' };
  }
}

// ─── Column 1: Environment Monitor ──────────────────────────────────────────
export function WeatherWidget() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchWeather(); }, []);

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
    <div className="clay-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sun style={{ width: '15px', height: '15px', color: 'var(--accent-amber)' }} />
            <span style={{ fontFamily: 'var(--font-hud)', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '1.5px', color: 'var(--accent-amber)' }}>
              ENVIRONMENT MONITOR
            </span>
          </div>
          <button onClick={fetchWeather} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>
            <RefreshCw style={{ width: '13px', height: '13px', color: 'var(--text-muted)', animation: loading ? 'spin 1.5s linear infinite' : 'none' }} />
          </button>
        </div>

        {weather ? (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, fontFamily: 'var(--font-hud)', color: 'var(--text-color)', lineHeight: 1 }}>
                {weather.temp}°C
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textAlign: 'right', fontFamily: 'var(--font-hud)', lineHeight: 1.6 }}>
                <div>Humidity <span style={{ color: 'var(--primary-color)', fontWeight: 700 }}>{weather.humidity}%</span></div>
                <div>Wind <span style={{ color: 'var(--accent-amber)', fontWeight: 700 }}>{weather.wind} km/h</span></div>
              </div>
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '8px', fontFamily: 'var(--font-hud)' }}>
              {weather.city} • {weather.condition}
            </div>
          </div>
        ) : (
          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontFamily: 'var(--font-hud)' }}>
            Syncing environment stream...
          </div>
        )}
      </div>

      <div className="progress-bar-track">
        <div className="progress-bar-fill" style={{ width: '65%' }} />
      </div>
    </div>
  );
}

// ─── Column 2: System Monitor ───────────────────────────────────────────────
export function SystemMonitorWidget() {
  const [cpuLoad, setCpuLoad] = useState(14.2);
  const [latency, setLatency] = useState(24);

  useEffect(() => {
    const interval = setInterval(() => {
      setCpuLoad(prev => Math.max(4, Math.min(38, prev + (Math.random() - 0.5) * 4)));
      setLatency(prev => Math.max(10, Math.min(65, prev + (Math.random() - 0.5) * 6)));
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="clay-card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Activity style={{ width: '15px', height: '15px', color: 'var(--accent-emerald)' }} />
          <span style={{ fontFamily: 'var(--font-hud)', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '1.5px', color: 'var(--accent-emerald)' }}>
            SYSTEM MONITOR
          </span>
        </div>
        <span className="badge-jarvis badge-stable" style={{ fontSize: '0.62rem' }}>STABLE</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', flex: 1 }}>
        <div className="stat-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.68rem', fontFamily: 'var(--font-hud)', fontWeight: 700, letterSpacing: '0.5px', marginBottom: '4px' }}>
            CORE LOAD
          </span>
          <span style={{ fontSize: '1.3rem', fontWeight: 800, fontFamily: 'var(--font-hud)', color: 'var(--primary-color)' }}>
            {cpuLoad.toFixed(1)}%
          </span>
        </div>

        <div className="stat-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.68rem', fontFamily: 'var(--font-hud)', fontWeight: 700, letterSpacing: '0.5px', marginBottom: '4px' }}>
            LATENCY
          </span>
          <span style={{ fontSize: '1.3rem', fontWeight: 800, fontFamily: 'var(--font-hud)', color: 'var(--accent-amber)' }}>
            {Math.round(latency)}ms
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Column 3: Quick Launch ─────────────────────────────────────────────────
export function QuickLaunchWidget({ onSendPrompt }) {
  const [launchingApp, setLaunchingApp] = useState(null);

  const handleLaunch = async (app, uri) => {
    setLaunchingApp(app);
    const res = await launchApp(app, uri);
    if (res.success) {
      onSendPrompt(`System opened ${app}. Acknowledge with a 1-sentence confirm.`);
    }
    setTimeout(() => setLaunchingApp(null), 2000);
  };

  return (
    <div className="clay-card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
        <Monitor style={{ width: '15px', height: '15px', color: 'var(--secondary-color)' }} />
        <span style={{ fontFamily: 'var(--font-hud)', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '1.5px', color: 'var(--secondary-color)' }}>
          QUICK LAUNCH
        </span>
      </div>

      <div className="quick-launch-grid" style={{ flex: 1 }}>
        {QUICK_APPS.map(({ label, app, icon: Icon, uri }) => (
          <button
            key={app}
            onClick={() => handleLaunch(app, uri)}
            className="quick-launch-item"
            title={`Launch ${app}`}
            style={{
              border: launchingApp === app ? '1px solid var(--primary-color)' : '1px solid var(--clay-border)',
              background: launchingApp === app ? 'var(--primary-clay-bg)' : 'var(--clay-bg)',
            }}
          >
            <Icon style={{ width: '18px', height: '18px', color: launchingApp === app ? 'var(--primary-color)' : 'inherit' }} />
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Combined Wrapper ───────────────────────────────────────────────────────
export default function WidgetsPanel({ onSendPrompt }) {
  return (
    <div className="bottom-widgets-grid">
      <WeatherWidget />
      <SystemMonitorWidget />
      <QuickLaunchWidget onSendPrompt={onSendPrompt} />
    </div>
  );
}
