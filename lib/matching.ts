import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { sendSms } from "@/lib/sms";

function makeCode(len = 6) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < len; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

export async function triggerMatching(shiftId: string) {
  const { data: shift, error: shiftErr } = await supabaseAdmin.from("shifts").select("*").eq("id", shiftId).single();
  if (shiftErr || !shift) throw new Error(shiftErr?.message ?? "Shift introuvable");

  const { data: candidates, error: candErr } = await supabaseAdmin
    .from("candidate_profiles")
    .select("user_id, services, min_rate, opt_in_sms, unsubscribed")
    .contains("services", [shift.service_type])
    .eq("opt_in_sms", true)
    .eq("unsubscribed", false)
    .limit(25);

  if (candErr) throw new Error(candErr.message);
  if (!candidates?.length) return { sent: 0 };

  const ids = candidates.map((c: any) => c.user_id);
  const { data: phones, error: phoneErr } = await supabaseAdmin
    .from("profiles")
    .select("user_id, phone")
    .in("user_id", ids);

  if (phoneErr) throw new Error(phoneErr.message);

  const phoneMap = new Map<string, string>();
  (phones ?? []).forEach((p: any) => { if (p.phone) phoneMap.set(p.user_id, p.phone); });

  let sent = 0;
  for (const c of candidates as any[]) {
    if (c.min_rate != null && Number(c.min_rate) > Number(shift.hourly_rate)) continue;
    const phone = phoneMap.get(c.user_id);
    if (!phone) continue;

    const offerCode = makeCode(6);
    const { data: offer, error: offerErr } = await supabaseAdmin
      .from("shift_offers")
      .insert({ shift_id: shift.id, candidate_user_id: c.user_id, offer_code: offerCode, status: "sent" })
      .select("id")
      .single();

    if (offerErr || !offer) continue;

    const msg =
`QuartExpress: Nouveau quart (${shift.service_type}) ${shift.location}
Début: ${new Date(shift.start_at).toLocaleString("fr-CA")}
Fin: ${new Date(shift.end_at).toLocaleString("fr-CA")}
Taux: ${Number(shift.hourly_rate).toFixed(2)}$/h${shift.tips_flag ? " + tips" : ""}
Réponds: 1 ${offerCode} (accepter) ou 2 ${offerCode} (refuser).`;

    await sendSms(phone, msg);
    sent += 1;
  }

  await supabaseAdmin
    .from("shifts")
    .update({ last_dispatch_at: new Date().toISOString(), dispatch_count: (shift.dispatch_count ?? 0) + 1 })
    .eq("id", shift.id);

  return { sent };
}
