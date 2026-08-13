import { neon, NeonQueryFunction } from "@neondatabase/serverless";

const neonUrl = import.meta.env.VITE_NEON_DATABASE_URL || "";

let sqlClient: NeonQueryFunction<false, false> | null = null;

if (neonUrl) {
  try {
    sqlClient = neon(neonUrl);
  } catch (err) {
    console.warn("[NeonDB] Falha ao inicializar o cliente Neon:", err);
  }
} else {
  console.info(
    "[NeonDB] VITE_NEON_DATABASE_URL não definida. Configure sua string de conexão Neon no .env ou no Cloudflare Pages."
  );
}

export function getSqlClient(): NeonQueryFunction<false, false> | null {
  return sqlClient;
}

export const isNeonConfigured = Boolean(neonUrl && sqlClient);
