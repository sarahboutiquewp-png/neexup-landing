import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SERVICE_KEY  = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const SITE_URL     = 'https://neexup.com';

Deno.serve(async () => {
  const sb = createClient(SUPABASE_URL, SERVICE_KEY);

  // Toutes les boutiques avec leur admin (role = admin ou manager)
  const { data: admins } = await sb
    .from('profiles')
    .select('id, store_id, full_name, email')
    .in('role', ['admin', 'manager'])
    .not('store_id', 'is', null)
    .not('email', 'is', null);

  if (!admins || admins.length === 0) {
    return new Response('Aucun admin', { status: 200 });
  }

  const today     = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  let sent = 0;
  for (const admin of admins) {
    try {
      // Stats du jour
      const { data: orders } = await sb
        .from('orders')
        .select('total, payment_method')
        .eq('store_id', admin.store_id)
        .gte('created_at', today)
        .lt('created_at', today + 'T23:59:59');

      if (!orders) continue;
      const nbVentes  = orders.length;
      const caTotal   = orders.reduce((s, o) => s + (o.total || 0), 0);
      const nbEspeces = orders.filter(o => o.payment_method === 'cash').length;
      const nbCarte   = orders.filter(o => o.payment_method !== 'cash').length;

      // Top produits du jour
      const { data: topItems } = await sb
        .from('order_items')
        .select('product_name, quantity')
        .in('order_id',
          orders.length
            ? (await sb.from('orders').select('id').eq('store_id', admin.store_id).gte('created_at', today)).data?.map(o => o.id) || []
            : []
        );

      const prodMap: Record<string, number> = {};
      (topItems || []).forEach(item => {
        prodMap[item.product_name] = (prodMap[item.product_name] || 0) + item.quantity;
      });
      const topProds = Object.entries(prodMap)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3);

      // Stats hier pour comparaison
      const { data: yestOrders } = await sb
        .from('orders')
        .select('total')
        .eq('store_id', admin.store_id)
        .gte('created_at', yesterday)
        .lt('created_at', today);

      const caHier  = (yestOrders || []).reduce((s, o) => s + (o.total || 0), 0);
      const diff    = caHier > 0 ? Math.round((caTotal - caHier) / caHier * 100) : null;
      const diffStr = diff !== null
        ? (diff >= 0 ? '<span style="color:#00d4a0">+' + diff + '% vs hier</span>' : '<span style="color:#ff4d6a">' + diff + '% vs hier</span>')
        : '';

      const prenom  = (admin.full_name || admin.email.split('@')[0]).split(' ')[0];

      // Construction HTML email
      const topProdsHtml = topProds.length
        ? topProds.map((p, i) => `<div style="display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid #f1f5f9"><span style="color:#334155">${['🥇','🥈','🥉'][i]} ${p[0]}</span><span style="font-weight:700;color:#0066ff">${p[1]} vendu${p[1] > 1 ? 's' : ''}</span></div>`).join('')
        : '<p style="color:#94a3b8;font-size:0.85rem">Aucune vente enregistree.</p>';

      const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"></head>
<body style="font-family:Inter,Arial,sans-serif;background:#f8fafc;margin:0;padding:2rem">
<div style="max-width:520px;margin:0 auto;background:white;border-radius:20px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08)">
  <div style="background:linear-gradient(135deg,#060910,#0a0e1a);padding:2rem;text-align:center">
    <h1 style="color:white;margin:0;font-size:1.6rem;font-weight:900;letter-spacing:-0.03em">Neexup</h1>
    <p style="color:rgba(255,255,255,0.6);margin:4px 0 0;font-size:0.85rem">Recap du ${new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
  </div>
  <div style="padding:2rem">
    <p style="color:#334155;font-size:1rem;font-weight:600;margin-bottom:1.5rem">Bonjour ${prenom} ! Voici votre bilan de la journee.</p>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1.5rem">
      <div style="background:#f0f7ff;border-radius:14px;padding:1.25rem;text-align:center">
        <div style="font-size:0.7rem;color:#94a3b8;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:6px">Chiffre d'affaires</div>
        <div style="font-size:1.8rem;font-weight:900;color:#0066ff;letter-spacing:-0.03em">${caTotal.toFixed(0)} MAD</div>
        <div style="font-size:0.75rem;margin-top:4px">${diffStr}</div>
      </div>
      <div style="background:#f0fff8;border-radius:14px;padding:1.25rem;text-align:center">
        <div style="font-size:0.7rem;color:#94a3b8;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:6px">Ventes</div>
        <div style="font-size:1.8rem;font-weight:900;color:#00d4a0;letter-spacing:-0.03em">${nbVentes}</div>
        <div style="font-size:0.72rem;color:#94a3b8;margin-top:4px">${nbEspeces} especes · ${nbCarte} carte</div>
      </div>
    </div>
    <div style="margin-bottom:1.5rem">
      <p style="font-size:0.8rem;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:0.75rem">Top produits du jour</p>
      ${topProdsHtml}
    </div>
    <a href="${SITE_URL}/dashboard.html" style="display:block;background:linear-gradient(135deg,#0066ff,#00d4ff);color:white;text-align:center;padding:14px;border-radius:12px;text-decoration:none;font-weight:800;font-size:0.95rem">Voir le dashboard complet →</a>
  </div>
  <div style="background:#f8fafc;padding:1.25rem 2rem;text-align:center;border-top:1px solid #e2e8f0">
    <p style="color:#94a3b8;font-size:0.72rem;margin:0">Propulse par <a href="${SITE_URL}" style="color:#0066ff;text-decoration:none;font-weight:700">Neexup</a> — La caisse intelligente pour les commercants</p>
  </div>
</div>
</body></html>`;

      // Envoi via l'edge function send-mail existante
      await fetch(`${SUPABASE_URL}/functions/v1/send-mail`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SERVICE_KEY}`
        },
        body: JSON.stringify({
          to: admin.email,
          subject: `Recap Neexup — ${nbVentes} vente${nbVentes > 1 ? 's' : ''} · ${caTotal.toFixed(0)} MAD`,
          html
        })
      });
      sent++;
    } catch (e) {
      console.error('Erreur recap pour', admin.email, e);
    }
  }

  return new Response(JSON.stringify({ sent }), {
    headers: { 'Content-Type': 'application/json' },
    status: 200
  });
});
