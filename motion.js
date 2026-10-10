/* Progressive motion: content remains accessible without JavaScript or animation. */
(() => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  const grid = document.querySelector('.project-grid');
  const cards = [...(grid?.querySelectorAll('.project-card') || [])];
  const filters = [...document.querySelectorAll('[data-filter]')];
  const animations = [];
  filters.forEach(button => button.addEventListener('click', () => {
    filters.forEach(filter => {
      filter.classList.toggle('active', filter === button);
      filter.setAttribute('aria-pressed', String(filter === button));
    });
    grid.classList.toggle('is-filtered', button.dataset.filter !== 'all');
    cards.forEach(card => {
      card.hidden = button.dataset.filter !== 'all' && card.dataset.category !== button.dataset.filter;
    });
  }));

  // Text masks echo the reference's restrained editorial reveals.
  const headings = [...document.querySelectorAll('h1, .section h2')];
  headings.forEach(heading => {
    const nodes = [...heading.childNodes];
    const fragments = [[]];
    nodes.forEach(node => {
      if (node.nodeName === 'BR') fragments.push([]);
      else fragments[fragments.length - 1].push(node);
    });
    heading.replaceChildren();
    fragments.forEach((fragment, index) => {
      const mask = document.createElement('span');
      mask.className = 'line-mask';
      const line = document.createElement('span');
      line.className = 'line-content';
      line.style.setProperty('--line-delay', `${index * 100}ms`);
      line.append(...fragment);
      mask.append(line);
      heading.append(mask);
    });
  });

  const targets = [...document.querySelectorAll('.section h2, .studio-copy, .service-grid article, .steps li, .package-grid article, .contact form, .project-grid')];
  let observer;
  let frame;
  const hero = document.querySelector('.hero');
  const heroImage = document.querySelector('.hero-visual > img');
  const header = document.querySelector('.header');
  function scrollMotion() {
    if (frame) return;
    frame = requestAnimationFrame(() => {
      header.classList.toggle('is-scrolled', window.scrollY > 30);
      if (hero && heroImage && !reduced.matches && finePointer.matches) {
        const rect = hero.getBoundingClientRect();
        const shift = Math.min(Math.max(-rect.top * .1, 0), 65);
        heroImage.style.transform = rect.bottom > 0 ? `translateY(${shift}px) scale(1.1)` : '';
      } else if (heroImage) heroImage.style.transform = '';
      frame = null;
    });
  }
  function configureMotion() {
    observer?.disconnect();
    animations.forEach(animation => animation.cancel());
    if (reduced.matches || !('IntersectionObserver' in window)) {
      document.documentElement.classList.remove('has-motion');
      targets.forEach(target => target.classList.remove('reveal-pending'));
    } else {
      document.documentElement.classList.add('has-motion');
      observer = new IntersectionObserver(entries => entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.remove('reveal-pending');
          observer.unobserve(entry.target);
        }
      }), { threshold: .08, rootMargin: '0px 0px -30px 0px' });
      targets.forEach(target => {
        // Do not hide content above the viewport on deep links or restored scroll.
        if (target.getBoundingClientRect().top < window.innerHeight * .92) return;
        const siblings = [...target.parentElement.children];
        const delay = target.matches('article, li') ? Math.min(siblings.indexOf(target), 3) * 75 : 0;
        target.style.setProperty('--reveal-delay', `${delay}ms`);
        target.classList.add('reveal-pending');
        observer.observe(target);
      });
    }
    scrollMotion();
  }
  window.addEventListener('scroll', scrollMotion, { passive: true });
  reduced.addEventListener('change', configureMotion);
  finePointer.addEventListener('change', scrollMotion);
  configureMotion();
})();
