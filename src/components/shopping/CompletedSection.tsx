"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronDown, EyeOff } from "lucide-react";
import { ShoppingItem, parseItemName } from "@/types/shopping";

interface CompletedSectionProps {
  completedItems: ShoppingItem[];
  isOpen: boolean;
  onToggleOpen: () => void;
  onToggleComplete: (item: ShoppingItem) => void;
  onHide: (id: string, e: React.MouseEvent) => void;
}

export default function CompletedSection({
  completedItems,
  isOpen,
  onToggleOpen,
  onToggleComplete,
  onHide,
}: CompletedSectionProps) {
  if (completedItems.length === 0) return null;

  return (
    <section className="space-y-4">
      <button
        onClick={onToggleOpen}
        className="w-full flex items-center justify-between px-2 group focus:outline-none cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <h2 className="text-zinc-500 font-bold text-xs uppercase tracking-widest">
            Comprados
          </h2>
          <span className="bg-zinc-900 text-zinc-600 text-[10px] font-black px-2 py-0.5 rounded-full border border-white/5">
            {completedItems.length}
          </span>
        </div>
        <div
          className={`text-zinc-600 transition-transform duration-500 ${
            isOpen ? "rotate-180" : ""
          }`}
        >
          <ChevronDown size={18} />
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden grid gap-2"
          >
            {completedItems.map((item) => {
              const parsed = parseItemName(item.name);
              return (
                <motion.div
                  layout
                  key={item.id}
                  onClick={() => onToggleComplete(item)}
                  className="bg-zinc-900/30 backdrop-blur-md border border-white/5 rounded-2xl p-4 flex items-center justify-between opacity-50 grayscale transition-all hover:grayscale-0 hover:opacity-80 cursor-pointer"
                >
                  <div className="flex items-center gap-4 flex-1 overflow-hidden">
                    <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/30 flex-shrink-0">
                      <Check size={14} className="text-blue-400" />
                    </div>
                    <div className="flex flex-col overflow-hidden">
                      <span className="text-base font-medium text-zinc-400 line-through decoration-blue-500/30 truncate">
                        {parsed.main}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="text-zinc-600 text-xs font-bold tabular-nums">
                      {item.quantity}x
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onHide(item.id, e);
                      }}
                      className="p-1 text-zinc-600 hover:text-zinc-400 focus:outline-none"
                    >
                      <EyeOff size={16} />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
