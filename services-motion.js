(() => {
  const stage = document.querySelector('.service-stage');
  if (!stage) return;
  const tiles = [...stage.querySelectorAll('.service-tile')];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const desktop = matchMedia('(min-width: 761px) and (hover: hover)');
  let observer, frame = 0, animations = [];
  function update() {
    frame = 0;
    if (reduced.matches || !desktop.matches) return;
    const bounds = stage.getBoundingClientRect();
    if (bounds.bottom < 0 || bounds.top > innerHeight) return;
    const progress = Math.min(1, Math.max(0, -bounds.top / bounds.height));
    tiles.forEach((tile, i) => tile.style.setProperty('--scroll-shift', `${progress * [18, -18, 26, -12][i]}px`));
  }
  function schedule() { if (!frame) frame = requestAnimationFrame(update); }
  function configure() {
    observer?.disconnect();
    animations.forEach(animation => animation.cancel());
    animations = [];
    tiles.forEach(tile => tile.style.removeProperty('--scroll-shift'));
    if (reduced.matches || !('IntersectionObserver' in window)) return;
    observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const tile = entry.target;
        animations.push(tile.animate([
          { opacity: 0, transform: 'translateY(32px)', clipPath: 'inset(8% 0 0 0)' },
          { opacity: 1, transform: 'translateY(0)', clipPath: 'inset(0)' }
        ], { duration: 950, delay: tiles.indexOf(tile) * 90, easing: 'cubic-bezier(.22,1,.36,1)', fill: 'backwards' }));
        observer.unobserve(tile);
      });
    }, { threshold: .12 });
    tiles.forEach(tile => observer.observe(tile));
    schedule();
  }
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule, { passive: true });
  reduced.addEventListener('change', configure);
  desktop.addEventListener('change', configure);
  configure();
})();
