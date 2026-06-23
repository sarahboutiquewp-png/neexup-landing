(function () {
  'use strict';

  var KEY = 'nx_exit_seen';
  if (sessionStorage.getItem(KEY)) return;

  var shown = false;
  var readyAt = Date.now() + 10000; // attendre 10s avant de pouvoir déclencher

  var css = `
    #nx-exit-overlay {
      position: fixed; inset: 0; z-index: 9999;
      background: rgba(6,9,16,0.85); backdrop-filter: blur(6px);
      display: flex; align-items: center; justify-content: center;
      padding: 1rem; opacity: 0; pointer-events: none;
      transition: opacity 0.3s ease;
      font-family: Inter, sans-serif;
    }
    #nx-exit-overlay.open { opacity: 1; pointer-events: all; }
    #nx-exit-modal {
      background: #0a0e1a; border: 1px solid rgba(0,102,255,0.3);
      border-radius: 24px; padding: 2.5rem 2rem; max-width: 480px; width: 100%;
      text-align: center; position: relative;
      box-shadow: 0 0 80px rgba(0,102,255,0.2);
      transform: scale(0.92); transition: transform 0.3s ease;
    }
    #nx-exit-overlay.open #nx-exit-modal { transform: scale(1); }
    .nx-exit-emoji { font-size: 3rem; margin-bottom: 1rem; display: block; }
    .nx-exit-title {
      font-size: 1.5rem; font-weight: 900; letter-spacing: -0.03em;
      margin-bottom: 0.6rem; color: #eef2ff;
    }
    .nx-exit-title span {
      background: linear-gradient(135deg, #0066ff, #00d4ff);
      -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    }
    .nx-exit-sub {
      font-size: 0.9rem; color: #7a8399; line-height: 1.6; margin-bottom: 1.75rem;
    }
    .nx-exit-perks {
      display: flex; justify-content: center; gap: 1.5rem;
      margin-bottom: 1.75rem; flex-wrap: wrap;
    }
    .nx-exit-perk { font-size: 0.8rem; color: #94a3b8; display: flex; align-items: center; gap: 5px; }
    .nx-exit-perk::before { content: '✓'; color: #00d4a0; font-weight: 700; }
    .nx-exit-cta {
      display: block; width: 100%; padding: 16px;
      background: linear-gradient(135deg, #ff6b35, #ff9500);
      color: white; border: none; border-radius: 14px;
      font-size: 1rem; font-weight: 700; cursor: pointer;
      font-family: Inter, sans-serif;
      box-shadow: 0 0 30px rgba(255,107,53,0.4);
      text-decoration: none; transition: transform 0.2s, box-shadow 0.2s;
      margin-bottom: 0.875rem;
    }
    .nx-exit-cta:hover { transform: translateY(-2px); box-shadow: 0 0 50px rgba(255,107,53,0.5); }
    .nx-exit-skip {
      background: none; border: none; color: #3d4560;
      font-size: 0.8rem; cursor: pointer; font-family: Inter, sans-serif;
      transition: color 0.2s;
    }
    .nx-exit-skip:hover { color: #7a8399; }
    .nx-exit-close {
      position: absolute; top: 14px; right: 14px;
      width: 30px; height: 30px; border-radius: 8px;
      background: rgba(255,255,255,0.05); border: none;
      color: #64748b; cursor: pointer; font-size: 1rem;
      display: flex; align-items: center; justify-content: center;
      transition: all 0.2s;
    }
    .nx-exit-close:hover { background: rgba(255,255,255,0.1); color: #eef2ff; }
  `;

  var styleEl = document.createElement('style');
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  var overlay = document.createElement('div');
  overlay.id = 'nx-exit-overlay';
  overlay.innerHTML = `
    <div id="nx-exit-modal">
      <button class="nx-exit-close" id="nx-exit-close">✕</button>
      <span class="nx-exit-emoji">⚡</span>
      <div class="nx-exit-title">Attendez — <span>14 jours gratuits</span></div>
      <p class="nx-exit-sub">
        Avant de partir — essayez Neexup gratuitement pendant 14 jours.<br>
        Aucune carte bancaire requise.
      </p>
      <div class="nx-exit-perks">
        <span class="nx-exit-perk">Sans engagement</span>
        <span class="nx-exit-perk">Sans carte bancaire</span>
        <span class="nx-exit-perk">Accès complet</span>
      </div>
      <a href="login.html" class="nx-exit-cta">Commencer l'essai gratuit →</a>
      <button class="nx-exit-skip" id="nx-exit-skip">Non merci, je ne veux pas essayer</button>
    </div>
  `;
  document.body.appendChild(overlay);

  function show() {
    if (shown) return;
    shown = true;
    sessionStorage.setItem(KEY, '1');
    overlay.classList.add('open');
  }

  function hide() {
    overlay.classList.remove('open');
  }

  document.getElementById('nx-exit-close').onclick = hide;
  document.getElementById('nx-exit-skip').onclick = hide;
  overlay.onclick = function (e) { if (e.target === overlay) hide(); };

  // Desktop : souris qui sort par le haut
  document.addEventListener('mouseleave', function (e) {
    if (e.clientY <= 0 && Date.now() > readyAt) show();
  });

  // Mobile : bouton retour / changement de visibilité
  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'hidden' && Date.now() > readyAt) show();
  });

})();
