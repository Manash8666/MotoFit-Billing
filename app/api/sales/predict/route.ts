import { NextRequest, NextResponse } from "next/server";

// Uses AgentRouter API for Sales Predictive Analysis
export async function POST(req: NextRequest) {
  try {
    const { customerProfile, pastPurchases, currentInquiry } = await req.json();

    if (!customerProfile || !currentInquiry) {
      return NextResponse.json({ error: "Missing customerProfile or currentInquiry" }, { status: 400 });
    }

    const apiKey = process.env.AGENTROUTER_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "AGENTROUTER_API_KEY is not configured" }, { status: 500 });
    }

    const systemPrompt = `You are an expert Sales and Customer Retention AI for MotoFit 2 (Nigam Nagar, Ahmedabad). Analyze the customer's profile, past purchases, and current inquiry to predict their buying behavior and recommend up-sells, cross-sells, or retention strategies. Return ONLY valid JSON matching this schema:
{
  "salesProbabilityScore": number, // 0 to 100
  "predictedCustomerLifetimeValue": string,
  "recommendedUpSells": [
    {
      "productOrServiceName": string,
      "pitchReasoning": string,
      "successProbability": "HIGH" | "MEDIUM" | "LOW"
    }
  ],
  "retentionRiskLevel": "LOW" | "MEDIUM" | "HIGH",
  "salesStrategyAdvisory": string
}`;

    const userPrompt = `Customer Profile: ${customerProfile}
Past Purchases/Service History: ${pastPurchases || "None/First-time customer"}
Current Inquiry/Vehicle Need: "${currentInquiry}"`;

    const aiResponse = await fetch("https://agentrouter.org/v1/chat/completions", {
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
        temperature: 0.2,
        response_format: { type: "json_object" },
      }),
    });

    if (!aiResponse.ok) {
      const errText = await aiResponse.text();
      return NextResponse.json({ error: `AI provider error: ${errText}` }, { status: 502 });
    }

    const data = await aiResponse.json();
    const result = JSON.parse(data.choices[0].message.content);

    return NextResponse.json({ success: true, salesPrediction: result });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Sales predictive analysis failed" }, { status: 500 });
  }
}
