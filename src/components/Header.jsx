'use client';

import React from 'react';
import { ShieldCheck, Settings, Zap, Radio, Sun, Moon } from 'lucide-react';

export default function Header({
  status,
  onOpenSettings,
  theme,
  onToggleTheme
}) {
  const statusColors = {
    idle:      { color: 'var(--text-muted)',      label: 'IDLE' },
    listening: { color: 'var(--danger-color)',    label: 'LISTENING' },
    thinking:  { color: 'var(--accent-amber)',    label: 'THINKING' },
    speaking:  { color: 'var(--accent-emerald)',  label: 'SPEAKING' },
  };
  const sc = statusColors[status] || statusColors.idle;

  return (
    <header className="jarvis-header">
      {/* Brand & Subtitle */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <Zap style={{ width: '22px', height: '22px', color: 'var(--primary-color)', filter: 'drop-shadow(0 0 4px var(--primary-glow))' }} />
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontFamily: 'var(--font-main)', fontWeight: 900, fontSize: '1.25rem', tracking: '-0.5px' }}>AURON</span>
            <span className="badge-jarvis" style={{ fontSize: '0.6rem', padding: '1px 5px', borderRadius: '4px' }}>v2.0</span>
          </div>
          <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '1px', fontFamily: 'var(--font-hud)', marginTop: '1px' }}>
            INTELLIGENT VOICE &amp; CHAT ASSISTANT
          </div>
        </div>
      </div>

      {/* Control Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {/* Secure pill */}
        <span className="badge-jarvis badge-stable" style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 12px', borderRadius: '12px' }}>
          <ShieldCheck style={{ width: '12px', height: '12px' }} />
          SECURE
        </span>

        {/* Live Status pill */}
        <div className="btn-clay" style={{
          pointerEvents: 'none',
          fontSize: '0.78rem',
          padding: '6px 14px',
          borderRadius: '12px',
          color: sc.color,
          fontFamily: 'var(--font-hud)',
          fontWeight: 700,
          letterSpacing: '0.5px',
          border: '1px solid var(--clay-border)',
          display: 'flex', alignItems: 'center', gap: '6px'
        }}>
          <span className="glow-dot" style={{ background: sc.color, boxShadow: `0 0 6px ${sc.color}` }} />
          {sc.label}
        </div>

        {/* Theme button */}
        <button
          onClick={onToggleTheme}
          className="btn-clay"
          aria-label="Toggle Theme"
          style={{ width: '36px', height: '36px', padding: 0, borderRadius: '12px' }}
        >
          {theme === 'dark'
            ? <Sun style={{ width: '15px', height: '15px', color: 'var(--accent-amber)' }} />
            : <Moon style={{ width: '15px', height: '15px', color: 'var(--secondary-color)' }} />
          }
        </button>

        {/* Settings button */}
        <button
          onClick={onOpenSettings}
          className="btn-clay"
          style={{ padding: '8px 14px', fontSize: '0.8rem', borderRadius: '12px' }}
        >
          <Settings style={{ width: '14px', height: '14px' }} />
          SETTINGS
        </button>
      </div>
    </header>
  );
}
