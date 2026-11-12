"use client";

import { useState } from "react";
import { ChevronDown, X } from "lucide-react";
import { COLOR_CATEGORIES } from "@/lib/colors";
import { cn } from "@/lib/utils";

export type SwatchColor = { hex: string; name: string };

interface Props {
  /** Every distinct color in the dataset, pre-sorted by hue. */
  allColors: SwatchColor[];
  /** Active filter tokens: category names ("Red") or exact hexes ("#D96629"). */
  tokens: string[];
  onToggle: (token: string) => void;
  onClear: () => void;
  mode: "any" | "all";
  onModeChange: (mode: "any" | "all") => void;
}

const chipOn =
  "border-stone-300 bg-white text-stone-900 shadow-sm ring-1 ring-stone-200 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100 dark:ring-stone-800";
const chipOff =
  "border-transparent bg-transparent text-stone-600 hover:bg-white/60 hover:text-stone-900 dark:text-stone-400 dark:hover:bg-stone-900/60 dark:hover:text-stone-200";

export function ColorFilterBar({
  allColors,
  tokens,
  onToggle,
  onClear,
  mode,
  onModeChange,
}: Props) {
  const [open, setOpen] = useState(false);
  const byHex = new Map(allColors.map((c) => [c.hex, c]));
  const exact = tokens.filter((t) => t.startsWith("#"));

  return (
    <div className="border-t border-stone-200/50 pt-4 dark:border-stone-800/50">
      <div className="no-scrollbar flex flex-nowrap items-center gap-2 overflow-x-auto pb-2">
        <span className="mr-2 font-mono text-xs tracking-wider whitespace-nowrap text-stone-400 uppercase">
          Filter by Color:
        </span>

        {COLOR_CATEGORIES.map((category) => {
          const on = tokens.includes(category.name);
          return (
            <button
              key={category.name}
              onClick={() => onToggle(category.name)}
              aria-pressed={on}
              className={cn(
                "flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium whitespace-nowrap transition-all",
                on ? chipOn : chipOff,
              )}
            >
              <span
                className="h-4 w-4 rounded-full border border-stone-200 shadow-sm dark:border-stone-700"
                style={{ backgroundColor: category.hex }}
              />
              {category.name}
            </button>
          );
        })}

        {/* Exact colors picked from the full palette show up as removable chips */}
        {exact.map((hex) => (
          <button
            key={hex}
            onClick={() => onToggle(hex)}
            aria-label={`Remove ${byHex.get(hex)?.name ?? hex}`}
            className={cn(
              "flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium whitespace-nowrap",
              chipOn,
            )}
          >
            <span
              className="h-4 w-4 rounded-full border border-stone-200 shadow-sm dark:border-stone-700"
              style={{ backgroundColor: hex }}
            />
            {byHex.get(hex)?.name ?? hex}
            <X className="h-3 w-3 text-stone-400" />
          </button>
        ))}

        <button
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          className="flex shrink-0 items-center gap-1 rounded-full px-3 py-1.5 text-sm font-medium whitespace-nowrap text-stone-500 transition-colors hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100"
        >
          All {allColors.length} colors
          <ChevronDown
            className={cn("h-4 w-4 transition-transform", open && "rotate-180")}
          />
        </button>

        {tokens.length > 1 && (
          <div
            role="group"
            aria-label="Match mode"
            className="ml-2 flex shrink-0 rounded-full border border-stone-200 bg-white p-0.5 text-xs dark:border-stone-800 dark:bg-stone-900"
          >
            {(["any", "all"] as const).map((m) => (
              <button
                key={m}
                onClick={() => onModeChange(m)}
                aria-pressed={mode === m}
                className={cn(
                  "rounded-full px-3 py-1 font-medium capitalize transition-colors",
                  mode === m
                    ? "bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900"
                    : "text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100",
                )}
              >
                {m}
              </button>
            ))}
          </div>
        )}

        {tokens.length > 0 && (
          <button
            onClick={onClear}
            className="ml-2 flex shrink-0 items-center gap-1 text-xs whitespace-nowrap text-stone-400 hover:text-stone-900 dark:hover:text-stone-200"
          >
            <X className="h-3 w-3" />
            Clear
          </button>
        )}
      </div>

      {open && (
        <div className="mt-2 grid grid-cols-[repeat(auto-fill,minmax(2.25rem,1fr))] gap-2 rounded-lg border border-stone-200 bg-white/60 p-3 dark:border-stone-800 dark:bg-stone-900/60">
          {allColors.map((color) => {
            const on = tokens.includes(color.hex);
            return (
              <button
                key={color.hex}
                onClick={() => onToggle(color.hex)}
                aria-pressed={on}
                aria-label={color.name}
                title={color.name}
                className={cn(
                  "aspect-square rounded-md border border-black/10 transition-transform hover:scale-110 dark:border-white/10",
                  on &&
                    "ring-2 ring-stone-900 ring-offset-2 ring-offset-[#F4F1EA] dark:ring-stone-100 dark:ring-offset-stone-950",
                )}
                style={{ backgroundColor: color.hex }}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
