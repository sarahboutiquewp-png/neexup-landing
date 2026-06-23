(function () {
  'use strict';

  var KEY_DISMISSED = 'nx_install_dismissed';
  var KEY_INSTALLED = 'nx_installed';
  var deferredPrompt = null;
  var banner = null;

  // Ne pas afficher si déjà installé ou refusé récemment
  if (localStorage.getItem(KEY_INSTALLED)) return;
  var dismissedAt = localStorage.getItem(KEY_DISMISSED);
  if (dismissedAt && Date.now() - parseInt(dismissedAt) < 3 * 24 * 60 * 60 * 1000) return;

  function isIOS() {
    return /iphone|ipad|ipod/i.test(navigator.userAgent) && !window.MSStream;
  }
  function isInStandaloneMode() {
    return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
  }

  if (isInStandaloneMode()) return;

  // ── STYLES ───────────────────────────────────────────────────────
  var css = `
    #nx-install-banner {
      position: fixed; bottom: 0; left: 0; right: 0; z-index: 8500;
      background: #0a0e1a; border-top: 1px solid rgba(0,102,255,0.3);
      padding: 14px 20px; display: flex; align-items: center; gap: 14px;
      box-shadow: 0 -8px 40px rgba(0,0,0,0.5);
      transform: translateY(100%); transition: transform 0.4s cubic-bezier(0.34,1.56,0.64,1);
      font-family: Inter, sans-serif;
    }
    #nx-install-banner.visible { transform: translateY(0); }
    .nx-inst-icon {
      width: 48px; height: 48px; border-radius: 12px; flex-shrink: 0;
      background: linear-gradient(135deg, #0066ff, #00d4ff);
      display: flex; align-items: center; justify-content: center;
      font-weight: 900; font-size: 1.1rem; color: white; letter-spacing: -0.03em;
    }
    .nx-inst-text { flex: 1; min-width: 0; }
    .nx-inst-title { font-size: 0.9rem; font-weight: 700; color: #eef2ff; }
    .nx-inst-sub { font-size: 0.75rem; color: #7a8399; margin-top: 2px; }
    .nx-inst-btn {
      padding: 10px 18px; border-radius: 10px; border: none; cursor: pointer;
      font-size: 0.82rem; font-weight: 700; font-family: Inter, sans-serif;
      background: linear-gradient(135deg, #ff6b35, #ff9500);
      color: white; white-space: nowrap; flex-shrink: 0;
      box-shadow: 0 0 20px rgba(255,107,53,0.35); transition: transform 0.2s;
    }
    .nx-inst-btn:hover { transform: scale(1.04); }
    .nx-inst-close {
      width: 28px; height: 28px; border-radius: 8px; flex-shrink: 0;
      background: rgba(255,255,255,0.05); border: none; color: #64748b;
      cursor: pointer; font-size: 1rem; display: flex;
      align-items: center; justify-content: center; transition: all 0.2s;
    }
    .nx-inst-close:hover { background: rgba(255,255,255,0.1); color: #eef2ff; }

    /* iOS popup spécial */
    #nx-ios-popup {
      position: fixed; bottom: 0; left: 0; right: 0; z-index: 8500;
      background: #0a0e1a; border-top: 1px solid rgba(0,102,255,0.3);
      padding: 20px; box-shadow: 0 -8px 40px rgba(0,0,0,0.5);
      font-family: Inter, sans-serif;
      transform: translateY(100%); transition: transform 0.4s cubic-bezier(0.34,1.56,0.64,1);
    }
    #nx-ios-popup.visible { transform: translateY(0); }
    .nx-ios-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
    .nx-ios-title { font-size: 0.9rem; font-weight: 700; color: #eef2ff; }
    .nx-ios-close {
      width: 28px; height: 28px; border-radius: 8px;
      background: rgba(255,255,255,0.05); border: none; color: #64748b;
      cursor: pointer; font-size: 1rem; display: flex;
      align-items: center; justify-content: center;
    }
    .nx-ios-steps { display: flex; flex-direction: column; gap: 8px; }
    .nx-ios-step { display: flex; align-items: center; gap: 10px; font-size: 0.82rem; color: #cbd5e1; }
    .nx-ios-num {
      width: 24px; height: 24px; border-radius: 50%; flex-shrink: 0;
      background: rgba(0,102,255,0.2); border: 1px solid rgba(0,102,255,0.4);
      display: flex; align-items: center; justify-content: center;
      font-size: 0.72rem; font-weight: 700; color: #60a5fa;
    }
    .nx-ios-arrow {
      text-align: center; margin-bottom: 12px;
      font-size: 0.75rem; color: #7a8399; font-style: italic;
    }
  `;

  var styleEl = document.createElement('style');
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  // ── ANDROID / CHROME ─────────────────────────────────────────────
  window.addEventListener('beforeinstallprompt', function (e) {
    e.preventDefault();
    deferredPrompt = e;
    // Afficher après 12 secondes
    setTimeout(showAndroidBanner, 12000);
  });

  window.addEventListener('appinstalled', function () {
    localStorage.setItem(KEY_INSTALLED, '1');
    if (banner) banner.style.transform = 'translateY(100%)';
  });

  function showAndroidBanner() {
    if (!deferredPrompt) return;
    banner = document.createElement('div');
    banner.id = 'nx-install-banner';
    banner.innerHTML = `
      <div class="nx-inst-icon">N</div>
      <div class="nx-inst-text">
        <div class="nx-inst-title">Installer Neexup</div>
        <div class="nx-inst-sub">Accès rapide depuis votre écran d'accueil</div>
      </div>
      <button class="nx-inst-btn" id="nx-inst-ok">Installer</button>
      <button class="nx-inst-close" id="nx-inst-no">✕</button>
    `;
    document.body.appendChild(banner);
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { banner.classList.add('visible'); });
    });

    document.getElementById('nx-inst-ok').onclick = function () {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then(function (choice) {
        if (choice.outcome === 'accepted') localStorage.setItem(KEY_INSTALLED, '1');
        else localStorage.setItem(KEY_DISMISSED, Date.now().toString());
        banner.style.transform = 'translateY(100%)';
        deferredPrompt = null;
      });
    };
    document.getElementById('nx-inst-no').onclick = function () {
      localStorage.setItem(KEY_DISMISSED, Date.now().toString());
      banner.style.transform = 'translateY(100%)';
    };
  }

  // ── iOS / SAFARI ──────────────────────────────────────────────────
  if (isIOS()) {
    setTimeout(function () {
      var popup = document.createElement('div');
      popup.id = 'nx-ios-popup';
      popup.innerHTML = `
        <div class="nx-ios-header">
          <div class="nx-ios-title">📱 Installer Neexup sur votre iPhone</div>
          <button class="nx-ios-close" id="nx-ios-close">✕</button>
        </div>
        <div class="nx-ios-steps">
          <div class="nx-ios-step"><div class="nx-ios-num">1</div>Appuyez sur le bouton <b style="color:#60a5fa">Partager</b> ⬆️ en bas de Safari</div>
          <div class="nx-ios-step"><div class="nx-ios-num">2</div>Faites défiler et appuyez sur <b style="color:#60a5fa">Sur l'écran d'accueil</b> ＋</div>
          <div class="nx-ios-step"><div class="nx-ios-num">3</div>Appuyez sur <b style="color:#60a5fa">Ajouter</b> — c'est tout !</div>
        </div>
        <div class="nx-ios-arrow" style="margin-top:12px">▼ Le bouton Partager est en bas de votre écran</div>
      `;
      document.body.appendChild(popup);
      requestAnimationFrame(function () {
        requestAnimationFrame(function () { popup.classList.add('visible'); });
      });
      document.getElementById('nx-ios-close').onclick = function () {
        localStorage.setItem(KEY_DISMISSED, Date.now().toString());
        popup.style.transform = 'translateY(100%)';
      };
    }, 15000);
  }
})();
