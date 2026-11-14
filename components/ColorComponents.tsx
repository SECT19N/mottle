"use client";

import { memo, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { ColorCombination } from "@/data";
import { cn, formatId, hexToRgb } from "@/lib/utils";
import { BASE_PATH } from "@/lib/site";
import { Copy, Check, Heart, Share2 } from "lucide-react";

/** Copy text and flash a "copied" state for 2s. */
export function useCopy() {
  const [copied, setCopied] = useState<string | null>(null);
  const copy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(text);
    setTimeout(() => setCopied((c) => (c === text ? null : c)), 2000);
  };
  return { copied, copy };
}

interface ColorCardProps {
  combination: ColorCombination;
  onSelect?: (id: number) => void;
  isSaved?: boolean;
  onToggleSave?: (id: number) => void;
  /** Replaces the "#001" id caption (e.g. the builder shows the picked hex codes). */
  label?: string;
}

/** Memoized: handlers must be referentially stable (they receive the id). */
export const ColorCard = memo(function ColorCard({
  combination,
  onSelect,
  isSaved,
  onToggleSave,
  label,
}: ColorCardProps) {
  return (
    <motion.div
      className="group card-cv flex flex-col gap-2"
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

        {onSelect && (
          // A real link so crawlers (and middle-click / "open in new tab") reach
          // the combo page; a plain click opens the in-page detail instead.
          <Link
            href={`/combo/${combination.id}`}
            prefetch={false}
            aria-label={`Combination ${combination.id}: ${combination.colors.map((c) => c.name).join(", ")}`}
            className="absolute inset-0 z-0 cursor-pointer"
            onClick={(e) => {
              if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button)
                return;
              e.preventDefault();
              onSelect(combination.id);
            }}
          />
        )}

        {onToggleSave && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleSave(combination.id);
            }}
            aria-label={isSaved ? "Remove from saved" : "Save combination"}
            className={cn(
              "absolute top-2 right-2 z-10 rounded-full bg-white/90 p-2 shadow-sm backdrop-blur-sm transition-all duration-200 hover:scale-110 dark:bg-stone-900/90",
              isSaved
                ? "text-red-500"
                : "text-stone-400 opacity-0 group-hover:opacity-100 hover:text-red-500 focus-visible:opacity-100",
            )}
          >
            <Heart className={cn("h-4 w-4", isSaved && "fill-current")} />
          </button>
        )}
      </div>
      <div className="flex items-baseline justify-between px-1">
        <span className="truncate font-mono text-xs text-stone-500 dark:text-stone-400">
          {label ?? `#${formatId(combination.id)}`}
        </span>
        <div className="flex shrink-0 gap-1 pl-2">
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
});

function CopyRow({
  label,
  value,
  copied,
  onCopy,
}: {
  label: string;
  value: string;
  copied: string | null;
  onCopy: (text: string) => void;
}) {
  return (
    <div className="group/format flex items-center justify-between font-mono text-xs text-stone-500 dark:text-stone-400">
      <span>{label}</span>
      <button
        onClick={() => onCopy(value)}
        className="flex items-center gap-1 transition-colors hover:text-stone-900 dark:hover:text-stone-100"
      >
        {value}
        {copied === value ? (
          <Check className="h-3 w-3 text-emerald-600" />
        ) : (
          <Copy className="h-3 w-3 opacity-0 transition-opacity group-hover/format:opacity-100" />
        )}
      </button>
    </div>
  );
}

/** Name + HEX / RGB / CMYK rows for every color in a combination. */
export function ColorSpecs({
  combination,
  copied,
  onCopy,
}: {
  combination: ColorCombination;
  copied: string | null;
  onCopy: (text: string) => void;
}) {
  return (
    <div className="space-y-5">
      {combination.colors.map((color, index) => {
        const rgb = hexToRgb(color.hex);
        return (
          <div key={index}>
            <div className="mb-1.5 flex items-center gap-3">
              <div
                className="h-4 w-4 rounded-full border border-stone-100 shadow-sm dark:border-stone-800"
                style={{ backgroundColor: color.hex }}
              />
              <h3 className="font-medium text-stone-900 dark:text-stone-100">
                {color.name}
              </h3>
            </div>
            <div className="space-y-1.5 pl-7">
              <CopyRow
                label="HEX"
                value={color.hex}
                copied={copied}
                onCopy={onCopy}
              />
              {rgb && (
                <CopyRow
                  label="RGB"
                  value={`rgb(${rgb})`}
                  copied={copied}
                  onCopy={onCopy}
                />
              )}
              {color.cmyk && (
                <CopyRow
                  label="CMYK"
                  value={color.cmyk}
                  copied={copied}
                  onCopy={onCopy}
                />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function ShareButton({
  id,
  className,
}: {
  id: number;
  className?: string;
}) {
  const { copied, copy } = useCopy();
  const url = () => `${window.location.origin}${BASE_PATH}/combo/${id}`;
  return (
    <button
      onClick={() => copy(url())}
      className={className}
      title="Copy link"
      aria-label="Copy link"
    >
      {copied ? (
        <Check className="h-5 w-5 text-emerald-600" />
      ) : (
        <Share2 className="h-5 w-5" />
      )}
    </button>
  );
}

export function SaveButton({
  isSaved,
  onToggle,
  className,
}: {
  isSaved?: boolean;
  onToggle?: () => void;
  className?: string;
}) {
  return (
    <button
      onClick={onToggle}
      className={cn(
        "rounded-full p-2 transition-colors hover:bg-stone-100 dark:hover:bg-stone-900",
        isSaved ? "text-red-500" : "text-stone-400 hover:text-red-500",
        className,
      )}
      title={isSaved ? "Remove from saved" : "Save combination"}
      aria-label={isSaved ? "Remove from saved" : "Save combination"}
    >
      <Heart className={cn("h-5 w-5", isSaved && "fill-current")} />
    </button>
  );
}
