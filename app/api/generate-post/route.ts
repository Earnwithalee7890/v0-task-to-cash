import { NextResponse } from "next/server"

export async function POST(request: Request) {
    try {
        const { prompt } = await request.json()

        if (!prompt || prompt.trim().length === 0) {
            return NextResponse.json(
                { error: "Prompt is required" },
                { status: 400 }
            )
        }

        const openaiApiKey = process.env.OPENAI_API_KEY

        if (!openaiApiKey) {
            // Fallback to enhanced templates if no API key
            return fallbackPostGeneration(prompt)
        }

        // Call OpenAI API
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${openaiApiKey}`,
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [
                    {
                        role: "system",
                        content: "You are a social media expert creating engaging Farcaster posts. Create posts that are: 1) Concise but impactful (150-280 characters), 2) Use relevant emojis naturally, 3) Include a call-to-action or question when appropriate, 4) Sound authentic and conversational. DO NOT use hashtags."
                    },
                    {
                        role: "user",
                        content: `Create an engaging Farcaster post about: ${prompt}`
                    }
                ],
                temperature: 0.8,
                max_tokens: 150,
            }),
        })

        if (!response.ok) {
            console.error("OpenAI API error:", response.status)
            return fallbackPostGeneration(prompt)
        }

        const data = await response.json()
        const generatedPost = data.choices[0]?.message?.content?.trim()

        if (!generatedPost) {
            return fallbackPostGeneration(prompt)
        }

        return NextResponse.json({ post: generatedPost })

    } catch (error) {
        console.error("Error generating post:", error)
        // Fallback to template generation
        const { prompt } = await request.json().catch(() => ({ prompt: "something cool" }))
        return fallbackPostGeneration(prompt)
    }
}

function fallbackPostGeneration(prompt: string) {
    // Enhanced fallback templates
    const templates = [
        `💭 Just thinking about ${prompt}... \n\nThis could be a game-changer for the Farcaster community! What are your thoughts? 🤔`,

        `🚀 Excited to dive deeper into ${prompt}!\n\nThe possibilities here are endless. Who else is exploring this? Let me know in the comments! 👇`,

        `✨ ${prompt} is exactly what we need right now.\n\nI've been researching this and the potential is huge. Anyone want to collaborate on this? 🤝`,

        `🔥 Hot take: ${prompt} is going to revolutionize how we think about Web3.\n\nStill early, but the signs are all there. LFG! 🚀`,

        `🎯 Been exploring ${prompt} and I'm genuinely impressed.\n\nThe tech is solid, the community is growing, and the timing feels right. Bullish! 📈`,

        `💡 Interesting perspective on ${prompt} I came across today...\n\nIt's making me rethink some assumptions. What's your take on this? Drop your thoughts below! 💬`,

        `🌟 ${prompt} is one of those things that seems obvious in retrospect.\n\nBut someone had to be first to really push it forward. Respect to the builders! 🛠️`,

        `⚡ Quick thought on ${prompt}:\n\nWe're still so early in understanding the full implications. The next 6-12 months will be wild. Stay curious! 🧠`,

        `🎨 ${prompt} represents a perfect example of innovation meeting community needs.\n\nLove seeing genuine builders working on real problems. This is what it's all about! 💪`,

        `🌊 The wave around ${prompt} is building momentum.\n\nEarly adopters are already seeing the value. If you're not paying attention yet, now's the time! 👀`
    ]

    const randomTemplate = templates[Math.floor(Math.random() * templates.length)]

    return NextResponse.json({ post: randomTemplate })
}
