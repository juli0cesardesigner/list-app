"use client";

import React from "react";
import { Eye, Trash2 } from "lucide-react";
import { ShoppingItem } from "@/types/shopping";

interface HiddenSectionProps {
  hiddenItems: ShoppingItem[];
  onUnhide: (id: string, e: React.MouseEvent) => void;
  onDelete: (id: string, e: React.MouseEvent) => void;
}

export default function HiddenSection({
  hiddenItems,
  onUnhide,
  onDelete,
}: HiddenSectionProps) {
  if (hiddenItems.length === 0) return null;

  return (
    <section className="space-y-4 pt-4 border-t border-white/5">
      <h2 className="text-zinc-600 font-bold text-[10px] uppercase tracking-[0.2em] px-2">
        Ocultos / Lixeira
      </h2>
      <div className="grid gap-2">
        {hiddenItems.map((item) => (
          <div
            key={item.id}
            className="bg-zinc-900/10 border border-dashed border-white/5 rounded-2xl p-4 flex items-center justify-between"
          >
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-medium text-zinc-600 truncate">
                {item.name}
              </span>
              <span className="text-zinc-700 text-[10px] font-bold">
                {item.quantity}x
              </span>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              <button
                onClick={(e) => onUnhide(item.id, e)}
                className="p-2 text-zinc-600 hover:text-blue-500 transition-colors focus:outline-none"
                title="Restaurar"
              >
                <Eye size={18} />
              </button>
              <button
                onClick={(e) => onDelete(item.id, e)}
                className="p-2 text-zinc-600 hover:text-red-500 transition-colors focus:outline-none"
                title="Excluir"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
