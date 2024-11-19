import React from 'react';
import { ChatBubbleLeftRightIcon, Bars3Icon } from '@heroicons/react/24/outline';
import { cn } from '../utils/cn';
import { motion } from 'framer-motion';

export type Conversation = {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
  isActive: boolean;
};

type ConversationListProps = {
  conversations: Conversation[];
  onSelectConversation: (id: string) => void;
  onNewChat: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
};

export function ConversationList({ 
  conversations, 
  onSelectConversation, 
  onNewChat,
  isCollapsed,
  onToggleCollapse 
}: ConversationListProps) {
  return (
    <motion.div 
      className="flex h-full flex-col bg-gray-900 text-white"
      animate={{ width: isCollapsed ? '64px' : '256px' }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-center gap-2 m-4">
        <button
          onClick={onToggleCollapse}
          className="p-2 hover:bg-gray-800 rounded-lg"
          aria-label="Toggle sidebar"
        >
          <Bars3Icon className="h-5 w-5" />
        </button>
        
        {!isCollapsed && (
          <button
            onClick={onNewChat}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-white/20 p-3 text-sm hover:bg-gray-800"
          >
            <ChatBubbleLeftRightIcon className="h-5 w-5" />
            New Chat
          </button>
        )}
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {!isCollapsed && conversations.map((conversation) => (
          <button
            key={conversation.id}
            onClick={() => onSelectConversation(conversation.id)}
            className={cn(
              'w-full px-4 py-3 text-left hover:bg-gray-800',
              conversation.isActive && 'bg-gray-800'
            )}
          >
            <div className="text-sm font-medium truncate">{conversation.title}</div>
            <div className="mt-1 text-xs text-gray-400 truncate">
              {conversation.lastMessage}
            </div>
          </button>
        ))}
      </div>
    </motion.div>
  );
}