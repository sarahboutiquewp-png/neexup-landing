(function() {
  var sidebar = document.getElementById('app-sidebar');
  if (!sidebar) return;

  var page = window.location.pathname.split('/').pop() || 'dashboard.html';

  function item(href, icon, label) {
    var cls = 'nav-item' + (page === href ? ' active' : '');
    return '<a class="' + cls + '" href="' + href + '" onclick="closeMobileNav()"><span class="icon">' + icon + '</span> ' + label + '</a>';
  }

  sidebar.innerHTML =
    '<a href="index.html" class="sidebar-logo">Neexup</a>' +
    '<div class="nav-section">' +
      '<div class="nav-label">Principal</div>' +
      item('dashboard.html', '📊', 'Dashboard') +
      item('caisse.html', '🛒', 'Caisse') +
      item('products.html', '📦', 'Produits') +
      item('categories.html', '🏷️', 'Catégories') +
      item('stocks.html', '🏪', 'Stocks') +
    '</div>' +
    '<div class="nav-section">' +
      '<div class="nav-label">Gestion</div>' +
      item('historique.html', '🧾', 'Historique') +
      item('remises.html', '💰', 'Remises') +
      item('rapports.html', '📈', 'Rapports') +
      item('employes.html', '👥', 'Employés') +
      item('boutiques.html', '🏬', 'Boutiques') +
    '</div>' +
    '<div class="nav-section">' +
      '<div class="nav-label">Compte</div>' +
      item('parrainage.html', '🎁', 'Parrainage') +
      item('settings.html', '⚙️', 'Paramètres') +
    '</div>' +
    '<div class="nav-section">' +
      '<button class="nav-item" onclick="document.getElementById(\'nx-support-btn\').click();closeMobileNav();" style="color:#7a8399"><span class="icon">🆘</span> Support</button>' +
    '</div>' +
    '<div class="sidebar-bottom">' +
      '<div class="user-card">' +
        '<div class="user-av" id="user-av">?</div>' +
        '<div style="min-width:0">' +
          '<div class="user-name" id="user-name">...</div>' +
          '<div class="user-role" id="user-role">...</div>' +
        '</div>' +
      '</div>' +
      '<button class="btn-logout" onclick="__logout()">🚪 Déconnexion</button>' +
    '</div>';

  // ── MOBILE HAMBURGER ──
  var btn = document.createElement('button');
  btn.id = 'mobile-menu-btn';
  btn.innerHTML = '☰';
  btn.onclick = function() { toggleMobileNav(); };
  document.body.appendChild(btn);

  // ── MOBILE BACKDROP ──
  var backdrop = document.createElement('div');
  backdrop.id = 'mobile-nav-backdrop';
  backdrop.onclick = function() { closeMobileNav(); };
  document.body.appendChild(backdrop);

  // ── MOBILE CSS ──
  var style = document.createElement('style');
  style.textContent =
    '#mobile-menu-btn{display:none;position:fixed;top:12px;left:12px;z-index:300;' +
    'background:var(--bg2,#0a0e1a);border:1px solid var(--border,rgba(255,255,255,0.07));' +
    'color:var(--text,#eef2ff);border-radius:10px;padding:9px 14px;font-size:1.25rem;' +
    'cursor:pointer;line-height:1;font-family:sans-serif;}' +
    '#mobile-nav-backdrop{display:none;position:fixed;inset:0;background:rgba(0,0,0,0.55);z-index:199;}' +
    '@media(max-width:768px){' +
      '#mobile-menu-btn{display:block!important;}' +
      '.sidebar{transform:translateX(-100%);transition:transform 0.27s ease;z-index:200!important;}' +
      '.sidebar.mobile-open{transform:translateX(0);}' +
      '#mobile-nav-backdrop.open{display:block;}' +
      '.main{margin-left:0!important;width:100%!important;}' +
      'main.main{margin-left:0!important;width:100%!important;}' +
    '}';
  document.head.appendChild(style);

  window.toggleMobileNav = function() {
    sidebar.classList.toggle('mobile-open');
    backdrop.classList.toggle('open');
  };
  window.closeMobileNav = function() {
    sidebar.classList.remove('mobile-open');
    backdrop.classList.remove('open');
  };
})();
