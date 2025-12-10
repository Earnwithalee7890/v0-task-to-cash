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
                        content: "You are a social media expert creating engaging Farcaster posts. Create posts that are: 1) 200-320 characters long, 2) Use relevant emojis naturally, 3) Include a call-to-action or question, 4) Sound authentic and conversational, 5) Create excitement and engagement. DO NOT use hashtags."
                    },
                    {
                        role: "user",
                        content: `Create an engaging Farcaster post about: ${prompt}`
                    }
                ],
                temperature: 0.9,
                max_tokens: 200,
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
    // 20 diverse, engaging templates
    const templates = [
        // Enthusiastic & Bullish
        `🚀 Just discovered something amazing about ${prompt}!\n\nThe potential here is absolutely massive. Been researching this for weeks and everything points to this being the next big thing. Early adopters are already winning.\n\nWho else is paying attention? 👀`,

        `⚡ ${prompt} is exactly what the space needs right now.\n\nWatched it evolve over the past few months and the growth trajectory is wild. Team is shipping consistently, community is strong, and the tech actually works.\n\nBullish AF! 📈`,

        `🔥 Hot take: ${prompt} will be 10x bigger in 6 months.\n\nEveryone's sleeping on this while the smart money is quietly accumulating. The fundamentals are there, the timing is perfect, and the narrative is building.\n\nYou've been warned! 🎯`,

        `💎 ${prompt} might be the most underrated opportunity in Web3 right now.\n\nSeriously, look at the team, read the docs, join the community. This isn't just hype - real builders are working on real problems. Still early but not for long.\n\nDYOR! 🧠`,

        // Analytical & Thoughtful
        `💭 Been thinking deeply about ${prompt} lately...\n\nWhat started as curiosity turned into genuine conviction. The more you dig, the more sense it makes. Not financial advice, but definitely worth your research time.\n\nWhat's your take? Drop thoughts below! 👇`,

        `📊 Quick analysis on ${prompt}:\n\nThe market is undervaluing this by at least 50%. Compared to competitors with similar tech but 10x the market cap, this is objectively underpriced. Numbers don't lie.\n\nStill early to accumulate! 💰`,

        `🎯 ${prompt} represents a fundamental shift in how we think about innovation.\n\nNot many people understand the implications yet, but those who do are positioning themselves now. This is one of those "obvious in retrospect" moments.\n\nMark my words! ⏰`,

        `🧩 Connecting the dots on ${prompt}:\n\n1. Strong fundamentals ✅\n2. Growing community ✅  \n3. Real use cases ✅\n4. Solid execution ✅\n\nAll the pieces are there. Just needs time to play out. Patience will be rewarded.\n\nWho's holding long-term? 🙌`,

        // Community & Social
        `💬 Can we talk about ${prompt} for a sec?\n\nThe community around this is honestly one of the best I've seen. Smart discussions, helpful people, no toxic vibes. That's usually a great signal.\n\nAnyone else notice this? Let me know! 🤝`,

        `🌟 ${prompt} is proof that good things happen when community comes first.\n\nNo empty promises, just consistent building. No fake hype, just real progress. The vibe is immaculate and the results speak for themselves.\n\nProud to be early! 🙏`,

        `🎨 The culture around ${prompt} is something special.\n\nIt's not just about making gains - people genuinely care about the mission. That kind of alignment is rare and powerful. When you find it, you hold it.\n\nWho's with me? 💪`,

        `👥 ${prompt} has the kind of community that actually ships.\n\nEvery week there's new updates, new features, new wins. This is what sustainable growth looks like. Not a pump and dump, but real long-term value creation.\n\nRespect to the builders! 🛠️`,

        // Educational & Informative
        `📚 Quick thread on why ${prompt} matters:\n\nMost people are missing the bigger picture here. This isn't just another project - it's solving real problems that affect millions. The TAM is huge and we're just scratching the surface.\n\nLet me explain... 🧵`,

        `💡 Something interesting about ${prompt} that most don't know:\n\nThe tech behind this is actually groundbreaking. Solved problems that teams with 100x the funding couldn't crack. That's the kind of innovation that creates generational wealth.\n\nPay attention! 👁️`,

        `🔍 Deep dive into ${prompt}:\n\nSpent the weekend going through everything - whitepaper, GitHub, community channels. Came away incredibly impressed. The attention to detail and long-term thinking is rare.\n\nHappy to answer questions! 💬`,

        `📖 ${prompt} explained simply:\n\nImagine something game-changing but for Web3. That's basically what we're building here. The use case is clear, the execution is solid, and the timing is perfect.\n\nMakes sense now? 🤔`,

        // FOMO & Urgency
        `⏰ Friendly reminder: ${prompt} won't stay this undervalued forever.\n\nLiterally every metric is pointing up and right. Volume increasing, holders growing, development accelerating. When the market realizes, it'll be too late.\n\nNFA but maybe look into it! 🚨`,

        `🎪 Everyone asking "wen moon?" for ${prompt}...\n\nMeanwhile things are literally taking off right now lol. Sometimes the best opportunities are hiding in plain sight. By the time it's trending, you're already late.\n\nDon't say I didn't warn you! ⚠️`,

        `🌊 The ${prompt} wave is building and most people aren't even watching yet.\n\nThis is exactly how every major move starts - quiet accumulation, then sudden explosion. History repeats itself for those who study it.\n\nSet your alerts! 🔔`,

        `💫 ${prompt} is at that perfect inflection point.\n\nNot too early (tech works), not too late (still undervalued). This is the sweet spot where life-changing opportunities are made.\n\nPosition accordingly! ⚡`
    ]

    // Randomly select a template
    const randomTemplate = templates[Math.floor(Math.random() * templates.length)]

    return NextResponse.json({ post: randomTemplate })
}
