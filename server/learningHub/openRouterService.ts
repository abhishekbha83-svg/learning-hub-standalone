/**
 * Server-Side OpenRouter Client Service
 *
 * Provides proxy access to OpenRouter chat completions for the Learning Hub
 * without ever exposing OPENROUTER_API_KEY to the browser / client side.
 */

export interface OpenRouterChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface OpenRouterChatOptions {
  model?: string;
  messages: OpenRouterChatMessage[];
  temperature?: number;
  maxTokens?: number;
}

export interface OpenRouterChatResult {
  success: boolean;
  text?: string;
  model?: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  httpStatus?: number;
  error?: {
    type: 'CONFIGURATION' | 'AUTHENTICATION' | 'MODEL_AVAILABILITY' | 'RATE_LIMIT' | 'PROVIDER_ERROR' | 'NETWORK';
    message: string;
    raw?: any;
  };
}

export const OPENROUTER_DEFAULT_MODEL = 'nvidia/nemotron-3.5-lightning:free';
const OPENROUTER_API_BASE = 'https://openrouter.ai/api/v1';

export function isOpenRouterConfigured(): boolean {
  return Boolean(process.env.OPENROUTER_API_KEY && process.env.OPENROUTER_API_KEY.trim().length > 0);
}

export async function sendOpenRouterChat(options: OpenRouterChatOptions): Promise<OpenRouterChatResult> {
  const apiKey = process.env.OPENROUTER_API_KEY?.trim();

  if (!apiKey) {
    return {
      success: false,
      error: {
        type: 'CONFIGURATION',
        message: 'OPENROUTER_API_KEY is not defined in the server environment.'
      }
    };
  }

  const model = options.model || OPENROUTER_DEFAULT_MODEL;
  const timeoutMs = 75000;

  try {
    const bodyPayload = {
      model,
      messages: options.messages,
      temperature: options.temperature ?? 0.3,
      max_tokens: options.maxTokens || 8192,
      reasoning: { effort: 'low' }
    };

    let response: Response | null = null;
    let lastError: any = null;

    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        response = await fetch(`${OPENROUTER_API_BASE}/chat/completions`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'https://abhyvexa.com',
            'X-Title': 'ABHYVEXA — Learn Beyond Limits'
          },
          body: JSON.stringify(bodyPayload),
          signal: AbortSignal.timeout(timeoutMs)
        });

        // If upstream gateway error, retry once
        if (attempt === 1 && (response.status === 502 || response.status === 503 || response.status === 504)) {
          await new Promise((r) => setTimeout(r, 1500));
          continue;
        }
        break;
      } catch (fetchErr: any) {
        lastError = fetchErr;
        if (attempt === 1) {
          await new Promise((r) => setTimeout(r, 1500));
          continue;
        }
      }
    }

    if (!response) {
      throw lastError || new Error('No response from OpenRouter provider.');
    }

    const httpStatus = response.status;
    const rawText = await response.text();

    let json: any = null;
    try {
      json = JSON.parse(rawText);
    } catch {
      // Non-JSON response
    }

    if (!response.ok) {
      const sanitizedErrorMessage = json?.error?.message || json?.message || rawText || `HTTP ${httpStatus}`;
      let errorType: OpenRouterChatResult['error']['type'] = 'PROVIDER_ERROR';

      if (httpStatus === 401 || httpStatus === 403) {
        errorType = 'AUTHENTICATION';
      } else if (httpStatus === 429) {
        errorType = 'RATE_LIMIT';
      } else if (httpStatus === 404 || sanitizedErrorMessage.toLowerCase().includes('model')) {
        errorType = 'MODEL_AVAILABILITY';
      } else if (httpStatus >= 500) {
        errorType = 'PROVIDER_ERROR';
      }

      return {
        success: false,
        httpStatus,
        error: {
          type: errorType,
          message: sanitizedErrorMessage,
          raw: json?.error || undefined
        }
      };
    }

    let replyText = json?.choices?.[0]?.message?.content?.trim() || '';

    // If content is empty but model put output inside choices[0].text or reasoning
    if (!replyText && json?.choices?.[0]?.text?.trim()) {
      replyText = json.choices[0].text.trim();
    }

    if (!replyText) {
      return {
        success: false,
        httpStatus,
        error: {
          type: 'PROVIDER_ERROR',
          message: 'Upstream model returned an empty text response. Please retry.'
        }
      };
    }

    return {
      success: true,
      httpStatus,
      text: replyText,
      model: json?.model || model,
      usage: json?.usage
    };
  } catch (err: any) {
    const isTimeout = err.name === 'TimeoutError' || err.name === 'AbortError' || err.message?.toLowerCase().includes('timeout');
    return {
      success: false,
      error: {
        type: isTimeout ? 'PROVIDER_ERROR' : 'NETWORK',
        message: isTimeout
          ? `Upstream provider request timed out (${Math.round(timeoutMs / 1000)}s). Upstream model endpoint may be experiencing high queue delay or degradation.`
          : (err.message || 'Failed to connect to OpenRouter API.')
      }
    };
  }
}

/**
 * Diagnostic health check / minimal verification test
 */
export async function testOpenRouterMinimal(): Promise<OpenRouterChatResult> {
  return sendOpenRouterChat({
    model: OPENROUTER_DEFAULT_MODEL,
    messages: [
      {
        role: 'user',
        content: 'Reply exactly "API WORKING" and nothing else.'
      }
    ],
    temperature: 0
  });
}

/**
 * Safely extracts and parses JSON from model output, handling optional markdown formatting
 */
export function extractJsonFromText<T = any>(text: string): T | null {
  if (!text) return null;
  try {
    return JSON.parse(text) as T;
  } catch {
    // Continue with regex extraction
  }

  const codeBlockMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (codeBlockMatch && codeBlockMatch[1]) {
    try {
      return JSON.parse(codeBlockMatch[1].trim()) as T;
    } catch {
      // Continue
    }
  }

  const firstBrace = text.indexOf('{');
  const lastBrace = text.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace > firstBrace) {
    try {
      return JSON.parse(text.substring(firstBrace, lastBrace + 1)) as T;
    } catch {
      // Continue
    }
  }

  const firstBracket = text.indexOf('[');
  const lastBracket = text.lastIndexOf(']');
  if (firstBracket !== -1 && lastBracket > firstBracket) {
    try {
      return JSON.parse(text.substring(firstBracket, lastBracket + 1)) as T;
    } catch {
      // Continue
    }
  }

  return null;
}
