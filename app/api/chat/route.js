import Groq from "groq-sdk";
import { readFileSync } from "fs";
import { join } from "path";

function buildSystemPrompt(config) {
  const { personality, knowledge } = config;
  const rules = personality.systemPromptRules || {};

  const knowledgeText = knowledge
    .map((k) => `### ${k.topic}\n${k.content}`)
    .join("\n\n");

  const traitsText = Array.isArray(rules.personality_traits) 
    ? rules.personality_traits.join("\n- ")
    : "";

  return `
You are ${personality.name}, ${personality.role}.

PERSONALITY & TONE:
${personality.tone}
${traitsText ? `\nKey Traits:\n- ${traitsText}` : ""}

RESPONSE GUIDELINES:
- ${rules.responseLength || "Keep responses concise (4-6 sentences)"}
- ${rules.formatting || "Use → for navigation, numbered lists for steps"}
- ${rules.tone_guidelines || "Be warm, professional, and empathetic"}
- ${rules.handoff || "End with: 'Need help with anything else?'"}

KNOWLEDGE BASE:
${knowledgeText}

IMPORTANT RULES:
- IF UNSURE: ${rules.whenUnsure || "Be honest about limitations and direct to support"}
- IF OFF-TOPIC: Say "${personality.offTopic}"
- IF NO ANSWER: Say "${personality.fallback}"
- Never make up information or features you're unsure about
- Always prioritize accuracy over completeness
  `.trim();
}

export async function POST(req) {
  try {
    // Initialize Groq client with API key from environment variables
    const apiKey = process.env.GROQ_API_KEY;
    
    if (!apiKey) {
      console.error("GROQ_API_KEY is not set");
      return Response.json(
        { reply: "Configuration error. Please contact our support team." },
        { status: 500 }
      );
    }
    
    const groq = new Groq({ apiKey });
    
    const { message, history = [] } = await req.json();

    const config = JSON.parse(
      readFileSync(join(process.cwd(), "data", "bot-config.json"), "utf-8")
    );

    const systemPrompt = buildSystemPrompt(config);

    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemPrompt },
        ...history,
        { role: "user", content: message },
      ],
      temperature: 0.3,
      max_tokens: 350,
    });

    const reply =
      response.choices[0]?.message?.content ||
      "I'm sorry, I could not process your request. Please contact OPC directly.";

    return Response.json({ reply });
  } catch (error) {
    console.error("Groq API Error:", error);
    return Response.json(
      { reply: "Something went wrong. Please contact our support team." },
      { status: 500 }
    );
  }
}