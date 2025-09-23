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

// Simple slider
(() => {
  const slider = document.querySelector('[data-slider]');
  if (!slider) return;
  const track = slider.querySelector('[data-track]');
  const slides = Array.from(track.children);
  let index = 0;
  const prev = slider.querySelector('.slider__prev');
  const next = slider.querySelector('.slider__next');
  const dotsEl = slider.querySelector('.slider__dots');
  const dots = slides.map((_, i) => {
    const d = document.createElement('button');
    d.className = 'slider__dot';
    d.setAttribute('role', 'tab');
    d.addEventListener('click', () => { index = i; update(); });
    dotsEl.appendChild(d);
    return d;
  });
  function update() {
    track.style.transform = `translateX(${-index * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('is-active', i === index));
  }
  prev.addEventListener('click', () => { index = (index - 1 + slides.length) % slides.length; update(); });
  next.addEventListener('click', () => { index = (index + 1) % slides.length; update(); });
  // Autoplay
  setInterval(() => { index = (index + 1) % slides.length; update(); }, 6000);
  update();
})();

// Sticky header + mobile sticky CTA
(() => {
  const header = document.querySelector('.site-header');
  const sticky = document.createElement('div');
  sticky.className = 'sticky-cta';
  sticky.innerHTML = `<div class="sticky-cta__inner"><a class="button button--primary" href="https://www.skool.com/mabs/" target="_blank" rel="noopener noreferrer">Start free trial</a></div>`;
  document.body.appendChild(sticky);
  function onScroll() {
    const y = window.scrollY;
    header.classList.toggle('site-header--condensed', y > 120);
    if (window.innerWidth <= 900) {
      sticky.classList.toggle('is-visible', y > 360);
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

