import { activeSectionIndex } from './active-section.js';

const links = [...document.querySelectorAll('nav a')];
const sections = links.map(link => document.querySelector(link.hash));
let pendingTarget = null;
let releaseTimer;
let scheduled = false;

function activate(index) {
  links.forEach((link, i) => {
    link.classList.toggle('active', i === index);
    if (i === index) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
}
function update() {
  scheduled = false;
  const tops = sections.map(section => section.getBoundingClientRect().top);
  const atBottom = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 3;
  if (pendingTarget !== null) {
    activate(pendingTarget);
    return;
  }
  activate(activeSectionIndex(tops, Math.min(innerHeight * .28, 220), atBottom));
}
function schedule() {
  if (!scheduled) { scheduled = true; requestAnimationFrame(update); }
}
function release() {
  pendingTarget = null;
  clearTimeout(releaseTimer);
  schedule();
}
// Highlight the destination immediately, without flickering through intervening
// sections during smooth scrolling. Manual scrolling releases that destination.
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', () => {
    const index = links.findIndex(nav => nav.hash === link.hash);
    if (index < 0) return;
    pendingTarget = index;
    activate(index);
    clearTimeout(releaseTimer);
    releaseTimer = setTimeout(release, 1800);
  });
});
window.addEventListener('scroll', schedule, { passive: true });
window.addEventListener('resize', schedule);
window.addEventListener('scrollend', release);
window.addEventListener('wheel', release, { passive: true });
window.addEventListener('touchmove', release, { passive: true });
window.addEventListener('keydown', event => {
  if (['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End', ' '].includes(event.key)) release();
});
window.addEventListener('hashchange', schedule);
update();
