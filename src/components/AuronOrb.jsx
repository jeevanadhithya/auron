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
      {/* IRON MAN ARC REACTOR CORE */}
      <div
        className={`arc-reactor ${status === 'listening' ? 'arc-reactor-listening' : ''}`}
        onClick={isListening ? onStopListening : onStartListening}
      >
        <div className="ring-outer" />
        <div className="ring-inner" />

        <div className="core-pulse">
          {status === 'listening' ? (
            <Mic style={{ width: '48px', height: '48px', color: '#ffffff', filter: 'drop-shadow(0 0 14px #00f0ff)' }} />
          ) : status === 'thinking' ? (
            <Cpu style={{ width: '48px', height: '48px', color: '#ffffff' }} />
          ) : status === 'speaking' ? (
            <Volume2 style={{ width: '48px', height: '48px', color: '#ffffff' }} />
          ) : (
            <Zap style={{ width: '48px', height: '48px', color: '#ffffff' }} />
          )}
        </div>
      </div>

      {/* STATUS LABEL BELOW REACTOR */}
      <div style={{
        fontFamily: 'var(--font-title)',
        fontSize: '0.8rem',
        fontWeight: '700',
        letterSpacing: '2px',
        color: status === 'listening' ? 'var(--cyan-bright)' : status === 'speaking' ? '#4ade80' : 'var(--text-muted)',
        textAlign: 'center',
        marginTop: '14px',
        textShadow: status !== 'idle' ? '0 0 10px currentColor' : 'none'
      }}>
        {status === 'listening' ? 'LISTENING...'
          : status === 'thinking' ? 'PROCESSING...'
          : status === 'speaking' ? 'TRANSMITTING...'
          : 'STAND BY'}
      </div>

      {/* FREQUENCY SPECTRUM BARS */}
      <div style={{ display: 'flex', gap: '5px', height: '28px', alignItems: 'center', margin: '14px 0 20px 0' }}>
        {[35, 75, 95, 50, 100, 80, 45, 90, 60, 100, 40].map((h, i) => (
          <div
            key={i}
            style={{
              width: '5px',
              height: status !== 'idle' ? `${h}%` : '8px',
              background: status === 'listening' ? 'var(--cyan-bright)' : status === 'speaking' ? '#4ade80' : 'var(--border-hud)',
              borderRadius: '3px',
              transition: 'all 0.2s ease',
              boxShadow: status !== 'idle' ? '0 0 10px currentColor' : 'none'
            }}
          />
        ))}
      </div>

      {/* START / STOP VOICE BUTTONS */}
      <div className="voice-controls-bar">
        <button
          onClick={onStartListening}
          className="btn-start-voice"
          style={{ opacity: isListening ? 0.55 : 1, boxShadow: isListening ? 'none' : '0 0 25px var(--cyan-glow)' }}
        >
          <Mic style={{ width: '20px', height: '20px' }} />
          <span>START</span>
        </button>

        <button
          onClick={onStopListening}
          className="btn-stop-voice"
          style={{ opacity: !isListening ? 0.55 : 1, boxShadow: isListening ? '0 0 25px var(--crimson-glow)' : 'none' }}
        >
          <MicOff style={{ width: '20px', height: '20px' }} />
          <span>STOP</span>
        </button>
      </div>
    </div>
  );
}
