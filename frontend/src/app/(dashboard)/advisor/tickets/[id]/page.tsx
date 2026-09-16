"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Textarea } from "@/components/ui/Textarea";
import { Avatar } from "@/components/ui/Avatar";
import { Spinner } from "@/components/ui/Spinner";
import { Alert } from "@/components/ui/Alert";
import {
  ArrowLeft,
  Send,
  Loader2,
  User,
  CheckCircle,
  MessageCircle,
  Paperclip,
} from "lucide-react";
import { useToast } from "@/hooks";
import {
  formatDate,
  formatRelativeTime,
  cn,
} from "@/lib/utils";

interface Message {
  id: string;
  author: string;
  authorRole: "customer" | "advisor";
  content: string;
  createdAt: Date;
}

interface Ticket {
  id: string;
  customerName: string;
  customerEmail: string;
  subject: string;
  description: string;
  category: string;
  priority: "low" | "medium" | "high" | "urgent";
  status: "open" | "in_progress" | "resolved" | "closed";
  assignedTo?: string;
  createdAt: Date;
  lastUpdate: Date;
  messages: Message[];
}

const mockTicket: Ticket = {
  id: "TKT-001",
  customerName: "Jean Dupont",
  customerEmail: "jean@example.com",
  subject: "Problème de paiement",
  description:
    "Je n'arrive pas à finaliser ma commande, le paiement échoue systématiquement.",
  category: "Paiement",
  priority: "high",
  status: "open",
  createdAt: new Date(Date.now() - 3600000),
  lastUpdate: new Date(Date.now() - 1800000),
  messages: [
    {
      id: "1",
      author: "Jean Dupont",
      authorRole: "customer",
      content:
        "Bonjour, je n'arrive pas à finaliser ma commande. Le paiement échoue systématiquement avec ma carte bancaire. Pouvez-vous m'aider ?",
      createdAt: new Date(Date.now() - 3600000),
    },
    {
      id: "2",
      author: "Awa Ndiaye",
      authorRole: "advisor",
      content:
        "Bonjour Jean, je suis désolée pour ce désagrément. Pouvez-vous me préciser le message d'erreur exact que vous recevez ?",
      createdAt: new Date(Date.now() - 2700000),
    },
    {
      id: "3",
      author: "Jean Dupont",
      authorRole: "customer",
      content:
        'Le message dit "Transaction refusée par la banque". J\'ai pourtant vérifié mes informations et mon solde est suffisant.',
      createdAt: new Date(Date.now() - 1800000),
    },
  ],
};

const priorityConfig: Record<string, { label: string; color: string }> = {
  low: {
    label: "Basse",
    color: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
  },
  medium: {
    label: "Moyenne",
    color:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  },
  high: {
    label: "Élevée",
    color:
      "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
  },
  urgent: {
    label: "Urgente",
    color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  },
};

const statusConfig: Record<string, { label: string; color: string }> = {
  open: {
    label: "Ouvert",
    color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  },
  in_progress: {
    label: "En cours",
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  },
  resolved: {
    label: "Résolu",
    color:
      "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  },
  closed: {
    label: "Fermé",
    color: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
  },
};

export default function AdvisorTicketDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { success, error: showError } = useToast();

  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [replyMessage, setReplyMessage] = useState("");
  const [error, setError] = useState<string | null>(null);

  const ticketId = params?.id as string;

  useEffect(() => {
    if (ticketId) {
      loadTicket();
    }
  }, [ticketId]);

  const loadTicket = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await new Promise((resolve) => setTimeout(resolve, 600));
      if (ticketId === mockTicket.id) {
        setTicket(mockTicket);
      } else {
        setError("Ticket non trouvé");
      }
    } catch (err) {
      setError("Erreur de chargement du ticket");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendReply = async () => {
    if (!replyMessage.trim() || !ticket) return;

    setIsSending(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));

      const newMessage: Message = {
        id: `msg_${Date.now()}`,
        author: "Vous",
        authorRole: "advisor",
        content: replyMessage.trim(),
        createdAt: new Date(),
      };

      setTicket({
        ...ticket,
        messages: [...ticket.messages, newMessage],
        lastUpdate: new Date(),
        status: ticket.status === "open" ? "in_progress" : ticket.status,
      });

      setReplyMessage("");
      success("Réponse envoyée");
    } catch (err) {
      showError("Erreur lors de l'envoi");
    } finally {
      setIsSending(false);
    }
  };

  const handleStatusChange = (newStatus: Ticket["status"]) => {
    if (!ticket) return;
    setTicket({ ...ticket, status: newStatus, lastUpdate: new Date() });
    success("Statut mis à jour");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !ticket) {
    return (
      <div className="max-w-4xl mx-auto">
        <Alert variant="danger" title="Ticket non trouvé">
          {error || "Ce ticket n'existe pas."}
          <Button
            className="mt-4"
            onClick={() => router.push("/dashboard/advisor/tickets")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour aux tickets
          </Button>
        </Alert>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Ticket #{ticket.id}
            </h1>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <Badge className={statusConfig[ticket.status].color}>
                {statusConfig[ticket.status].label}
              </Badge>
              <Badge className={priorityConfig[ticket.priority].color}>
                {priorityConfig[ticket.priority].label}
              </Badge>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {formatRelativeTime(ticket.createdAt)}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {ticket.status !== "resolved" && ticket.status !== "closed" && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleStatusChange("resolved")}
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Résoudre
            </Button>
          )}
        </div>
      </div>

      {/* Informations client */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
            <User className="w-5 h-5 mr-2 text-gray-400" />
            Informations client
          </h3>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Nom</p>
              <p className="font-medium text-gray-900 dark:text-white">
                {ticket.customerName}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
              <p className="font-medium text-gray-900 dark:text-white">
                {ticket.customerEmail}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Catégorie
              </p>
              <p className="font-medium text-gray-900 dark:text-white">
                {ticket.category}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Créé le
              </p>
              <p className="font-medium text-gray-900 dark:text-white">
                {formatDate(ticket.createdAt)}
              </p>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Sujet */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {ticket.subject}
          </h3>
        </CardHeader>
        <CardBody>
          <p className="text-gray-600 dark:text-gray-300">
            {ticket.description}
          </p>
        </CardBody>
      </Card>

      {/* Messages */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
            <MessageCircle className="w-5 h-5 mr-2 text-gray-400" />
            Conversation ({ticket.messages.length})
          </h3>
        </CardHeader>
        <CardBody className="space-y-4 max-h-96 overflow-y-auto">
          {ticket.messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex gap-3",
                message.authorRole === "advisor" && "flex-row-reverse",
              )}
            >
              <Avatar
                alt={message.author}
                size="sm"
                className="flex-shrink-0"
              />
              <div
                className={cn(
                  "flex-1 max-w-[80%] p-3 rounded-lg",
                  message.authorRole === "customer"
                    ? "bg-gray-100 dark:bg-gray-800"
                    : "bg-primary-50 dark:bg-primary-900/20",
                )}
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {message.author}
                  </p>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {formatRelativeTime(message.createdAt)}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {message.content}
                </p>
              </div>
            </div>
          ))}
        </CardBody>
      </Card>

      {/* Réponse */}
      {ticket.status !== "closed" && (
        <Card>
          <CardBody className="space-y-3">
            <Textarea
              placeholder="Écrivez votre réponse..."
              value={replyMessage}
              onChange={(e) => setReplyMessage(e.target.value)}
              rows={4}
            />
            <div className="flex items-center justify-between">
              <Button variant="ghost" size="sm">
                <Paperclip className="w-4 h-4" />
              </Button>
              <Button
                onClick={handleSendReply}
                disabled={isSending || !replyMessage.trim()}
              >
                {isSending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Envoi...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Envoyer
                  </>
                )}
              </Button>
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  );
}
