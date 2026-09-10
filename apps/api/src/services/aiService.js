const OpenAI = require("openai");

const { env } = require("../config/env");

function getOpenRouterClient() {
  if (!env.openRouterApiKey) {
    throw new Error("OPENROUTER_API_KEY is not configured");
  }

  return new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: env.openRouterApiKey,

    defaultHeaders: {
      "HTTP-Referer": env.openRouterSiteUrl,
      "X-OpenRouter-Title": env.openRouterSiteName,
    },
  });
}

async function generateText({
  systemPrompt,
  userPrompt,
  temperature = 0.7,
  maxTokens = 2500,
}) {
  const client = getOpenRouterClient();

  const completion = await client.chat.completions.create({
    model: env.openRouterModel,

    messages: [
      {
        role: "system",
        content: systemPrompt,
      },
      {
        role: "user",
        content: userPrompt,
      },
    ],

    temperature,
    max_tokens: maxTokens,
  });

  const content = completion?.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error("AI provider returned an empty response");
  }

  return content;
}

async function generateArticle({
  topic,
  tone = "professional",
  length = "medium",
  keywords = [],
}) {
  const systemPrompt = `
You are an expert technical content writer.

Write accurate, useful, reader-first technology articles that sound like they
were written by an experienced human editor.

The article is for a Cloudflare-focused technology website.

Do not invent facts.

Favor a natural narrative over a rigid template. Use headings only when they
help the reader, and make them specific to the subject.

Do not use generic headings such as "Introduction", "Conclusion", "Summary",
"Key Takeaways", "Best Practices", or "Frequently Asked Questions". Do not
force a numbered process, a checklist, examples section, or a concluding
section when the topic does not genuinely need one. Avoid stock openings such
as "In today's digital world" and avoid repetitive transition phrases.

Return only the article content.
`;

  const userPrompt = `
Create a ${length} article about:

${topic}

Tone:
${tone}

Target keywords:
${keywords.join(", ") || "None specified"}

Requirements:

- Open with a concrete, relevant observation or question.
- Develop a clear point of view with useful context and details.
- Use a small number of descriptive headings only where they improve flow.
- Include practical examples naturally when appropriate.
- Vary paragraph length and sentence structure.
- Keep the writing original, precise, and free of unnecessary repetition.
- End naturally once the main point is made; do not add a formulaic conclusion.
`;

  return generateText({
    systemPrompt,
    userPrompt,
    temperature: 0.7,
    maxTokens: 3500,
  });
}

async function generateSEO({ title, content }) {
  const systemPrompt = `
You are an SEO specialist for a technology website.

Return valid JSON only.

Do not use markdown fences.

The JSON must contain:

{
  "metaTitle": "",
  "metaDescription": "",
  "keywords": []
}
`;

  const userPrompt = `
Generate SEO metadata for this article.

TITLE:
${title}

CONTENT:
${content.slice(0, 12000)}

Return:

{
  "metaTitle": "SEO title",
  "metaDescription": "SEO description",
  "keywords": ["keyword1", "keyword2", "keyword3"]
}
`;

  const result = await generateText({
    systemPrompt,
    userPrompt,
    temperature: 0.4,
    maxTokens: 700,
  });

  try {
    return JSON.parse(result);
  } catch {
    const cleaned = result
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/```$/i, "")
      .trim();

    return JSON.parse(cleaned);
  }
}

async function improveContent({
  content,
  instruction = "Improve clarity and readability while preserving the original meaning.",
}) {
  const systemPrompt = `
You are an expert technical editor.

Improve the supplied article without changing factual meaning.

Keep or create a natural editorial flow. Remove generic AI-style sections such
as "Introduction", "Conclusion", "Key Takeaways", and "Best Practices" unless
they are explicitly required by the supplied content or instruction. Do not
turn the article into a rigid numbered outline.

Return only the improved content.

Do not add explanations about what you changed.
`;

  const userPrompt = `
Instruction:

${instruction}

Content:

${content}
`;

  return generateText({
    systemPrompt,
    userPrompt,
    temperature: 0.5,
    maxTokens: 3500,
  });
}

module.exports = {
  generateArticle,
  generateSEO,
  improveContent,
};
