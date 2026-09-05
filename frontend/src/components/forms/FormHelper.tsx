"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Info, HelpCircle, Lightbulb } from "lucide-react";
import { useFormField } from "./FormField";

interface FormHelperProps extends React.HTMLAttributes<HTMLParagraphElement> {
  /** Taille de l'aide */
  size?: "sm" | "md" | "lg";
  /** Afficher l'icône */
  showIcon?: boolean;
  /** Type d'icône */
  iconType?: "info" | "help" | "lightbulb";
  /** Classe supplémentaire */
  className?: string;
  /** Enfants */
  children: React.ReactNode;
}

export default function FormHelper({
  size = "sm",
  showIcon = true,
  iconType = "info",
  className = "",
  children,
  ...props
}: FormHelperProps) {
  const context = useFormField();

  // Ne pas afficher si pas de message
  if (!children) {
    return null;
  }

  // Ne pas afficher si erreur
  if (context.hasError) {
    return null;
  }

  const sizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  const IconMap = {
    info: Info,
    help: HelpCircle,
    lightbulb: Lightbulb,
  };

  const Icon = IconMap[iconType] || Info;

  return (
    <p
      className={cn(
        "text-gray-500 dark:text-gray-400 flex items-start gap-1.5",
        sizeClasses[size],
        className,
      )}
      {...props}
    >
      {showIcon && <Icon className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />}
      <span>{children}</span>
    </p>
  );
}
