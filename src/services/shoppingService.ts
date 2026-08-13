import { getSqlClient } from "@/lib/neon";
import { ShoppingItem } from "@/types/shopping";

const ANONYMOUS_USER_KEY = "shopping_list_anon_user_id";
const LOCAL_STORAGE_ITEMS_KEY = "shopping_list_offline_items";

export async function getCurrentUserId(): Promise<string> {
  if (typeof window !== "undefined") {
    let anonId = localStorage.getItem(ANONYMOUS_USER_KEY);
    if (!anonId) {
      anonId = `anon-${crypto.randomUUID()}`;
      localStorage.setItem(ANONYMOUS_USER_KEY, anonId);
    }
    return anonId;
  }
  return "anon-default-user";
}

function getLocalItems(): ShoppingItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_ITEMS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalItems(items: ShoppingItem[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LOCAL_STORAGE_ITEMS_KEY, JSON.stringify(items));
  } catch (e) {
    console.error("Erro ao salvar itens no localStorage", e);
  }
}

export async function fetchShoppingItems(): Promise<ShoppingItem[]> {
  const sql = getSqlClient();
  if (!sql) return getLocalItems();

  try {
    const rows = await sql`
      SELECT id, user_id, name, quantity, is_completed, is_hidden, created_at
      FROM items
      ORDER BY created_at DESC;
    `;
    const items = rows.map((r) => ({
      id: String(r.id),
      user_id: String(r.user_id),
      name: String(r.name),
      quantity: String(r.quantity),
      is_completed: Boolean(r.is_completed),
      is_hidden: Boolean(r.is_hidden),
      created_at: r.created_at ? new Date(r.created_at as string).toISOString() : undefined,
    })) as ShoppingItem[];
    saveLocalItems(items);
    return items;
  } catch (error) {
    console.error("Erro ao buscar itens do NeonDB:", error);
    return getLocalItems();
  }
}

export async function insertShoppingItem(
  item: Omit<ShoppingItem, "id">
): Promise<ShoppingItem | null> {
  const newId = `item-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
  const newItem: ShoppingItem = { ...item, id: newId, created_at: new Date().toISOString() };

  const sql = getSqlClient();
  if (!sql) {
    const current = getLocalItems();
    const updated = [newItem, ...current];
    saveLocalItems(updated);
    return newItem;
  }

  try {
    const rows = await sql`
      INSERT INTO items (id, user_id, name, quantity, is_completed, is_hidden)
      VALUES (${newItem.id}, ${newItem.user_id}, ${newItem.name}, ${newItem.quantity}, ${newItem.is_completed}, ${newItem.is_hidden})
      RETURNING id, user_id, name, quantity, is_completed, is_hidden, created_at;
    `;
    const r = rows[0];
    return {
      id: String(r.id),
      user_id: String(r.user_id),
      name: String(r.name),
      quantity: String(r.quantity),
      is_completed: Boolean(r.is_completed),
      is_hidden: Boolean(r.is_hidden),
      created_at: r.created_at ? new Date(r.created_at as string).toISOString() : undefined,
    };
  } catch (error) {
    console.error("Erro ao inserir item no NeonDB:", error);
    const current = getLocalItems();
    saveLocalItems([newItem, ...current]);
    return newItem;
  }
}

export async function updateShoppingItem(
  id: string,
  updates: Partial<ShoppingItem>
): Promise<boolean> {
  const sql = getSqlClient();

  // Atualizar cache local primeiro
  const local = getLocalItems();
  const nextLocal = local.map((i) => (i.id === id ? { ...i, ...updates } : i));
  saveLocalItems(nextLocal);

  if (!sql) return true;

  try {
    if (updates.name !== undefined) {
      await sql`UPDATE items SET name = ${updates.name} WHERE id = ${id};`;
    }
    if (updates.quantity !== undefined) {
      await sql`UPDATE items SET quantity = ${updates.quantity} WHERE id = ${id};`;
    }
    if (updates.is_completed !== undefined) {
      await sql`UPDATE items SET is_completed = ${updates.is_completed} WHERE id = ${id};`;
    }
    if (updates.is_hidden !== undefined) {
      await sql`UPDATE items SET is_hidden = ${updates.is_hidden} WHERE id = ${id};`;
    }
    return true;
  } catch (error) {
    console.error("Erro ao atualizar item no NeonDB:", error);
    return false;
  }
}

export async function deleteShoppingItem(id: string): Promise<boolean> {
  const sql = getSqlClient();

  const local = getLocalItems();
  saveLocalItems(local.filter((i) => i.id !== id));

  if (!sql) return true;

  try {
    await sql`DELETE FROM items WHERE id = ${id};`;
    return true;
  } catch (error) {
    console.error("Erro ao remover item do NeonDB:", error);
    return false;
  }
}

export function subscribeShoppingItems(
  _onInsert: (newItem: ShoppingItem) => void,
  _onUpdate: (updatedItem: ShoppingItem) => void,
  _onDelete: (deletedId: string) => void
): () => void {
  // Sincronização periódica suave ao mudar foco/visibilidade da aba
  const handleFocus = () => {
    fetchShoppingItems();
  };

  window.addEventListener("focus", handleFocus);
  document.addEventListener("visibilitychange", handleFocus);

  return () => {
    window.removeEventListener("focus", handleFocus);
    document.removeEventListener("visibilitychange", handleFocus);
  };
}
