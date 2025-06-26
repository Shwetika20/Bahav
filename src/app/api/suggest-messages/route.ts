import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const prompt = `
You are generating three short, anonymous feedback messages for an NGO named JAL (Jagrukta Abhivridhi Leher).

JAL empowers children through education, meals, and awareness. It was started by two IIM Sirmaur students and is now open for public feedback.

Your task:
Write three **concise**, helpful, and anonymous messages (max 25 words each). These can be:
- Suggestions
- Appreciations
- Constructive criticism
- Ideas for improvement
- Thoughts on outreach, tech, or skill-building

Don’t write questions. Each message should be a full sentence. Avoid repeating ideas.

Output all three messages in a **single string**, separated by '||'. Example:

"Try adding career sessions for teens.||The daily meals initiative is beautiful.||A monthly impact report would build more trust."

Now generate three new messages.
`;



    const apiKey = process.env.GEMINI_API_KEY;
    const geminiEndpoint = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const body = {
      contents: [
        {
          parts: [{ text: prompt }]
        }
      ]
    };

    const response = await fetch(geminiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json({ error }, { status: response.status });
    }

    const data = await response.json();
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response';

    return NextResponse.json({ reply }); // ✅ JSON response

  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
