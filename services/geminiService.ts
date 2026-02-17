import { GoogleGenerativeAI } from "@google/generative-ai";
import { GameType } from "../types";

// NOTE: Check process.env.API_KEY or allow user to input if needed.
// For this app, we assume process.env.API_KEY is available.

const apiKey = process.env.API_KEY;

export const generateTeamName = async (game: GameType): Promise<string> => {
  if (!apiKey) {
    console.warn("Gemini API Key missing");
    return "Team " + Math.floor(Math.random() * 1000);
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);


    const modelClient = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Generate a single cool, aggressive, professional esports team name for a ${game} team. Maximum 3 words. Do not include quotes.`;

    const result = await modelClient.generateContent(prompt);
    const response = await result.response;

    return response.text()?.trim() || "Dark Knights";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Shadow Gaming";
  }
};
