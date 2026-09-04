'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin, 
  Youtube, 
  Mail, 
  Phone, 
  MapPin,
  Heart,
  Shield,
  Truck,
  CreditCard,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface FooterProps {
  variant?: 'default' | 'simple' | 'dashboard';
  className?: string;
}

export default function Footer({ variant = 'default', className = '' }: FooterProps) {
  const currentYear = new Date().getFullYear();

  // Version simple
  if (variant === 'simple') {
    return (
      <footer className={cn(
        'bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-6',
        className
      )}>
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              &copy; {currentYear} ShopSense AI. Tous droits réservés.
            </p>
            <div className="flex items-center space-x-6">
              <Link href="/terms" className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors">
                Conditions
              </Link>
              <Link href="/privacy" className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors">
                Confidentialité
              </Link>
              <Link href="/contact" className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    );
  }

  // Version dashboard
  if (variant === 'dashboard') {
    return (
      <footer className={cn(
        'bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-4',
        className
      )}>
        <div className="px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-2">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              &copy; {currentYear} ShopSense AI. Tous droits réservés.
            </p>
            <div className="flex items-center space-x-4">
              <Link href="/terms" className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors">
                Conditions
              </Link>
              <Link href="/privacy" className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors">
                Confidentialité
              </Link>
              <Link href="/support" className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors">
                Support
              </Link>
            </div>
          </div>
        </div>
      </footer>
    );
  }

  // Version par défaut
  const footerLinks = [
    {
      title: 'ShopSense AI',
      links: [
        { label: 'À propos', href: '/about' },
        { label: 'Contact', href: '/contact' },
        { label: 'Blog', href: '/blog' },
        { label: 'Carrières', href: '/careers' },
        { label: 'Presse', href: '/press' },
      ],
    },
    {
      title: 'Aide',
      links: [
        { label: 'FAQ', href: '/faq' },
        { label: 'Livraison', href: '/delivery' },
        { label: 'Retours', href: '/returns' },
        { label: 'Paiement', href: '/payment' },
        { label: 'Garantie', href: '/warranty' },
      ],
    },
    {
      title: 'Légal',
      links: [
        { label: 'Conditions d\'utilisation', href: '/terms' },
        { label: 'Politique de confidentialité', href: '/privacy' },
        { label: 'Politique des cookies', href: '/cookies' },
        { label: 'Mentions légales', href: '/legal' },
        { label: 'Accessibilité', href: '/accessibility' },
      ],
    },
  ];

  const socialLinks = [
    { icon: Facebook, href: 'https://facebook.com', label: 'Facebook' },
    { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
    { icon: Instagram, href: 'https://instagram.com', label: 'Instagram' },
    { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
    { icon: Youtube, href: 'https://youtube.com', label: 'YouTube' },
  ];

  const features = [
    { icon: Truck, label: 'Livraison rapide', description: 'Sous 24-48h' },
    { icon: Shield, label: 'Paiement sécurisé', description: '100% garanti' },
    { icon: CreditCard, label: 'Paiement flexible', description: 'Plusieurs options' },
    { icon: Heart, label: 'Service client', description: '7j/7' },
  ];

  return (
    <footer className={cn(
      'bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800',
      className
    )}>
      <div className="container mx-auto px-4">
        {/* Features */}
        <div className="py-8 border-b border-gray-200 dark:border-gray-800">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {features.map((feature) => (
              <div key={feature.label} className="flex items-center space-x-3">
                <feature.icon className="w-6 h-6 text-primary-600 dark:text-primary-400 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{feature.label}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Footer */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">ShopSense</span>
              <span className="text-2xl font-bold text-gray-800 dark:text-gray-200">AI</span>
            </Link>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Plateforme intelligente qui simplifie les achats internationaux au Sénégal et en Afrique de l'Ouest.
            </p>
            <div className="flex items-center space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact Info */}
        <div className="border-t border-gray-200 dark:border-gray-800 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-3">
              <MapPin className="w-5 h-5 text-primary-600 dark:text-primary-400 flex-shrink-0" />
              <span className="text-sm text-gray-600 dark:text-gray-300">
                Dakar, Sénégal
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <Phone className="w-5 h-5 text-primary-600 dark:text-primary-400 flex-shrink-0" />
              <span className="text-sm text-gray-600 dark:text-gray-300">
                +221 77 000 00 00
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <Mail className="w-5 h-5 text-primary-600 dark:text-primary-400 flex-shrink-0" />
              <span className="text-sm text-gray-600 dark:text-gray-300">
                contact@shopsense-ai.com
              </span>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-200 dark:border-gray-800 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              &copy; {currentYear} ShopSense AI. Tous droits réservés.
            </p>
            <div className="flex items-center space-x-6">
              <Link href="/terms" className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors">
                Conditions d'utilisation
              </Link>
              <Link href="/privacy" className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors">
                Politique de confidentialité
              </Link>
              <Link href="/cookies" className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}