'use client';

import React from 'react';
import { 
  Bot, 
  User, 
  Phone, 
  RefreshCw, 
  X, 
  CheckCircle,
  Clock,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface ChatHeaderProps {
  title?: string;
  subtitle?: string;
  isTransferred?: boolean;
  status?: 'active' | 'transferred' | 'closed' | 'pending';
  advisorName?: string;
  isLoading?: boolean;
  onTransfer?: () => void;
  onRefresh?: () => void;
  onClose?: () => void;
  className?: string;
}

export default function ChatHeader({
  title = 'Assistant ShopSense AI',
  subtitle = 'Nous sommes là pour vous aider',
  isTransferred = false,
  status = 'active',
  advisorName,
  isLoading = false,
  onTransfer,
  onRefresh,
  onClose,
  className = '',
}: ChatHeaderProps) {
  const statusConfig = {
    active: { 
      label: 'En ligne', 
      color: 'text-green-500', 
      icon: CheckCircle,
      dot: 'bg-green-500'
    },
    transferred: { 
      label: 'Transféré', 
      color: 'text-blue-500', 
      icon: User,
      dot: 'bg-blue-500'
    },
    closed: { 
      label: 'Fermé', 
      color: 'text-gray-500', 
      icon: X,
      dot: 'bg-gray-500'
    },
    pending: { 
      label: 'En attente', 
      color: 'text-yellow-500', 
      icon: Clock,
      dot: 'bg-yellow-500'
    },
  };

  const currentStatus = statusConfig[status] || statusConfig.active;

  return (
    <div className={cn(
      'flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900',
      className
    )}>
      <div className="flex items-center space-x-3">
        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
            {isTransferred ? (
              <User className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            ) : (
              <Bot className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            )}
          </div>
          <span className={cn(
            'absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white dark:border-gray-900',
            currentStatus.dot
          )} />
        </div>

        <div>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
            {isTransferred && advisorName ? `Conseiller: ${advisorName}` : title}
          </h3>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {isTransferred ? 'Transféré à un conseiller' : subtitle}
            </span>
            <span className="text-xs text-gray-400 dark:text-gray-500">•</span>
            <span className={cn('text-xs font-medium flex items-center space-x-1', currentStatus.color)}>
              <currentStatus.icon className="w-3 h-3" />
              <span>{currentStatus.label}</span>
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-1">
        {status === 'transferred' && advisorName && (
          <div className="flex items-center px-2 py-1 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <span className="text-xs text-blue-600 dark:text-blue-400">
              {advisorName}
            </span>
          </div>
        )}

        {!isTransferred && onTransfer && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onTransfer}
            className="p-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
            title="Transférer à un conseiller"
          >
            <Phone className="w-4 h-4" />
          </Button>
        )}

        {onRefresh && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onRefresh}
            disabled={isLoading}
            className="p-2 text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400"
            title="Rafraîchir"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
          </Button>
        )}

        {onClose && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
            title="Fermer"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
}