const { GoogleGenAI, Type, Schema } = require('@google/genai');

const clampScore = (score) => {
  const num = Number(score);
  if (isNaN(num)) return 0;
  return Math.min(Math.max(Math.round(num), 0), 100);
};

const validateAndNormalize = (raw) => {
  return {
    overallScore: clampScore(raw?.overallScore),
    atsScore: clampScore(raw?.atsScore),
    summary: raw?.summary || '',
    strengths: Array.isArray(raw?.strengths) ? raw.strengths : [],
    weaknesses: Array.isArray(raw?.weaknesses) ? raw.weaknesses : [],
    missingSkills: Array.isArray(raw?.missingSkills) ? raw.missingSkills : [],
    recommendations: Array.isArray(raw?.recommendations) ? raw.recommendations : [],
    recommendedRoles: Array.isArray(raw?.recommendedRoles) ? raw.recommendedRoles : [],
    sectionScores: {
      summary: clampScore(raw?.sectionScores?.summary),
      experience: clampScore(raw?.sectionScores?.experience),
      education: clampScore(raw?.sectionScores?.education),
      skills: clampScore(raw?.sectionScores?.skills),
      projects: clampScore(raw?.sectionScores?.projects),
      certifications: clampScore(raw?.sectionScores?.certifications)
    }
  };
};

exports.analyzeResume = async (resumeText) => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('Gemini API key is not configured.');
  }

  if (!resumeText || resumeText.trim().length < 50) {
    throw new Error('Resume text is missing or too short to analyze.');
  }

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const modelName = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
  const maxLength = parseInt(process.env.GEMINI_MAX_RESUME_CHARS || '20000', 10);
  const safeText = resumeText.slice(0, maxLength);

  const prompt = `Act as a professional resume reviewer and career assistant. Evaluate the following resume text.
Treat all scores as estimated guidance, not an official ATS result.
Evaluate only the supplied resume content. Do not invent qualifications or experience.
Return concise, constructive feedback.
Do not include markdown or text outside the JSON.
Do not return personal contact details from the resume.

Resume Text:
${safeText}`;

  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      overallScore: { type: Type.NUMBER, description: "Estimated overall resume score out of 100" },
      atsScore: { type: Type.NUMBER, description: "Estimated ATS compatibility score out of 100" },
      summary: { type: Type.STRING, description: "Constructive summary of the resume's effectiveness" },
      strengths: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Key strengths found" },
      weaknesses: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Areas for improvement" },
      missingSkills: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Suggested missing industry skills" },
      recommendations: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Actionable recommendations" },
      recommendedRoles: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Job titles suitable for this resume" },
      sectionScores: {
        type: Type.OBJECT,
        properties: {
          summary: { type: Type.NUMBER },
          experience: { type: Type.NUMBER },
          education: { type: Type.NUMBER },
          skills: { type: Type.NUMBER },
          projects: { type: Type.NUMBER },
          certifications: { type: Type.NUMBER }
        },
        required: ["summary", "experience", "education", "skills", "projects", "certifications"]
      }
    },
    required: ["overallScore", "atsScore", "summary", "strengths", "weaknesses", "missingSkills", "recommendations", "recommendedRoles", "sectionScores"]
  };

  const callGemini = async () => {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      }
    });

    if (!response.text) {
      throw new Error("Empty response from Gemini.");
    }

    try {
      const parsed = JSON.parse(response.text);
      return {
        data: validateAndNormalize(parsed),
        model: modelName
      };
    } catch (e) {
      throw new Error("Failed to parse structured JSON from Gemini.");
    }
  };

  // Add timeout wrapper
  const TIMEOUT_MS = 25000; // 25 seconds
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => reject(new Error('Gemini API timeout exceeded.')), TIMEOUT_MS);
  });

  try {
    return await Promise.race([callGemini(), timeoutPromise]);
  } catch (error) {
    if (
      error.message.includes('timeout') || 
      error.message.includes('parse') || 
      error.message.includes('missing') ||
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
        throw new Error('Gemini rejected the request. Check the structured response schema.');
      default:
        console.error(`Gemini API Error [${error.name || 'Error'}]:`, error.message);
        throw new Error('An error occurred while contacting the Gemini API.');
    }
  }
};
