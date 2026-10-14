const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const toggle = document.getElementById('motion-toggle');
let paused = false;
try { paused = localStorage.getItem('portfolio-motion') === 'paused'; } catch {}

function syncMotion() {
  const stopped = paused || reducedMotion.matches;
  document.documentElement.classList.toggle('motion-paused', stopped);
  toggle.setAttribute('aria-pressed', String(stopped));
  toggle.disabled = reducedMotion.matches;
  const label = reducedMotion.matches ? 'Reduced motion enabled by your device' : paused ? 'Resume motion' : 'Pause motion';
  toggle.setAttribute('aria-label', label);
  toggle.title = label;
  toggle.innerHTML = stopped
    ? '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="m7 4 9 6-9 6Z"/></svg>'
    : '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M6 4v12M14 4v12"/></svg>';
}
toggle.addEventListener('click', () => {
  paused = !paused;
  try { localStorage.setItem('portfolio-motion', paused ? 'paused' : 'running'); } catch {}
  syncMotion();
});
reducedMotion.addEventListener('change', syncMotion);
document.addEventListener('visibilitychange', () => {
  document.documentElement.classList.toggle('page-hidden', document.hidden);
});
syncMotion();

// Change playback speed without resetting the position of travelling packets.
let boostFrame;
let boostStart = 0;
function packetAnimations() {
  return [...document.querySelectorAll('.flow-packets use')].flatMap(el => el.getAnimations());
}
function resetBoost() {
  cancelAnimationFrame(boostFrame);
  packetAnimations().forEach(animation => animation.updatePlaybackRate(1));
  document.documentElement.classList.remove('flow-boosted');
}
function animateBoost(now) {
  if (paused || reducedMotion.matches || document.hidden) { resetBoost(); return; }
  const progress = Math.min((now - boostStart) / 1200, 1);
  const speed = 1 + 7 * (1 - progress) ** 3;
  packetAnimations().forEach(animation => animation.updatePlaybackRate(speed));
  if (progress < 1) boostFrame = requestAnimationFrame(animateBoost);
  else resetBoost();
}
document.addEventListener('pointerdown', event => {
  if (event.button !== 0 || event.target.closest('.display-controls') || paused || reducedMotion.matches) return;
  cancelAnimationFrame(boostFrame);
  boostStart = performance.now();
  document.documentElement.classList.add('flow-boosted');
  boostFrame = requestAnimationFrame(animateBoost);
});
toggle.addEventListener('click', resetBoost);
reducedMotion.addEventListener('change', resetBoost);
document.addEventListener('visibilitychange', () => { if (document.hidden) resetBoost(); });

// Content is visible by default, including when scripting or observers fail.
if ('IntersectionObserver' in window && !reducedMotion.matches) {
  const reveal = new IntersectionObserver(entries => {
    entries.forEach(({ target, isIntersecting }) => {
      if (!isIntersecting) return;
      target.classList.add('revealed');
      reveal.unobserve(target);
    });
  }, { threshold: 0.08 });
  document.querySelectorAll('main > section:not(.hero)').forEach(section => {
    section.classList.add('reveal');
    reveal.observe(section);
  });
  reducedMotion.addEventListener('change', () => {
    if (reducedMotion.matches) {
      document.querySelectorAll('.reveal').forEach(el => el.classList.add('revealed'));
      reveal.disconnect();
    }
  });
}
