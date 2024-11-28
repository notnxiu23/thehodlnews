import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: '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',
  dangerouslyAllowBrowser: true
});

// Rate limiting configuration
const RATE_LIMIT = {
  maxRequests: 10, // Maximum requests per window
  windowMs: 60000, // Time window in milliseconds (1 minute)
  requests: [] as number[] // Timestamps of requests
};

function checkRateLimit(): boolean {
  const now = Date.now();
  // Remove old requests outside the window
  RATE_LIMIT.requests = RATE_LIMIT.requests.filter(
    timestamp => now - timestamp < RATE_LIMIT.windowMs
  );
  
  if (RATE_LIMIT.requests.length >= RATE_LIMIT.maxRequests) {
    return false;
  }
  
  RATE_LIMIT.requests.push(now);
  return true;
}

export async function generateArticleSummary(text: string): Promise<string> {
  try {
    if (!checkRateLimit()) {
      throw new Error('Rate limit exceeded. Please try again later.');
    }

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that summarizes cryptocurrency news articles. Keep summaries concise, focused on key points, and maintain a neutral tone."
        },
        {
          role: "user",
          content: `Please provide a concise summary (2-3 sentences) of the following article: ${text}`
        }
      ],
      temperature: 0.7,
      max_tokens: 150
    });

    const summary = response.choices[0]?.message?.content;
    if (!summary) {
      throw new Error('No summary generated');
    }

    return summary;
  } catch (error: any) {
    // Handle specific OpenAI errors
    if (error?.error?.type === 'insufficient_quota') {
      throw new Error('API quota exceeded. Using alternative summarization method.');
    }
    
    if (error?.status === 429) {
      throw new Error('Too many requests. Please try again later.');
    }

    console.error('Error generating summary:', error);
    throw new Error('Failed to generate article summary');
  }
}