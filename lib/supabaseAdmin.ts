import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let _client: SupabaseClient | null = null;

export function supabaseAdmin(): SupabaseClient {
  if (_client) return _client;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    // Ne pas casser le build si les variables ne sont pas encore définies.
    // Les routes API qui utilisent supabaseAdmin() échoueront proprement à l'exécution tant que c'est manquant.
    throw new Error("Missing Supabase env vars: NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY");
  }

  _client = createClient(url, serviceKey, { auth: { persistSession: false } });
  return _client;
}
