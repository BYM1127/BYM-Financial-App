const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const parseTransaction = async (rawInput) => {
  const systemInstruction = `You are a specialized financial entity extractor. Extract transactional data from user input into strict JSON. Use context clues to identify the amount, category, merchant, underlying mood trigger (e.g., Essential, Boredom, Stress, Social, Convenience, Treat), and the transaction type (income vs expense). If the user is getting paid or receiving money, it is "income". If they are spending, it is "expense". If currency is omitted, mark as null.`;

  const responseSchema = {
    type: "OBJECT",
    properties: {
      amount: { type: "NUMBER" },
      currency: { type: "STRING", nullable: true },
      category: { type: "STRING" },
      merchant: { type: "STRING", nullable: true },
      mood_tag: { type: "STRING", enum: ["Essential", "Convenience", "Stress", "Social", "Boredom", "Treat"] },
      type: { type: "STRING", enum: ["income", "expense"] }
    },
    required: ["amount", "category", "mood_tag", "type"]
  };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: rawInput,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Gemini API parsing error:", error);
    throw new Error("Failed to parse transaction");
  }
};

module.exports = { parseTransaction };
