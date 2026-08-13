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
    <div className="chat-console">
      {/* HUD Console Header */}
      <div className="chat-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Terminal style={{ width: '16px', height: '16px', color: 'var(--primary-color)' }} />
          <span style={{ fontSize: '0.85rem', tracking: '0.5px' }}>COMMUNICATIONS TERMINAL</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {messages.length > 0 && (
            <button
              onClick={onClearMessages}
              className="btn-clay btn-clay-danger"
              title="Clear all messages"
              style={{
                padding: '6px 12px',
                borderRadius: '12px',
                fontSize: '0.75rem',
                fontWeight: 600
              }}
            >
              <Trash2 style={{ width: '13px', height: '13px' }} /> CLEAR
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
            gap: '20px',
            color: 'var(--text-muted)'
          }}>
            <div className="btn-clay btn-clay-primary" style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 0
            }}>
              <Sparkles style={{ width: '28px', height: '28px' }} />
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-main)', fontSize: '1.2rem', color: 'var(--text-color)', fontWeight: '700' }}>
                AURON IS ACTIVE
              </div>
              <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginTop: '6px', maxWidth: '380px', lineHeight: 1.5 }}>
                Click TALK to speak, or select a quick query below to test the cognitive core.
              </div>
            </div>

            {/* Quick Prompts */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', width: '100%', maxWidth: '480px', marginTop: '10px' }}>
              {quickPrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => onSendMessage(prompt)}
                  className="btn-clay"
                  style={{ textAlign: 'left', padding: '12px 16px', fontSize: '0.82rem', borderRadius: '16px', justifyContent: 'flex-start' }}
                >
                  <span style={{ color: 'var(--primary-color)', marginRight: '6px', fontWeight: 'bold' }}>›</span>
                  <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{prompt}</span>
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
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', fontSize: '0.72rem', fontWeight: 700, opacity: 0.8 }}>
                  {msg.role === 'user' ? (
                    <><User style={{ width: '12px', height: '12px' }} /><span>YOU</span></>
                  ) : (
                    <><Bot style={{ width: '12px', height: '12px', color: 'var(--primary-color)' }} /><span style={{ color: 'var(--primary-color)' }}>AURON</span></>
                  )}
                </div>

                {/* Message Text */}
                <div style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', lineHeight: '1.6', fontSize: '0.92rem' }}>
                  {msg.content}
                </div>

                {/* Action buttons for replies */}
                {msg.role !== 'user' && (
                  <div style={{ display: 'flex', gap: '16px', marginTop: '12px', paddingTop: '10px', borderTop: '1px solid var(--clay-border)', fontSize: '0.75rem', fontWeight: 600 }}>
                    <button
                      onClick={() => onSpeakText(msg.content)}
                      style={{ background: 'none', border: 'none', color: 'var(--primary-color)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                      <Volume2 style={{ width: '14px', height: '14px' }} /> SPEAK
                    </button>
                    <button
                      onClick={() => handleCopy(msg.content, idx)}
                      style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                      {copiedIndex === idx
                        ? <><Check style={{ width: '14px', height: '14px', color: 'var(--success-color)' }} /> COPIED</>
                        : <><Copy style={{ width: '14px', height: '14px' }} /> COPY</>
                      }
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}

        {status === 'thinking' && (
          <div className="msg-jarvis" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 18px', borderRadius: '16px 16px 16px 4px', fontSize: '0.85rem' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary-color)', animation: 'reactorPulse 1.5s ease-in-out infinite' }} />
            <span>Processing intelligence matrix...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* CHAT INPUT BAR */}
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

        <button
          onClick={() => onSendMessage()}
          disabled={!(inputText || '').trim() || status === 'thinking'}
          className="btn-clay btn-clay-primary"
          style={{ 
            height: '48px', 
            padding: '0 20px', 
            borderRadius: '18px',
            opacity: !(inputText || '').trim() ? 0.6 : 1 
          }}
        >
          <span>SEND</span>
          <Send style={{ width: '16px', height: '16px' }} />
        </button>
      </div>
    </div>
  );
}
