"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, Copy } from "lucide-react";
import { ColorCombination } from "@/data";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  ColorSpecs,
  SaveButton,
  ShareButton,
  useCopy,
} from "@/components/ColorComponents";
import { useSaved } from "@/hooks/use-saved";
import { formatId, readableTextOn } from "@/lib/utils";

export function SchemeView({
  combination,
  prevId,
  nextId,
}: {
  combination: ColorCombination;
  prevId: number | null;
  nextId: number | null;
}) {
  const { copied, copy } = useCopy();
  const { savedIds, toggle } = useSaved();

  const navLink =
    "flex items-center gap-2 rounded-full border border-stone-200 bg-white px-4 py-2 text-sm text-stone-600 transition-colors hover:text-stone-900 dark:border-stone-800 dark:bg-stone-900 dark:text-stone-400 dark:hover:text-stone-100";

  return (
    <main className="min-h-screen bg-[#F4F1EA] px-4 py-6 sm:px-6 lg:px-8 dark:bg-stone-950">
      <div className="mx-auto max-w-6xl">
        <nav className="mb-8 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 font-serif text-2xl text-stone-900 italic dark:text-stone-100"
          >
            <ArrowLeft className="h-5 w-5" />
            Mottle
          </Link>
          <ThemeToggle />
        </nav>

        <div className="flex flex-col overflow-hidden rounded-lg bg-white shadow-sm lg:flex-row dark:bg-stone-900">
          {/* Swatches */}
          <div className="flex h-72 flex-1 sm:h-96 lg:h-auto lg:min-h-[560px]">
            {combination.colors.map((color) => {
              const ink = readableTextOn(color.hex);
              return (
                <button
                  key={color.hex + color.name}
                  onClick={() => copy(color.hex)}
                  className="group relative flex flex-1 items-end p-4 text-left"
                  style={{ backgroundColor: color.hex, color: ink }}
                  title={`Copy ${color.hex}`}
                >
                  <span className="flex flex-col gap-1 text-xs sm:text-sm">
                    <span className="font-medium">{color.name}</span>
                    <span className="flex items-center gap-1 font-mono uppercase opacity-80">
                      {color.hex}
                      {copied === color.hex ? (
                        <Check className="h-3 w-3" />
                      ) : (
                        <Copy className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
                      )}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>

          {/* Info */}
          <div className="w-full border-stone-200 p-6 lg:w-96 lg:border-l lg:p-8 dark:border-stone-800 dark:bg-stone-950">
            <div className="mb-8 flex items-start justify-between">
              <div>
                <h1 className="mb-1 font-serif text-3xl text-stone-900 italic dark:text-stone-100">
                  Combination {combination.id}
                </h1>
                <p className="font-mono text-sm tracking-widest text-stone-500 uppercase dark:text-stone-400">
                  {combination.type} · #{formatId(combination.id)}
                </p>
              </div>
              <div className="flex gap-1">
                <ShareButton
                  id={combination.id}
                  className="rounded-full p-2 text-stone-400 transition-colors hover:bg-stone-100 hover:text-stone-900 dark:hover:bg-stone-900 dark:hover:text-stone-100"
                />
                <SaveButton
                  isSaved={savedIds.includes(combination.id)}
                  onToggle={() => toggle(combination.id)}
                />
              </div>
            </div>
            <ColorSpecs
              combination={combination}
              copied={copied}
              onCopy={copy}
            />
          </div>
        </div>

        <div className="mt-6 flex justify-between">
          {prevId ? (
            <Link href={`/combo/${prevId}`} className={navLink}>
              <ArrowLeft className="h-4 w-4" />#{formatId(prevId)}
            </Link>
          ) : (
            <span />
          )}
          {nextId ? (
            <Link href={`/combo/${nextId}`} className={navLink}>
              #{formatId(nextId)}
              <ArrowRight className="h-4 w-4" />
            </Link>
          ) : (
            <span />
          )}
        </div>
      </div>
    </main>
  );
}
