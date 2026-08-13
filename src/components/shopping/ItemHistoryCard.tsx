"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { History, ChevronDown, ChevronUp, MapPin, Tag } from "lucide-react";
import { MatchedHistoryResult } from "@/types/shopping";

interface ItemHistoryCardProps {
  match: MatchedHistoryResult | null;
}

function formatDateRelative(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays <= 0) return "hoje";
    if (diffDays === 1) return "ontem";
    if (diffDays < 30) return `há ${diffDays} dias`;
    const diffMonths = Math.floor(diffDays / 30);
    if (diffMonths === 1) return "há 1 mês";
    return `há ${diffMonths} meses`;
  } catch {
    return "";
  }
}

function formatCurrency(val?: number | null): string {
  if (val === undefined || val === null || isNaN(val)) return "";
  return val.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function ItemHistoryCard({ match }: ItemHistoryCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!match || !match.lastPurchase) return null;

  const { lastPurchase, allPurchases } = match;
  const priceStr = formatCurrency(lastPurchase.price);
  const timeStr = formatDateRelative(lastPurchase.purchased_at);
  const hasMultiple = allPurchases.length > 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: -6, height: 0 }}
      animate={{ opacity: 1, y: 0, height: "auto" }}
      exit={{ opacity: 0, y: -6, height: 0 }}
      transition={{ duration: 0.2 }}
      className="bg-blue-950/20 border border-blue-500/20 rounded-2xl p-3 text-xs overflow-hidden"
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 overflow-hidden">
          <div className="p-1.5 bg-blue-500/10 rounded-lg text-blue-400 flex-shrink-0">
            <History size={14} />
          </div>
          <div className="flex flex-col overflow-hidden">
            <div className="flex items-center gap-1.5 text-zinc-300 font-medium truncate">
              <span>Última compra:</span>
              {priceStr && (
                <span className="text-emerald-400 font-bold">{priceStr}</span>
              )}
              {lastPurchase.location && (
                <span className="text-zinc-400 flex items-center gap-0.5 truncate">
                  <MapPin size={11} className="inline text-blue-400 flex-shrink-0" />
                  {lastPurchase.location}
                </span>
              )}
            </div>
            {timeStr && (
              <span className="text-[10px] text-zinc-500 font-normal">
                {timeStr}
              </span>
            )}
          </div>
        </div>

        {hasMultiple && (
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1 text-[10px] font-semibold text-blue-400 bg-blue-500/10 hover:bg-blue-500/20 px-2 py-1 rounded-lg transition-colors cursor-pointer flex-shrink-0"
          >
            <span>{allPurchases.length} compras</span>
            {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          </button>
        )}
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-2.5 pt-2.5 border-t border-blue-500/10 space-y-1.5"
          >
            {allPurchases.slice(0, 4).map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between text-[11px] text-zinc-400 bg-black/30 px-2.5 py-1.5 rounded-xl"
              >
                <div className="flex items-center gap-2">
                  <span className="text-zinc-500 text-[10px]">
                    {new Date(p.purchased_at).toLocaleDateString("pt-BR")}
                  </span>
                  {p.location && (
                    <span className="text-zinc-300 font-medium truncate max-w-[120px]">
                      {p.location}
                    </span>
                  )}
                </div>
                {p.price ? (
                  <span className="text-emerald-400 font-semibold">
                    {formatCurrency(p.price)}
                  </span>
                ) : (
                  <span className="text-zinc-600 italic">Sem valor</span>
                )}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
