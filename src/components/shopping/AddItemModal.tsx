"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Minus } from "lucide-react";
import { useViewport } from "@/hooks/useViewport";

interface AddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (name: string, quantity: number, alternatives: string[]) => void;
}

export default function AddItemModal({
  isOpen,
  onClose,
  onAdd,
}: AddItemModalProps) {
  const visibleHeight = useViewport();
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [alternatives, setAlternatives] = useState<string[]>([""]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setName("");
      setQuantity(1);
      setAlternatives([""]);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onAdd(name, quantity, alternatives);
  };

  const handleAltChange = (index: number, val: string) => {
    const next = [...alternatives];
    next[index] = val;
    if (val.trim() !== "" && index === alternatives.length - 1) {
      next.push("");
    }
    setAlternatives(next);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 80 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 80 }}
        transition={{ type: "spring", damping: 25, stiffness: 220 }}
        className="fixed inset-0 z-50 bg-black flex flex-col px-5 pt-8 pb-3"
        style={{
          height: visibleHeight > 0 ? `${visibleHeight}px` : "100dvh",
          maxHeight: visibleHeight > 0 ? `${visibleHeight}px` : "100dvh",
        }}
      >
        {/* Header Fixo */}
        <div className="flex justify-between items-center mb-4 flex-shrink-0">
          <div className="w-9" />
          <h2 className="text-lg font-bold tracking-tight text-white">
            Adicionar Item
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 bg-zinc-900 border border-zinc-800 rounded-full hover:bg-zinc-800 transition-colors text-zinc-400 focus:outline-none cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Formulário com Scroll Interno e Botão Sticky */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col flex-1 min-h-0 justify-between"
        >
          <div className="space-y-4 flex-1 overflow-y-auto overscroll-contain pr-1 py-1">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1">
                O que comprar?
              </label>
              <input
                ref={inputRef}
                type="text"
                placeholder="Ex: Maçã"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-zinc-900/80 border border-zinc-800 focus:border-blue-500/80 rounded-2xl px-4 py-3.5 outline-none focus:ring-2 focus:ring-blue-500/30 transition-all text-white placeholder:text-zinc-600 font-medium text-base"
              />
            </div>

            <div className="space-y-2">
              {alternatives.map((alt, idx) => {
                const show = idx === 0 || alternatives[idx - 1].trim() !== "";
                if (!show) return null;
                return (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={idx}
                    className="flex gap-2.5 items-center"
                  >
                    <span className="text-[10px] text-zinc-600 font-black uppercase w-5 text-center">
                      ou
                    </span>
                    <input
                      type="text"
                      placeholder="Outra opção..."
                      value={alt}
                      onChange={(e) => handleAltChange(idx, e.target.value)}
                      className={`flex-1 bg-transparent border rounded-2xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500/30 transition-all text-sm ${
                        alt.trim() === ""
                          ? "border-dashed border-zinc-800 text-zinc-600"
                          : "border-solid border-zinc-700 text-white bg-zinc-900/40"
                      }`}
                    />
                    {alt.trim() !== "" && (
                      <button
                        type="button"
                        onClick={() =>
                          setAlternatives(
                            alternatives.filter((_, i) => i !== idx)
                          )
                        }
                        className="p-1.5 text-zinc-500 hover:text-red-400 cursor-pointer"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </motion.div>
                );
              })}
            </div>

            <div className="flex flex-col items-center pt-2">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-2.5">
                Quantidade
              </label>
              <div className="flex items-center bg-zinc-900/80 border border-zinc-800 rounded-3xl px-5 py-1.5 gap-6">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="text-zinc-400 hover:text-white rounded-xl p-2 transition-all active:scale-90 cursor-pointer"
                >
                  <Minus size={20} />
                </button>
                <span className="font-bold min-w-[2ch] text-center text-white tabular-nums text-2xl">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="text-zinc-400 hover:text-white rounded-xl p-2 transition-all active:scale-90 cursor-pointer"
                >
                  <Plus size={20} />
                </button>
              </div>
            </div>
          </div>

          {/* Botão de Ação Sticky Sempre Visível Acima do Teclado */}
          <div className="sticky bottom-0 pt-3 pb-2 bg-gradient-to-t from-black via-black/95 to-transparent z-10 flex-shrink-0">
            <button
              type="submit"
              disabled={!name.trim()}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white rounded-2xl py-3.5 text-base font-bold disabled:opacity-30 disabled:grayscale transition-all active:scale-[0.98] shadow-lg shadow-blue-500/20 cursor-pointer"
            >
              Adicionar à Lista
            </button>
          </div>
        </form>
      </motion.div>
    </AnimatePresence>
  );
}
