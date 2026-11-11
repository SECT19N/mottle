"use client";

import { useState, useMemo, useEffect } from 'react';
import { colorCombinations } from '@/data/colors';
import { ColorCard, ColorDetail } from '@/components/ColorComponents';
import { AnimatePresence } from 'motion/react';
import { Search, X, Heart } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { ThemeToggle } from '@/components/theme-toggle';

const COLOR_CATEGORIES = [
  { name: 'Red', hex: '#D64F3E' },
  { name: 'Blue', hex: '#008DB7' },
  { name: 'Green', hex: '#6B7C47' },
  { name: 'Yellow', hex: '#E8D62E' },
  { name: 'Orange', hex: '#E65218' },
  { name: 'Purple', hex: '#543986' },
  { name: 'Pink', hex: '#E0B6B6' },
  { name: 'Brown', hex: '#5E3A48' },
  { name: 'Gray', hex: '#3E4C53' },
];

export default function Home() {
  const isMobile = useIsMobile();
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [filter, setFilter] = useState<'all' | '2-color' | '3-color' | '4-color' | 'saved' | 'create'>('all');
  const [colorFilter, setColorFilter] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [savedIds, setSavedIds] = useState<number[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Builder State
  const [builderColors, setBuilderColors] = useState<{hex: string, name: string}[]>([]);

  // Extract unique colors for builder
  const allUniqueColors = useMemo(() => {
    const uniqueMap = new Map<string, {hex: string, name: string}>();
    colorCombinations.forEach(combo => {
      combo.colors.forEach(color => {
        if (!uniqueMap.has(color.hex)) {
          uniqueMap.set(color.hex, { hex: color.hex, name: color.name });
        }
      });
    });
    return Array.from(uniqueMap.values());
  }, []);

  // Filter unique colors for builder based on search/filter
  const filteredBuilderColors = useMemo(() => {
    return allUniqueColors.filter(color => {
      const matchesSearch = 
        searchQuery === '' || 
        color.name.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesColor = 
        colorFilter === null || 
        color.name.toLowerCase().includes(colorFilter.toLowerCase());

      return matchesSearch && matchesColor;
    });
  }, [allUniqueColors, searchQuery, colorFilter]);

  // Load saved IDs from local storage
  useEffect(() => {
    const saved = localStorage.getItem('mottle-saved');
    if (saved) {
      try {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSavedIds(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse saved IDs', e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Check URL for shared ID
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    if (id) {
      const numId = parseInt(id, 10);
      if (!isNaN(numId) && colorCombinations.some(c => c.id === numId)) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSelectedId(numId);
      }
    }
  }, []);

  // Update URL when selectedId changes
  useEffect(() => {
    if (selectedId) {
      const url = new URL(window.location.href);
      url.searchParams.set('id', selectedId.toString());
      window.history.pushState({}, '', url.toString());
    } else {
      const url = new URL(window.location.href);
      url.searchParams.delete('id');
      window.history.pushState({}, '', url.toString());
    }
  }, [selectedId]);

  const toggleSave = (id: number) => {
    const newSavedIds = savedIds.includes(id)
      ? savedIds.filter(savedId => savedId !== id)
      : [...savedIds, id];
    
    setSavedIds(newSavedIds);
    localStorage.setItem('mottle-saved', JSON.stringify(newSavedIds));
  };

  const selectedCombination = useMemo(
    () => colorCombinations.find((c) => c.id === selectedId),
    [selectedId]
  );

  const filteredCombinations = useMemo(() => {
    return colorCombinations.filter((c) => {
      const matchesType = 
        filter === 'all' ? true :
        filter === 'saved' ? savedIds.includes(c.id) :
        c.type === filter;

      const matchesSearch = 
        searchQuery === '' || 
        c.id.toString().includes(searchQuery) ||
        c.colors.some(color => color.name.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesColor = 
        colorFilter === null || 
        c.colors.some(color => color.name.toLowerCase().includes(colorFilter.toLowerCase()));

      return matchesType && matchesSearch && matchesColor;
    });
  }, [filter, searchQuery, colorFilter, savedIds]);

  if (!isLoaded) return null; // Prevent hydration mismatch

  return (
    <main className="min-h-screen bg-[#F4F1EA] dark:bg-stone-950 px-4 py-8 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <header className="mb-12 flex flex-col gap-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
            <div>
              <h1 className="font-serif text-5xl font-medium tracking-tight text-stone-900 dark:text-stone-100 sm:text-6xl italic">
                Mottle
              </h1>
              <p className="mt-4 max-w-md text-stone-500 dark:text-stone-400 font-serif italic">
                A digital archive of color combinations inspired by Sanzo Wada&apos;s 
                <span className="not-italic"> &quot;A Dictionary of Color Combinations&quot;</span>.
              </p>
            </div>
            
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center w-full md:w-auto">
              <ThemeToggle />
              
              {/* Search */}
              <div className="relative w-full sm:w-auto">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  placeholder="Search colors..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-10 w-full rounded-full border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 pl-10 pr-4 text-sm outline-none focus:border-stone-400 dark:focus:border-stone-600 focus:ring-0 sm:w-64 text-stone-900 dark:text-stone-100 placeholder:text-stone-400 transition-colors"
                />
              </div>

              {/* Type Filter Tabs */}
              <div className="flex rounded-full bg-white dark:bg-stone-900 p-1 shadow-sm border border-stone-100 dark:border-stone-800 overflow-x-auto w-full sm:w-auto no-scrollbar transition-colors">
                {(['all', '2-color', '3-color', '4-color', 'saved', 'create'] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setFilter(type)}
                    className={`rounded-full px-4 py-1.5 text-xs font-medium transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                      filter === type
                        ? 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900'
                        : 'text-stone-500 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 hover:text-stone-900 dark:hover:text-stone-200'
                    }`}
                  >
                    {type === 'saved' && <Heart className="w-3 h-3 fill-current" />}
                    {type === 'all' ? 'All' : type === 'saved' ? 'Saved' : type === 'create' ? 'Builder' : type.replace('-color', '')}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Color Filter */}
          <div className="flex flex-nowrap overflow-x-auto items-center gap-2 pt-4 border-t border-stone-200/50 dark:border-stone-800/50 pb-2 no-scrollbar">
            <span className="text-xs font-mono uppercase tracking-wider text-stone-400 mr-2 whitespace-nowrap">Filter by Color:</span>
            {COLOR_CATEGORIES.map((category) => (
              <button
                key={category.name}
                onClick={() => setColorFilter(colorFilter === category.name ? null : category.name)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all border whitespace-nowrap ${
                  colorFilter === category.name
                    ? 'bg-white dark:bg-stone-900 border-stone-300 dark:border-stone-700 shadow-sm text-stone-900 dark:text-stone-100 ring-1 ring-stone-200 dark:ring-stone-800'
                    : 'bg-transparent border-transparent hover:bg-white/60 dark:hover:bg-stone-900/60 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
                }`}
              >
                <div 
                  className="w-4 h-4 rounded-full border border-stone-200 dark:border-stone-700 shadow-sm" 
                  style={{ backgroundColor: category.hex }}
                />
                {category.name}
              </button>
            ))}
            {colorFilter && (
              <button
                onClick={() => setColorFilter(null)}
                className="ml-2 text-xs text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 flex items-center gap-1 whitespace-nowrap"
              >
                <X className="w-3 h-3" />
                Clear
              </button>
            )}
          </div>
        </header>

        {/* Grid */}
        {filter === 'create' ? (
          <div className="flex flex-col gap-12">
            {/* Preview Section */}
            <div className="w-full max-w-md mx-auto">
              <h2 className="text-xl font-serif italic text-stone-900 dark:text-stone-100 mb-6 text-center">Your Palette</h2>
              {builderColors.length > 0 ? (
                <ColorCard
                  combination={{
                    id: 0, // Dummy ID
                    type: builderColors.length <= 2 ? '2-color' : builderColors.length === 3 ? '3-color' : '4-color',
                    colors: builderColors
                  }}
                  // No click handler for preview
                />
              ) : (
                <div className="aspect-[4/3] w-full rounded-sm border-2 border-dashed border-stone-200 dark:border-stone-800 flex items-center justify-center text-stone-400 font-mono text-sm">
                  Select colors below
                </div>
              )}
              {builderColors.length > 0 && (
                <div className="mt-4 flex justify-center">
                  <button
                    onClick={() => setBuilderColors([])}
                    className="text-xs text-stone-500 hover:text-red-500 transition-colors"
                  >
                    Clear Palette
                  </button>
                </div>
              )}
            </div>

            {/* Color Selection Grid */}
            <div>
              <h2 className="text-xl font-serif italic text-stone-900 dark:text-stone-100 mb-6">Available Colors</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
                {filteredBuilderColors.map((color) => {
                  const isSelected = builderColors.some(c => c.hex === color.hex);
                  return (
                    <button
                      key={color.hex}
                      onClick={() => {
                        if (isSelected) {
                          setBuilderColors(prev => prev.filter(c => c.hex !== color.hex));
                        } else {
                          if (builderColors.length < 4) {
                            setBuilderColors(prev => [...prev, color]);
                          }
                        }
                      }}
                      className={`group relative aspect-square rounded-sm overflow-hidden transition-all ${
                        isSelected ? 'ring-2 ring-stone-900 dark:ring-stone-100 ring-offset-2 dark:ring-offset-stone-950' : 'hover:scale-105'
                      }`}
                    >
                      <div 
                        className="absolute inset-0" 
                        style={{ backgroundColor: color.hex }} 
                      />
                      <div className="absolute inset-x-0 bottom-0 bg-black/50 p-1 text-[10px] text-white font-mono opacity-0 group-hover:opacity-100 transition-opacity truncate">
                        {color.name}
                      </div>
                      {isSelected && (
                        <div className="absolute top-1 right-1 bg-white rounded-full p-0.5">
                          <X className="w-3 h-3 text-stone-900" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <div className={`grid gap-x-6 gap-y-10 ${isMobile ? 'grid-cols-1' : 'sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'}`}>
            <AnimatePresence mode='popLayout'>
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

        {filter !== 'create' && filteredCombinations.length === 0 && (
          <div className="mt-20 text-center">
            <p className="text-stone-400 font-serif italic">
              {filter === 'saved' ? "No saved combinations yet." : "No combinations found."}
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
