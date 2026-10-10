document.querySelectorAll('.folio-carousel').forEach(carousel=>{
 const slides=[...carousel.querySelectorAll('.folio-slide')];let index=0;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');let animations=[];
 carousel.querySelector('.folio-controls').hidden=false;
 const pagination=document.createElement('div');pagination.className='folio-pagination';pagination.setAttribute('role','group');pagination.setAttribute('aria-label','Choisir un projet');
 const choices=slides.map((slide,i)=>{const button=document.createElement('button');button.type='button';button.textContent=String(i+1).padStart(2,'0');button.setAttribute('aria-label',`Afficher : ${slide.querySelector('h3').textContent}`);button.setAttribute('aria-pressed',String(i===0));button.onclick=()=>{if(i!==index)show(i-index)};pagination.append(button);return button});
 carousel.after(pagination);
 function show(direction){
  animations.forEach(a=>a.cancel());animations=[];
  slides[index].hidden=true;index=(index+direction+slides.length)%slides.length;const slide=slides[index];slide.hidden=false;
  choices.forEach((button,i)=>button.setAttribute('aria-pressed',String(i===index)));
  carousel.querySelector('.folio-live').textContent=`Projet ${index+1} sur ${slides.length} : ${slide.querySelector('h3').textContent}`;
  if(reduced.matches)return;
  [...slide.children].forEach((element,i)=>{
   const photo=element.matches('.folio-main');
   animations.push(element.animate(photo?[{opacity:.2,clipPath:direction>0?'inset(0 100% 0 0)':'inset(0 0 0 100%)',transform:'scale(1.04)'},{opacity:1,clipPath:'inset(0)',transform:'none'}]:[{opacity:0,transform:`translateY(${25+i*8}px)`},{opacity:1,transform:'none'}],{duration:photo?950:750,delay:i*100,easing:'cubic-bezier(.22,1,.36,1)',fill:'backwards'}));
  });
 }
 carousel.querySelectorAll('[data-folio-dir]').forEach(button=>button.addEventListener('click',()=>show(Number(button.dataset.folioDir))));
 carousel.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();show(e.key==='ArrowLeft'?-1:1)}});
 let start;
 carousel.addEventListener('touchstart',e=>{start={x:e.touches[0].clientX,y:e.touches[0].clientY}},{passive:true});
 carousel.addEventListener('touchend',e=>{if(!start)return;const dx=e.changedTouches[0].clientX-start.x,dy=e.changedTouches[0].clientY-start.y;if(Math.abs(dx)>60&&Math.abs(dx)>Math.abs(dy)*1.5)show(dx<0?1:-1);start=null},{passive:true});
 reduced.addEventListener('change',()=>animations.forEach(a=>a.cancel()));
});
