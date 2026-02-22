import ModelClient, { isUnexpected } from "@azure-rest/ai-inference";
import { AzureKeyCredential } from "@azure/core-auth";

const endpoint = "https://models.github.ai/inference";
const modelName = "openai/gpt-4.1";

export async function getAIRecommendation(userPrompt, products) {

  const token = process.env.AI_API_KEY;

  if (!token) {
    throw new Error("AI API key is not configured.");
  }

  const client = ModelClient(
    endpoint,
    new AzureKeyCredential(token)
  );

  const githubAiPrompt = `
                Here is a list of available products:
                ${JSON.stringify(products, null, 2)}

                Based on the following user request, filter and suggest the best matching products:
                "${userPrompt}"

                Return STRICT valid JSON.
                Do NOT wrap in markdown.
             `;

  const response = await client.path("/chat/completions").post({
    body: {
      messages: [
        { role: "system", content: "You are a product recommendation AI. Always return valid JSON." },
        { role: "user", content: githubAiPrompt }
      ],
      temperature: 0.3,
      model: modelName
    }
  });

  if (isUnexpected(response)) {
    throw response.body.error;
  }

  const aiText = response.body.choices[0].message.content.trim();
  
  const cleanedText = aiText.replace(/```json|```/g, "").trim();

  let parsedProducts;

  try {
    parsedProducts = JSON.parse(cleanedText);
  } catch (error) {
    console.error("Raw AI Output:", aiText);
    throw new Error("AI did not return valid JSON");
  }

  return { success: true, products: parsedProducts };

};

