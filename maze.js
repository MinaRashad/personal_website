/* ============================================================
   SPACE MAZE v2
   - Edit MAZE below to add rooms/exits: positions on the sector
     map are worked out automatically from the exits.
   - `theme` is the sector's accent colour, `hum` its ambient note (Hz).
   ============================================================ */
'use strict';

const MAZE = {
  rooms: {
    'about_node': {
      type: 'room',
      name: 'About Mina',
      desc: 'The personal archives of Mina Eskandar. Biometric data and history stored here.',
      image: 'icons/planets/planet-1-a-export.gif',
      href: 'About/index.html',
      theme: '#7a6aee', hum: 110,
      exits: {
        north: { to: 'museum_node', note: 'The Museum' },
        south: { to: 'blog_node', note: 'Terminal Log' },
        east: { to: 'projects_node_1', note: 'Projects' },
        west: { to: 'chat_node', note: 'Live Chat' }
      }
    },
    'chat_node': {
      type: 'room',
      name: 'Live Chat',
      desc: 'Check transmission from travelers and crew members.',
      image: 'icons/message.png',
      href: 'Chat/index.html',
      theme: '#4dd0ff', hum: 146.8,
      exits: {
        east: { to: 'about_node', note: 'Back to Archive' }
      }
    },
    'museum_node': {
      type: 'corridor',
      name: 'The Museum',
      desc: 'A collection of artifacts, digital and physical, that define my trajectory.',
      theme: '#ffb454', hum: 130.8,
      exits: {
        south: { to: 'about_node', note: 'Back to Archive' },
        west: { to: 'museum_books_node', note: 'Books' },
        north: { to: 'museum_websites_node', note: 'Websites' }
      }
    },
    'museum_books_node': {
      type: 'room',
      name: 'Books',
      desc: 'De-serialized data in paper format. The foundations of my knowledge base.',
      image: 'icons/book.png',
      href: 'Museum/Books/index.html',
      theme: '#f4a261', hum: 138.6,
      exits: {
        east: { to: 'museum_node', note: 'The Museum' },
        north: { to: 'museum_apps_node', note: 'Apps' }
      }
    },
    'museum_apps_node': {
      type: 'room',
      name: 'Apps',
      desc: 'Essential software, creative workstations, and mobile utilities.',
      image: 'icons/selfhost_apps.png',
      href: 'Museum/Apps/index.html',
      theme: '#e9c46a', hum: 155.6,
      exits: {
        south: { to: 'museum_books_node', note: 'Books' },
        east: { to: 'museum_websites_node', note: 'Websites' }
      }
    },
    'museum_websites_node': {
      type: 'room',
      name: 'Websites',
      desc: 'Nodes of interest in the global network.',
      image: 'icons/websites.png',
      href: 'Museum/Websites/index.html',
      theme: '#e76f51', hum: 146.8,
      exits: {
        south: { to: 'museum_node', note: 'The Museum' },
        west: { to: 'museum_apps_node', note: 'Apps' },
        north: { to: 'museum_games_node', note: 'Games' }
      }
    },
    'museum_games_node': {
      type: 'room',
      name: 'Games',
      desc: 'Immersive virtual realms, narrative thrillers, and legendary adventures.',
      image: 'icons/game.gif',
      href: 'Museum/Games/index.html',
      theme: '#f39c12', hum: 164.8,
      exits: {
        south: { to: 'museum_websites_node', note: 'Websites' }
      }
    },
    'projects_node_1': {
      type: 'corridor',
      name: 'Projects',
      desc: 'A collection of various projects, experiments, and investigations.',
      theme: '#5ee6a8', hum: 164.8,
      exits: {
        north: { to: 'incident_node', note: 'INCIDENT' },
        south: { to: 'homelabbing_node', note: 'Homelab' },
        east: { to: 'folklored_node', note: 'Silly Projects ⚠️' },
        west: { to: 'about_node', note: 'About' }
      }
    },
    'Cards of Fate': {
      type: 'room',
      name: 'Cards of Fate',
      image: 'icons/cards.png',
      desc: 'Using the latest cutting-edge science of the Quantum divination matrix and Aether Resonance, The Cards of Fate will reveal knowledge about any situation, person or object. Simply focus on your question before drawing and go inside to see the truth.',
      href: 'Projects/CardsOfFate/CoK.html',
      theme: '#d46bff', hum: 196,
      exits: {
          west: { to: 'folklored_node', note: 'Back to Cards' },
          north: { to: 'cyber_rat_node', note: 'Cyber-Rat Labyrinth' },


      }
    },
    'folklored_node': {
      type: 'room',
      name: "folklor'ed",
      image: "Projects/folklor'ed/folklored.icon.png",
      desc: "[ DATA_RECOVERY: SUCCESS ] A corrupted combat reflex trainer salvaged from a pre-collapse arcade cabinet. The logic gate is stuck in an infinite loop—difficulty parameters are redlining and the system architecture is destabilizing. Connect your neural interface and see if your organic hardware can keep pace with the overclocked code.",
      href: "Projects/folklor'ed/index.html",
      theme: '#ff5d7a', hum: 220,
      exits: {
        west: { to: 'projects_node_1', note: 'Go Back' },
        east: { to: 'Cards of Fate', note: "Cards of Fate" }
      }
    },
    'cyber_rat_node': {
      type: 'room',
      name: 'Cyber-Rat Labyrinth',
      image: 'icons/punk_rat.png',
      desc: 'A simulated reality where a silicon-based rodent must navigate a procedurally generated maze using experimental search heuristics. Warning: Rodent may become self-aware.',
      href: 'Projects/Micromous_sim/index.html',
      theme: '#b4ff5c', hum: 174.6,
      exits: {
        south: { to: 'Cards of Fate', note: 'Back to Cards' }
      }
    },
    'blog_node': {
      type: 'room',
      name: 'Terminal Logs',
      desc: 'Access decentralized data logs and personal transmissions.',
      image: 'icons/Logs.png',
      href: 'Blog/index.html',
      theme: '#46e0c8', hum: 123.5,
      exits: {
        north: { to: 'about_node', note: 'Archive' },
        south: { to: 'neighbours_node', note: 'Net Neighbours' }
      }
    },
    'neighbours_node': {
      type: 'room',
      name: 'Net Neighbours',
      desc: 'Nearby nodes in the decentralized web.',
      image: 'icons/heart.png',
      href: 'Neighbours/index.html',
      theme: '#ff7eb6', hum: 138.6,
      exits: {
        north: { to: 'blog_node', note: 'Back to Logs' }
      }
    },
    'incident_node': {
      type: 'room',
      name: 'Project INCIDENT',
      desc: 'A terminal-based investigation puzzle game. Cross-reference documents, chat logs, and internal records to find contradictions. Some files are password protected.',
      image: 'icons/incident.png',
      href: 'Projects/INCIDENT/index.html',
      theme: '#ff4545', hum: 98,
      exits: {
        south: { to: 'projects_node_1', note: 'Projects' },
      }
    },
    'homelabbing_node': {
      type: 'room',
      name: 'Homelabbing',
      desc: 'Infrastructure and automation projects. Content pending transmission.',
      image: 'icons/download_the_internet.png',
      href: 'Projects/Homelabbing/index.html',
      theme: '#5cff8a', hum: 185,
      exits: {
        north: { to: 'projects_node_1', note: 'Projects' },
      }
    },

    /* ---- Secret sector -------------------------------------------------
       Hidden until the visitor charts every other sector (or enters the
       Konami code). It then appears as an extra exit WEST of Live Chat.
       Give it an `href` to turn it into a real page.                     */
    'signal_node': {
      type: 'room',
      hidden: true,
      name: 'Dead Signal',
      desc: 'An unlisted frequency. Whoever left this transmission wanted it found.',
      image: 'icons/key.png',
      href: null,
      theme: '#ff2bd6', hum: 82.4,
      exits: {
        east: { to: 'chat_node', note: 'Back to Live Chat' }
      }
    }
  }
};

// Where the secret door appears once it is unlocked
const SECRET_EXIT = { from: 'chat_node', dir: 'west', to: 'signal_node', note: '??? Signal' };

window.MAZE_CONFIG = {
  panMs: 650,          // sector-to-sector camera move
  jumpMs: 950,         // teleport (terminal / minimap / R)
  neighborScale: 0.45  // size of distant sectors
};
const CFG = window.MAZE_CONFIG;

/* ============================================================
   Helpers
   ============================================================ */
const $ = (sel, root = document) => root.querySelector(sel);
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const sleep = ms => new Promise(r => setTimeout(r, ms));
const DIRS = { north: [0, -1], south: [0, 1], east: [1, 0], west: [-1, 0] };
const OPP = { north: 'south', south: 'north', east: 'west', west: 'east' };
const KEYCAP = { north: 'W', south: 'S', east: 'D', west: 'A' };
const RM = window.matchMedia('(prefers-reduced-motion: reduce)');

const store = {
  get(k, d) { try { const v = window.localStorage.getItem(k); return v === null ? d : v; } catch (e) { return d; } },
  set(k, v) { try { window.localStorage.setItem(k, v); } catch (e) { /* private mode */ } }
};

function hexToRgb(hex) {
  const n = parseInt(hex.replace('#', ''), 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}
const roomColor = id => (MAZE.rooms[id] && MAZE.rooms[id].theme) || '#7a6aee';

/* ============================================================
   Map coordinates, derived from the exits
   (north = -y, east = +x). A room only needs one connection to a
   positioned room to get placed, so hidden rooms work too.
   ============================================================ */
const POS = { about_node: [0, 0] };
(function computeCoords() {
  let changed = true, guard = 0;
  while (changed && guard++ < 100) {
    changed = false;
    for (const [id, room] of Object.entries(MAZE.rooms)) {
      for (const [dir, ex] of Object.entries(room.exits || {})) {
        const [ux, uy] = DIRS[dir];
        if (POS[id] && !POS[ex.to]) { POS[ex.to] = [POS[id][0] + ux, POS[id][1] + uy]; changed = true; }
        else if (!POS[id] && POS[ex.to]) { POS[id] = [POS[ex.to][0] - ux, POS[ex.to][1] - uy]; changed = true; }
      }
    }
  }
  // Warn about maps that can't be drawn on a flat grid
  for (const [id, room] of Object.entries(MAZE.rooms)) {
    if (!POS[id]) console.warn(`[maze] "${id}" is not connected to the map`);
    for (const [dir, ex] of Object.entries(room.exits || {})) {
      const [ux, uy] = DIRS[dir];
      const p = POS[id], q = POS[ex.to];
      if (p && q && (p[0] + ux !== q[0] || p[1] + uy !== q[1])) {
        console.warn(`[maze] "${id}" → ${dir} → "${ex.to}" doesn't line up with the grid`);
      }
    }
  }
})();

/* ============================================================
   State
   ============================================================ */
let signalUnlocked = store.get('maze.signal', '0') === '1';
function applyUnlock() {
  MAZE.rooms[SECRET_EXIT.from].exits[SECRET_EXIT.dir] = { to: SECRET_EXIT.to, note: SECRET_EXIT.note };
}
if (signalUnlocked) applyUnlock();

let currentId = 'about_node';
{
  const saved = store.get('currentRoomId', null);
  if (saved && MAZE.rooms[saved] && (!MAZE.rooms[saved].hidden || signalUnlocked)) currentId = saved;
}

let visited = new Set();
try {
  JSON.parse(store.get('maze.visited', '[]')).forEach(id => { if (MAZE.rooms[id]) visited.add(id); });
} catch (e) { /* corrupted value, start fresh */ }
visited.add(currentId);

let busy = false;      // a move/jump/dock is running
let queued = null;     // one buffered move, so fast typing feels snappy
let swipedAt = 0;

const room = (id = currentId) => MAZE.rooms[id];
const saveVisited = () => store.set('maze.visited', JSON.stringify([...visited]));
const visibleIds = () => Object.keys(MAZE.rooms).filter(id => !MAZE.rooms[id].hidden);

/* ============================================================
   DOM references
   ============================================================ */
const rootEl = document.documentElement;
const stage = $('#stage');
const parallax = $('#parallax');
const world = $('#world');
const labelsEl = $('#labels');
const nebula = $('#nebula');
const elName = $('#info-name');
const elCoord = $('#info-coord');
const elDesc = $('#info-desc');
const btnEnter = $('#info-enter');
const locName = $('#loc-name');
const mapCount = $('#map-count');
const toastEl = $('#toast');
const srEl = $('#sr');
const flashEl = $('#flash');
const dockLine = $('#dock-line');

/* ============================================================
   Layout (sizes adapt to the viewport)
   ============================================================ */
const M = { card: 200, dx: 380, dy: 270 };
function calcLayout() {
  const vw = window.innerWidth, vh = window.innerHeight;
  M.card = Math.round(clamp(Math.min(vw, vh) * 0.28, 128, 200));
  M.dx = Math.round(Math.min(vw * 0.36, Math.max(M.card * 1.5, Math.min(vw * 0.3, 520))));
  M.dy = Math.round(Math.min(vh * 0.36, Math.max(M.card * 1.35, Math.min(vh * 0.3, 380))));
  if (vw <= 700) M.dy = Math.round(Math.min(M.dy, vh * 0.26)); // phones: leave room for the info panel
  rootEl.style.setProperty('--card', M.card + 'px');
  rootEl.style.setProperty('--pan', (RM.matches ? 1 : CFG.panMs) + 'ms');
}

/* ============================================================
   Sound: a quiet synthesised drone per sector + little blips.
   Starts on the first key press / click (browser rule).
   ============================================================ */
const Sound = (() => {
  let ctx = null, master = null, filt = null, started = false;
  let pad = [];
  let enabled = store.get('maze.sound', 'on') !== 'off';
  let humTarget = 110;
  const VOL = 0.07;

  function init() {
    if (started) { if (ctx && ctx.state === 'suspended') ctx.resume(); return; }
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    started = true;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 0;
    master.connect(ctx.destination);

    filt = ctx.createBiquadFilter();
    filt.type = 'lowpass'; filt.frequency.value = 700; filt.Q.value = 2;
    filt.connect(master);

    const lfo = ctx.createOscillator(), lfoGain = ctx.createGain();
    lfo.frequency.value = 0.07; lfoGain.gain.value = 220;
    lfo.connect(lfoGain); lfoGain.connect(filt.frequency); lfo.start();

    // [frequency multiplier, wave, detune (cents), level]
    [[1, 'sine', 0, 0.5], [1.5, 'triangle', 4, 0.26], [2, 'sine', -5, 0.2], [0.5, 'sine', 0, 0.45]].forEach(([m, type, det, lvl]) => {
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.type = type; o.detune.value = det; g.gain.value = lvl;
      o.frequency.value = humTarget * m;
      o.connect(g); g.connect(filt); o.start();
      pad.push({ o, m });
    });
    applyVolume();
  }

  function applyVolume() {
    if (!ctx) return;
    master.gain.cancelScheduledValues(ctx.currentTime);
    master.gain.linearRampToValueAtTime(enabled ? VOL : 0, ctx.currentTime + 0.8);
  }

  function setHum(freq) {
    humTarget = freq || 110;
    if (!ctx) return;
    pad.forEach(p => p.o.frequency.setTargetAtTime(humTarget * p.m, ctx.currentTime, 0.5));
  }

  function blip(freq, dur = 0.12, type = 'square', gain = 0.05, delay = 0, slideTo = null) {
    if (!ctx || !enabled) return;
    const t = ctx.currentTime + delay;
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = type; o.frequency.setValueAtTime(freq, t);
    if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t + dur);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(gain, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(ctx.destination);
    o.start(t); o.stop(t + dur + 0.02);
  }

  return {
    init,
    get enabled() { return enabled; },
    setHum,
    toggle(on) {
      enabled = on === undefined ? !enabled : !!on;
      store.set('maze.sound', enabled ? 'on' : 'off');
      applyVolume();
      refreshSoundButton();
      return enabled;
    },
    arrive() { blip(660, 0.08, 'square', 0.035); blip(990, 0.1, 'square', 0.03, 0.07); },
    deny()   { blip(110, 0.14, 'sawtooth', 0.05, 0, 70); },
    dock()   { blip(180, 0.85, 'sawtooth', 0.04, 0, 1800); },
    chime()  { [523, 659, 784, 1047].forEach((f, i) => blip(f, 0.5, 'triangle', 0.06, i * 0.11)); }
  };
})();

// function swoosh() {
//   if (!Sound.enabled) return;
//   try { transitionSfx.currentTime = 0; const p = transitionSfx.play(); if (p && p.catch) p.catch(() => {}); } catch (e) { /* ignore */ }
// }

function refreshSoundButton() {
  const b = $('#btn-sound');
  b.textContent = `[M] SOUND: ${Sound.enabled ? 'ON' : 'OFF'}`;
  b.setAttribute('aria-pressed', String(Sound.enabled));
}

/* ============================================================
   Starfield + warp (one canvas, one animation loop)
   ============================================================ */
const space = $('#space');
const sctx = space.getContext('2d');
const mapCanvas = $('#minimap');
const mctx = mapCanvas.getContext('2d');
let W = 0, H = 0, DPR = 1, stars = [];
let warp = { mode: null, dx: 0, dy: 0, t0: 0, dur: 1 };
let tint = hexToRgb(roomColor(currentId));
let tintTarget = { ...tint };
const mouse = { x: 0, y: 0, sx: 0, sy: 0 };

function resizeSpace() {
  W = window.innerWidth; H = window.innerHeight;
  DPR = Math.min(window.devicePixelRatio || 1, 2);
  space.width = Math.round(W * DPR);
  space.height = Math.round(H * DPR);
  sctx.setTransform(DPR, 0, 0, DPR, 0, 0);

  const mdpr = DPR;
  const cssW = mapCanvas.clientWidth || 172, cssH = mapCanvas.clientHeight || 132;
  mapCanvas.width = Math.round(cssW * mdpr);
  mapCanvas.height = Math.round(cssH * mdpr);
  mctx.setTransform(mdpr, 0, 0, mdpr, 0, 0);

  const n = clamp(Math.round(W * H / 3800), 140, 520);
  stars = Array.from({ length: n }, () => ({
    x: Math.random() * W, y: Math.random() * H,
    z: 0.25 + Math.random() * 0.75,
    ph: Math.random() * 6.28, sp: 0.5 + Math.random() * 1.5,
    tint: Math.random() < 0.28
  })).sort((a, b) => a.tint - b.tint); // plain stars first, tinted last → fewer colour switches
}

function startWarp(mode, dir, dur) {
  if (RM.matches) return;
  warp = { mode, dx: dir ? dir[0] : 0, dy: dir ? dir[1] : 0, t0: performance.now(), dur };
}

let lastFrame = performance.now();
function frame(now) {
  const dt = Math.min(0.05, (now - lastFrame) / 1000);
  lastFrame = now;

  // warp intensity 0..1 (smooth in, smooth out)
  let w = 0;
  if (warp.mode) {
    const p = (now - warp.t0) / warp.dur;
    if (p >= 1) warp.mode = null; else w = Math.pow(Math.sin(Math.PI * p), 1.1);
  }

  // ease the star tint toward the current sector colour
  const k = Math.min(1, dt * 3.5);
  tint.r += (tintTarget.r - tint.r) * k;
  tint.g += (tintTarget.g - tint.g) * k;
  tint.b += (tintTarget.b - tint.b) * k;

  // ease the mouse parallax
  const pk = Math.min(1, dt * 3);
  mouse.sx += (mouse.x - mouse.sx) * pk;
  mouse.sy += (mouse.y - mouse.sy) * pk;
  if (!RM.matches) {
    parallax.style.transform = `translate3d(${(-mouse.sx * 14).toFixed(2)}px, ${(-mouse.sy * 9).toFixed(2)}px, 0)`;
    nebula.style.transform = `translate3d(${(-mouse.sx * 3).toFixed(2)}px, ${(-mouse.sy * 2).toFixed(2)}px, 0)`;
  }

  // ---- stars ----
  sctx.clearRect(0, 0, W, H);
  const cx = W / 2, cy = H / 2;
  const speed = 2600 * w;
  const plain = 'rgb(214,222,255)';
  const tinted = `rgb(${Math.round(tint.r * 0.65 + 255 * 0.35)},${Math.round(tint.g * 0.65 + 255 * 0.35)},${Math.round(tint.b * 0.65 + 255 * 0.35)})`;
  let lastTint = null;

  for (let i = 0; i < stars.length; i++) {
    const s = stars[i];
    let vx = -6 * s.z, vy = 0; // idle drift
    if (warp.mode === 'dir') { vx += -warp.dx * speed * s.z; vy += -warp.dy * speed * s.z; }
    else if (warp.mode === 'radial') { vx += (s.x - cx) * w * 4 * s.z; vy += (s.y - cy) * w * 4 * s.z; }
    s.x += vx * dt; s.y += vy * dt;

    if (warp.mode === 'radial') {
      if (s.x < -20 || s.x > W + 20 || s.y < -20 || s.y > H + 20) {
        // respawn anywhere, so the field is still evenly spread when the jump ends
        s.x = Math.random() * W;
        s.y = Math.random() * H;
      }
    } else {
      if (s.x < -60) s.x += W + 120; else if (s.x > W + 60) s.x -= W + 120;
      if (s.y < -60) s.y += H + 120; else if (s.y > H + 60) s.y -= H + 120;
    }

    const px = s.x - mouse.sx * (3 + 9 * s.z);
    const py = s.y - mouse.sy * (2 + 6 * s.z);
    let a = (0.35 + 0.65 * s.z) * (0.75 + 0.25 * Math.sin(now * 0.001 * s.sp + s.ph));
    if (w > 0) a = Math.min(1, a + w * 0.4);

    if (lastTint !== s.tint) {
      lastTint = s.tint;
      sctx.fillStyle = sctx.strokeStyle = s.tint ? tinted : plain;
    }
    sctx.globalAlpha = a;

    if (w < 0.03) {
      const size = s.z > 0.8 ? 2 : 1;
      sctx.fillRect(Math.round(px), Math.round(py), size, size);
    } else {
      sctx.lineWidth = 0.6 + s.z * 1.1;
      sctx.beginPath();
      sctx.moveTo(px, py);
      sctx.lineTo(px - vx * 0.04, py - vy * 0.04);
      sctx.stroke();
    }
  }
  sctx.globalAlpha = 1;

  drawMap(now);
  requestAnimationFrame(frame);
}

/* ============================================================
   Minimap with fog of war
   ============================================================ */
let mapHits = [];
function discoveredSet() {
  const d = new Set(visited);
  visited.forEach(id => Object.values(room(id).exits || {}).forEach(ex => d.add(ex.to)));
  d.add(currentId);
  return d;
}

function drawMap(now) {
  const cw = mapCanvas.clientWidth, ch = mapCanvas.clientHeight;
  if (!cw || !ch) return;
  mctx.clearRect(0, 0, cw, ch);

  const disc = [...discoveredSet()].filter(id => POS[id]);
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  disc.forEach(id => {
    minX = Math.min(minX, POS[id][0]); maxX = Math.max(maxX, POS[id][0]);
    minY = Math.min(minY, POS[id][1]); maxY = Math.max(maxY, POS[id][1]);
  });
  const cols = maxX - minX, rows = maxY - minY;
  const pad = 16;
  const sp = Math.min(44, cols ? (cw - pad * 2) / cols : 44, rows ? (ch - pad * 2) / rows : 44);
  const ox = cw / 2 - ((minX + maxX) / 2) * sp;
  const oy = ch / 2 - ((minY + maxY) / 2) * sp;
  const at = id => [ox + POS[id][0] * sp, oy + POS[id][1] * sp];

  // links (only where at least one end has been visited)
  const drawn = new Set();
  mctx.lineWidth = 1;
  disc.forEach(id => {
    Object.values(room(id).exits || {}).forEach(ex => {
      if (!POS[ex.to]) return;
      const key = [id, ex.to].sort().join('|');
      if (drawn.has(key)) return;
      if (!(visited.has(id) || visited.has(ex.to))) return;
      drawn.add(key);
      const [x1, y1] = at(id), [x2, y2] = at(ex.to);
      mctx.strokeStyle = 'rgba(128,128,192,0.45)';
      mctx.beginPath(); mctx.moveTo(x1, y1); mctx.lineTo(x2, y2); mctx.stroke();
    });
  });

  mapHits = [];
  const half = Math.max(4, Math.min(7, sp * 0.28));
  disc.forEach(id => {
    const [x, y] = at(id);
    const r = room(id);
    const known = visited.has(id);
    if (known) {
      mctx.fillStyle = roomColor(id);
      mctx.globalAlpha = id === currentId ? 1 : 0.8;
      if (r.type === 'room') mctx.fillRect(Math.round(x - half), Math.round(y - half), half * 2, half * 2);
      else { mctx.beginPath(); mctx.arc(x, y, half, 0, 6.283); mctx.fill(); }
      mctx.globalAlpha = 1;
      mapHits.push({ id, x, y, r: half + 3 });
    } else {
      mctx.strokeStyle = '#4e4e72';
      mctx.setLineDash([2, 2]);
      mctx.strokeRect(Math.round(x - half) + 0.5, Math.round(y - half) + 0.5, half * 2, half * 2);
      mctx.setLineDash([]);
      mctx.fillStyle = '#4e4e72';
      mctx.font = '8px Pixel, monospace';
      mctx.textAlign = 'center'; mctx.textBaseline = 'middle';
      mctx.fillText('?', x, y + 1);
    }
  });

  // "you are here" ring
  if (POS[currentId]) {
    const [x, y] = at(currentId);
    const pulse = half + 3 + Math.sin(now * 0.004) * 1.6;
    mctx.strokeStyle = '#fff';
    mctx.lineWidth = 1;
    mctx.strokeRect(Math.round(x - pulse) + 0.5, Math.round(y - pulse) + 0.5, pulse * 2, pulse * 2);
  }
}

function updateCount() {
  const ids = visibleIds().concat(signalUnlocked ? ['signal_node'] : []);
  const v = ids.filter(id => visited.has(id)).length;
  mapCount.textContent = `CHARTED ${v}/${ids.length}`;
}

/* ============================================================
   Building the world around the current sector
   ============================================================ */
function makeCell(id, cx, cy, mode, dir) {
  const r = room(id);
  const cell = document.createElement('div');
  cell.className = `cell ${mode} ${r.type === 'room' ? 'is-room' : 'is-hub'}` + (visited.has(id) ? '' : ' unknown');
  cell.dataset.room = id;
  if (dir) cell.dataset.dir = dir;
  cell.style.setProperty('--cx', cx + 'px');
  cell.style.setProperty('--cy', cy + 'px');
  cell.style.setProperty('--ca', roomColor(id));
  cell.style.setProperty('--s', mode === 'current' ? 1 : CFG.neighborScale);
  cell.style.setProperty('--o', mode === 'current' ? 1 : 0.62);

  const shell = document.createElement('div'); shell.className = 'shell';
  const card = document.createElement('div'); card.className = 'card';

  if (r.type === 'room') {
    const img = document.createElement('img');
    img.className = 'icon'; img.alt = ''; img.draggable = false; img.src = r.image;
    card.appendChild(img);
    const prompt = document.createElement('div');
    prompt.className = 'enter-prompt'; prompt.textContent = '[ Press Enter ]';
    card.appendChild(prompt);
  } else {
    card.insertAdjacentHTML('beforeend',
      '<svg class="hub" viewBox="0 0 64 64" aria-hidden="true">' +
      '<circle class="ring" cx="32" cy="32" r="22" fill="none" stroke="currentColor" stroke-width="2" stroke-dasharray="4 5"/>' +
      '<circle cx="32" cy="32" r="6" fill="currentColor"/>' +
      '<path d="M32 4v14M32 46v14M4 32h14M46 32h14" stroke="currentColor" stroke-width="2"/></svg>');
    const cap = document.createElement('div');
    cap.className = 'cap'; cap.textContent = 'Junction';
    card.appendChild(cap);
  }
  shell.appendChild(card);
  cell.appendChild(shell);
  return cell;
}

function makeLabel(dir, ex, cx, cy, isNew) {
  const b = document.createElement('button');
  b.type = 'button';
  b.className = 'label';
  b.dataset.dir = dir;
  b.style.left = cx + 'px';
  b.style.top = Math.round(cy + M.card * CFG.neighborScale / 2 + 12) + 'px';
  b.setAttribute('aria-label', `Travel ${dir} to ${ex.note || MAZE.rooms[ex.to].name}`);
  const key = document.createElement('span'); key.className = 'key'; key.textContent = KEYCAP[dir];
  b.appendChild(key);
  b.appendChild(document.createTextNode(ex.note || MAZE.rooms[ex.to].name || ''));
  if (isNew) {
    const n = document.createElement('span'); n.className = 'new'; n.textContent = 'NEW';
    b.appendChild(n);
  }
  return b;
}

function makeLane(dir, keep) {
  const lane = document.createElement('div');
  const horiz = dir === 'east' || dir === 'west';
  const sign = (dir === 'east' || dir === 'south') ? 1 : -1;
  const near = M.card / 2 + 8;
  const far = (horiz ? M.dx : M.dy) - M.card * CFG.neighborScale / 2 - 8;
  const len = Math.max(10, far - near);
  lane.className = `lane ${horiz ? 'h' : 'v'}${sign < 0 ? ' rev' : ''}${keep ? ' keep' : ''}`;
  lane.dataset.dir = dir;
  if (horiz) {
    lane.style.left = (sign > 0 ? near : -near - len) + 'px';
    lane.style.top = '0px';
    lane.style.width = len + 'px';
  } else {
    lane.style.top = (sign > 0 ? near : -near - len) + 'px';
    lane.style.left = '0px';
    lane.style.height = len + 'px';
  }
  return lane;
}

function buildWorld(id, keepDir = null) {
  world.replaceChildren();
  labelsEl.replaceChildren();
  const r = room(id);

  Object.entries(r.exits || {}).forEach(([dir, ex]) => {
    world.appendChild(makeLane(dir, dir === keepDir));
  });
  world.appendChild(makeCell(id, 0, 0, 'current', null));

  Object.entries(r.exits || {}).forEach(([dir, ex]) => {
    const [ux, uy] = DIRS[dir];
    const cx = ux * M.dx, cy = uy * M.dy;
    const cell = makeCell(ex.to, cx, cy, 'neighbor', dir);
    if (dir === keepDir) cell.classList.add('keep');
    world.appendChild(cell);
    labelsEl.appendChild(makeLabel(dir, ex, cx, cy, !visited.has(ex.to)));
  });
}

/* ============================================================
   Info panel, theme, announcements
   ============================================================ */
let typeToken = 0;
function typeInto(el, text) {
  const token = ++typeToken;
  if (RM.matches) { el.textContent = text; return; }
  const total = clamp(text.length * 11, 250, 1100);
  const t0 = performance.now();
  (function step(now) {
    if (token !== typeToken) return;
    const p = clamp((now - t0) / total, 0, 1);
    el.textContent = text.slice(0, Math.ceil(text.length * p));
    if (p < 1) requestAnimationFrame(step);
  })(t0);
}

const signed = n => (n > 0 ? '+' : '') + n;

function updatePanel(id) {
  const r = room(id);
  const name = r.name || 'Transit Sector';
  elName.textContent = name;
  elName.classList.remove('glitch'); void elName.offsetWidth; elName.classList.add('glitch');
  const p = POS[id] || [0, 0];
  elCoord.textContent = `X:${signed(p[0])} Y:${signed(p[1])}`;
  const desc = r.desc || 'Transit sector. Choose a heading.';
  typeInto(elDesc, desc);
  btnEnter.hidden = r.type !== 'room';
  btnEnter.textContent = r.href ? '[ ENTER ] ACCESS' : '[ ENTER ] DECODE';
  locName.textContent = name.toUpperCase();

  const exits = Object.entries(r.exits || {}).map(([d, ex]) => `${d}: ${ex.note || MAZE.rooms[ex.to].name}`).join('; ');
  srEl.textContent = `${name}. ${desc} Exits — ${exits}.` + (r.type === 'room' ? ' Press Enter to open.' : '');
}

function applyTheme(id) {
  const c = roomColor(id);
  rootEl.style.setProperty('--accent', c);
  tintTarget = hexToRgb(c);
  Sound.setHum(room(id).hum);
}

let toastTimer = 0;
function toast(msg, ms = 3600) {
  toastEl.textContent = msg;
  toastEl.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove('show'), ms);
}

// Everything that changes once the visitor "arrives" in a sector
function setRoomState(id) {
  currentId = id;
  visited.add(id);
  saveVisited();
  store.set('currentRoomId', id);
  applyTheme(id);
  updatePanel(id);
  updateCount();
  Sound.arrive();
  checkAchievements();
}

function checkAchievements() {
  if (!signalUnlocked && visibleIds().every(id => visited.has(id))) {
    unlockSignal('Every sector charted.');
  }
}

function unlockSignal(why) {
  if (signalUnlocked) return false;
  signalUnlocked = true;
  store.set('maze.signal', '1');
  applyUnlock();
  Sound.chime();
  toast(`${why} UNKNOWN SIGNAL DETECTED, WEST OF LIVE CHAT.`, 5200);
  updateCount();
  if (!busy && currentId === SECRET_EXIT.from) buildWorld(currentId);
  return true;
}

/* ============================================================
   Movement
   ============================================================ */
function bump(dir) {
  const cell = world.querySelector('.cell.current');
  if (!cell) return;
  const [ux, uy] = DIRS[dir];
  cell.style.setProperty('--bx', ux * 9 + 'px');
  cell.style.setProperty('--by', uy * 9 + 'px');
  cell.classList.remove('bump'); void cell.offsetWidth; cell.classList.add('bump');
  setTimeout(() => cell.classList.remove('bump'), 260);
  Sound.deny();
}

function afterArrival() {
  busy = false;
  if (queued) { const q = queued; queued = null; move(q); }
}

async function move(dir) {
  if (busy) { queued = dir; return; }
  const ex = room().exits && room().exits[dir];
  if (!ex) { bump(dir); return; }
  if (RM.matches) { jumpTo(ex.to); return; }

  busy = true;
  Sound.init();
  const [ux, uy] = DIRS[dir];
  const ms = CFG.panMs;
  const target = world.querySelector(`.cell.neighbor[data-dir="${dir}"]`);
  const origin = world.querySelector('.cell.current');

  document.body.classList.add('moving');
  startWarp('dir', [ux, uy], ms);

  world.querySelectorAll('.cell.neighbor').forEach(c => { if (c !== target) c.classList.add('gone'); });
  world.querySelectorAll('.lane').forEach(l => { if (l.dataset.dir !== dir) l.classList.add('gone'); });

  target.classList.remove('unknown'); // the silhouette lights up as you fly in
  target.style.setProperty('--s', 1);
  target.style.setProperty('--o', 1);
  origin.style.setProperty('--s', CFG.neighborScale);
  origin.style.setProperty('--o', 0.62);
  world.style.transform = `translate3d(${-ux * M.dx}px, ${-uy * M.dy}px, 0)`;

  await sleep(ms * 0.45);
  setRoomState(ex.to);
  await sleep(ms * 0.55 + 20);

  // Snap: rebuild around the new centre. The sector we just left is
  // already sitting where its silhouette goes, so it's marked "keep"
  // and doesn't re-animate.
  world.style.transition = 'none';
  world.style.transform = '';
  buildWorld(currentId, OPP[dir]);
  void world.offsetHeight;
  world.style.transition = '';
  document.body.classList.remove('moving');
  afterArrival();
}

// Teleport: used by the terminal, the minimap, R, and reduced-motion users
async function jumpTo(id) {
  if (busy || !MAZE.rooms[id]) return;
  busy = true;
  Sound.init();
  const ms = CFG.jumpMs;
  document.body.classList.add('jumping');
  startWarp('radial', null, ms);
  await sleep(RM.matches ? 120 : ms * 0.4);
  world.style.transform = '';
  setRoomState(id);
  buildWorld(id);
  document.body.classList.remove('jumping');
  await sleep(RM.matches ? 0 : ms * 0.35);
  afterArrival();
}

async function enter() {
  if (busy) return;
  const r = room();
  if (r.type !== 'room') return;
  Sound.init();
  if (!r.href) {
    Sound.deny();
    toast('NO UPLINK. THIS TRANSMISSION IS STILL BEING WRITTEN.');
    return;
  }
  busy = true;
  const cell = world.querySelector('.cell.current');
  dockLine.textContent = '';
  document.body.classList.add('docking');
  Sound.dock();
  startWarp('radial', null, 1100);
  if (cell && !RM.matches) cell.classList.add('docking');

  const line = `> ESTABLISHING UPLINK TO ${(r.name || 'SECTOR').toUpperCase()} ... OK`;
  if (RM.matches) {
    dockLine.textContent = line;
    await sleep(250);
  } else {
    const t0 = performance.now();
    await new Promise(res => (function step(now) {
      const p = clamp((now - t0) / 600, 0, 1);
      dockLine.textContent = line.slice(0, Math.ceil(line.length * p));
      if (p < 1) requestAnimationFrame(step); else res();
    })(t0));
    await sleep(160);
    flashEl.classList.add('on');
    await sleep(280);
  }
  window.location.href = r.href;
}

// Coming back with the browser's Back button can restore this page from
// memory in its "docking" state, so put it back to normal.
window.addEventListener('pageshow', e => {
  if (!e.persisted) return;
  document.body.classList.remove('docking', 'moving', 'jumping');
  flashEl.classList.remove('on');
  busy = false; queued = null;
  buildWorld(currentId);
});

/* ============================================================
   Terminal
   ============================================================ */
const term = $('#term'), termLog = $('#term-log'), termInput = $('#term-input');
const history = []; let histIdx = 0;
let termOpen = false;

function openTerm() {
  Sound.init();
  termOpen = true;
  term.classList.add('open'); term.setAttribute('aria-hidden', 'false');
  document.body.classList.add('term-open');
  if (!termLog.childElementCount) {
    out('SPACE MAZE TERMINAL v2.0 — type "help" for commands.', 'ok');
  }
  setTimeout(() => termInput.focus(), 30);
}
function closeTerm() {
  termOpen = false;
  term.classList.remove('open'); term.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('term-open');
  termInput.blur();
}
function out(text, cls = '') {
  const d = document.createElement('div');
  d.className = 'line ' + cls;
  d.textContent = text;
  termLog.appendChild(d);
  while (termLog.childElementCount > 80) termLog.firstChild.remove();
  termLog.scrollTop = termLog.scrollHeight;
}

const norm = s => s.toLowerCase().replace(/[^a-z0-9]/g, '');
function findRoom(q) {
  const n = norm(q);
  if (!n) return null;
  const ids = Object.keys(MAZE.rooms).filter(id => !MAZE.rooms[id].hidden || signalUnlocked);
  return ids.find(id => norm(id) === n || norm(MAZE.rooms[id].name || '') === n)
      || ids.find(id => norm(MAZE.rooms[id].name || '').includes(n) || norm(id).includes(n))
      || null;
}

function runCommand(raw) {
  const input = raw.trim();
  if (!input) return;
  out(`$ ${input}`, 'cmd');
  history.push(input); histIdx = history.length;
  const [cmd, ...rest] = input.split(/\s+/);
  const arg = rest.join(' ');

  switch (cmd.toLowerCase()) {
    case 'help': case '?':
      out([
        'help            show this list',
        'ls              list the sectors you have charted',
        'goto <sector>   warp to a charted sector   e.g. goto museum',
        'status          exploration progress',
        'whoami          identify yourself',
        'sound on|off    toggle audio',
        'reset           return to the archive',
        'clear           clear this screen',
        'exit            close the terminal   (or press Esc)',
        '??? ???         [classified]'
      ].join('\n'));
      break;

    case 'ls': {
      const disc = discoveredSet();
      [...disc].filter(id => MAZE.rooms[id]).forEach(id => {
        const p = POS[id] || [0, 0];
        const where = `(${signed(p[0])},${signed(p[1])})`;
        out(visited.has(id) ? `  ${MAZE.rooms[id].name}  ${where}${id === currentId ? '   <- you are here' : ''}` : `  ???  ${where}   uncharted`);
      });
      break;
    }

    case 'goto': case 'cd': case 'warp': {
      if (!arg) { out('usage: goto <sector>', 'err'); break; }
      const id = findRoom(arg);
      if (!id) { out(`no such sector: ${arg}`, 'err'); break; }
      if (!visited.has(id)) { out('ACCESS DENIED: that sector has not been charted yet.', 'err'); break; }
      if (id === currentId) { out('you are already here.'); break; }
      out(`warping to ${MAZE.rooms[id].name}...`, 'ok');
      closeTerm();
      jumpTo(id);
      break;
    }

    case 'status': {
      const total = visibleIds().length;
      const v = visibleIds().filter(id => visited.has(id)).length;
      out(`charted ${v}/${total} sectors` + (signalUnlocked ? ' (+1 hidden)' : ''));
      if (v === total && !signalUnlocked) out('...');
      break;
    }

    case 'whoami': {
      const p = POS[currentId] || [0, 0];
      out(`visitor // unregistered traveller // sector (${signed(p[0])},${signed(p[1])})`);
      break;
    }

    case 'sound': case 'audio':
      if (/^(on|1)$/i.test(arg)) { Sound.init(); Sound.toggle(true); out('sound on', 'ok'); }
      else if (/^(off|0)$/i.test(arg)) { Sound.toggle(false); out('sound off', 'ok'); }
      else out('usage: sound on|off', 'err');
      break;

    case 'reset': case 'home':
      closeTerm(); jumpTo('about_node');
      break;

    case 'clear': termLog.replaceChildren(); break;
    case 'exit': case 'quit': case 'close': closeTerm(); break;

    case 'sudo':
      out('visitor is not in the sudoers file. This incident will be reported.', 'err');
      break;

    case 'ping':
      out(signalUnlocked
        ? 'signal: online. bearing west of Live Chat.'
        : 'no response. static. (chart every sector and the noise might resolve.)');
      break;

    case 'hello': case 'hi': case 'hey':
      out('hello, traveller. mind the cats.');
      break;

    default:
      out(`command not found: ${cmd}  (try "help")`, 'err');
  }
}

termInput.addEventListener('keydown', e => {
  e.stopPropagation();
  if (e.key === 'Enter') { runCommand(termInput.value); termInput.value = ''; }
  else if (e.key === 'Escape') { closeTerm(); }
  else if (e.key === 'ArrowUp') {
    if (histIdx > 0) { histIdx--; termInput.value = history[histIdx] || ''; }
    e.preventDefault();
  } else if (e.key === 'ArrowDown') {
    if (histIdx < history.length - 1) { histIdx++; termInput.value = history[histIdx]; }
    else { histIdx = history.length; termInput.value = ''; }
    e.preventDefault();
  }
});

/* ============================================================
   Input
   ============================================================ */
const KONAMI = ['arrowup', 'arrowup', 'arrowdown', 'arrowdown', 'arrowleft', 'arrowright', 'arrowleft', 'arrowright', 'b', 'a'];
let konamiIdx = 0;
function konami(key) {
  konamiIdx = key === KONAMI[konamiIdx] ? konamiIdx + 1 : (key === KONAMI[0] ? 1 : 0);
  if (konamiIdx === KONAMI.length) {
    konamiIdx = 0;
    if (!unlockSignal('KONAMI OVERRIDE ACCEPTED.')) toast('The signal is already online.');
  }
}

window.addEventListener('keydown', e => {
  if (termOpen) return; // the terminal's own input handles keys
  if (e.ctrlKey || e.metaKey || e.altKey) return; // leave browser shortcuts alone
  const key = e.key.toLowerCase();
  konami(key);

  switch (key) {
    case 'arrowup': case 'w': e.preventDefault(); move('north'); break;
    case 'arrowdown': case 's': e.preventDefault(); move('south'); break;
    case 'arrowleft': case 'a': e.preventDefault(); move('west'); break;
    case 'arrowright': case 'd': e.preventDefault(); move('east'); break;
    case 'enter': case ' ':
      if (document.activeElement && document.activeElement.tagName === 'BUTTON') return; // let focused buttons act normally
      e.preventDefault(); enter(); break;
    case 'r': if (!busy && currentId !== 'about_node') jumpTo('about_node'); break;
    case 'm': Sound.init(); Sound.toggle(); break;
    case '`': case '/': e.preventDefault(); openTerm(); break;
    case 'escape': closeTerm(); break;
  }
});

// First gesture of any kind wakes the audio engine
['pointerdown', 'keydown'].forEach(ev => window.addEventListener(ev, () => Sound.init(), { once: true, passive: true }));

// Clicks and taps
stage.addEventListener('click', e => {
  if (performance.now() - swipedAt < 350) return;
  const label = e.target.closest('.label');
  if (label) { move(label.dataset.dir); return; }
  const cell = e.target.closest('.cell');
  if (!cell) return;
  if (cell.classList.contains('neighbor')) move(cell.dataset.dir); else enter();
});
labelsEl.addEventListener('click', e => {
  const label = e.target.closest('.label');
  if (label) move(label.dataset.dir);
});
btnEnter.addEventListener('click', enter);
$('#btn-sound').addEventListener('click', () => { Sound.init(); Sound.toggle(); });
$('#btn-term').addEventListener('click', () => (termOpen ? closeTerm() : openTerm()));

mapCanvas.addEventListener('click', e => {
  const rect = mapCanvas.getBoundingClientRect();
  const x = e.clientX - rect.left, y = e.clientY - rect.top;
  const hit = mapHits.find(h => Math.hypot(h.x - x, h.y - y) <= h.r + 2);
  if (hit && hit.id !== currentId) jumpTo(hit.id);
});

// Swipe to travel (swiping left means you move east)
let touchStart = null;
stage.addEventListener('pointerdown', e => { if (e.pointerType === 'touch') touchStart = { x: e.clientX, y: e.clientY }; });
stage.addEventListener('pointerup', e => {
  if (!touchStart || e.pointerType !== 'touch') return;
  const dx = e.clientX - touchStart.x, dy = e.clientY - touchStart.y;
  touchStart = null;
  if (Math.max(Math.abs(dx), Math.abs(dy)) < 45) return;
  swipedAt = performance.now();
  if (Math.abs(dx) > Math.abs(dy)) move(dx < 0 ? 'east' : 'west');
  else move(dy < 0 ? 'south' : 'north');
});
stage.addEventListener('pointercancel', () => { touchStart = null; });

// Mouse parallax
window.addEventListener('pointermove', e => {
  if (e.pointerType !== 'mouse' || RM.matches) return;
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = (e.clientY / window.innerHeight) * 2 - 1;
}, { passive: true });

let resizeTimer = 0;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    calcLayout();
    resizeSpace();
    if (!busy) buildWorld(currentId);
  }, 120);
});

/* ============================================================
   Boot
   ============================================================ */
calcLayout();
resizeSpace();
saveVisited();
store.set('currentRoomId', currentId);
applyTheme(currentId);
buildWorld(currentId);
updatePanel(currentId);
updateCount();
refreshSoundButton();
checkAchievements();
requestAnimationFrame(frame);
