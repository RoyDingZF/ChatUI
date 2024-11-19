import React, { useState } from 'react';
import { PaperAirplaneIcon } from '@heroicons/react/24/solid';
import TextareaAutosize from 'react-textarea-autosize';
import { cn } from '../utils/cn';

type ChatInputProps = {
  onSendMessage: (message: string) => void;
  isStreaming: boolean;
};

export function ChatInput({ onSendMessage, isStreaming }: ChatInputProps) {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isStreaming) {
      onSendMessage(message);
      setMessage('');
    }
  };

  const handleButtonClick = (label: string) => {
    if (!isStreaming) {
      onSendMessage(label);
    }
  };

  const actionButtons = [
    ['help', 'open bag', 'new story'],
    ['revert', 'friend list', 'submit']
  ];

  return (
    <div className="border-t bg-white p-4">
      <div className="mb-4 grid grid-cols-3 gap-2">
        {actionButtons.map((row, rowIndex) => (
          <React.Fragment key={rowIndex}>
            {row.map((label) => (
              <button
                key={label}
                className={cn(
                  "rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500",
                  isStreaming && "opacity-50 cursor-not-allowed"
                )}
                onClick={() => handleButtonClick(label)}
                disabled={isStreaming}
              >
                {label}
              </button>
            ))}
          </React.Fragment>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="flex items-end gap-2">
        <TextareaAutosize
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          minRows={1}
          maxRows={5}
          disabled={isStreaming}
          className={cn(
            "flex-1 resize-none rounded-lg border p-2 focus:outline-none focus:ring-2 focus:ring-blue-500",
            isStreaming && "opacity-50 cursor-not-allowed"
          )}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey && !isStreaming) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
        />
        <button
          type="submit"
          disabled={isStreaming || !message.trim()}
          className={cn(
            "rounded-lg p-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500",
            !message.trim() || isStreaming 
              ? "bg-gray-400 cursor-not-allowed" 
              : "bg-blue-500 hover:bg-blue-600"
          )}
        >
          <PaperAirplaneIcon className="h-5 w-5" />
        </button>
      </form>
    </div>
  );
}