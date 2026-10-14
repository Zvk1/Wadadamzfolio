import { pipelineGeometry, pipelineBranches, scrollProgress } from './pipeline-geometry.js';

const svg = document.querySelector('.data-flow');
let progressLines = [];
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
let pageHeight = 1;
let frame;
let layoutDirty = true;

function rebuildRoutes(width, tops) {
  const ns = 'http://www.w3.org/2000/svg';
  const defs = svg.querySelector('defs');
  const tracks = svg.querySelector('.flow-tracks');
  const progress = svg.querySelector('.flow-progress');
  const packets = svg.querySelector('.flow-packets');
  [defs, tracks, progress, packets].forEach(group => group.replaceChildren());
  const branches = pipelineBranches(width, pageHeight, tops)
    .filter((_, index) => width > 650 ? index % 4 === 0 : index === 0);
  const routes = [...pipelineGeometry(width, pageHeight, tops), ...branches];
  routes.forEach((route, index) => {
    const path = document.createElementNS(ns, 'path');
    path.id = `pipeline-route-${index}`;
    path.setAttribute('d', route);
    path.setAttribute('pathLength', '1000');
    defs.append(path);
    const use = group => {
      const element = document.createElementNS(ns, 'use');
      element.setAttribute('href', `#${path.id}`);
      if (index >= 2) element.classList.add('branch');
      group.append(element);
      return element;
    };
    use(tracks);
    if (index < 2) use(progress);
    const packet = use(packets);
    // Normalize the visible packet size and speed to actual path length so
    // long pages and short mobile branches stay equally lively.
    const length = Math.max(1, path.getTotalLength());
    const unit = 1000 / length;
    const spacing = index < 2 ? 720 : 1000;
    packet.style.setProperty('--packet-dash', `${20 * unit} ${(spacing - 20) * unit}`);
    packet.style.setProperty('--packet-cycle', String(-spacing * unit));
    packet.style.setProperty('--packet-duration', `${spacing / (58 + index % 4 * 12)}s`);
    packet.style.setProperty('--packet-delay', `${-index * 1.37}s`);
    packet.style.setProperty('--packet-direction', index % 3 === 1 ? 'reverse' : 'normal');
  });
  progressLines = [...progress.children];
}

function draw() {
  frame = null;
  if (layoutDirty) {
    const width = document.documentElement.clientWidth;
    // The absolutely positioned SVG never contributes to body layout height.
    pageHeight = document.body.offsetHeight;
    svg.setAttribute('viewBox', `0 0 ${width} ${pageHeight}`);
    const tops = [...document.querySelectorAll('main > section')]
      .map(section => section.offsetTop);
    rebuildRoutes(width, tops);
    layoutDirty = false;
  }
  const progress = scrollProgress(scrollY, innerHeight, pageHeight);
  progressLines.forEach(line => { line.style.strokeDashoffset = String(1000 * (1 - progress)); });
  svg.classList.toggle('static-pipeline', reducedMotion.matches);
}
function schedule(resize = false) {
  if (resize) layoutDirty = true;
  if (!frame) frame = requestAnimationFrame(draw);
}
window.addEventListener('scroll', () => schedule(), { passive: true });
window.addEventListener('resize', () => schedule(true), { passive: true });
reducedMotion.addEventListener('change', () => schedule());
if ('ResizeObserver' in window) new ResizeObserver(() => schedule(true)).observe(document.body);
document.fonts?.ready.then(() => schedule(true));
schedule(true);
