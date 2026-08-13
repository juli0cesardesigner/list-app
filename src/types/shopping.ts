export interface ShoppingItem {
  id: string;
  user_id: string;
  name: string;
  quantity: string;
  is_completed: boolean;
  is_hidden: boolean;
  created_at?: string;
}

export interface ParsedItemName {
  main: string;
  alternatives: string[];
}

export interface ItemFormData {
  name: string;
  quantity: number;
  alternatives: string[];
}

export function parseItemName(name: string): ParsedItemName {
  if (!name) return { main: "", alternatives: [] };
  const parts = name.split(/\s+\/\s+|\s+ou\s+/i);
  return {
    main: parts[0] || "",
    alternatives: parts.slice(1).filter((alt) => alt.trim() !== ""),
  };
}
