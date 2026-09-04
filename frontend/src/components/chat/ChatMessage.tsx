"use client";

import { useState } from "react";
import { formatRelativeTime } from "@/lib/utils";
import Avatar from "@/components/ui/Avatar";
import { ChatMessage as ChatMessageType } from "@/types/chat";
import { Copy, Check, ThumbsUp, ThumbsDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatMessageProps {
  message: ChatMessageType;
  isOwn: boolean;
  showAvatar?: boolean;
  showTimestamp?: boolean;
  showActions?: boolean;
  onCopy?: (content: string) => void;
  onFeedback?: (messageId: string, helpful: boolean) => void;
  className?: string;
}

export default function ChatMessage({
  message,
  isOwn,
  showAvatar = true,
  showTimestamp = true,
  showActions = true,
  onCopy,
  onFeedback,
  className = "",
}: ChatMessageProps) {
  const [feedback, setFeedback] = useState<"helpful" | "not_helpful" | null>(
    null,
  );
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
    if (onCopy) {
      onCopy(message.content);
    }
  };

  const handleFeedback = (helpful: boolean) => {
    setFeedback(helpful ? "helpful" : "not_helpful");
    if (onFeedback) {
      onFeedback(message.id, helpful);
    }
  };

  const isAI = message.isAI;
  const isSystem = message.type === "system";
  const isError = message.type === "error";

  if (isSystem) {
    return (
      <div className={cn("flex justify-center my-2", className)}>
        <div className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full text-xs text-gray-500 dark:text-gray-400">
          {message.content}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className={cn("flex justify-center my-2", className)}>
        <div className="px-4 py-2 bg-red-50 dark:bg-red-900/20 rounded-lg text-sm text-red-600 dark:text-red-400">
          ⚠️ {message.content}
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex gap-3 group",
        isOwn ? "flex-row-reverse" : "flex-row",
        className,
      )}
    >
      {/* Avatar */}
      {showAvatar && (
        <div className="flex-shrink-0">
          {isAI ? <Avatar /> : isOwn ? <Avatar /> : <Avatar />}
        </div>
      )}

      {/* Message */}
      <div
        className={cn(
          "flex flex-col max-w-[80%]",
          isOwn ? "items-end" : "items-start",
        )}
      >
        {/* Nom de l'utilisateur */}
        {isAI && (
          <span className="text-xs font-medium text-primary-600 dark:text-primary-400 mb-1">
            Assistant ShopSense AI
          </span>
        )}

        {/* Contenu du message */}
        <div
          className={cn(
            "relative px-4 py-2 rounded-lg break-words",
            isOwn
              ? "bg-primary-600 text-white rounded-br-none"
              : isAI
                ? "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-bl-none border border-gray-200 dark:border-gray-700"
                : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-bl-none",
          )}
        >
          <p className="text-sm whitespace-pre-wrap">{message.content}</p>

          {/* Suggestions (si présentes) */}
          {isAI &&
            message.metadata?.suggestions &&
            message.metadata.suggestions.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {message.metadata.suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    className="px-3 py-1 text-xs bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-400 rounded-full border border-primary-200 dark:border-primary-700 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}

          {/* Quick Replies (si présents) */}
          {isAI &&
            message.metadata?.quickReplies &&
            message.metadata.quickReplies.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {message.metadata.quickReplies.map((reply, index) => (
                  <button
                    key={index}
                    className="px-3 py-1 text-xs bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                  >
                    {reply.label}
                  </button>
                ))}
              </div>
            )}
        </div>

        {/* Timestamp et actions */}
        <div
          className={cn(
            "flex items-center gap-2 mt-1",
            isOwn ? "flex-row" : "flex-row",
          )}
        >
          {showTimestamp && (
            <span className="text-xs text-gray-400 dark:text-gray-500">
              {formatRelativeTime(message.timestamp)}
            </span>
          )}

          {/* Actions */}
          {showActions && !isOwn && !isSystem && (
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {/* Copier */}
              <button
                onClick={handleCopy}
                className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                title="Copier"
              >
                {isCopied ? (
                  <Check className="w-3 h-3 text-green-500" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
              </button>

              {/* Feedback */}
              {isAI && (
                <>
                  <button
                    onClick={() => handleFeedback(true)}
                    className={cn(
                      "p-1 transition-colors",
                      feedback === "helpful"
                        ? "text-green-500"
                        : "text-gray-400 hover:text-green-500",
                    )}
                    title="Utile"
                  >
                    <ThumbsUp className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => handleFeedback(false)}
                    className={cn(
                      "p-1 transition-colors",
                      feedback === "not_helpful"
                        ? "text-red-500"
                        : "text-gray-400 hover:text-red-500",
                    )}
                    title="Pas utile"
                  >
                    <ThumbsDown className="w-3 h-3" />
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
