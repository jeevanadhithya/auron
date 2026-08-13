import { GoogleGenerativeAI } from '@google/generative-ai';

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

    const personaPrompts = {
      auron: `You are JARVIS, an advanced Iron Man AI assistant. Respond like the real JARVIS: concise, intelligent, helpful. Format your answers in plain text — no asterisks, no markdown symbols, no bullet dashes. Use short numbered lists when needed. Write naturally.`,
      coder: `You are JARVIS Code Master. Format code clearly inside triple backtick blocks with the language name. Outside code, use plain text, no asterisks or markdown symbols.`,
      creative: `You are JARVIS Creative. Be imaginative and thoughtful. Write in clear, flowing plain text without any markdown symbols.`,
      analyst: `You are JARVIS Tactical Analyst. Be precise and factual. Write in plain structured text. No markdown asterisks or symbols.`
    };

    const systemInstruction = personaPrompts[persona] || personaPrompts.auron;
    const genAI = new GoogleGenerativeAI(apiKey);

    const modelCandidates = ['gemini-3.1-flash-lite', 'gemini-2.0-flash-lite', 'gemini-2.0-flash', 'gemini-1.5-flash'];
    let lastError = null;
    let textReply = '';
    let selectedModel = '';

    for (const modelName of modelCandidates) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });

        const formattedHistory = history.map(item => ({
          role: item.role === 'user' ? 'user' : 'model',
          parts: [{ text: item.content }]
        }));

        const chat = model.startChat({
          history: [
            { role: 'user', parts: [{ text: `System Instruction: ${systemInstruction}` }] },
            { role: 'model', parts: [{ text: 'Understood. JARVIS online and standing by.' }] },
            ...formattedHistory
          ]
        });

        const result = await chat.sendMessage(prompt);
        const response = await result.response;
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
