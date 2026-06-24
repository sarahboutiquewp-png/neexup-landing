(function () {
  'use strict';

  var CHIPS = [
    {
      q: 'Combien coute Neexup ?',
      a: '💳 Neexup propose 2 plans :\n\n<b>Starter</b> — 99 MAD / 9€ / mois\n• 1 boutique, 2 employes, 100 ventes/mois\n\n<b>Pro</b> — 199 MAD / 19€ / mois\n• Boutiques & employes illimites\n\n14 jours d\'essai gratuit, sans carte bancaire.'
    },
    {
      q: 'Comment fonctionne l\'essai gratuit ?',
      a: '🎁 Vous beneficiez de <b>14 jours d\'essai gratuit</b> avec acces a toutes les fonctionnalites.\n\nAucune carte bancaire requise. <a href="login.html" style="color:#00d4ff">Creer un compte →</a>'
    },
    {
      q: 'Quelles fonctionnalites sont incluses ?',
      a: '📦 Fonctionnalites incluses :\n\n• Caisse & encaissement\n• Gestion des stocks automatique\n• Rapports & statistiques\n• Multi-employes avec roles\n• Remises & promotions\n• Recus par email client\n• Historique des ventes\n• Export comptable (DGFiP)'
    },
    {
      q: 'Fonctionne sur telephone ?',
      a: '📱 Oui ! Neexup est une <b>application web</b>, aucune installation requise.\n\nCompatible :\n• Telephone (iOS & Android)\n• Tablette\n• Ordinateur (PC & Mac)\n\nOuvrez votre navigateur et connectez-vous.'
    },
    {
      q: 'Comment contacter le support ?',
      a: '💬 Notre support est disponible :\n\n• Email : <a href="mailto:contact@neexup.com" style="color:#00d4ff">contact@neexup.com</a>\n• Page : <a href="contact.html" style="color:#00d4ff">Nous contacter</a>\n• Reponse sous 24h\n\nAbonnes Pro : support prioritaire.'
    },
    {
      q: 'Puis-je annuler mon abonnement ?',
      a: '📋 Oui, sans engagement :\n\n• Annulation possible a tout moment\n• Vos donnees restent accessibles jusqu\'a la fin de la periode\n• Contact : <a href="mailto:contact@neexup.com" style="color:#00d4ff">contact@neexup.com</a>'
    }
  ];

  var QA = [
    { keys: ['prix', 'cout', 'coute', 'combien', 'tarif', 'starter', 'pro', 'mensuel', 'annuel', 'mad', 'euro'], a: CHIPS[0].a },
    { keys: ['essai', 'essayer', 'gratuit', 'trial', 'tester', 'sans engagement', 'carte bancaire', 'gratos', 'offert'], a: CHIPS[1].a },
    { keys: ['inscrire', 'inscription', 'compte', 'creer', 'commencer', 'demarrer', 'rejoindre', 'register', 'signup'], a: '🚀 Pour creer votre compte :\n\n1. Cliquez sur <a href="login.html#register" style="color:#00d4ff">Creer un compte</a>\n2. Renseignez vos infos boutique\n3. Acces immediat !\n\n14 jours d\'essai gratuit inclus.' },
    { keys: ['caisse', 'encaisser', 'vente', 'vendre', 'espece', 'recu', 'ticket caisse'], a: '🛒 La caisse Neexup permet de :\n\n• Scanner ou cliquer sur vos produits\n• Accepter especes ou carte\n• Envoyer un recu par email\n• Gerer les remises\n• Rendre la monnaie automatiquement' },
    { keys: ['fonctionnalite', 'fonction', 'inclus', 'stock', 'inventaire', 'produit', 'catalogue'], a: CHIPS[2].a },
    { keys: ['employe', 'vendeur', 'equipe', 'collaborateur', 'role'], a: '👥 Gestion des employes :\n\n• <b>Starter</b> : 2 employes max\n• <b>Pro</b> : employes illimites\n\nChaque employe a son propre acces avec des permissions definies.' },
    { keys: ['rapport', 'statistique', 'analyse', 'chiffre', 'dashboard', 'tableau bord'], a: '📊 Les rapports incluent :\n\n• CA du jour / semaine / mois\n• Nombre de ventes et panier moyen\n• Top produits\n• Graphique evolution\n• Modes de paiement\n\nEn temps reel sur votre dashboard.' },
    { keys: ['securite', 'donnee', 'rgpd', 'confidentialite', 'ssl', 'supabase'], a: '🔒 Vos donnees sont securisees :\n\n• Hebergement Supabase (AWS)\n• Chiffrement SSL\n• Isolation par boutique (RLS)\n• Conforme RGPD' },
    { keys: ['support', 'aide', 'contact', 'assistance', 'probleme', 'bug', 'erreur'], a: CHIPS[4].a },
    { keys: ['telephone', 'mobile', 'application', 'app', 'android', 'iphone', 'ios', 'tablette', 'navigateur'], a: CHIPS[3].a },
    { keys: ['boutique', 'magasin', 'commerce', 'epicerie', 'restaurant', 'cafe', 'boulangerie', 'salon'], a: '🏪 Neexup convient a tous types de commerces :\n\n• Epiceries & supérettes\n• Restaurants & cafes\n• Boutiques mode\n• Boulangeries & patisseries\n• Salons de coiffure\n• Et bien d\'autres !' },
    { keys: ['resiliation', 'resilier', 'annuler', 'annulation', 'quitter', 'arreter'], a: CHIPS[5].a },
    { keys: ['parrainage', 'parrain', 'recommander', 'filleul', 'ami'], a: '🎁 Programme de parrainage :\n\n• Vous gagnez <b>1 mois offert</b>\n• Votre filleul : <b>-10%</b> sur son 1er abonnement Pro\n\nCode disponible dans votre espace → Parrainage.' }
  ];

  var FALLBACK = '🤔 Je n\'ai pas compris votre question.\n\nVoici ce que je peux vous aider :\n• Prix et abonnements\n• Fonctionnalites\n• Inscription et essai gratuit\n• Support\n\n<a href="mailto:contact@neexup.com" style="color:#00d4ff">contact@neexup.com</a>';
  var WELCOME = 'Bonjour 👋 Je suis l\'assistant Neexup.\nChoisissez une question ou posez la votre.';

  var css = [
    '#nx-chat-btn{position:fixed;bottom:24px;right:24px;z-index:9000;width:56px;height:56px;border-radius:50%;',
    'background:linear-gradient(135deg,#0066ff,#00d4ff);border:none;cursor:pointer;',
    'box-shadow:0 4px 20px rgba(0,102,255,0.4);display:flex;align-items:center;justify-content:center;',
    'transition:transform 0.2s,box-shadow 0.2s;font-size:1.4rem;}',
    '#nx-chat-btn:hover{transform:scale(1.08);}',
    '#nx-chat-btn .nx-notif{position:absolute;top:-2px;right:-2px;width:14px;height:14px;',
    'border-radius:50%;background:#ff4d6a;border:2px solid #060910;}',

    '#nx-chat-win{position:fixed;bottom:90px;right:24px;z-index:9000;width:350px;max-height:560px;',
    'background:#0a0e1a;border:1px solid rgba(255,255,255,0.08);border-radius:20px;',
    'display:flex;flex-direction:column;box-shadow:0 20px 60px rgba(0,0,0,0.6);',
    'transform:scale(0.95) translateY(10px);opacity:0;',
    'transition:transform 0.25s ease,opacity 0.25s ease;pointer-events:none;}',
    '#nx-chat-win.open{transform:scale(1) translateY(0);opacity:1;pointer-events:all;}',

    '.nx-head{padding:0.9rem 1.25rem;border-bottom:1px solid rgba(255,255,255,0.07);',
    'display:flex;align-items:center;gap:10px;border-radius:20px 20px 0 0;',
    'background:linear-gradient(135deg,rgba(0,102,255,0.15),rgba(0,212,255,0.05));}',
    '.nx-av{width:36px;height:36px;border-radius:50%;flex-shrink:0;',
    'background:linear-gradient(135deg,#0066ff,#00d4ff);',
    'display:flex;align-items:center;justify-content:center;font-weight:900;font-size:0.75rem;color:white;}',
    '.nx-head-info{flex:1;}',
    '.nx-head-name{font-size:0.88rem;font-weight:700;color:#eef2ff;}',
    '.nx-head-sub{font-size:0.7rem;color:#7a8399;margin-top:1px;display:flex;align-items:center;gap:5px;}',
    '.nx-dot{width:7px;height:7px;border-radius:50%;background:#00d4a0;flex-shrink:0;}',
    '.nx-close{width:26px;height:26px;border-radius:7px;background:rgba(255,255,255,0.06);',
    'border:none;color:#64748b;cursor:pointer;font-size:0.9rem;',
    'display:flex;align-items:center;justify-content:center;}',
    '.nx-close:hover{background:rgba(255,255,255,0.1);color:#eef2ff;}',

    '.nx-msgs{flex:1;overflow-y:auto;padding:1rem;display:flex;flex-direction:column;gap:0.6rem;min-height:0;',
    'scrollbar-width:thin;scrollbar-color:rgba(255,255,255,0.08) transparent;}',
    '.nx-msgs::-webkit-scrollbar{width:3px;}',
    '.nx-msgs::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.1);border-radius:2px;}',

    '.nx-bubble{max-width:90%;padding:0.65rem 0.9rem;border-radius:14px;',
    'font-size:0.81rem;line-height:1.6;font-family:Inter,sans-serif;}',
    '.nx-bubble.bot{background:#0f1525;border:1px solid rgba(255,255,255,0.07);',
    'color:#cbd5e1;align-self:flex-start;border-radius:4px 14px 14px 14px;}',
    '.nx-bubble.user{background:linear-gradient(135deg,#0066ff,#0052cc);',
    'color:white;align-self:flex-end;border-radius:14px 14px 4px 14px;}',
    '.nx-bubble a{color:#00d4ff;text-decoration:none;}',

    '.nx-chips{display:flex;flex-direction:column;gap:6px;width:100%;}',
    '.nx-chip{background:transparent;border:1px solid rgba(255,255,255,0.1);',
    'color:#94a3b8;border-radius:8px;padding:8px 12px;font-size:0.78rem;',
    'font-family:Inter,sans-serif;cursor:pointer;text-align:left;width:100%;',
    'transition:all 0.15s;line-height:1.3;}',
    '.nx-chip:hover{background:rgba(0,102,255,0.1);border-color:rgba(0,212,255,0.35);color:#eef2ff;}',

    '.nx-typing{display:flex;gap:4px;align-items:center;padding:0.65rem 0.9rem;',
    'background:#0f1525;border:1px solid rgba(255,255,255,0.07);',
    'border-radius:4px 14px 14px 14px;align-self:flex-start;width:fit-content;}',
    '.nx-typing span{width:6px;height:6px;border-radius:50%;background:#7a8399;animation:nx-b 1.2s infinite;}',
    '.nx-typing span:nth-child(2){animation-delay:0.2s;}',
    '.nx-typing span:nth-child(3){animation-delay:0.4s;}',
    '@keyframes nx-b{0%,60%,100%{transform:translateY(0);}30%{transform:translateY(-5px);}}',

    '.nx-footer{padding:0.65rem 0.9rem;border-top:1px solid rgba(255,255,255,0.07);',
    'display:flex;gap:0.5rem;border-radius:0 0 20px 20px;}',
    '#nx-input{flex:1;padding:9px 13px;background:#0f1525;',
    'border:1px solid rgba(255,255,255,0.08);border-radius:10px;',
    'color:#eef2ff;font-size:0.81rem;font-family:Inter,sans-serif;outline:none;}',
    '#nx-input:focus{border-color:rgba(0,102,255,0.4);}',
    '#nx-input::placeholder{color:#3d4560;}',
    '#nx-send{width:36px;height:36px;border-radius:10px;flex-shrink:0;',
    'background:linear-gradient(135deg,#0066ff,#00d4ff);',
    'border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:0.95rem;}',
    '@media(max-width:420px){#nx-chat-win{width:calc(100vw - 32px);right:16px;}}'
  ].join('');

  var st = document.createElement('style');
  st.textContent = css;
  document.head.appendChild(st);

  var btn = document.createElement('button');
  btn.id = 'nx-chat-btn';
  btn.innerHTML = '<span>💬</span><div class="nx-notif"></div>';
  btn.title = 'Assistant Neexup';
  document.body.appendChild(btn);

  var win = document.createElement('div');
  win.id = 'nx-chat-win';
  win.innerHTML =
    '<div class="nx-head">' +
      '<div class="nx-av">NX</div>' +
      '<div class="nx-head-info">' +
        '<div class="nx-head-name">Assistant Neexup</div>' +
        '<div class="nx-head-sub"><span class="nx-dot"></span>Repond a toutes vos questions</div>' +
      '</div>' +
      '<button class="nx-close" id="nx-close">✕</button>' +
    '</div>' +
    '<div class="nx-msgs" id="nx-msgs"></div>' +
    '<div class="nx-footer">' +
      '<input type="text" id="nx-input" placeholder="Posez votre question..."/>' +
      '<button id="nx-send">➤</button>' +
    '</div>';
  document.body.appendChild(win);

  var isOpen = false;
  var hasOpened = false;
  var msgs = document.getElementById('nx-msgs');
  var input = document.getElementById('nx-input');

  function toggle() {
    isOpen = !isOpen;
    win.classList.toggle('open', isOpen);
    if (isOpen && !hasOpened) {
      hasOpened = true;
      var notif = btn.querySelector('.nx-notif');
      if (notif) notif.style.display = 'none';
      addBotMsg(WELCOME);
      addChips();
    }
    if (isOpen) setTimeout(function () { input.focus(); }, 200);
  }

  function addChips() {
    var wrap = document.createElement('div');
    wrap.className = 'nx-chips';
    CHIPS.forEach(function (item) {
      var c = document.createElement('button');
      c.className = 'nx-chip';
      c.textContent = item.q;
      var answer = item.a;
      c.onclick = function () {
        wrap.remove();
        addUserMsg(item.q);
        showTyping();
        setTimeout(function () {
          removeTyping();
          addBotMsg(answer);
        }, 600);
      };
      wrap.appendChild(c);
    });
    msgs.appendChild(wrap);
    scroll();
  }

  btn.onclick = toggle;
  document.getElementById('nx-close').onclick = toggle;
  document.getElementById('nx-send').onclick = send;
  input.addEventListener('keydown', function (e) { if (e.key === 'Enter') send(); });

  function send() {
    var text = input.value.trim();
    if (!text) return;
    input.value = '';
    var chips = msgs.querySelector('.nx-chips');
    if (chips) chips.remove();
    addUserMsg(text);
    showTyping();
    setTimeout(function () {
      removeTyping();
      addBotMsg(findAnswer(text));
    }, 600);
  }

  function addUserMsg(text) {
    var b = document.createElement('div');
    b.className = 'nx-bubble user';
    b.textContent = text;
    msgs.appendChild(b);
    scroll();
  }

  function addBotMsg(html) {
    var b = document.createElement('div');
    b.className = 'nx-bubble bot';
    b.innerHTML = html.replace(/\n/g, '<br>');
    msgs.appendChild(b);
    scroll();
  }

  var typingEl = null;
  function showTyping() {
    typingEl = document.createElement('div');
    typingEl.className = 'nx-typing';
    typingEl.innerHTML = '<span></span><span></span><span></span>';
    msgs.appendChild(typingEl);
    scroll();
  }
  function removeTyping() { if (typingEl) { typingEl.remove(); typingEl = null; } }
  function scroll() { msgs.scrollTop = msgs.scrollHeight; }

  function normalize(str) {
    return str.toLowerCase()
      .normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9\s]/g, ' ');
  }

  function findAnswer(question) {
    var q = normalize(question);
    var words = q.split(/\s+/).filter(function(w) { return w.length > 2; });
    var bestScore = 0;
    var bestAnswer = FALLBACK;
    QA.forEach(function (item) {
      var score = 0;
      item.keys.forEach(function (k) {
        var kn = normalize(k);
        if (q.includes(kn)) score += 2;
        else words.forEach(function (w) { if (kn.includes(w) && w.length > 3) score += 1; });
      });
      if (score > bestScore) { bestScore = score; bestAnswer = item.a; }
    });
    return bestScore >= 2 ? bestAnswer : FALLBACK;
  }
})();
