"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { ColorCombination } from "@/data";
import { cn, formatId, hexToRgb } from "@/lib/utils";
import { BASE_PATH } from "@/lib/site";
import { Copy, Check, Heart, Share2, ArrowUpRight } from "lucide-react";

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

        {onToggleSave && (
          <button
            onClick={onToggleSave}
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
        <span className="font-mono text-xs text-stone-500 dark:text-stone-400">
          #{formatId(combination.id)}
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
  const { copied, copy } = useCopy();

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
        className="relative z-10 flex h-[min(90dvh,44rem)] w-full max-w-4xl flex-col overflow-hidden rounded-lg bg-[#F4F1EA] shadow-2xl dark:bg-stone-900"
      >
        <div className="flex min-h-0 flex-1 flex-col md:flex-row">
          {/* Visual Representation */}
          <div className="flex h-28 shrink-0 flex-row sm:h-40 md:h-auto md:flex-1">
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
                      copy(color.hex);
                    }}
                    className="rounded-full bg-white/90 px-3 py-1.5 font-mono text-xs tracking-wider text-stone-900 uppercase shadow-sm hover:bg-white dark:bg-stone-900/90 dark:text-stone-100 dark:hover:bg-stone-800"
                  >
                    {copied === color.hex ? (
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
          <div className="flex min-h-0 w-full flex-1 flex-col border-stone-200 bg-white md:w-80 md:flex-none md:border-l dark:border-stone-800 dark:bg-stone-950">
            <div className="flex shrink-0 items-start justify-between p-6 pb-4 md:p-8 md:pb-4">
              <div>
                <h2 className="mb-1 font-serif text-3xl text-stone-900 italic dark:text-stone-100">
                  Combination {combination.id}
                </h2>
                <p className="font-mono text-sm tracking-widest text-stone-500 uppercase dark:text-stone-400">
                  {combination.type}
                </p>
              </div>
              <div className="flex gap-1">
                <ShareButton
                  id={combination.id}
                  className="relative rounded-full p-2 text-stone-400 transition-colors hover:bg-stone-100 hover:text-stone-900 dark:hover:bg-stone-900 dark:hover:text-stone-100"
                />
                <SaveButton isSaved={isSaved} onToggle={onToggleSave} />
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto px-6 py-2 md:px-8">
              <ColorSpecs
                combination={combination}
                copied={copied}
                onCopy={copy}
              />
            </div>

            <div className="flex shrink-0 flex-col gap-2 border-t border-stone-100 p-6 pt-4 md:px-8 dark:border-stone-900">
              <Link
                href={`/combo/${combination.id}`}
                className="flex w-full items-center justify-center gap-1.5 rounded-md bg-stone-900 py-3 text-sm font-medium text-white transition-colors hover:bg-stone-700 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-stone-300"
              >
                Open page
                <ArrowUpRight className="h-4 w-4" />
              </Link>
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
