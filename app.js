const assetBase = new URL("assets/", document.currentScript.src);
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
const projects={bedroom:{title:'Une chambre, réinventée',description:'Du lieu existant au rendu 3D, puis à la réalisation : une transformation présentée dans notre offre de services.',images:[['bedroom-before','L’espace avant transformation'],['bedroom','La conception — rendu 3D'],['bedroom-after','La réalisation — détail de la tête de lit']]},boutique:{title:'Un écrin pour votre marque',description:'Conception d’une boutique : matières claires, détails dorés et mobilier intégré. Visuel de conception présenté dans notre offre de services.',images:[['boutique','Conception de boutique — rendu 3D']]},dressing:{title:'Chaque chose à sa place',description:'Une étude de dressing sur mesure, pensée pour organiser les rangements et exploiter les volumes disponibles.',images:[['dressing-detail','Visualisation du dressing — rendu 3D'],['dressing-render','Autre étude de dressing — rendu 3D']]},bathroom:{title:'Un rituel de bien-être',description:'Projet de réaménagement d’une salle de bain présenté dans notre offre de services.',images:[['bathroom','Étude d’aménagement — salle de bain']]}};
const dialog=document.querySelector('#project-dialog');
document.querySelectorAll('[data-project]').forEach(button=>button.addEventListener('click',()=>{const project=projects[button.dataset.project];const content=document.querySelector('#dialog-content');content.replaceChildren();const title=document.createElement('h2');title.id='dialog-title';title.textContent=project.title;const description=document.createElement('p');description.textContent=project.description;content.append(title,description);project.images.forEach(([file,caption])=>{const figure=document.createElement('figure');const img=document.createElement('img');img.src=new URL(`${file}.webp`,assetBase).href;img.alt=caption;const label=document.createElement('figcaption');label.textContent=caption;figure.append(img,label);content.append(figure);});dialog.setAttribute('aria-labelledby','dialog-title');dialog.showModal();document.body.style.overflow='hidden';dialog.scrollTop=0;}));
document.querySelector('.dialog-close').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
dialog.addEventListener('close',()=>{document.body.style.overflow='';});
document.querySelectorAll('[data-pack]').forEach(a=>a.addEventListener('click',()=>{document.querySelector('#pack').value=a.dataset.pack;}));
document.querySelector('#contact-form').addEventListener('submit',e=>{
 e.preventDefault();
 if(!e.currentTarget.reportValidity())return;
 const data=new FormData(e.currentTarget);
 const message=`Bonjour AlphaDesignPro, je m’appelle ${String(data.get('name')||'').trim()}.\n\nMon projet : ${data.get('type')}\nAccompagnement : ${data.get('pack')}\n\n${String(data.get('message')||'').trim()}`;
 window.location.href=`https://wa.me/212621531398?text=${encodeURIComponent(message)}`;
});
document.querySelector('#year').textContent=new Date().getFullYear();
