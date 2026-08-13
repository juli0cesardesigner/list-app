import { PurchaseRecord, MatchedHistoryResult, parseItemName } from "@/types/shopping";

/**
 * Normaliza o texto removendo acentos, pontuações e espaços extras em minúsculas
 */
export function normalizeText(text: string): string {
  if (!text) return "";
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove acentos
    .replace(/[^\w\s]/gi, "") // Remove pontuação
    .trim()
    .replace(/\s+/g, " ");
}

/**
 * Calcula a distância de Levenshtein entre duas strings
 */
export function levenshteinDistance(a: string, b: string): number {
  const an = a ? a.length : 0;
  const bn = b ? b.length : 0;
  if (an === 0) return bn;
  if (bn === 0) return an;

  const matrix = Array.from({ length: bn + 1 }, () => new Array(an + 1).fill(0));
  for (let i = 0; i <= an; i++) matrix[0][i] = i;
  for (let j = 0; j <= bn; j++) matrix[j][0] = j;

  for (let j = 1; j <= bn; j++) {
    for (let i = 1; i <= an; i++) {
      if (b.charAt(j - 1) === a.charAt(i - 1)) {
        matrix[j][i] = matrix[j - 1][i - 1];
      } else {
        matrix[j][i] = Math.min(
          matrix[j - 1][i - 1] + 1, // substituição
          matrix[j][i - 1] + 1,     // inserção
          matrix[j - 1][i] + 1      // deleção
        );
      }
    }
  }

  return matrix[bn][an];
}

/**
 * Calcula índice de similaridade de 0.0 a 1.0
 */
export function calculateSimilarity(s1: string, s2: string): number {
  const norm1 = normalizeText(s1);
  const norm2 = normalizeText(s2);
  if (!norm1 || !norm2) return 0;
  if (norm1 === norm2) return 1;

  // Se um contém o outro exatamente
  if (norm1.includes(norm2) || norm2.includes(norm1)) {
    const ratio = Math.min(norm1.length, norm2.length) / Math.max(norm1.length, norm2.length);
    return Math.max(0.85, ratio);
  }

  const maxLen = Math.max(norm1.length, norm2.length);
  if (maxLen === 0) return 1;
  const dist = levenshteinDistance(norm1, norm2);
  return Math.max(0, (maxLen - dist) / maxLen);
}

/**
 * Encontra a melhor correspondência no histórico de compras para um nome digitado
 */
export function findBestHistoryMatch(
  inputName: string,
  history: PurchaseRecord[],
  threshold = 0.72
): MatchedHistoryResult | null {
  const parsed = parseItemName(inputName);
  const query = normalizeText(parsed.main);
  if (!query || query.length < 2 || !history.length) return null;

  let bestMatchKey = "";
  let highestScore = 0;

  // Agrupa histórico por nome normalizado
  const groupedByItem = new Map<string, PurchaseRecord[]>();
  for (const record of history) {
    const key = record.normalized_name || normalizeText(record.item_name);
    if (!groupedByItem.has(key)) {
      groupedByItem.set(key, []);
    }
    groupedByItem.get(key)!.push(record);
  }

  // Compara a query com cada item do histórico
  for (const [key] of groupedByItem.entries()) {
    const score = calculateSimilarity(query, key);
    if (score > highestScore && score >= threshold) {
      highestScore = score;
      bestMatchKey = key;
    }
  }

  if (!bestMatchKey || highestScore < threshold) return null;

  const records = groupedByItem.get(bestMatchKey) || [];
  // Ordena por data mais recente primeiro
  records.sort((a, b) => new Date(b.purchased_at).getTime() - new Date(a.purchased_at).getTime());

  return {
    lastPurchase: records[0],
    allPurchases: records,
    confidence: highestScore,
  };
}
