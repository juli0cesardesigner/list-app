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
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 100 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="fixed inset-0 z-50 bg-black flex flex-col px-6 pt-12 pb-8 overflow-y-auto no-scrollbar"
        style={{
          height: visibleHeight > 0 ? `${visibleHeight}px` : "100dvh",
        }}
      >
        <div
          className="flex flex-col flex-1"
          style={{
            scale: visibleHeight < 600 ? 0.9 : 1,
            transformOrigin: "top center",
          }}
        >
          <div className="flex justify-between items-center mb-8 flex-shrink-0">
            <div className="w-10" />
            <h2 className="text-xl font-bold tracking-tight text-white">
              Adicionar Item
            </h2>
            <button
              onClick={onClose}
              className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors text-zinc-400 focus:outline-none"
            >
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col flex-1">
            <div className="space-y-6 flex-1">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1">
                  O que comprar?
                </label>
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Ex: Maçã"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white/5 border border-white/5 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-white placeholder:text-zinc-600 font-medium text-lg"
                />
              </div>

              <div className="space-y-3">
                {alternatives.map((alt, idx) => {
                  const show = idx === 0 || alternatives[idx - 1].trim() !== "";
                  if (!show) return null;
                  return (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      key={idx}
                      className="flex gap-3 items-center"
                    >
                      <span className="text-[10px] text-zinc-600 font-black uppercase w-6 text-center">
                        ou
                      </span>
                      <input
                        type="text"
                        placeholder="Outra opção..."
                        value={alt}
                        onChange={(e) => handleAltChange(idx, e.target.value)}
                        className={`flex-1 bg-transparent border rounded-2xl px-5 py-3 outline-none focus:ring-2 focus:ring-blue-500/30 transition-all text-base ${
                          alt.trim() === ""
                            ? "border-dashed border-white/5 text-zinc-600"
                            : "border-solid border-white/10 text-white"
                        }`}
                      />
                      {alt.trim() !== "" && (
                        <button
                          type="button"
                          onClick={() =>
                            setAlternatives(alternatives.filter((_, i) => i !== idx))
                          }
                          className="p-2 text-zinc-600 hover:text-red-400"
                        >
                          <X size={18} />
                        </button>
                      )}
                    </motion.div>
                  );
                })}
              </div>

              <div className="flex flex-col items-center pt-4">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-4">
                  Quantidade
                </label>
                <div className="flex items-center bg-white/5 border border-white/5 rounded-[32px] px-6 py-2 shadow-inner gap-8">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="text-zinc-400 hover:text-white hover:bg-white/5 rounded-2xl p-3 transition-all active:scale-90"
                  >
                    <Minus size={24} />
                  </button>
                  <span className="font-bold min-w-[2ch] text-center text-white tabular-nums text-3xl">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="text-zinc-400 hover:text-white hover:bg-white/5 rounded-2xl p-3 transition-all active:scale-90"
                  >
                    <Plus size={24} />
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-auto pt-6">
              <button
                type="submit"
                disabled={!name.trim()}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-[24px] py-4 text-lg font-bold disabled:opacity-30 disabled:grayscale transition-all active:scale-[0.98] shadow-[0_20px_40px_rgba(59,130,246,0.3)] cursor-pointer"
              >
                Adicionar à Lista
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
