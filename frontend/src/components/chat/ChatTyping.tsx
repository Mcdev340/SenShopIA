"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface ChatTypingProps {
  className?: string;
  avatar?: React.ReactNode;
  name?: string;
}

export default function ChatTyping({
  className = "",
  avatar,
  name = "Assistant",
}: ChatTypingProps) {
  return (
    <div className={cn("flex items-start gap-3", className)}>
      {avatar && <div className="flex-shrink-0">{avatar}</div>}
      <div>
        {name && (
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">
            {name}
          </span>
        )}
        <div className="px-4 py-3 bg-gray-100 dark:bg-gray-800 rounded-lg rounded-bl-none">
          <div className="flex items-center space-x-1.5">
            <div
              className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce"
              style={{ animationDelay: "0ms" }}
            />
            <div
              className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce"
              style={{ animationDelay: "150ms" }}
            />
            <div
              className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce"
              style={{ animationDelay: "300ms" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
