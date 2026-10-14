// A gentle photographic warp: the shoulders stay anchored while head and gaze follow.
const photo = document.getElementById('profile-photo');
const frame = photo.closest('.profile-picture');
const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
let initialized = false;

function initPortrait() {
  if (initialized || !photo.naturalWidth) return;
  initialized = true;
  const canvas = document.createElement('canvas');
  canvas.className = 'portrait-motion';
  canvas.setAttribute('aria-hidden', 'true');
  canvas.width = canvas.height = 512;
  const gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: false, antialias: false });
  if (!gl) return; // The original accessible image remains the fallback.
  function shader(type, source) {
    const result = gl.createShader(type);
    gl.shaderSource(result, source);
    gl.compileShader(result);
    if (!gl.getShaderParameter(result, gl.COMPILE_STATUS)) throw new Error('Portrait shader unavailable');
    return result;
  }
  let program;
  try {
    program = gl.createProgram();
    gl.attachShader(program, shader(gl.VERTEX_SHADER, `
      attribute vec2 position;
      varying vec2 uv;
      void main() { uv = vec2((position.x + 1.0) * 0.5, (1.0 - position.y) * 0.5); gl_Position = vec4(position, 0.0, 1.0); }
    `));
    gl.attachShader(program, shader(gl.FRAGMENT_SHADER, `
      precision mediump float;
      varying vec2 uv;
      uniform sampler2D portrait;
      uniform vec2 look;
      float eye(vec2 p, vec2 center) {
        vec2 d = (p - center) / vec2(0.024, 0.014);
        return exp(-dot(d, d) * 1.5);
      }
      void main() {
        vec2 p = uv;
        float head = 1.0 - smoothstep(0.56, 0.85, p.y);
        float angle = look.x * 0.025 * head;
        vec2 q = p - vec2(0.5, 0.7);
        p = mat2(cos(angle), -sin(angle), sin(angle), cos(angle)) * q + vec2(0.5, 0.7);
        p -= look * vec2(0.014, 0.009) * head;
        float gaze = eye(p, vec2(0.430, 0.368)) + eye(p, vec2(0.583, 0.368));
        p -= look * vec2(0.005, 0.003) * gaze;
        if (p.x < 0.0 || p.x > 1.0 || p.y < 0.0 || p.y > 1.0) gl_FragColor = vec4(0.0);
        else gl_FragColor = texture2D(portrait, p);
      }
    `));
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
    gl.useProgram(program);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, -1,1, 1,-1, 1,1]), gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
    gl.bindTexture(gl.TEXTURE_2D, gl.createTexture());
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, photo);
  } catch { return; }
  const look = gl.getUniformLocation(program, 'look');
  let x = 0, y = 0, targetX = 0, targetY = 0, raf = 0, visible = true;
  const enabled = () => finePointer.matches && !reduced.matches && !document.hidden && visible && !document.documentElement.classList.contains('motion-paused');
  function draw() {
    gl.uniform2f(look, x, y);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }
  function animate() {
    raf = 0;
    x += (targetX - x) * 0.13;
    y += (targetY - y) * 0.13;
    draw();
    if (Math.abs(targetX - x) + Math.abs(targetY - y) > 0.001) raf = requestAnimationFrame(animate);
  }
  function reset() {
    cancelAnimationFrame(raf);
    raf = 0;
    x = y = targetX = targetY = 0;
    draw();
    frame.classList.toggle('portrait-tracking', enabled());
  }
  frame.append(canvas);
  reset();
  window.addEventListener('pointermove', event => {
    if (event.pointerType !== 'mouse' || !enabled()) return;
    const rect = frame.getBoundingClientRect();
    targetX = Math.max(-1, Math.min(1, (event.clientX - rect.left - rect.width / 2) / 420));
    targetY = Math.max(-1, Math.min(1, (event.clientY - rect.top - rect.height * 0.37) / 320));
    if (!raf) raf = requestAnimationFrame(animate);
  }, { passive: true });
  document.documentElement.addEventListener('pointerleave', reset);
  window.addEventListener('blur', reset);
  document.addEventListener('visibilitychange', reset);
  reduced.addEventListener('change', reset);
  finePointer.addEventListener('change', reset);
  let wasPaused = document.documentElement.classList.contains('motion-paused');
  new MutationObserver(() => {
    const paused = document.documentElement.classList.contains('motion-paused');
    if (paused !== wasPaused) { wasPaused = paused; reset(); }
  }).observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
  if ('IntersectionObserver' in window) new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    reset();
  }).observe(frame);
  canvas.addEventListener('webglcontextlost', event => {
    event.preventDefault();
    cancelAnimationFrame(raf);
    visible = false;
    frame.classList.remove('portrait-tracking');
  });
}
photo.addEventListener('load', initPortrait, { once: true });
if (photo.complete) initPortrait();
