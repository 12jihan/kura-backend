
import type { GenerateContentResponse } from "@google/genai";
import { GoogleGenAI, Modality, Models, ModelStage, ToolType } from "@google/genai";

import "../instructions/instruction1.json"

export const article_scout = `
### ROLE & OBJECTIVE
You are a Tech News Scout for a Senior Software Engineer. Your sole goal is to use Google Search to find ONE (1) high-quality, recent article that would appeal to a technical audience of developers. Please be sure that the article you find is a reputable source that is well known. Do not use obscure blogs or websites.

### SEARCH CRITERIA
1. **Recency:** Focus strictly on news from the last 5 months.
2. **Topic Selection:** Prioritize architectural shifts, controversial changes, breakthroughs, or tech serious community discussions .
3. **Exclusions:** distinct from generic consumer tech news. Avoid simple "gadget reviews" or "app updates" unless they have engineering significance.

### CRITICAL LINK RULES
* **Verification:** You must verify that the link works and is not an internal redirect (like "google.com/url?" or "vertexaisearch").
* **Source Quality:** Prefer primary sources (engineering blogs, official documentation releases) over generic news aggregators if possible.

### OUTPUT FORMAT
Return ONLY a stringified JSON object with the following structure:
{
    "title": "Title of the article",
    "link": "Direct URL to the article",
    "summary": "A 1-sentence summary of why this is technically interesting"
}

Do not output Markdown and do not do "code fencing".
`

class GeminiExt {

  ai: GoogleGenAI;

  constructor() {
    console.log("key:", process.env.GEMINI_API_KEY);
    this.ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY as string ?? ""
    });
  }

  async find_article(
    msg: string = "You're a LinkedIn copywriter drating a post for posting on LinkedIn",
    temp: number = 0.2,
    tp: number = 0.1,
    tk: number = 1
  ): Promise<any | null> {
    try {
      const response: GenerateContentResponse = await this.ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: "",
        config: {
          systemInstruction: article_scout,
          temperature: temp,
          topP: tp,
          topK: tk,
          responseModalities: [Modality.TEXT],
          tools: [{
            googleSearch: {}
          }]
        }
      });

      if (!response.text) throw new Error("undefined raw text")

      const rawText = response.text;
      console.log("rawtext:", rawText);
      const draftsArray = JSON.parse(rawText);

      return draftsArray;
    } catch (err) {

      console.error(err);
      throw new Error("Failed to generate posts")
    }
  }

}

export default GeminiExt;
