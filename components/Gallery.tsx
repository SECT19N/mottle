"use client";

import { useState, useMemo } from "react";
import { colorCombinations, type ColorCombination } from "@/data";
import { ColorCard, ColorDetail } from "@/components/ColorComponents";
import { AnimatePresence } from "motion/react";
import { Search, X, Heart } from "lucide-react";
import { useSaved } from "@/hooks/use-saved";
import { ThemeToggle } from "@/components/theme-toggle";

const COLOR_CATEGORIES = [
  { name: "Red", hex: "#D64F3E" },
  { name: "Blue", hex: "#008DB7" },
  { name: "Green", hex: "#6B7C47" },
  { name: "Yellow", hex: "#E8D62E" },
  { name: "Orange", hex: "#E65218" },
  { name: "Purple", hex: "#543986" },
  { name: "Pink", hex: "#E0B6B6" },
  { name: "Brown", hex: "#5E3A48" },
  { name: "Gray", hex: "#3E4C53" },
];

type Filter = "all" | ColorCombination["type"] | "saved" | "create";

// Tabs follow whatever palette sizes exist in the data (2/3/4 and the lone 5-color).
const TYPE_TABS = [...new Set(colorCombinations.map((c) => c.type))].sort();
const FILTERS: Filter[] = ["all", ...TYPE_TABS, "saved", "create"];

const nameHas = (name: string, term: string) =>
  name.toLowerCase().includes(term.toLowerCase());

export function Gallery() {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [filter, setFilter] = useState<Filter>("all");
  const [colorFilters, setColorFilters] = useState<string[]>([]);
  const [matchMode, setMatchMode] = useState<"any" | "all">("any");

  const toggleColorFilter = (name: string) =>
    setColorFilters((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name],
    );
  const [searchQuery, setSearchQuery] = useState("");
  const { savedIds, toggle: toggleSave } = useSaved();

  // Builder State
  const [builderColors, setBuilderColors] = useState<
    { hex: string; name: string }[]
  >([]);

  // Extract unique colors for builder
  const allUniqueColors = useMemo(() => {
    const uniqueMap = new Map<string, { hex: string; name: string }>();
    colorCombinations.forEach((combo) => {
      combo.colors.forEach((color) => {
        if (!uniqueMap.has(color.hex)) {
          uniqueMap.set(color.hex, { hex: color.hex, name: color.name });
        }
      });
    });
    return Array.from(uniqueMap.values());
  }, []);

  // Filter unique colors for builder based on search/filter
  const filteredBuilderColors = useMemo(() => {
    return allUniqueColors.filter((color) => {
      const matchesSearch =
        searchQuery === "" ||
        color.name.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesColor =
        colorFilters.length === 0 ||
        colorFilters.some((f) => nameHas(color.name, f));

      return matchesSearch && matchesColor;
    });
  }, [allUniqueColors, searchQuery, colorFilters]);

  const selectedCombination = useMemo(
    () => colorCombinations.find((c) => c.id === selectedId),
    [selectedId],
  );

  const filteredCombinations = useMemo(() => {
    return colorCombinations.filter((c) => {
      const matchesType =
        filter === "all"
          ? true
          : filter === "saved"
            ? savedIds.includes(c.id)
            : c.type === filter;

      const matchesSearch =
        searchQuery === "" ||
        c.id.toString().includes(searchQuery) ||
        c.colors.some((color) =>
          color.name.toLowerCase().includes(searchQuery.toLowerCase()),
        );

      const hit = (f: string) =>
        c.colors.some((color) => nameHas(color.name, f));
      const matchesColor =
        colorFilters.length === 0 ||
        (matchMode === "all"
          ? colorFilters.every(hit)
          : colorFilters.some(hit));

      return matchesType && matchesSearch && matchesColor;
    });
  }, [filter, searchQuery, colorFilters, matchMode, savedIds]);

  return (
    <main className="min-h-screen bg-[#F4F1EA] px-4 py-8 transition-colors duration-300 sm:px-6 lg:px-8 dark:bg-stone-950">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <header className="mb-12 flex flex-col gap-8">
          <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="font-serif text-5xl font-medium tracking-tight text-stone-900 italic sm:text-6xl dark:text-stone-100">
                Mottle
              </h1>
              <p className="mt-4 max-w-md font-serif text-stone-500 italic dark:text-stone-400">
                A digital archive of color combinations inspired by Sanzo
                Wada&apos;s
                <span className="not-italic">
                  {" "}
                  &quot;A Dictionary of Color Combinations&quot;
                </span>
                .
              </p>
            </div>

            <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-center md:w-auto">
              <ThemeToggle />

              {/* Search */}
              <div className="relative w-full sm:w-auto">
                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  placeholder="Search colors..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-10 w-full rounded-full border border-stone-200 bg-white pr-4 pl-10 text-sm text-stone-900 transition-colors outline-none placeholder:text-stone-400 focus:border-stone-400 focus:ring-0 sm:w-64 dark:border-stone-800 dark:bg-stone-900 dark:text-stone-100 dark:focus:border-stone-600"
                />
              </div>

              {/* Type Filter Tabs */}
              <div className="no-scrollbar flex w-full overflow-x-auto rounded-full border border-stone-100 bg-white p-1 shadow-sm transition-colors sm:w-auto dark:border-stone-800 dark:bg-stone-900">
                {FILTERS.map((type) => (
                  <button
                    key={type}
                    onClick={() => setFilter(type)}
                    className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-medium whitespace-nowrap transition-colors ${
                      filter === type
                        ? "bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900"
                        : "text-stone-500 hover:bg-stone-100 hover:text-stone-900 dark:text-stone-400 dark:hover:bg-stone-800 dark:hover:text-stone-200"
                    }`}
                  >
                    {type === "saved" && (
                      <Heart className="h-3 w-3 fill-current" />
                    )}
                    {type === "all"
                      ? "All"
                      : type === "saved"
                        ? "Saved"
                        : type === "create"
                          ? "Builder"
                          : type.replace("-color", "")}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Color Filter */}
          <div className="no-scrollbar flex flex-nowrap items-center gap-2 overflow-x-auto border-t border-stone-200/50 pt-4 pb-2 dark:border-stone-800/50">
            <span className="mr-2 font-mono text-xs tracking-wider whitespace-nowrap text-stone-400 uppercase">
              Filter by Color:
            </span>
            {COLOR_CATEGORIES.map((category) => (
              <button
                key={category.name}
                onClick={() => toggleColorFilter(category.name)}
                aria-pressed={colorFilters.includes(category.name)}
                className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium whitespace-nowrap transition-all ${
                  colorFilters.includes(category.name)
                    ? "border-stone-300 bg-white text-stone-900 shadow-sm ring-1 ring-stone-200 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100 dark:ring-stone-800"
                    : "border-transparent bg-transparent text-stone-600 hover:bg-white/60 hover:text-stone-900 dark:text-stone-400 dark:hover:bg-stone-900/60 dark:hover:text-stone-200"
                }`}
              >
                <div
                  className="h-4 w-4 rounded-full border border-stone-200 shadow-sm dark:border-stone-700"
                  style={{ backgroundColor: category.hex }}
                />
                {category.name}
              </button>
            ))}
            {colorFilters.length > 1 && (
              <div className="ml-2 flex shrink-0 rounded-full border border-stone-200 bg-white p-0.5 text-xs dark:border-stone-800 dark:bg-stone-900">
                {(["any", "all"] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => setMatchMode(m)}
                    aria-pressed={matchMode === m}
                    className={`rounded-full px-3 py-1 font-medium capitalize transition-colors ${
                      matchMode === m
                        ? "bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900"
                        : "text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100"
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            )}
            {colorFilters.length > 0 && (
              <button
                onClick={() => setColorFilters([])}
                className="ml-2 flex items-center gap-1 text-xs whitespace-nowrap text-stone-400 hover:text-stone-900 dark:hover:text-stone-200"
              >
                <X className="h-3 w-3" />
                Clear
              </button>
            )}
          </div>
        </header>

        {/* Grid */}
        {filter === "create" ? (
          <div className="flex flex-col gap-12">
            {/* Preview Section */}
            <div className="mx-auto w-full max-w-md">
              <h2 className="mb-6 text-center font-serif text-xl text-stone-900 italic dark:text-stone-100">
                Your Palette
              </h2>
              {builderColors.length > 0 ? (
                <ColorCard
                  combination={{
                    id: 0, // Dummy ID
                    type:
                      builderColors.length <= 2
                        ? "2-color"
                        : builderColors.length === 3
                          ? "3-color"
                          : "4-color",
                    colors: builderColors,
                  }}
                  // No click handler for preview
                />
              ) : (
                <div className="flex aspect-[4/3] w-full items-center justify-center rounded-sm border-2 border-dashed border-stone-200 font-mono text-sm text-stone-400 dark:border-stone-800">
                  Select colors below
                </div>
              )}
              {builderColors.length > 0 && (
                <div className="mt-4 flex justify-center">
                  <button
                    onClick={() => setBuilderColors([])}
                    className="text-xs text-stone-500 transition-colors hover:text-red-500"
                  >
                    Clear Palette
                  </button>
                </div>
              )}
            </div>

            {/* Color Selection Grid */}
            <div>
              <h2 className="mb-6 font-serif text-xl text-stone-900 italic dark:text-stone-100">
                Available Colors
              </h2>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
                {filteredBuilderColors.map((color) => {
                  const isSelected = builderColors.some(
                    (c) => c.hex === color.hex,
                  );
                  return (
                    <button
                      key={color.hex}
                      onClick={() => {
                        if (isSelected) {
                          setBuilderColors((prev) =>
                            prev.filter((c) => c.hex !== color.hex),
                          );
                        } else {
                          if (builderColors.length < 4) {
                            setBuilderColors((prev) => [...prev, color]);
                          }
                        }
                      }}
                      className={`group relative aspect-square overflow-hidden rounded-sm transition-all ${
                        isSelected
                          ? "ring-2 ring-stone-900 ring-offset-2 dark:ring-stone-100 dark:ring-offset-stone-950"
                          : "hover:scale-105"
                      }`}
                    >
                      <div
                        className="absolute inset-0"
                        style={{ backgroundColor: color.hex }}
                      />
                      <div className="absolute inset-x-0 bottom-0 truncate bg-black/50 p-1 font-mono text-[10px] text-white opacity-0 transition-opacity group-hover:opacity-100">
                        {color.name}
                      </div>
                      {isSelected && (
                        <div className="absolute top-1 right-1 rounded-full bg-white p-0.5">
                          <X className="h-3 w-3 text-stone-900" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <AnimatePresence mode="popLayout">
              {filteredCombinations.map((combination) => (
                <ColorCard
                  key={combination.id}
                  combination={combination}
                  onClick={() => setSelectedId(combination.id)}
                  isSaved={savedIds.includes(combination.id)}
                  onToggleSave={(e) => {
                    e?.stopPropagation();
                    toggleSave(combination.id);
                  }}
                />
              ))}
            </AnimatePresence>
          </div>
        )}

        {filter !== "create" && filteredCombinations.length === 0 && (
          <div className="mt-20 text-center">
            <p className="font-serif text-stone-400 italic">
              {filter === "saved"
                ? "No saved combinations yet."
                : "No combinations found."}
            </p>
          </div>
        )}

        {/* Detail Modal */}
        <AnimatePresence>
          {selectedId && selectedCombination && (
            <ColorDetail
              combination={selectedCombination}
              onClose={() => setSelectedId(null)}
              isSaved={savedIds.includes(selectedId)}
              onToggleSave={() => toggleSave(selectedId)}
            />
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
