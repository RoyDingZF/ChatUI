import { config } from './config';

export type ChatResponse = {
  conversation_id: string;
  message: string;
};

export type Message = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

export async function* streamMessage(
  query: string,
  messages: Message[] = [],
  conversationId?: string,
): AsyncGenerator<ChatResponse> {
  try {
    const allMessages: Message[] = [
      { role: 'system', content: 'You are a helpful assistant.' },
      ...messages,
      { role: 'user', content: query }
    ];

    const response = await fetch(`${config.apiUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: config.model,
        messages: allMessages,
        stream: true
      }),
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const reader = response.body?.getReader();
    if (!reader) throw new Error('Response body is null');

    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data === '[DONE]') continue;

          try {
            const parsed = JSON.parse(data);
            const content = parsed.choices[0]?.delta?.content;
            if (content) {
              yield {
                conversation_id: conversationId || Date.now().toString(),
                message: content
              };
            }
          } catch (e) {
            console.error('Error parsing SSE message:', e);
          }
        }
      }
    }
  } catch (error) {
    console.error('Error streaming message:', error);
    throw new Error('Failed to stream message from DeepSeek API');
  }
}

export async function sendMessage(
  query: string,
  messages: Message[] = [],
  conversationId?: string,
): Promise<ChatResponse> {
  let fullMessage = '';
  
  for await (const chunk of streamMessage(query, messages, conversationId)) {
    fullMessage += chunk.message;
  }
  
  return {
    conversation_id: conversationId || Date.now().toString(),
    message: fullMessage
  };
}