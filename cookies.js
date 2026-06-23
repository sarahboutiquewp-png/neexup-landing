(function () {
  var KEY = 'neexup_cookie_consent';
  var consent = localStorage.getItem(KEY);

  if (consent === 'accepted') {
    grantConsent();
    return;
  }
  if (consent === 'refused') return;

  // Inject styles
  var style = document.createElement('style');
  style.textContent = [
    '#nx-cookie{position:fixed;bottom:0;left:0;right:0;z-index:9999;background:#0a0e1a;border-top:1px solid rgba(255,255,255,0.08);padding:1rem 2rem;display:flex;align-items:center;justify-content:space-between;gap:1.5rem;flex-wrap:wrap;font-family:Inter,sans-serif;box-shadow:0 -4px 24px rgba(0,0,0,0.4);transition:transform 0.4s ease}',
    '#nx-cookie.hide{transform:translateY(110%)}',
    '#nx-cookie p{color:#94a3b8;font-size:0.82rem;margin:0;flex:1;min-width:200px}',
    '#nx-cookie p a{color:#00d4ff;text-decoration:none}',
    '#nx-cookie p a:hover{text-decoration:underline}',
    '#nx-cookie-btns{display:flex;gap:0.75rem;flex-shrink:0}',
    '#nx-cookie-accept{padding:9px 20px;background:linear-gradient(135deg,#0066ff,#00d4ff);color:#fff;border:none;border-radius:8px;font-size:0.82rem;font-weight:700;cursor:pointer;font-family:Inter,sans-serif;white-space:nowrap}',
    '#nx-cookie-refuse{padding:9px 16px;background:transparent;color:#64748b;border:1px solid rgba(255,255,255,0.08);border-radius:8px;font-size:0.82rem;font-weight:600;cursor:pointer;font-family:Inter,sans-serif;white-space:nowrap}',
    '#nx-cookie-refuse:hover{color:#94a3b8;border-color:rgba(255,255,255,0.15)}'
  ].join('');
  document.head.appendChild(style);

  // Inject HTML
  var banner = document.createElement('div');
  banner.id = 'nx-cookie';
  banner.innerHTML = '<p>🍪 Nous utilisons des cookies pour mesurer l\'audience et améliorer votre expérience (<a href="cgu.html">politique de confidentialité</a>).</p><div id="nx-cookie-btns"><button id="nx-cookie-refuse">Refuser</button><button id="nx-cookie-accept">Tout accepter</button></div>';
  document.body.appendChild(banner);

  document.getElementById('nx-cookie-accept').onclick = function () {
    localStorage.setItem(KEY, 'accepted');
    grantConsent();
    hideBanner();
  };
  document.getElementById('nx-cookie-refuse').onclick = function () {
    localStorage.setItem(KEY, 'refused');
    hideBanner();
  };

  function hideBanner() {
    var b = document.getElementById('nx-cookie');
    if (b) { b.classList.add('hide'); setTimeout(function () { b.remove(); }, 400); }
  }

  function grantConsent() {
    if (typeof gtag === 'function') {
      gtag('consent', 'update', { 'analytics_storage': 'granted', 'ad_storage': 'granted' });
    }
  }
})();
