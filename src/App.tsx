import React from 'react';
import { ChatContainer, type Message } from './components/ChatContainer';
import { ConversationList, type Conversation } from './components/ConversationList';
import { useState } from 'react';

type ConversationWithMessages = Conversation & {
  messages: Message[];
  conversation_id?: string;
};

function App() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [conversations, setConversations] = useState<ConversationWithMessages[]>([
    {
      id: '1',
      title: 'Getting Started',
      lastMessage: '你好，我是智能AI助手。',
      timestamp: new Date(),
      isActive: true,
      messages: [
        {
          id: 1,
          text: "你好，我是智能AI助手。",
          isUser: false,
          timestamp: new Date(),
        },
      ],
    },
  ]);

  const activeConversation = conversations.find(conv => conv.isActive) || conversations[0];

  const handleSelectConversation = (id: string) => {
    setConversations(conversations.map(conv => ({
      ...conv,
      isActive: conv.id === id,
    })));
  };

  const handleNewChat = () => {
    const newConversation: ConversationWithMessages = {
      id: String(Date.now()),
      title: 'New Conversation',
      lastMessage: 'Start a new conversation',
      timestamp: new Date(),
      isActive: true,
      messages: [
        {
          id: 1,
          text: "你好，我是智能AI助手。",
          isUser: false,
          timestamp: new Date(),
        },
      ],
    };

    setConversations(conversations.map(conv => ({
      ...conv,
      isActive: false,
    })).concat(newConversation));
  };

  const handleSendMessage = (text: string, isUser: boolean = true) => {
    setConversations(prevConversations => 
      prevConversations.map(conv => {
        if (conv.id === activeConversation.id) {
          const newMessage: Message = {
            id: conv.messages.length + 1,
            text,
            isUser,
            timestamp: new Date(),
          };
          
          return {
            ...conv,
            lastMessage: text,
            timestamp: new Date(),
            messages: [...conv.messages, newMessage],
          };
        }
        return conv;
      })
    );
  };

  return (
    <div className="h-screen bg-gray-100 p-4">
      <div className="mx-auto h-[calc(100vh-2rem)] max-w-6xl">
        <div className="flex h-full overflow-hidden rounded-lg shadow-xl">
          <ConversationList
            conversations={conversations}
            onSelectConversation={handleSelectConversation}
            onNewChat={handleNewChat}
            isCollapsed={isCollapsed}
            onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
          />
          <div className="flex-1">
            <ChatContainer
              conversationId={activeConversation.id}
              messages={activeConversation.messages}
              onSendMessage={handleSendMessage}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;