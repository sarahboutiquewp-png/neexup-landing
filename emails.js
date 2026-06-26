
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
  return '</div><div style="background:#f8fafc;padding:1.25rem 2rem;text-align:center;border-top:1px solid #e2e8f0"><p style="color:#94a3b8;font-size:0.75rem;margin:0 0 4px">Propulsé par <a href="https://neexup.com" style="color:#0066ff;text-decoration:none;font-weight:700">Neexup</a> &mdash; La caisse intelligente pour les commerçants</p><p style="color:#cbd5e1;font-size:0.7rem;margin:0"><a href="mailto:support@neexup.com" style="color:#94a3b8;text-decoration:none">support@neexup.com</a></p></div></div></body></html>';
}

// 1. Email de bienvenue commercant
async function sendWelcomeEmail(email, firstName, storeName, loginUrl) {
  var html = emailHeader('Bienvenue sur Neexup !', '') +
    '<h2 style="color:#0f172a;font-size:1.3rem;font-weight:800;margin-bottom:0.5rem">Bonjour ' + firstName + ' ! 🎉</h2>' +
    '<p style="color:#64748b;line-height:1.7;margin-bottom:1.5rem">Votre boutique <strong style="color:#0066ff">' + storeName + '</strong> est pr&#234;te. Vous avez <strong>14 jours d&#39;essai gratuit</strong> pour d&#233;couvrir toutes les fonctionnalit&#233;s de Neexup.</p>' +
    '<div style="background:#f0f7ff;border-radius:12px;padding:1.25rem;margin-bottom:1.5rem">' +
    '<p style="color:#0066ff;font-weight:700;margin:0 0 0.75rem">Ce que vous pouvez faire&#160;:</p>' +
    '<p style="color:#334155;margin:4px 0">🛒 Encaisser vos clients en caisse</p>' +
    '<p style="color:#334155;margin:4px 0">📦 Gerer vos produits et stocks</p>' +
    '<p style="color:#334155;margin:4px 0">📊 Suivre vos ventes et rapports</p>' +
    '<p style="color:#334155;margin:4px 0">👥 Ajouter vos employes</p>' +
    '</div>' +
    '<a href="' + loginUrl + '" style="display:block;background:linear-gradient(135deg,#0066ff,#00d4ff);color:white;text-align:center;padding:14px;border-radius:12px;text-decoration:none;font-weight:800;font-size:1rem;margin-bottom:1.5rem">Acceder a mon espace →</a>' +
    '<p style="color:#94a3b8;font-size:0.85rem;text-align:center">Des questions&#160;? Contactez-nous &#224; <a href="mailto:support@neexup.com" style="color:#0066ff">support@neexup.com</a></p>' +
    emailFooter();
  return sendEmail(email, 'Bienvenue sur Neexup ' + firstName + ' ! 🎉', html);
}

// 2. Email invitation filleul
async function sendReferralEmail(email, referrerName, referralLink) {
  var html = emailHeader('Vous avez ete invite !', '') +
    '<h2 style="color:#0f172a;font-size:1.3rem;font-weight:800;margin-bottom:0.5rem">Vous avez ete invite par ' + referrerName + ' ! 🎁</h2>' +
    '<p style="color:#64748b;line-height:1.7;margin-bottom:1.5rem"><strong>' + referrerName + '</strong> vous invite &#224; rejoindre <strong style="color:#0066ff">Neexup</strong>, la plateforme POS pour les commer&#231;ants.</p>' +
    '<div style="background:linear-gradient(135deg,rgba(124,58,237,0.08),rgba(0,102,255,0.04));border:1px solid rgba(124,58,237,0.2);border-radius:12px;padding:1.25rem;margin-bottom:1.5rem;text-align:center">' +
    '<p style="color:#7c3aed;font-weight:800;font-size:1.1rem;margin:0 0 0.5rem">Votre avantage exclusif</p>' +
    '<p style="color:#0f172a;font-size:2rem;font-weight:900;margin:0">-10%</p>' +
    '<p style="color:#64748b;margin:4px 0 0">sur votre premier abonnement Pro</p>' +
    '</div>' +
    '<a href="' + referralLink + '" style="display:block;background:linear-gradient(135deg,#7c3aed,#a855f7);color:white;text-align:center;padding:14px;border-radius:12px;text-decoration:none;font-weight:800;font-size:1rem;margin-bottom:1.5rem">Creer mon compte gratuitement →</a>' +
    '<p style="color:#94a3b8;font-size:0.82rem;text-align:center">14 jours d&#39;essai gratuit &#8212; Aucune carte bancaire requise</p>' +
    emailFooter();
  return sendEmail(email, referrerName + ' vous invite a rejoindre Neexup ! 🎁', html);
}

// 3. Email recu de caisse
async function sendReceiptEmail(email, receiptNum, items, total, payMethod, customerName, change, storeName, devise) {
  devise = devise || 'MAD';
  var itemsHtml = items.map(function(i) {
    return '<tr>' +
      '<td style="padding:11px 8px 11px 0;border-bottom:1px solid #f1f5f9;color:#334155;font-size:0.9rem">' + i.name + '</td>' +
      '<td style="padding:11px 8px;border-bottom:1px solid #f1f5f9;text-align:center;color:#64748b;font-size:0.9rem">x' + i.qty + '</td>' +
      '<td style="padding:11px 0 11px 8px;border-bottom:1px solid #f1f5f9;text-align:right;font-weight:700;color:#0f172a;font-size:0.9rem;white-space:nowrap">' + (i.price * i.qty).toFixed(2) + '&nbsp;' + devise + '</td>' +
    '</tr>';
  }).join('');

  var dateStr = new Date().toLocaleDateString('fr-FR');
  var payLabel = payMethod === 'cash' ? 'Esp&#232;ces' : 'Carte bancaire';

  var html = '<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>body{margin:0;padding:0;background:#f8fafc;font-family:Arial,sans-serif}@media only screen and (max-width:600px){.wrap{width:100%!important;border-radius:0!important}.inner{padding:1.25rem!important}}</style></head><body style="background:#f8fafc;margin:0;padding:20px 0">' +
    '<table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" style="padding:20px 16px">' +
    '<table class="wrap" width="520" cellpadding="0" cellspacing="0" border="0" style="background:white;border-radius:20px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);max-width:520px;width:100%">' +

    '<tr><td style="background:linear-gradient(135deg,#0066ff,#00d4ff);padding:32px 32px 28px;text-align:center">' +
    '<div style="color:white;font-size:1.8rem;font-weight:900;letter-spacing:-0.03em;margin-bottom:6px">Neexup</div>' +
    '<div style="color:rgba(255,255,255,0.85);font-size:1rem">Votre re&#231;u</div>' +
    '</td></tr>' +

    '<tr><td class="inner" style="padding:2rem">' +
    '<h2 style="color:#0f172a;font-size:1.2rem;font-weight:800;margin:0 0 6px">Merci' + (customerName ? ' ' + customerName : '') + '&nbsp;&#128591;</h2>' +
    '<p style="color:#64748b;margin:0 0 1.5rem;line-height:1.6">Voici votre re&#231;u pour votre achat chez <strong>' + (storeName || 'Neexup') + '</strong>.</p>' +

    '<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f0f7ff;border-radius:10px;margin-bottom:1.5rem">' +
    '<tr>' +
    '<td style="padding:14px 16px;vertical-align:top">' +
    '<div style="font-size:0.68rem;color:#94a3b8;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:4px">N&#176;&nbsp;Re&#231;u</div>' +
    '<div style="font-size:0.9rem;font-weight:800;color:#0066ff;font-family:monospace">' + receiptNum + '</div>' +
    '</td>' +
    '<td style="padding:14px 16px;vertical-align:top;text-align:right">' +
    '<div style="font-size:0.68rem;color:#94a3b8;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:4px">Date</div>' +
    '<div style="font-size:0.9rem;font-weight:600;color:#334155">' + dateStr + '</div>' +
    '</td>' +
    '</tr></table>' +

    '<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:1.5rem">' +
    '<thead><tr>' +
    '<th style="text-align:left;color:#94a3b8;font-size:0.72rem;padding:0 8px 10px 0;font-weight:600;border-bottom:2px solid #f1f5f9">Article</th>' +
    '<th style="text-align:center;color:#94a3b8;font-size:0.72rem;padding:0 8px 10px;font-weight:600;border-bottom:2px solid #f1f5f9">Qt&#233;</th>' +
    '<th style="text-align:right;color:#94a3b8;font-size:0.72rem;padding:0 0 10px 8px;font-weight:600;border-bottom:2px solid #f1f5f9">Total</th>' +
    '</tr></thead>' +
    '<tbody>' + itemsHtml + '</tbody></table>' +

    '<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f8fafc;border-radius:12px;margin-bottom:1rem">' +
    '<tr><td style="padding:14px 16px 6px">' +
    '<table width="100%" cellpadding="0" cellspacing="0" border="0">' +
    '<tr><td style="color:#64748b;font-size:0.88rem;padding-bottom:8px">Mode de paiement</td><td style="text-align:right;font-weight:600;color:#334155;font-size:0.88rem;padding-bottom:8px">' + payLabel + '</td></tr>' +
    (payMethod === 'cash' && change > 0 ? '<tr><td style="color:#64748b;font-size:0.88rem;padding-bottom:8px">Monnaie rendue</td><td style="text-align:right;font-weight:600;color:#334155;font-size:0.88rem;padding-bottom:8px">' + change.toFixed(2) + '&nbsp;' + devise + '</td></tr>' : '') +
    '<tr><td colspan="2" style="border-top:2px solid #e2e8f0;padding-top:10px"></td></tr>' +
    '<tr><td style="font-size:1rem;font-weight:700;color:#0f172a;padding-bottom:4px">Total</td><td style="text-align:right;font-size:1.4rem;font-weight:900;color:#0066ff;padding-bottom:4px;white-space:nowrap">' + total.toFixed(2) + '&nbsp;' + devise + '</td></tr>' +
    '</table></td></tr></table>' +

    '<p style="color:#94a3b8;font-size:0.82rem;text-align:center;margin:0">Conservez ce re&#231;u. Merci de votre confiance&nbsp;!</p>' +
    '</td></tr>' +

    '<tr><td style="background:#f8fafc;padding:1.25rem 2rem;text-align:center;border-top:1px solid #e2e8f0">' +
    '<p style="color:#94a3b8;font-size:0.75rem;margin:0 0 4px">Propuls&#233; par <a href="https://neexup.com" style="color:#0066ff;text-decoration:none;font-weight:700">Neexup</a> &mdash; La caisse intelligente pour les commer&#231;ants</p>' +
    '<p style="color:#cbd5e1;font-size:0.7rem;margin:0"><a href="mailto:support@neexup.com" style="color:#94a3b8;text-decoration:none">support@neexup.com</a></p>' +
    '</td></tr>' +

    '</table></td></tr></table></body></html>';

  return sendEmail(email, 'Votre reçu ' + storeName + ' — ' + receiptNum, html);
}
