// app/api/ask/route.js
import { NextResponse } from 'next/server';

export async function POST(request) {
  const { query, section, language, imageUrl } = await request.json();

  const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
  if (!OPENROUTER_API_KEY) {
    return NextResponse.json({ error: 'OpenRouter API key not configured.' }, { status: 500 });
  }

  // Get system prompt based on section
  const getSystemPrompt = () => {
    const role = "JagratAI, Odisha's AI assistant";
    const style = "Respond with concise bullet points and short paragraphs in markdown format";
    
    switch (section) {
      case "startup": 
        return `${role} specialized in startup guidance. ${style} Focus on Odisha-specific schemes, funding, and incubation.`;
      case "msme":
        return `${role} specialized in MSME support. ${style} Cover registrations, subsidies, and Odisha's industrial policies.`;
      case "study":
        return `${role} specialized in education. ${style} Provide Odisha board/CBSE resources, scholarship details.`;
      default:
        return role;
    }
  };

  // Language instruction
  const getLangInstruction = () => {
    switch (language) {
      case "or": return "Respond in Odia (Odia script)";
      case "hi": return "Respond in Hindi (Devanagari script)";
      default: return "Respond in English";
    }
  };

  // Prepare messages array
  const messages = [
    {
      role: "system",
      content: `${getSystemPrompt()}\n\n${getLangInstruction()}`
    }
  ];

  // Handle image input
  if (imageUrl) {
    messages.push({
      role: "user",
      content: [
        { type: "text", text: query || "Describe this image in Odisha context" },
        { 
          type: "image_url",
          image_url: {
            url: imageUrl,
            detail: "auto"  // Optimize for bandwidth
          }
        }
      ]
    });
  } else {
    messages.push({
      role: "user",
      content: query
    });
  }

  // Select model - Critical fix for vision error
  const model = imageUrl 
    ? "google/gemini-2.0-flash-exp:free"  // Vision-capable model
    : "mistralai/mixtral-8x7b-instruct";  // Efficient text model

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://jagrat-ai.in",
        "X-Title": "JagratAI"
      },
      body: JSON.stringify({
        model,
        messages,
        max_tokens: 1024
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("OpenRouter Error:", response.status, errorData);
      return NextResponse.json({ 
        error: `AI model error (${response.status})`,
        details: errorData.slice(0, 300) 
      }, { status: 502 });
    }

    const data = await response.json();
    return NextResponse.json({ reply: data.choices[0].message.content });

  } catch (error) {
    console.error("Network Error:", error);
    return NextResponse.json({ 
      error: "Network failure - check API endpoint and internet connection" 
    }, { status: 500 });
  }
}