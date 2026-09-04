'use client';

import React, { useState } from 'react';
import { useCart } from '@/hooks';
import { CartItem } from './CartItem';
import { CartEmpty } from './CartEmpty';
import { Spinner } from '@/components/ui/Spinner';
import { Button } from '@/components/ui/Button';
import { Checkbox } from '@/components/ui/Checkbox';
import { cn } from '@/lib/utils';
import { Trash2, ShoppingBag } from 'lucide-react';

interface CartListProps {
  className?: string;
  compact?: boolean;
  showSelectAll?: boolean;
  showActions?: boolean;
  onItemSelect?: (itemId: string, selected: boolean) => void;
}

export default function CartList({
  className = '',
  compact = false,
  showSelectAll = false,
  showActions = true,
  onItemSelect,
}: CartListProps) {
  const { items, loading, clearCart, selectAllItems, selectedItems, selectAll } = useCart();
  const [isClearing, setIsClearing] = useState(false);
  const [isSelectingAll, setIsSelectingAll] = useState(false);

  const handleClearCart = async () => {
    if (window.confirm('Voulez-vous vraiment vider votre panier ?')) {
      setIsClearing(true);
      try {
        await clearCart();
      } finally {
        setIsClearing(false);
      }
    }
  };

  const handleSelectAll = async (checked: boolean) => {
    setIsSelectingAll(true);
    try {
      await selectAllItems(checked);
    } finally {
      setIsSelectingAll(false);
    }
  };

  if (loading) {
    return (
      <div className={cn('flex items-center justify-center py-12', className)}>
        <Spinner size="lg" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className={className}>
        <CartEmpty />
      </div>
    );
  }

  return (
    <div className={className}>
      {/* En-tête avec actions */}
      {showActions && (
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center space-x-4">
            {showSelectAll && (
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="select-all"
                  checked={selectAll}
                  onCheckedChange={handleSelectAll}
                  disabled={isSelectingAll || items.length === 0}
                />
                <label
                  htmlFor="select-all"
                  className="text-sm text-gray-600 dark:text-gray-400 cursor-pointer"
                >
                  Tout sélectionner ({items.length})
                </label>
              </div>
            )}
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {items.reduce((acc, item) => acc + item.quantity, 0)} articles
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearCart}
            disabled={isClearing || items.length === 0}
            className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            {isClearing ? 'Vidage...' : 'Vider le panier'}
          </Button>
        </div>
      )}

      {/* Liste des articles */}
      <div className="space-y-4">
        {items.map((item) => (
          <CartItem
            key={item.id}
            item={item}
            compact={compact}
          />
        ))}
      </div>

      {/* Sélection */}
      {showSelectAll && selectedItems.length > 0 && (
        <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg flex items-center justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {selectedItems.length} article{selectedItems.length > 1 ? 's' : ''} sélectionné{selectedItems.length > 1 ? 's' : ''}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleSelectAll(false)}
            disabled={isSelectingAll}
          >
            Désélectionner tout
          </Button>
        </div>
      )}
    </div>
  );
}