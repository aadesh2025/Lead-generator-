import { GoogleGenAI } from "@google/genai";
import { SearchResponse, Lead, GroundingChunk, LeadScore } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateLeads = async (
  niche: string,
  location: string,
  count: number,
  userLat?: number,
  userLng?: number
): Promise<SearchResponse> => {
  
  try {
    const DELIMITER = "---LEAD_ENTRY---";

    const prompt = `
      Act as a Global Business Intelligence Analyst.
      Task: Conduct a deep market sweep to identify ${count} ${niche} businesses in ${location}.
      
      Strategy:
      1. Use **Google Maps** to identify operational businesses.
      2. Use **Google Search** to enrich data (Contact, Social, Reputation).
      3. **ANALYZE** each lead for "Opportunity Score" (0-100) based on their digital maturity (website quality, reviews, social presence).
      
      Requirements:
      - Maximize variety. Don't just pick top rated ones. Find hidden gems.
      - If a business has no website, it is a HIGH OPPORTUNITY lead (needs web services).
      - If a business has bad reviews, it is a HIGH OPPORTUNITY lead (needs reputation management).
      - STRICTLY return exactly ${count} results if available.
      
      Output Format:
      Strictly follow this text format for EACH business, separated by "${DELIMITER}".
      
      ${DELIMITER}
      NAME: [Business Name]
      CATEGORY: [Specific Category]
      ADDRESS: [Full Address]
      CITY: [City Name]
      PHONE: [Phone or "N/A"]
      EMAIL: [Email or "N/A"]
      WEBSITE: [URL or "N/A"]
      SOCIAL: [Social Links or "N/A"]
      RATING: [Rating (e.g. 4.5)]
      REVIEWS: [Review Count (e.g. 120)]
      SCORE: [0-100]
      SCORE_REASON: [Why this score? e.g. "No website, high ratings = High Potential"]
      ANALYSIS: [Brief strategic analysis of their digital footprint]
      
      Limit to ${count} results.
    `;

    // Maps Grounding requires gemini-2.5 series
    const modelName = 'gemini-2.5-flash'; 
    
    const tools = [
      { googleMaps: {} },
      { googleSearch: {} }
    ];

    let toolConfig: any = undefined;
    if (userLat && userLng) {
      toolConfig = {
        retrievalConfig: {
          latLng: {
            latitude: userLat,
            longitude: userLng
          }
        }
      };
    }

    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
        tools,
        toolConfig,
        safetySettings: [
          { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
          { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
          { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
          { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
        ]
      }
    });

    const text = response.text;
    if (!text) throw new Error("AI returned empty response. The query might be too broad.");

    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks as GroundingChunk[] | undefined;
    const leads: Lead[] = [];
    const entries = text.split(DELIMITER).slice(1);

    entries.forEach((entry, index) => {
      const get = (k: string) => {
        const match = entry.match(new RegExp(`${k}:\\s*(.*)`, 'i'));
        return match ? match[1].trim() : undefined;
      };

      const name = get('NAME') || `Unknown Lead ${index}`;
      const scoreVal = parseInt(get('SCORE') || '50');
      const ratingVal = get('RATING');
      const reviewsVal = parseInt(get('REVIEWS') || '0');
      const analysis = get('ANALYSIS') || "No analysis available.";
      const scoreReason = get('SCORE_REASON') || "Standard lead.";

      // Scoring Object
      const score: LeadScore = {
        total: scoreVal,
        label: scoreVal > 75 ? 'Hot' : scoreVal > 40 ? 'Warm' : 'Cold',
        breakdown: {
          digitalPresence: get('WEBSITE') !== 'N/A' ? 80 : 20,
          reputation: ratingVal ? parseFloat(ratingVal) * 20 : 50,
          accessibility: get('PHONE') !== 'N/A' ? 100 : 0
        },
        opportunitySignal: scoreReason
      };

      // Map Matching
      let sourceUrl = get('WEBSITE') !== 'N/A' ? get('WEBSITE') : undefined;
      const mapChunk = chunks?.find(c => c.maps && c.maps.title.toLowerCase().includes(name.toLowerCase()));
      if (mapChunk && mapChunk.maps && !sourceUrl) sourceUrl = mapChunk.maps.uri;

      if (name.length > 1) {
        leads.push({
          id: `lead-${Date.now()}-${index}`,
          name: name.replace(/\*\*/g, ''),
          category: get('CATEGORY') || niche,
          address: get('ADDRESS'),
          city: get('CITY'),
          phone: get('PHONE'),
          email: get('EMAIL'),
          website: get('WEBSITE'),
          socialMedia: get('SOCIAL'),
          rating: ratingVal,
          reviews: reviewsVal,
          status: 'new',
          score,
          analysis,
          notes: '',
          sourceUrl,
          source: 'hybrid',
          createdAt: Date.now(),
          updatedAt: Date.now()
        });
      }
    });

    return {
      summary: text,
      leads: leads,
      groundingChunks: chunks
    };

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    throw new Error(error.message || "Failed to fetch leads.");
  }
};