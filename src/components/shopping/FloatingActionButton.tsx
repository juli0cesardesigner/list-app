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
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          className="absolute bottom-10 left-0 right-0 px-6 flex justify-center pointer-events-none z-[70]"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClick}
            className="pointer-events-auto bg-blue-500 text-white w-16 h-16 rounded-full shadow-[0_20px_50px_rgba(59,130,246,0.4)] border border-white/20 flex items-center justify-center relative overflow-hidden group transition-all cursor-pointer"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <Plus size={32} strokeWidth={2.5} />
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
