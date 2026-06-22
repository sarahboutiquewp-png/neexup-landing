document.addEventListener('DOMContentLoaded', function() {
  var sidebar = document.getElementById('app-sidebar');
  if (!sidebar) return;

  var page = window.location.pathname.split('/').pop() || 'dashboard.html';

  function item(href, icon, label) {
    var cls = 'nav-item' + (page === href ? ' active' : '');
    return '<a class="' + cls + '" href="' + href + '"><span class="icon">' + icon + '</span> ' + label + '</a>';
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
});
