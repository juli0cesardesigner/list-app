import { getSqlClient } from "@/lib/neon";
import { getCurrentUserId } from "./shoppingService";
import { PurchaseRecord, StoreLocation } from "@/types/shopping";
import { normalizeText } from "@/utils/textMatching";

const LOCAL_STORAGE_HISTORY_KEY = "shopping_list_purchase_history";
const LOCAL_STORAGE_LOCATIONS_KEY = "shopping_list_frequent_locations";

const DEFAULT_LOCATIONS = ["Supermercado", "Hortifruti", "Padaria", "Açougue", "Farmácia"];

function getLocalHistory(): PurchaseRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalHistory(history: PurchaseRecord[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LOCAL_STORAGE_HISTORY_KEY, JSON.stringify(history));
  } catch (e) {
    console.error("Erro ao salvar histórico localmente:", e);
  }
}

export async function fetchPurchaseHistory(): Promise<PurchaseRecord[]> {
  const sql = getSqlClient();
  if (!sql) return getLocalHistory();

  try {
    const rows = await sql`
      SELECT id, user_id, item_name, normalized_name, price, location, purchased_at
      FROM purchase_history
      ORDER BY purchased_at DESC
      LIMIT 200;
    `;
    const history = rows.map((r) => ({
      id: String(r.id),
      user_id: String(r.user_id),
      item_name: String(r.item_name),
      normalized_name: String(r.normalized_name),
      price: r.price !== null ? Number(r.price) : null,
      location: r.location ? String(r.location) : null,
      purchased_at: new Date(r.purchased_at as string).toISOString(),
    })) as PurchaseRecord[];
    saveLocalHistory(history);
    return history;
  } catch (err) {
    console.error("Erro ao buscar histórico do NeonDB:", err);
    return getLocalHistory();
  }
}

export async function recordPurchase(
  itemName: string,
  price?: number | null,
  location?: string | null
): Promise<PurchaseRecord> {
  const userId = await getCurrentUserId();
  const normalized = normalizeText(itemName);
  const newId = `hist-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
  const record: PurchaseRecord = {
    id: newId,
    user_id: userId,
    item_name: itemName,
    normalized_name: normalized,
    price: price ?? null,
    location: location ? location.trim() : null,
    purchased_at: new Date().toISOString(),
  };

  const local = getLocalHistory();
  saveLocalHistory([record, ...local]);

  if (record.location) {
    updateLocationUsage(record.location);
  }

  const sql = getSqlClient();
  if (!sql) return record;

  try {
    await sql`
      INSERT INTO purchase_history (id, user_id, item_name, normalized_name, price, location, purchased_at)
      VALUES (${record.id}, ${record.user_id}, ${record.item_name}, ${record.normalized_name}, ${record.price}, ${record.location}, ${record.purchased_at});
    `;
  } catch (err) {
    console.error("Erro ao salvar compra no NeonDB:", err);
  }

  return record;
}

export function getFrequentLocations(): string[] {
  if (typeof window === "undefined") return DEFAULT_LOCATIONS;
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_LOCATIONS_KEY);
    if (!raw) return DEFAULT_LOCATIONS;
    const list: StoreLocation[] = JSON.parse(raw);
    return list.sort((a, b) => b.usage_count - a.usage_count).map((l) => l.name);
  } catch {
    return DEFAULT_LOCATIONS;
  }
}

export function updateLocationUsage(name: string): void {
  if (typeof window === "undefined" || !name.trim()) return;
  const clean = name.trim();
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_LOCATIONS_KEY);
    const list: StoreLocation[] = raw ? JSON.parse(raw) : DEFAULT_LOCATIONS.map((n, i) => ({
      id: `loc-${i}`,
      name: n,
      usage_count: 1,
      last_used_at: new Date().toISOString(),
    }));

    const existing = list.find((l) => l.name.toLowerCase() === clean.toLowerCase());
    if (existing) {
      existing.usage_count += 1;
      existing.last_used_at = new Date().toISOString();
    } else {
      list.unshift({
        id: `loc-${Date.now()}`,
        name: clean,
        usage_count: 1,
        last_used_at: new Date().toISOString(),
      });
    }
    localStorage.setItem(LOCAL_STORAGE_LOCATIONS_KEY, JSON.stringify(list.slice(0, 15)));
  } catch (e) {
    console.error("Erro ao atualizar local:", e);
  }
}

export function removeStoreLocation(name: string): void {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_LOCATIONS_KEY);
    if (!raw) return;
    const list: StoreLocation[] = JSON.parse(raw);
    const filtered = list.filter((l) => l.name.toLowerCase() !== name.toLowerCase());
    localStorage.setItem(LOCAL_STORAGE_LOCATIONS_KEY, JSON.stringify(filtered));
  } catch (e) {
    console.error("Erro ao remover local:", e);
  }
}

export async function clearAllPurchaseHistory(): Promise<void> {
  saveLocalHistory([]);
  const sql = getSqlClient();
  if (!sql) return;
  try {
    await sql`DELETE FROM purchase_history;`;
  } catch (err) {
    console.error("Erro ao limpar histórico no NeonDB:", err);
  }
}
