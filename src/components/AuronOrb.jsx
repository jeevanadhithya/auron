'use client';

import React from 'react';
import { Mic, MicOff, Zap, Volume2, Cpu } from 'lucide-react';

export default function AuronOrb({
  status,
  isListening,
  onStartListening,
  onStopListening
}) {
  return (
    <div className="arc-reactor-container">
      {/* CLAYMORPHIC REACTOR CORE */}
      <div
        className="arc-reactor"
        onClick={isListening ? onStopListening : onStartListening}
      >
        <div className="ring-outer" style={{ borderColor: status === 'listening' ? 'var(--danger-color)' : status === 'speaking' ? 'var(--success-color)' : 'var(--primary-color)' }} />
        <div className="ring-inner" />

        <div className="core-pulse" style={{
          background: status === 'listening' ? 'var(--danger-clay-bg)' : status === 'speaking' ? 'rgba(16, 185, 129, 0.15)' : 'var(--primary-clay-bg)',
          boxShadow: status === 'listening' ? 'var(--danger-clay-shadow)' : status === 'speaking' ? 'inset -4px -4px 8px rgba(163, 177, 198, 0.3), inset 4px 4px 8px rgba(255, 255, 255, 0.7)' : 'var(--primary-clay-shadow)'
        }}>
          {status === 'listening' ? (
            <Mic style={{ width: '42px', height: '42px', color: 'var(--danger-color)' }} />
          ) : status === 'thinking' ? (
            <Cpu style={{ width: '42px', height: '42px', color: 'var(--secondary-color)', animation: 'spin 4s linear infinite' }} />
          ) : status === 'speaking' ? (
            <Volume2 style={{ width: '42px', height: '42px', color: 'var(--success-color)' }} />
          ) : (
            <Zap style={{ width: '42px', height: '42px', color: 'var(--primary-color)' }} />
          )}
        </div>
      </div>

      {/* STATUS LABEL BELOW REACTOR */}
      <div style={{
        fontFamily: 'var(--font-main)',
        fontSize: '0.85rem',
        fontWeight: '700',
        letterSpacing: '1.5px',
        color: status === 'listening' ? 'var(--danger-color)' : status === 'speaking' ? 'var(--success-color)' : 'var(--text-muted)',
        textAlign: 'center',
        marginTop: '18px'
      }}>
        {status === 'listening' ? 'LISTENING...'
          : status === 'thinking' ? 'PROCESSING...'
          : status === 'speaking' ? 'TRANSMITTING...'
          : 'STAND BY'}
      </div>

      {/* FREQUENCY SPECTRUM BARS */}
      <div style={{ display: 'flex', gap: '6px', height: '24px', alignItems: 'center', margin: '16px 0 24px 0' }}>
        {[35, 75, 95, 50, 100, 80, 45, 90, 60, 100, 40].map((h, i) => (
          <div
            key={i}
            style={{
              width: '6px',
              height: status !== 'idle' ? `${h}%` : '6px',
              background: status === 'listening' ? 'var(--danger-color)' : status === 'speaking' ? 'var(--success-color)' : 'var(--text-muted)',
              opacity: status !== 'idle' ? 1 : 0.4,
              borderRadius: '3px',
              transition: 'all 0.25s ease'
            }}
          />
        ))}
      </div>

      {/* START / STOP VOICE BUTTONS */}
      <div className="voice-controls-bar" style={{ display: 'flex', gap: '12px', width: '100%' }}>
        <button
          onClick={onStartListening}
          className="btn-clay btn-clay-primary"
          style={{ flex: 1, padding: '12px 16px', borderRadius: '16px' }}
        >
          <Mic style={{ width: '18px', height: '18px' }} />
          <span>TALK</span>
        </button>

        <button
          onClick={onStopListening}
          className="btn-clay btn-clay-danger"
          style={{ flex: 1, padding: '12px 16px', borderRadius: '16px' }}
        >
          <MicOff style={{ width: '18px', height: '18px' }} />
          <span>MUTE</span>
        </button>
      </div>
    </div>
  );
}
