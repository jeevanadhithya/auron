'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Bot, User, Send, Volume2, Copy, Check, Terminal, Sparkles, Trash2, Square } from 'lucide-react';

export default function ChatFeed({
  messages,
  inputText,
  onInputChange,
  onSendMessage,
  onSpeakText,
  onStopSpeech,
  onClearMessages,
  status
}) {
  const [copiedIndex, setCopiedIndex] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, status]);

  const handleCopy = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleInputFocus = (e) => {
    e.preventDefault();
    setTimeout(() => {
      inputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 0);
  };

  const quickPrompts = [
    { label: '🌤 Weather', prompt: "What's the weather forecast today?" },
    { label: '🤖 Tech News', prompt: 'Give me the top 3 tech headlines today' },
    { label: '💡 Python Tip', prompt: 'Give me a useful Python one-liner trick' },
    { label: '🧠 Explain AI', prompt: 'Explain machine learning in 2 sentences' },
  ];

  return (
    <div className="chat-console">
      {/* HUD Console Header */}
      <div className="chat-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Terminal style={{ width: '15px', height: '15px', color: 'var(--primary-color)' }} />
          <span>COMMUNICATIONS TERMINAL</span>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 'normal', fontFamily: 'var(--font-hud)' }}>
            [{messages.length} MSG{messages.length !== 1 ? 'S' : ''}]
          </span>
        </div>
        <div>
          {messages.length > 0 && (
            <button
              onClick={onClearMessages}
              className="btn-clay btn-clay-danger"
              style={{
                padding: '6px 12px',
                borderRadius: '10px',
                fontSize: '0.72rem',
                fontWeight: 700
              }}
            >
              <Trash2 style={{ width: '12px', height: '12px' }} /> CLEAR
            </button>
          )}
        </div>
      </div>

      {/* Messages Stream */}
      <div className="chat-messages">
        {messages.length === 0 ? (
          <div style={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            gap: '18px',
            color: 'var(--text-muted)'
          }}>
            <div style={{
              width: '64px', height: '64px',
              borderRadius: '50%',
              background: 'var(--primary-clay-bg)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: 'var(--clay-shadow-inner)'
            }}>
              <Sparkles style={{ width: '28px', height: '28px', color: 'var(--primary-color)' }} />
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-hud)', fontSize: '1.25rem', color: 'var(--text-color)', fontWeight: '700', letterSpacing: '1px' }}>
                AURON ACTIVE &amp; MONITORING
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '6px', maxWidth: '380px', lineHeight: 1.5 }}>
                Issue system commands verbally, or initiate cognitive dialog using the inputs below.
              </div>
            </div>

            {/* Quick Prompts */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', width: '100%', maxWidth: '440px' }}>
              {quickPrompts.map((qp, idx) => (
                <button
                  key={idx}
                  onClick={() => onSendMessage(qp.prompt)}
                  className="btn-clay"
                  style={{ textAlign: 'left', padding: '10px 14px', fontSize: '0.8rem', borderRadius: '12px', justifyContent: 'flex-start' }}
                >
                  <span style={{ marginRight: '6px' }}>{qp.label.split(' ')[0]}</span>
                  <span>{qp.label.split(' ').slice(1).join(' ')}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div
              key={idx}
              style={{ display: 'flex', flexDirection: 'column', alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start', margin: '6px 0' }}
            >
              {/* Message Bubble */}
              <div className={msg.role === 'user' ? 'msg-user' : 'msg-jarvis'}>
                {/* Speaker tag */}
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '5px',
                  marginBottom: '6px',
                  fontSize: '0.68rem',
                  fontFamily: 'var(--font-hud)',
                  fontWeight: 700,
                  letterSpacing: '0.5px',
                  opacity: 0.8
                }}>
                  {msg.role === 'user' ? (
                    <>
                      <User style={{ width: '10px', height: '10px', color: 'var(--secondary-color)' }} />
                      <span style={{ color: 'var(--secondary-color)' }}>YOU</span>
                    </>
                  ) : (
                    <>
                      <Bot style={{ width: '10px', height: '10px', color: 'var(--primary-color)' }} />
                      <span style={{ color: 'var(--primary-color)' }}>AURON</span>
                    </>
                  )}
                </div>

                {/* Message body */}
                <div style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontSize: '0.9rem', lineHeight: '1.6' }}>
                  {msg.content}
                </div>

                {/* AI Actions */}
                {msg.role !== 'user' && (
                  <div style={{
                    display: 'flex', gap: '14px',
                    marginTop: '8px', paddingTop: '6px',
                    borderTop: '1px solid var(--clay-border)',
                    fontSize: '0.72rem',
                    fontFamily: 'var(--font-hud)',
                    fontWeight: 700
                  }}>
                    <button
                      onClick={() => onSpeakText(msg.content)}
                      style={{ background: 'none', border: 'none', color: 'var(--primary-color)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                      <Volume2 style={{ width: '13px', height: '13px' }} /> SPEAK
                    </button>
                    <button
                      onClick={() => handleCopy(msg.content, idx)}
                      style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                      {copiedIndex === idx
                        ? <><Check style={{ width: '13px', height: '13px', color: 'var(--success-color)' }} /> COPIED</>
                        : <><Copy style={{ width: '13px', height: '13px' }} /> COPY</>
                      }
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}

        {status === 'thinking' && (
          <div className="msg-jarvis" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 16px' }}>
            <div className="glow-dot" style={{ background: 'var(--primary-color)' }} />
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>AURON is processing request...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input bar */}
      <div className="chat-input-bar">
        <input
          ref={inputRef}
          type="text"
          value={inputText}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onSendMessage()}
          onFocus={handleInputFocus}
          placeholder="Command Auron..."
          className="clay-input-field"
        />

        {status === 'speaking' && (
          <button
            onClick={onStopSpeech}
            className="btn-clay btn-clay-stop"
            title="Stop speaking"
            style={{ height: '42px', padding: '0 12px', borderRadius: '18px', flexShrink: 0 }}
          >
            <Square style={{ width: '15px', height: '15px' }} />
          </button>
        )}

        <button
          onClick={() => onSendMessage()}
          disabled={!(inputText || '').trim() || status === 'thinking'}
          className="btn-clay btn-clay-primary"
          style={{
            height: '42px',
            padding: '0 18px',
            borderRadius: '18px',
            flexShrink: 0,
            opacity: !(inputText || '').trim() || status === 'thinking' ? 0.6 : 1
          }}
        >
          <Send style={{ width: '14px', height: '14px' }} />
          <span>SEND</span>
        </button>
      </div>
    </div>
  );
}
