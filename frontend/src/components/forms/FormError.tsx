"use client";

import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { AlertCircle, XCircle } from "lucide-react";
import { useFormField } from "./FormField";

interface FormErrorProps extends React.HTMLAttributes<HTMLParagraphElement> {
  /** Taille de l'erreur */
  size?: "sm" | "md" | "lg";
  /** Afficher l'icône */
  showIcon?: boolean;
  /** Type d'icône */
  iconType?: "alert" | "x";
  /** Animation d'entrée */
  animate?: boolean;
  /** Classe supplémentaire */
  className?: string;
  /** Enfants */
  children: React.ReactNode;
}

export default function FormError({
  size = "sm",
  showIcon = true,
  iconType = "alert",
  animate = true,
  className = "",
  children,
  ...props
}: FormErrorProps) {
  const context = useFormField();
  const [isVisible, setIsVisible] = useState(false);

  // Ne pas afficher si pas d'erreur
  if (!children) {
    return null;
  }

  // Ne pas afficher si le champ n'est pas touché (sauf erreur de validation)
  const shouldShow = context.isTouched && context.hasError;

  useEffect(() => {
    if (shouldShow) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [shouldShow]);

  if (!shouldShow) {
    return null;
  }

  const sizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  const Icon = iconType === "x" ? XCircle : AlertCircle;

  return (
    <p
      className={cn(
        "text-red-600 dark:text-red-400 flex items-start gap-1.5 transition-all duration-200",
        sizeClasses[size],
        animate && "animate-slideIn",
        className,
      )}
      role="alert"
      aria-live="polite"
      {...props}
    >
      {showIcon && <Icon className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />}
      <span>{children}</span>
    </p>
  );
}
