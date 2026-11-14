"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ColorCombination } from "@/data";
import { Copy, Check, ArrowUpRight } from "lucide-react";
import {
  ColorSpecs,
  SaveButton,
  ShareButton,
  useCopy,
} from "@/components/ColorComponents";

interface ColorDetailProps {
  combination: ColorCombination;
  onClose: () => void;
  isSaved?: boolean;
  onToggleSave?: () => void;
}

export default function ColorDetail({
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
        transition={{ duration: 0.2 }}
        className="absolute inset-0 bg-stone-900/50 dark:bg-black/70"
      />
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 24, scale: 0.97 }}
        transition={{ duration: 0.22, ease: "easeOut" }}
        style={{ willChange: "transform, opacity" }}
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
