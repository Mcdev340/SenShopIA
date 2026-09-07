'use client';

import { useState, useEffect } from 'react';
import { ChatInterface } from '@/components/chat/ChatInterface';
import { useAuth } from '@/hooks';
import { Spinner } from '@/components/ui/Spinner';
import { Card } from '@/components/ui/Card';

export default function ChatPage() {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Assistant ShopSense AI
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Posez vos questions, obtenez des recommandations et suivez vos commandes
        </p>
      </div>

      <Card className="overflow-hidden">
        <ChatInterface
          title={`Assistant ${user?.firstName || ''}`}
          welcomeMessage="Bonjour ! Je suis votre assistant intelligent. Comment puis-je vous aider aujourd'hui ?"
          maxHeight="600px"
        />
      </Card>
    </div>
  );
}