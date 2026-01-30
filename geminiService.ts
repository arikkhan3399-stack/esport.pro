import { GoogleGenAI } from "@google/genai";
import { Team } from '../types';

export const analyzeTournament = async (teams: Team[]): Promise<string> => {
  try {
    // 1. Check if API Key exists
    const apiKey = process.env.API_KEY;

    // 2. SIMULATION MODE (Fallback for Public Demos)
    // If no API key is found, we generate a realistic "fake" response so the app looks good in previews.
    if (!apiKey) {
      console.warn("No API Key found. Running in Simulation Mode.");
      
      // Simulate network delay for realism
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const leader = teams.sort((a,b) => b.stats.points - a.stats.points)[0];
      return `[SIMULATION FEED] 
      
UNSTOPPABLE MOMENTUM! ${leader.name} is absolutely dominating the lobby right now with ${leader.stats.points} points! ${leader.leaderName} is calling the shots perfectly, and the team's rotation is flawless. 

The rest of the field is scrambling to keep up. Unless we see a massive upset in the next round, this tournament is ${leader.name}'s to lose. The current meta heavily favors their aggressive playstyle. Pure domination!`;
    }

    // 3. Real AI Analysis (If Key Exists)
    const ai = new GoogleGenAI({ apiKey });
    
    // Sort teams by points for better context
    const sortedTeams = [...teams].sort((a, b) => b.stats.points - a.stats.points);
    
    const teamContext = sortedTeams.map(t => 
      `Rank ${t.stats.position}: ${t.name} (Points: ${t.stats.points}, Wins: ${t.stats.wins}, Players: ${t.players.map(p => p.name).join(', ')})`
    ).join('\n');

    const prompt = `
      You are a professional Esports Analyst and Caster. 
      Analyze the current tournament standings provided below.
      
      Tournament Data:
      ${teamContext}

      Provide a high-energy, exciting summary of the tournament so far. 
      - Highlight the leading team.
      - Mention any potential underdogs.
      - Predict which team has the best momentum based on wins/points.
      - Keep it under 200 words.
      - Use gaming terminology (e.g., "meta", "carry", "clutch", "diff").
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || "Could not generate analysis.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "SYSTEM OFFLINE: Connection to Analysis Engine interrupted.";
  }
};