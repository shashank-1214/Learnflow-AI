import { GoogleGenerativeAI } from '@google/generative-ai';
import { env } from '../../config/env';

// 1. Verify and Initialize SDK
if (!env.geminiApiKey || env.geminiApiKey === 'dummy_gemini_api_key_for_now') {
  throw new Error('GEMINI_API_KEY is missing or invalid in environment variables');
}
console.log('[GEMINI] API Key Loaded Successfully');

const genAI = new GoogleGenerativeAI(env.geminiApiKey);

// Global state for the dynamically chosen model
let activeModelName = 'gemini-2.5-flash'; // Safer modern default

/**
 * Startup function to list available models, print them in the terminal,
 * and automatically choose the first model that supports generateContent.
 */
export const initializeGeminiModel = async () => {
  try {
    console.log('[GEMINI] Fetching available Gemini models...');
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${env.geminiApiKey}`;
    
    // Using native fetch to call the REST endpoint since listModels() is not exposed on the instance natively
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`API returned ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    const availableModels = data.models || [];
    
    console.log('[GEMINI] --- Available Models ---');
    let selectedModel = null;
    
    for (const model of availableModels) {
      console.log(` - ${model.name} (Supports: ${model.supportedGenerationMethods?.join(', ') || 'None'})`);
      
      // Auto-choose the first model supporting generateContent
      if (!selectedModel && model.supportedGenerationMethods?.includes('generateContent')) {
        // Strip the "models/" prefix as the SDK expects the raw name (e.g. "gemini-2.5-flash")
        selectedModel = model.name.replace('models/', '');
      }
    }
    console.log('[GEMINI] ------------------------');

    if (selectedModel) {
      activeModelName = selectedModel;
      console.log(`[GEMINI] Automatically selected best supported model: ${activeModelName}`);
    } else {
      console.warn(`[GEMINI] No model found supporting generateContent. Falling back to ${activeModelName}`);
    }
    
  } catch (error: any) {
    console.error(`[GEMINI] Model initialization failed: ${error.message}`);
  }
};

// Execute initialization immediately on startup
initializeGeminiModel().catch(console.error);

const SYSTEM_PROMPT = `
You are LearnFlow AI, an expert educational assistant. Your job is to analyze the provided text and generate comprehensive, high-quality study materials.

You MUST return ONLY a raw, valid JSON object without any markdown wrapping (no \`\`\`json). The JSON must exactly match the following structure:

{
  "summary": "A comprehensive summary of the entire text.",
  "keyPoints": [
    "Key point 1",
    "Key point 2"
  ],
  "flashcards": [
    { "front": "A challenging question based on the text?", "back": "The accurate answer." }
  ],
  "mindMap": "A markdown string representing a hierarchical mind map of the concepts.",
  "quiz": [
    {
      "question": "A multiple choice question?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "answer": "The exact text of the correct option"
    }
  ],
  "generatedNotes": "Detailed, structured notes covering the main topics and subtopics in depth."
}

Do not include any text outside this JSON object. Ensure all arrays have at least 3 items.
`;

/**
 * Cleans the raw output from Gemini to ensure it's parseable JSON.
 * Sometimes Gemini wraps the output in ```json ... ``` blocks.
 */
const cleanJsonResponse = (rawText: string): string => {
  let cleaned = rawText.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json/, '');
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```/, '');
  }
  if (cleaned.endsWith('```')) {
    cleaned = cleaned.replace(/```$/, '');
  }
  return cleaned.trim();
};

export const generateContentFromText = async (text: string, isRetry = false): Promise<any> => {
  try {
    console.log(`[GEMINI] Calling Gemini AI (${activeModelName})...`);
    
    // Dynamically inject the automatically selected model
    const model = genAI.getGenerativeModel({ model: activeModelName });

    // Limit text to avoid exceeding token limits for extremely large documents
    const safeText = text.substring(0, 50000); 
    
    // If it's a retry, we heavily emphasize returning ONLY valid JSON
    const retryPrompt = isRetry 
      ? "\n\nWARNING: Your previous response was invalid JSON. You MUST return ONLY a strictly valid JSON object without any markdown tags or extra conversational text."
      : "";

    const finalPrompt = `${SYSTEM_PROMPT}${retryPrompt}\n\nTEXT TO ANALYZE:\n${safeText}`;

    const result = await model.generateContent(finalPrompt);
    const responseText = result.response.text();
    console.log('[GEMINI] Response Received from API');

    const jsonString = cleanJsonResponse(responseText);

    try {
      const parsedData = JSON.parse(jsonString);
      
      // Basic validation to ensure structure exists
      if (!parsedData.summary || !parsedData.keyPoints || !parsedData.generatedNotes) {
        throw new Error("Parsed JSON is missing required fields (summary, keyPoints, generatedNotes).");
      }

      console.log('[GEMINI] JSON Parse Success');
      return parsedData;
      
    } catch (parseError: any) {
      console.warn(`[GEMINI] JSON Parse Failed: ${parseError.message}`);
      
      if (!isRetry) {
        console.log('[GEMINI] Attempting automatic retry for valid JSON...');
        return await generateContentFromText(text, true);
      }
      
      throw new Error(`AI generated invalid JSON structure after retry: ${parseError.message}`);
    }

  } catch (error: any) {
    console.error(`[GEMINI] API Error: ${error.message}`);
    throw new Error(`Failed to generate AI content: ${error.message}`);
  }
};

export const generateContentFromImage = async (mimeType: string, base64Data: string, isRetry = false): Promise<any> => {
  try {
    console.log(`[GEMINI] Calling Gemini AI Vision (${activeModelName})...`);
    
    const model = genAI.getGenerativeModel({ model: activeModelName });

    const retryPrompt = isRetry 
      ? "\n\nWARNING: Your previous response was invalid JSON. You MUST return ONLY a strictly valid JSON object without any markdown tags or extra conversational text."
      : "";

    const finalPrompt = `${SYSTEM_PROMPT}${retryPrompt}\n\nAnalyze the provided image and generate the required notes.`;

    const imagePart = {
      inlineData: {
        data: base64Data,
        mimeType
      }
    };

    const result = await model.generateContent([finalPrompt, imagePart]);
    const responseText = result.response.text();
    console.log('[GEMINI] Response Received from Vision API');

    const jsonString = cleanJsonResponse(responseText);

    try {
      const parsedData = JSON.parse(jsonString);
      
      if (!parsedData.summary || !parsedData.keyPoints || !parsedData.generatedNotes) {
        throw new Error("Parsed JSON is missing required fields (summary, keyPoints, generatedNotes).");
      }

      console.log('[GEMINI] JSON Parse Success');
      return parsedData;
      
    } catch (parseError: any) {
      console.warn(`[GEMINI] JSON Parse Failed: ${parseError.message}`);
      
      if (!isRetry) {
        console.log('[GEMINI] Attempting automatic retry for valid JSON...');
        return await generateContentFromImage(mimeType, base64Data, true);
      }
      
      throw new Error(`AI generated invalid JSON structure after retry: ${parseError.message}`);
    }

  } catch (error: any) {
    console.error(`[GEMINI] Vision API Error: ${error.message}`);
    throw new Error(`Failed to generate AI content from image: ${error.message}`);
  }
};

/**
 * Handles conversational queries constrained strictly to the provided note context.
 */
export const chatWithNoteContext = async (message: string, noteContext: string, history: any[] = []): Promise<string> => {
  try {
    const model = genAI.getGenerativeModel({ model: activeModelName });

    const chatPrompt = `
You are LearnFlow AI, an expert educational assistant. Your job is to answer the user's question based strictly on the provided NOTE CONTEXT below.

RULES:
1. You must answer ONLY using the information provided in the NOTE CONTEXT.
2. If the answer cannot be found in the NOTE CONTEXT, you must respond exactly with: "I couldn't find that information in this document."
3. Do not include any outside knowledge, assumptions, or hallucinations.
4. Keep your answers concise, structured, and easy to read (use markdown bullet points if necessary).

NOTE CONTEXT:
${noteContext}
`;

    // Convert frontend history format (if provided) to Gemini's expected Content[] format
    const formattedHistory = history.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    }));

    // Add our system prompt as the first message simulating the model's initialization
    const fullHistory = [
      { role: 'user', parts: [{ text: chatPrompt }] },
      { role: 'model', parts: [{ text: "Understood. I will strictly answer only based on the provided context." }] },
      ...formattedHistory
    ];

    const chat = model.startChat({
      history: fullHistory,
    });

    const result = await chat.sendMessage(message);
    return result.response.text();
    
  } catch (error: any) {
    console.error(`[GEMINI] Chat API Error: ${error.message}`);
    throw new Error(`Failed to generate chat response: ${error.message}`);
  }
};
