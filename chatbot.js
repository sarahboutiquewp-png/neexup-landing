(function () {
  'use strict';

  // ── BASE DE CONNAISSANCES ─────────────────────────────────────────
  var QA = [
    {
      keys: ['prix', 'cout', 'coute', 'combien', 'tarif', 'abonnement', 'starter', 'pro', 'payer', 'paiement', 'mensuel', 'annuel', 'mad', 'euro'],
      answer: '💳 Neexup propose 2 plans :\n\n<b>Starter</b> — 99 MAD / 9€ / mois\n• 1 boutique • 2 employés • 100 ventes/mois\n\n<b>Pro</b> — 199 MAD / 19€ / mois\n• Boutiques & employés illimités • Ventes illimitées\n\n✨ 14 jours d\'essai gratuit, aucune carte bancaire requise.'
    },
    {
      keys: ['essai', 'essayer', 'essaye', 'gratuit', 'trial', 'tester', 'test', 'decouvrir', 'decouverte', 'sans engagement', 'carte bancaire', 'gratos', 'offert', 'veux essayer', 'je veux'],
      answer: '🎁 Oui ! Vous bénéficiez de <b>14 jours d\'essai gratuit</b> avec accès à toutes les fonctionnalités.\n\nAucune carte bancaire requise pour démarrer. <a href="login.html" style="color:#00d4ff">Créer un compte →</a>'
    },
    {
      keys: ['inscrire', 'inscription', 'compte', 'creer', 'créer', 'commencer', 'demarrer', 'démarrer', 'rejoindre', 'register', 'signup'],
      answer: '🚀 Pour créer votre compte :\n\n1. Cliquez sur <a href="login.html#register" style="color:#00d4ff">Créer un compte</a>\n2. Renseignez vos infos boutique\n3. C\'est parti — accès immédiat !\n\n14 jours d\'essai gratuit inclus.'
    },
    {
      keys: ['caisse', 'encaisser', 'vente', 'vendre', 'pos', 'paiement client', 'espece', 'carte', 'recu', 'ticket', 'reçu'],
      answer: '🛒 La caisse Neexup permet de :\n\n• Scanner ou cliquer sur vos produits\n• Accepter espèces ou carte bancaire\n• Envoyer un reçu par email au client\n• Gérer les remises et promotions\n• Rendre la monnaie automatiquement\n\nSimple, rapide, sans matériel spécial.'
    },
    {
      keys: ['stock', 'inventaire', 'rupture', 'quantite', 'quantité', 'produit', 'produits', 'catalogue', 'article'],
      answer: '📦 La gestion des stocks Neexup :\n\n• Mise à jour automatique à chaque vente\n• Alertes de stock bas\n• Ajustement manuel possible\n• Historique des mouvements\n• Catégories de produits avec couleurs\n• Photos produits (plan Pro)'
    },
    {
      keys: ['employe', 'employé', 'vendeur', 'vendeurs', 'equipe', 'équipe', 'collaborateur', 'manager', 'acces', 'accès', 'role'],
      answer: '👥 Gestion des employés :\n\n• <b>Starter</b> : jusqu\'à 2 employés\n• <b>Pro</b> : employés illimités\n\nChaque employé a son propre accès sécurisé. Vous pouvez définir des rôles (Manager / Vendeur) avec des permissions différentes.'
    },
    {
      keys: ['rapport', 'rapports', 'statistique', 'statistiques', 'analyse', 'chiffre', 'ca', 'chiffre affaire', "chiffre d'affaire", 'revenus', 'dashboard', 'tableau'],
      answer: '📊 Les rapports Neexup incluent :\n\n• Chiffre d\'affaires du jour / semaine / mois\n• Nombre de ventes et panier moyen\n• Top produits les plus vendus\n• Graphique d\'évolution des ventes\n• Modes de paiement (espèces vs carte)\n\nTout en temps réel sur votre dashboard.'
    },
    {
      keys: ['remise', 'remises', 'promotion', 'promo', 'reduction', 'réduction', 'discount', 'solde', 'offre', 'pourcentage'],
      answer: '🏷️ Les remises Neexup :\n\n• Remises sur le panier total (% ou montant fixe)\n• Remises par produit\n• Remises planifiées (date de début et fin)\n• Activation / désactivation en 1 clic\n\nAvailable sur les deux plans Starter et Pro.'
    },
    {
      keys: ['securite', 'sécurité', 'donnee', 'données', 'rgpd', 'confidentialite', 'confidentialité', 'ssl', 'chiffrement', 'supabase', 'hebergement', 'hébergement'],
      answer: '🔒 Vos données sont sécurisées :\n\n• Hébergement sur <b>Supabase</b> (infrastructure AWS)\n• Chiffrement SSL sur toutes les communications\n• Isolation des données par boutique (RLS)\n• Conforme RGPD\n\nVos données vous appartiennent. Vous pouvez les exporter à tout moment.'
    },
    {
      keys: ['support', 'aide', 'contact', 'assistance', 'probleme', 'problème', 'bug', 'erreur', 'question'],
      answer: '💬 Notre support est disponible :\n\n• Email : <a href="mailto:support@neexup.com" style="color:#00d4ff">support@neexup.com</a>\n• Page contact : <a href="contact.html" style="color:#00d4ff">contact.html</a>\n• Réponse sous 24h\n\nPour les abonnés Pro : support prioritaire.'
    },
    {
      keys: ['maroc', 'france', 'algerie', 'algérie', 'tunisie', 'pays', 'langue', 'arabe', 'francais', 'français', 'anglais'],
      answer: '🌍 Neexup est disponible au :\n\n• 🇲🇦 Maroc — prix en MAD\n• 🇫🇷 France — prix en EUR\n• Autres pays francophones\n\nL\'interface est disponible en <b>Français</b>, <b>Anglais</b> et <b>Arabe</b> (avec support RTL).'
    },
    {
      keys: ['telephone', 'téléphone', 'mobile', 'application', 'app', 'android', 'iphone', 'ios', 'tablette', 'ordinateur', 'navigateur'],
      answer: '📱 Neexup est une <b>application web</b> — aucune installation requise.\n\nFonctionne sur :\n• Téléphone (iOS & Android)\n• Tablette\n• Ordinateur (PC & Mac)\n\nOuvrez simplement votre navigateur et connectez-vous.'
    },
    {
      keys: ['boutique', 'magasin', 'commerce', 'epicerie', 'épicerie', 'restaurant', 'cafe', 'café', 'boulangerie', 'salon', 'type'],
      answer: '🏪 Neexup convient à tous types de commerces :\n\n• Épiceries & supérettes\n• Restaurants & cafés\n• Boutiques mode & accessoires\n• Boulangeries & pâtisseries\n• Salons de coiffure & beauté\n• Et bien d\'autres !\n\nSi vous avez des produits à vendre, Neexup est fait pour vous.'
    },
    {
      keys: ['parrainage', 'parrain', 'filleul', 'recommander', 'recommandation', 'code parrainage', 'ami', 'referral'],
      answer: '🎁 Programme de parrainage :\n\nRecommandez Neexup à un autre commerçant et :\n• Vous gagnez <b>1 mois offert</b>\n• Votre filleul bénéficie de <b>-10%</b> sur son premier abonnement Pro\n\nVotre code de parrainage est disponible dans votre espace → section Parrainage.'
    },
    {
      keys: ['resiliation', 'résilier', 'résilier', 'annuler', 'annulation', 'quitter', 'arreter', 'arrêter', 'supprimer', 'fermer compte'],
      answer: '📋 Résiliation sans engagement :\n\n• Aucun engagement de durée\n• Annulation possible à tout moment\n• Vos données restent accessibles jusqu\'à la fin de la période payée\n• Pour résilier, contactez <a href="mailto:support@neexup.com" style="color:#00d4ff">support@neexup.com</a>'
    }
  ];

  var FALLBACK = '🤔 Je n\'ai pas bien compris votre question.\n\nVoici ce que je peux vous aider :\n• Prix et abonnements\n• Fonctionnalités (caisse, stock, rapports...)\n• Inscription et essai gratuit\n• Support et contact\n\nOu écrivez-nous : <a href="mailto:support@neexup.com" style="color:#00d4ff">support@neexup.com</a>';
  var WELCOME = 'Bonjour 👋 Je suis l\'assistant Neexup.\n\nPosez-moi n\'importe quelle question sur la plateforme — prix, fonctionnalités, inscription, support...';

  // ── STYLES ────────────────────────────────────────────────────────
  var css = `
    #nx-chat-btn {
      position: fixed; bottom: 24px; right: 24px; z-index: 9000;
      width: 56px; height: 56px; border-radius: 50%;
      background: linear-gradient(135deg, #0066ff, #00d4ff);
      border: none; cursor: pointer; box-shadow: 0 4px 20px rgba(0,102,255,0.4);
      display: flex; align-items: center; justify-content: center;
      transition: transform 0.2s, box-shadow 0.2s;
      font-size: 1.4rem;
    }
    #nx-chat-btn:hover { transform: scale(1.08); box-shadow: 0 6px 30px rgba(0,102,255,0.55); }
    #nx-chat-btn .nx-notif {
      position: absolute; top: -2px; right: -2px;
      width: 14px; height: 14px; border-radius: 50%;
      background: #ff4d6a; border: 2px solid #060910;
    }
    #nx-chat-win {
      position: fixed; bottom: 90px; right: 24px; z-index: 9000;
      width: 360px; max-height: 520px;
      background: #0a0e1a; border: 1px solid rgba(255,255,255,0.08);
      border-radius: 20px; display: flex; flex-direction: column;
      box-shadow: 0 20px 60px rgba(0,0,0,0.6);
      transform: scale(0.95) translateY(10px); opacity: 0;
      transition: transform 0.25s ease, opacity 0.25s ease;
      pointer-events: none;
    }
    #nx-chat-win.open { transform: scale(1) translateY(0); opacity: 1; pointer-events: all; }
    .nx-head {
      padding: 1rem 1.25rem; border-bottom: 1px solid rgba(255,255,255,0.07);
      display: flex; align-items: center; gap: 10px; border-radius: 20px 20px 0 0;
      background: linear-gradient(135deg, rgba(0,102,255,0.15), rgba(0,212,255,0.05));
    }
    .nx-av {
      width: 38px; height: 38px; border-radius: 50%; flex-shrink: 0;
      background: linear-gradient(135deg, #0066ff, #00d4ff);
      display: flex; align-items: center; justify-content: center;
      font-weight: 900; font-size: 0.78rem; color: white; letter-spacing: -0.02em;
    }
    .nx-head-info { flex: 1; }
    .nx-head-name { font-size: 0.9rem; font-weight: 700; color: #eef2ff; }
    .nx-head-status { font-size: 0.72rem; color: #00d4a0; display: flex; align-items: center; gap: 4px; margin-top: 1px; }
    .nx-head-status::before { content: ''; width: 6px; height: 6px; border-radius: 50%; background: #00d4a0; }
    .nx-close {
      width: 28px; height: 28px; border-radius: 8px; background: rgba(255,255,255,0.06);
      border: none; color: #64748b; cursor: pointer; font-size: 1rem;
      display: flex; align-items: center; justify-content: center; transition: all 0.2s;
    }
    .nx-close:hover { background: rgba(255,255,255,0.1); color: #eef2ff; }
    .nx-msgs {
      flex: 1; overflow-y: auto; padding: 1rem; display: flex;
      flex-direction: column; gap: 0.75rem; min-height: 0;
      scrollbar-width: thin; scrollbar-color: rgba(255,255,255,0.08) transparent;
    }
    .nx-msgs::-webkit-scrollbar { width: 4px; }
    .nx-msgs::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }
    .nx-bubble {
      max-width: 88%; padding: 0.7rem 1rem; border-radius: 14px;
      font-size: 0.82rem; line-height: 1.6; font-family: Inter, sans-serif;
    }
    .nx-bubble.bot {
      background: #0f1525; border: 1px solid rgba(255,255,255,0.07);
      color: #cbd5e1; align-self: flex-start; border-radius: 4px 14px 14px 14px;
    }
    .nx-bubble.user {
      background: linear-gradient(135deg, #0066ff, #0052cc);
      color: white; align-self: flex-end; border-radius: 14px 14px 4px 14px;
    }
    .nx-bubble a { color: #00d4ff; text-decoration: none; }
    .nx-bubble a:hover { text-decoration: underline; }
    .nx-typing {
      display: flex; gap: 4px; align-items: center;
      padding: 0.7rem 1rem; background: #0f1525;
      border: 1px solid rgba(255,255,255,0.07);
      border-radius: 4px 14px 14px 14px;
      align-self: flex-start; width: fit-content;
    }
    .nx-typing span {
      width: 6px; height: 6px; border-radius: 50%;
      background: #7a8399; animation: nx-bounce 1.2s infinite;
    }
    .nx-typing span:nth-child(2) { animation-delay: 0.2s; }
    .nx-typing span:nth-child(3) { animation-delay: 0.4s; }
    @keyframes nx-bounce { 0%,60%,100% { transform: translateY(0); } 30% { transform: translateY(-5px); } }
    .nx-footer {
      padding: 0.75rem 1rem; border-top: 1px solid rgba(255,255,255,0.07);
      display: flex; gap: 0.5rem; border-radius: 0 0 20px 20px;
    }
    #nx-input {
      flex: 1; padding: 10px 14px; background: #0f1525;
      border: 1px solid rgba(255,255,255,0.08); border-radius: 10px;
      color: #eef2ff; font-size: 0.82rem; font-family: Inter, sans-serif;
      outline: none; transition: border-color 0.2s;
    }
    #nx-input:focus { border-color: rgba(0,102,255,0.5); }
    #nx-input::placeholder { color: #3d4560; }
    #nx-send {
      width: 38px; height: 38px; border-radius: 10px; flex-shrink: 0;
      background: linear-gradient(135deg, #0066ff, #00d4ff);
      border: none; cursor: pointer; display: flex;
      align-items: center; justify-content: center;
      transition: transform 0.2s; font-size: 1rem;
    }
    #nx-send:hover { transform: scale(1.05); }
    @media (max-width: 400px) {
      #nx-chat-win { width: calc(100vw - 32px); right: 16px; bottom: 80px; }
      #nx-chat-btn { right: 16px; bottom: 16px; }
    }
  `;

  // ── INJECT HTML ───────────────────────────────────────────────────
  var styleEl = document.createElement('style');
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  var btn = document.createElement('button');
  btn.id = 'nx-chat-btn';
  btn.innerHTML = '<span>💬</span><div class="nx-notif"></div>';
  btn.title = 'Chat avec Neexup';
  document.body.appendChild(btn);

  var win = document.createElement('div');
  win.id = 'nx-chat-win';
  win.innerHTML = `
    <div class="nx-head">
      <div class="nx-av">NX</div>
      <div class="nx-head-info">
        <div class="nx-head-name">Neexup Support</div>
        <div class="nx-head-status">En ligne</div>
      </div>
      <button class="nx-close" id="nx-close">✕</button>
    </div>
    <div class="nx-msgs" id="nx-msgs"></div>
    <div class="nx-footer">
      <input type="text" id="nx-input" placeholder="Posez votre question..."/>
      <button id="nx-send">➤</button>
    </div>
  `;
  document.body.appendChild(win);

  // ── LOGIQUE ───────────────────────────────────────────────────────
  var isOpen = false;
  var msgs = document.getElementById('nx-msgs');
  var input = document.getElementById('nx-input');
  var hasOpened = false;

  function toggle() {
    isOpen = !isOpen;
    win.classList.toggle('open', isOpen);
    if (isOpen) {
      // Supprime le point rouge
      var notif = btn.querySelector('.nx-notif');
      if (notif) notif.style.display = 'none';
      // Message de bienvenue (1 seule fois)
      if (!hasOpened) {
        hasOpened = true;
        addBotMsg(WELCOME);
      }
      setTimeout(function () { input.focus(); }, 200);
    }
  }

  btn.onclick = toggle;
  document.getElementById('nx-close').onclick = toggle;

  document.getElementById('nx-send').onclick = send;
  input.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') send();
  });

  function send() {
    var text = input.value.trim();
    if (!text) return;
    input.value = '';
    addUserMsg(text);
    showTyping();
    setTimeout(function () {
      removeTyping();
      addBotMsg(findAnswer(text));
    }, 900 + Math.random() * 400);
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
    // Convertir les \n en <br>
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
  function removeTyping() {
    if (typingEl) { typingEl.remove(); typingEl = null; }
  }

  function scroll() {
    msgs.scrollTop = msgs.scrollHeight;
  }

  function normalize(str) {
    return str.toLowerCase()
      .normalize('NFD').replace(/[̀-ͯ]/g, '') // enlève accents
      .replace(/[^a-z0-9\s]/g, ' ');
  }

  function findAnswer(question) {
    var q = normalize(question);
    var words = q.split(/\s+/).filter(Boolean);
    var bestScore = 0;
    var bestAnswer = FALLBACK;
    QA.forEach(function (item) {
      var score = 0;
      item.keys.forEach(function (k) {
        var kn = normalize(k);
        if (q.includes(kn)) score += 2;
        else words.forEach(function (w) { if (kn.includes(w) && w.length > 3) score += 1; });
      });
      if (score > bestScore) { bestScore = score; bestAnswer = item.answer; }
    });
    return bestScore >= 1 ? bestAnswer : FALLBACK;
  }
})();
