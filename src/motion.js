const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const toggle = document.getElementById('motion-toggle');
let paused = false;
try { paused = localStorage.getItem('portfolio-motion') === 'paused'; } catch {}

function syncMotion() {
  const stopped = paused || reducedMotion.matches;
  document.documentElement.classList.toggle('motion-paused', stopped);
  toggle.setAttribute('aria-pressed', String(stopped));
  toggle.disabled = reducedMotion.matches;
  toggle.textContent = reducedMotion.matches ? 'Reduced motion' : paused ? 'Resume motion ▷' : 'Pause motion Ⅱ';
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
