"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { ColorCombination } from "@/data/colors";
import { cn, hexToRgb } from "@/lib/utils";
import { Copy, Check, Heart, Share2 } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface ColorCardProps {
  combination: ColorCombination;
  onClick?: () => void;
  isSaved?: boolean;
  onToggleSave?: (e: React.MouseEvent) => void;
}

export function ColorCard({
  combination,
  onClick,
  isSaved,
  onToggleSave,
}: ColorCardProps) {
  return (
    <motion.div
      layoutId={`card-${combination.id}`}
      className="group flex cursor-pointer flex-col gap-2"
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.4 }}
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-sm shadow-sm transition-shadow duration-300 group-hover:shadow-lg">
        <div className="absolute inset-0 flex h-full w-full">
          {combination.colors.map((color, index) => (
            <div
              key={index}
              className="h-full flex-1"
              style={{ backgroundColor: color.hex }}
            />
          ))}
        </div>

        {/* Save Button Overlay */}
        <button
          onClick={onToggleSave}
          className={cn(
            "absolute top-2 right-2 z-10 rounded-full bg-white/90 p-2 shadow-sm backdrop-blur-sm transition-all duration-200 hover:scale-110 dark:bg-stone-900/90",
            isSaved
              ? "text-red-500"
              : "text-stone-400 opacity-0 group-hover:opacity-100 hover:text-red-500",
          )}
        >
          <Heart className={cn("h-4 w-4", isSaved && "fill-current")} />
        </button>
      </div>
      <div className="flex items-baseline justify-between px-1">
        <span className="font-mono text-xs text-stone-500 dark:text-stone-400">
          #{combination.id.toString().padStart(3, "0")}
        </span>
        <div className="flex gap-1">
          {combination.colors.map((c, i) => (
            <div
              key={i}
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: c.hex }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

interface ColorDetailProps {
  combination: ColorCombination;
  onClose: () => void;
  isSaved?: boolean;
  onToggleSave?: () => void;
}

export function ColorDetail({
  combination,
  onClose,
  isSaved,
  onToggleSave,
}: ColorDetailProps) {
  const [copiedHex, setCopiedHex] = useState<string | null>(null);
  const [hasShared, setHasShared] = useState(false);
  const isMobile = useIsMobile();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHex(text);
    setTimeout(() => setCopiedHex(null), 2000);
  };

  const handleShare = () => {
    const url = new URL(window.location.href);
    url.searchParams.set("id", combination.id.toString());
    navigator.clipboard.writeText(url.toString());
    setHasShared(true);
    setTimeout(() => setHasShared(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm dark:bg-black/60"
      />
      <motion.div
        layoutId={`card-${combination.id}`}
        className="relative z-10 flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-lg bg-[#F4F1EA] shadow-2xl dark:bg-stone-900"
      >
        <div className={`flex ${isMobile ? "flex-col" : "flex-row"} h-full`}>
          {/* Visual Representation */}
          <div
            className={`${isMobile ? "h-48 shrink-0" : "flex-1"} flex ${isMobile ? "flex-row" : "flex-col md:flex-row"}`}
          >
            {combination.colors.map((color, index) => (
              <div
                key={index}
                className="group/color relative flex-1"
                style={{ backgroundColor: color.hex }}
              >
                <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover/color:opacity-100">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      copyToClipboard(color.hex);
                    }}
                    className="rounded-full bg-white/90 px-3 py-1.5 font-mono text-xs tracking-wider text-stone-900 uppercase shadow-sm hover:bg-white dark:bg-stone-900/90 dark:text-stone-100 dark:hover:bg-stone-800"
                  >
                    {copiedHex === color.hex ? (
                      <Check className="mr-1 inline h-3 w-3" />
                    ) : (
                      <Copy className="mr-1 inline h-3 w-3" />
                    )}
                    {color.hex}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Info Panel */}
          <div
            className={`${isMobile ? "w-full flex-1 overflow-y-auto" : "w-80 border-l"} flex flex-col border-stone-200 bg-white p-6 md:p-8 dark:border-stone-800 dark:bg-stone-950`}
          >
            <div className="mb-8 flex items-start justify-between">
              <div>
                <h2 className="mb-1 font-serif text-3xl text-stone-900 italic dark:text-stone-100">
                  Combination {combination.id}
                </h2>
                <p className="font-mono text-sm tracking-widest text-stone-500 uppercase dark:text-stone-400">
                  {combination.type}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleShare}
                  className="relative rounded-full p-2 text-stone-400 transition-colors hover:bg-stone-100 hover:text-stone-900 dark:hover:bg-stone-900 dark:hover:text-stone-100"
                  title="Copy link"
                >
                  {hasShared ? (
                    <Check className="h-5 w-5 text-emerald-600" />
                  ) : (
                    <Share2 className="h-5 w-5" />
                  )}
                </button>
                <button
                  onClick={onToggleSave}
                  className={cn(
                    "rounded-full p-2 transition-colors hover:bg-stone-100 dark:hover:bg-stone-900",
                    isSaved
                      ? "text-red-500"
                      : "text-stone-400 hover:text-red-500",
                  )}
                  title={isSaved ? "Remove from saved" : "Save combination"}
                >
                  <Heart className={cn("h-5 w-5", isSaved && "fill-current")} />
                </button>
              </div>
            </div>

            <div className="space-y-6">
              {combination.colors.map((color, index) => (
                <div key={index} className="group">
                  <div className="mb-2 flex items-center gap-3">
                    <div
                      className="h-4 w-4 rounded-full border border-stone-100 shadow-sm dark:border-stone-800"
                      style={{ backgroundColor: color.hex }}
                    />
                    <h3 className="font-medium text-stone-900 dark:text-stone-100">
                      {color.name}
                    </h3>
                  </div>
                  <div className="space-y-3 pl-7">
                    {/* HEX */}
                    <div className="group/format flex items-center justify-between font-mono text-xs text-stone-500 dark:text-stone-400">
                      <span>HEX</span>
                      <button
                        onClick={() => copyToClipboard(color.hex)}
                        className="flex items-center gap-1 transition-colors hover:text-stone-900 dark:hover:text-stone-100"
                      >
                        {color.hex}
                        {copiedHex === color.hex ? (
                          <Check className="h-3 w-3 text-emerald-600" />
                        ) : (
                          <Copy className="h-3 w-3 opacity-0 transition-opacity group-hover/format:opacity-100" />
                        )}
                      </button>
                    </div>

                    {/* RGB */}
                    <div className="group/format flex items-center justify-between font-mono text-xs text-stone-500 dark:text-stone-400">
                      <span>RGB</span>
                      <button
                        onClick={() => {
                          const rgb = hexToRgb(color.hex);
                          if (rgb) copyToClipboard(`rgb(${rgb})`);
                        }}
                        className="flex items-center gap-1 transition-colors hover:text-stone-900 dark:hover:text-stone-100"
                      >
                        {hexToRgb(color.hex)
                          ? `rgb(${hexToRgb(color.hex)})`
                          : "-"}
                        {copiedHex === `rgb(${hexToRgb(color.hex)})` ? (
                          <Check className="h-3 w-3 text-emerald-600" />
                        ) : (
                          <Copy className="h-3 w-3 opacity-0 transition-opacity group-hover/format:opacity-100" />
                        )}
                      </button>
                    </div>

                    {/* RGBA */}
                    <div className="group/format flex items-center justify-between font-mono text-xs text-stone-500 dark:text-stone-400">
                      <span>RGBA</span>
                      <button
                        onClick={() => {
                          const rgb = hexToRgb(color.hex);
                          if (rgb) copyToClipboard(`rgba(${rgb}, 1)`);
                        }}
                        className="flex items-center gap-1 transition-colors hover:text-stone-900 dark:hover:text-stone-100"
                      >
                        {hexToRgb(color.hex)
                          ? `rgba(${hexToRgb(color.hex)}, 1)`
                          : "-"}
                        {copiedHex === `rgba(${hexToRgb(color.hex)}, 1)` ? (
                          <Check className="h-3 w-3 text-emerald-600" />
                        ) : (
                          <Copy className="h-3 w-3 opacity-0 transition-opacity group-hover/format:opacity-100" />
                        )}
                      </button>
                    </div>

                    {/* CMYK */}
                    {color.cmyk && (
                      <div className="group/format flex items-center justify-between font-mono text-xs text-stone-500 dark:text-stone-400">
                        <span>CMYK</span>
                        <button
                          onClick={() => copyToClipboard(color.cmyk!)}
                          className="flex items-center gap-1 transition-colors hover:text-stone-900 dark:hover:text-stone-100"
                        >
                          {color.cmyk}
                          {copiedHex === color.cmyk ? (
                            <Check className="h-3 w-3 text-emerald-600" />
                          ) : (
                            <Copy className="h-3 w-3 opacity-0 transition-opacity group-hover/format:opacity-100" />
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-auto pt-8">
              <button
                onClick={onClose}
                className="w-full rounded-md border border-stone-200 py-3 text-sm font-medium text-stone-600 transition-colors hover:bg-stone-50 hover:text-stone-900 dark:border-stone-800 dark:text-stone-400 dark:hover:bg-stone-900 dark:hover:text-stone-100"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
