"use client";

import { useState, useEffect, useCallback } from "react";
import { ShoppingItem, parseItemName } from "@/types/shopping";
import {
  getCurrentUserId,
  fetchShoppingItems,
  insertShoppingItem,
  updateShoppingItem,
  deleteShoppingItem,
  subscribeShoppingItems,
} from "@/services/shoppingService";

export function useShoppingList() {
  const [items, setItems] = useState<ShoppingItem[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Accordion state
  const [isCompletedOpen, setIsCompletedOpen] = useState(false);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ShoppingItem | null>(null);

  const reloadItems = useCallback(async () => {
    const data = await fetchShoppingItems();
    setItems(data);
  }, []);

  useEffect(() => {
    async function init() {
      const uid = await getCurrentUserId();
      setUserId(uid);
      await reloadItems();
      setLoading(false);
    }
    init();

    const unsubscribe = subscribeShoppingItems(
      (newItem) => {
        setItems((prev) => {
          if (prev.some((i) => i.id === newItem.id)) return prev;
          const tempIdx = prev.findIndex(
            (i) => i.id.startsWith("temp-") && i.name === newItem.name
          );
          if (tempIdx >= 0) {
            const next = [...prev];
            next[tempIdx] = newItem;
            return next;
          }
          return [newItem, ...prev];
        });
      },
      (updated) => {
        setItems((prev) => prev.map((i) => (i.id === updated.id ? updated : i)));
      },
      (deletedId) => {
        setItems((prev) => prev.filter((i) => i.id !== deletedId));
      }
    );

    return () => {
      unsubscribe();
    };
  }, [reloadItems]);

  const handleAddItem = async (name: string, quantity: number, alternatives: string[]) => {
    if (!name.trim() || !userId) return;
    let finalName = name.trim();
    const validAlts = alternatives.filter((a) => a.trim() !== "");
    if (validAlts.length > 0) {
      finalName = `${finalName} / ${validAlts.join(" / ")}`;
    }

    const tempId = `temp-${Date.now()}`;
    const newItem: ShoppingItem = {
      id: tempId,
      user_id: userId,
      name: finalName,
      quantity: quantity.toString(),
      is_completed: false,
      is_hidden: false,
    };

    setItems((prev) => [newItem, ...prev]);
    setIsAddModalOpen(false);

    const inserted = await insertShoppingItem({
      user_id: userId,
      name: finalName,
      quantity: quantity.toString(),
      is_completed: false,
      is_hidden: false,
    });

    if (!inserted) {
      reloadItems();
    } else {
      setItems((prev) => prev.map((i) => (i.id === tempId ? inserted : i)));
    }
  };

  const handleEditItem = async (name: string, quantity: number, alternatives: string[]) => {
    if (!editingItem || !name.trim()) return;
    let finalName = name.trim();
    const validAlts = alternatives.filter((a) => a.trim() !== "");
    if (validAlts.length > 0) {
      finalName = `${finalName} / ${validAlts.join(" / ")}`;
    }

    const updated = {
      ...editingItem,
      name: finalName,
      quantity: quantity.toString(),
    };

    setItems((prev) => prev.map((i) => (i.id === editingItem.id ? updated : i)));
    setEditingItem(null);

    const success = await updateShoppingItem(editingItem.id, {
      name: updated.name,
      quantity: updated.quantity,
    });

    if (!success) reloadItems();
  };

  const toggleComplete = async (item: ShoppingItem) => {
    const nextStatus = !item.is_completed;
    setItems((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, is_completed: nextStatus } : i))
    );
    const ok = await updateShoppingItem(item.id, { is_completed: nextStatus });
    if (!ok) reloadItems();
  };

  const setItemHidden = async (id: string, isHidden: boolean) => {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, is_hidden: isHidden } : i))
    );
    const ok = await updateShoppingItem(id, { is_hidden: isHidden });
    if (!ok) reloadItems();
  };

  const deleteItem = async (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
    const ok = await deleteShoppingItem(id);
    if (!ok) reloadItems();
  };

  const activeItems = items.filter((i) => !i.is_completed && !i.is_hidden);
  const completedItems = items.filter((i) => i.is_completed && !i.is_hidden);
  const hiddenItems = items.filter((i) => i.is_hidden);

  return {
    items,
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
  };
}
