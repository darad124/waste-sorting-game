import React, { useState } from "react";
import { ArrowLeft, BookOpen, Lock, X, Info, HelpCircle } from "lucide-react";
import { WASTE_ITEMS } from "../data/wasteItems";
import type { WasteItem, WasteCategory } from "../data/wasteItems";
import { useGameStore } from "../state/gameStore";
import { BinBadge, CATEGORY_META } from "../components/BinBadge";
import { ItemSVG } from "../components/ItemSVG";

interface EncyclopediaScreenProps {
  onBack: () => void;
}

type FilterCategory = "all" | WasteCategory;

export const EncyclopediaScreen: React.FC<EncyclopediaScreenProps> = ({ onBack }) => {
  const { unlockedEncyclopediaIds } = useGameStore();
  const [activeFilter, setActiveFilter] = useState<FilterCategory>("all");
  const [selectedItem, setSelectedItem] = useState<WasteItem | null>(null);

  // Filter items
  const filteredItems = WASTE_ITEMS.filter((item) => {
    if (activeFilter === "all") return true;
    return item.category === activeFilter;
  });

  const categories: { value: FilterCategory; label: string; emoji?: string }[] = [
    { value: "all", label: "All Items" },
    { value: "recyclable", label: "Recyclable", emoji: "♻️" },
    { value: "organic", label: "Organic", emoji: "🍌" },
    { value: "hazardous", label: "Hazardous", emoji: "⚠️" },
    { value: "eWaste", label: "E-Waste", emoji: "🔌" },
    { value: "general", label: "General", emoji: "🗑️" },
  ];

  return (
    <div className="flex flex-col h-full p-5 text-left select-none overflow-hidden relative max-w-4xl mx-auto w-full">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={onBack}
          className="p-2 rounded-full glass-card text-slate-700 hover:text-slate-950 transition-all cursor-pointer border border-slate-950/10 shadow-premium"
        >
          <ArrowLeft size={18} />
        </button>
        <h2 className="text-xl font-extrabold text-slate-950 m-0">Waste Encyclopedia</h2>
      </div>

      <p className="text-xs text-slate-700 leading-relaxed mb-4 font-semibold">
        Discover information on each type of waste. Sort items correctly in the game to unlock their detailed fact cards.
      </p>

      {/* Category Pills Filter */}
      <div className="flex gap-1.5 overflow-x-auto pb-3 mb-2 shrink-0 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setActiveFilter(cat.value)}
            className={`px-3 py-1.5 text-xs font-bold rounded-full transition-all duration-200 cursor-pointer border shrink-0 ${
              activeFilter === cat.value
                ? "bg-emerald-600 text-white border-emerald-500"
                : "glass-card text-slate-800 border-slate-950/5 hover:text-slate-950 hover:bg-white/60 shadow-premium"
            }`}
          >
            {cat.emoji && <span className="mr-1">{cat.emoji}</span>}
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Items Grid */}
      <div className="flex-1 overflow-y-auto pr-1 no-scrollbar">
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4 pb-6">
          {filteredItems.map((item) => {
            const isUnlocked = unlockedEncyclopediaIds.includes(item.id);

            return (
              <div
                key={item.id}
                onClick={() => isUnlocked && setSelectedItem(item)}
                className={`p-3 rounded-xl border flex flex-col items-center justify-between text-center aspect-square transition-all duration-300 ${
                  isUnlocked
                    ? "glass-card border-slate-950/5 shadow-premium cursor-pointer hover:border-emerald-500/40 hover:scale-[1.03] hover:bg-white/60"
                    : "bg-slate-950/5 border-slate-950/10 opacity-70 cursor-not-allowed"
                }`}
              >
                <div className="my-auto">
                  {isUnlocked ? (
                    <ItemSVG itemId={item.id} size={48} className="filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.1)]" />
                  ) : (
                    <Lock size={24} className="text-slate-500 opacity-60" />
                  )}
                </div>
                <div className="text-[10px] font-black text-slate-800 truncate w-full mt-1.5 px-0.5">
                  {isUnlocked ? item.name : "Locked"}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Fact Card Detail Overlay Modal */}
      {selectedItem && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-5">
          <div className="glass-panel w-full max-w-[380px] rounded-3xl border border-slate-950/10 overflow-hidden shadow-2xl flex flex-col scale-in">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-950/10 bg-white/40">
              <div className="flex items-center gap-2">
                <BookOpen size={16} className="text-blue-700" />
                <span className="text-xs font-black text-slate-600 uppercase tracking-wide">Fact Sheet</span>
              </div>
              <button
                onClick={() => setSelectedItem(null)}
                className="p-1 rounded-full hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-all cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 overflow-y-auto max-h-[420px] flex flex-col gap-4 text-left no-scrollbar">
              {/* Item Card Title & Custom SVG */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-white/70 border border-slate-950/5 flex items-center justify-center shadow-inner filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.1)]">
                  <ItemSVG itemId={selectedItem.id} size={48} />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900 leading-tight mb-1">{selectedItem.name}</h3>
                  <BinBadge category={selectedItem.category} />
                </div>
              </div>

              {/* Fast Fact */}
              <div className="bg-emerald-500/10 border border-emerald-600/20 p-3.5 rounded-xl">
                <div className="flex items-center gap-1.5 text-emerald-800 font-black text-xs mb-1">
                  <Info size={12} />
                  <span>ENVIRONMENTAL FACT</span>
                </div>
                <p className="text-xs text-slate-800 leading-normal font-semibold">
                  {selectedItem.shortFact}
                </p>
              </div>

              {/* Disposal Guideline */}
              <div className="bg-blue-500/10 border border-blue-600/20 p-3.5 rounded-xl">
                <div className="flex items-center gap-1.5 text-blue-800 font-black text-xs mb-1">
                  <HelpCircle size={12} />
                  <span>HOW TO DISPOSE</span>
                </div>
                <p className="text-xs text-slate-800 leading-normal font-semibold">
                  {selectedItem.disposalInstruction}
                </p>
              </div>

              {/* Environmental Impact Note */}
              <div className="flex flex-col gap-1.5 px-1.5">
                <span className="text-[10px] font-black text-slate-600 uppercase tracking-wider">Ecological Impact</span>
                <p className="text-xs text-slate-700 leading-relaxed font-semibold">
                  {selectedItem.impactNote}
                </p>
              </div>

              {/* Common Mistakes (If Available) */}
              {selectedItem.commonMistake && (
                <div className="bg-rose-500/10 border border-rose-600/20 p-3 rounded-xl flex items-start gap-2">
                  <Lock size={12} className="text-rose-700 shrink-0 mt-0.5" />
                  <div className="text-[11px] leading-snug">
                    <span className="text-rose-800 font-black mr-1">Common Mistake:</span>
                    <span className="text-slate-700 font-semibold">
                      Players often throw this into the{" "}
                      <span className="text-rose-800 font-bold uppercase">
                        {CATEGORY_META[selectedItem.commonMistake].label}
                      </span>{" "}
                      bin instead.
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-950/10 bg-white/40 text-center">
              <button
                onClick={() => setSelectedItem(null)}
                className="px-6 py-2 bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs rounded-xl cursor-pointer transition-all border border-slate-300 shadow-premium"
              >
                CLOSE CARD
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
