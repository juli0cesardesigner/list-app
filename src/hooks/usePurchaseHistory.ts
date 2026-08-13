"use client";

import { useState, useEffect, useCallback } from "react";
import { PurchaseRecord, MatchedHistoryResult } from "@/types/shopping";
import {
  fetchPurchaseHistory,
  recordPurchase,
  getFrequentLocations,
  removeStoreLocation,
  clearAllPurchaseHistory,
  updateLocationUsage,
} from "@/services/historyService";
import { findBestHistoryMatch } from "@/utils/textMatching";

const ACTIVE_LOCATION_SESSION_KEY = "shopping_active_session_location";
const SESSION_TIMESTAMP_KEY = "shopping_active_session_timestamp";
const SESSION_MAX_DURATION_MS = 4 * 60 * 60 * 1000; // 4 horas de sessão

export function usePurchaseHistory() {
  const [history, setHistory] = useState<PurchaseRecord[]>([]);
  const [frequentLocations, setFrequentLocations] = useState<string[]>([]);
  const [currentSessionLocation, setCurrentSessionLocationState] = useState<string>("");

  const loadData = useCallback(async () => {
    const data = await fetchPurchaseHistory();
    setHistory(data);
    setFrequentLocations(getFrequentLocations());

    // Recupera local da sessão ativa se dentro de 4 horas
    if (typeof window !== "undefined") {
      const savedLoc = localStorage.getItem(ACTIVE_LOCATION_SESSION_KEY) || "";
      const savedTime = localStorage.getItem(SESSION_TIMESTAMP_KEY);
      if (savedLoc && savedTime) {
        const elapsed = Date.now() - parseInt(savedTime, 10);
        if (elapsed < SESSION_MAX_DURATION_MS) {
          setCurrentSessionLocationState(savedLoc);
        }
      }
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const setSessionLocation = useCallback((location: string) => {
    const clean = location.trim();
    setCurrentSessionLocationState(clean);
    if (typeof window !== "undefined" && clean) {
      localStorage.setItem(ACTIVE_LOCATION_SESSION_KEY, clean);
      localStorage.setItem(SESSION_TIMESTAMP_KEY, Date.now().toString());
      updateLocationUsage(clean);
      setFrequentLocations(getFrequentLocations());
    }
  }, []);

  const addPurchase = useCallback(
    async (itemName: string, price?: number | null, location?: string | null) => {
      const chosenLoc = location && location.trim() ? location.trim() : currentSessionLocation;
      if (chosenLoc) {
        setSessionLocation(chosenLoc);
      }
      const record = await recordPurchase(itemName, price, chosenLoc);
      setHistory((prev) => [record, ...prev]);
      setFrequentLocations(getFrequentLocations());
      return record;
    },
    [currentSessionLocation, setSessionLocation]
  );

  const getMatch = useCallback(
    (query: string): MatchedHistoryResult | null => {
      return findBestHistoryMatch(query, history);
    },
    [history]
  );

  const deleteLocation = useCallback((name: string) => {
    removeStoreLocation(name);
    setFrequentLocations(getFrequentLocations());
  }, []);

  const clearHistory = useCallback(async () => {
    await clearAllPurchaseHistory();
    setHistory([]);
  }, []);

  return {
    history,
    frequentLocations,
    currentSessionLocation,
    setSessionLocation,
    addPurchase,
    getMatch,
    deleteLocation,
    clearHistory,
    reloadHistory: loadData,
  };
}
