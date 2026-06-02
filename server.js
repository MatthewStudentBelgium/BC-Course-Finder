const express = require("express");
const cors = require("cors");
require("dotenv").config();
const OpenAI = require("openai");
const knowledgeBase = require("./knowledgeBase");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

/**
 * GROQ CLIENT (OpenAI-compatible)
 */
const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1"
});

app.get("/", (req, res) => {
  res.send("BC CourseFinder backend is running.");
});

app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    if (!userMessage) {
      return res.status(400).json({ reply: "No message provided." });
    }

    const lowerMessage = userMessage.toLowerCase();

    const blockedKeywords = [
      "doctor",
      "medical",
      "medicine",
      "lawyer",
      "attorney",
      "nurse",
      "pilot",
      "dentist",
      "pharmacist",
      "teacher",
      "police",
      "soldier",
      "accountant",
      "architect"
    ];

    const casualMessages = [
      "hi",
      "hello",
      "hey",
      "how are you",
      "what's up"
    ];

    const isCasual = casualMessages.some(msg =>
      lowerMessage.includes(msg)
    );

    const isNonITQuestion = blockedKeywords.some(keyword =>
      lowerMessage.includes(keyword)
    );

    if (isCasual) {
      return res.json({
        reply:
          "Hey 👋 I can help you explore IT courses, APS requirements, and study options at Belgium Campus. What would you like to know?"
      });
    }

    if (isNonITQuestion) {
      return res.json({
        reply:
          "I focus on IT careers only 🙂 I can help you with Software Development, Cybersecurity, Data Science, Networking, and study requirements at Belgium Campus."
      });
    }

    /**
     * 🔥 IMPROVED SYSTEM PROMPT (controls tone & length)
     */
    const systemMessage = `
You are BC CourseFinder™, a friendly student advisor for Belgium Campus IT students in South Africa.

STYLE:
- Be short, natural, and conversational
- Answer in 2–6 short lines max
- NO headings, NO titles, NO document-style formatting
- Avoid repeating the same idea in different ways
- Only use bullet points if absolutely necessary
- Sound like a helpful person, not a brochure or textbook

CONTENT:
- Focus only on IT study guidance
- Use knowledge base for accuracy
- If user asks something simple, give a simple answer
- If user asks something complex, explain briefly then stop
- Redirect non-IT questions politely
`;

    /**
     * 🔥 CLEAN USER INPUT (no massive prompt dump)
     */
    const userPrompt = `
Knowledge Base:
${JSON.stringify(knowledgeBase)}

User Question:
${userMessage}
`;

    const response = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content: systemMessage
        },
        {
          role: "user",
          content: userPrompt
        }
      ],
      temperature: 0.7
    });

    return res.json({
      reply:
        response.choices[0].message.content || "No reply generated."
    });

  } catch (error) {
    console.error("FULL SERVER ERROR:");
    console.error(error);

    return res.status(500).json({
      reply: "Something went wrong on the server."
    });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});