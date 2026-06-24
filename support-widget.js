(function () {
  'use strict';

  var SB_URL, SB_KEY, _userId, _storeId, _userName, _userEmail;

  // Récupère les infos depuis config.js (déjà chargé)
  if (typeof SUPABASE_URL !== 'undefined') SB_URL = SUPABASE_URL;
  if (typeof SUPABASE_ANON_KEY !== 'undefined') SB_KEY = SUPABASE_ANON_KEY;

  // ── STYLES ────────────────────────────────────────────────────────
  var css = [
    '#nx-support-btn{position:fixed;bottom:24px;left:24px;z-index:4000;',
    'width:46px;height:46px;border-radius:50%;border:none;cursor:pointer;',
    'background:linear-gradient(135deg,#0066ff,#00d4ff);',
    'color:white;font-size:1.2rem;display:flex;align-items:center;justify-content:center;',
    'box-shadow:0 4px 20px rgba(0,102,255,0.4);transition:transform 0.2s;}',
    '#nx-support-btn:hover{transform:scale(1.1);}',

    '#nx-support-overlay{display:none;position:fixed;inset:0;background:rgba(0,0,0,0.7);',
    'backdrop-filter:blur(6px);z-index:4001;align-items:center;justify-content:center;}',
    '#nx-support-overlay.open{display:flex;}',

    '#nx-support-modal{background:#0a0e1a;border:1px solid rgba(255,255,255,0.08);',
    'border-radius:20px;padding:2rem;width:100%;max-width:480px;margin:1rem;',
    'box-shadow:0 20px 60px rgba(0,0,0,0.6);}',

    '.nx-s-title{font-size:1.1rem;font-weight:800;color:#eef2ff;margin-bottom:4px;}',
    '.nx-s-sub{font-size:0.82rem;color:#7a8399;margin-bottom:1.5rem;}',
    '.nx-s-label{font-size:0.75rem;font-weight:700;color:#7a8399;text-transform:uppercase;',
    'letter-spacing:0.06em;margin-bottom:6px;display:block;}',
    '.nx-s-field{margin-bottom:1rem;}',
    '.nx-s-input,.nx-s-select,.nx-s-textarea{width:100%;padding:10px 14px;',
    'background:#0f1525;border:1px solid rgba(255,255,255,0.07);border-radius:10px;',
    'color:#eef2ff;font-size:0.875rem;font-family:Inter,sans-serif;outline:none;',
    'transition:border-color 0.2s;box-sizing:border-box;}',
    '.nx-s-input:focus,.nx-s-select:focus,.nx-s-textarea:focus{border-color:#0066ff;}',
    '.nx-s-textarea{resize:vertical;min-height:100px;}',
    '.nx-s-select option{background:#0f1525;}',
    '.nx-s-row{display:flex;gap:0.75rem;}',
    '.nx-s-row .nx-s-field{flex:1;}',
    '.nx-s-footer{display:flex;gap:0.75rem;margin-top:1.5rem;}',
    '.nx-s-btn-send{flex:1;padding:12px;border-radius:10px;border:none;cursor:pointer;',
    'background:linear-gradient(135deg,#0066ff,#00d4ff);color:white;',
    'font-size:0.875rem;font-weight:700;font-family:Inter,sans-serif;}',
    '.nx-s-btn-send:disabled{opacity:0.5;cursor:not-allowed;}',
    '.nx-s-btn-cancel{padding:12px 20px;border-radius:10px;border:1px solid rgba(255,255,255,0.08);',
    'background:none;color:#7a8399;font-size:0.875rem;font-weight:600;',
    'cursor:pointer;font-family:Inter,sans-serif;}',
    '.nx-s-success{background:rgba(0,212,160,0.1);border:1px solid rgba(0,212,160,0.2);',
    'border-radius:10px;padding:1rem;text-align:center;color:#00d4a0;',
    'font-size:0.875rem;font-weight:600;display:none;}'
  ].join('');

  var st = document.createElement('style');
  st.textContent = css;
  document.head.appendChild(st);

  // ── HTML ──────────────────────────────────────────────────────────
  var btn = document.createElement('button');
  btn.id = 'nx-support-btn';
  btn.title = 'Contacter le support';
  btn.innerHTML = '?';
  document.body.appendChild(btn);

  var overlay = document.createElement('div');
  overlay.id = 'nx-support-overlay';
  overlay.innerHTML = [
    '<div id="nx-support-modal">',
    '  <div class="nx-s-title">Contacter le support</div>',
    '  <div class="nx-s-sub">Decrivez votre probleme, nous vous repondons sous 24h.</div>',
    '  <div class="nx-s-row">',
    '    <div class="nx-s-field">',
    '      <label class="nx-s-label">Priorite</label>',
    '      <select class="nx-s-select" id="nx-s-priority">',
    '        <option value="normal">Normale</option>',
    '        <option value="high">Urgente</option>',
    '        <option value="low">Basse</option>',
    '      </select>',
    '    </div>',
    '    <div class="nx-s-field">',
    '      <label class="nx-s-label">Type</label>',
    '      <select class="nx-s-select" id="nx-s-type">',
    '        <option value="bug">Bug / Erreur</option>',
    '        <option value="question">Question</option>',
    '        <option value="feature">Suggestion</option>',
    '        <option value="autre">Autre</option>',
    '      </select>',
    '    </div>',
    '  </div>',
    '  <div class="nx-s-field">',
    '    <label class="nx-s-label">Sujet</label>',
    '    <input class="nx-s-input" id="nx-s-subject" type="text" placeholder="Ex: La caisse ne s\'ouvre plus"/>',
    '  </div>',
    '  <div class="nx-s-field">',
    '    <label class="nx-s-label">Description</label>',
    '    <textarea class="nx-s-textarea" id="nx-s-desc" placeholder="Decrivez le probleme en detail. Sur quelle page ? Que se passe-t-il exactement ?"></textarea>',
    '  </div>',
    '  <div class="nx-s-success" id="nx-s-ok">',
    '    Ticket envoye ! Notre equipe vous contactera tres vite.',
    '  </div>',
    '  <div class="nx-s-footer">',
    '    <button class="nx-s-btn-cancel" id="nx-s-cancel">Annuler</button>',
    '    <button class="nx-s-btn-send" id="nx-s-send">Envoyer le ticket</button>',
    '  </div>',
    '</div>'
  ].join('');
  document.body.appendChild(overlay);

  // ── EVENTS ────────────────────────────────────────────────────────
  btn.onclick = function () { open(); };
  document.getElementById('nx-s-cancel').onclick = function () { close(); };
  overlay.addEventListener('click', function (e) { if (e.target === overlay) close(); });
  document.getElementById('nx-s-send').onclick = function () { send(); };

  function open() {
    overlay.classList.add('open');
    document.getElementById('nx-s-ok').style.display = 'none';
    document.getElementById('nx-s-send').disabled = false;
    document.getElementById('nx-s-send').textContent = 'Envoyer le ticket';
  }
  function close() { overlay.classList.remove('open'); }

  // ── INIT SESSION ──────────────────────────────────────────────────
  // Attendre que la page charge les infos utilisateur
  document.addEventListener('nx:user-ready', function (e) {
    _userId = e.detail.userId;
    _storeId = e.detail.storeId;
    _userName = e.detail.userName;
    _userEmail = e.detail.userEmail;
  });

  // Fallback : lire depuis les éléments DOM communs
  function getUserInfo() {
    if (!_userName) {
      var nameEl = document.getElementById('user-name');
      _userName = nameEl ? nameEl.textContent : 'Inconnu';
    }
    if (!_userEmail) {
      var roleEl = document.getElementById('user-role');
      _userEmail = roleEl ? roleEl.textContent : '';
    }
  }

  // ── SEND ──────────────────────────────────────────────────────────
  async function send() {
    var subject = document.getElementById('nx-s-subject').value.trim();
    var desc = document.getElementById('nx-s-desc').value.trim();
    var priority = document.getElementById('nx-s-priority').value;
    var type = document.getElementById('nx-s-type').value;

    if (!subject || !desc) {
      alert('Veuillez remplir le sujet et la description.');
      return;
    }

    getUserInfo();

    var sendBtn = document.getElementById('nx-s-send');
    sendBtn.disabled = true;
    sendBtn.textContent = 'Envoi...';

    var page = window.location.pathname.split('/').pop() || 'inconnue';

    try {
      // Use authenticated session token if available (required for RLS)
      var token = SB_KEY;
      if (window.sb) {
        var sessionRes = await window.sb.auth.getSession();
        if (sessionRes.data && sessionRes.data.session) {
          token = sessionRes.data.session.access_token;
          if (!_userId) _userId = sessionRes.data.session.user.id;
        }
      }
      var res = await fetch(SB_URL + '/rest/v1/support_tickets', {
        method: 'POST',
        headers: {
          'apikey': SB_KEY,
          'Authorization': 'Bearer ' + token,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({
          merchant_id: _userId || null,
          store_id: _storeId || null,
          merchant_name: _userName || 'Inconnu',
          merchant_email: _userEmail || '',
          subject: subject,
          description: desc,
          priority: priority,
          ticket_type: type,
          page_url: page,
          status: 'open'
        })
      });

      if (res.ok || res.status === 201) {
        document.getElementById('nx-s-ok').style.display = 'block';
        document.getElementById('nx-s-subject').value = '';
        document.getElementById('nx-s-desc').value = '';
        sendBtn.textContent = 'Envoye !';
        setTimeout(function () { close(); }, 2500);
      } else {
        throw new Error('status ' + res.status);
      }
    } catch (err) {
      sendBtn.disabled = false;
      sendBtn.textContent = 'Envoyer le ticket';
      alert('Erreur lors de l\'envoi. Veuillez reessayer.');
    }
  }
})();
