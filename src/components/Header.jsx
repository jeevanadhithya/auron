'use client';

import React from 'react';
import { ShieldCheck, Settings, Zap, Radio, Sun, Moon } from 'lucide-react';

export default function Header({
  status,
  onOpenSettings,
  theme,
  onToggleTheme
}) {
  return (
    <header className="jarvis-header">
      {/* Brand & Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div className="btn-clay btn-clay-primary" style={{
          width: '46px',
          height: '46px',
          padding: 0,
          borderRadius: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Zap style={{ width: '22px', height: '22px' }} />
        </div>
        <div>
          <div className="brand-title">
            <span>AURON</span>
            <span className="badge-jarvis" style={{ fontSize: '0.65rem', padding: '2px 8px', borderRadius: '8px' }}>v2.0</span>
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 500 }}>
            INTELLIGENT VOICE & CHAT ASSISTANT
          </div>
        </div>
      </div>

      {/* Control Actions & Status */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* System Secure Badge */}
        <span className="badge-jarvis badge-stable" style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
          <ShieldCheck style={{ width: '13px', height: '13px' }} /> SECURE
        </span>

        {/* Live Status Indicator */}
        <div 
          className="btn-clay" 
          style={{
            pointerEvents: 'none',
            fontSize: '0.8rem',
            padding: '8px 16px',
            borderRadius: '14px',
            color: status === 'listening' ? 'var(--danger-color)' : status === 'speaking' ? 'var(--success-color)' : 'var(--text-color)',
            border: status !== 'idle' ? '1px solid currentColor' : '1px solid var(--clay-border)'
          }}
        >
          <Radio style={{ width: '14px', height: '14px', animation: status !== 'idle' ? 'spin 2s linear infinite' : 'none' }} />
          <span style={{ fontWeight: 600 }}>{status.toUpperCase()}</span>
        </div>

        {/* Theme Toggle Button */}
        <button
          onClick={onToggleTheme}
          className="btn-clay"
          aria-label="Toggle Theme"
          style={{ width: '40px', height: '40px', padding: 0, borderRadius: '14px' }}
        >
          {theme === 'light' ? (
            <Moon style={{ width: '18px', height: '18px', color: 'var(--text-color)' }} />
          ) : (
            <Sun style={{ width: '18px', height: '18px', color: 'var(--text-color)' }} />
          )}
        </button>

        {/* Settings Button */}
        <button
          onClick={onOpenSettings}
          className="btn-clay btn-clay-primary"
          style={{ padding: '8px 16px', fontSize: '0.85rem', borderRadius: '14px' }}
        >
          <Settings style={{ width: '16px', height: '16px' }} />
          <span style={{ fontWeight: 600 }}>SETTINGS</span>
        </button>
      </div>
    </header>
  );
}
