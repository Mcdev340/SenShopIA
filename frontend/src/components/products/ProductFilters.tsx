"use client";

import React, { useState, useCallback, useMemo } from "react";
import {
  SlidersHorizontal,
  X,
  ChevronDown,
  ChevronUp,
  Filter,
  Search,
  RotateCcw,
  Check,
} from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Checkbox } from "@/components/ui/Checkbox";
import { Radio } from "@/components/ui/Radio";
import { cn } from "@/lib/utils";

interface FilterOption {
  id: string;
  label: string;
  count?: number;
  checked?: boolean;
}

interface FilterSection {
  id: string;
  title: string;
  type: "checkbox" | "radio" | "range" | "search";
  options?: FilterOption[];
  min?: number;
  max?: number;
  step?: number;
  value?: any;
}

interface ProductFiltersProps {
  filters: FilterSection[];
  selectedFilters: Record<string, any>;
  onFilterChange: (filterId: string, value: any) => void;
  onClearAll: () => void;
  onApply: () => void;
  className?: string;
  isMobile?: boolean;
  onClose?: () => void;
}

export default function ProductFilters({
  filters,
  selectedFilters,
  onFilterChange,
  onClearAll,
  onApply,
  className = "",
  isMobile = false,
  onClose,
}: ProductFiltersProps) {
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >(filters.reduce((acc, f) => ({ ...acc, [f.id]: true }), {}));

  const [searchTerms, setSearchTerms] = useState<Record<string, string>>({});
  const [localFilters, setLocalFilters] =
    useState<Record<string, any>>(selectedFilters);

  const toggleSection = useCallback((sectionId: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  }, []);

  const handleSearchChange = useCallback((sectionId: string, value: string) => {
    setSearchTerms((prev) => ({ ...prev, [sectionId]: value }));
  }, []);

  const handleFilterChange = useCallback(
    (filterId: string, value: any) => {
      setLocalFilters((prev) => ({ ...prev, [filterId]: value }));
      onFilterChange(filterId, value);
    },
    [onFilterChange],
  );

  const getFilteredOptions = useCallback(
    (section: FilterSection) => {
      if (!section.options) return [];
      const searchTerm = searchTerms[section.id]?.toLowerCase() || "";
      if (!searchTerm) return section.options;
      return section.options.filter((opt) =>
        opt.label.toLowerCase().includes(searchTerm),
      );
    },
    [searchTerms],
  );

  const getActiveFiltersCount = useCallback(() => {
    return Object.keys(selectedFilters).filter((key) => {
      const value = selectedFilters[key];
      if (Array.isArray(value)) return value.length > 0;
      if (typeof value === "boolean") return value;
      if (typeof value === "number") return value > 0;
      return value !== null && value !== undefined && value !== "";
    }).length;
  }, [selectedFilters]);

  const renderSection = (section: FilterSection) => {
    const isExpanded = expandedSections[section.id] !== false;
    const filteredOptions = getFilteredOptions(section);
    const isActive = (() => {
      const value = selectedFilters[section.id];
      if (Array.isArray(value)) return value.length > 0;
      if (typeof value === "boolean") return value;
      if (typeof value === "number") return value > 0;
      return value !== null && value !== undefined && value !== "";
    })();

    return (
      <div
        key={section.id}
        className="border-b border-gray-200 dark:border-gray-700 last:border-0"
      >
        <button
          onClick={() => toggleSection(section.id)}
          className="flex items-center justify-between w-full py-3 text-left group"
        >
          <div className="flex items-center space-x-2">
            <span className="font-medium text-gray-900 dark:text-white">
              {section.title}
            </span>
            {isActive && (
              <span className="w-2 h-2 bg-primary-600 rounded-full" />
            )}
          </div>
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300" />
          )}
        </button>

        {isExpanded && (
          <div className="pb-3 space-y-3">
            {/* Search */}
            {section.type === "search" && (
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder={`Rechercher dans ${section.title.toLowerCase()}`}
                  value={searchTerms[section.id] || ""}
                  onChange={(e) =>
                    handleSearchChange(section.id, e.target.value)
                  }
                  className="pl-9"
                />
              </div>
            )}

            {/* Range */}
            {section.type === "range" && (
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="Min"
                    value={
                      selectedFilters[`${section.id}_min`] || section.min || ""
                    }
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      handleFilterChange(`${section.id}_min`, val);
                    }}
                    className="w-1/2"
                  />
                  <Input
                    type="number"
                    placeholder="Max"
                    value={
                      selectedFilters[`${section.id}_max`] || section.max || ""
                    }
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      handleFilterChange(`${section.id}_max`, val);
                    }}
                    className="w-1/2"
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>
                    {selectedFilters[`${section.id}_min`] || section.min || 0}{" "}
                    FCFA
                  </span>
                  <span>
                    {selectedFilters[`${section.id}_max`] ||
                      section.max ||
                      1000000}{" "}
                    FCFA
                  </span>
                </div>
              </div>
            )}

            {/* Checkbox */}
            {section.type === "checkbox" && (
              <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                {filteredOptions.map((option) => {
                  const isChecked = Array.isArray(selectedFilters[section.id])
                    ? selectedFilters[section.id].includes(option.id)
                    : false;
                  return (
                    <div key={option.id} className="flex items-center">
                      <Checkbox
                        id={`${section.id}-${option.id}`}
                        checked={isChecked}
                        onCheckedChange={(checked) => {
                          const current = selectedFilters[section.id] || [];
                          const newValue = checked
                            ? [...current, option.id]
                            : current.filter((id: string) => id !== option.id);
                          handleFilterChange(section.id, newValue);
                        }}
                      />
                      <label
                        htmlFor={`${section.id}-${option.id}`}
                        className="ml-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer flex items-center justify-between w-full"
                      >
                        <span>{option.label}</span>
                        {option.count !== undefined && (
                          <span className="text-xs text-gray-400">
                            ({option.count})
                          </span>
                        )}
                      </label>
                    </div>
                  );
                })}
                {filteredOptions.length === 0 && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Aucun résultat
                  </p>
                )}
              </div>
            )}

            {/* Radio */}
            {section.type === "radio" && (
              <div className="space-y-2">
                <div className="flex items-center">
                  <Radio
                    id={`${section.id}-all`}
                    name={section.id}
                    checked={!selectedFilters[section.id]}
                    onChange={() => handleFilterChange(section.id, null)}
                  />
                  <label
                    htmlFor={`${section.id}-all`}
                    className="ml-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer"
                  >
                    Tous
                  </label>
                </div>
                {filteredOptions.map((option) => (
                  <div key={option.id} className="flex items-center">
                    <Radio
                      id={`${section.id}-${option.id}`}
                      name={section.id}
                      checked={selectedFilters[section.id] === option.id}
                      onChange={() => handleFilterChange(section.id, option.id)}
                    />
                    <label
                      htmlFor={`${section.id}-${option.id}`}
                      className="ml-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer flex items-center justify-between w-full"
                    >
                      <span>{option.label}</span>
                      {option.count !== undefined && (
                        <span className="text-xs text-gray-400">
                          ({option.count})
                        </span>
                      )}
                    </label>
                  </div>
                ))}
                {filteredOptions.length === 0 && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Aucun résultat
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  const activeFiltersCount = getActiveFiltersCount();

  // Version mobile
  if (isMobile) {
    return (
      <div
        className={cn(
          "fixed inset-0 z-50 bg-white dark:bg-gray-900 flex flex-col",
          className,
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-500" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Filtres
            </h2>
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {activeFiltersCount}
              </Badge>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {filters.map(renderSection)}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex gap-2">
          <Button variant="outline" className="flex-1" onClick={onClearAll}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Réinitialiser
          </Button>
          <Button
            className="flex-1"
            onClick={() => {
              onApply();
              if (onClose) onClose();
            }}
          >
            <Check className="w-4 h-4 mr-2" />
            Appliquer ({activeFiltersCount})
          </Button>
        </div>
      </div>
    );
  }

  // Version desktop
  return (
    <Card className={cn("w-full sticky top-24", className)}>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <h3 className="font-semibold text-gray-900 dark:text-white">
            Filtres
          </h3>
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="ml-1">
              {activeFiltersCount}
            </Badge>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearAll}
          className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400"
        >
          Réinitialiser
        </Button>
      </CardHeader>
      <CardBody className="space-y-2">{filters.map(renderSection)}</CardBody>
    </Card>
  );
}
