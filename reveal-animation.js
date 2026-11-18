/* Subtle scroll reveal for the existing portfolio sections and cards. */
(() => {
  const targets = [
    '.hero-copy',
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

  const elements = Array.from(document.querySelectorAll(targets));
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reduceMotion || !('IntersectionObserver' in window)) {
    elements.forEach((element) => element.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        currentObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -32px 0px'
  });

  elements.forEach((element, index) => {
    element.classList.add('reveal-on-scroll');
    element.style.setProperty('--reveal-delay', `${(index % 4) * 75}ms`);
    observer.observe(element);
  });
})();
