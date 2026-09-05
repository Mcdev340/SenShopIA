"use client";

import React, { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  X,
  ZoomIn,
  Maximize2,
  Minimize2,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductImagesProps {
  images: string[];
  name: string;
  className?: string;
}

export default function ProductImages({
  images,
  name,
  className = "",
}: ProductImagesProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  const hasImages = images && images.length > 0;
  const displayImages = hasImages
    ? images
    : ["/images/placeholder-product.jpg"];

  const nextImage = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % displayImages.length);
  }, [displayImages.length]);

  const prevImage = useCallback(() => {
    setCurrentIndex(
      (prev) => (prev - 1 + displayImages.length) % displayImages.length,
    );
  }, [displayImages.length]);

  const openLightbox = useCallback((index: number) => {
    setLightboxIndex(index);
    setIsLightboxOpen(true);
    document.body.style.overflow = "hidden";
  }, []);

  const closeLightbox = useCallback(() => {
    setIsLightboxOpen(false);
    document.body.style.overflow = "unset";
    setIsZoomed(false);
  }, []);

  const lightboxNext = useCallback(() => {
    setLightboxIndex((prev) => (prev + 1) % displayImages.length);
  }, [displayImages.length]);

  const lightboxPrev = useCallback(() => {
    setLightboxIndex(
      (prev) => (prev - 1 + displayImages.length) % displayImages.length,
    );
  }, [displayImages.length]);

  const toggleZoom = useCallback(() => {
    setIsZoomed(!isZoomed);
  }, [isZoomed]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isLightboxOpen) {
        if (e.key === "ArrowRight") lightboxNext();
        if (e.key === "ArrowLeft") lightboxPrev();
        if (e.key === "Escape") closeLightbox();
        if (e.key === "z" || e.key === "Z") toggleZoom();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isLightboxOpen, lightboxNext, lightboxPrev, closeLightbox, toggleZoom]);

  // Touch events pour le carousel
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;
    if (Math.abs(diff) > 50) {
      if (diff > 0) nextImage();
      else prevImage();
    }
    setTouchStart(null);
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Main image */}
      <div
        className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 group"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <Image
          src={displayImages[currentIndex]}
          alt={`${name} - Image ${currentIndex + 1}`}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />

        {/* Zoom button */}
        <button
          onClick={() => openLightbox(currentIndex)}
          className="absolute bottom-4 right-4 p-2.5 bg-white/90 dark:bg-gray-800/90 rounded-full hover:bg-white dark:hover:bg-gray-700 transition-colors shadow-lg"
          aria-label="Agrandir"
        >
          <ZoomIn className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        </button>

        {/* Navigation arrows */}
        {displayImages.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-white/80 dark:bg-gray-800/80 rounded-full hover:bg-white dark:hover:bg-gray-700 transition-opacity shadow-lg opacity-0 group-hover:opacity-100"
              aria-label="Image précédente"
            >
              <ChevronLeft className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-white/80 dark:bg-gray-800/80 rounded-full hover:bg-white dark:hover:bg-gray-700 transition-opacity shadow-lg opacity-0 group-hover:opacity-100"
              aria-label="Image suivante"
            >
              <ChevronRight className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </button>
          </>
        )}

        {/* Index */}
        {displayImages.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-black/50 rounded-full text-white text-xs">
            {currentIndex + 1} / {displayImages.length}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {displayImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
          {displayImages.map((image, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={cn(
                "relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all",
                currentIndex === index
                  ? "border-primary-600 dark:border-primary-400 shadow-md"
                  : "border-transparent hover:border-gray-300 dark:hover:border-gray-600",
              )}
            >
              <Image
                src={image}
                alt={`${name} - Miniature ${index + 1}`}
                fill
                className="object-cover"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center">
          {/* Close */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 p-2 text-white hover:text-gray-300 transition-colors z-10"
            aria-label="Fermer"
          >
            <X className="w-8 h-8" />
          </button>

          {/* Zoom toggle */}
          <button
            onClick={toggleZoom}
            className="absolute top-4 left-4 p-2 text-white hover:text-gray-300 transition-colors z-10"
            aria-label={isZoomed ? "Dézoomer" : "Zoomer"}
          >
            {isZoomed ? (
              <Minimize2 className="w-6 h-6" />
            ) : (
              <Maximize2 className="w-6 h-6" />
            )}
          </button>

          {/* Counter */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white text-sm z-10">
            {lightboxIndex + 1} / {displayImages.length}
          </div>

          {/* Navigation */}
          <button
            onClick={lightboxPrev}
            className="absolute left-4 p-2 text-white hover:text-gray-300 transition-colors z-10"
            aria-label="Précédent"
          >
            <ChevronLeft className="w-10 h-10" />
          </button>
          <button
            onClick={lightboxNext}
            className="absolute right-4 p-2 text-white hover:text-gray-300 transition-colors z-10"
            aria-label="Suivant"
          >
            <ChevronRight className="w-10 h-10" />
          </button>

          {/* Image */}
          <div
            className={cn(
              "relative w-full max-w-5xl max-h-[90vh] transition-transform duration-300",
              isZoomed ? "scale-150" : "scale-100",
            )}
          >
            <Image
              src={displayImages[lightboxIndex]}
              alt={`${name} - Agrandissement ${lightboxIndex + 1}`}
              fill
              className="object-contain"
              sizes="100vw"
              priority
            />
          </div>
        </div>
      )}
    </div>
  );
}
