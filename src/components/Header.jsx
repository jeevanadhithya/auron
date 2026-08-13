'use client';

import React from 'react';
import { ShieldCheck, Settings, Zap, Radio } from 'lucide-react';

export default function Header({
  status,
  onOpenSettings
}) {
  return (
    <header className="jarvis-header">
      {/* Brand & Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div style={{
          width: '44px',
          height: '44px',
          borderRadius: '10px',
          background: 'radial-gradient(circle, rgba(0, 240, 255, 0.25) 0%, rgba(3, 7, 18, 0.8) 100%)',
          border: '1px solid var(--cyan-bright)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 20px var(--cyan-glow)'
        }}>
          <Zap style={{ width: '24px', height: '24px', color: 'var(--cyan-bright)' }} />
        </div>
        <div>
          <div className="brand-title">
            <span>JARVIS</span>
            <span style={{ fontSize: '0.7rem', padding: '2px 8px', background: 'rgba(0,240,255,0.2)', border: '1px solid var(--cyan-bright)', borderRadius: '4px', fontFamily: 'var(--font-mono)' }}>MARK VII</span>
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            IRON MAN ADVANCED TACTICAL VOICE ASSISTANT
          </div>
        </div>
      </div>

      {/* System Status Badges - No model or API key mentions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span className="badge-jarvis">
          <ShieldCheck style={{ width: '12px', height: '12px', marginRight: '4px' }} /> SYSTEM SECURE
        </span>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 14px',
          borderRadius: '20px',
          background: 'rgba(3, 7, 18, 0.8)',
          border: '1px solid var(--border-hud)',
          fontSize: '0.8rem',
          fontFamily: 'var(--font-mono)',
          color: status === 'listening' ? 'var(--cyan-bright)' : status === 'speaking' ? '#4ade80' : 'var(--text-bright)'
        }}>
          <Radio style={{ width: '14px', height: '14px' }} />
          <span>STATUS: {status.toUpperCase()}</span>
        </div>

        <button
          onClick={onOpenSettings}
          className="btn-action"
          style={{ padding: '8px 16px', fontSize: '0.85rem', fontWeight: '700' }}
        >
          <Settings style={{ width: '16px', height: '16px' }} />
          <span>SETTINGS</span>
        </button>
      </div>
    </header>
  );
}
