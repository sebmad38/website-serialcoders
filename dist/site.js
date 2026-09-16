(() => {
  'use strict';
  const measurementId = window.SERIAL_CODERS_CONFIG?.googleAnalyticsId || '';
  const enabled = /^G-[A-Z0-9]+$/.test(measurementId);
  const storageKey = 'serialcoders.analytics-consent.v1';
  const lifetime = 180 * 24 * 60 * 60 * 1000;
  const banner = document.getElementById('consent');
  const settings = document.getElementById('cookie-settings');
  let granted = false;
  let loaded = false;
  let previousFocus;
  const readChoice = () => {
    try {
      const record = JSON.parse(localStorage.getItem(storageKey));
      return record && ['granted', 'denied'].includes(record.value) && record.expires > Date.now() ? record.value : null;
    } catch { return null; }
  };
  function command() {
    window.dataLayer ||= [];
    window.dataLayer.push(arguments);
  }
  const clearAnalyticsCookies = () => {
    const domains = location.hostname.split('.');
    const candidates = ['', ...domains.map((_, i) => domains.slice(i).join('.'))];
    document.cookie.split(';').forEach(cookie => {
      const name = cookie.trim().split('=')[0];
      if (name !== '_ga' && !name.startsWith('_ga_')) return;
      candidates.forEach(domain => {
        document.cookie = `${name}=; Max-Age=0; path=/;${domain ? ` domain=${domain};` : ''} SameSite=Lax`;
      });
    });
  };
  const applyChoice = choice => {
    granted = choice === 'granted';
    window[`ga-disable-${measurementId}`] = !granted;
    if (!granted) {
      if (loaded) command('consent', 'update', { analytics_storage: 'denied' });
      clearAnalyticsCookies();
      return;
    }
    if (loaded) {
      command('consent', 'update', { analytics_storage: 'granted' });
      return;
    }
    loaded = true;
    // No Google request happens before explicit consent. Advertising remains disabled.
    command('consent', 'default', { analytics_storage: 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });
    command('consent', 'update', { analytics_storage: 'granted' });
    command('js', new Date());
    command('config', measurementId, {
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
      page_location: location.origin + location.pathname,
      page_referrer: '',
      send_page_view: false
    });
    command('event', 'page_view', { page_location: location.origin + location.pathname, page_title: document.title });
    const script = document.createElement('script');
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
    script.async = true;
    document.head.append(script);
  };
  if (!enabled) {
    settings.hidden = true;
    return;
  }
  const stored = readChoice();
  if (stored) applyChoice(stored);
  else banner.hidden = false;
  settings.addEventListener('click', () => {
    previousFocus = document.activeElement;
    banner.hidden = false;
    banner.querySelector('button').focus();
  });
  banner.querySelectorAll('[data-consent]').forEach(button => button.addEventListener('click', () => {
    const choice = button.dataset.consent;
    try { localStorage.setItem(storageKey, JSON.stringify({ value: choice, expires: Date.now() + lifetime })); } catch { /* Consent still applies for this document. */ }
    applyChoice(choice);
    banner.hidden = true;
    (previousFocus || settings).focus();
  }));
  window.addEventListener('storage', event => {
    if (event.key !== storageKey) return;
    const choice = readChoice();
    applyChoice(choice || 'denied');
    banner.hidden = Boolean(choice);
  });
  document.querySelectorAll('[data-event]').forEach(link => link.addEventListener('click', () => {
    if (!granted) return;
    // Record the action, never email contents, telephone numbers, or query strings.
    command('event', link.dataset.event, { page_location: location.origin + location.pathname });
  }));
})();

// Measure wrapped navigation too, so anchor headings remain below the sticky header.
(() => {
  const header = document.querySelector('header');
  if (!header) return;
  const updateHeaderHeight = () => document.documentElement.style.setProperty('--header-height', header.getBoundingClientRect().height + 'px');
  updateHeaderHeight();
  if (typeof ResizeObserver !== 'undefined') new ResizeObserver(updateHeaderHeight).observe(header);
  else window.addEventListener('resize', updateHeaderHeight);
})();

// Progressive enhancement keeps navigation available when JavaScript is disabled.
(() => {
  const header = document.querySelector('header');
  if (!header) return;
  const toggle = header.querySelector('.menu-toggle');
  const nav = header.querySelector('#main-navigation');
  if (!toggle || !nav) return;
  const mobile = window.matchMedia('(max-width:760px)');
  const setOpen = (open, restoreFocus = false) => {
    header.classList.toggle('menu-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.lastElementChild.textContent = open ? 'Fermer' : 'Menu';
    if (restoreFocus) toggle.focus();
  };
  header.classList.add('menu-enhanced');
  toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
  nav.addEventListener('click', event => { if (event.target.closest('a') && mobile.matches) setOpen(false, true); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') setOpen(false, true); });
  document.addEventListener('click', event => { if (!header.contains(event.target)) setOpen(false); });
  header.addEventListener('focusout', event => { if (event.relatedTarget && !header.contains(event.relatedTarget)) setOpen(false); });
  mobile.addEventListener('change', () => setOpen(false));
})();
