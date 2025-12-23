import { supabaseAdmin } from "@/lib/supabaseAdmin";

function twiml(message: string) {
  const escaped = message.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;");
  return `<?xml version="1.0" encoding="UTF-8"?><Response><Message>${escaped}</Message></Response>`;
}

export async function POST(req: Request) {
  try {
  const form = await req.formData();
  const from = String(form.get("From") ?? "").trim();
  const body = String(form.get("Body") ?? "").trim();
  const upper = body.toUpperCase();

  if (upper === "STOP" || upper === "STOPALL" || upper === "UNSUBSCRIBE") {
    const { data: prof } = await supabaseAdmin().from("profiles").select("user_id").eq("phone", from).maybeSingle();
    if (prof?.user_id) await supabaseAdmin().from("candidate_profiles").upsert({ user_id: prof.user_id, opt_in_sms: false, unsubscribed: true });
    return new Response(twiml("OK. Tu es désinscrit. Réponds START pour te réinscrire."), { headers: { "Content-Type": "text/xml" } });
  }

  if (upper === "START" || upper === "YES") {
    const { data: prof } = await supabaseAdmin().from("profiles").select("user_id").eq("phone", from).maybeSingle();
    if (prof?.user_id) await supabaseAdmin().from("candidate_profiles").upsert({ user_id: prof.user_id, opt_in_sms: true, unsubscribed: false });
    return new Response(twiml("Super. Tu es réinscrit."), { headers: { "Content-Type": "text/xml" } });
  }

  const m1 = body.match(/^1\s+([A-Za-z0-9]{4,12})\s*$/i);
  const m2 = body.match(/^2\s+([A-Za-z0-9]{4,12})\s*$/i);
  const mok = body.match(/^OK\s+([A-Za-z0-9]{4,12})\s*$/i);

  const code = (m1?.[1] || m2?.[1] || mok?.[1] || "").toUpperCase();
  if (!code) return new Response(twiml("Commande non reconnue. Utilise: 1 CODE, 2 CODE, OK CODE, STOP."), { headers: { "Content-Type": "text/xml" } });

  const { data: offer } = await supabaseAdmin().from("shift_offers").select("id, shift_id, status, candidate_user_id").eq("offer_code", code).maybeSingle();
  if (!offer) return new Response(twiml("Code invalide."), { headers: { "Content-Type": "text/xml" } });

  const { data: prof } = await supabaseAdmin().from("profiles").select("phone").eq("user_id", offer.candidate_user_id).maybeSingle();
  if (!prof?.phone || prof.phone !== from) return new Response(twiml("Ce code ne correspond pas à ton numéro."), { headers: { "Content-Type": "text/xml" } });

  if (m2) {
    await supabaseAdmin().from("shift_offers").update({ status: "declined", declined_at: new Date().toISOString() }).eq("id", offer.id);
    return new Response(twiml("Refus enregistré. Merci !"), { headers: { "Content-Type": "text/xml" } });
  }

  if (m1) {
    await supabaseAdmin().from("shift_offers").update({ status: "accepted", accepted_at: new Date().toISOString() }).eq("id", offer.id);
    return new Response(twiml(`OK. Pour confirmer définitivement, réponds: OK ${code}`), { headers: { "Content-Type": "text/xml" } });
  }

  if (mok) {
    const { data: shiftRow } = await supabaseAdmin().from("shifts").select("status").eq("id", offer.shift_id).single();
    if (!shiftRow || shiftRow.status !== "open") return new Response(twiml("Désolé, ce quart n’est plus disponible."), { headers: { "Content-Type": "text/xml" } });

    const { error: updErr } = await supabaseAdmin().from("shifts").update({ status: "filled", confirmed_offer_id: offer.id }).eq("id", offer.shift_id).eq("status", "open");
    if (updErr) return new Response(twiml("Erreur confirmation. Réessaie."), { headers: { "Content-Type": "text/xml" } });

    await supabaseAdmin().from("shift_offers").update({ status: "confirmed", confirmed_at: new Date().toISOString() }).eq("id", offer.id);
    return new Response(twiml("✅ Confirmé. Merci !"), { headers: { "Content-Type": "text/xml" } });
  }

  return new Response(twiml("Commande non reconnue."), { headers: { "Content-Type": "text/xml" } });
  } catch (e: any) {
    const msg = e?.message ?? "Server error";
    const escaped = msg.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;");
    const xml = `<?xml version="1.0" encoding="UTF-8"?><Response><Message>${escaped}</Message></Response>`;
    return new Response(xml, { headers: { "Content-Type": "text/xml" } });
  }
}
