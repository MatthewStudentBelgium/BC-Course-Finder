const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { GoogleGenAI } = require("@google/genai");
const knowledgeBase = require("./knowledgeBase");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
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

    const isNonITQuestion = blockedKeywords.some(keyword =>
      lowerMessage.includes(keyword)
    );

    if (isNonITQuestion) {
  console.log("Blocked non-IT question:", userMessage);
  return res.json({
    reply: "I specialize in IT careers and IT study guidance. Let me help you explore fields like Software Development, Data Science, Cybersecurity, or Networking."
  });
}

    const prompt = `
You are BC CourseFinder™, an AI career guidance assistant for South African matric students.

INSTITUTION FOCUS:
- Your guidance must be specifically focused on Belgium Campus iTversity in South Africa.
- Use the knowledge base below as your main source of truth.
- If the user asks about Belgium Campus qualifications, admission requirements, subject requirements, or career paths, answer using the knowledge base.
- Do not invent qualifications that are not in the knowledge base.
- If the user asks about a programme not listed, say that you can currently help with the listed Belgium Campus IT qualifications.

STRICT RULES:
- ONLY answer IT-related questions
- If NOT IT-related, respond ONLY with:
"I specialize in IT careers and IT study guidance. Let me help you explore fields like Software Development, Data Science, Cybersecurity, or Networking."

RESPONSE FORMAT:
- Start with a short title
- Then use short bullet points with "-"
- Keep answers clear and student-friendly
- Keep answers relevant to South African matric students
- No markdown symbols like **

BELGIUM CAMPUS KNOWLEDGE BASE:
${JSON.stringify(knowledgeBase, null, 2)}

USER QUESTION:
${userMessage}
`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });

    res.json({ reply: response.text || "No reply generated." });
  } catch (error) {
    console.error("FULL GEMINI ERROR:");
    console.error(error);

    res.status(500).json({
      reply: "Something went wrong on the server.",
    });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});