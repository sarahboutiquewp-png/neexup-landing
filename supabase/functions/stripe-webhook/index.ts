import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL     = Deno.env.get('SUPABASE_URL')!;
const SERVICE_KEY      = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const WEBHOOK_SECRET   = Deno.env.get('STRIPE_WEBHOOK_SECRET')!;
const SITE_URL         = 'https://neexup.com';

// Mappe le montant paye (en centimes) vers le plan
function resolvePlan(amountTotal: number): { plan: string; months: number } {
  if (amountTotal <= 950)  return { plan: 'starter', months: 1  };
  if (amountTotal <= 8700) return { plan: 'starter', months: 12 };
  if (amountTotal <= 1950) return { plan: 'pro',     months: 1  };
  return                          { plan: 'pro',     months: 12 };
}

async function verifyStripeSignature(body: string, header: string, secret: string): Promise<boolean> {
  const parts = Object.fromEntries(header.split(',').map(p => p.split('=')));
  const timestamp = parts['t'];
  const sig = parts['v1'];
  if (!timestamp || !sig) return false;

  const payload = `${timestamp}.${body}`;
  const key = await crypto.subtle.importKey(
    'raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
  );
  const signatureBuffer = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(payload));
  const computed = Array.from(new Uint8Array(signatureBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
  return computed === sig;
}

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
    <p style="color:#94a3b8;font-size:0.72rem;margin:0">Propulse par <a href="${SITE_URL}" style="color:#0066ff;text-decoration:none;font-weight:700">Neexup</a></p>
  </div>
</div>
</body></html>`;
}

Deno.serve(async (req) => {
  if (req.method !== 'POST') return new Response('Method Not Allowed', { status: 405 });

  const body = await req.text();
  const sigHeader = req.headers.get('stripe-signature') || '';

  const valid = await verifyStripeSignature(body, sigHeader, WEBHOOK_SECRET);
  if (!valid) return new Response('Invalid signature', { status: 400 });

  let event: Record<string, unknown>;
  try { event = JSON.parse(body); } catch { return new Response('Bad JSON', { status: 400 }); }

  if (event.type !== 'checkout.session.completed') {
    return new Response(JSON.stringify({ ignored: true }), { status: 200 });
  }

  const session = event.data as Record<string, unknown>;
  const obj     = session.object as Record<string, unknown>;
  const email   = obj.customer_email as string;
  const amount  = obj.amount_total as number;

  if (!email || !amount) return new Response('Missing email or amount', { status: 400 });

  const sb = createClient(SUPABASE_URL, SERVICE_KEY);
  const { plan, months } = resolvePlan(amount);

  // Trouver l'utilisateur par email
  const { data: { users } } = await sb.auth.admin.listUsers();
  const user = users.find(u => u.email === email);
  if (!user) return new Response('User not found', { status: 404 });

  // Calculer la nouvelle date d'expiration
  const expiryDate = new Date();
  expiryDate.setMonth(expiryDate.getMonth() + months);
  const expiryISO = expiryDate.toISOString().split('T')[0];

  // Mettre a jour le profil
  await sb.from('profiles').update({
    plan,
    expiry_date: expiryISO,
    is_active: true
  }).eq('id', user.id);

  // Email de confirmation de paiement
  const planLabel = plan === 'pro' ? 'Pro' : 'Starter';
  const periodLabel = months === 12 ? 'annuel' : 'mensuel';
  const prenom = (user.user_metadata?.full_name || email.split('@')[0]).split(' ')[0];
  const expiryFr = expiryDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });

  await sendMail(email, `Paiement confirme — Bienvenue sur Neexup ${planLabel} ✅`, emailWrap(`
    <div style="background:linear-gradient(135deg,rgba(0,212,160,0.08),rgba(0,212,160,0.03));border:2px solid rgba(0,212,160,0.3);border-radius:14px;padding:1.5rem;text-align:center;margin-bottom:1.5rem">
      <div style="font-size:2.5rem;margin-bottom:0.5rem">✅</div>
      <p style="color:#00a87a;font-size:1.1rem;font-weight:900;margin:0">Paiement confirme !</p>
    </div>
    <h2 style="color:#0f172a;font-size:1.1rem;font-weight:800;margin-bottom:0.75rem">Bonjour ${prenom},</h2>
    <p style="color:#64748b;line-height:1.7;margin-bottom:1.5rem">Votre abonnement <strong>Neexup ${planLabel} ${periodLabel}</strong> est actif. Votre acces est valable jusqu'au <strong>${expiryFr}</strong>.</p>
    <div style="background:#f0f7ff;border-radius:12px;padding:1.25rem;margin-bottom:1.5rem">
      <p style="color:#0066ff;font-weight:700;margin:0 0 0.5rem">Votre plan ${planLabel} inclut :</p>
      <p style="color:#334155;margin:6px 0">✅ Caisse illimitee</p>
      <p style="color:#334155;margin:6px 0">✅ Gestion des stocks</p>
      <p style="color:#334155;margin:6px 0">✅ Rapports et statistiques</p>
      ${plan === 'pro' ? '<p style="color:#334155;margin:6px 0">✅ Multi-boutiques illimitees</p><p style="color:#334155;margin:6px 0">✅ Employes illimites</p>' : ''}
    </div>
    <a href="${SITE_URL}/dashboard.html" style="display:block;background:linear-gradient(135deg,#0066ff,#00d4ff);color:white;text-align:center;padding:14px;border-radius:12px;text-decoration:none;font-weight:800;font-size:0.95rem;margin-bottom:1rem">Acceder a mon espace →</a>
    <p style="color:#94a3b8;font-size:0.82rem;text-align:center">Merci de faire confiance a Neexup. Des questions ? <a href="mailto:support@neexup.com" style="color:#0066ff">support@neexup.com</a></p>
  `));

  return new Response(JSON.stringify({ ok: true, plan, months }), {
    headers: { 'Content-Type': 'application/json' },
    status: 200
  });
});
