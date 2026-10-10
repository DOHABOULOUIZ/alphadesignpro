(() => {
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const animations=new Set();
 const targets=document.querySelectorAll('.about-panel,.sector-grid article,.journal-card,.why-grid article,.conception-copy,.turnkey>div,.portfolio-only .folio-panel,.service-manifesto > *,.conception-images figure,.turnkey-photo,.premium-footer > div');
 if('IntersectionObserver' in window){
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
   if(!entry.isIntersecting)return;
   if(!reduced.matches){
    const siblings=[...entry.target.parentElement.children];
    const delay=entry.target.matches('article')?Math.min(siblings.indexOf(entry.target),3)*100:0;
    const animation=entry.target.animate([{opacity:0,transform:'translateY(38px)'},{opacity:1,transform:'none'}],{duration:900,delay,easing:'cubic-bezier(.22,1,.36,1)',fill:'backwards'});
    animations.add(animation);animation.finished.catch(()=>{}).finally(()=>animations.delete(animation));
   }
   observer.unobserve(entry.target);
  }),{threshold:.12});targets.forEach(el=>observer.observe(el));
 }
 reduced.addEventListener('change',()=>animations.forEach(a=>a.cancel()));
 const form=document.querySelector('#contact-form');
 document.querySelectorAll('.sector-grid article').forEach((card,i)=>{
  const link=document.createElement('a');link.className='sector-action';link.href='#contact';link.textContent='Parlons de votre espace ↗';
  link.addEventListener('click',()=>{
   const select=form?.querySelector('#project-type');
   if(select){select.value=['Habitation & résidentiel','Boutique & bureaux','Hôtellerie & restauration'][i];select.dispatchEvent(new Event('change',{bubbles:true}));}
  });if(form)card.append(link);
 });
 const photos=document.querySelectorAll('.folio-main');
 if(!photos.length)return;
 const modal=document.createElement('dialog');modal.className='portfolio-lightbox';modal.setAttribute('aria-label','Photo du portfolio agrandie');
 modal.innerHTML='<button type="button" class="portfolio-close">Fermer ×</button><img alt=""><p></p>';
 document.body.append(modal);let opener;
 modal.querySelector('button').onclick=()=>modal.close();
 modal.addEventListener('click',e=>{if(e.target===modal)modal.close()});
 modal.addEventListener('close',()=>{document.documentElement.classList.remove('portfolio-modal-open');opener?.focus({preventScroll:true})});
 photos.forEach(photo=>{
  photo.tabIndex=0;photo.setAttribute('role','button');photo.setAttribute('aria-haspopup','dialog');photo.setAttribute('aria-label',`Agrandir : ${photo.alt}`);
  function open(){opener=photo;modal.querySelector('img').src=photo.currentSrc||photo.src;modal.querySelector('img').alt=photo.alt;modal.querySelector('p').textContent=photo.alt;modal.showModal();document.documentElement.classList.add('portfolio-modal-open');}
  photo.addEventListener('click',open);photo.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();open()}});
 });
})();
