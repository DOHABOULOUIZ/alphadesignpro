(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const galleries = document.querySelectorAll('.bathroom-gallery, .space-gallery');
  if (!galleries.length) return;
  const dialog = document.createElement('dialog');
  dialog.className = 'space-lightbox';
  dialog.setAttribute('aria-label', 'Photo agrandie');
  dialog.innerHTML = '<button type="button" class="space-close" aria-label="Fermer la photo">Fermer ×</button><img alt="">';
  document.body.append(dialog);
  dialog.querySelector('button').onclick = () => dialog.close();
  dialog.addEventListener('click', e => { if (e.target === dialog) dialog.close(); });
  dialog.addEventListener('close', () => document.documentElement.classList.remove('space-modal-open'));
  galleries.forEach((gallery, group) => {
    const section = gallery.parentElement;
    const figures = [...gallery.querySelectorAll('figure')];
    const photos = figures.map(f => ({src: f.querySelector('img').src, alt: f.querySelector('img').alt}));
    const title = section.querySelector('h3').textContent;
    section.classList.add('space-editorial');
    const heading = section.querySelector('.bathroom-heading');
    const eyebrow = document.createElement('span');
    eyebrow.className = 'space-index';
    eyebrow.textContent = `0${group + 1} / AMBIANCES`;
    heading.prepend(eyebrow);
    const stage = document.createElement('div');
    stage.className = 'space-viewer';
    stage.innerHTML = '<button type="button" class="space-enlarge"><img alt=""><span>Agrandir ↗</span></button><div class="space-controls"><span class="space-count" aria-live="polite"></span><div><button type="button" class="space-prev" aria-label="Photo précédente">←</button><button type="button" class="space-next" aria-label="Photo suivante">→</button></div></div>';
    gallery.before(stage);
    gallery.classList.add('space-thumbnails');
    let current = 0, animation;
    const large = stage.querySelector('img');
    const thumbs = figures.map((figure, i) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.setAttribute('aria-label', `${title} : afficher la vue ${i + 1}`);
      button.append(figure.querySelector('img'));
      button.onclick = () => {swipeUntil=0;show(i);};
      figure.replaceChildren(button);
      return button;
    });
    function show(index, animate = true) {
      current = (index + photos.length) % photos.length;
      large.src = photos[current].src;
      large.alt = photos[current].alt;
      stage.querySelector('.space-enlarge').setAttribute('aria-label', `Agrandir : ${large.alt}`);
      stage.querySelector('.space-count').textContent = `${String(current + 1).padStart(2, '0')} / ${String(photos.length).padStart(2, '0')}`;
      thumbs.forEach((button, i) => button.setAttribute('aria-pressed', String(i === current)));
      animation?.cancel();
      if (animate && !reduced.matches) animation = large.animate([{opacity:.25, transform:'scale(1.025)'},{opacity:1, transform:'scale(1)'}], {duration:550,easing:'ease-out'});
    }
    stage.querySelector('.space-prev').onclick = () => {swipeUntil=0;show(current - 1);};
    stage.querySelector('.space-next').onclick = () => {swipeUntil=0;show(current + 1);};
    let touchStart, swipeUntil = 0;
    const surface = stage.querySelector('.space-enlarge');
    surface.addEventListener('touchstart', e => {touchStart={x:e.touches[0].clientX,y:e.touches[0].clientY};},{passive:true});
    surface.addEventListener('touchcancel',()=>{touchStart=null;});
    surface.addEventListener('touchend', e => {
      if(!touchStart)return;
      const dx=e.changedTouches[0].clientX-touchStart.x,dy=e.changedTouches[0].clientY-touchStart.y;
      if(Math.abs(dx)>55 && Math.abs(dx)>Math.abs(dy)*1.5){swipeUntil=Date.now()+500;show(current+(dx<0?1:-1));}
      touchStart=null;
    },{passive:true});
    stage.querySelector('.space-enlarge').onclick = () => {
      if(Date.now()<swipeUntil)return;
      const image = dialog.querySelector('img');
      image.src = large.src; image.alt = large.alt;
      dialog.showModal();
      document.documentElement.classList.add('space-modal-open');
    };
    stage.addEventListener('keydown', e => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { e.preventDefault(); show(current + (e.key === 'ArrowRight' ? 1 : -1)); }
    });
    show(0, false);
    reduced.addEventListener('change',()=>animation?.cancel());
  });
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      if (!reduced.matches) entry.target.animate([{opacity:0,transform:'translateY(28px)'},{opacity:1,transform:'none'}],{duration:850,easing:'cubic-bezier(.22,1,.36,1)'});
      observer.unobserve(entry.target);
    }), {threshold:.12});
    document.querySelectorAll('.space-editorial').forEach(el => observer.observe(el));
  }
})();
