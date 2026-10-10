const menu = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
function setMenu(open){navigation.classList.toggle('open',open);menu.setAttribute('aria-expanded',String(open));menu.querySelector('.menu-label').textContent=open?'Fermer':'Menu';menu.querySelector('.menu-icon').textContent=open?'×':'☰';}
function closeMenu(){setMenu(false);}
menu.addEventListener('click',()=>setMenu(menu.getAttribute('aria-expanded')!=='true'));
navigation.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&menu.getAttribute('aria-expanded')==='true'){closeMenu();menu.focus();}});
window.matchMedia('(min-width: 761px)').addEventListener('change',closeMenu);
document.querySelector('.header').addEventListener('focusout',e=>{if(!e.currentTarget.contains(e.relatedTarget))closeMenu();});
document.addEventListener('click',e=>{if(!e.target.closest('.header'))closeMenu();});
