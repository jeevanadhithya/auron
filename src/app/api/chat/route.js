import { GoogleGenerativeAI } from '@google/generative-ai';
import { exec } from 'child_process';
import { promisify } from 'util';
import { findCommand } from '../launch/route.js';

const execAsync = promisify(exec);

// Helper: strip markdown formatting for clean display
function formatResponse(text) {
  return text
    .replace(/\*\*(.+?)\*\*/g, '$1')        // Remove **bold**
    .replace(/\*(.+?)\*/g, '$1')             // Remove *italic*
    .replace(/`{3}[\s\S]*?`{3}/g, (m) => m) // Keep code blocks but strip backticks wrapper
    .replace(/`(.+?)`/g, '$1')              // Remove inline `code`
    .replace(/#+\s/g, '')                    // Remove markdown headings
    .replace(/\n{3,}/g, '\n\n')             // Collapse multiple blank lines
    .trim();
}

// Function declarations for Gemini tools
const chatTools = [
  {
    functionDeclarations: [
      {
        name: 'getWeather',
        description: 'Fetches the current weather details for a specific city. Use this when the user asks about the weather of a city.',
        parameters: {
          type: 'OBJECT',
          properties: {
            city: {
              type: 'STRING',
              description: 'The city name (e.g., London, Tokyo, New York).'
            }
          },
          required: ['city']
        }
      },
      {
        name: 'searchWeb',
        description: 'Searches the web on Google or plays a video/song on YouTube in Chrome. Use this when the user wants to search for something online, play a song, play music, or watch a video.',
        parameters: {
          type: 'OBJECT',
          properties: {
            query: {
              type: 'STRING',
              description: 'The search query or name of the video/song.'
            },
            engine: {
              type: 'STRING',
              enum: ['google', 'youtube'],
              description: 'The search engine or platform to use. Use "youtube" if they want to play, watch, or listen to a video/song/music, otherwise use "google".'
            }
          },
          required: ['query', 'engine']
        }
      },
      {
        name: 'launchApp',
        description: 'Launches a system application (e.g., calculator, notepad, file explorer, task manager, cmd, settings, etc.) on the user\'s Windows machine.',
        parameters: {
          type: 'OBJECT',
          properties: {
            appName: {
              type: 'STRING',
              description: 'The name of the application to launch.'
            }
          },
          required: ['appName']
        }
      },
      {
        name: 'openUrl',
        description: 'Opens a specific website URL in Chrome or default browser.',
        parameters: {
          type: 'OBJECT',
          properties: {
            url: {
              type: 'STRING',
              description: 'The full URL to open (e.g., https://github.com).'
            }
          },
          required: ['url']
        }
      }
    ]
  }
];

export async function POST(req) {
  try {
    const body = await req.json();
    const { prompt, history = [], customApiKey, persona = 'auron' } = body;

    if (!prompt || typeof prompt !== 'string') {
      return Response.json({ error: 'Prompt is required.' }, { status: 400 });
    }

    const apiKey = (customApiKey && customApiKey.trim().length > 3)
      ? customApiKey.trim()
      : process.env.GEMINI_API_KEY;

    if (!apiKey || apiKey.includes('your_gemini_api_key')) {
      return Response.json({
        error: 'Access credential required.',
        reply: '⚠️ Please open Settings (top-right) and enter your system access credential to enable intelligence responses.'
      }, { status: 400 });
    }

    // Get current local date and time to inject
    const currentDateTime = new Date().toLocaleString('en-US', {
      dateStyle: 'full',
      timeStyle: 'long'
    });

    const personaPrompts = {
      auron: `You are AURON, an advanced AI assistant. Be concise, intelligent, and direct. Keep replies to 2-4 short sentences unless the user explicitly asks for detail or explanation. No markdown symbols, no asterisks, no bullet dashes. If the user wants more detail, they will ask. Give sharp, punchy, helpful answers.
Current Local Date and Time: ${currentDateTime}`,
      coder: `You are AURON Code Master. Give short, precise coding answers — 2-3 sentences max before any code block. Format code clearly inside triple backtick blocks with the language name. Outside code, use plain text, no markdown symbols. Only elaborate if asked.
Current Local Date and Time: ${currentDateTime}`,
      creative: `You are AURON Creative. Be imaginative and inspiring but keep it short — 2-3 sentences unless asked for more. Write in clear, vivid plain text without markdown symbols.
Current Local Date and Time: ${currentDateTime}`,
      analyst: `You are AURON Tactical Analyst. Be precise, factual, and ultra-concise — 2-4 sentences maximum. No markdown asterisks or symbols. Give the key insight immediately, skip the preamble.
Current Local Date and Time: ${currentDateTime}`
    };

    const systemInstruction = personaPrompts[persona] || personaPrompts.auron;
    const genAI = new GoogleGenerativeAI(apiKey);

    const modelCandidates = [
      'gemini-2.5-flash'
    ];
    let lastError = null;
    let textReply = '';
    let selectedModel = '';

    for (const modelName of modelCandidates) {
      try {
        const model = genAI.getGenerativeModel({
          model: modelName,
          tools: chatTools
        });

        const formattedHistory = history.map(item => ({
          role: item.role === 'user' ? 'user' : 'model',
          parts: [{ text: item.content }]
        }));

        const chat = model.startChat({
          history: [
            { role: 'user', parts: [{ text: `System Instruction: ${systemInstruction}` }] },
            { role: 'model', parts: [{ text: 'Understood. AURON online and standing by.' }] },
            ...formattedHistory
          ]
        });

        let result = await chat.sendMessage(prompt);
        let response = await result.response;
        let functionCalls = response.functionCalls();

        // Handle tool calls in a loop
        while (functionCalls && functionCalls.length > 0) {
          const call = functionCalls[0];
          const { name, args } = call;
          let functionResult = { success: false };

          if (name === 'getWeather') {
            const city = args.city || 'New York';
            const weatherApiKey = process.env.OPENWEATHER_API_KEY;
            try {
              const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${weatherApiKey}&units=metric`);
              if (res.ok) {
                const data = await res.json();
                functionResult = {
                  city: data.name,
                  temp: Math.round(data.main.temp),
                  condition: data.weather[0]?.main || 'Clear',
                  humidity: data.main.humidity,
                  wind: Math.round(data.wind.speed * 3.6),
                  success: true
                };
              } else {
                // Fallback simulator weather
                functionResult = {
                  city: city,
                  temp: 22,
                  condition: 'Sunny',
                  humidity: 50,
                  wind: 10,
                  success: true,
                  source: 'AURON Weather Fallback Simulator'
                };
              }
            } catch (e) {
              functionResult = {
                city: city,
                temp: 22,
                condition: 'Sunny',
                humidity: 50,
                wind: 10,
                success: true,
                source: 'AURON Weather Fallback Simulator'
              };
            }
          } else if (name === 'launchApp') {
            const appName = args.appName;
            const command = findCommand(appName);
            if (command) {
              try {
                await execAsync(command, { shell: true, timeout: 5000 });
                functionResult = { success: true, message: `Launched ${appName}` };
              } catch (e) {
                if (e.code === 0 || e.killed === false) {
                  functionResult = { success: true, message: `Launched ${appName}` };
                } else {
                  functionResult = { success: false, error: e.message };
                }
              }
            } else {
              functionResult = { success: false, error: `App "${appName}" not found.` };
            }
          } else if (name === 'searchWeb') {
            const { query, engine } = args;
            const url = engine === 'youtube'
              ? `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`
              : `https://www.google.com/search?q=${encodeURIComponent(query)}`;
            const command = `start chrome "${url}" || start "${url}"`;
            try {
              await execAsync(command, { shell: true, timeout: 5000 });
              functionResult = { success: true, message: `Opened search for "${query}" on ${engine}` };
            } catch (e) {
              if (e.code === 0 || e.killed === false) {
                functionResult = { success: true, message: `Opened search for "${query}" on ${engine}` };
              } else {
                functionResult = { success: false, error: e.message };
              }
            }
          } else if (name === 'openUrl') {
            const { url } = args;
            const command = `start chrome "${url}" || start "${url}"`;
            try {
              await execAsync(command, { shell: true, timeout: 5000 });
              functionResult = { success: true, message: `Opened URL ${url}` };
            } catch (e) {
              if (e.code === 0 || e.killed === false) {
                functionResult = { success: true, message: `Opened URL ${url}` };
              } else {
                functionResult = { success: false, error: e.message };
              }
            }
          }

          // Send tool results back to Gemini
          const nextResult = await chat.sendMessage([{
            functionResponse: {
              name,
              response: functionResult
            }
          }]);
          response = await nextResult.response;
          functionCalls = response.functionCalls();
        }

        const raw = response.text();
        if (raw) {
          textReply = formatResponse(raw);
          selectedModel = modelName;
          break;
        }
      } catch (err) {
        console.warn(`[${modelName}] failed:`, err.message);
        lastError = err;
      }
    }

    if (!textReply && lastError) {
      return Response.json({
        error: lastError.message,
        reply: `System error: ${lastError.message}. Please verify your access credential in Settings.`
      }, { status: 400 });
    }

    return Response.json({ reply: textReply, model: selectedModel });

  } catch (error) {
    console.error('Chat API Error:', error);
    return Response.json({
      error: error.message,
      reply: 'System error. Please check your access credential in Settings.'
    }, { status: 500 });
  }
}
