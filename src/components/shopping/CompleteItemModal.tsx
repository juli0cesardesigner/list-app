"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, MapPin, DollarSign } from "lucide-react";
import { ShoppingItem, parseItemName } from "@/types/shopping";
import { useViewport } from "@/hooks/useViewport";

interface CompleteItemModalProps {
  item: ShoppingItem | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (item: ShoppingItem, price: number | null, location: string) => void;
  onSkip: (item: ShoppingItem) => void;
  currentSessionLocation: string;
  frequentLocations: string[];
}

export default function CompleteItemModal({
  item,
  isOpen,
  onClose,
  onConfirm,
  onSkip,
  currentSessionLocation,
  frequentLocations,
}: CompleteItemModalProps) {
  const visibleHeight = useViewport();
  const [priceInput, setPriceInput] = useState("");
  const [location, setLocation] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && item) {
      setPriceInput("");
      setLocation(currentSessionLocation || "");
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, item, currentSessionLocation]);

  if (!isOpen || !item) return null;

  const parsed = parseItemName(item.name);

  const handlePriceChange = (val: string) => {
    const cleaned = val.replace(/[^0-9.,]/g, "").replace(",", ".");
    setPriceInput(cleaned);
  };

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const numPrice = priceInput ? parseFloat(priceInput) : null;
    onConfirm(item, isNaN(numPrice as number) ? null : numPrice, location.trim());
  };

  const handleSkipClick = () => {
    onSkip(item);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/75 backdrop-blur-sm px-0 sm:px-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="w-full max-w-md bg-zinc-950 border-t sm:border border-zinc-800 rounded-t-[32px] sm:rounded-3xl px-6 pt-5 pb-6 flex flex-col shadow-2xl overflow-y-auto no-scrollbar"
          style={{
            maxHeight: visibleHeight > 0 ? `${visibleHeight}px` : "90dvh",
          }}
        >
          {/* Header do Modal */}
          <div className="flex justify-between items-center mb-4">
            <div>
              <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">
                Item Comprado
              </span>
              <h3 className="text-lg font-bold text-white tracking-tight truncate max-w-[260px]">
                {parsed.main}
              </h3>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-zinc-500 hover:text-zinc-300 rounded-full hover:bg-zinc-900 transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            {/* Campo de Preço */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1 flex items-center gap-1">
                <DollarSign size={12} className="text-emerald-400" /> Valor pago (opcional)
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-4 text-zinc-500 font-bold text-base">
                  R$
                </span>
                <input
                  ref={inputRef}
                  type="text"
                  inputMode="decimal"
                  placeholder="0,00"
                  value={priceInput}
                  onChange={(e) => handlePriceChange(e.target.value)}
                  className="w-full bg-zinc-900/80 border border-zinc-800 focus:border-emerald-500/80 rounded-2xl pl-11 pr-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all text-white font-bold text-lg placeholder:text-zinc-700"
                />
              </div>
            </div>

            {/* Campo de Local / Supermercado com Autocomplete */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1 flex items-center gap-1">
                <MapPin size={12} className="text-blue-400" /> Onde comprou?
              </label>
              <input
                type="text"
                placeholder="Ex: Carrefour, Hortifruti..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-zinc-900/80 border border-zinc-800 focus:border-blue-500/80 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/20 transition-all text-white text-base placeholder:text-zinc-700"
              />

              {/* Chips rápidos de locais frequentes */}
              {frequentLocations.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {frequentLocations.slice(0, 5).map((loc) => (
                    <button
                      key={loc}
                      type="button"
                      onClick={() => setLocation(loc)}
                      className={`text-xs px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                        location.toLowerCase() === loc.toLowerCase()
                          ? "bg-blue-600/30 border-blue-500/60 text-blue-300 font-semibold"
                          : "bg-zinc-900 border-zinc-800/80 text-zinc-400 hover:text-white hover:bg-zinc-800"
                      }`}
                    >
                      {loc}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Botões de Ação */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={handleSkipClick}
                className="flex-1 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white rounded-2xl py-3.5 text-sm font-semibold transition-all cursor-pointer"
              >
                Pular
              </button>
              <button
                type="submit"
                className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl py-3.5 text-sm font-bold shadow-lg shadow-emerald-600/20 transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Check size={18} />
                <span>Salvar</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
