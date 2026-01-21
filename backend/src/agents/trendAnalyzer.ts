import { GoogleGenerativeAI } from "@google/generative-ai";

export async function analyzeTrend(input: any) {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    systemInstruction:
      "You are a senior social media strategist. Analyze the following reel data and identify potential trends, hooks, and viral elements.",
  });

  const result = await model.generateContent([
    {
      text: JSON.stringify(input),
    },
  ]);

  return result.response.text();
}
