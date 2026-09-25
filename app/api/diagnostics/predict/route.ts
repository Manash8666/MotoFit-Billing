import { NextRequest, NextResponse } from "next/server";

// Uses Groq's high-speed free-tier API (Llama 3.3 70B)
export async function POST(req: NextRequest) {
  try {
    const { makeModel, runningKm, complaints } = await req.json();

    if (!makeModel || !complaints) {
      return NextResponse.json({ error: "Missing makeModel or complaints" }, { status: 400 });
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "GROQ_API_KEY is not configured" }, { status: 500 });
    }

    const systemPrompt = `You are the chief master technician at MotoFit 2 (Nigam Nagar, Ahmedabad). Analyze vehicle intake symptoms and provide structured diagnostic assessments for two-wheelers in India. Return ONLY valid JSON matching this schema:
{
  "diagnosticSummary": string,
  "probableCauses": string[],
  "recommendedParts": [
    {
      "partName": string,
      "oemOrAftermarket": string,
      "estimatedQty": string,
      "urgency": "MANDATORY" | "RECOMMENDED" | "OPTIONAL"
    }
  ],
  "estimatedLaborHours": number,
  "inspectionCheckpoints": string[],
  "technicianAdvisoryNote": string
}`;

    const userPrompt = `Vehicle: ${makeModel}
Running Kilometers: ${runningKm || "Unknown"}
Complaints Logged by Mechanic/Customer: "${complaints}"`;

    const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.1,
        response_format: { type: "json_object" },
      }),
    });

    if (!groqResponse.ok) {
      const errText = await groqResponse.text();
      return NextResponse.json({ error: `AI provider error: ${errText}` }, { status: 502 });
    }

    const data = await groqResponse.json();
    const result = JSON.parse(data.choices[0].message.content);

    return NextResponse.json({ success: true, diagnosis: result });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Diagnostic failed" }, { status: 500 });
  }
}
