"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";

interface FloatingActionButtonProps {
  isVisible: boolean;
  onClick: () => void;
}

export default function FloatingActionButton({
  isVisible,
  onClick,
}: FloatingActionButtonProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.6, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6, y: 20 }}
          transition={{ type: "spring", damping: 22, stiffness: 260 }}
          className="fixed bottom-7 left-0 right-0 max-w-md mx-auto px-6 flex justify-center pointer-events-none z-40 pb-[env(safe-area-inset-bottom)]"
        >
          <motion.button
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.92 }}
            onClick={onClick}
            aria-label="Adicionar item"
            className="pointer-events-auto bg-blue-600 hover:bg-blue-500 text-white w-16 h-16 rounded-full shadow-[0_12px_32px_rgba(37,99,235,0.5)] border border-white/20 flex items-center justify-center relative overflow-hidden group transition-all cursor-pointer backdrop-blur-md active:shadow-[0_6px_20px_rgba(37,99,235,0.4)]"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-white/25 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <Plus size={32} strokeWidth={2.5} />
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
