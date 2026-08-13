"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, MapPin, Trash2, Plus, History, ShieldAlert, Check } from "lucide-react";
import { useViewport } from "@/hooks/useViewport";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  frequentLocations: string[];
  onDeleteLocation: (name: string) => void;
  onAddLocation: (name: string) => void;
  onClearHistory: () => void;
  historyCount: number;
}

export default function SettingsModal({
  isOpen,
  onClose,
  frequentLocations,
  onDeleteLocation,
  onAddLocation,
  onClearHistory,
  historyCount,
}: SettingsModalProps) {
  const visibleHeight = useViewport();
  const [newLoc, setNewLoc] = useState("");
  const [showConfirmClear, setShowConfirmClear] = useState(false);

  if (!isOpen) return null;

  const handleAddLocation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLoc.trim()) return;
    onAddLocation(newLoc.trim());
    setNewLoc("");
  };

  const handleExecuteClear = () => {
    onClearHistory();
    setShowConfirmClear(false);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-3xl p-6 flex flex-col shadow-2xl overflow-y-auto no-scrollbar"
          style={{
            maxHeight: visibleHeight > 0 ? `${visibleHeight}px` : "90dvh",
          }}
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-white tracking-tight">
              Configurações
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-zinc-500 hover:text-zinc-300 rounded-full hover:bg-zinc-900 transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          <div className="space-y-6">
            {/* Seção de Locais e Supermercados */}
            <div className="space-y-3">
              <div className="flex items-center gap-1.5 text-xs font-black text-zinc-400 uppercase tracking-wider">
                <MapPin size={14} className="text-blue-400" />
                <span>Supermercados & Locais Rápidos</span>
              </div>

              <form onSubmit={handleAddLocation} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Adicionar novo local..."
                  value={newLoc}
                  onChange={(e) => setNewLoc(e.target.value)}
                  className="flex-1 bg-zinc-900/80 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder:text-zinc-600 outline-none focus:ring-2 focus:ring-blue-500/20"
                />
                <button
                  type="submit"
                  disabled={!newLoc.trim()}
                  className="bg-blue-600 hover:bg-blue-500 disabled:opacity-30 text-white px-3.5 py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center"
                >
                  <Plus size={18} />
                </button>
              </form>

              <div className="flex flex-wrap gap-2 pt-1">
                {frequentLocations.map((loc) => (
                  <div
                    key={loc}
                    className="flex items-center gap-1.5 bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-1.5 text-xs text-zinc-300"
                  >
                    <span>{loc}</span>
                    <button
                      type="button"
                      onClick={() => onDeleteLocation(loc)}
                      className="text-zinc-500 hover:text-red-400 transition-colors cursor-pointer ml-1"
                    >
                      <X size={13} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Seção de Histórico de Compras */}
            <div className="space-y-3 pt-4 border-t border-zinc-900">
              <div className="flex items-center gap-1.5 text-xs font-black text-zinc-400 uppercase tracking-wider">
                <History size={14} className="text-emerald-400" />
                <span>Histórico & Preços Salvos</span>
              </div>

              <div className="bg-zinc-900/40 border border-zinc-900 rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-white">
                    {historyCount} {historyCount === 1 ? "registro" : "registros"}
                  </p>
                  <p className="text-xs text-zinc-500">
                    Preços e locais salvos na nuvem
                  </p>
                </div>

                {!showConfirmClear ? (
                  <button
                    type="button"
                    onClick={() => setShowConfirmClear(true)}
                    className="text-xs text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 px-3 py-2 rounded-xl transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <Trash2 size={14} />
                    <span>Limpar</span>
                  </button>
                ) : (
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setShowConfirmClear(false)}
                      className="text-xs text-zinc-400 hover:text-white px-2.5 py-1.5 rounded-lg bg-zinc-800 cursor-pointer"
                    >
                      Não
                    </button>
                    <button
                      type="button"
                      onClick={handleExecuteClear}
                      className="text-xs text-white bg-red-600 hover:bg-red-500 px-2.5 py-1.5 rounded-lg font-bold cursor-pointer"
                    >
                      Sim, apagar
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
