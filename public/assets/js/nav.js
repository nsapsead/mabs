(() => {
  const toggle = document.querySelector('.nav__toggle');
  if (!toggle) return;
  let panel;
  function ensurePanel() {
    if (panel) return panel;
    panel = document.createElement('div');
    panel.id = 'mobile-nav';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-modal', 'true');
    panel.style.position = 'fixed';
    panel.style.inset = '0';
    panel.style.background = 'rgba(0,0,0,.5)';
    panel.style.display = 'none';
    panel.innerHTML = `
      <div style="position:absolute;right:0;top:0;bottom:0;width:78%;max-width:380px;background:var(--color-offwhite);padding:24px;border-left:1px solid rgba(0,0,0,.06);">
        <nav style="display:grid;gap:16px;font-weight:700;padding-top:60px;">
          <a href="/programs.html">Programs</a>
          <a href="/blog.html">Blog</a>
          <a href="/about.html">About</a>
          <a href="/contact.html">Contact</a>
          <a class="button button--primary" href="https://www.skool.com/mabs/" target="_blank" rel="noopener noreferrer">Start your<strong>FREE</strong>7 day trial!!</a>
        </nav>
      </div>`;
    document.body.appendChild(panel);
    panel.addEventListener('click', (e) => { if (e.target === panel) close(); });
    return panel;
  }
  function open() {
    ensurePanel();
    toggle.setAttribute('aria-expanded', 'true');
    panel.style.display = 'block';
    document.body.style.overflow = 'hidden';
  }
  function close() {
    if (!panel) return;
    toggle.setAttribute('aria-expanded', 'false');
    panel.style.display = 'none';
    document.body.style.overflow = '';
  }
  toggle.addEventListener('click', () => {
    const expanded = toggle.getAttribute('aria-expanded') === 'true';
    expanded ? close() : open();
  });
  window.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
})();

