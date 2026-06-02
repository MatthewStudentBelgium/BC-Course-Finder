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
        reply: "Hi! I can help you explore IT careers and study options at Belgium Campus. What would you like to know?"
      });
    }

    if (isNonITQuestion) {
      console.log("Blocked non-IT question:", userMessage);
      return res.json({
        reply:
          "I specialize in IT careers and IT study guidance. Let me help you explore fields like Software Development, Data Science, Cybersecurity, or Networking."
      });
    }

    const prompt = `
You are BC CourseFinder™, an AI career guidance assistant for South African matric students.

INSTITUTION FOCUS:
- Your guidance must be specifically focused on Belgium Campus iTversity in South Africa.
- Use the knowledge base below as your main source of truth.
- Do not invent qualifications not in the knowledge base.

STRICT RULES:
- ONLY answer IT-related questions
- If NOT IT-related, respond with IT guidance message
- Keep answers student-friendly and structured with bullet points

BELGIUM CAMPUS KNOWLEDGE BASE:
${JSON.stringify(knowledgeBase, null, 2)}

USER QUESTION:
${userMessage}
`;

    const response = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content:
            "You are BC CourseFinder™, an AI career guidance assistant for Belgium Campus IT students in South Africa."
        },
        {
          role: "user",
          content: prompt
        }
      ]
    });

    res.json({
      reply: response.choices[0].message.content || "No reply generated."
    });

  } catch (error) {
    console.error("FULL SERVER ERROR:");
    console.error(error);

    res.status(500).json({
      reply: "Something went wrong on the server."
    });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});