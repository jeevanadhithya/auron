'use client';

import React, { useState, useEffect } from 'react';
import { X, Key, CheckCircle, Volume2, RefreshCw, Eye, EyeOff } from 'lucide-react';

export default function SettingsModal({
  isOpen,
  onClose,
  apiKey,
  onSaveApiKey,
  voiceSettings,
  onUpdateVoiceSettings,
  persona,
  onChangePersona
}) {
  const [keyInput, setKeyInput] = useState(apiKey || '');
  const [showKey, setShowKey] = useState(false);
  const [testStatus, setTestStatus] = useState(null);
  const [testMsg, setTestMsg] = useState('');
  const [availableVoices, setAvailableVoices] = useState([]);

  useEffect(() => {
    setKeyInput(apiKey || '');
  }, [apiKey]);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const loadVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        setAvailableVoices(voices);
      };
      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  if (!isOpen) return null;

  const handleSaveKey = () => {
    onSaveApiKey(keyInput.trim());
    setTestStatus('success');
    setTestMsg('System credential updated successfully!');
    setTimeout(() => setTestStatus(null), 3000);
  };

  const handleTestKey = async () => {
    if (!keyInput.trim()) {
      setTestStatus('error');
      setTestMsg('Please enter your security credential to verify.');
      return;
    }

    setTestStatus('testing');
    setTestMsg('Testing credential authentication...');

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: 'Hello, reply with "Authentication successful".',
          customApiKey: keyInput.trim()
        })
      });

      const data = await res.json();
      if (res.ok && data.reply) {
        setTestStatus('success');
        setTestMsg('✅ Connection successful! Authentication verified.');
      } else {
        setTestStatus('error');
        setTestMsg(`❌ Authentication Failed: ${data.error || data.reply || 'Invalid credential.'}`);
      }
    } catch (err) {
      setTestStatus('error');
      setTestMsg(`❌ Error: ${err.message}`);
    }
  };

  const handleClearKey = () => {
    setKeyInput('');
    onSaveApiKey('');
    setTestStatus('success');
    setTestMsg('Credential cleared.');
    setTimeout(() => setTestStatus(null), 3000);
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 100,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      background: 'rgba(0, 0, 0, 0.4)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)'
    }}>
      <div className="clay-card" style={{
        width: '100%',
        maxWidth: '560px',
        maxHeight: '90vh',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
      }}>
        
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifySelf: 'stretch', justifyContent: 'space-between', paddingBottom: '16px', borderBottom: '1px solid var(--clay-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className="btn-clay btn-clay-primary" style={{ padding: '8px', borderRadius: '12px' }}>
              <Key style={{ width: '18px', height: '18px' }} />
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-main)', fontSize: '1.15rem', fontWeight: '800', color: 'var(--text-color)' }}>SYSTEM CONFIGURATION</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Configure cognitive settings & speech synthesizer</div>
            </div>
          </div>
          <button onClick={onClose} className="btn-clay" style={{ width: '32px', height: '32px', padding: 0, borderRadius: '50%' }}>
            <X style={{ width: '16px', height: '16px' }} />
          </button>
        </div>

        {/* Section 1: Security Credential */}
        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: 'var(--primary-color)', marginBottom: '6px' }}>
            SECURITY ACCESS CREDENTIAL
          </label>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
            Enter your custom Gemini API key to personalize system intelligence responses.
          </p>

          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
            <input
              type={showKey ? 'text' : 'password'}
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              placeholder="Enter Gemini API key..."
              className="clay-input-field"
              style={{ width: '100%', paddingRight: '46px' }}
            />
            <button
              type="button"
              onClick={() => setShowKey(!showKey)}
              style={{ position: 'absolute', right: '14px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
            >
              {showKey ? <EyeOff style={{ width: '18px', height: '18px' }} /> : <Eye style={{ width: '18px', height: '18px' }} />}
            </button>
          </div>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button onClick={handleSaveKey} className="btn-clay btn-clay-primary" style={{ padding: '10px 16px', fontSize: '0.82rem', borderRadius: '12px' }}>
              <CheckCircle style={{ width: '15px', height: '15px' }} /> SAVE
            </button>

            <button onClick={handleTestKey} className="btn-clay" style={{ padding: '10px 16px', fontSize: '0.82rem', borderRadius: '12px' }}>
              <RefreshCw style={{ width: '15px', height: '15px', animation: testStatus === 'testing' ? 'spin 1.5s linear infinite' : 'none' }} /> VERIFY
            </button>

            {keyInput && (
              <button onClick={handleClearKey} className="btn-clay btn-clay-danger" style={{ padding: '10px 16px', fontSize: '0.82rem', borderRadius: '12px' }}>
                CLEAR
              </button>
            )}
          </div>

          {testMsg && (
            <div style={{
              marginTop: '12px',
              padding: '12px 16px',
              borderRadius: '14px',
              fontSize: '0.8rem',
              fontWeight: 500,
              background: testStatus === 'success' ? 'rgba(16, 185, 129, 0.12)' : testStatus === 'error' ? 'var(--danger-clay-bg)' : 'var(--primary-clay-bg)',
              border: testStatus === 'success' ? '1px solid var(--success-color)' : testStatus === 'error' ? '1px solid var(--danger-color)' : '1px solid var(--primary-color)',
              color: testStatus === 'success' ? 'var(--success-color)' : testStatus === 'error' ? 'var(--danger-color)' : 'var(--primary-color)'
            }}>
              {testMsg}
            </div>
          )}
        </div>

        {/* Section 2: Assistant Personas */}
        <div style={{ paddingTop: '16px', borderTop: '1px solid var(--clay-border)' }}>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: 'var(--primary-color)', marginBottom: '12px' }}>
            COGNITIVE PERSONA MATRIX
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
            {[
              { id: 'auron', name: 'Auron Standard', desc: 'Sleek, intelligent, concise' },
              { id: 'coder', name: 'Code Expert', desc: 'Software architecture & code helper' },
              { id: 'creative', name: 'Creative Muse', desc: 'Brainstorming & innovation' },
              { id: 'analyst', name: 'Tactical Analyst', desc: 'Logical, analytical research' }
            ].map(p => (
              <div
                key={p.id}
                onClick={() => onChangePersona(p.id)}
                style={{
                  padding: '14px',
                  borderRadius: '16px',
                  border: persona === p.id ? '1.5px solid var(--primary-color)' : '1px solid var(--clay-border)',
                  background: persona === p.id ? 'var(--primary-clay-bg)' : 'rgba(0,0,0,0.03)',
                  boxShadow: persona === p.id ? 'var(--primary-clay-shadow)' : 'var(--clay-shadow-inner)',
                  cursor: 'pointer',
                  transition: 'all 0.25s ease'
                }}
              >
                <div style={{ fontSize: '0.85rem', fontWeight: '700', color: persona === p.id ? 'var(--primary-color)' : 'var(--text-color)' }}>{p.name}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px', lineHeight: 1.3 }}>{p.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Voice Synth Engine */}
        <div style={{ paddingTop: '16px', borderTop: '1px solid var(--clay-border)' }}>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: 'var(--primary-color)', marginBottom: '12px' }}>
            TEXT-TO-SPEECH (TTS) ENGINE
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '6px', fontWeight: 500 }}>Voice Profile</label>
              <select
                value={voiceSettings.voiceIndex || 0}
                onChange={(e) => onUpdateVoiceSettings({ ...voiceSettings, voiceIndex: Number(e.target.value) })}
                className="clay-input-field"
                style={{ fontSize: '0.82rem', padding: '10px 14px', borderRadius: '14px', height: '42px', appearance: 'none', backgroundImage: 'radial-gradient(circle, var(--text-color) 20%, transparent 20%)', backgroundPosition: 'calc(100% - 14px) center', backgroundSize: '10px 10px', backgroundRepeat: 'no-repeat' }}
              >
                {availableVoices.length > 0 ? (
                  availableVoices.map((v, i) => (
                    <option key={i} value={i} style={{ background: 'var(--bg-color)', color: 'var(--text-color)' }}>
                      {v.name} ({v.lang})
                    </option>
                  ))
                ) : (
                  <option value={0}>Default Synthesizer Voice</option>
                )}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '6px', fontWeight: 500 }}>Vocalization Speed ({voiceSettings.rate || 1}x)</label>
              <div style={{ display: 'flex', alignItems: 'center', height: '42px' }}>
                <input
                  type="range"
                  min="0.6"
                  max="1.5"
                  step="0.1"
                  value={voiceSettings.rate || 1}
                  onChange={(e) => onUpdateVoiceSettings({ ...voiceSettings, rate: Number(e.target.value) })}
                  style={{ width: '100%', accentColor: 'var(--primary-color)', cursor: 'pointer' }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ marginTop: '10px', paddingTop: '16px', borderTop: '1px solid var(--clay-border)', display: 'flex' }}>
          <button onClick={onClose} className="btn-clay btn-clay-primary" style={{ marginLeft: 'auto', borderRadius: '14px', padding: '10px 20px' }}>
            DONE & CLOSE
          </button>
        </div>
      </div>
    </div>
  );
}
