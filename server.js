const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { GoogleGenAI } = require("@google/genai");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
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

STRICT RULES:
- ONLY answer IT-related questions
- If NOT IT-related, respond ONLY with:
"I specialize in IT careers and IT study guidance. Let me help you explore fields like Software Development, Data Science, Cybersecurity, or Networking."

RESPONSE FORMAT (VERY STRICT):
- Start with a short title (1 line)
- Then ONLY bullet points using "-"
- Each bullet on a new line
- MAXIMUM 6 bullet points total
- NO paragraphs
- NO explanations before bullets
- NO markdown symbols like **

STYLE:
- Simple, clear, student-friendly
- Short and direct

EXAMPLE:
Software Developer Skills:
- Problem-solving
- Logical thinking
- Programming (Python, Java)
- Attention to detail
- Continuous learning

User question:
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