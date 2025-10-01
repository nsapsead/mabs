// MABS Header Component
// Ensures consistent header across all pages

function createHeader(currentPage = '') {
  const navItems = [
    { href: '/index.html#how', text: 'How it works' },
    { href: '/blog.html', text: 'Blog' },
    { href: '/index.html#programs', text: 'Programmes' },
    { href: '/index.html#testimonials', text: 'Results' },
    { href: '/index.html#about', text: 'About' },
    { href: '/index.html#faq', text: 'FAQ' }
  ];

  const navHTML = navItems.map(item => {
    const isCurrent = currentPage === item.text.toLowerCase();
    return `<a href="${item.href}"${isCurrent ? ' aria-current="page"' : ''}>${item.text}</a>`;
  }).join('\n          ');

  return `
    <header class="site-header">
      <div class="container site-header__inner">
        <a class="brand" href="/">
          <img src="/assets/img/mabs_logo.png" alt="MABS" />
        </a>
        <nav class="nav" aria-label="Primary">
          ${navHTML}
        </nav>
        <button class="button nav__toggle" aria-expanded="false" aria-controls="mobile-nav">Menu</button>
      </div>
    </header>
  `;
}

// Auto-inject header if header element doesn't exist
document.addEventListener('DOMContentLoaded', () => {
  const existingHeader = document.querySelector('.site-header');
  if (!existingHeader) {
    const body = document.querySelector('body');
    if (body) {
      body.insertAdjacentHTML('afterbegin', createHeader());
    }
  }
});

// Export for manual use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { createHeader };
}

