"use client";

import { useRef, useCallback, useState } from "react";
import { Card, CardBody, CardHeader, CardFooter } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { formatPrice, formatDate, formatDateTime } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks";
import {
  Download,
  Printer,
  Mail,
  Share2,
  FileText,
  Calendar,
  User,
  MapPin,
  Phone,
  Copy,
  Check,
} from "lucide-react";

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface OrderInvoiceProps {
  orderId: string;
  orderNumber: string;
  orderDate: Date;
  customer: {
    name: string;
    email: string;
    phone?: string;
    address?: string;
  };
  items: InvoiceItem[];
  subtotal: number;
  shippingCost: number;
  tax: number;
  discount: number;
  total: number;
  paymentMethod: string;
  paymentStatus: "pending" | "completed" | "failed" | "refunded";
  company?: {
    name: string;
    address: string;
    phone: string;
    email: string;
    website: string;
    logo?: string;
  };
  className?: string;
  onDownload?: () => void;
  onPrint?: () => void;
  onEmail?: () => void;
  onShare?: () => void;
  onCopy?: () => void;
}

export default function OrderInvoice({
  orderNumber,
  orderDate,
  customer,
  items,
  subtotal,
  shippingCost,
  tax,
  discount,
  total,
  paymentMethod,
  paymentStatus,
  company = {
    name: "ShopSense AI",
    address: "Dakar, Sénégal",
    phone: "+221 77 000 00 00",
    email: "contact@shopsense-ai.com",
    website: "www.shopsense-ai.com",
  },
  className = "",
  onDownload,
  onPrint,
  onEmail,
  onShare,
  onCopy,
}: OrderInvoiceProps) {
  const { success } = useToast();
  const [isCopied, setIsCopied] = useState(false);
  const invoiceRef = useRef<HTMLDivElement>(null);

  const paymentStatusConfig = {
    pending: {
      label: "En attente",
      color:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
    },
    completed: {
      label: "Payée",
      color:
        "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    },
    failed: {
      label: "Échoué",
      color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
    },
    refunded: {
      label: "Remboursée",
      color:
        "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
    },
  };

  const handlePrint = useCallback(() => {
    window.print();
    if (onPrint) {
      onPrint();
    }
  }, [onPrint]);

  const handleCopy = useCallback(async () => {
    if (invoiceRef.current) {
      try {
        await navigator.clipboard.writeText(
          invoiceRef.current.textContent || "",
        );
        setIsCopied(true);
        success("Facture copiée dans le presse-papier");
        setTimeout(() => setIsCopied(false), 2000);
        if (onCopy) {
          onCopy();
        }
      } catch {
        // Fallback
        const text = invoiceRef.current.textContent || "";
        const textarea = document.createElement("textarea");
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
        setIsCopied(true);
        success("Facture copiée dans le presse-papier");
        setTimeout(() => setIsCopied(false), 2000);
      }
    }
  }, [success, onCopy]);

  return (
    <div ref={invoiceRef} className={cn("w-full", className)}>
      <Card className="w-full print:shadow-none print:border-0">
        {/* En-tête */}
        <CardHeader className="border-b border-gray-200 dark:border-gray-700 print:border-b-2">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2">
                <FileText className="w-6 h-6 text-primary-600" />
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Facture
                </h2>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Réf: #{orderNumber}
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500">
                Émise le {formatDateTime(orderDate)}
              </p>
            </div>
            <div className="flex flex-col items-end space-y-2">
              <span
                className={cn(
                  "text-sm font-medium",
                  paymentStatusConfig[paymentStatus].color,
                )}
              >
                {paymentStatusConfig[paymentStatus].label}
              </span>
              <div className="text-right">
                <p className="text-sm font-bold text-gray-900 dark:text-white">
                  {company.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {company.address}
                </p>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardBody className="space-y-6">
          {/* Informations */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center space-x-2">
                <User className="w-4 h-4" />
                <span>Client</span>
              </h3>
              <div className="mt-2 space-y-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {customer.name}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {customer.email}
                </p>
                {customer.phone && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center space-x-1">
                    <Phone className="w-3 h-3" />
                    <span>{customer.phone}</span>
                  </p>
                )}
                {customer.address && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 flex items-start space-x-1">
                    <MapPin className="w-3 h-3 mt-0.5" />
                    <span>{customer.address}</span>
                  </p>
                )}
              </div>
            </div>
            <div className="sm:text-right">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center space-x-2 sm:justify-end">
                <Calendar className="w-4 h-4" />
                <span>Détails</span>
              </h3>
              <div className="mt-2 space-y-1">
                <div className="flex items-center space-x-2 sm:justify-end">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Date:
                  </span>
                  <span className="text-sm text-gray-900 dark:text-white">
                    {formatDate(orderDate)}
                  </span>
                </div>
                <div className="flex items-center space-x-2 sm:justify-end">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Paiement:
                  </span>
                  <span className="text-sm text-gray-900 dark:text-white">
                    {paymentMethod}
                  </span>
                </div>
                <div className="flex items-center space-x-2 sm:justify-end">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Articles:
                  </span>
                  <span className="text-sm text-gray-900 dark:text-white">
                    {items.length}
                  </span>
                </div>
                <div className="flex items-center space-x-2 sm:justify-end">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Facture:
                  </span>
                  <span className="text-sm font-mono text-gray-900 dark:text-white">
                    #{orderNumber}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Articles */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="py-2 text-left text-gray-600 dark:text-gray-400">
                    Description
                  </th>
                  <th className="py-2 text-center text-gray-600 dark:text-gray-400">
                    Qté
                  </th>
                  <th className="py-2 text-right text-gray-600 dark:text-gray-400">
                    Prix unitaire
                  </th>
                  <th className="py-2 text-right text-gray-600 dark:text-gray-400">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-gray-100 dark:border-gray-800"
                  >
                    <td className="py-2 text-gray-900 dark:text-white">
                      {item.description}
                    </td>
                    <td className="py-2 text-center text-gray-600 dark:text-gray-400">
                      {item.quantity}
                    </td>
                    <td className="py-2 text-right text-gray-600 dark:text-gray-400">
                      {formatPrice(item.unitPrice)}
                    </td>
                    <td className="py-2 text-right font-medium text-gray-900 dark:text-white">
                      {formatPrice(item.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td
                    colSpan={3}
                    className="py-2 text-right text-gray-600 dark:text-gray-400"
                  >
                    Sous-total
                  </td>
                  <td className="py-2 text-right text-gray-900 dark:text-white">
                    {formatPrice(subtotal)}
                  </td>
                </tr>
                {shippingCost > 0 && (
                  <tr>
                    <td
                      colSpan={3}
                      className="py-2 text-right text-gray-600 dark:text-gray-400"
                    >
                      Livraison
                    </td>
                    <td className="py-2 text-right text-gray-900 dark:text-white">
                      {formatPrice(shippingCost)}
                    </td>
                  </tr>
                )}
                {tax > 0 && (
                  <tr>
                    <td
                      colSpan={3}
                      className="py-2 text-right text-gray-600 dark:text-gray-400"
                    >
                      Taxes
                    </td>
                    <td className="py-2 text-right text-gray-900 dark:text-white">
                      {formatPrice(tax)}
                    </td>
                  </tr>
                )}
                {discount > 0 && (
                  <tr>
                    <td
                      colSpan={3}
                      className="py-2 text-right text-red-600 dark:text-red-400"
                    >
                      Réduction
                    </td>
                    <td className="py-2 text-right text-red-600 dark:text-red-400">
                      -{formatPrice(discount)}
                    </td>
                  </tr>
                )}
                <tr className="border-t-2 border-gray-300 dark:border-gray-600">
                  <td
                    colSpan={3}
                    className="py-3 text-right text-base font-bold text-gray-900 dark:text-white"
                  >
                    Total
                  </td>
                  <td className="py-3 text-right text-lg font-bold text-primary-600 dark:text-primary-400">
                    {formatPrice(total)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Notes */}
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-sm text-gray-500 dark:text-gray-400 space-y-1">
            <p className="font-medium text-gray-700 dark:text-gray-300">
              Informations
            </p>
            <ul className="list-disc list-inside space-y-0.5">
              <li>Facture générée automatiquement</li>
              <li>Paiement sécurisé</li>
              <li>Livraison sous 24-48h</li>
              <li>Retour possible sous 14 jours</li>
            </ul>
          </div>

          {/* Mentions légales */}
          <div className="text-xs text-center text-gray-400 dark:text-gray-500 border-t border-gray-200 dark:border-gray-700 pt-4">
            <p>
              {company.name} - {company.address}
            </p>
            <p>
              Tel: {company.phone} - Email: {company.email}
            </p>
            <p>Web: {company.website}</p>
          </div>
        </CardBody>

        <CardFooter className="flex flex-wrap gap-2 justify-end pt-4 print:hidden">
          <Button variant="outline" size="sm" onClick={handlePrint}>
            <Printer className="w-4 h-4 mr-2" />
            Imprimer
          </Button>
          <Button variant="outline" size="sm" onClick={onDownload}>
            <Download className="w-4 h-4 mr-2" />
            Télécharger
          </Button>
          <Button variant="outline" size="sm" onClick={onEmail}>
            <Mail className="w-4 h-4 mr-2" />
            Envoyer
          </Button>
          <Button variant="outline" size="sm" onClick={onShare}>
            <Share2 className="w-4 h-4 mr-2" />
            Partager
          </Button>
          <Button variant="outline" size="sm" onClick={handleCopy}>
            {isCopied ? (
              <>
                <Check className="w-4 h-4 mr-2 text-green-500" />
                Copié
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 mr-2" />
                Copier
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
