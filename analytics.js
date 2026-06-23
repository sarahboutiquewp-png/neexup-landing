(function () {
  'use strict';

  function track(eventName, params) {
    if (typeof gtag !== 'function') return;
    gtag('event', eventName, params || {});
  }

  // ── PAGE VIEW enrichi ────────────────────────────────────────────
  track('page_view_custom', {
    page_title: document.title,
    page_path: window.location.pathname,
    referrer: document.referrer || 'direct'
  });

  // ── CLICS CTA ────────────────────────────────────────────────────
  document.addEventListener('click', function (e) {
    var el = e.target.closest('a, button');
    if (!el) return;

    var href = el.getAttribute('href') || '';
    var text = (el.textContent || '').trim().slice(0, 60);
    var cls = el.className || '';

    // Bouton hero principal
    if (cls.includes('btn-primary-hero')) {
      track('cta_click', { cta_location: 'hero', cta_text: text });
    }
    // Bouton nav S'inscrire
    else if (cls.includes('btn-signup')) {
      track('cta_click', { cta_location: 'nav', cta_text: text });
    }
    // Boutons pricing
    else if (cls.includes('btn-price-pro')) {
      var plan = el.closest('[data-plan]') ? el.closest('[data-plan]').dataset.plan : 'pro';
      track('cta_click', { cta_location: 'pricing', cta_text: text, plan: plan });
    }
    else if (cls.includes('btn-price-free')) {
      track('cta_click', { cta_location: 'pricing_starter', cta_text: text });
    }
    // Exit intent CTA
    else if (el.id === 'nx-exit-cta' || (href.includes('login') && el.closest('#nx-exit-modal'))) {
      track('exit_intent_converted');
    }
    // Chatbot ouverture
    else if (el.id === 'nx-chat-btn') {
      track('chatbot_opened');
    }
    // Install PWA
    else if (el.id === 'nx-inst-ok') {
      track('pwa_install_accepted');
    }
    // Tous les liens vers login.html
    else if (href.includes('login')) {
      track('cta_click', { cta_location: 'other', cta_text: text });
    }
    // Liens contact
    else if (href.includes('contact')) {
      track('contact_click', { cta_text: text });
    }
  });

  // ── SCROLL DEPTH ─────────────────────────────────────────────────
  var scrollMilestones = { 25: false, 50: false, 75: false, 90: false };
  window.addEventListener('scroll', function () {
    var scrolled = window.scrollY + window.innerHeight;
    var total = document.documentElement.scrollHeight;
    var pct = Math.round((scrolled / total) * 100);
    [25, 50, 75, 90].forEach(function (m) {
      if (!scrollMilestones[m] && pct >= m) {
        scrollMilestones[m] = true;
        track('scroll_depth', { depth: m + '%' });
      }
    });
  }, { passive: true });

  // ── TEMPS SUR LA PAGE ────────────────────────────────────────────
  var timeMarks = { 30: false, 60: false, 120: false };
  var startTime = Date.now();
  setInterval(function () {
    var elapsed = Math.round((Date.now() - startTime) / 1000);
    [30, 60, 120].forEach(function (s) {
      if (!timeMarks[s] && elapsed >= s) {
        timeMarks[s] = true;
        track('time_on_page', { seconds: s });
      }
    });
  }, 5000);

  // ── SORTIE DE PAGE ───────────────────────────────────────────────
  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'hidden') {
      var elapsed = Math.round((Date.now() - startTime) / 1000);
      track('page_exit', { time_spent_seconds: elapsed });
    }
  });

})();
