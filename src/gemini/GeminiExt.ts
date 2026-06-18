import type { GenerateContentResponse } from "@google/genai";
import { GoogleGenAI } from "@google/genai";

export default class GeminiExt {

  ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({});
  }

  async find_article(
    msg: string,
    temp: number = 0.2,
    tp: number = 0.1,
    tl: number = 1
  ): Promise<{} | null> {
    try {
      const response: GenerateContentResponse = this.ai.models.generateContent({
        model: "",
        contents: "",
      })
    } catch (err) {

    }


    return null;
  }

}
