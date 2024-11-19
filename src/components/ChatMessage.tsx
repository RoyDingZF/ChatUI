import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../utils/cn';

type ChatMessageProps = {
  message: string;
  isUser: boolean;
  timestamp: Date;
};

export function ChatMessage({ message, isUser, timestamp }: ChatMessageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'flex w-full mb-4',
        isUser ? 'justify-end' : 'justify-start'
      )}
    >
      <div
        className={cn(
          'max-w-[80%] rounded-lg p-4',
          isUser ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-900'
        )}
      >
        <p className="text-sm">{message}</p>
        <span className="text-xs opacity-50 mt-2 block">
          {timestamp.toLocaleTimeString()}
        </span>
      </div>
    </motion.div>
  );
}