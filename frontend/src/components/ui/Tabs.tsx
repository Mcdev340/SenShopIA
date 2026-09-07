"use client";

import React, { createContext, useContext, useState } from "react";
import { cn } from "@/lib/utils";

// ============ CONTEXT ============

interface TabsContextValue {
  activeTab: string;
  setActiveTab: (value: string) => void;
  variant: "default" | "pills" | "underline" | "bordered";
  size: "sm" | "md" | "lg";
}

const TabsContext = createContext<TabsContextValue | null>(null);

const useTabs = () => {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error("Tabs components must be used within a Tabs component");
  }
  return context;
};

// ============ TYPES ============

interface TabsProps {
  children: React.ReactNode;
  defaultValue?: string;
  value?: string;
  onChange?: (value: string) => void;
  variant?: "default" | "pills" | "underline" | "bordered";
  size?: "sm" | "md" | "lg";
  className?: string;
  fullWidth?: boolean;
}

interface TabsListProps {
  children: React.ReactNode;
  className?: string;
}

interface TabsTriggerProps {
  value: string;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  icon?: React.ReactNode;
}

interface TabsContentProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

// ============ TABS ============

export const Tabs = ({
  children,
  defaultValue = "",
  value: controlledValue,
  onChange,
  variant = "default",
  size = "md",
  className = "",
  fullWidth = false,
}: TabsProps) => {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const activeTab =
    controlledValue !== undefined ? controlledValue : internalValue;

  const setActiveTab = (value: string) => {
    if (controlledValue === undefined) {
      setInternalValue(value);
    }
    if (onChange) {
      onChange(value);
    }
  };

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab, variant, size }}>
      <div className={cn("w-full", fullWidth && "flex", className)}>
        {children}
      </div>
    </TabsContext.Provider>
  );
};

// ============ TABS LIST ============

export const TabsList = ({ children, className = "" }: TabsListProps) => {
  const { variant, size, activeTab } = useTabs();

  const variantClasses = {
    default: "border-b border-gray-200 dark:border-gray-700",
    pills: "bg-gray-100 dark:bg-gray-800 p-1 rounded-lg",
    underline: "border-b-2 border-gray-200 dark:border-gray-700",
    bordered: "border border-gray-200 dark:border-gray-700 rounded-lg p-1",
  };

  const sizeClasses = {
    sm: "gap-1 text-sm",
    md: "gap-2 text-base",
    lg: "gap-3 text-lg",
  };

  return (
    <div
      className={cn(
        "flex items-center",
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      role="tablist"
    >
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, {
            "aria-selected": child.props.value === activeTab,
          } as any);
        }
        return child;
      })}
    </div>
  );
};

// ============ TABS TRIGGER ============

export const TabsTrigger = ({
  value,
  children,
  className = "",
  disabled = false,
  icon,
}: TabsTriggerProps) => {
  const { activeTab, setActiveTab, variant, size } = useTabs();
  const isActive = activeTab === value;

  const variantClasses = {
    default: cn(
      "border-b-2 border-transparent hover:border-gray-300 dark:hover:border-gray-600",
      isActive &&
        "border-primary-600 text-primary-600 dark:border-primary-400 dark:text-primary-400",
    ),
    pills: cn(
      "rounded-md hover:bg-gray-200 dark:hover:bg-gray-700",
      isActive && "bg-white dark:bg-gray-700 shadow-sm",
    ),
    underline: cn(
      "border-b-2 border-transparent hover:border-gray-300 dark:hover:border-gray-600",
      isActive &&
        "border-primary-600 text-primary-600 dark:border-primary-400 dark:text-primary-400",
    ),
    bordered: cn(
      "rounded-md hover:bg-gray-50 dark:hover:bg-gray-800",
      isActive &&
        "bg-gray-50 dark:bg-gray-800 border-primary-600 dark:border-primary-400",
    ),
  };

  const sizeClasses = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-5 py-2.5 text-base",
  };

  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      aria-controls={`tab-${value}`}
      id={`tab-trigger-${value}`}
      onClick={() => !disabled && setActiveTab(value)}
      disabled={disabled}
      className={cn(
        "flex items-center gap-2 font-medium transition-all whitespace-nowrap",
        variantClasses[variant],
        sizeClasses[size],
        isActive && "font-semibold",
        disabled && "opacity-50 cursor-not-allowed",
        className,
      )}
    >
      {icon}
      {children}
    </button>
  );
};

// ============ TABS CONTENT ============

export const TabsContent = ({
  value,
  children,
  className = "",
}: TabsContentProps) => {
  const { activeTab } = useTabs();

  if (activeTab !== value) return null;

  return (
    <div
      role="tabpanel"
      id={`tab-${value}`}
      aria-labelledby={`tab-trigger-${value}`}
      className={cn("mt-4", className)}
    >
      {children}
    </div>
  );
};

export default Tabs;
