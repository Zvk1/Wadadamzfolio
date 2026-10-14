const trigger = document.getElementById('theme');
const menu = document.getElementById('theme-menu');
const picker = document.querySelector('.theme-picker');
const options = [...menu.querySelectorAll('[data-theme-option]')];
const systemTheme = matchMedia('(prefers-color-scheme: dark)');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const icons = {
  auto: '<rect x="3" y="4" width="14" height="10" rx="2"/><path d="M7 17h6M10 14v3"/>',
  light: '<circle cx="10" cy="10" r="3"/><path d="M10 1v2M10 17v2M1 10h2M17 10h2M3.6 3.6 5 5M15 15l1.4 1.4M3.6 16.4 5 15M15 5l1.4-1.4"/>',
  dark: '<path d="M17 12.2A7.5 7.5 0 0 1 7.8 3a7.5 7.5 0 1 0 9.2 9.2Z"/>',
};
const icon = key => `<svg viewBox="0 0 20 20" aria-hidden="true">${icons[key]}</svg>`;
let preference = 'dark';
try { preference = localStorage.getItem('portfolio-theme') || 'dark'; } catch {}
if (!Object.hasOwn(icons, preference)) preference = 'dark';
let transitionTimer;
function applyTheme(animate = false) {
  const root = document.documentElement;
  const resolved = preference === 'auto' ? (systemTheme.matches ? 'dark' : 'light') : preference;
  if (animate && !reducedMotion.matches && root.dataset.theme !== resolved) {
    root.classList.add('theme-changing');
    clearTimeout(transitionTimer);
    transitionTimer = setTimeout(() => root.classList.remove('theme-changing'), 500);
  }
  root.dataset.theme = resolved;
  const label = preference[0].toUpperCase() + preference.slice(1);
  document.getElementById('theme-label').textContent = label;
  document.getElementById('theme-icon').innerHTML = icon(preference);
  trigger.setAttribute('aria-label', `Color theme: ${label}`);
  options.forEach(option => option.setAttribute('aria-checked', String(option.dataset.themeOption === preference)));
}
function closeMenu(restoreFocus = false) {
  menu.hidden = true;
  trigger.setAttribute('aria-expanded', 'false');
  if (restoreFocus) trigger.focus();
}
function openMenu(index = options.findIndex(option => option.dataset.themeOption === preference)) {
  menu.hidden = false;
  trigger.setAttribute('aria-expanded', 'true');
  options[index].focus();
}
options.forEach(option => {
  option.querySelector('.option-icon').innerHTML = icon(option.dataset.themeOption);
  option.addEventListener('click', () => {
    preference = option.dataset.themeOption;
    try { localStorage.setItem('portfolio-theme', preference); } catch {}
    applyTheme(true);
    closeMenu(true);
  });
});
trigger.addEventListener('click', () => menu.hidden ? openMenu() : closeMenu());
trigger.addEventListener('keydown', event => {
  if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
    event.preventDefault();
    openMenu(event.key === 'ArrowUp' ? options.length - 1 : 0);
  }
});
menu.addEventListener('keydown', event => {
  const current = options.indexOf(document.activeElement);
  let next;
  if (event.key === 'ArrowDown') next = (current + 1) % options.length;
  if (event.key === 'ArrowUp') next = (current - 1 + options.length) % options.length;
  if (event.key === 'Home') next = 0;
  if (event.key === 'End') next = options.length - 1;
  if (next !== undefined) { event.preventDefault(); options[next].focus(); }
  if (event.key === 'Escape') { event.preventDefault(); closeMenu(true); }
  if (event.key === 'Tab') { closeMenu(true); }
  const match = options.find(option => option.dataset.themeOption.startsWith(event.key.toLowerCase()));
  if (event.key.length === 1 && match) { event.preventDefault(); match.focus(); }
});
document.addEventListener('pointerdown', event => {
  if (!picker.contains(event.target)) closeMenu();
});
picker.addEventListener('focusout', event => {
  if (!picker.contains(event.relatedTarget)) closeMenu();
});
systemTheme.addEventListener('change', () => applyTheme(true));
applyTheme();
