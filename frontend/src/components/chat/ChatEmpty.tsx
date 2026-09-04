"use client";

import React from "react";
import { MessageSquare, Bot } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatEmptyProps {
  title?: string;
  message?: string;
  icon?: React.ReactNode;
  className?: string;
}

export default function ChatEmpty({
  title = "Aucun message",
  message = "Commencez une conversation avec notre assistant.",
  icon,
  className = "",
}: ChatEmptyProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center h-full py-12 px-4 text-center",
        className,
      )}
    >
      <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
        {icon || (
          <MessageSquare className="w-8 h-8 text-gray-400 dark:text-gray-600" />
        )}
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        {title}
      </h3>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 max-w-sm">
        {message}
      </p>

      <div className="mt-6 grid grid-cols-2 gap-2 w-full max-w-xs">
        <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
          <Bot className="w-5 h-5 text-primary-500 mx-auto mb-1" />
          <p className="text-xs text-gray-600 dark:text-gray-300">
            Assistant IA
          </p>
          <p className="text-[10px] text-gray-400 dark:text-gray-500">
            Réponse instantanée
          </p>
        </div>
        <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
          <MessageSquare className="w-5 h-5 text-blue-500 mx-auto mb-1" />
          <p className="text-xs text-gray-600 dark:text-gray-300">
            Conseiller humain
          </p>
          <p className="text-[10px] text-gray-400 dark:text-gray-500">
            Transfert possible
          </p>
        </div>
      </div>
    </div>
  );
}
