'use client';

import React, { useRef, useEffect } from 'react';
import { ChatMessage } from './ChatMessage';
import { ChatMessage as ChatMessageType } from '@/types/chat';
import { cn } from '@/lib/utils';

interface ChatListProps {
  messages: ChatMessageType[];
  currentUserId: string;
  showAvatars?: boolean;
  showTimestamps?: boolean;
  showActions?: boolean;
  className?: string;
  onCopy?: (content: string) => void;
  onFeedback?: (messageId: string, helpful: boolean) => void;
}

export default function ChatList({
  messages,
  currentUserId,
  showAvatars = true,
  showTimestamps = true,
  showActions = true,
  className = '',
  onCopy,
  onFeedback,
}: ChatListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Grouper les messages par date
  const groupedMessages = messages.reduce((groups, message) => {
    const date = new Date(message.timestamp).toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
    return groups;
  }, {} as Record<string, ChatMessageType[]>);

  return (
    <div className={cn('space-y-4', className)}>
      {Object.entries(groupedMessages).map(([date, dateMessages]) => (
        <div key={date}>
          {/* Séparateur de date */}
          <div className="flex justify-center my-4">
            <span className="px-3 py-1 text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 rounded-full">
              {date}
            </span>
          </div>

          {/* Messages du jour */}
          {dateMessages.map((message) => (
            <ChatMessage
              key={message.id}
              message={message}
              isOwn={message.userId === currentUserId}
              showAvatar={showAvatars}
              showTimestamp={showTimestamps}
              showActions={showActions && !message.isAI}
              onCopy={onCopy}
              onFeedback={onFeedback}
            />
          ))}
        </div>
      ))}

      {/* Anchor pour auto-scroll */}
      <div ref={messagesEndRef} />
    </div>
  );
}