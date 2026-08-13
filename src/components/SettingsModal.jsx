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
      padding: '16px',
      background: 'rgba(0, 0, 0, 0.85)',
      backdropFilter: 'blur(12px)'
    }}>
      <div className="jarvis-card" style={{
        width: '100%',
        maxWidth: '560px',
        maxHeight: '90vh',
        overflowY: 'auto',
        border: '1px solid var(--cyan-bright)',
        boxShadow: '0 0 50px rgba(0, 240, 255, 0.35)'
      }}>
        
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '16px', marginBottom: '20px', borderBottom: '1px solid var(--border-hud)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ padding: '8px', borderRadius: '8px', background: 'rgba(0, 240, 255, 0.15)', border: '1px solid var(--cyan-bright)' }}>
              <Key style={{ width: '20px', height: '20px', color: 'var(--cyan-bright)' }} />
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-title)', fontSize: '1.1rem', fontWeight: '700', color: '#ffffff' }}>SYSTEM CONFIGURATION</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Configure Security Credential & Voice Engine</div>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X style={{ width: '22px', height: '22px' }} />
          </button>
        </div>

        {/* Section 1: Security Credential */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', fontSize: '0.85rem', fontFamily: 'var(--font-mono)', fontWeight: '700', color: 'var(--cyan-bright)', marginBottom: '6px' }}>
            SECURITY ACCESS CREDENTIAL
          </label>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
            Optional: Enter your custom security access credential below to personalize system intelligence responses.
          </p>

          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
            <input
              type={showKey ? 'text' : 'password'}
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              placeholder="Enter your system access credential here..."
              className="chat-input"
              style={{ width: '100%', paddingRight: '40px' }}
            />
            <button
              type="button"
              onClick={() => setShowKey(!showKey)}
              style={{ position: 'absolute', right: '12px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
            >
              {showKey ? <EyeOff style={{ width: '18px', height: '18px' }} /> : <Eye style={{ width: '18px', height: '18px' }} />}
            </button>
          </div>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button onClick={handleSaveKey} className="btn-send" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
              <CheckCircle style={{ width: '16px', height: '16px' }} /> SAVE CREDENTIAL
            </button>

            <button onClick={handleTestKey} className="btn-action" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
              <RefreshCw style={{ width: '16px', height: '16px', animation: testStatus === 'testing' ? 'spin 1s linear infinite' : 'none' }} /> VERIFY CREDENTIAL
            </button>

            {keyInput && (
              <button onClick={handleClearKey} className="btn-action" style={{ padding: '8px 16px', fontSize: '0.85rem', borderColor: 'var(--crimson-stop)', color: 'var(--crimson-stop)' }}>
                CLEAR
              </button>
            )}
          </div>

          {testMsg && (
            <div style={{
              marginTop: '12px',
              padding: '10px 14px',
              borderRadius: '8px',
              fontSize: '0.8rem',
              fontFamily: 'var(--font-mono)',
              background: testStatus === 'success' ? 'rgba(74, 222, 128, 0.1)' : testStatus === 'error' ? 'rgba(255, 0, 85, 0.1)' : 'rgba(0, 240, 255, 0.1)',
              border: testStatus === 'success' ? '1px solid #4ade80' : testStatus === 'error' ? '1px solid var(--crimson-stop)' : '1px solid var(--cyan-bright)',
              color: testStatus === 'success' ? '#4ade80' : testStatus === 'error' ? '#ff4d6d' : 'var(--cyan-bright)'
            }}>
              {testMsg}
            </div>
          )}
        </div>

        {/* Section 2: Assistant Personas */}
        <div style={{ marginBottom: '24px', paddingTop: '16px', borderTop: '1px solid var(--border-hud)' }}>
          <label style={{ display: 'block', fontSize: '0.85rem', fontFamily: 'var(--font-mono)', fontWeight: '700', color: 'var(--cyan-bright)', marginBottom: '10px' }}>
            ASSISTANT PERSONA PROTOCOLS
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
            {[
              { id: 'auron', name: 'JARVIS Standard', desc: 'Sleek, intelligent, concise' },
              { id: 'coder', name: 'Code Master', desc: 'Software architecture & code snippets' },
              { id: 'creative', name: 'Creative AI', desc: 'Brainstorming & innovation' },
              { id: 'analyst', name: 'Tactical Analyst', desc: 'Data research & logic analysis' }
            ].map(p => (
              <div
                key={p.id}
                onClick={() => onChangePersona(p.id)}
                style={{
                  padding: '12px',
                  borderRadius: '10px',
                  border: persona === p.id ? '1px solid var(--cyan-bright)' : '1px solid var(--border-hud)',
                  background: persona === p.id ? 'rgba(0, 240, 255, 0.15)' : 'rgba(3, 7, 18, 0.6)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ fontSize: '0.85rem', fontWeight: '700', color: persona === p.id ? 'var(--cyan-bright)' : '#ffffff' }}>{p.name}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>{p.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Voice Synth Engine */}
        <div style={{ paddingTop: '16px', borderTop: '1px solid var(--border-hud)' }}>
          <label style={{ display: 'block', fontSize: '0.85rem', fontFamily: 'var(--font-mono)', fontWeight: '700', color: 'var(--cyan-bright)', marginBottom: '10px' }}>
            TEXT-TO-SPEECH (TTS) VOICE ENGINE
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Synthesizer Voice</label>
              <select
                value={voiceSettings.voiceIndex || 0}
                onChange={(e) => onUpdateVoiceSettings({ ...voiceSettings, voiceIndex: Number(e.target.value) })}
                className="chat-input"
                style={{ fontSize: '0.8rem', padding: '8px' }}
              >
                {availableVoices.length > 0 ? (
                  availableVoices.map((v, i) => (
                    <option key={i} value={i} style={{ background: '#030712', color: '#ffffff' }}>
                      {v.name} ({v.lang})
                    </option>
                  ))
                ) : (
                  <option value={0}>Default Synthesizer Voice</option>
                )}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Voice Speed ({voiceSettings.rate || 1}x)</label>
              <input
                type="range"
                min="0.6"
                max="1.5"
                step="0.1"
                value={voiceSettings.rate || 1}
                onChange={(e) => onUpdateVoiceSettings({ ...voiceSettings, rate: Number(e.target.value) })}
                style={{ width: '100%', accentColor: 'var(--cyan-bright)', cursor: 'pointer' }}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--border-hud)', display: 'flex' }}>
          <button onClick={onClose} className="btn-send" style={{ marginLeft: 'auto' }}>
            DONE & CLOSE
          </button>
        </div>
      </div>
    </div>
  );
}
