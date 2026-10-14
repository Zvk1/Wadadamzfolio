import './content.js';
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
}
document.title='Zaki Boongaling - Portfolio';
document.getElementById('year').textContent=new Date().getFullYear();
const visuals={network:'<path d="M20 22L70 22L45 68Z"/><path d="M20 22L20 68L70 68L70 22M20 68L45 45L70 68"/><circle cx="20" cy="22" r="6"/><circle cx="70" cy="22" r="6"/><circle cx="45" cy="45" r="6"/><circle cx="20" cy="68" r="6"/><circle cx="70" cy="68" r="6"/>',chip:'<rect x="25" y="25" width="40" height="40" rx="3"/><rect x="34" y="34" width="22" height="22"/><path d="M33 15V25M45 15V25M57 15V25M33 65V75M45 65V75M57 65V75M15 33H25M15 45H25M15 57H25M65 33H75M65 45H75M65 57H75"/>',terminal:'<rect x="10" y="20" width="70" height="51" rx="4"/><path d="M10 32H80M22 44L31 51L22 58M39 59H57"/><circle cx="18" cy="26" r="1"/><circle cx="24" cy="26" r="1"/>'};
document.getElementById('project-list').innerHTML=p.projects.map((x,i)=>`<article class="project"><div class="project-visual"><span class="visual-number">${escapeHtml(x.number)}</span><svg viewBox="0 0 90 90" aria-hidden="true">${visuals[x.visual]||visuals.terminal}</svg></div><div><div class="project-category">${escapeHtml(x.category)}</div><h3><button data-project="${i}">${escapeHtml(x.title)} <span>↗</span></button></h3><p>${escapeHtml(x.description)}</p><div class="tags">${x.tags.map(t=>`<span>${escapeHtml(t)}</span>`).join('')}</div></div></article>`).join('');
document.getElementById('ctf-list').innerHTML=p.ctfs.map((x,i)=>`<button class="ctf-row" data-ctf="${i}"><span><strong>${escapeHtml(x.title)} ↗</strong><small>${escapeHtml(x.event)}</small></span><span>${escapeHtml(x.category)}</span><span>${escapeHtml(x.status)}</span></button>`).join('');
document.getElementById('cert-list').innerHTML=p.certifications.map((x,i)=>`<article class="cert"><span class="cert-icon" aria-hidden="true">◇</span><div class="cert-info"><h3>${escapeHtml(x.title)}</h3><p>${escapeHtml(x.issuer)} · ${escapeHtml(x.date)}</p></div><button data-cert="${i}">${x.url?'Verify ↗':escapeHtml(x.status)}</button></article>`).join('');
let toastTimer;const toast=message=>{const el=document.getElementById('toast');el.textContent=message;el.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('show'),4000)};
function openUrl(url,label){if(!url){toast(label+' is a placeholder. Add it in content.js.');return}try{const u=new URL(url,location.href);if(!['https:','http:','mailto:'].includes(u.protocol))throw Error();if(u.protocol==='mailto:')location.href=u.href;else window.open(u.href,'_blank','noopener,noreferrer')}catch{toast('Add a valid URL in content.js.')}}
document.querySelectorAll('[data-link]').forEach(el=>{const k=el.dataset.link;if(k==='email'&&p.links.email)el.firstChild.textContent=p.links.email+' ';el.addEventListener('click',()=>openUrl(k==='email'&&p.links.email?'mailto:'+p.links.email:p.links[k],k==='resume'?'Résumé':k))});
const dialog=document.getElementById('detail');const showDetail=html=>{document.getElementById('detail-content').innerHTML=html;dialog.showModal()};
document.querySelectorAll('[data-project]').forEach(el=>el.onclick=()=>{const x=p.projects[el.dataset.project];showDetail(`<p class="eyebrow">${escapeHtml(x.category)} · TEMPLATE ENTRY</p><h2 id="detail-title">${escapeHtml(x.title)}</h2><p>${escapeHtml(x.description)}</p><h3>Your contribution</h3><p>${escapeHtml(x.role)}</p><h3>Process & lessons</h3><p>${escapeHtml(x.learning)}</p><button class="text-button" id="detail-url">View repository / demo ↗</button>`);document.getElementById('detail-url').onclick=()=>openUrl(x.url,'Project link')});
document.querySelectorAll('[data-ctf]').forEach(el=>el.onclick=()=>{const x=p.ctfs[el.dataset.ctf];showDetail(`<p class="eyebrow">${escapeHtml(x.category)} · TEMPLATE ENTRY</p><h2 id="detail-title">${escapeHtml(x.title)}</h2><p>${escapeHtml(x.event)}</p><h3>Approach & lessons</h3><p>${escapeHtml(x.notes)}</p><button class="text-button" id="detail-url">Read full write-up ↗</button>`);document.getElementById('detail-url').onclick=()=>openUrl(x.url,'Write-up link')});
document.querySelectorAll('[data-cert]').forEach(el=>el.onclick=()=>openUrl(p.certifications[el.dataset.cert].url,'Credential verification'));
dialog.querySelector('.close').onclick=()=>dialog.close();dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close()}});

import './motion.js';

import './theme.js';
import './navigation.js';

import './pipeline.js';
