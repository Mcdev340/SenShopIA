"use client";

import React, { useState, useRef, useEffect } from "react";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { Download, Loader2, Maximize2, Minimize2 } from "lucide-react";

type TimeRange = "7d" | "30d" | "90d" | "12m" | "all";

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    color?: string;
    fill?: boolean;
  }[];
}

interface ChartCardProps {
  title: string;
  subtitle?: string;
  data: ChartData;
  type?: "line" | "bar" | "area";
  height?: number;
  showLegend?: boolean;
  showTimeRange?: boolean;
  showDownload?: boolean;
  timeRangeOptions?: { label: string; value: TimeRange }[];
  defaultTimeRange?: TimeRange;
  onTimeRangeChange?: (range: TimeRange) => void;
  className?: string;
  loading?: boolean;
  children?: React.ReactNode;
}

const defaultTimeRanges = [
  { label: "7j", value: "7d" as TimeRange },
  { label: "30j", value: "30d" as TimeRange },
  { label: "90j", value: "90d" as TimeRange },
  { label: "12m", value: "12m" as TimeRange },
  { label: "Tout", value: "all" as TimeRange },
];

export default function ChartCard({
  title,
  subtitle,
  data,
  type = "line",
  height = 300,
  showLegend = true,
  showTimeRange = true,
  showDownload = true,
  timeRangeOptions = defaultTimeRanges,
  defaultTimeRange = "30d",
  onTimeRangeChange,
  className = "",
  loading = false,
  children,
}: ChartCardProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>(defaultTimeRange);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [hoveredPoint, setHoveredPoint] = useState<{
    index: number;
    datasetIndex: number;
  } | null>(null);
  const chartRef = useRef<HTMLDivElement>(null);

  const handleTimeRangeChange = (range: TimeRange) => {
    setTimeRange(range);
    if (onTimeRangeChange) {
      onTimeRangeChange(range);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      chartRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  // Calculer les valeurs min/max pour l'échelle
  const allData = data.datasets.flatMap((d) => d.data);
  const maxValue = Math.max(...allData) * 1.15;
  const minValue = Math.min(...allData) * 0.85;

  // Générer les points du graphique
  const generatePath = (dataset: { data: number[]; color?: string }) => {
    const points = dataset.data
      .map((value, index) => {
        const x = (index / (dataset.data.length - 1)) * 100;
        const y = 100 - ((value - minValue) / (maxValue - minValue)) * 100;
        return `${x},${y}`;
      })
      .join(" ");

    return points;
  };

  return (
    <div ref={chartRef}>
      <Card
        className={cn(
          "w-full",
          isFullscreen && "fixed inset-0 z-50 rounded-none",
          className,
        )}
      >
        <CardHeader className="pb-0">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {title}
              </h3>
              {subtitle && (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {subtitle}
                </p>
              )}
            </div>
            <div className="flex items-center space-x-2 flex-wrap gap-2">
              {showTimeRange && (
                <div className="flex items-center p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
                  {timeRangeOptions.map((range) => (
                    <button
                      key={range.value}
                      onClick={() => handleTimeRangeChange(range.value)}
                      className={cn(
                        "px-3 py-1 text-xs font-medium rounded-md transition-colors",
                        timeRange === range.value
                          ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                          : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300",
                      )}
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
              )}
              <Button
                variant="outline"
                size="sm"
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                onClick={toggleFullscreen}
                aria-label={
                  isFullscreen ? "Quitter le plein écran" : "Plein écran"
                }
              >
                {isFullscreen ? (
                  <Minimize2 className="w-4 h-4" />
                ) : (
                  <Maximize2 className="w-4 h-4" />
                )}
              </Button>
              {showDownload && (
                <Button
                  variant="outline"
                  size="sm"
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  aria-label="Télécharger"
                >
                  <Download className="w-4 h-4" />
                </Button>
              )}
              {children}
            </div>
          </div>
        </CardHeader>

        <CardBody className="pt-4">
          {loading ? (
            <div
              className="w-full bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse flex items-center justify-center"
              style={{ height }}
            >
              <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
            </div>
          ) : (
            <div className="relative" style={{ height }}>
              {/* Graphique SVG */}
              <svg
                width="100%"
                height="100%"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                className="overflow-visible"
                onMouseLeave={() => setHoveredPoint(null)}
              >
                {/* Grille */}
                <g className="stroke-gray-200 dark:stroke-gray-700 stroke-1">
                  {[0, 25, 50, 75, 100].map((y) => (
                    <line
                      key={y}
                      x1="0"
                      y1={y}
                      x2="100"
                      y2={y}
                      strokeDasharray="2,2"
                    />
                  ))}
                </g>

                {/* Zones */}
                {type === "area" &&
                  data.datasets.map((dataset, index) => {
                    const points = generatePath(dataset);
                    const color =
                      dataset.color || (index === 0 ? "#3B82F6" : "#10B981");
                    return (
                      <polygon
                        key={index}
                        points={`0,100 ${points} 100,100`}
                        fill={`${color}20`}
                        className="transition-all duration-300"
                      />
                    );
                  })}

                {/* Lignes */}
                {["line", "area"].includes(type) &&
                  data.datasets.map((dataset, index) => {
                    const points = generatePath(dataset);
                    const color =
                      dataset.color || (index === 0 ? "#3B82F6" : "#10B981");
                    return (
                      <polyline
                        key={index}
                        points={points}
                        fill="none"
                        stroke={color}
                        strokeWidth="2"
                        className="transition-all duration-300"
                      />
                    );
                  })}

                {/* Barres */}
                {type === "bar" &&
                  data.datasets.map((dataset, index) => {
                    const barWidth =
                      100 /
                      (dataset.data.length * data.datasets.length +
                        data.datasets.length -
                        1);
                    const offset =
                      (index - (data.datasets.length - 1) / 2) * barWidth;
                    const color =
                      dataset.color || (index === 0 ? "#3B82F6" : "#10B981");
                    return dataset.data.map((value, i) => {
                      const x = (i / (dataset.data.length - 1)) * 100 + offset;
                      const y =
                        100 -
                        ((value - minValue) / (maxValue - minValue)) * 100;
                      const barHeight =
                        ((value - minValue) / (maxValue - minValue)) * 100;
                      return (
                        <rect
                          key={`${index}-${i}`}
                          x={x - barWidth / 2}
                          y={y}
                          width={barWidth}
                          height={barHeight}
                          fill={color}
                          rx="1"
                          className="transition-all duration-300 cursor-pointer hover:opacity-80"
                          onMouseEnter={() =>
                            setHoveredPoint({ index: i, datasetIndex: index })
                          }
                          onMouseLeave={() => setHoveredPoint(null)}
                        />
                      );
                    });
                  })}

                {/* Points (pour line) */}
                {type === "line" &&
                  data.datasets.map((dataset, index) => {
                    const color =
                      dataset.color || (index === 0 ? "#3B82F6" : "#10B981");
                    return dataset.data.map((value, i) => {
                      const x = (i / (dataset.data.length - 1)) * 100;
                      const y =
                        100 -
                        ((value - minValue) / (maxValue - minValue)) * 100;
                      const isHovered =
                        hoveredPoint?.index === i &&
                        hoveredPoint?.datasetIndex === index;
                      return (
                        <circle
                          key={`${index}-${i}`}
                          cx={x}
                          cy={y}
                          r={isHovered ? "3" : "1.5"}
                          fill={color}
                          className="transition-all duration-300 cursor-pointer"
                          onMouseEnter={() =>
                            setHoveredPoint({ index: i, datasetIndex: index })
                          }
                          onMouseLeave={() => setHoveredPoint(null)}
                        />
                      );
                    });
                  })}

                {/* Tooltip */}
                {hoveredPoint && (
                  <g>
                    <line
                      x1={(hoveredPoint.index / (data.labels.length - 1)) * 100}
                      y1="0"
                      x2={(hoveredPoint.index / (data.labels.length - 1)) * 100}
                      y2="100"
                      stroke="#000"
                      strokeOpacity="0.1"
                      strokeDasharray="2,2"
                    />
                  </g>
                )}

                {/* Labels */}
                <g className="text-[3px] fill-gray-400 dark:fill-gray-500">
                  {data.labels.map((label, i) => {
                    const x = (i / (data.labels.length - 1)) * 100;
                    const isHovered = hoveredPoint?.index === i;
                    return (
                      <text
                        key={i}
                        x={x}
                        y="105"
                        textAnchor="middle"
                        className={cn(
                          "font-medium transition-colors",
                          isHovered && "fill-gray-700 dark:fill-gray-300",
                        )}
                      >
                        {label}
                      </text>
                    );
                  })}
                </g>
              </svg>
            </div>
          )}

          {/* Légende */}
          {showLegend && !loading && data.datasets.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-4 mt-4">
              {data.datasets.map((dataset, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{
                      backgroundColor:
                        dataset.color || (index === 0 ? "#3B82F6" : "#10B981"),
                    }}
                  />
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    {dataset.label}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}

// Hook pour créer des données de chart par défaut
export const useDefaultChartData = () => {
  const labels = [
    "Jan",
    "Fév",
    "Mar",
    "Avr",
    "Mai",
    "Jun",
    "Jul",
    "Aoû",
    "Sep",
    "Oct",
    "Nov",
    "Déc",
  ];
  const data: ChartData = {
    labels,
    datasets: [
      {
        label: "Commandes",
        data: [45, 52, 38, 65, 48, 72, 58, 80, 62, 90, 75, 85],
        color: "#3B82F6",
      },
      {
        label: "Revenus",
        data: [120, 150, 100, 180, 140, 200, 160, 250, 190, 280, 210, 300],
        color: "#10B981",
      },
    ],
  };

  return data;
};
