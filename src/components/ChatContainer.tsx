import React, { useEffect, useRef, useState } from 'react';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { Message as ApiMessage, streamMessage } from '../services/api';

export type Message = {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: Date;
};

type ChatContainerProps = {
  conversationId: string;
  messages: Message[];
  onSendMessage: (text: string, isUser: boolean) => void;
};

export function ChatContainer({ conversationId, messages, onSendMessage }: ChatContainerProps) {
  const [isStreaming, setIsStreaming] = useState(false);
  const [currentStreamedMessage, setCurrentStreamedMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, currentStreamedMessage]);

  const handleSendMessage = async (text: string) => {
    if (isStreaming) return;

    setIsStreaming(true);
    setCurrentStreamedMessage('');

    // Send user message
    onSendMessage(text, true);

    const apiMessages: ApiMessage[] = messages.map(msg => ({
      role: msg.isUser ? 'user' : 'assistant',
      content: msg.text
    }));

    try {
      let streamedContent = '';
      for await (const chunk of streamMessage(text, apiMessages, conversationId)) {
        streamedContent += chunk.message;
        setCurrentStreamedMessage(streamedContent);
      }
      // Send AI response
      onSendMessage(streamedContent, false);
    } finally {
      setIsStreaming(false);
      setCurrentStreamedMessage('');
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((message) => (
          <ChatMessage
            key={message.id}
            message={message.text}
            isUser={message.isUser}
            timestamp={message.timestamp}
          />
        ))}
        {isStreaming && currentStreamedMessage && (
          <ChatMessage
            message={currentStreamedMessage}
            isUser={false}
            timestamp={new Date()}
          />
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="flex-shrink-0">
        <ChatInput onSendMessage={handleSendMessage} isStreaming={isStreaming} />
      </div>
    </div>
  );
}