import './content.js';
import { linkHref } from './links.js';
const p = window.PORTFOLIO;
const escapeHtml = s => String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
document.querySelectorAll('[data-name]').forEach(el=>el.textContent=p.name);
document.querySelector('[data-availability]').textContent=p.availability;
document.querySelectorAll('[data-university]').forEach(el=>el.textContent=p.university);
const profilePhoto = document.getElementById('profile-photo');
if (p.photo) {
  profilePhoto.alt = `Portrait of ${p.name}`;
  profilePhoto.addEventListener('load', () => {
    profilePhoto.hidden = false;
    document.getElementById('photo-placeholder').hidden = true;
  });
  profilePhoto.addEventListener('error', () => {
    profilePhoto.hidden = true;
    document.getElementById('photo-placeholder').hidden = false;
  });
  profilePhoto.src = p.photo;
  if (p.photoLight) {
    const lightPhoto = new Image();
    lightPhoto.className = 'profile-photo-light';
    lightPhoto.alt = '';
    lightPhoto.setAttribute('aria-hidden', 'true');
    lightPhoto.width = lightPhoto.height = 112;
    lightPhoto.addEventListener('load', () => {
      profilePhoto.parentElement.classList.add('profile-light-ready');
    });
    lightPhoto.addEventListener('error', () => {
      profilePhoto.parentElement.classList.remove('profile-light-ready');
    });
    profilePhoto.parentElement.append(lightPhoto);
    lightPhoto.src = p.photoLight;
  }
}
document.title='Zaki Boongaling - Portfolio';
document.getElementById('year').textContent=new Date().getFullYear();
const visuals={network:'<path d="M20 22L70 22L45 68Z"/><path d="M20 22L20 68L70 68L70 22M20 68L45 45L70 68"/><circle cx="20" cy="22" r="6"/><circle cx="70" cy="22" r="6"/><circle cx="45" cy="45" r="6"/><circle cx="20" cy="68" r="6"/><circle cx="70" cy="68" r="6"/>',chip:'<rect x="25" y="25" width="40" height="40" rx="3"/><rect x="34" y="34" width="22" height="22"/><path d="M33 15V25M45 15V25M57 15V25M33 65V75M45 65V75M57 65V75M15 33H25M15 45H25M15 57H25M65 33H75M65 45H75M65 57H75"/>',terminal:'<rect x="10" y="20" width="70" height="51" rx="4"/><path d="M10 32H80M22 44L31 51L22 58M39 59H57"/><circle cx="18" cy="26" r="1"/><circle cx="24" cy="26" r="1"/>'};
document.getElementById('project-list').innerHTML=p.projects.map((x,i)=>`<article class="project"><div class="project-visual"><span class="visual-number">${escapeHtml(x.number)}</span><svg viewBox="0 0 90 90" aria-hidden="true">${visuals[x.visual]||visuals.terminal}</svg></div><div><div class="project-category">${escapeHtml(x.category)}</div><h3><button data-project="${i}">${escapeHtml(x.title)} <span>↗</span></button></h3><p>${escapeHtml(x.description)}</p><div class="tags">${x.tags.map(t=>`<span>${escapeHtml(t)}</span>`).join('')}</div></div></article>`).join('');
document.getElementById('ctf-list').innerHTML=p.ctfs.map((x,i)=>`<button class="ctf-row" data-ctf="${i}"><span><strong>${escapeHtml(x.title)} ↗</strong><small>${escapeHtml(x.event)}</small></span><span>${escapeHtml(x.category)}</span><span>${escapeHtml(x.status)}</span></button>`).join('');
document.getElementById('cert-list').innerHTML=p.certifications.map((x,i)=>`<article class="cert"><span class="cert-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M6 3h9l3 3v15H6zM14 3v5h4M9 12h6M9 16h4"/></svg></span><div class="cert-info"><h3>${escapeHtml(x.title)}</h3><p>${escapeHtml(x.issuer)} · ${escapeHtml(x.date)}</p></div>${x.url?`<button data-cert="${i}">Verify ↗</button>`:`<span class="credential-status">${escapeHtml(x.status)}</span>`}</article>`).join('');
let toastTimer;const toast=message=>{const el=document.getElementById('toast');el.textContent=message;el.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('show'),4000)};
function openUrl(url,label) {
  const href = linkHref(url, 'web', location.href);
  if (href) window.open(href, '_blank', 'noopener,noreferrer');
  else toast(`${label} is not available yet.`);
}
document.querySelectorAll('[data-link]').forEach(el => {
  const key = el.dataset.link;
  const href = linkHref(p.links[key], key === 'email' ? 'email' : 'web', location.href);
  if (!href) {
    el.hidden = !el.hasAttribute('data-placeholder');
    if (!el.hidden) el.disabled = true;
    return;
  }
  const anchor = document.createElement('a');
  anchor.className = el.className;
  anchor.dataset.link = key;
  anchor.innerHTML = el.innerHTML;
  anchor.querySelector('.action-note')?.remove();
  anchor.href = href;
  if (key === 'email') anchor.firstChild.textContent = p.links.email + ' ';
  else { anchor.target = '_blank'; anchor.rel = 'noopener noreferrer'; }
  el.replaceWith(anchor);
});
const dialog=document.getElementById('detail');const showDetail=html=>{document.getElementById('detail-content').innerHTML=html;dialog.showModal()};
document.querySelectorAll('[data-project]').forEach(el=>el.onclick=()=>{const x=p.projects[el.dataset.project];showDetail(`<p class="eyebrow">${escapeHtml(x.category)} · TEMPLATE ENTRY</p><h2 id="detail-title">${escapeHtml(x.title)}</h2><p>${escapeHtml(x.description)}</p><h3>Your contribution</h3><p>${escapeHtml(x.role)}</p><h3>Process & lessons</h3><p>${escapeHtml(x.learning)}</p>${x.url?'<button class="text-button" id="detail-url">View repository / demo ↗</button>':''}`);const link=document.getElementById('detail-url');if(link)link.onclick=()=>openUrl(x.url,'Project link')});
document.querySelectorAll('[data-ctf]').forEach(el=>el.onclick=()=>{const x=p.ctfs[el.dataset.ctf];showDetail(`<p class="eyebrow">${escapeHtml(x.category)} · TEMPLATE ENTRY</p><h2 id="detail-title">${escapeHtml(x.title)}</h2><p>${escapeHtml(x.event)}</p><h3>Approach & lessons</h3><p>${escapeHtml(x.notes)}</p>${x.url?'<button class="text-button" id="detail-url">Read full write-up ↗</button>':''}`);const link=document.getElementById('detail-url');if(link)link.onclick=()=>openUrl(x.url,'Write-up link')});
document.querySelectorAll('[data-project], [data-ctf]').forEach(el => {
  el.setAttribute('aria-haspopup', 'dialog');
  el.setAttribute('aria-controls', 'detail');
});
document.querySelectorAll('[data-cert]').forEach(el=>el.onclick=()=>openUrl(p.certifications[el.dataset.cert].url,'Credential verification'));
dialog.querySelector('.close').onclick=()=>dialog.close();dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close()}});

import './motion.js';

import './theme.js';
import './navigation.js';

import './pipeline.js';
