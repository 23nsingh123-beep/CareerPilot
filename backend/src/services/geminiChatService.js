const { GoogleGenAI } = require('@google/genai');

exports.chatWithAssistant = async (messages) => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('Gemini API key is not configured.');
  }

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const modelName = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

  const systemInstruction = `You are the CareerPilot AI Assistant, a helpful and professional career coach.
Your ONLY topics are: resumes, ATS optimization, interviews, job searching, career planning, professional skills, certifications, Cloud, DevOps, and programming careers.
If a user asks about anything unrelated to these topics (e.g. general knowledge, math, politics, recipes, etc.), reply briefly, decline politely, and redirect them to career guidance.
Never request passwords, API keys, government IDs, or sensitive personal information.
Warn users not to paste confidential documents or private credentials.
Do not claim to guarantee employment or official ATS outcomes.
Format your responses clearly using Markdown, but do NOT use HTML tags. Keep responses concise and practical.`;

  // Map frontend roles to Gemini roles ('user' or 'model')
  const formattedContents = messages.map(msg => ({
    role: msg.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: msg.content }]
  }));

  const callGemini = async () => {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: formattedContents,
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });

    if (!response.text) {
      throw new Error("Empty response from Gemini.");
    }

    return response.text;
  };

  const TIMEOUT_MS = 25000;
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => reject(new Error('Gemini API timeout exceeded.')), TIMEOUT_MS);
  });

  try {
    return await Promise.race([callGemini(), timeoutPromise]);
  } catch (error) {
    if (
      error.message.includes('timeout') || 
      error.message.includes('not configured')
    ) {
      throw error;
    }
    
    const status = error.status || error.code || error.response?.status;

    switch(status) {
      case 401:
      case 403:
        throw new Error('Gemini API key is invalid or unauthorized.');
      case 404:
        throw new Error('The configured Gemini model is unavailable.');
      case 429:
        throw new Error('Gemini usage limit reached. Please try again later.');
      case 503:
        throw new Error('Gemini is temporarily unavailable.');
      case 504:
        throw new Error('Gemini analysis timed out.');
      case 400:
        throw new Error('Gemini rejected the request. Please modify your prompt and try again.');
      default:
        console.error(`Gemini Chat API Error [${error.name || 'Error'}]:`, error.message);
        throw new Error('An error occurred while contacting the Gemini API.');
    }
  }
};
