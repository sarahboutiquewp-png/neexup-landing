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

function daysAgo(n: number) { return new Date(Date.now() - n * 86400000).toISOString(); }
function daysFromNow(n: number) { return new Date(Date.now() + n * 86400000).toISOString().split('T')[0]; }

Deno.serve(async () => {
  const sb  = createClient(SUPABASE_URL, SERVICE_KEY);

  const windows: Record<string, [string, string]> = {
    j1:  [daysAgo(2), daysAgo(1)],
    j3:  [daysAgo(4), daysAgo(3)],
    j5:  [daysAgo(6), daysAgo(5)],
    j7:  [daysAgo(8), daysAgo(7)],
    j10: [daysAgo(11), daysAgo(10)],
  };

  async function getUsers(from: string, to: string) {
    const { data } = await sb.from('profiles')
      .select('id, store_id, full_name, email, expiry_date')
      .in('role', ['admin', 'manager'])
      .not('store_id', 'is', null)
      .not('email', 'is', null)
      .gte('created_at', from)
      .lte('created_at', to);
    return data || [];
  }

  async function hasSales(store_id: string) {
    const { count } = await sb.from('orders').select('id', { count: 'exact', head: true }).eq('store_id', store_id);
    return (count || 0) > 0;
  }

  let sent = 0;

  // ── J+1 : pas encore de vente ──────────────────────────────────
  for (const user of await getUsers(...windows.j1)) {
    try {
      if (await hasSales(user.store_id)) continue;
      const p = (user.full_name || user.email.split('@')[0]).split(' ')[0];
      await sendMail(user.email, `${p}, avez-vous teste la caisse ? 🛒`, emailWrap(`
        <h2 style="color:#0f172a;font-size:1.2rem;font-weight:800;margin-bottom:0.75rem">Bonjour ${p} ! 👋</h2>
        <p style="color:#64748b;line-height:1.7;margin-bottom:1.5rem">Vous vous etes inscrit hier sur Neexup. Avez-vous eu le temps de tester la caisse ?</p>
        <div style="background:#f0f7ff;border-radius:12px;padding:1.25rem;margin-bottom:1.5rem">
          <p style="color:#0066ff;font-weight:700;margin:0 0 0.75rem">Pour faire votre premiere vente :</p>
          <p style="color:#334155;margin:6px 0">1️⃣ Allez dans <strong>Produits</strong> et ajoutez vos articles</p>
          <p style="color:#334155;margin:6px 0">2️⃣ Ouvrez la <strong>Caisse</strong></p>
          <p style="color:#334155;margin:6px 0">3️⃣ Selectionnez vos produits et encaissez</p>
        </div>
        <a href="${SITE_URL}/caisse.html" style="display:block;background:linear-gradient(135deg,#0066ff,#00d4ff);color:white;text-align:center;padding:14px;border-radius:12px;text-decoration:none;font-weight:800;font-size:0.95rem;margin-bottom:1rem">Ouvrir la caisse →</a>
        <p style="color:#94a3b8;font-size:0.82rem;text-align:center">Des questions ? Ouvrez un ticket depuis votre espace.</p>
      `));
      sent++;
    } catch(e) { console.error('J+1', user.email, e); }
  }

  // ── J+3 : feature stocks ────────────────────────────────────────
  for (const user of await getUsers(...windows.j3)) {
    try {
      const p = (user.full_name || user.email.split('@')[0]).split(' ')[0];
      await sendMail(user.email, `${p}, votre stock se gere tout seul avec Neexup 📦`, emailWrap(`
        <h2 style="color:#0f172a;font-size:1.2rem;font-weight:800;margin-bottom:0.75rem">Bonjour ${p} 👋</h2>
        <p style="color:#64748b;line-height:1.7;margin-bottom:1.5rem">Saviez-vous que Neexup met a jour votre stock automatiquement a chaque vente ? Plus jamais besoin de compter manuellement.</p>
        <div style="background:#f0fff8;border:1px solid rgba(0,212,160,0.2);border-radius:12px;padding:1.25rem;margin-bottom:1.5rem">
          <p style="color:#00a87a;font-weight:700;margin:0 0 0.75rem">Ce que vous gagnez :</p>
          <p style="color:#334155;margin:6px 0">✅ Stock decremente a chaque vente en temps reel</p>
          <p style="color:#334155;margin:6px 0">✅ Alerte automatique quand un produit est en rupture</p>
          <p style="color:#334155;margin:6px 0">✅ Vue globale : produits OK, en alerte, en rupture</p>
        </div>
        <a href="${SITE_URL}/stocks.html" style="display:block;background:linear-gradient(135deg,#0066ff,#00d4ff);color:white;text-align:center;padding:14px;border-radius:12px;text-decoration:none;font-weight:800;font-size:0.95rem;margin-bottom:1rem">Voir mon stock →</a>
      `));
      sent++;
    } catch(e) { console.error('J+3', user.email, e); }
  }

  // ── J+5 : feature employes ──────────────────────────────────────
  for (const user of await getUsers(...windows.j5)) {
    try {
      const p = (user.full_name || user.email.split('@')[0]).split(' ')[0];
      await sendMail(user.email, `${p}, ajoutez votre equipe sur Neexup 👥`, emailWrap(`
        <h2 style="color:#0f172a;font-size:1.2rem;font-weight:800;margin-bottom:0.75rem">Bonjour ${p} 👋</h2>
        <p style="color:#64748b;line-height:1.7;margin-bottom:1.5rem">Vous avez des employes ? Donnez-leur acces a la caisse en quelques secondes — chacun avec son propre code PIN.</p>
        <div style="background:#f0f7ff;border-radius:12px;padding:1.25rem;margin-bottom:1.5rem">
          <div style="display:flex;align-items:flex-start;gap:10px;margin-bottom:1rem">
            <span style="font-size:1.3rem">🔐</span>
            <div><strong style="color:#0f172a">Code PIN individuel</strong><br><span style="color:#64748b;font-size:0.85rem">Chaque employe se connecte avec son PIN. Vous savez qui a encaisse quoi.</span></div>
          </div>
          <div style="display:flex;align-items:flex-start;gap:10px;margin-bottom:1rem">
            <span style="font-size:1.3rem">📊</span>
            <div><strong style="color:#0f172a">Suivi des ventes par employe</strong><br><span style="color:#64748b;font-size:0.85rem">Vos rapports montrent les ventes de chaque membre de l'equipe.</span></div>
          </div>
          <div style="display:flex;align-items:flex-start;gap:10px">
            <span style="font-size:1.3rem">🏪</span>
            <div><strong style="color:#0f172a">Multi-boutiques</strong><br><span style="color:#64748b;font-size:0.85rem">Plusieurs points de vente ? Tout sur un seul compte.</span></div>
          </div>
        </div>
        <a href="${SITE_URL}/employes.html" style="display:block;background:linear-gradient(135deg,#0066ff,#00d4ff);color:white;text-align:center;padding:14px;border-radius:12px;text-decoration:none;font-weight:800;font-size:0.95rem">Ajouter un employe →</a>
      `));
      sent++;
    } catch(e) { console.error('J+5', user.email, e); }
  }

  // ── J+7 : toujours pas de vente ────────────────────────────────
  for (const user of await getUsers(...windows.j7)) {
    try {
      if (await hasSales(user.store_id)) continue;
      const p = (user.full_name || user.email.split('@')[0]).split(' ')[0];
      await sendMail(user.email, `${p}, votre essai Neexup se termine bientot ⏳`, emailWrap(`
        <h2 style="color:#0f172a;font-size:1.2rem;font-weight:800;margin-bottom:0.75rem">Bonjour ${p}, on pense a vous 💙</h2>
        <p style="color:#64748b;line-height:1.7;margin-bottom:1rem">Vous avez cree votre compte Neexup il y a 7 jours mais n'avez pas encore enregistre de vente.</p>
        <div style="background:#f8fafc;border-radius:12px;padding:1.25rem;margin-bottom:1.5rem">
          <div style="display:flex;align-items:flex-start;gap:10px;margin-bottom:1rem"><span style="font-size:1.3rem">📦</span><div><strong style="color:#0f172a">Importez votre catalogue</strong><br><span style="color:#64748b;font-size:0.85rem">Ajoutez vos produits avec prix et stock en 2 minutes.</span></div></div>
          <div style="display:flex;align-items:flex-start;gap:10px;margin-bottom:1rem"><span style="font-size:1.3rem">🛒</span><div><strong style="color:#0f172a">Faites une vente test</strong><br><span style="color:#64748b;font-size:0.85rem">Encaissez 1 MAD pour voir comment ca marche.</span></div></div>
          <div style="display:flex;align-items:flex-start;gap:10px"><span style="font-size:1.3rem">👥</span><div><strong style="color:#0f172a">Ajoutez un employe</strong><br><span style="color:#64748b;font-size:0.85rem">Donnez acces a votre equipe en quelques secondes.</span></div></div>
        </div>
        <a href="${SITE_URL}/dashboard.html" style="display:block;background:linear-gradient(135deg,#0066ff,#00d4ff);color:white;text-align:center;padding:14px;border-radius:12px;text-decoration:none;font-weight:800;font-size:0.95rem;margin-bottom:1rem">Acceder a mon espace →</a>
        <div style="background:rgba(255,107,53,0.06);border:1px solid rgba(255,107,53,0.2);border-radius:10px;padding:1rem;text-align:center">
          <p style="color:#ff6b35;font-weight:700;margin:0 0 4px">⏳ Il vous reste 7 jours d'essai gratuit</p>
          <p style="color:#94a3b8;font-size:0.82rem;margin:0">Profitez-en pour tout explorer sans engagement.</p>
        </div>
      `));
      sent++;
    } catch(e) { console.error('J+7', user.email, e); }
  }

  // ── J+10 : urgence, plus que 4 jours ───────────────────────────
  for (const user of await getUsers(...windows.j10)) {
    try {
      const p = (user.full_name || user.email.split('@')[0]).split(' ')[0];
      await sendMail(user.email, `${p}, plus que 4 jours d'essai gratuit ⏰`, emailWrap(`
        <div style="background:linear-gradient(135deg,rgba(255,107,53,0.08),rgba(255,107,53,0.03));border:2px solid rgba(255,107,53,0.3);border-radius:14px;padding:1.5rem;text-align:center;margin-bottom:1.5rem">
          <div style="font-size:2.5rem;margin-bottom:0.5rem">⏰</div>
          <p style="color:#ff6b35;font-size:1.1rem;font-weight:900;margin:0 0 4px">Plus que 4 jours d'essai</p>
          <p style="color:#94a3b8;font-size:0.85rem;margin:0">Votre periode gratuite se termine dans 4 jours</p>
        </div>
        <h2 style="color:#0f172a;font-size:1.1rem;font-weight:800;margin-bottom:0.75rem">Bonjour ${p},</h2>
        <p style="color:#64748b;line-height:1.7;margin-bottom:1.5rem">Votre essai gratuit Neexup touche a sa fin. Pour continuer a utiliser la caisse, les stocks et les rapports sans interruption, choisissez votre plan maintenant.</p>
        <div style="background:#f0f7ff;border-radius:12px;padding:1.25rem;margin-bottom:1.5rem">
          <p style="color:#0066ff;font-weight:800;margin:0 0 0.5rem">Starter — 9 EUR / mois</p>
          <p style="color:#64748b;font-size:0.85rem;margin:0">Caisse, stocks, rapports, 1 boutique. Tout ce qu'il faut pour bien demarrer.</p>
        </div>
        <a href="${SITE_URL}/renouveler.html" style="display:block;background:linear-gradient(135deg,#ff6b35,#ff9500);color:white;text-align:center;padding:16px;border-radius:12px;text-decoration:none;font-weight:900;font-size:1rem;margin-bottom:1rem">Choisir mon plan →</a>
        <p style="color:#94a3b8;font-size:0.82rem;text-align:center">Sans engagement. Annulez quand vous voulez.</p>
      `));
      sent++;
    } catch(e) { console.error('J+10', user.email, e); }
  }

  // ── J-3 : essai expire dans 3 jours ────────────────────────────
  const { data: expiryUsers } = await sb.from('profiles')
    .select('id, store_id, full_name, email, expiry_date')
    .in('role', ['admin', 'manager'])
    .not('store_id', 'is', null)
    .not('email', 'is', null)
    .gte('expiry_date', daysFromNow(3))
    .lt('expiry_date', daysFromNow(4));

  for (const user of (expiryUsers || [])) {
    try {
      const p = (user.full_name || user.email.split('@')[0]).split(' ')[0];
      const expiryDate = new Date(user.expiry_date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' });
      await sendMail(user.email, `${p}, votre essai Neexup expire dans 3 jours ⏰`, emailWrap(`
        <div style="background:linear-gradient(135deg,rgba(255,107,53,0.08),rgba(255,107,53,0.03));border:2px solid rgba(255,107,53,0.3);border-radius:14px;padding:1.5rem;text-align:center;margin-bottom:1.5rem">
          <div style="font-size:2.5rem;margin-bottom:0.5rem">⏰</div>
          <p style="color:#ff6b35;font-size:1.1rem;font-weight:900;margin:0 0 4px">Votre essai expire dans 3 jours</p>
          <p style="color:#94a3b8;font-size:0.85rem;margin:0">Le ${expiryDate}</p>
        </div>
        <h2 style="color:#0f172a;font-size:1.1rem;font-weight:800;margin-bottom:0.75rem">Bonjour ${p},</h2>
        <p style="color:#64748b;line-height:1.7;margin-bottom:1.5rem">Votre essai gratuit Neexup se termine dans <strong>3 jours</strong>. Pour continuer sans interruption, abonnez-vous maintenant.</p>
        <div style="background:#f0f7ff;border-radius:12px;padding:1.25rem;margin-bottom:1.5rem">
          <p style="color:#0066ff;font-weight:700;margin:0 0 0.75rem">Ce que vous gardez avec un abonnement :</p>
          <p style="color:#334155;margin:6px 0">✅ Toutes vos ventes et donnees conservees</p>
          <p style="color:#334155;margin:6px 0">✅ Acces illimite a la caisse et aux rapports</p>
          <p style="color:#334155;margin:6px 0">✅ Support inclus</p>
          <p style="color:#334155;margin:6px 0">✅ Aucune interruption de service</p>
        </div>
        <a href="${SITE_URL}/renouveler.html" style="display:block;background:linear-gradient(135deg,#ff6b35,#ff9500);color:white;text-align:center;padding:16px;border-radius:12px;text-decoration:none;font-weight:900;font-size:1rem;margin-bottom:1rem">Continuer avec Neexup →</a>
        <p style="color:#94a3b8;font-size:0.82rem;text-align:center">Des questions ? Ecrivez-nous a <a href="mailto:support@neexup.com" style="color:#0066ff">support@neexup.com</a></p>
      `));
      sent++;
    } catch(e) { console.error('J-3', user.email, e); }
  }

  // ── J+14 : essai termine aujourd'hui ───────────────────────────
  const { data: todayExpiry } = await sb.from('profiles')
    .select('id, store_id, full_name, email, expiry_date')
    .in('role', ['admin', 'manager'])
    .not('store_id', 'is', null)
    .not('email', 'is', null)
    .gte('expiry_date', daysFromNow(0))
    .lt('expiry_date', daysFromNow(1));

  for (const user of (todayExpiry || [])) {
    try {
      const p = (user.full_name || user.email.split('@')[0]).split(' ')[0];
      await sendMail(user.email, `${p}, votre essai Neexup se termine aujourd'hui`, emailWrap(`
        <div style="background:linear-gradient(135deg,rgba(255,77,106,0.08),rgba(255,77,106,0.03));border:2px solid rgba(255,77,106,0.3);border-radius:14px;padding:1.5rem;text-align:center;margin-bottom:1.5rem">
          <div style="font-size:2.5rem;margin-bottom:0.5rem">🔔</div>
          <p style="color:#ff4d6a;font-size:1.1rem;font-weight:900;margin:0">Votre essai se termine aujourd'hui</p>
        </div>
        <h2 style="color:#0f172a;font-size:1.1rem;font-weight:800;margin-bottom:0.75rem">Bonjour ${p},</h2>
        <p style="color:#64748b;line-height:1.7;margin-bottom:1.5rem">C'est le dernier jour de votre essai gratuit. Sans abonnement, votre acces sera suspendu ce soir — mais vos donnees sont conservees 30 jours.</p>
        <a href="${SITE_URL}/renouveler.html" style="display:block;background:linear-gradient(135deg,#ff4d6a,#ff6b35);color:white;text-align:center;padding:16px;border-radius:12px;text-decoration:none;font-weight:900;font-size:1rem;margin-bottom:1rem">Continuer avec Neexup →</a>
        <div style="background:#f0f7ff;border-radius:12px;padding:1.25rem;margin-bottom:1rem">
          <p style="color:#0066ff;font-weight:800;margin:0 0 4px">Starter — 9 EUR / mois</p>
          <p style="color:#64748b;font-size:0.85rem;margin:0 0 0.75rem">Sans engagement. Annulez quand vous voulez.</p>
          <p style="color:#0066ff;font-weight:800;margin:0 0 4px">Starter Annuel — 86 EUR / an</p>
          <p style="color:#64748b;font-size:0.85rem;margin:0">2 mois offerts par rapport au mensuel.</p>
        </div>
        <p style="color:#94a3b8;font-size:0.82rem;text-align:center">Des questions ? <a href="mailto:support@neexup.com" style="color:#0066ff">support@neexup.com</a></p>
      `));
      sent++;
    } catch(e) { console.error('J+14', user.email, e); }
  }

  return new Response(JSON.stringify({ sent }), {
    headers: { 'Content-Type': 'application/json' },
    status: 200
  });
});
