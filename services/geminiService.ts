import { GoogleGenAI } from "@google/genai";

const getClient = () => {
    return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

// --- Image Generation ---

export interface ImageGenOptions {
    prompt: string;
    aspectRatio: "1:1" | "3:4" | "4:3" | "9:16" | "16:9";
    resolution: "1K" | "2K" | "4K";
}

export const generateEmbroideryDesign = async (options: ImageGenOptions): Promise<string | null> => {
    try {
        const ai = getClient();
        // Determine model based on resolution request as per guidelines
        // gemini-3-pro-image-preview supports 1K, 2K, 4K
        const model = 'gemini-3-pro-image-preview';

        const response = await ai.models.generateContent({
            model: model,
            contents: {
                parts: [{ text: options.prompt }]
            },
            config: {
                imageConfig: {
                    aspectRatio: options.aspectRatio,
                    imageSize: options.resolution
                }
            }
        });

        for (const part of response.candidates?.[0]?.content?.parts || []) {
            if (part.inlineData) {
                return `data:image/png;base64,${part.inlineData.data}`;
            }
        }
        return null;
    } catch (error) {
        console.error("Image generation error:", error);
        throw error;
    }
};

// --- Thinking Mode (Admin Assistant) ---

export const askBusinessAdvisor = async (query: string): Promise<string> => {
    try {
        const ai = getClient();
        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: query,
            config: {
                thinkingConfig: {
                    thinkingBudget: 32768 // Max budget for detailed business analysis
                }
            }
        });
        return response.text || "I couldn't generate an insight at this time.";
    } catch (error) {
        console.error("Thinking mode error:", error);
        return "Sorry, I encountered an error while analyzing the data.";
    }
};
