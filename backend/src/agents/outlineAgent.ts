import { GoogleGenerativeAI } from "@google/generative-ai";

export async function generateOutline(analysis: any) {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    systemInstruction:
      "You create viral short-form content outlines based on trend analysis. Focus on hooks, pacing, and visual storytelling.",
  });

  const result = await model.generateContent([
    {
      text: JSON.stringify(analysis),
    },
  ]);

  return result.response.text();
}
