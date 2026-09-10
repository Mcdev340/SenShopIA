"use client";

import { useState, useEffect } from "react";
import ChatInterface from "@/components/chat/ChatInterface";
import { useAuth } from "@/hooks";
import { Spinner } from "@/components/ui/Spinner";
import { Card, CardBody } from "@/components/ui/Card";
import { MessageCircle, Info } from "lucide-react";

export default function ChatPage() {
  const { user, isAuthenticated, loading } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(loading);
  }, [loading]);

  if (isLoading) {
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
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
          <MessageCircle className="w-6 h-6 mr-2 text-primary-600" />
          Assistant ShopSense AI
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Posez vos questions, obtenez des recommandations et suivez vos
          commandes
        </p>
      </div>

      {/* Info banner */}
      <Card className="mb-4 bg-primary-50 dark:bg-primary-900/10 border-primary-200 dark:border-primary-800">
        <CardBody className="p-3">
          <div className="flex items-start gap-2">
            <Info className="w-4 h-4 text-primary-600 dark:text-primary-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-primary-700 dark:text-primary-300">
              <p className="font-medium">
                Notre assistant IA est là pour vous aider
              </p>
              <p className="text-xs mt-0.5">
                Il peut rechercher des produits, suivre vos commandes, calculer
                des livraisons et bien plus.
              </p>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Chat */}
      <Card className="overflow-hidden">
        <ChatInterface
          title={`Assistant ${user?.firstName || user?.username || ""}`}
          welcomeMessage="Bonjour ! Je suis votre assistant intelligent. Comment puis-je vous aider aujourd'hui ?"
          maxHeight="600px"
        />
      </Card>
    </div>
  );
}
