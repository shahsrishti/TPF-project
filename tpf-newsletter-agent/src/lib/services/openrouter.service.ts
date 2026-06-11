import OpenAI from 'openai';

// Switched to official OpenAI models via OpenRouter
const PRIMARY_MODEL = 'openai/gpt-4o-mini';
const FALLBACK_MODEL = 'openai/gpt-4o';

/**
 * OpenRouter Provider Abstraction Layer
 * Automatically falls back to the secondary model if the primary model fails.
 */
export async function generateAIResponse(
  systemPrompt: string,
  userPrompt: string,
  requireJson: boolean = false
): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error('OPENROUTER_API_KEY is not set in the environment variables.');
  }

  // OpenRouter is compatible with the OpenAI SDK
  const openai = new OpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey: apiKey,
  });

  const makeRequest = async (model: string) => {
    const response = await openai.chat.completions.create({
      model: model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      // OpenRouter supports structured JSON if the model supports it, 
      // but strictly passing response_format works best on supported models.
      ...(requireJson ? { response_format: { type: 'json_object' } } : {})
    });

    return response.choices[0]?.message?.content || '';
  };

  try {
    // Attempt Primary Model
    return await makeRequest(PRIMARY_MODEL);
  } catch (error: any) {
    console.warn(`Primary model (${PRIMARY_MODEL}) failed. Falling back to ${FALLBACK_MODEL}... Error: ${error.message}`);
    
    // Attempt Fallback Model
    try {
      return await makeRequest(FALLBACK_MODEL);
    } catch (fallbackError: any) {
      console.error(`Fallback model (${FALLBACK_MODEL}) also failed. Error: ${fallbackError.message}`);
      // Throw the original error or the fallback error depending on strictness. We throw fallback.
      throw new Error(`AI Providers exhausted. Last error: ${fallbackError.message}`);
    }
  }
}
