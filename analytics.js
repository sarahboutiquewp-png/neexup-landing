(function () {
  'use strict';

  var SB_URL = 'https://xcawbucpypkhdqdyvjpt.supabase.co';
  var SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhjYXdidWNweXBraGRxZHl2anB0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE1MzI4MjEsImV4cCI6MjA5NzEwODgyMX0.jdPDV380N6evZYTmg2zeC7XoYKVnCKSpMAyhMepmfYg';

  function trackSB(eventType, meta) {
    fetch(SB_URL + '/rest/v1/analytics_events', {
      method: 'POST',
      headers: {
        'apikey': SB_KEY,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({
        event_type: eventType,
        page: window.location.pathname,
        meta: meta || null
      })
    }).catch(function() {});
  }

  function track(eventName, params) {
    if (typeof gtag === 'function') gtag('event', eventName, params || {});
    trackSB(eventName, params ? JSON.stringify(params) : null);
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

  // ── PRICING SECTION VU ──────────────────────────────────────────
  var pricingTracked = false;
  var pricingEl = document.getElementById('pricing');
  if (pricingEl && 'IntersectionObserver' in window) {
    new IntersectionObserver(function(entries) {
      if (!pricingTracked && entries[0].isIntersecting) {
        pricingTracked = true;
        track('pricing_view', { page: window.location.pathname });
      }
    }, { threshold: 0.2 }).observe(pricingEl);
  }

  // ── VIDEO DEMO ──────────────────────────────────────────────────
  var videoEl = document.querySelector('video');
  if (videoEl) {
    var videoPlayed = false;
    videoEl.addEventListener('play', function() {
      if (!videoPlayed) {
        videoPlayed = true;
        track('video_play', { video: 'demo' });
      }
    });
    videoEl.addEventListener('ended', function() {
      track('video_complete', { video: 'demo' });
    });
  }

  // ── TOGGLE ANNUEL ───────────────────────────────────────────────
  var billingToggle = document.getElementById('billing-toggle');
  if (billingToggle) {
    billingToggle.addEventListener('change', function() {
      track('billing_toggle', { billing: this.checked ? 'annual' : 'monthly' });
    });
  }

  // ── STRIPE PURCHASE INTENT ──────────────────────────────────────
  document.addEventListener('click', function(e) {
    var el = e.target.closest('a');
    if (!el) return;
    var href = el.getAttribute('href') || '';
    if (href.includes('buy.stripe.com')) {
      var plan = el.id === 'btn-stripe' ? (document.getElementById('modal-plan') ? document.getElementById('modal-plan').textContent : 'unknown') : 'unknown';
      track('purchase_intent', { destination: 'stripe', href: href.slice(0, 60) });
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
