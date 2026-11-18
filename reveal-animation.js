/*
  Motion layer for Snehal Pawar's portfolio.
  Vanilla JavaScript only; safe for static GitHub Pages hosting.
*/
(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const body = document.body;
  const header = document.querySelector('.site-header');
  const nav = document.getElementById('navLinks');

  // Always show the content when reduced motion is requested or the API is unavailable.
  if (reduceMotion) return;

  body.classList.add('motion-enabled');

  // Stagger the hero copy on first load.
  const heroCopy = document.querySelector('.hero-copy');
  if (heroCopy) {
    Array.from(heroCopy.children).forEach((item, index) => {
      item.style.setProperty('--hero-order', index);
    });
  }

  // Slim reading-progress indicator.
  const progress = document.createElement('div');
  progress.className = 'scroll-progress';
  progress.setAttribute('aria-hidden', 'true');
  const progressBar = document.createElement('span');
  progress.appendChild(progressBar);
  body.prepend(progress);

  let ticking = false;
  const updateScrollUI = () => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = scrollable > 0 ? window.scrollY / scrollable : 0;
    progressBar.style.transform = `scaleX(${Math.min(1, Math.max(0, ratio))})`;
    if (header) header.classList.toggle('is-scrolled', window.scrollY > 12);
    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(updateScrollUI);
      ticking = true;
    }
  }, { passive: true });
  window.addEventListener('resize', updateScrollUI, { passive: true });
  updateScrollUI();

  // Reveal sections and cards as they enter the viewport.
  const revealSelectors = [
    '.terminal-card',
    '.section-heading',
    '.about-layout',
    '.skill-panel',
    '.project-card',
    '.experience-card',
    '.education-card',
    '.cert-row',
    '.contact-panel'
  ].join(',');

  const revealItems = Array.from(document.querySelectorAll(revealSelectors));

  if (!('IntersectionObserver' in window)) {
    revealItems.forEach(item => item.classList.add('is-visible'));
  } else {
    revealItems.forEach((item, index) => {
      item.classList.add('reveal-on-scroll');
      item.style.setProperty('--reveal-delay', `${(index % 3) * 85}ms`);
    });

    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -48px 0px'
    });

    revealItems.forEach(item => revealObserver.observe(item));
  }

  // Highlight the navigation item for the section currently in view.
  if (nav && 'IntersectionObserver' in window) {
    const navLinks = Array.from(nav.querySelectorAll('a[href^="#"]'));
    const sections = navLinks
      .map(link => document.querySelector(link.getAttribute('href')))
      .filter(Boolean);

    const navObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        navLinks.forEach(link => {
          const active = link.getAttribute('href') === `#${entry.target.id}`;
          link.classList.toggle('is-active', active);
          if (active) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        });
      });
    }, {
      rootMargin: '-35% 0px -55% 0px',
      threshold: 0
    });

    sections.forEach(section => navObserver.observe(section));
  }

  // Small pointer tilt and soft spotlight on desktop cards only.
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (finePointer) {
    const cards = document.querySelectorAll('.skill-panel, .project-card, .education-card');
    cards.forEach(card => {
      card.addEventListener('pointermove', event => {
        const rect = card.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const xRatio = (x / rect.width) - 0.5;
        const yRatio = (y / rect.height) - 0.5;
        card.style.setProperty('--pointer-x', `${x}px`);
        card.style.setProperty('--pointer-y', `${y}px`);
        card.style.setProperty('--tilt-x', `${(xRatio * 3.2).toFixed(2)}deg`);
        card.style.setProperty('--tilt-y', `${(-yRatio * 3.2).toFixed(2)}deg`);
      });

      card.addEventListener('pointerleave', () => {
        card.style.removeProperty('--tilt-x');
        card.style.removeProperty('--tilt-y');
      });
    });
  }
})();
