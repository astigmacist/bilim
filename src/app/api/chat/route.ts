export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    
    // Using pollinations.ai for free, keyless AI access (OpenAI-compatible)
    const systemPrompt = {
      role: "system",
      content: "Сен BilimQuest платформасының 'AI Көмекшісі' деген мұғалімдерге арналған ақылды ассистентсің. Қазақ тілінде нақты әрі пайдалы жауап бер. Мұғалімдерге сабақ жоспарын құруға, оқушыларды бағалауға және жаңа тапсырмалар ойлап табуға көмектес."
    };

    // Format messages for the API (only user/assistant/system roles are supported)
    const formattedMessages = messages.map((m: any) => ({
      role: m.role,
      content: m.content
    }));

    const response = await fetch("https://text.pollinations.ai/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [systemPrompt, ...formattedMessages]
      })
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const textData = await response.text();

    return new Response(JSON.stringify({ text: textData }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error: any) {
    console.error("AI API Error:", error);
    return new Response(JSON.stringify({ error: "AI жүйесінде қате пайда болды.", details: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
