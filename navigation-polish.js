(() => {
 const header=document.querySelector('.header'), nav=header?.querySelector('nav'), menu=header?.querySelector('.menu-toggle');
 if(!nav||!menu)return;
 const links=[...nav.querySelectorAll('a')];
 const mobile=matchMedia('(max-width:760px)');
 const marker=document.createElement('span');marker.className='nav-indicator';marker.setAttribute('aria-hidden','true');nav.append(marker);nav.classList.add('has-indicator');
 links.forEach((link,i)=>link.style.setProperty('--nav-order',i));
 let current=null, frame=0;
 const samePage=link=>new URL(link.href).pathname===location.pathname;
 function chooseCurrent(){
   const sections=links.filter(link=>samePage(link)&&new URL(link.href).hash).map(link=>({link,section:document.getElementById(new URL(link.href).hash.slice(1))})).filter(x=>x.section);
   const reached=sections.filter(x=>x.section.getBoundingClientRect().top<=header.offsetHeight+100).sort((a,b)=>b.section.offsetTop-a.section.offsetTop);
   current=reached[0]?.link || links.find(link=>samePage(link)&&!new URL(link.href).hash) || links.find(link=>link.hasAttribute('aria-current'));
   links.forEach(link=>{link.removeAttribute('aria-current');if(link===current)link.setAttribute('aria-current',new URL(link.href).hash?'location':'page')});
 }
 function move(link){
   if(!link||link.classList.contains('nav-cta')||link.closest('.nav-socials')||mobile.matches){marker.classList.remove('visible');return;}
   marker.style.setProperty('--marker-x',`${link.offsetLeft}px`);marker.style.setProperty('--marker-width',`${link.offsetWidth}px`);marker.classList.add('visible');
 }
 function refresh(){frame=0;header.classList.toggle('is-scrolled',scrollY>30);chooseCurrent();if(!nav.matches(':hover')&&!nav.contains(document.activeElement))move(current);}
 function schedule(){if(!frame)frame=requestAnimationFrame(refresh)}
 links.forEach(link=>{link.addEventListener('pointerenter',()=>move(link));link.addEventListener('focus',()=>move(link))});
 nav.addEventListener('pointerleave',()=>move(current));nav.addEventListener('focusout',()=>requestAnimationFrame(()=>{if(!nav.contains(document.activeElement))move(current)}));
 function accessibility(){nav.inert=mobile.matches&&menu.getAttribute('aria-expanded')!=='true';move(current)}
 new MutationObserver(accessibility).observe(menu,{attributes:true,attributeFilter:['aria-expanded']});
 mobile.addEventListener('change',accessibility);
 window.addEventListener('scroll',schedule,{passive:true});window.addEventListener('resize',schedule);window.addEventListener('hashchange',schedule);
 new ResizeObserver(()=>move(current)).observe(nav);
 document.fonts?.ready.then(()=>move(current));refresh();accessibility();move(current);
})();
