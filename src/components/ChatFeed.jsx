'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Bot, User, Send, Volume2, Copy, Check, Terminal, Sparkles, Trash2 } from 'lucide-react';

export default function ChatFeed({
  messages,
  inputText,
  onInputChange,
  onSendMessage,
  onSpeakText,
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

  // Prevent page scroll when focusing the input
  const handleInputFocus = (e) => {
    e.preventDefault();
    // Scroll only within the chat container, not the page
    setTimeout(() => {
      inputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 0);
  };

  const quickPrompts = [
    "What is today's weather forecast?",
    "Give me the latest technology news",
    "Write a Python script for file automation",
    "Explain quantum computing in simple terms"
  ];

  return (
    <div className="chat-console" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* HUD Console Header */}
      <div className="chat-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Terminal style={{ width: '16px', height: '16px', color: 'var(--cyan-bright)' }} />
          <span>JARVIS COMMUNICATIONS TERMINAL</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span>MARK VII CORE • ACTIVE</span>
          {/* DUSTBIN / CLEAR BUTTON */}
          {messages.length > 0 && (
            <button
              onClick={onClearMessages}
              title="Clear all messages"
              style={{
                background: 'none',
                border: '1px solid rgba(255,0,85,0.4)',
                borderRadius: '6px',
                padding: '3px 8px',
                color: 'var(--crimson-stop)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '0.75rem',
                fontFamily: 'var(--font-mono)',
                transition: 'all 0.2s ease'
              }}
            >
              <Trash2 style={{ width: '13px', height: '13px' }} /> CLEAR
            </button>
          )}
        </div>
      </div>

      {/* Messages Stream */}
      <div className="chat-messages" style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
        {messages.length === 0 ? (
          <div style={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            gap: '16px',
            color: 'var(--text-muted)'
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: 'rgba(0, 240, 255, 0.1)',
              border: '1px solid var(--cyan-bright)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 20px var(--cyan-glow)'
            }}>
              <Sparkles style={{ width: '30px', height: '30px', color: 'var(--cyan-bright)' }} />
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-title)', fontSize: '1.05rem', color: '#ffffff', fontWeight: '700' }}>
                JARVIS STANDING BY
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px', maxWidth: '380px' }}>
                Click START to speak, or type your command below.
              </div>
            </div>

            {/* Quick Prompts */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', width: '100%', maxWidth: '460px', marginTop: '8px' }}>
              {quickPrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => onSendMessage(prompt)}
                  className="btn-action"
                  style={{ textAlign: 'left', padding: '10px 14px', fontSize: '0.8rem' }}
                >
                  <span style={{ color: 'var(--cyan-bright)', marginRight: '4px' }}>›</span> {prompt}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div
              key={idx}
              style={{ marginBottom: '16px', display: 'flex', flexDirection: 'column', alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start' }}
            >
              <div className={msg.role === 'user' ? 'msg-user' : 'msg-jarvis'}>
                {/* Message Label */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px', fontSize: '0.72rem', fontFamily: 'var(--font-mono)', opacity: 0.75 }}>
                  {msg.role === 'user' ? (
                    <><User style={{ width: '11px', height: '11px' }} /><span>YOU</span></>
                  ) : (
                    <><Bot style={{ width: '11px', height: '11px', color: 'var(--cyan-bright)' }} /><span style={{ color: 'var(--cyan-bright)' }}>JARVIS</span></>
                  )}
                </div>

                {/* Message Text */}
                <div style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', lineHeight: '1.65', fontSize: '0.95rem' }}>
                  {msg.content}
                </div>

                {/* Action buttons for JARVIS replies only */}
                {msg.role !== 'user' && (
                  <div style={{ display: 'flex', gap: '14px', marginTop: '10px', paddingTop: '8px', borderTop: '1px solid rgba(255,255,255,0.07)', fontSize: '0.72rem', fontFamily: 'var(--font-mono)' }}>
                    <button
                      onClick={() => onSpeakText(msg.content)}
                      style={{ background: 'none', border: 'none', color: 'var(--cyan-bright)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                      <Volume2 style={{ width: '12px', height: '12px' }} /> READ ALOUD
                    </button>
                    <button
                      onClick={() => handleCopy(msg.content, idx)}
                      style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                      {copiedIndex === idx
                        ? <><Check style={{ width: '12px', height: '12px', color: '#4ade80' }} /> COPIED</>
                        : <><Copy style={{ width: '12px', height: '12px' }} /> COPY</>
                      }
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}

        {status === 'thinking' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '14px 18px', background: 'rgba(10,25,47,0.9)', border: '1px solid var(--border-hud)', borderLeft: '3px solid var(--cyan-bright)', borderRadius: '12px', color: 'var(--cyan-bright)', fontSize: '0.85rem', fontFamily: 'var(--font-mono)' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--cyan-bright)', animation: 'ping 1s cubic-bezier(0,0,0.2,1) infinite' }} />
            Analyzing request...
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* CHAT INPUT BAR - fixed at bottom, no page scroll on focus */}
      <div className="chat-input-bar" style={{ flexShrink: 0 }}>
        <input
          ref={inputRef}
          type="text"
          value={inputText}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onSendMessage()}
          onFocus={handleInputFocus}
          placeholder="Enter command for JARVIS..."
          className="chat-input"
          style={{ scrollMarginBottom: '0' }}
        />

        <button
          onClick={() => onSendMessage()}
          disabled={!(inputText || '').trim() || status === 'thinking'}
          className="btn-send"
          style={{ opacity: !(inputText || '').trim() ? 0.55 : 1 }}
        >
          <span>SEND</span>
          <Send style={{ width: '16px', height: '16px' }} />
        </button>
      </div>
    </div>
  );
}
