// Scroll reveal
(() => {
  const observer = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (e.isIntersecting) {
        e.target.classList.add('is-visible');
        observer.unobserve(e.target);
      }
    }
  }, { threshold: 0.2 });
  document.querySelectorAll('[data-reveal]').forEach((el) => observer.observe(el));
})();

// FAQ accordion
(() => {
  document.querySelectorAll('[data-faq]').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq__item');
      const expanded = item.getAttribute('aria-expanded') === 'true';
      item.setAttribute('aria-expanded', String(!expanded));
    });
  });
})();


// Sticky header + mobile sticky CTA
(() => {
  const header = document.querySelector('.site-header');
  const sticky = document.createElement('div');
  sticky.className = 'sticky-cta';
  sticky.innerHTML = `<div class="sticky-cta__inner"><a class="button button--primary" href="https://www.skool.com/mabs/" target="_blank" rel="noopener noreferrer">Start your FREE 7 day trial!!</a></div>`;
  document.body.appendChild(sticky);
  function onScroll() {
    const y = window.scrollY;
    header.classList.toggle('site-header--condensed', y > 120);
    
    if (window.innerWidth <= 900) {
      // Find the "Ready to grow your school" section
      const ctaSection = document.querySelector('section[aria-label="Final call to action"]');
      let shouldShowSticky = y > 360;
      
      if (ctaSection) {
        const ctaRect = ctaSection.getBoundingClientRect();
        const ctaTop = ctaRect.top + y;
        const ctaBottom = ctaRect.bottom + y;
        
        // Hide sticky CTA when the CTA section is in view (with some buffer)
        const buffer = 100; // pixels of buffer
        if (y + window.innerHeight >= ctaTop - buffer && y <= ctaBottom + buffer) {
          shouldShowSticky = false;
        }
      }
      
      sticky.classList.toggle('is-visible', shouldShowSticky);
    } else {
      sticky.classList.remove('is-visible');
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();
})();

// Scroll-spy for nav
(() => {
  const links = Array.from(document.querySelectorAll('.nav a[href^="#"]'));
  const sections = links.map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        links.forEach(l => l.removeAttribute('aria-current'));
        const active = links.find(l => l.getAttribute('href') === `#${e.target.id}`);
        if (active) active.setAttribute('aria-current', 'true');
      }
    });
  }, { rootMargin: '-50% 0px -50% 0px', threshold: 0 });
  sections.forEach(s => s && observer.observe(s));
})();

// Mobile testimonials swipe functionality
(() => {
  if (window.innerWidth <= 768) {
    const testimonialsGrid = document.querySelector('.testimonials-grid');
    if (testimonialsGrid) {
      // Keep arrows visible at all times - removed hideIndicator functionality
      
      // Add smooth scroll behavior
      testimonialsGrid.style.scrollBehavior = 'smooth';
    }
  }
})();

