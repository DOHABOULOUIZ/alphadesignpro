(() => {
  const hover = matchMedia('(hover: hover) and (pointer: fine)');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  document.querySelectorAll('#journal .journal-card').forEach(card => {
    const details = card.querySelector('details');
    const note = card.querySelector('.journal-note');
    if (!details || !note) return;
    let temporary = false, animation;
    function reveal() {
      if (!hover.matches || details.open) return;
      temporary = true;
      details.open = true;
    }
    function hide() {
      if (temporary && !card.matches(':hover') && !card.contains(document.activeElement)) {
        details.open = false;
        temporary = false;
      }
    }
    card.addEventListener('pointerenter', reveal);
    card.addEventListener('pointerleave', hide);
    card.addEventListener('focusin', reveal);
    card.addEventListener('focusout', () => requestAnimationFrame(hide));
    details.querySelector('summary').addEventListener('click', () => { temporary = false; });
    details.addEventListener('toggle', () => {
      animation?.cancel();
      if (details.open && !reduced.matches) animation = note.animate([
        {opacity:0, transform:'translateY(12px)'},
        {opacity:1, transform:'translateY(0)'}
      ], {duration:450,easing:'cubic-bezier(.22,1,.36,1)'});
    });
  });
})();
