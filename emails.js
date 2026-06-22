
// Neexup Email Service
var FROM_EMAIL = 'Neexup <noreply@neexup.com>';

async function sendEmail(to, subject, html) {
  try {
    var res = await fetch(SUPABASE_URL + '/functions/v1/send-mail', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + SUPABASE_ANON_KEY
      },
      body: JSON.stringify({ to: to, subject: subject, html: html })
    });
    return res.ok;
  } catch(e) {
    console.error('Email error:', e);
    return false;
  }
}

function emailHeader(title, subtitle) {
  return '<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body style="font-family:Inter,Arial,sans-serif;background:#f8fafc;margin:0;padding:2rem"><div style="max-width:520px;margin:0 auto;background:white;border-radius:20px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08)"><div style="background:linear-gradient(135deg,#0066ff,#00d4ff);padding:2.5rem 2rem;text-align:center"><h1 style="color:white;margin:0;font-size:1.8rem;font-weight:900;letter-spacing:-0.03em">Neexup</h1><p style="color:rgba(255,255,255,0.85);margin:6px 0 0;font-size:1rem">' + title + '</p></div><div style="padding:2rem">';
}

function emailFooter() {
  return '</div><div style="background:#f8fafc;padding:1.25rem 2rem;text-align:center;border-top:1px solid #e2e8f0"><p style="color:#94a3b8;font-size:0.75rem;margin:0">Propulse par <strong style="color:#0066ff">Neexup</strong> &mdash; <a href="mailto:support@neexup.com" style="color:#0066ff;text-decoration:none">support@neexup.com</a></p></div></div></body></html>';
}

// 1. Email de bienvenue commercant
async function sendWelcomeEmail(email, firstName, storeName, loginUrl) {
  var html = emailHeader('Bienvenue sur Neexup !', '') +
    '<h2 style="color:#0f172a;font-size:1.3rem;font-weight:800;margin-bottom:0.5rem">Bonjour ' + firstName + ' ! 🎉</h2>' +
    '<p style="color:#64748b;line-height:1.7;margin-bottom:1.5rem">Votre boutique <strong style="color:#0066ff">' + storeName + '</strong> est prete. Vous avez <strong>14 jours d essai gratuit</strong> pour decouvrir toutes les fonctionnalites de Neexup.</p>' +
    '<div style="background:#f0f7ff;border-radius:12px;padding:1.25rem;margin-bottom:1.5rem">' +
    '<p style="color:#0066ff;font-weight:700;margin:0 0 0.75rem">Ce que vous pouvez faire :</p>' +
    '<p style="color:#334155;margin:4px 0">🛒 Encaisser vos clients en caisse</p>' +
    '<p style="color:#334155;margin:4px 0">📦 Gerer vos produits et stocks</p>' +
    '<p style="color:#334155;margin:4px 0">📊 Suivre vos ventes et rapports</p>' +
    '<p style="color:#334155;margin:4px 0">👥 Ajouter vos employes</p>' +
    '</div>' +
    '<a href="' + loginUrl + '" style="display:block;background:linear-gradient(135deg,#0066ff,#00d4ff);color:white;text-align:center;padding:14px;border-radius:12px;text-decoration:none;font-weight:800;font-size:1rem;margin-bottom:1.5rem">Acceder a mon espace →</a>' +
    '<p style="color:#94a3b8;font-size:0.85rem;text-align:center">Des questions ? Contactez-nous a <a href="mailto:support@neexup.com" style="color:#0066ff">support@neexup.com</a></p>' +
    emailFooter();
  return sendEmail(email, 'Bienvenue sur Neexup ' + firstName + ' ! 🎉', html);
}

// 2. Email invitation filleul
async function sendReferralEmail(email, referrerName, referralLink) {
  var html = emailHeader('Vous avez ete invite !', '') +
    '<h2 style="color:#0f172a;font-size:1.3rem;font-weight:800;margin-bottom:0.5rem">Vous avez ete invite par ' + referrerName + ' ! 🎁</h2>' +
    '<p style="color:#64748b;line-height:1.7;margin-bottom:1.5rem"><strong>' + referrerName + '</strong> vous invite a rejoindre <strong style="color:#0066ff">Neexup</strong>, la plateforme POS pour les commercants.</p>' +
    '<div style="background:linear-gradient(135deg,rgba(124,58,237,0.08),rgba(0,102,255,0.04));border:1px solid rgba(124,58,237,0.2);border-radius:12px;padding:1.25rem;margin-bottom:1.5rem;text-align:center">' +
    '<p style="color:#7c3aed;font-weight:800;font-size:1.1rem;margin:0 0 0.5rem">Votre avantage exclusif</p>' +
    '<p style="color:#0f172a;font-size:2rem;font-weight:900;margin:0">-10%</p>' +
    '<p style="color:#64748b;margin:4px 0 0">sur votre premier abonnement Pro</p>' +
    '</div>' +
    '<a href="' + referralLink + '" style="display:block;background:linear-gradient(135deg,#7c3aed,#a855f7);color:white;text-align:center;padding:14px;border-radius:12px;text-decoration:none;font-weight:800;font-size:1rem;margin-bottom:1.5rem">Creer mon compte gratuitement →</a>' +
    '<p style="color:#94a3b8;font-size:0.82rem;text-align:center">14 jours d essai gratuit — Aucune carte bancaire requise</p>' +
    emailFooter();
  return sendEmail(email, referrerName + ' vous invite a rejoindre Neexup ! 🎁', html);
}

// 3. Email recu de caisse
async function sendReceiptEmail(email, receiptNum, items, total, payMethod, customerName, change, storeName, devise) {
  devise = devise || 'MAD';
  var itemsHtml = items.map(function(i) {
    return '<tr><td style="padding:10px 0;border-bottom:1px solid #f1f5f9;color:#334155">' + i.name + '</td><td style="padding:10px 0;border-bottom:1px solid #f1f5f9;text-align:center;color:#64748b">x' + i.qty + '</td><td style="padding:10px 0;border-bottom:1px solid #f1f5f9;text-align:right;font-weight:700;color:#0f172a">' + (i.price * i.qty).toFixed(2) + ' ' + devise + '</td></tr>';
  }).join('');

  var html = emailHeader('Votre recu', storeName || 'Neexup') +
    '<h2 style="color:#0f172a;font-size:1.2rem;font-weight:800;margin-bottom:0.5rem">Merci' + (customerName ? ' ' + customerName : '') + ' ! 🙏</h2>' +
    '<p style="color:#64748b;margin-bottom:1.5rem">Voici votre recu pour votre achat chez <strong>' + (storeName || 'Neexup') + '</strong>.</p>' +
    '<div style="background:#f0f7ff;border-radius:10px;padding:1rem;margin-bottom:1.5rem;display:flex;justify-content:space-between;align-items:center">' +
    '<div><p style="font-size:0.72rem;color:#94a3b8;margin:0;text-transform:uppercase;letter-spacing:0.08em">N° Recu</p><p style="font-size:1rem;font-weight:800;color:#0066ff;margin:2px 0;font-family:monospace">' + receiptNum + '</p></div>' +
    '<div style="text-align:right"><p style="font-size:0.72rem;color:#94a3b8;margin:0;text-transform:uppercase;letter-spacing:0.08em">Date</p><p style="font-size:0.875rem;font-weight:600;color:#334155;margin:2px 0">' + new Date().toLocaleDateString('fr-FR') + '</p></div></div>' +
    '<table style="width:100%;border-collapse:collapse;margin-bottom:1.5rem">' +
    '<thead><tr><th style="text-align:left;color:#94a3b8;font-size:0.75rem;padding-bottom:8px;font-weight:600">Article</th><th style="text-align:center;color:#94a3b8;font-size:0.75rem;padding-bottom:8px;font-weight:600">Qte</th><th style="text-align:right;color:#94a3b8;font-size:0.75rem;padding-bottom:8px;font-weight:600">Total</th></tr></thead>' +
    '<tbody>' + itemsHtml + '</tbody></table>' +
    '<div style="background:#f8fafc;border-radius:12px;padding:1.25rem;margin-bottom:1rem">' +
    '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px"><span style="color:#64748b">Mode de paiement</span><span style="font-weight:600;color:#334155">' + (payMethod === 'cash' ? 'Especes' : 'Carte bancaire') + '</span></div>' +
    (payMethod === 'cash' && change > 0 ? '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px"><span style="color:#64748b">Monnaie rendue</span><span style="font-weight:600;color:#334155">' + change.toFixed(2) + ' ' + devise + '</span></div>' : '') +
    '<div style="display:flex;justify-content:space-between;align-items:center;padding-top:8px;border-top:2px solid #e2e8f0"><span style="font-size:1rem;font-weight:700;color:#0f172a">Total</span><span style="font-size:1.4rem;font-weight:900;color:#0066ff">' + total.toFixed(2) + ' ' + devise + '</span></div></div>' +
    '<p style="color:#94a3b8;font-size:0.82rem;text-align:center">Conservez ce recu. Merci de votre confiance !</p>' +
    emailFooter();
  return sendEmail(email, 'Votre recu ' + storeName + ' — ' + receiptNum, html);
}
