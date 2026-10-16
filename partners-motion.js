(() => {
 document.querySelectorAll('.footer-clients>div').forEach(row => {
  const originals=[...row.children];
  const track=document.createElement('div');track.className='partners-track';
  const group=document.createElement('div');group.className='partners-group';
  originals.forEach(link=>group.append(link));
  const copy=group.cloneNode(true);copy.setAttribute('aria-hidden','true');
  copy.querySelectorAll('a').forEach(link=>link.tabIndex=-1);
  track.append(group,copy);row.append(track);row.classList.add('partners-marquee');
 });
})();
