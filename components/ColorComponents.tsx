"use client";

import { useState } from 'react';
import { motion } from 'motion/react';
import { ColorCombination } from '@/data/colors';
import { cn, hexToRgb } from '@/lib/utils';
import { Copy, Check, Heart, Share2 } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface ColorCardProps {
  combination: ColorCombination;
  onClick?: () => void;
  isSaved?: boolean;
  onToggleSave?: (e: React.MouseEvent) => void;
}

export function ColorCard({ combination, onClick, isSaved, onToggleSave }: ColorCardProps) {
  return (
    <motion.div
      layoutId={`card-${combination.id}`}
      className="group cursor-pointer flex flex-col gap-2"
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
            "absolute top-2 right-2 p-2 rounded-full bg-white/90 dark:bg-stone-900/90 backdrop-blur-sm shadow-sm transition-all duration-200 hover:scale-110 z-10",
            isSaved ? "text-red-500" : "text-stone-400 hover:text-red-500 opacity-0 group-hover:opacity-100"
          )}
        >
          <Heart className={cn("w-4 h-4", isSaved && "fill-current")} />
        </button>
      </div>
      <div className="flex items-baseline justify-between px-1">
        <span className="font-mono text-xs text-stone-500 dark:text-stone-400">#{combination.id.toString().padStart(3, '0')}</span>
        <div className="flex gap-1">
          {combination.colors.map((c, i) => (
            <div key={i} className="h-2 w-2 rounded-full" style={{ backgroundColor: c.hex }} />
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

export function ColorDetail({ combination, onClose, isSaved, onToggleSave }: ColorDetailProps) {
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
    url.searchParams.set('id', combination.id.toString());
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
        className="absolute inset-0 bg-stone-900/40 dark:bg-black/60 backdrop-blur-sm"
      />
      <motion.div
        layoutId={`card-${combination.id}`}
        className="relative z-10 w-full max-w-4xl overflow-hidden rounded-lg bg-[#F4F1EA] dark:bg-stone-900 shadow-2xl flex flex-col max-h-[90vh]"
      >
        <div className={`flex ${isMobile ? 'flex-col' : 'flex-row'} h-full`}>
          {/* Visual Representation */}
          <div className={`${isMobile ? 'h-48 shrink-0' : 'flex-1'} flex ${isMobile ? 'flex-row' : 'flex-col md:flex-row'}`}>
             {combination.colors.map((color, index) => (
              <div
                key={index}
                className="flex-1 relative group/color"
                style={{ backgroundColor: color.hex }}
              >
                 <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/color:opacity-100 transition-opacity">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        copyToClipboard(color.hex);
                      }}
                      className="bg-white/90 dark:bg-stone-900/90 text-stone-900 dark:text-stone-100 px-3 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider shadow-sm hover:bg-white dark:hover:bg-stone-800"
                    >
                      {copiedHex === color.hex ? <Check className="w-3 h-3 inline mr-1"/> : <Copy className="w-3 h-3 inline mr-1"/>}
                      {color.hex}
                    </button>
                 </div>
              </div>
            ))}
          </div>

          {/* Info Panel */}
          <div className={`${isMobile ? 'w-full flex-1 overflow-y-auto' : 'w-80 border-l'} flex flex-col border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-950 p-6 md:p-8`}>
            <div className="mb-8 flex items-start justify-between">
              <div>
                <h2 className="font-serif text-3xl italic text-stone-900 dark:text-stone-100 mb-1">
                  Combination {combination.id}
                </h2>
                <p className="text-stone-500 dark:text-stone-400 text-sm font-mono uppercase tracking-widest">
                  {combination.type}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleShare}
                  className="p-2 rounded-full hover:bg-stone-100 dark:hover:bg-stone-900 text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-colors relative"
                  title="Copy link"
                >
                  {hasShared ? <Check className="w-5 h-5 text-emerald-600" /> : <Share2 className="w-5 h-5" />}
                </button>
                <button
                  onClick={onToggleSave}
                  className={cn(
                    "p-2 rounded-full hover:bg-stone-100 dark:hover:bg-stone-900 transition-colors",
                    isSaved ? "text-red-500" : "text-stone-400 hover:text-red-500"
                  )}
                  title={isSaved ? "Remove from saved" : "Save combination"}
                >
                  <Heart className={cn("w-5 h-5", isSaved && "fill-current")} />
                </button>
              </div>
            </div>

            <div className="space-y-6">
              {combination.colors.map((color, index) => (
                <div key={index} className="group">
                  <div className="flex items-center gap-3 mb-2">
                    <div 
                      className="w-4 h-4 rounded-full border border-stone-100 dark:border-stone-800 shadow-sm" 
                      style={{ backgroundColor: color.hex }}
                    />
                    <h3 className="font-medium text-stone-900 dark:text-stone-100">{color.name}</h3>
                  </div>
                  <div className="pl-7 space-y-3">
                    {/* HEX */}
                    <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 font-mono group/format">
                      <span>HEX</span>
                      <button 
                        onClick={() => copyToClipboard(color.hex)}
                        className="hover:text-stone-900 dark:hover:text-stone-100 transition-colors flex items-center gap-1"
                      >
                        {color.hex}
                        {copiedHex === color.hex ? <Check className="w-3 h-3 text-emerald-600"/> : <Copy className="w-3 h-3 opacity-0 group-hover/format:opacity-100 transition-opacity"/>}
                      </button>
                    </div>

                    {/* RGB */}
                    <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 font-mono group/format">
                      <span>RGB</span>
                      <button 
                        onClick={() => {
                          const rgb = hexToRgb(color.hex);
                          if (rgb) copyToClipboard(`rgb(${rgb})`);
                        }}
                        className="hover:text-stone-900 dark:hover:text-stone-100 transition-colors flex items-center gap-1"
                      >
                        {hexToRgb(color.hex) ? `rgb(${hexToRgb(color.hex)})` : '-'}
                        {copiedHex === `rgb(${hexToRgb(color.hex)})` ? <Check className="w-3 h-3 text-emerald-600"/> : <Copy className="w-3 h-3 opacity-0 group-hover/format:opacity-100 transition-opacity"/>}
                      </button>
                    </div>

                    {/* RGBA */}
                    <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 font-mono group/format">
                      <span>RGBA</span>
                      <button 
                        onClick={() => {
                          const rgb = hexToRgb(color.hex);
                          if (rgb) copyToClipboard(`rgba(${rgb}, 1)`);
                        }}
                        className="hover:text-stone-900 dark:hover:text-stone-100 transition-colors flex items-center gap-1"
                      >
                        {hexToRgb(color.hex) ? `rgba(${hexToRgb(color.hex)}, 1)` : '-'}
                        {copiedHex === `rgba(${hexToRgb(color.hex)}, 1)` ? <Check className="w-3 h-3 text-emerald-600"/> : <Copy className="w-3 h-3 opacity-0 group-hover/format:opacity-100 transition-opacity"/>}
                      </button>
                    </div>

                    {/* CMYK */}
                    {color.cmyk && (
                      <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 font-mono group/format">
                        <span>CMYK</span>
                        <button 
                          onClick={() => copyToClipboard(color.cmyk!)}
                          className="hover:text-stone-900 dark:hover:text-stone-100 transition-colors flex items-center gap-1"
                        >
                          {color.cmyk}
                          {copiedHex === color.cmyk ? <Check className="w-3 h-3 text-emerald-600"/> : <Copy className="w-3 h-3 opacity-0 group-hover/format:opacity-100 transition-opacity"/>}
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
                className="w-full py-3 border border-stone-200 dark:border-stone-800 rounded-md text-sm font-medium text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-900 hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
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
