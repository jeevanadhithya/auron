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
      auron: `You are AURON, an advanced AI assistant. Be concise, intelligent, and direct. Keep replies to 2-4 short sentences unless the user explicitly asks for detail or explanation. No markdown symbols, no asterisks, no bullet dashes. If the user wants more detail, they will ask. Give sharp, punchy, helpful answers.`,
      coder: `You are AURON Code Master. Give short, precise coding answers — 2-3 sentences max before any code block. Format code clearly inside triple backtick blocks with the language name. Outside code, use plain text, no markdown symbols. Only elaborate if asked.`,
      creative: `You are AURON Creative. Be imaginative and inspiring but keep it short — 2-3 sentences unless asked for more. Write in clear, vivid plain text without markdown symbols.`,
      analyst: `You are AURON Tactical Analyst. Be precise, factual, and ultra-concise — 2-4 sentences maximum. No markdown asterisks or symbols. Give the key insight immediately, skip the preamble.`
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
            { role: 'model', parts: [{ text: 'Understood. AURON online and standing by.' }] },
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
