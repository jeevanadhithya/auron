'use client';

import React from 'react';
import { Mic, MicOff, Settings2, Cpu, Volume2, Zap, Square } from 'lucide-react';

export default function AuronOrb({
  status,
  isListening,
  onStartListening,
  onStopListening,
  onStopSpeech
}) {
  const statusLabel = {
    idle:      'STAND BY',
    listening: 'LISTENING...',
    thinking:  'PROCESSING...',
    speaking:  'TRANSMITTING...',
  }[status] || 'STAND BY';

  const statusColor = {
    idle:      'var(--text-muted)',
    listening: 'var(--danger-color)',
    thinking:  'var(--accent-amber)',
    speaking:  'var(--accent-emerald)',
  }[status] || 'var(--text-muted)';

  // 5 indicator dots below status text
  const dotIndexes = [0, 1, 2, 3, 4];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
      {/* Top Card Info Row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <span style={{ fontFamily: 'var(--font-hud)', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '1px', color: 'var(--text-muted)' }}>
          AI CORE
        </span>
        <Settings2 style={{ width: '15px', height: '15px', color: 'var(--text-muted)' }} />
      </div>

      {/* Visualizer Orb */}
      <div className="arc-reactor-container" style={{ margin: '20px 0' }}>
        <div className="arc-reactor">
          <div className="ring-outer" style={{ borderColor: status !== 'idle' ? statusColor : 'var(--primary-color)' }} />
          <div className="ring-inner" />
          
          <div className="core-pulse" style={{ background: 'var(--clay-bg)' }}>
            {/* Pure-CSS Futuristic Arc Reactor Graphics */}
            <div style={{
              width: '80px', height: '80px',
              borderRadius: '50%',
              border: `2px double ${status !== 'idle' ? statusColor : 'var(--primary-color)'}`,
              position: 'relative',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: `0 0 15px ${status !== 'idle' ? statusColor : 'var(--primary-color)'}33`
            }}>
              {/* Mechanical segments */}
              {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
                <div key={deg} style={{
                  position: 'absolute',
                  width: '4px', height: '12px',
                  background: status !== 'idle' ? statusColor : 'var(--primary-color)',
                  opacity: 0.7,
                  transform: `rotate(${deg}deg) translateY(-32px)`
                }} />
              ))}
              
              <div style={{
                width: '40px', height: '40px',
                borderRadius: '50%',
                background: status === 'listening' ? 'var(--danger-clay-bg)' : status === 'thinking' ? 'rgba(217, 119, 6, 0.12)' : 'var(--primary-clay-bg)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: 'var(--clay-shadow-inner)'
              }}>
                {status === 'listening' ? (
                  <Mic style={{ width: '20px', height: '20px', color: 'var(--danger-color)' }} />
                ) : status === 'thinking' ? (
                  <Cpu style={{ width: '20px', height: '20px', color: 'var(--accent-amber)', animation: 'spin 4s linear infinite' }} />
                ) : status === 'speaking' ? (
                  <Volume2 style={{ width: '20px', height: '20px', color: 'var(--accent-emerald)' }} />
                ) : (
                  <Zap style={{ width: '20px', height: '20px', color: 'var(--primary-color)' }} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Status Indicators */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
        <div style={{
          fontFamily: 'var(--font-hud)',
          fontSize: '0.8rem',
          fontWeight: 700,
          letterSpacing: '1.5px',
          color: statusColor
        }}>
          {statusLabel}
        </div>
        
        {/* Five status dots */}
        <div style={{ display: 'flex', gap: '6px' }}>
          {dotIndexes.map((i) => (
            <div key={i} className="glow-dot" style={{
              width: '6px', height: '6px',
              borderRadius: '50%',
              background: status !== 'idle' ? statusColor : 'var(--primary-color)',
              opacity: status !== 'idle' ? (i === 2 ? 1 : 0.6) : 0.35,
              animationDelay: `${i * 0.15}s`
            }} />
          ))}
        </div>
      </div>

      {/* Wide Action Buttons */}
      <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
        <button
          onClick={onStartListening}
          disabled={status === 'thinking'}
          className="btn-clay btn-clay-primary"
          style={{ flex: 1, padding: '12px 14px', borderRadius: '16px' }}
        >
          <Mic style={{ width: '16px', height: '16px' }} />
          TALK
        </button>

        {status === 'speaking' ? (
          <button
            onClick={onStopSpeech}
            className="btn-clay btn-clay-stop"
            style={{ flex: 1, padding: '12px 14px', borderRadius: '16px' }}
          >
            <Square style={{ width: '16px', height: '16px' }} />
            STOP
          </button>
        ) : (
          <button
            onClick={onStopListening}
            className="btn-clay btn-clay-danger"
            style={{ flex: 1, padding: '12px 14px', borderRadius: '16px' }}
          >
            <MicOff style={{ width: '16px', height: '16px' }} />
            MUTE
          </button>
        )}
      </div>
    </div>
  );
}
