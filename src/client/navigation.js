// Measure wrapped navigation too, so anchor headings remain below the sticky header.
(() => {
  const header = document.querySelector('header');
  if (!header) return;
  const updateHeaderHeight = () =>
    document.documentElement.style.setProperty(
      '--header-height',
      header.getBoundingClientRect().height + 'px',
    );
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
  nav.addEventListener('click', (event) => {
    if (event.target.closest('a') && mobile.matches) setOpen(false, true);
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true')
      setOpen(false, true);
  });
  document.addEventListener('click', (event) => {
    if (!header.contains(event.target)) setOpen(false);
  });
  header.addEventListener('focusout', (event) => {
    if (event.relatedTarget && !header.contains(event.relatedTarget)) setOpen(false);
  });
  mobile.addEventListener('change', () => setOpen(false));
})();
