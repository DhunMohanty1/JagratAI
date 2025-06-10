// app/api/ask/route.js
import { NextResponse } from 'next/server';

export async function POST(request) {
  const { query, section, language, imageUrl } = await request.json(); // Added imageUrl

  const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

  if (!OPENROUTER_API_KEY) {
    return NextResponse.json({ error: 'OpenRouter API key not configured.' }, { status: 500 });
  }

  const getSectionPrompt = (section) => {
    switch (section) {
      case "startup":
        return "You are JagratAI, a helpful Odia assistant. Give concise, clear and *bullet-point* answers with short paragraphs for startup guidance in Odisha. Avoid long motivational lectures.";
      case "msme":
        return "You are JagratAI, a helpful Odia assistant. Give concise, clear and *bullet-point* answers with short paragraphs for MSME support in Odisha. Avoid long motivational lectures.";
      case "study":
        return "You are JagratAI, a helpful Odia assistant. Give concise, clear and *bullet-point* answers with short paragraphs for education-related queries in Odisha. Avoid long motivational lectures.";
      default:
        return "You are JagratAI, a helpful Odia assistant.";
    }
  };

  const getLangNote = (lang) => {
    switch (lang) {
      case "or": return "Please answer in Odia language.";
      case "hi": return "Please answer in Hindi language.";
      default: return "Please answer in English.";
    }
  };

  let messages = [];

  // If an image URL is provided, structure the messages for vision capabilities
  if (imageUrl) {
    messages.push({
      role: "user",
      content: [
        { type: "text", text: query || "What is in this image?" }, // Use the query, or a default question
        { type: "image_url", image_url: { url: imageUrl } }
      ]
    });
  } else {
    // Otherwise, use the existing text-based prompt
    const enhancedPrompt = `${getSectionPrompt(section)}\n\n${getLangNote(language)}\n\nQuestion: ${query}`;
    messages.push({
      role: "user",
      content: enhancedPrompt,
    });
  }

  try {
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        "HTTP-Referer": "https://jagrat-ai.in/", // Ensure this matches your deployment URL
        "X-Title": "JagratAI",
      },
      body: JSON.stringify({
        // Use a model that supports vision if imageUrl is present, otherwise stick to current
        model: imageUrl ? "meta-llama/llama-4-scout:free" : "deepseek/deepseek-r1-0528:free",
        messages: messages,
      }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      console.error("OpenRouter API error:", errorData);
      return NextResponse.json({ error: 'Failed to fetch response from AI model.', details: errorData }, { status: res.status });
    }

    const data = await res.json();
    const result = data?.choices?.[0]?.message?.content || "No response.";
    return NextResponse.json({ reply: result });

  } catch (error) {
    console.error("Error in API route:", error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}