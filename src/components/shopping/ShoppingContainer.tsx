"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import { useShoppingList } from "@/hooks/useShoppingList";
import ShoppingHeader from "./ShoppingHeader";
import ShoppingItemCard from "./ShoppingItemCard";
import CompletedSection from "./CompletedSection";
import HiddenSection from "./HiddenSection";
import FloatingActionButton from "./FloatingActionButton";
import AddItemModal from "./AddItemModal";
import EditItemModal from "./EditItemModal";

export default function ShoppingContainer() {
  const {
    activeItems,
    completedItems,
    hiddenItems,
    loading,
    isCompletedOpen,
    setIsCompletedOpen,
    isAddModalOpen,
    setIsAddModalOpen,
    editingItem,
    setEditingItem,
    handleAddItem,
    handleEditItem,
    toggleComplete,
    setItemHidden,
    deleteItem,
  } = useShoppingList();

  const isFormOpen = isAddModalOpen || !!editingItem;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto flex flex-col h-full min-h-screen relative px-4 pt-8 pb-[calc(8rem+env(safe-area-inset-bottom))] overflow-y-auto overflow-x-hidden no-scrollbar bg-black text-white">
      <AnimatePresence mode="wait">
        {!isFormOpen && (
          <motion.div
            key="main-list"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col w-full pt-4"
          >
            <div className="flex-1 space-y-8">
              <section className="space-y-3">
                <div className="grid gap-3">
                  <AnimatePresence mode="popLayout">
                    {activeItems.map((item) => (
                      <ShoppingItemCard
                        key={item.id}
                        item={item}
                        onToggleComplete={toggleComplete}
                        onEdit={(item, e) => {
                          e.stopPropagation();
                          setEditingItem(item);
                        }}
                        onHide={(id, e) => {
                          e.stopPropagation();
                          setItemHidden(id, true);
                        }}
                      />
                    ))}
                  </AnimatePresence>

                  {activeItems.length === 0 &&
                    completedItems.length === 0 &&
                    hiddenItems.length === 0 && (
                      <div className="text-center py-20">
                        <div className="bg-zinc-900/40 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/10">
                          <Plus className="text-zinc-500" size={28} />
                        </div>
                        <p className="text-zinc-500 text-sm font-medium">
                          Sua lista está vazia
                        </p>
                      </div>
                    )}

                  {activeItems.length === 0 && completedItems.length > 0 && (
                    <div className="text-center py-8">
                      <p className="text-zinc-500 text-sm font-medium italic">
                        Tudo comprado! 🎉
                      </p>
                    </div>
                  )}
                </div>
              </section>

              <CompletedSection
                completedItems={completedItems}
                isOpen={isCompletedOpen}
                onToggleOpen={() => setIsCompletedOpen(!isCompletedOpen)}
                onToggleComplete={toggleComplete}
                onHide={(id, e) => setItemHidden(id, true)}
              />

              <HiddenSection
                hiddenItems={hiddenItems}
                onUnhide={(id, e) => setItemHidden(id, false)}
                onDelete={(id, e) => deleteItem(id)}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <FloatingActionButton
        isVisible={!isFormOpen}
        onClick={() => setIsAddModalOpen(true)}
      />

      <AddItemModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddItem}
      />

      <EditItemModal
        item={editingItem}
        onClose={() => setEditingItem(null)}
        onSave={handleEditItem}
      />
    </div>
  );
}
