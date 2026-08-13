"use client";

import React from "react";
import { motion } from "framer-motion";
import { Pencil, EyeOff } from "lucide-react";
import { ShoppingItem, parseItemName } from "@/types/shopping";

interface ShoppingItemCardProps {
  item: ShoppingItem;
  onToggleComplete: (item: ShoppingItem) => void;
  onEdit: (item: ShoppingItem, e: React.MouseEvent) => void;
  onHide: (id: string, e: React.MouseEvent) => void;
}

export default function ShoppingItemCard({
  item,
  onToggleComplete,
  onEdit,
  onHide,
}: ShoppingItemCardProps) {
  const parsed = parseItemName(item.name);
  const qty = parseInt(item.quantity, 10);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      className="relative group"
    >
      <div className="bg-[#1c1c1e]/80 backdrop-blur-2xl border border-white/10 rounded-[22px] p-4 shadow-2xl flex items-center justify-between transition-colors active:bg-[#2c2c2e]/90">
        <div
          className="flex items-center gap-4 flex-1 cursor-pointer overflow-hidden"
          onClick={() => onToggleComplete(item)}
        >
          {/* Checkbox estilo Apple */}
          <div className="w-7 h-7 rounded-full border-2 border-blue-500/50 flex items-center justify-center transition-colors hover:border-blue-500 hover:bg-blue-500/10 flex-shrink-0">
            <div className="w-3 h-3 rounded-full bg-blue-500 opacity-0 group-hover:opacity-20 transition-opacity" />
          </div>

          <div className="flex flex-col overflow-hidden">
            <span className="text-lg font-semibold tracking-tight leading-tight text-white truncate">
              {parsed.main}
            </span>
            {parsed.alternatives.length > 0 && (
              <div className="flex items-center gap-1.5 mt-1 overflow-hidden">
                <span className="text-zinc-400 text-xs font-medium truncate italic">
                  {parsed.alternatives.join(", ")}
                </span>
              </div>
            )}
            {!isNaN(qty) && qty > 1 && (
              <span className="text-blue-400/80 text-[10px] font-bold mt-1 uppercase tracking-widest">
                {qty} unidades
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={(e) => onEdit(item, e)}
            className="p-2 text-zinc-500 hover:text-blue-400 transition-colors focus:outline-none cursor-pointer"
            title="Editar"
          >
            <Pencil size={18} />
          </button>
          <button
            onClick={(e) => onHide(item.id, e)}
            className="p-2 text-zinc-500 hover:text-zinc-300 transition-colors focus:outline-none cursor-pointer"
            title="Ocultar"
          >
            <EyeOff size={18} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
