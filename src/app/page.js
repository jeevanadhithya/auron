'use client';

import React, { useState, useEffect, useRef } from 'react';
import Header from '../components/Header';
import AuronOrb from '../components/AuronOrb';
import ChatFeed from '../components/ChatFeed';
import WidgetsPanel from '../components/WidgetsPanel';
import SettingsModal from '../components/SettingsModal';

// ─── App launch intent detection ────────────────────────────────────────────
const APP_ALIASES = [
  { match: ['control panel', 'control panel app', 'settings panel'],           app: 'control panel' },
  { match: ['task manager', 'task manager app', 'taskmanager', 'taskmgr'],     app: 'task manager'  },
  { match: ['file explorer', 'windows explorer', 'file manager', 'explorer'],  app: 'file explorer' },
  { match: ['on-screen keyboard', 'on screen keyboard', 'virtual keyboard'],   app: 'on-screen keyboard' },
  { match: ['snipping tool', 'snipping', 'screenshot tool'],                   app: 'snipping tool' },
  { match: ['sticky notes', 'stickynotes'],                                    app: 'sticky notes'  },
  { match: ['system info', 'system information'],                               app: 'system info'   },
  { match: ['disk management'],                                                 app: 'disk management' },
  { match: ['device manager'],                                                  app: 'device manager' },
  { match: ['registry editor', 'regedit', 'registry'],                        app: 'registry editor' },
  { match: ['event viewer'],                                                    app: 'event viewer'  },
  { match: ['resource monitor'],                                                app: 'resource monitor' },
  { match: ['performance monitor', 'perf monitor'],                             app: 'performance monitor' },
  { match: ['voice recorder'],                                                  app: 'voice recorder' },
  { match: ['about windows', 'winver', 'windows version'],                     app: 'about windows' },
  { match: ['calculator', 'calc'],                                              app: 'calculator'    },
  { match: ['settings', 'setting', 'preferences'],                             app: 'settings'      },
  { match: ['notepad'],                                                         app: 'notepad'       },
  { match: ['paint', 'mspaint'],                                                app: 'paint'         },
  { match: ['wordpad'],                                                         app: 'wordpad'       },
  { match: ['magnifier'],                                                       app: 'magnifier'     },
  { match: ['narrator'],                                                       app: 'narrator'      },
  { match: ['cmd', 'command prompt', 'command line'],                          app: 'cmd'           },
  { match: ['powershell', 'power shell'],                                       app: 'powershell'    },
  { match: ['terminal', 'windows terminal'],                                    app: 'powershell'    },
  { match: ['clock', 'alarms'],                                                 app: 'clock'         },
  { match: ['calendar'],                                                        app: 'calendar'      },
  { match: ['camera'],                                                          app: 'camera'        },
  { match: ['photos', 'photo'],                                                 app: 'photos'        },
  { match: ['store', 'microsoft store', 'ms store'],                           app: 'store'         },
  { match: ['mail', 'email'],                                                   app: 'mail'          },
  { match: ['chrome', 'google chrome'],                                         app: 'chrome'        },
  { match: ['edge', 'microsoft edge'],                                          app: 'edge'          },
  { match: ['services'],                                                        app: 'services'      },
  { match: ['xbox'],                                                            app: 'xbox'          },
];

const LAUNCH_TRIGGERS = ['open', 'launch', 'start', 'run', 'show', 'bring up', 'open up'];

function detectLaunchIntent(text) {
  const lower = text.toLowerCase().trim();
  const hasTrigger = LAUNCH_TRIGGERS.some(t => lower.startsWith(t + ' ') || lower === t);
  if (!hasTrigger) return null;

  let stripped = lower;
  for (const t of LAUNCH_TRIGGERS) {
    if (lower.startsWith(t + ' ')) {
      stripped = lower.slice(t.length).trim();
      break;
    }
  }

  for (const { match, app } of APP_ALIASES) {
    for (const alias of match) {
      if (stripped === alias || stripped.includes(alias) || lower.includes(alias)) {
        return app;
      }
    }
  }
  return null;
}

const APP_URI_MAP = {
  'calculator':        'calculator://',
  'settings':          'ms-settings:',
  'control panel':     'ms-settings:',
  'store':             'ms-windows-store:',
  'camera':            'microsoft.windows.camera:',
  'photos':            'ms-photos:',
  'mail':              'outlookmail:',
  'calendar':          'outlookcal:',
  'clock':             'ms-clock:',
  'alarms':            'ms-clock:',
  'maps':              'bingmaps:',
  'weather':           'bingweather:',
  'news':              'bingnews:',
  'xbox':              'xbox:',
  'sticky notes':      'stickynotes:',
};

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [status, setStatus] = useState('idle');
  const [isListening, setIsListening] = useState(false);
  const [theme, setTheme] = useState('light');

  const [apiKey, setApiKey] = useState('');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [persona, setPersona] = useState('auron');
  const [voiceSettings, setVoiceSettings] = useState({ voiceIndex: 0, rate: 1, pitch: 1 });

  const recognitionRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedKey = localStorage.getItem('auron_custom_gemini_key');
      if (savedKey) setApiKey(savedKey);
      const savedPersona = localStorage.getItem('auron_persona');
      if (savedPersona) setPersona(savedPersona);
      const savedVoice = localStorage.getItem('auron_voice_settings');
      if (savedVoice) { try { setVoiceSettings(JSON.parse(savedVoice)); } catch (e) {} }

      const savedTheme = localStorage.getItem('auron_theme') || 'light';
      setTheme(savedTheme);
      applyTheme(savedTheme);
    }
  }, []);

  function applyTheme(t) {
    document.documentElement.classList.remove('dark-mode', 'light-mode');
    if (t === 'dark') document.documentElement.classList.add('dark-mode');
  }

  const handleToggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem('auron_theme', next);
    applyTheme(next);
  };

  const handleSaveApiKey = (key) => {
    setApiKey(key);
    if (typeof window !== 'undefined') {
      if (key) localStorage.setItem('auron_custom_gemini_key', key);
      else localStorage.removeItem('auron_custom_gemini_key');
    }
  };

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
    utterance.onend   = () => setStatus('idle');
    utterance.onerror = () => setStatus('idle');
    window.speechSynthesis.speak(utterance);
  };

  const stopSpeech = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setStatus('idle');
    }
  };

  const handleLaunchApp = async (appName) => {
    setMessages(prev => [...prev, { role: 'user', content: `Open ${appName}` }]);
    setStatus('thinking');

    const uri = APP_URI_MAP[appName];
    let replyText = '';

    if (uri) {
      try {
        window.location.href = uri;
        replyText = `Opening ${appName} now.`;
      } catch (e) {
        replyText = `Could not open ${appName} via URI scheme.`;
      }
    } else {
      try {
        const res = await fetch('/api/launch', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ app: appName })
        });
        const data = await res.json();
        replyText = data.success
          ? `Launching ${appName} now.`
          : (data.message || `Could not open ${appName}.`);
      } catch (err) {
        replyText = `Launching ${appName}... (requires local server)`;
      }
    }

    setMessages(prev => [...prev, { role: 'assistant', content: replyText }]);
    speakText(replyText);
  };

  const handleSendMessage = async (textToSend) => {
    const promptText = (textToSend || inputText || '').trim();
    if (!promptText) return;

    setInputText('');
    stopSpeech();

    const appToLaunch = detectLaunchIntent(promptText);
    if (appToLaunch) {
      await handleLaunchApp(appToLaunch);
      return;
    }

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
          persona
        })
      });
      const data = await res.json();
      const replyText = data.reply || data.error || 'No response.';
      setMessages(prev => [...prev, { role: 'assistant', content: replyText }]);
      speakText(replyText);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Communication error. Unable to complete request.' }]);
      setStatus('idle');
    }
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => { setIsListening(true); setStatus('listening'); };
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      if (transcript?.trim()) {
        setIsListening(false);
        handleSendMessage(transcript.trim());
      }
    };
    recognition.onerror = () => { setIsListening(false); setStatus('idle'); };
    recognition.onend   = () => { setIsListening(false); if (status === 'listening') setStatus('idle'); };

    recognitionRef.current = recognition;
  }, [status, messages, apiKey, persona, voiceSettings]);

  const startListening = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition not supported. Use Chrome or Edge.');
      return;
    }
    try { stopSpeech(); recognitionRef.current.start(); }
    catch (err) { console.error('Recognition start failed:', err); }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) recognitionRef.current.stop();
    setIsListening(false);
    setStatus('idle');
  };

  const handleClearMessages = () => { setMessages([]); stopSpeech(); };

  return (
    <main className="jarvis-app">
      <Header
        status={status}
        onOpenSettings={() => setIsSettingsOpen(true)}
        hasCustomKey={Boolean(apiKey?.length > 5)}
        theme={theme}
        onToggleTheme={handleToggleTheme}
      />

      {/* Main Grid: AI Core (Left) and Communications Terminal (Right) */}
      <div className="jarvis-grid">
        {/* Left Column: AI CORE containing the Arc Reactor visualizer */}
        <div className="clay-card">
          <AuronOrb
            status={status}
            isListening={isListening}
            onStartListening={startListening}
            onStopListening={stopListening}
            onStopSpeech={stopSpeech}
          />
        </div>

        {/* Right Column: COMMUNICATIONS TERMINAL */}
        <ChatFeed
          messages={messages}
          inputText={inputText}
          onInputChange={setInputText}
          onSendMessage={handleSendMessage}
          onSpeakText={speakText}
          onStopSpeech={stopSpeech}
          onClearMessages={handleClearMessages}
          status={status}
        />
      </div>

      {/* Bottom Dashboard Widgets Row */}
      <WidgetsPanel onSendPrompt={handleSendMessage} />

      <footer style={{
        textAlign: 'center',
        fontSize: '0.68rem',
        color: 'var(--text-muted)',
        fontFamily: 'var(--font-hud)',
        letterSpacing: '2px',
        marginTop: '6px',
        opacity: 0.55
      }}>
        AURON v2.0 · INTELLIGENT AI SYSTEM · POWERED BY GEMINI
      </footer>

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        apiKey={apiKey}
        onSaveApiKey={handleSaveApiKey}
        voiceSettings={voiceSettings}
        onUpdateVoiceSettings={s => setVoiceSettings(s)}
        persona={persona}
        onChangePersona={p => setPersona(p)}
      />
    </main>
  );
}
