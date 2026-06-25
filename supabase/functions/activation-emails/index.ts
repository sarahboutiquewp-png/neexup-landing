import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SERVICE_KEY  = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const SITE_URL     = 'https://neexup.com';

async function sendMail(to: string, subject: string, html: string) {
  await fetch(`${SUPABASE_URL}/functions/v1/send-mail`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${SERVICE_KEY}` },
    body: JSON.stringify({ to, subject, html })
  });
}

function emailWrap(content: string) {
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"></head>
<body style="font-family:Arial,sans-serif;background:#f8fafc;margin:0;padding:2rem">
<div style="max-width:520px;margin:0 auto;background:white;border-radius:20px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08)">
  <div style="background:linear-gradient(135deg,#060910,#0a0e1a);padding:2rem;text-align:center">
    <h1 style="color:white;margin:0;font-size:1.6rem;font-weight:900">Neexup</h1>
  </div>
  <div style="padding:2rem">${content}</div>
  <div style="background:#f8fafc;padding:1.25rem 2rem;text-align:center;border-top:1px solid #e2e8f0">
    <p style="color:#94a3b8;font-size:0.72rem;margin:0">Propulse par <a href="${SITE_URL}" style="color:#0066ff;text-decoration:none;font-weight:700">Neexup</a> — La caisse intelligente</p>
  </div>
</div>
</body></html>`;
}

Deno.serve(async () => {
  const sb = createClient(SUPABASE_URL, SERVICE_KEY);

  const now      = new Date();
  const day1ago  = new Date(now.getTime() - 1  * 86400000).toISOString();
  const day2ago  = new Date(now.getTime() - 2  * 86400000).toISOString();
  const day7ago  = new Date(now.getTime() - 7  * 86400000).toISOString();
  const day8ago  = new Date(now.getTime() - 8  * 86400000).toISOString();

  // Commerçants inscrits il y a 1 jour (+/- 1h)
  const { data: newUsers } = await sb
    .from('profiles')
    .select('id, store_id, full_name, email')
    .in('role', ['admin', 'manager'])
    .not('store_id', 'is', null)
    .not('email', 'is', null)
    .gte('created_at', day2ago)
    .lte('created_at', day1ago);

  // Commerçants inscrits il y a 7 jours (+/- 1h)
  const { data: weekUsers } = await sb
    .from('profiles')
    .select('id, store_id, full_name, email')
    .in('role', ['admin', 'manager'])
    .not('store_id', 'is', null)
    .not('email', 'is', null)
    .gte('created_at', day8ago)
    .lte('created_at', day7ago);

  let sent = 0;

  // EMAIL J+1
  for (const user of (newUsers || [])) {
    try {
      const { count } = await sb
        .from('orders')
        .select('id', { count: 'exact', head: true })
        .eq('store_id', user.store_id);

      if ((count || 0) > 0) continue; // a deja vendu, on skip

      const prenom = (user.full_name || user.email.split('@')[0]).split(' ')[0];
      const html = emailWrap(`
        <h2 style="color:#0f172a;font-size:1.2rem;font-weight:800;margin-bottom:0.75rem">Bonjour ${prenom} ! 👋</h2>
        <p style="color:#64748b;line-height:1.7;margin-bottom:1.5rem">Vous vous etes inscrit hier sur Neexup. Avez-vous eu le temps de tester la caisse ?</p>
        <div style="background:#f0f7ff;border-radius:12px;padding:1.25rem;margin-bottom:1.5rem">
          <p style="color:#0066ff;font-weight:700;margin:0 0 0.75rem">Pour faire votre premiere vente :</p>
          <p style="color:#334155;margin:6px 0">1️⃣ Allez dans <strong>Produits</strong> et ajoutez vos articles</p>
          <p style="color:#334155;margin:6px 0">2️⃣ Ouvrez la <strong>Caisse</strong></p>
          <p style="color:#334155;margin:6px 0">3️⃣ Selectionnez vos produits et encaissez</p>
        </div>
        <a href="${SITE_URL}/caisse.html" style="display:block;background:linear-gradient(135deg,#0066ff,#00d4ff);color:white;text-align:center;padding:14px;border-radius:12px;text-decoration:none;font-weight:800;font-size:0.95rem;margin-bottom:1rem">Ouvrir la caisse →</a>
        <p style="color:#94a3b8;font-size:0.82rem;text-align:center">Des questions ? Repondez a cet email ou ouvrez un ticket depuis votre espace.</p>
      `);

      await sendMail(user.email, `${prenom}, avez-vous teste la caisse ? 🛒`, html);
      sent++;
    } catch(e) {
      console.error('J+1 error', user.email, e);
    }
  }

  // EMAIL J+7
  for (const user of (weekUsers || [])) {
    try {
      const { count } = await sb
        .from('orders')
        .select('id', { count: 'exact', head: true })
        .eq('store_id', user.store_id);

      if ((count || 0) > 0) continue; // a deja vendu, on skip

      const prenom = (user.full_name || user.email.split('@')[0]).split(' ')[0];
      const html = emailWrap(`
        <h2 style="color:#0f172a;font-size:1.2rem;font-weight:800;margin-bottom:0.75rem">Bonjour ${prenom}, on pense a vous 💙</h2>
        <p style="color:#64748b;line-height:1.7;margin-bottom:1rem">Vous avez cree votre compte Neexup il y a 7 jours mais n'avez pas encore enregistre de vente.</p>
        <p style="color:#64748b;line-height:1.7;margin-bottom:1.5rem">Besoin d'aide pour demarrer ? Voici ce que nos meilleurs commerçants font en premier :</p>
        <div style="background:#f8fafc;border-radius:12px;padding:1.25rem;margin-bottom:1.5rem">
          <div style="display:flex;align-items:flex-start;gap:10px;margin-bottom:1rem">
            <span style="font-size:1.3rem">📦</span>
            <div><strong style="color:#0f172a">Importez votre catalogue</strong><br><span style="color:#64748b;font-size:0.85rem">Ajoutez vos produits avec prix et stock en 2 minutes.</span></div>
          </div>
          <div style="display:flex;align-items:flex-start;gap:10px;margin-bottom:1rem">
            <span style="font-size:1.3rem">🛒</span>
            <div><strong style="color:#0f172a">Faites une vente test</strong><br><span style="color:#64748b;font-size:0.85rem">Encaissez 1 MAD pour voir comment ca marche.</span></div>
          </div>
          <div style="display:flex;align-items:flex-start;gap:10px">
            <span style="font-size:1.3rem">👥</span>
            <div><strong style="color:#0f172a">Ajoutez un employe</strong><br><span style="color:#64748b;font-size:0.85rem">Donnez acces a votre equipe en quelques secondes.</span></div>
          </div>
        </div>
        <a href="${SITE_URL}/dashboard.html" style="display:block;background:linear-gradient(135deg,#0066ff,#00d4ff);color:white;text-align:center;padding:14px;border-radius:12px;text-decoration:none;font-weight:800;font-size:0.95rem;margin-bottom:1rem">Acceder a mon espace →</a>
        <div style="background:rgba(255,107,53,0.06);border:1px solid rgba(255,107,53,0.2);border-radius:10px;padding:1rem;text-align:center">
          <p style="color:#ff6b35;font-weight:700;margin:0 0 4px">⏳ Il vous reste ${14 - 7} jours d'essai gratuit</p>
          <p style="color:#94a3b8;font-size:0.82rem;margin:0">Profitez-en pour tout explorer sans engagement.</p>
        </div>
      `);

      await sendMail(user.email, `${prenom}, votre essai Neexup se termine bientot ⏳`, html);
      sent++;
    } catch(e) {
      console.error('J+7 error', user.email, e);
    }
  }

  return new Response(JSON.stringify({ sent }), {
    headers: { 'Content-Type': 'application/json' },
    status: 200
  });
});
