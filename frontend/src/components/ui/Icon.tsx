"use client";

import React from "react";
import { cn } from "@/lib/utils";
import * as LucideIcons from "lucide-react";

interface IconProps extends React.SVGAttributes<SVGSVGElement> {
  name: keyof typeof LucideIcons;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  color?: string;
  strokeWidth?: number;
}

const sizes = {
  xs: "h-3 w-3",
  sm: "h-4 w-4",
  md: "h-5 w-5",
  lg: "h-6 w-6",
  xl: "h-8 w-8",
};

export const Icon = ({
  name,
  size = "md",
  color,
  strokeWidth = 2,
  className,
  ...props
}: IconProps) => {
  const IconComponent = LucideIcons[name] as React.ComponentType<
    React.SVGProps<SVGSVGElement>
  >;

  if (!IconComponent) {
    console.warn(`Icon "${name}" not found in Lucide icons`);
    return null;
  }

  return (
    <IconComponent
      className={cn(sizes[size], className)}
      strokeWidth={strokeWidth}
      color={color}
      {...props}
    />
  );
};

export default Icon;
