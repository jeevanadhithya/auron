'use client';

import React, { useState, useEffect, useRef } from 'react';
import Header from '../components/Header';
import AuronOrb from '../components/AuronOrb';
import ChatFeed from '../components/ChatFeed';
import WidgetsPanel, { WeatherWidget } from '../components/WidgetsPanel';
import SettingsModal from '../components/SettingsModal';

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [status, setStatus] = useState('idle');
  const [isListening, setIsListening] = useState(false);
  
  const [apiKey, setApiKey] = useState('');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [persona, setPersona] = useState('auron');
  const [voiceSettings, setVoiceSettings] = useState({ voiceIndex: 0, rate: 1, pitch: 1 });

  const recognitionRef = useRef(null);

  // Load saved preferences
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedKey = localStorage.getItem('auron_custom_gemini_key');
      if (savedKey) setApiKey(savedKey);
      const savedPersona = localStorage.getItem('auron_persona');
      if (savedPersona) setPersona(savedPersona);
      const savedVoice = localStorage.getItem('auron_voice_settings');
      if (savedVoice) { try { setVoiceSettings(JSON.parse(savedVoice)); } catch (e) {} }
    }
  }, []);

  const handleSaveApiKey = (key) => {
    setApiKey(key);
    if (typeof window !== 'undefined') {
      if (key) localStorage.setItem('auron_custom_gemini_key', key);
      else localStorage.removeItem('auron_custom_gemini_key');
    }
  };

  // Speech Synthesis
  const speakText = (text) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[*_`#]/g, '').trim();
    if (!cleanText) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0 && voices[voiceSettings.voiceIndex]) {
      utterance.voice = voices[voiceSettings.voiceIndex];
    }
    utterance.rate = voiceSettings.rate || 1;
    utterance.pitch = voiceSettings.pitch || 1;

    utterance.onstart = () => setStatus('speaking');
    utterance.onend = () => setStatus('idle');
    utterance.onerror = () => setStatus('idle');

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeech = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setStatus('idle');
    }
  };

  // Send Message (voice or text) → respond AND speak immediately
  const handleSendMessage = async (textToSend) => {
    const promptText = textToSend || inputText;
    if (!promptText || !promptText.trim()) return;

    setInputText('');
    stopSpeech();

    const userMessage = { role: 'user', content: promptText };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setStatus('thinking');

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptText,
          history: updatedMessages.slice(-6),
          customApiKey: apiKey,
          persona: persona
        })
      });

      const data = await res.json();
      const replyText = data.reply || data.error || 'No response.';

      // Add reply and immediately speak it — no manual trigger needed
      setMessages((prev) => [...prev, { role: 'assistant', content: replyText }]);
      speakText(replyText);

    } catch (err) {
      const errReply = 'Communication error. Unable to complete request.';
      setMessages((prev) => [...prev, { role: 'assistant', content: errReply }]);
      setStatus('idle');
    }
  };

  // Initialize Speech Recognition — continuous listening, responds immediately on result
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = false;    // Single utterance per activation
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      setStatus('listening');
    };

    // As soon as speech is recognized → immediately fire the query
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      if (transcript && transcript.trim()) {
        setIsListening(false);
        handleSendMessage(transcript.trim());
      }
    };

    recognition.onerror = (event) => {
      console.warn('STT error:', event.error);
      setIsListening(false);
      setStatus('idle');
    };

    recognition.onend = () => {
      setIsListening(false);
      if (status === 'listening') setStatus('idle');
    };

    recognitionRef.current = recognition;
  }, [status, messages, apiKey, persona, voiceSettings]);

  const startListening = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in this browser. Use Chrome, Edge, or Safari.');
      return;
    }
    try {
      stopSpeech();
      recognitionRef.current.start();
    } catch (err) {
      console.error('Failed to start recognition:', err);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) recognitionRef.current.stop();
    setIsListening(false);
    setStatus('idle');
  };

  const handleClearMessages = () => {
    setMessages([]);
    stopSpeech();
  };

  return (
    <main className="jarvis-app">
      <Header
        status={status}
        onOpenSettings={() => setIsSettingsOpen(true)}
        hasCustomKey={Boolean(apiKey && apiKey.length > 5)}
      />

      {/* Two balanced columns — equal height via stretch */}
      <div className="jarvis-grid" style={{ alignItems: 'stretch' }}>

        {/* LEFT: Reactor + Diagnostics + Quick Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="jarvis-card" style={{ flex: '0 0 auto' }}>
            <AuronOrb
              status={status}
              isListening={isListening}
              onStartListening={startListening}
              onStopListening={stopListening}
            />
          </div>
          <WidgetsPanel onSendPrompt={handleSendMessage} />
        </div>

        {/* RIGHT: Full chat console + Weather at bottom */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Chat console expands to fill space */}
          <div style={{ flex: 1, minHeight: 0 }}>
            <ChatFeed
              messages={messages}
              inputText={inputText}
              onInputChange={setInputText}
              onSendMessage={handleSendMessage}
              onSpeakText={speakText}
              onClearMessages={handleClearMessages}
              status={status}
            />
          </div>
          {/* Weather widget pinned to right bottom */}
          <WeatherWidget />
        </div>
      </div>

      <footer style={{ textAlign: 'center', fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginTop: '16px' }}>
        JARVIS MARK VII • ADVANCED AUTONOMOUS AI SYSTEM • VERCEL CLOUD READY
      </footer>

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        apiKey={apiKey}
        onSaveApiKey={handleSaveApiKey}
        voiceSettings={voiceSettings}
        onUpdateVoiceSettings={(s) => setVoiceSettings(s)}
        persona={persona}
        onChangePersona={(p) => setPersona(p)}
      />
    </main>
  );
}
