'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth, useAI, useToast } from '@/hooks';
import { ChatHeader } from './ChatHeader';
import { ChatList } from './ChatList';
import { ChatInput } from './ChatInput';
import { ChatEmpty } from './ChatEmpty';
import { ChatTyping } from './ChatTyping';
import { Spinner } from '@/components/ui/Spinner';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { ChatMessage as ChatMessageType, ChatSession } from '@/types/chat';

interface ChatInterfaceProps {
  sessionId?: string;
  maxWidth?: string;
  maxHeight?: string;
  className?: string;
  title?: string;
  welcomeMessage?: string;
  onMessageSent?: (message: ChatMessageType) => void;
  onMessageReceived?: (message: ChatMessageType) => void;
  onTransfer?: (sessionId: string) => void;
  onClose?: () => void;
}

export default function ChatInterface({
  sessionId: initialSessionId,
  maxWidth = '800px',
  maxHeight = '600px',
  className = '',
  title = 'Assistant ShopSense AI',
  welcomeMessage = 'Bonjour ! Je suis votre assistant intelligent. Comment puis-je vous aider aujourd\'hui ?',
  onMessageSent,
  onMessageReceived,
  onTransfer,
  onClose,
}: ChatInterfaceProps) {
  const { user } = useAuth();
  const { 
    sendMessage, 
    getChatSession, 
    startNewSession,
    transferToHuman,
    getChatStatus,
    connectWebSocket,
    disconnectWebSocket,
    sendMessageWebSocket,
    onMessage,
    removeMessageHandler,
    closeSession,
  } = useAI();
  const { success, error: showError } = useToast();

  const [sessionId, setSessionId] = useState<string | null>(initialSessionId || null);
  const [session, setSession] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isTransferred, setIsTransferred] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [advisorName, setAdvisorName] = useState<string | undefined>(undefined);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageHandlerRef = useRef<((message: ChatMessageType) => void) | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  // Charger la session
  const loadSession = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const sessionData = await getChatSession(id);
      setSession(sessionData);
      setMessages(sessionData.messages || []);
      
      // Vérifier le statut
      const status = await getChatStatus(id);
      if (status.status === 'transferred') {
        setIsTransferred(true);
        setAdvisorName(status.advisorName);
        if (onTransfer) {
          onTransfer(id);
        }
      } else {
        setIsTransferred(false);
        setAdvisorName(undefined);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur de chargement de la session';
      setError(errorMessage);
      showError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [getChatSession, getChatStatus, onTransfer, showError]);

  // Initialiser la session
  const initializeSession = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const newSession = await startNewSession();
      setSessionId(newSession.id);
      setSession(newSession);
      setMessages(newSession.messages || []);
      setIsTransferred(false);
      setAdvisorName(undefined);
      
      // Connecter WebSocket
      const wsConnection = connectWebSocket(newSession.id);
      setWs(wsConnection);
      wsRef.current = wsConnection;
      setIsConnected(true);
      
      // Ajouter le message de bienvenue s'il n'existe pas
      if (newSession.messages.length === 0) {
        const welcomeMsg: ChatMessageType = {
          id: `welcome-${Date.now()}`,
          userId: 'ai',
          sessionId: newSession.id,
          content: welcomeMessage,
          isAI: true,
          isRead: true,
          timestamp: new Date(),
          type: 'text',
          metadata: {
            suggestions: [
              'Je cherche un produit',
              'Aide pour une commande',
              'Suivi de colis',
              'Problème de paiement',
            ]
          }
        };
        setMessages([welcomeMsg]);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur d\'initialisation du chat';
      setError(errorMessage);
      showError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [startNewSession, connectWebSocket, welcomeMessage, showError]);

  // Initialiser au montage
  useEffect(() => {
    if (initialSessionId) {
      loadSession(initialSessionId);
    } else {
      initializeSession();
    }

    return () => {
      if (messageHandlerRef.current) {
        removeMessageHandler(messageHandlerRef.current);
      }
      disconnectWebSocket();
      setIsConnected(false);
    };
  }, [initialSessionId, loadSession, initializeSession, disconnectWebSocket, removeMessageHandler]);

  // Gestionnaire de messages WebSocket
  useEffect(() => {
    if (!sessionId) return;

    const handler = (message: ChatMessageType) => {
      setMessages(prev => [...prev, message]);
      setIsTyping(false);
      
      if (onMessageReceived) {
        onMessageReceived(message);
      }
      
      // Vérifier si c'est un transfert
      if (message.metadata?.action === 'transfer') {
        setIsTransferred(true);
        setAdvisorName(message.metadata?.advisorName);
        if (onTransfer) {
          onTransfer(sessionId);
        }
        success('Transfert vers un conseiller effectué');
      }
    };

    messageHandlerRef.current = handler;
    onMessage(handler);

    return () => {
      if (messageHandlerRef.current) {
        removeMessageHandler(messageHandlerRef.current);
      }
    };
  }, [sessionId, onMessage, removeMessageHandler, onMessageReceived, onTransfer, success]);

  // Auto-scroll vers le bas
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Envoyer un message
  const handleSendMessage = async (content: string) => {
    if (!content.trim() || isSending || !sessionId) return;

    // Créer un message temporaire
    const tempMessage: ChatMessageType = {
      id: `temp-${Date.now()}`,
      userId: user?.id || 'user',
      sessionId: sessionId,
      content: content.trim(),
      isAI: false,
      isRead: true,
      timestamp: new Date(),
      type: 'text',
    };

    setMessages(prev => [...prev, tempMessage]);
    setIsSending(true);
    setIsTyping(true);

    try {
      // Envoyer via WebSocket si connecté
      if (ws && ws.readyState === WebSocket.OPEN && isConnected) {
        sendMessageWebSocket(content);
      } else {
        // Fallback via API
        const response = await sendMessage(content, sessionId);
        
        // Ajouter la réponse
        const aiMessage: ChatMessageType = {
          id: `ai-${Date.now()}`,
          userId: 'ai',
          sessionId: sessionId,
          content: response.message,
          isAI: true,
          isRead: true,
          timestamp: new Date(),
          type: response.type || 'text',
          metadata: {
            action: response.action?.type,
            data: response.action?.data,
            suggestions: response.suggestions,
            quickReplies: response.quickReplies,
          },
        };
        setMessages(prev => [...prev, aiMessage]);
        setIsTyping(false);

        if (onMessageSent) {
          onMessageSent(tempMessage);
        }

        // Vérifier le transfert
        if (response.action?.type === 'transfer') {
          setIsTransferred(true);
          setAdvisorName(response.action?.data?.advisorName);
          if (onTransfer) {
            onTransfer(sessionId);
          }
          success('Transfert vers un conseiller effectué');
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur d\'envoi du message';
      showError(errorMessage);
      setError(errorMessage);
      
      // Supprimer le message temporaire
      setMessages(prev => prev.filter(m => m.id !== tempMessage.id));
    } finally {
      setIsSending(false);
      setIsTyping(false);
    }
  };

  // Transférer vers un humain
  const handleTransfer = async () => {
    if (!sessionId) return;

    try {
      const result = await transferToHuman(sessionId, 'Demande de transfert');
      if (result.status === 'success') {
        setIsTransferred(true);
        setAdvisorName(result.advisorName);
        success('Transfert vers un conseiller en cours...');
        if (onTransfer) {
          onTransfer(sessionId);
        }
      } else {
        showError('Erreur de transfert');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur de transfert';
      showError(errorMessage);
    }
  };

  // Rafraîchir le chat
  const handleRefresh = async () => {
    if (sessionId) {
      await loadSession(sessionId);
      success('Chat rafraîchi');
    } else {
      await initializeSession();
    }
  };

  // Fermer le chat
  const handleClose = async () => {
    if (sessionId) {
      try {
        await closeSession(sessionId);
      } catch (error) {
        // Ignorer les erreurs de fermeture
      }
    }
    disconnectWebSocket();
    setIsConnected(false);
    if (onClose) {
      onClose();
    }
  };

  // Réessayer en cas d'erreur
  const handleRetry = () => {
    if (sessionId) {
      loadSession(sessionId);
    } else {
      initializeSession();
    }
  };

  if (isLoading) {
    return (
      <div
        className={cn(
          'flex flex-col items-center justify-center bg-white dark:bg-gray-900 rounded-lg shadow-lg',
          className
        )}
        style={{ maxWidth, maxHeight, minHeight: '400px' }}
      >
        <Spinner size="lg" />
        <p className="mt-4 text-gray-500 dark:text-gray-400">Chargement du chat...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={cn(
          'flex flex-col items-center justify-center bg-white dark:bg-gray-900 rounded-lg shadow-lg p-8',
          className
        )}
        style={{ maxWidth, maxHeight, minHeight: '400px' }}
      >
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">⚠️</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Erreur de chargement
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mt-2">{error}</p>
          <Button onClick={handleRetry} className="mt-4">
            Réessayer
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'flex flex-col bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden',
        className
      )}
      style={{ maxWidth, maxHeight }}
    >
      {/* Header */}
      <ChatHeader
        title={title}
        subtitle="Nous sommes là pour vous aider"
        isTransferred={isTransferred}
        status={isTransferred ? 'transferred' : 'active'}
        advisorName={advisorName}
        isLoading={isLoading}
        onTransfer={handleTransfer}
        onRefresh={handleRefresh}
        onClose={handleClose}
      />

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-50 dark:bg-gray-800/50 min-h-[300px]">
        {messages.length === 0 ? (
          <ChatEmpty
            title="Aucun message"
            message="Commencez une conversation avec notre assistant."
          />
        ) : (
          <>
            <ChatList
              messages={messages}
              currentUserId={user?.id || 'user'}
              showAvatars={true}
              showTimestamps={true}
              showActions={true}
            />
            {isTyping && <ChatTyping name={isTransferred ? advisorName || 'Conseiller' : 'Assistant'} />}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input */}
      <ChatInput
        onSend={handleSendMessage}
        disabled={isSending || isTransferred || isLoading}
        isSending={isSending}
        placeholder={
          isTransferred 
            ? 'Transfert vers un conseiller en cours...' 
            : isLoading 
              ? 'Chargement...' 
              : 'Écrivez votre message...'
        }
        allowAttachments={true}
        allowEmojis={true}
        allowVoice={false}
      />

      {/* Statut de connexion */}
      <div className="px-4 py-1 text-center border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
        <span className="text-xs text-gray-400 dark:text-gray-500">
          {isConnected ? '🔵 Connecté' : '⚪ Déconnecté'}
          {isTransferred && ' • 🤝 Transféré à un conseiller'}
        </span>
      </div>
    </div>
  );
}