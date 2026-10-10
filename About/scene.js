/* ============================================================
   ABOUT PAGE: scroll-driven flight through your life.

   - Scroll position -> position along a winding path.
   - Each chapter is a planet with its photo as a floating "postcard".
   - Four clickable relics float between chapters (they open the same
     pop-ups as before).
   - All text stays in the HTML (index.html); this file only draws the
     scene and never owns any content.

   Edit the look here; edit the story in index.html (timelineData).
   If anything below fails (e.g. no WebGL), the page automatically
   falls back to a plain readable timeline.
   ============================================================ */
import * as THREE from 'three';

const LIFE = window.LIFE;
const TL = LIFE.timeline;
const N = TL.length;
const RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const smooth01 = (a, b, v) => { const t = clamp((v - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
const lerp = (a, b, t) => a + (b - a) * t;

function rng(seed) {                     // small seeded random: the scene looks the same every visit
  let a = seed | 0;
  return () => {
    a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function boot() {
  const canvas = document.getElementById('gl');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
  if (!renderer.getContext()) throw new Error('WebGL unavailable');
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

  const BG = 0x02020a;
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(BG);
  scene.fog = new THREE.FogExp2(BG, 0.0105);

  const camera = new THREE.PerspectiveCamera(56, 1, 0.1, 1200);
  scene.add(camera);

  const UP = new THREE.Vector3(0, 1, 0);

  /* ---------- Lights ---------- */
  scene.add(new THREE.AmbientLight(0x7078b8, 1.15));
  const key = new THREE.DirectionalLight(0xffffff, 2.6);   // a "headlight" that travels with the camera
  key.position.set(-5, 7, 4);
  key.target.position.set(3, -2, -12);
  camera.add(key, key.target);

  /* ---------- Path ---------- */
  const SPACING = 48;
  const K0 = -1, K1 = N + 2;                                // control points; hero = 0, chapters 1..N, outro N+1
  const pts = [];
  for (let k = K0; k <= K1; k++) {
    pts.push(new THREE.Vector3(Math.sin(k * 0.8) * 8, Math.sin(k * 1.45 + 0.6) * 3, -k * SPACING));
  }
  const curve = new THREE.CatmullRomCurve3(pts, false, 'centripetal');
  const tOf = k => clamp((k - K0) / (K1 - K0), 0, 1);

  function frameAt(k) {
    const t = tOf(k);
    const p = curve.getPoint(t);
    const T = curve.getTangent(t).normalize();
    const R = new THREE.Vector3().crossVectors(T, UP).normalize();
    return { p, T, R };
  }
  const stops = [];                                         // stops[k] for k = 0..N+1
  for (let k = 0; k <= N + 1; k++) stops.push(frameAt(k));

  /* ---------- Shared textures ---------- */
  function glowTexture() {
    const c = document.createElement('canvas');
    c.width = c.height = 128;
    const g = c.getContext('2d');
    const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    gr.addColorStop(0, 'rgba(255,255,255,1)');
    gr.addColorStop(0.25, 'rgba(255,255,255,0.45)');
    gr.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = gr;
    g.fillRect(0, 0, 128, 128);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }
  const GLOW = glowTexture();

  function glowSprite(color, scale, opacity) {
    const m = new THREE.SpriteMaterial({ map: GLOW, color, transparent: true, opacity, blending: THREE.AdditiveBlending, depthWrite: false, fog: false });
    const s = new THREE.Sprite(m);
    s.scale.setScalar(scale);
    return s;
  }

  const hexRgb = hex => { const n = parseInt(hex.slice(1), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; };

  function planetTexture(hex, seed) {
    const W = 128, H = 64;
    const c = document.createElement('canvas');
    c.width = W; c.height = H;
    const g = c.getContext('2d');
    const [r, gg, b] = hexRgb(hex);
    const rand = rng(seed * 977 + 13);
    const calm = seed % 3 === 0;                             // every third world: fewer bands, more land
    for (let y = 0; y < H; y++) {                            // horizontal bands
      const f = 0.5 + (calm ? 0.1 : 0.3) * Math.sin(y * 0.33 + seed) + (calm ? 0.05 : 0.18) * Math.sin(y * 0.9 + seed * 2) + (rand() - 0.5) * 0.14;
      g.fillStyle = `rgb(${Math.round(clamp(r * f, 0, 255))},${Math.round(clamp(gg * f, 0, 255))},${Math.round(clamp(b * f, 0, 255))})`;
      g.fillRect(0, y, W, 1);
    }
    for (let i = 0; i < (calm ? 260 : 120); i++) {           // chunky "land" blotches
      const w = 3 + Math.floor(rand() * (calm ? 22 : 14)), h = 1 + Math.floor(rand() * (calm ? 8 : 4));
      const light = rand() > 0.5;
      g.fillStyle = light ? 'rgba(255,255,255,0.16)' : 'rgba(0,0,10,0.28)';
      g.fillRect(Math.floor(rand() * W), Math.floor(rand() * H), w, h);
    }
    const t = new THREE.CanvasTexture(c);
    t.magFilter = THREE.NearestFilter;
    t.minFilter = THREE.NearestFilter;
    t.wrapS = THREE.RepeatWrapping;
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }

  function placeholderTexture(ev) {                          // shown until the real photo arrives (or if it can't load)
    const S = 256;
    const c = document.createElement('canvas');
    c.width = c.height = S;
    const g = c.getContext('2d');
    g.fillStyle = '#0a0a1a';
    g.fillRect(0, 0, S, S);
    g.strokeStyle = ev.accent;
    g.lineWidth = 6;
    g.strokeRect(10, 10, S - 20, S - 20);
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    g.font = '110px serif';
    g.fillText(ev.avatar || '*', S / 2, S / 2 - 12);
    g.fillStyle = ev.accent;
    g.font = 'bold 22px monospace';
    g.fillText(ev.year, S / 2, S - 38);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }

  /* ---------- Stars (three layers of depth, one tinted by the current chapter) ---------- */
  function makeStars(count, size, seed, minR = 30, spread = 150) {
    const rand = rng(seed);
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const p = curve.getPoint(rand());
      const u = rand() * 2 - 1, a = rand() * Math.PI * 2, s = Math.sqrt(1 - u * u);
      const r = minR + Math.pow(rand(), 1.4) * spread;
      pos[i * 3] = p.x + Math.cos(a) * s * r;
      pos[i * 3 + 1] = p.y + u * r * 0.8;
      pos[i * 3 + 2] = p.z + Math.sin(a) * s * r;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const mat = new THREE.PointsMaterial({ size, sizeAttenuation: false, transparent: true, opacity: 0.95, depthWrite: false, fog: true });   // fog hides far stars so they don't pile up at the vanishing point
    return new THREE.Points(geo, mat);
  }
  const starsWhite = makeStars(1500, 1.8, 3);
  starsWhite.material.color.set(0xd6deff);
  const starsTint = makeStars(850, 2.5, 7);
  scene.add(starsWhite, starsTint);

  // distant sky: spread evenly over a big sphere that moves with the camera, so there is never an empty patch
  const sky = (() => {
    const rand = rng(41), n = 2200, pos = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      const u = rand() * 2 - 1, a = rand() * Math.PI * 2, s = Math.sqrt(1 - u * u);
      pos[i * 3] = Math.cos(a) * s * 700; pos[i * 3 + 1] = u * 700; pos[i * 3 + 2] = Math.sin(a) * s * 700;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const pts = new THREE.Points(g, new THREE.PointsMaterial({ color: 0xc8d0ff, size: 1.5, sizeAttenuation: false, transparent: true, opacity: 0.85, depthWrite: false, fog: false }));
    pts.frustumCulled = false;
    return pts;
  })();
  scene.add(sky);

  /* ---------- Nebula clouds along the way ---------- */
  const NEB_DEFAULT = '#6f63e8';
  const accentFor = k => {
    const i = Math.round(k) - 1;
    if (i < 0) return NEB_DEFAULT;
    if (i >= N) return '#ffd700';
    return TL[i].accent;
  };
  {
    const rand = rng(21);
    for (let j = 0; j < 16; j++) {
      const k = -0.4 + j * 0.78;
      const f = frameAt(clamp(k, 0, N + 1));
      const side = rand() > 0.5 ? 1 : -1;
      const s = glowSprite(accentFor(k), 80 + rand() * 90, 0.12 + rand() * 0.07);
      s.position.copy(f.p)
        .addScaledVector(f.R, side * (34 + rand() * 40))
        .addScaledVector(UP, (rand() - 0.5) * 40)
        .addScaledVector(f.T, (rand() - 0.5) * 30);
      scene.add(s);
    }
  }

  /* ---------- Path line + gates ---------- */
  {
    const pathGeo = new THREE.BufferGeometry().setFromPoints(curve.getPoints(900));
    scene.add(new THREE.Line(pathGeo, new THREE.LineBasicMaterial({ color: 0x8c92ff, transparent: true, opacity: 0.22, fog: false })));
  }
  const gates = [];
  for (let i = 0; i < N; i++) {
    const f = stops[i + 1];
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(1.9, 0.04, 6, 48),
      new THREE.MeshBasicMaterial({ color: TL[i].accent, transparent: true, opacity: 0.3, fog: false })
    );
    ring.position.copy(f.p);
    ring.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), f.T);
    scene.add(ring);
    gates.push(ring);
  }

  /* ---------- Chapters: planet + postcard ---------- */
  const loader = new THREE.TextureLoader();
  loader.setCrossOrigin('anonymous');
  const maxAniso = Math.min(8, renderer.capabilities.getMaxAnisotropy());

  let narrow = false;
  const chapters = TL.map((ev, i) => {
    const k = i + 1;
    const side = i % 2 === 0 ? 1 : -1;                       // planet side (the text card sits opposite)
    const card = document.querySelector(`.chapter[data-index="${i}"] .card`);

    // planet
    const planet = new THREE.Group();
    const body = new THREE.Mesh(
      new THREE.SphereGeometry(1, 30, 22),
      new THREE.MeshLambertMaterial({ map: planetTexture(ev.accent, i + 2), emissive: new THREE.Color(ev.accent), emissiveIntensity: 0.1 })
    );
    planet.add(body);
    const glow = glowSprite(ev.accent, 3.9, 0.5);
    planet.add(glow);
    let ring = null;
    if (i % 3 === 1) {
      ring = new THREE.Mesh(
        new THREE.RingGeometry(1.45, 2.05, 56),
        new THREE.MeshBasicMaterial({ color: ev.accent, transparent: true, opacity: 0.38, side: THREE.DoubleSide, depthWrite: false })
      );
      ring.rotation.x = Math.PI / 2.35;
      ring.rotation.y = 0.3;
      planet.add(ring);
    }
    let pin = null;
    if (i === N - 1) {                                       // "you are here" marker on the current city
      pin = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.55, 4), new THREE.MeshBasicMaterial({ color: 0xffd700 }));
      pin.rotation.x = Math.PI;
      planet.add(pin);
    }
    scene.add(planet);

    // postcard (frame + hard shadow + photo)
    const postcard = new THREE.Group();
    const shadowMat = new THREE.MeshBasicMaterial({ color: ev.accent, transparent: true, opacity: 0.28, depthWrite: false, fog: false });
    const frameMat = new THREE.MeshBasicMaterial({ color: ev.accent, transparent: true, opacity: 1, fog: false });
    const photoMat = new THREE.MeshBasicMaterial({ map: placeholderTexture(ev), transparent: true, opacity: 1, toneMapped: false, fog: false });
    const plane = new THREE.PlaneGeometry(1, 1);
    const shadow = new THREE.Mesh(plane, shadowMat);
    const frame = new THREE.Mesh(plane, frameMat);
    const photo = new THREE.Mesh(plane, photoMat);
    shadow.position.set(0.16, -0.16, -0.04);
    frame.position.z = -0.02;
    postcard.add(shadow, frame, photo);
    postcard.visible = false;
    scene.add(postcard);

    const ch = {
      i, k, ev, side, card, planet, body, glow, ring, pin, postcard, photo, photoMat, frameMat, shadowMat, shadow, frame,
      aspect: 1, fade: 0, alpha: 0, gif: null,
      basePos: new THREE.Vector3(), baseQuat: new THREE.Quaternion(), yaw: 0, roll: 0, radius: 2.4
    };

    ch.layout = () => {
      const { p, T, R } = stops[k];
      const a = ch.aspect;
      let h, w;
      if (narrow) { h = Math.min(2.7, 2.5 / a); }
      else { h = Math.min(3.7, 4.7 / a); }
      w = h * a;
      photo.scale.set(w, h, 1);
      frame.scale.set(w + 0.2, h + 0.2, 1);
      shadow.scale.set(w + 0.2, h + 0.2, 1);

      ch.radius = narrow ? 1.85 : 2.5;
      if (narrow) {
        ch.basePos.copy(p).addScaledVector(T, 3.2).addScaledVector(UP, 2.3);
        planet.position.copy(p).addScaledVector(T, 9).addScaledVector(UP, 3.4);
        ch.yaw = 0;
      } else {
        const lat = 2.2 + w / 2 + 0.5;
        ch.basePos.copy(p).addScaledVector(T, 2).addScaledVector(R, side * lat).addScaledVector(UP, -0.1);
        planet.position.copy(p).addScaledVector(T, 7).addScaledVector(R, side * (lat + 1.9)).addScaledVector(UP, 1.5);
        ch.yaw = -side * 0.3;
      }
      planet.scale.setScalar(ch.radius);
      const Z = T.clone().negate();                          // face back toward the camera
      const Y = new THREE.Vector3().crossVectors(Z, R).normalize();
      ch.baseQuat.setFromRotationMatrix(new THREE.Matrix4().makeBasis(R, Y, Z));
      ch.roll = narrow ? 0 : side * 0.05;
      postcard.position.copy(ch.basePos);
    };

    ch.setPhoto = (tex, aspect) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.anisotropy = maxAniso;
      photoMat.map = tex;
      photoMat.needsUpdate = true;
      ch.aspect = aspect;
      ch.fade = RM ? 1 : 0;
      ch.layout();
    };

    // load the photo; if it can't be used as a texture, fall back to the <img> inside the text card
    const url = ev.media;
    if (url && url.length > 2) {
      loader.load(url, tex => {
        ch.setPhoto(tex, tex.image.width / tex.image.height);
        if (/\.gif($|\?)/i.test(url)) animateGif(ch, url);
      }, undefined, () => { if (card) card.classList.add('show-flat'); });
    }
    return ch;
  });

  /* ---------- Animated GIF -> texture (browsers with ImageDecoder; otherwise it stays a still frame) ---------- */
  async function animateGif(ch, url) {
    if (!('ImageDecoder' in window)) return;
    try {
      const buf = await (await fetch(url)).arrayBuffer();
      const dec = new ImageDecoder({ data: buf, type: 'image/gif' });
      await dec.tracks.ready;
      const frames = dec.tracks.selectedTrack.frameCount;
      if (frames < 2) return;
      const size = 320;
      const cv = document.createElement('canvas');
      cv.width = cv.height = size;
      const cx = cv.getContext('2d');
      const tex = new THREE.CanvasTexture(cv);
      const first = await dec.decode({ frameIndex: 0 });
      cx.drawImage(first.image, 0, 0, size, size);
      const aspect = first.image.displayWidth / first.image.displayHeight;
      first.image.close();
      ch.setPhoto(tex, aspect);
      ch.gif = { dec, cx, tex, frames, size, index: 0, next: performance.now(), busy: false };
    } catch (err) { /* keep the still frame */ }
  }

  function stepGif(g, now) {
    if (!g || g.busy || now < g.next) return;
    g.busy = true;
    const idx = (g.index + 1) % g.frames;
    g.dec.decode({ frameIndex: idx }).then(res => {
      g.cx.clearRect(0, 0, g.size, g.size);
      g.cx.drawImage(res.image, 0, 0, g.size, g.size);
      g.tex.needsUpdate = true;
      g.next = performance.now() + Math.max(40, (res.image.duration || 80000) / 1000);
      res.image.close();
      g.index = idx;
      g.busy = false;
    }).catch(() => { g.next = Infinity; g.busy = false; });
  }

  /* ---------- Sun at the end of the road ---------- */
  const sun = new THREE.Group();
  {
    const f = frameAt(N + 1);
    sun.position.copy(f.p).addScaledVector(f.T, 78);
    sun.add(new THREE.Mesh(new THREE.SphereGeometry(15, 40, 28), new THREE.MeshBasicMaterial({ color: 0xffd36a, fog: false })));
    sun.add(glowSprite(0xffc040, 70, 0.7), glowSprite(0xff9a30, 130, 0.32), glowSprite(0xff7a30, 230, 0.16));
    scene.add(sun);
  }

  /* ---------- Relics: the four clickable artifacts ---------- */
  const RELIC_AT = { music: 0.55, webSystem: 2.5, github: 5.5, telegram: 8.5 };
  const relics = [];
  Object.keys(LIFE.artifacts).forEach((keyName, j) => {
    const data = LIFE.artifacts[keyName];
    const at = RELIC_AT[keyName] !== undefined ? RELIC_AT[keyName] : 1 + j * 2.4;
    const tex = loader.load(data.image);
    tex.magFilter = THREE.NearestFilter;
    tex.minFilter = THREE.NearestFilter;
    tex.colorSpace = THREE.SRGBColorSpace;
    const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, toneMapped: false, fog: false }));
    sprite.scale.setScalar(2.1);
    const halo = glowSprite(0xffd700, 5.2, 0.55);
    halo.userData.relic = keyName;                           // the halo is the (larger) click target
    sprite.userData.relic = keyName;
    const grp = new THREE.Group();
    grp.add(halo, sprite);
    scene.add(grp);
    const r = { key: keyName, at, side: j % 2 === 0 ? 1 : -1, group: grp, sprite, halo, phase: j * 1.7 };
    relics.push(r);
  });

  function layoutRelics() {
    relics.forEach(r => {
      const f = frameAt(r.at);
      r.base = f.p.clone().addScaledVector(f.R, r.side * (narrow ? 1.9 : 3.6)).addScaledVector(UP, narrow ? 1.8 : 0.9).addScaledVector(f.T, 4);
      r.group.position.copy(r.base);
    });
  }

  /* ---------- Ship ---------- */
  const ship = new THREE.Group();
  const shipBody = new THREE.Group();
  ship.add(shipBody);
  const hullMat = new THREE.MeshLambertMaterial({ color: 0xe4e9ff, flatShading: true });
  const wingMat = new THREE.MeshLambertMaterial({ color: 0xffd700, flatShading: true, side: THREE.DoubleSide, emissive: 0xffd700, emissiveIntensity: 0.25 });
  {
    const hull = new THREE.Mesh(new THREE.ConeGeometry(0.28, 1.5, 6), hullMat);
    hull.scale.set(1.3, 1, 0.5);                             // wide and flat, like a dart
    hull.rotation.x = Math.PI / 2;                           // nose toward +z
    shipBody.add(hull);

    const wingGeo = new THREE.BufferGeometry();
    wingGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array([
      0.0, 0, 0.25,   1.0, -0.08, -0.55,   0.0, 0, -0.45,
      0.0, 0, 0.25,  -1.0, -0.08, -0.55,   0.0, 0, -0.45
    ]), 3));
    wingGeo.computeVertexNormals();
    shipBody.add(new THREE.Mesh(wingGeo, wingMat));

    const fin = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.34, 0.5), wingMat);
    fin.position.set(0, 0.2, -0.45);
    shipBody.add(fin);

    const canopy = new THREE.Mesh(new THREE.OctahedronGeometry(0.17, 0), new THREE.MeshBasicMaterial({ color: 0x66e6ff }));
    canopy.position.set(0, 0.13, 0.1);
    canopy.scale.set(0.8, 0.7, 1.5);
    shipBody.add(canopy);
  }
  const flameMat = new THREE.MeshBasicMaterial({ color: 0xffb454, transparent: true, opacity: 0.85, blending: THREE.AdditiveBlending, depthWrite: false });
  const flame = new THREE.Mesh(new THREE.ConeGeometry(0.13, 1, 10), flameMat);
  flame.rotation.x = -Math.PI / 2;                           // tip pointing backward (-z)
  flame.position.z = -0.6;
  shipBody.add(flame);
  const engineGlow = glowSprite(0xffb454, 1.6, 0.8);
  engineGlow.position.z = -0.65;
  shipBody.add(engineGlow);
  ship.scale.setScalar(0.85);
  scene.add(ship);

  /* ---------- Speed streaks (they appear when you scroll fast) ---------- */
  const SC = 240, SD = 70;
  const streakPos = new Float32Array(SC * 6);
  const sX = new Float32Array(SC), sY = new Float32Array(SC), sPh = new Float32Array(SC);
  {
    const rand = rng(99);
    for (let i = 0; i < SC; i++) {
      const a = rand() * Math.PI * 2, rad = 2.4 + rand() * 15;
      sX[i] = Math.cos(a) * rad; sY[i] = Math.sin(a) * rad * 0.7; sPh[i] = rand() * SD;
    }
  }
  const streakGeo = new THREE.BufferGeometry();
  streakGeo.setAttribute('position', new THREE.BufferAttribute(streakPos, 3).setUsage(THREE.DynamicDrawUsage));
  const streakMat = new THREE.LineBasicMaterial({ color: 0xdfe4ff, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, fog: false });
  const streaks = new THREE.LineSegments(streakGeo, streakMat);
  streaks.frustumCulled = false;
  streaks.visible = false;
  camera.add(streaks);

  /* ---------- Layout (desktop vs portrait) ---------- */
  let baseFov = 56;
  function resize() {
    const w = window.innerWidth, h = window.innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    narrow = w < 760 || w / h < 0.95;
    baseFov = narrow ? 68 : 56;
    camera.fov = baseFov;
    camera.updateProjectionMatrix();
    chapters.forEach(c => c.layout());
    layoutRelics();
    computeAnchors();
  }

  /* ---------- Scroll -> position on the path ---------- */
  const chapterEls = [...document.querySelectorAll('.chapter')];
  const anchors = [];
  function computeAnchors() {
    anchors.length = 0;
    const vh = window.innerHeight, sy = window.scrollY;
    anchors.push({ y: 0, k: 0 });
    chapterEls.forEach((el, i) => {
      const r = el.getBoundingClientRect();
      anchors.push({ y: r.top + sy + r.height / 2 - vh / 2, k: i + 1 });
    });
    const maxY = Math.max(document.documentElement.scrollHeight - vh, anchors[anchors.length - 1].y + 1);
    anchors.push({ y: maxY, k: N + 1 });
  }
  function kAt(y) {
    if (y <= anchors[0].y) return 0;
    for (let i = 1; i < anchors.length; i++) {
      if (y <= anchors[i].y) {
        const a = anchors[i - 1], b = anchors[i];
        return a.k + (y - a.y) / (b.y - a.y) * (b.k - a.k);
      }
    }
    return N + 1;
  }

  /* ---------- Pointer: parallax + relic hover/click ---------- */
  const pointer = { x: 0, y: 0, sx: 0, sy: 0, cx: -1, cy: -1, inside: false };
  const ray = new THREE.Raycaster();
  const ndc = new THREE.Vector2();
  const tip = document.getElementById('tip');
  let hovered = null;

  window.addEventListener('pointermove', e => {
    if (e.pointerType === 'touch') return;
    pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
    pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
    pointer.cx = e.clientX; pointer.cy = e.clientY; pointer.inside = true;
    tip.style.left = e.clientX + 'px';
    tip.style.top = e.clientY + 'px';
  }, { passive: true });
  document.addEventListener('pointerleave', () => { pointer.inside = false; });

  function pickRelic(clientX, clientY) {
    ndc.set((clientX / window.innerWidth) * 2 - 1, -(clientY / window.innerHeight) * 2 + 1);
    ray.setFromCamera(ndc, camera);
    const targets = [];
    relics.forEach(r => { if (r.group.visible) targets.push(r.halo, r.sprite); });
    const hit = ray.intersectObjects(targets, false)[0];
    return hit ? hit.object.userData.relic : null;
  }

  canvas.addEventListener('click', e => {
    const k = pickRelic(e.clientX, e.clientY);
    if (k && LIFE.openArtifact) LIFE.openArtifact(k);
  });

  let hoverTimer = 0;
  function updateHover(now) {
    if (now - hoverTimer < 60) return;                       // raycast ~16x/sec is plenty
    hoverTimer = now;
    const k = pointer.inside ? pickRelic(pointer.cx, pointer.cy) : null;
    if (k !== hovered) {
      hovered = k;
      canvas.style.cursor = k ? 'pointer' : '';
      tip.textContent = k ? (LIFE.relicLabels[k] || k) : '';
      tip.classList.toggle('show', !!k);
    }
  }

  /* ---------- Konami: barrel roll ---------- */
  let rollT = -1;
  window.addEventListener('konami', () => { if (!RM) rollT = 0; });

  /* ---------- Frame loop ---------- */
  const _p = new THREE.Vector3(), _T = new THREE.Vector3(), _T2 = new THREE.Vector3();
  const _look = new THREE.Vector3(), _cam = new THREE.Vector3(), _R = new THREE.Vector3();
  const tintTarget = new THREE.Color(NEB_DEFAULT);
  const wingTarget = new THREE.Color(0xffd700);
  const tmpC = new THREE.Color();

  let smooth = window.scrollY, vel = 0, travel = 0, bank = 0, lastK = -1;
  let last = performance.now();

  function frame(now) {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    const vh = window.innerHeight;
    const time = now / 1000;

    /* scroll smoothing + velocity */
    const target = window.scrollY;
    const prev = smooth;
    smooth += (target - smooth) * (RM ? 1 : 1 - Math.exp(-dt * 5.5));
    const dy = smooth - prev;
    vel += ((dy / Math.max(dt, 1e-3)) - vel) * (1 - Math.exp(-dt * 8));
    const v = clamp(vel / (vh * 2.2), -1, 1);
    travel += dy * 0.044;

    const k = kAt(smooth);

    /* ship on the path */
    const t = tOf(k);
    curve.getPoint(t, _p);
    curve.getTangent(t, _T).normalize();
    curve.getTangent(clamp(t + 0.004, 0, 1), _T2).normalize();
    _R.crossVectors(_T, UP).normalize();

    const bob = RM ? 0 : Math.sin(time * 1.6) * 0.08;
    ship.position.copy(_p).addScaledVector(UP, bob);
    ship.lookAt(_look.copy(_p).add(_T));
    const bankTarget = clamp((_T2.x - _T.x) * 160, -0.75, 0.75);
    bank += (bankTarget - bank) * (1 - Math.exp(-dt * 4));
    shipBody.rotation.z = bank;
    if (rollT >= 0) {                                        // konami barrel roll
      rollT += dt / 1.3;
      const e = rollT >= 1 ? 1 : 1 - Math.pow(1 - rollT, 3);
      shipBody.rotation.z += e * Math.PI * 2;
      if (rollT >= 1) rollT = -1;
    }
    const thrust = 0.5 + Math.abs(v) * 2.4 + (RM ? 0 : Math.sin(time * 40) * 0.08);
    flame.scale.set(1, thrust, 1);
    flame.position.z = -0.45 - thrust * 0.5;
    engineGlow.material.opacity = 0.55 + Math.min(0.4, Math.abs(v));

    /* camera: chase view with a little pointer sway */
    pointer.sx += (pointer.x - pointer.sx) * (1 - Math.exp(-dt * 3));
    pointer.sy += (pointer.y - pointer.sy) * (1 - Math.exp(-dt * 3));
    const sway = RM ? 0 : 1;
    const back = narrow ? 8.2 : 7.4, up = narrow ? 2.9 : 2.3;
    _cam.copy(_p).addScaledVector(_T, -back).addScaledVector(UP, up)
        .addScaledVector(_R, pointer.sx * 0.9 * sway).addScaledVector(UP, -pointer.sy * 0.45 * sway);
    camera.position.copy(_cam);
    sky.position.copy(_cam);
    _look.copy(_p).addScaledVector(_T, 10).addScaledVector(UP, narrow ? -1.7 : 0.5)
          .addScaledVector(_R, -pointer.sx * 0.5 * sway);
    camera.lookAt(_look);
    const fov = baseFov + (RM ? 0 : Math.abs(v) * 13);
    if (Math.abs(fov - camera.fov) > 0.02) { camera.fov = fov; camera.updateProjectionMatrix(); }

    /* accent colour follows the chapter you're in */
    if (Math.round(k) !== lastK) {
      lastK = Math.round(k);
      tintTarget.set(accentFor(k));
      wingTarget.set(accentFor(k) === NEB_DEFAULT ? '#ffd700' : accentFor(k));
    }
    const ck = 1 - Math.exp(-dt * 3);
    starsTint.material.color.lerp(tmpC.copy(tintTarget).lerp(new THREE.Color(0xffffff), 0.35), ck);
    wingMat.color.lerp(wingTarget, ck);
    wingMat.emissive.lerp(wingTarget, ck);

    /* chapters */
    chapters.forEach(c => {
      const d = Math.abs(k - c.k);
      const near = clamp(1 - d / 1.1, 0, 1);
      const a = RM ? (d < 1.7 ? 1 : 0) : 1 - smooth01(0.9, 1.9, d);
      c.alpha = a;
      c.postcard.visible = a > 0.01;
      if (c.postcard.visible) {
        c.fade = Math.min(1, c.fade + dt * 1.6);
        c.photoMat.opacity = a * c.fade;
        c.frameMat.opacity = a * c.fade;
        c.shadowMat.opacity = a * c.fade * 0.28;
        const bobc = RM ? 0 : Math.sin(time * 0.9 + c.i) * 0.14;
        c.postcard.position.copy(c.basePos);
        c.postcard.position.y += bobc;
        c.postcard.quaternion.copy(c.baseQuat);
        c.postcard.rotateY(c.yaw + pointer.sx * 0.1 * sway);
        c.postcard.rotateX(-pointer.sy * 0.06 * sway);
        c.postcard.rotateZ(c.roll);
        if (c.gif && d < 1.3) stepGif(c.gif, now);
      }
      if (!RM) c.body.rotation.y += dt * (0.12 + near * 0.18);
      c.planet.scale.setScalar(c.radius * (1 + near * 0.06));
      c.glow.material.opacity = 0.32 + near * 0.5;
      if (c.ring) c.ring.rotation.z += dt * 0.05;
      if (c.pin) c.pin.position.y = 1.45 + (RM ? 0 : Math.sin(time * 2.2) * 0.14);
      gates[c.i].material.opacity = 0.12 + near * 0.5;
      gates[c.i].rotation.z += dt * 0.25 * (RM ? 0 : 1);
    });

    /* relics */
    relics.forEach(r => {
      const dk = Math.abs(k - r.at);
      r.group.visible = dk < 3.2;
      if (!r.group.visible) return;
      r.group.position.copy(r.base);
      if (!RM) r.group.position.y += Math.sin(time * 1.3 + r.phase) * 0.28;
      r.sprite.material.rotation = RM ? 0 : Math.sin(time * 0.9 + r.phase) * 0.16;
      const pulse = RM ? 0.6 : 0.5 + Math.sin(time * 2 + r.phase) * 0.12;
      r.halo.material.opacity = pulse * (1 - smooth01(2.2, 3.2, dk));
      r.sprite.material.opacity = 1 - smooth01(2.2, 3.2, dk);
    });

    sun.children[0].scale.setScalar(1 + (RM ? 0 : Math.sin(time * 0.8) * 0.01));

    /* speed streaks */
    const sv = Math.abs(v);
    if (RM || sv < 0.04) {
      streaks.visible = false;
    } else {
      streaks.visible = true;
      streakMat.opacity = Math.min(0.75, sv * 1.5);
      const L = sv * 15 * Math.sign(v);
      for (let i = 0; i < SC; i++) {
        const zz = ((sPh[i] - travel) % SD + SD) % SD;
        const z = -zz - 1.5;
        const o = i * 6;
        streakPos[o] = sX[i]; streakPos[o + 1] = sY[i]; streakPos[o + 2] = z;
        streakPos[o + 3] = sX[i]; streakPos[o + 4] = sY[i]; streakPos[o + 5] = z - L;
      }
      streakGeo.attributes.position.needsUpdate = true;
    }

    updateHover(now);
    renderer.render(scene, camera);
    requestAnimationFrame(frame);
  }

  window.addEventListener('resize', resize);
  window.addEventListener('load', computeAnchors);
  resize();
  smooth = window.scrollY;
  requestAnimationFrame(frame);

  // tiny helper so the page can be tested/inspected from the console
  LIFE._debug = {
    relicScreen: () => relics.map(r => {
      const v = r.group.getWorldPosition(new THREE.Vector3()).project(camera);
      return { key: r.key, visible: r.group.visible, x: (v.x * 0.5 + 0.5) * window.innerWidth, y: (-v.y * 0.5 + 0.5) * window.innerHeight, z: v.z };
    }),
    k: () => kAt(smooth),
    gifFrame: () => chapters.map(c => (c.gif ? c.gif.index + '/' + c.gif.frames : null)).filter(Boolean),
    settle: () => { smooth = window.scrollY; vel = 0; chapters.forEach(c => { c.fade = 1; }); }   // skip the easing (used by tests)
  };
}

try {
  boot();
  document.body.classList.add('gl-ready');
} catch (err) {
  console.warn('[about] 3D view disabled, showing the plain timeline instead:', err);
  document.body.classList.add('no-3d');
}
