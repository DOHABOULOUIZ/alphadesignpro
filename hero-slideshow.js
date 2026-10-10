(() => {
 const hero=document.querySelector('.hero'),visual=hero?.querySelector('.hero-visual'),first=visual?.querySelector('img');
 if(!first)return;
 const assets=new URL('assets/',document.currentScript.src);
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const images=[first];
 for(const [file,alt] of [['hero-clay-salon.jpg','Inspiration : salon lumineux avec poêle, photo de Clay Banks'],['hero-clay-bois.jpg','Inspiration : salon et cuisine en bois naturel, photo de Clay Banks']]){
  const img=new Image();img.src=new URL(file,assets).href;img.alt=alt;img.decoding='async';img.setAttribute('aria-hidden','true');visual.append(img);images.push(img);
 }
 images.forEach((img,i)=>{img.classList.add('hero-slide');img.classList.toggle('is-active',i===0)});
 hero.classList.add('has-slideshow');
 const heading=hero.querySelector('h1'),description=hero.querySelector('.hero-description');
 const captions=[['Des espaces. Une âme.','Des intérieurs pensés pour vous, de la première idée aux derniers détails.'],['La lumière, naturellement.','Des volumes ouverts et des matières douces pour un intérieur apaisant.'],['Le sens du détail.','Le bois, la lumière et les textures composent un espace chaleureux.']];
 const eyebrow=hero.querySelector('.eyebrow');if(eyebrow)eyebrow.textContent='ALPHADESIGNPRO · INSPIRATIONS D’INTÉRIEUR';
 const controls=document.createElement('div');controls.className='hero-slideshow-controls';controls.setAttribute('role','group');controls.setAttribute('aria-label','Photos d’ambiance');
 const dots=images.map((img,i)=>{const b=document.createElement('button');b.type='button';b.textContent=String(i+1).padStart(2,'0');b.setAttribute('aria-label',`Afficher l’ambiance ${i+1}`);b.onclick=()=>{paused=true;show(i);schedule()};controls.append(b);return b;});
 const pause=document.createElement('button');pause.type='button';pause.className='hero-pause';controls.append(pause);hero.append(controls);
 let index=0,paused=reduced.matches,timer,visible=true,focused=false,hovered=false,request=0;
 async function show(next){const ticket=++request;try{await images[next].decode()}catch{return;}if(ticket!==request)return;index=next;images.forEach((img,i)=>{img.classList.toggle('is-active',i===index);img.setAttribute('aria-hidden',String(i!==index))});dots.forEach((b,i)=>b.setAttribute('aria-pressed',String(i===index)));hero.dataset.slide=String(index);
 if(heading)heading.textContent=captions[index][0];if(description)description.textContent=captions[index][1];
 if(!reduced.matches)[heading,description].filter(Boolean).forEach((el,i)=>{el.getAnimations().forEach(a=>a.cancel());el.animate([{opacity:0,transform:'translateY(24px)'},{opacity:1,transform:'none'}],{duration:850,delay:i*100,easing:'cubic-bezier(.22,1,.36,1)',fill:'backwards'})});
 }
 for(const [direction,label] of [[-1,'Photo précédente'],[1,'Photo suivante']]){const button=document.createElement('button');button.type='button';button.className=`hero-photo-arrow ${direction<0?'previous':'next'}`;button.setAttribute('aria-label',label);button.textContent=direction<0?'←':'→';button.onclick=()=>{paused=true;show((index+direction+images.length)%images.length);schedule()};hero.append(button);}
 function schedule(){clearTimeout(timer);pause.textContent=paused?'▶':'Ⅱ';pause.setAttribute('aria-label',paused?'Reprendre le diaporama':'Mettre le diaporama en pause');pause.title=pause.getAttribute('aria-label');if(paused||!visible||document.hidden||focused||hovered)return;timer=setTimeout(async()=>{await show((index+1)%images.length);schedule()},6000);}
 pause.onclick=()=>{paused=!paused;schedule()};
 controls.addEventListener('pointerenter',()=>{hovered=true;schedule()});controls.addEventListener('pointerleave',()=>{hovered=false;schedule()});
 hero.addEventListener('focusin',()=>{focused=true;schedule()});hero.addEventListener('focusout',()=>requestAnimationFrame(()=>{focused=hero.contains(document.activeElement);schedule()}));
 document.addEventListener('visibilitychange',schedule);
 new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;schedule()},{threshold:.15}).observe(hero);
 reduced.addEventListener('change',()=>{paused=reduced.matches;schedule()});
 show(0);schedule();
})();
