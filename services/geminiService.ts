import { GoogleGenAI, Modality, GenerateContentResponse } from "@google/genai";

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const model = 'gemini-2.5-flash-image-preview';

// Helper to convert data URL to a Gemini-compatible format
const dataUrlToGenerativePart = (dataUrl: string) => {
    const [header, data] = dataUrl.split(',');
    const mimeType = header.match(/:(.*?);/)?.[1];
    
    if (!mimeType || !data) {
        throw new Error("Invalid data URL format");
    }

    return {
        inlineData: {
            mimeType,
            data,
        },
    };
};

/**
 * Extracts the first image and any text from the Gemini response.
 */
const extractContentFromResponse = (response: GenerateContentResponse): { image: string | null, text: string | null } => {
    let image: string | null = null;
    const text = response.text || null;

    // Find the first image in the response parts
    for (const candidate of response.candidates ?? []) {
        for (const part of candidate.content?.parts ?? []) {
            if (part.inlineData) {
                const { mimeType, data } = part.inlineData;
                image = `data:${mimeType};base64,${data}`;
                break; // Found one image, we're done with this loop
            }
        }
        if (image) break; // And this one
    }

    return { image, text };
};


export const refineDiagram = async (base64Image: string): Promise<string> => {
    const imagePart = dataUrlToGenerativePart(base64Image);
    const prompt = "Clean up this hand-drawn diagram. Make the lines crisp and clear, remove any smudges or unnecessary marks, and present it as a neat, professional-looking digital drawing. Do not add any new elements or labels unless they are part of the original drawing. The primary output should be the refined image.";

    const response = await ai.models.generateContent({
        model,
        contents: {
            parts: [
                imagePart,
                { text: prompt },
            ],
        },
        config: {
            responseModalities: [Modality.IMAGE, Modality.TEXT],
        },
    });

    const { image, text } = extractContentFromResponse(response);
    
    if (!image) {
        const errorMessage = text
            ? `The AI responded: "${text}"`
            : "No image was found in the AI's response.";
        throw new Error(errorMessage);
    }

    return image;
};

export const editDiagram = async (base64Image: string, userPrompt: string): Promise<string> => {
    const imagePart = dataUrlToGenerativePart(base64Image);

    const response = await ai.models.generateContent({
        model,
        contents: {
            parts: [
                imagePart,
                { text: userPrompt },
            ],
        },
        config: {
            responseModalities: [Modality.IMAGE, Modality.TEXT],
        },
    });
    
    const { image, text } = extractContentFromResponse(response);

    if (!image) {
        const errorMessage = text
            ? `The AI responded: "${text}"`
            : "No image was found in the AI's response.";
        throw new Error(errorMessage);
    }
    
    return image;
};