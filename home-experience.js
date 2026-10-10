(() => {
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const fine=matchMedia('(min-width: 761px) and (pointer: fine)');
 const active=new Set();
 const play=(element,frames,options)=>{
   const animation=element.animate(frames,options);active.add(animation);
   animation.finished.catch(()=>{}).finally(()=>active.delete(animation));
 };
 const groups=[...document.querySelectorAll('.about-editorial,.folio-stage')];
 const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
   if(!entry.isIntersecting||reduced.matches)return;
   const section=entry.target;
   if(section.matches('.about-editorial')){
     section.querySelectorAll('.about-editorial-copy > *').forEach((el,i)=>play(el,[{opacity:0,transform:'translateY(40px)'},{opacity:1,transform:'none'}],{duration:950,delay:i*110,easing:'cubic-bezier(.22,1,.36,1)',fill:'backwards'}));
     section.querySelectorAll('figure').forEach((el,i)=>play(el,[{opacity:.15,clipPath:'inset(0 0 100% 0)',transform:'translateY(35px)'},{opacity:1,clipPath:'inset(0)',transform:'none'}],{duration:1250,delay:150+i*180,easing:'cubic-bezier(.22,1,.36,1)',fill:'backwards'}));
   }else{
     const panel=section.querySelector('.folio-panel');
     if(panel)play(panel,[{opacity:.2,transform:'translateY(55px) scale(.96)'},{opacity:1,transform:'none'}],{duration:1100,easing:'cubic-bezier(.22,1,.36,1)'});
   }
 }),{threshold:.18});
 groups.forEach(section=>observer.observe(section));
 let frame=0;
 function update(){frame=0;document.querySelectorAll('.about-editorial-images figure').forEach((figure,i)=>{
   if(reduced.matches||!fine.matches){figure.style.removeProperty('translate');return;}
   const section=figure.closest('.about-editorial').getBoundingClientRect();
   const progress=Math.max(-1,Math.min(1,(innerHeight/2-section.top-section.height/2)/innerHeight));
   figure.style.translate=`0 ${progress*(i? -65:35)}px`;
 });}
 function schedule(){if(!frame)frame=requestAnimationFrame(update)}
 window.addEventListener('scroll',schedule,{passive:true});window.addEventListener('resize',schedule);
 reduced.addEventListener('change',()=>{active.forEach(a=>a.cancel());schedule()});fine.addEventListener('change',schedule);schedule();
})();
