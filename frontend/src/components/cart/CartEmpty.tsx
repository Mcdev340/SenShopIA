'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingBag, ArrowRight, Heart, Truck, Shield } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface CartEmptyProps {
  title?: string;
  message?: string;
  buttonText?: string;
  buttonLink?: string;
  showFeatures?: boolean;
  className?: string;
}

export default function CartEmpty({
  title = 'Votre panier est vide',
  message = 'Découvrez nos produits et trouvez ce qui vous plaît.',
  buttonText = 'Découvrir les produits',
  buttonLink = '/products',
  showFeatures = true,
  className = '',
}: CartEmptyProps) {
  return (
    <div className={cn(
      'flex flex-col items-center justify-center p-8 text-center min-h-[400px]',
      className
    )}>
      <div className="relative">
        <div className="w-24 h-24 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
          <ShoppingBag className="w-12 h-12 text-gray-400 dark:text-gray-600" />
        </div>
        <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
          <span className="text-xs font-bold text-primary-600 dark:text-primary-400">0</span>
        </div>
      </div>

      <h3 className="mt-6 text-xl font-semibold text-gray-900 dark:text-white">
        {title}
      </h3>
      <p className="mt-2 text-gray-500 dark:text-gray-400 max-w-sm">
        {message}
      </p>

      <Link href={buttonLink} className="mt-6">
        <Button size="lg">
          {buttonText}
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </Link>

      {showFeatures && (
        <div className="mt-8 grid grid-cols-3 gap-4 w-full max-w-sm">
          <div className="text-center">
            <div className="w-10 h-10 rounded-full bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center mx-auto mb-2">
              <Truck className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            </div>
            <p className="text-xs font-medium text-gray-700 dark:text-gray-300">Livraison offerte</p>
            <p className="text-[10px] text-gray-500 dark:text-gray-400">Dès 50 000 FCFA</p>
          </div>
          <div className="text-center">
            <div className="w-10 h-10 rounded-full bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center mx-auto mb-2">
              <Shield className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            </div>
            <p className="text-xs font-medium text-gray-700 dark:text-gray-300">Paiement sécurisé</p>
            <p className="text-[10px] text-gray-500 dark:text-gray-400">100% garanti</p>
          </div>
          <div className="text-center">
            <div className="w-10 h-10 rounded-full bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center mx-auto mb-2">
              <Heart className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            </div>
            <p className="text-xs font-medium text-gray-700 dark:text-gray-300">Service client</p>
            <p className="text-[10px] text-gray-500 dark:text-gray-400">7j/7</p>
          </div>
        </div>
      )}
    </div>
  );
}