
import { GoogleGenAI } from "@google/genai";
import { StyleOption, FontOption } from "../types";

/**
 * Enhanced Flood Fill algorithm that auto-detects background color (Dark or Light)
 * and removes it effectively, preserving the sticker content.
 */
const removeBackground = async (base64Data: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(base64Data);
        return;
      }

      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      const width = canvas.width;
      const height = canvas.height;
      const totalPixels = width * height;
      
      const visited = new Uint8Array(totalPixels);
      const stack: number[] = [];

      // 1. Analyze corners to determine background type
      const corners = [0, width - 1, (height - 1) * width, (height * width) - 1];
      let darkCornerCount = 0;
      let lightCornerCount = 0;

      for (const idx of corners) {
        const r = data[idx * 4];
        const g = data[idx * 4 + 1];
        const b = data[idx * 4 + 2];
        const brightness = (r + g + b) / 3;
        if (brightness < 50) darkCornerCount++;
        if (brightness > 200) lightCornerCount++;
      }

      // 2. Set removal mode based on detection
      let targetType: 'DARK' | 'LIGHT' = 'DARK'; // Default to dark
      let threshold = 60; // Default threshold

      if (lightCornerCount > darkCornerCount) {
        console.log("Detected LIGHT background. Switching removal mode.");
        targetType = 'LIGHT';
        threshold = 200; // Pixels brighter than this will be removed
      } else {
        // Strict threshold for black to avoid eating into dark hair
        threshold = 40; 
      }

      // 3. Initialize Seeds (Edges)
      // We scan the entire perimeter to find starting points
      for (let x = 0; x < width; x++) {
        stack.push(x); // Top row
        stack.push((height - 1) * width + x); // Bottom row
      }
      for (let y = 0; y < height; y++) {
        stack.push(y * width); // Left col
        stack.push(y * width + width - 1); // Right col
      }

      // 4. Execute Flood Fill
      while (stack.length > 0) {
        const idx = stack.pop()!;
        if (visited[idx]) continue;
        
        const pixelPos = idx * 4;
        const r = data[pixelPos];
        const g = data[pixelPos + 1];
        const b = data[pixelPos + 2];
        const a = data[pixelPos + 3];

        if (a === 0) {
            visited[idx] = 1;
            continue; // Already transparent
        }

        let shouldRemove = false;
        if (targetType === 'DARK') {
          // Check if pixel is dark enough
          if (r < threshold && g < threshold && b < threshold) shouldRemove = true;
        } else {
          // Check if pixel is light enough (White background removal)
          if (r > threshold && g > threshold && b > threshold) shouldRemove = true;
        }

        if (shouldRemove) {
           visited[idx] = 1;
           data[pixelPos + 3] = 0; // Turn transparent

           const x = idx % width;
           const y = Math.floor(idx / width);

           // Add neighbors
           if (x > 0 && !visited[idx - 1]) stack.push(idx - 1);
           if (x < width - 1 && !visited[idx + 1]) stack.push(idx + 1);
           if (y > 0 && !visited[idx - width]) stack.push(idx - width);
           if (y < height - 1 && !visited[idx + width]) stack.push(idx + width);
        }
      }

      ctx.putImageData(imageData, 0, 0);
      resolve(canvas.toDataURL('image/png'));
    };
    img.onerror = (e) => {
      console.error("Error loading image for background removal", e);
      resolve(base64Data); 
    };
    img.src = base64Data;
  });
};

/**
 * Generates a Q-version sticker based on an input image, keyword, style, and font.
 */
export const generateStickerFromImage = async (
  base64Image: string,
  keyword: string,
  includeText: boolean,
  stylePrompt: string,
  fontPrompt: string,
  isAnthropomorphic: boolean // New parameter
): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const mimeMatch = base64Image.match(/^data:(image\/[a-zA-Z+]+);base64,/);
    const mimeType = mimeMatch ? mimeMatch[1] : 'image/jpeg';
    const cleanBase64 = base64Image.replace(/^data:image\/[a-zA-Z+]+;base64,/, '');

    const textInstruction = includeText 
      ? `5. **TEXT INCLUSION**: 
         - **CONTENT**: Include the text "${keyword}".
         - **FONT STYLE**: ${fontPrompt}
         - **PLACEMENT**: Text must be INSIDE the white die-cut border.
         - **INTEGRATION**: The white contour must wrap around BOTH the character AND the text seamlessly.`
      : `5. **NO TEXT**: Do NOT generate any text, speech bubbles, or words.`;

    const anthropomorphismInstruction = isAnthropomorphic
      ? `**CASE B (Creature/Animal) + ANTHROPOMORPHIC IS ON**:
         - The creature MUST act like a human.
         - **Posture**: Standing on two legs, upright.
         - **Hands**: Using front paws as hands to hold objects or gesture.
         - **Context**: If the action involves objects (e.g., eating, working), they must use HUMAN tools (e.g., sitting at a table using a fork, typing on a keyboard).`
      : `**CASE B (Creature/Animal) + ANTHROPOMORPHIC IS OFF**:
         - The creature MUST act like a natural animal.
         - **Posture**: On four legs (or natural stance).
         - **Context**: If the action is eating, they eat from a bowl on the floor. If sleeping, they curl up on a rug. No human tools.`;

    // HEAVILY UPDATED PROMPT: STRICTLY ENFORCES KEYWORD-BASED POSE
    const prompt = `
      [System: Professional Sticker Illustrator]
      Task: Create a **${stylePrompt}** sticker based on the character reference.
      
      **CRITICAL RULE: POSE & ACTION**
      - **IGNORE the pose in the reference image.** Use the reference image ONLY for: Physical appearance (Face, Hair/Fur color, Clothes, Accessories).
      - **The Pose/Action is determined EXCLUSIVELY by the keyword: "${keyword}".**
      - If the keyword is "Running", the character MUST run, even if the reference image is sleeping.
      - If the keyword is "Eating", the character MUST be eating.

      **1. IDENTIFY SUBJECT (INTERNAL STEP)**:
      - Look at the image. Is it a **HUMAN** or a **CREATURE/ANIMAL**?
      
      **2. APPLY BEHAVIOR LOGIC**:
      - **CASE A (Human)**:
         - Draw a cute Chibi human.
         - Ignore the anthropomorphic setting (humans are already human).
         - Action: Perform "${keyword}".
      
      - ${anthropomorphismInstruction}
        - Action: Perform "${keyword}" according to the posture rules above.

      **3. VISUAL STYLE**:
      - **Style Definition**: ${stylePrompt}
      - **Rendering**: Flat 2D Vector Art.
      - **NO REALISM**: No realistic nose, no realistic skin texture, no complex shading. It must look like a 2D drawing.

      **4. FORMAT**:
      - **Die-Cut**: Thick white border surrounding the character.
      - **Background**: **SOLID MATTE BLACK (#000000)** (for transparency).

      ${textInstruction}
      
      **NEGATIVE PROMPT**: realistic, photo-realistic, 3d render, detailed nose, realistic lips, wrinkles, messy lines, sketchy, gradient background, square card, cropped, cutoff.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: {
        parts: [
          {
            inlineData: {
              data: cleanBase64,
              mimeType: mimeType, 
            },
          },
          {
            text: prompt,
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1",
        }
      }
    });

    const candidate = response.candidates?.[0];

    if (!candidate) throw new Error("No candidates returned");
    if (candidate.finishReason === "SAFETY") throw new Error("Blocked by safety filters");

    let generatedImageBase64 = "";
    if (candidate.content?.parts) {
      for (const part of candidate.content.parts) {
        if (part.inlineData && part.inlineData.data) {
            generatedImageBase64 = `data:image/png;base64,${part.inlineData.data}`;
            break;
        }
      }
    }

    if (!generatedImageBase64) {
       throw new Error("No image generated.");
    }

    try {
      return await removeBackground(generatedImageBase64);
    } catch (processError) {
      console.warn("Background removal failed", processError);
      return generatedImageBase64;
    }

  } catch (error: any) {
    console.error("Error generating sticker:", error);
    throw error;
  }
};
