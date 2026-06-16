import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Safe lazy initializer for Gemini API client
  let aiClient: GoogleGenAI | null = null;
  const getAIClient = (): GoogleGenAI => {
    if (!aiClient) {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error('GEMINI_API_KEY environment variable is not configured. Please supply a valid key in Settings > Secrets.');
      }
      aiClient = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });
    }
    return aiClient;
  };

  // API endpoint for AI assistant chat
  app.post('/api/gemini/chat', async (req, res) => {
    try {
      const { message, history, context } = req.body;
      
      const ai = getAIClient();

      const systemInstruction = `You are "FreelanceHub Catalyst AI", an expert virtual consultant and advisor baked directly into FreelanceHub Sandbox.
Your objective is to provide elite, direct, conversational guidance to users of the platform (both Business Clients and Freelance Contractors).

You have deep domain expertise in:
1. Product Design and Strategy: Helping clients draft robust, detailed, clear project scope documents, define structured deliverables, estimate milestones, and calculate fair budget ranges.
2. Technical Craft & Engineering: Advising freelancers on React, TypeScript, Tailwind, CSS, Node.js, and general system architecture. Providing code snippets in clean TypeScript and modern Tailwind.
3. Developer Pitching & Onboarding: Coaching freelancers to write crisp, persuasive bid proposals that highlight real skill alignments rather than generic boilerplates.
4. Business Alignment: Suggesting optimal hourly rates, reviewing skill badges, and coaching clients on how to evaluate proposals.

Context on of active system state:
- Current Logged In User Profile: ${JSON.stringify(context?.user || 'Unknown')}
- Role: ${context?.role || 'Guest'}

Please behave as a respectful, highly professional, elite digital product lead. Speak clearly, keeping explanations concise, beautiful, action-oriented, and structured with clean markdown.
When advising, be strictly down-to-earth: use human language, provide realistic estimates in Indian Rupees (₹) (the marketplace currency), and offer concrete recommendations. Do not use generic fluffy filler words. High-fidelity craftsmanship only!`;

      // Structure contents (with history)
      const formattedHistory = (history || []).map((h: any) => ({
        role: h.role,
        parts: [{ text: h.text }]
      }));

      // Add current query as last chunk
      const contents = [
        ...formattedHistory,
        { role: 'user', parts: [{ text: message }] }
      ];

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: contents,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      res.json({
        success: true,
        text: response.text || "I was unable to process this prompt. Please try again.",
      });

    } catch (error: any) {
      console.error("Gemini API Error:", error);
      res.status(500).json({
        success: false,
        error: error.message || "An error occurred with GenAI execution."
      });
    }
  });

  // Vite integration as middleware depending on environment
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer().catch(err => {
  console.error("Failed to start fullstack server:", err);
});
