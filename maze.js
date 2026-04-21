// map of nodes and exits
const MAZE = {
  rooms: {
    'about_node': {
      type: 'room',
      name: 'About Mina',
      desc: 'The personal archives of Mina Eskandar. Biometric data and history stored here.',
      image: 'About/cat.gif',
      href: 'About/index.html',
      exits: {
        south: { to: 'blog_node', note: 'Terminal Log' },
        east: { to: 'projects_node_1', note: 'Projects' }
      }
    },
    'projects_node_1': {
      type: 'corridor',
      name: 'Projects',
      desc: 'A collection of various projects, experiments, and investigations.',
      exits: {
        north: { to: 'incident_node', note: 'INCIDENT' },
        south: { to: 'homelabbing_node', note: 'Homelab' },
        east: { to: 'Cards of Fate', note: 'Silly Projects ⚠️' },
        west: { to: 'about_node', note: 'About' }
      }
    },
    'Cards of Fate': {
      type: 'room',
      name: 'Cards of Fate',
      image: 'icons/cards.png',
      desc: 'Using the latest cutting-edge science of the Quantum divination matrix and Aether Resonance, The Cards of Fate will reveal knowledge about any situation, person or object. Simply focus on your question before drawing and go inside to see the truth.',
      href: 'Projects/CardsOfFate/CoK.html',
      exits: {
        west: { to: 'projects_node_1', note: 'Go Back' }
      }
    },
    'blog_node': {
      type: 'room',
      name: 'Terminal Logs',
      desc: 'Access decentralized data logs and personal transmissions.',
      image: 'icons/Logs.png',
      href: 'Blog/index.html',
      exits: {
        north: { to: 'about_node', note: 'Archive' },
      }
    },
    'incident_node': {
      type: 'room',
      name: 'Project INCIDENT',
      desc: 'A terminal-based investigation puzzle game. Cross-reference documents, chat logs, and internal records to find contradictions. Some files are password protected.',
      image: 'icons/incident.png',
      href: 'Projects/INCIDENT/index.html',
      exits: {
        south: { to: 'projects_node_1', note: 'Projects' },
      }
    },
    'homelabbing_node': {
      type: 'room',
      name: 'Homelabbing',
      desc: 'Infrastructure and automation projects. Content pending transmission.',
      image: 'icons/download_the_internet.png',
      href: '#',
      exits: {
        north: { to: 'projects_node_1', note: 'Projects' },
      }
    }
  }
};

window.MAZE_CONFIG = {
  transitionTime: 150, // Room slide speed
  travelTime: 300,     // Time spent just warping
  warpShift: 1200,
  warpStretch: 30
};


let currentRoomId = 'about_node';
// check if currentRoomId is stored and valid
if (window.localStorage.getItem('currentRoomId') && MAZE.rooms[window.localStorage.getItem('currentRoomId')]) {
  currentRoomId = window.localStorage.getItem('currentRoomId');
}

let isTransitioning = false;
let starOffset = { x: 0, y: 0 };

const mazeStage = document.getElementById('maze-stage');
const roomView = document.getElementById('room-view');
const starfield = document.getElementById('starfield');
const locName = document.getElementById('loc-name');
const warpCanvas = document.getElementById('warp-canvas');
const warpCtx = warpCanvas.getContext('2d');

let warpActive = false;
let warpStars = [];

function resizeWarp() {
  warpCanvas.width = window.innerWidth;
  warpCanvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeWarp);
resizeWarp();

// Sync CSS transition time
document.documentElement.style.setProperty('--transition-speed', `${MAZE_CONFIG.transitionTime}ms`);

// Create corridors and signs inside the stage so they move together
const dirs = ['north', 'south', 'east', 'west'];
dirs.forEach(dir => {
  const line = document.createElement('div');
  line.className = `corridor-line ${dir}`;
  mazeStage.appendChild(line);

  const sign = document.createElement('div');
  sign.className = `corridor-sign ${dir}`;
  mazeStage.appendChild(sign);
});

function initStars() {
  starfield.innerHTML = '';
  for (let i = 0; i < 350; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    const size = Math.random() * 2 + 0.5;
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
    star.style.left = `${Math.random() * 100}%`;
    star.style.top = `${Math.random() * 100}%`;
    star.style.opacity = 0.2 + Math.random() * 0.8;
    starfield.appendChild(star);
  }
}

function initWarpStars() {
  warpStars = [];
  for (let i = 0; i < 500; i++) {
    warpStars.push({
      x: Math.random() * warpCanvas.width,
      y: Math.random() * warpCanvas.height,
      speed: 10 + Math.random() * 30,
      len: 20 + Math.random() * 100,
      opacity: Math.random()
    });
  }
}

function animateWarp(direction) {
  if (!warpActive) return;
  warpCtx.clearRect(0, 0, warpCanvas.width, warpCanvas.height);
  warpCtx.strokeStyle = '#fff';
  warpCtx.lineWidth = 1;

  warpStars.forEach(s => {
    warpCtx.globalAlpha = s.opacity;
    warpCtx.beginPath();
    warpCtx.moveTo(s.x, s.y);

    if (direction === 'north') {
      s.y += s.speed;
      if (s.y > warpCanvas.height) s.y = -s.len;
      warpCtx.lineTo(s.x, s.y - s.len);
    } else if (direction === 'south') {
      s.y -= s.speed;
      if (s.y < -s.len) s.y = warpCanvas.height;
      warpCtx.lineTo(s.x, s.y + s.len);
    } else if (direction === 'east') {
      s.x -= s.speed;
      if (s.x < -s.len) s.x = warpCanvas.width;
      warpCtx.lineTo(s.x + s.len, s.y);
    } else if (direction === 'west') {
      s.x += s.speed;
      if (s.x > warpCanvas.width) s.x = -s.len;
      warpCtx.lineTo(s.x - s.len, s.y);
    }
    warpCtx.stroke();
  });

  requestAnimationFrame(() => animateWarp(direction));
}

function renderRoom(roomId) {
  const room = MAZE.rooms[roomId];
  const isRoom = room.type === 'room';
  const nodeInfo = document.getElementById('node-info');
  locName.textContent = room.name || 'Transit Sector';
  // 1. Render Content
  roomView.className = isRoom ? 'is-room' : '';
  if (isRoom) {
    roomView.innerHTML = `
      <img src="${room.image}" class="room-image">
      <div class="enter-prompt">[ Press Enter ]</div>
    `;
  } else {
    roomView.innerHTML = `<div style="color:var(--text-dim); font-size: 10px; letter-spacing: 2px;">NODE_${roomId.toUpperCase()}</div>`;
  }

  // 2. Setup Floating Info
  nodeInfo.querySelector('.info-name').textContent = room.name || 'TRANSIT_SECTOR';
  nodeInfo.querySelector('.info-desc').textContent = room.desc || '';
  
  // 3. Calculate Position Priority
  // Priority: South (bottom), then North (up), East (right), West (left), then Corner
  nodeInfo.className = ''; // Reset
  const exits = room.exits || {};
  
  if (!exits.south) nodeInfo.classList.add('pos-bottom');
  else if (!exits.north) nodeInfo.classList.add('pos-top');
  else if (!exits.east) nodeInfo.classList.add('pos-right');
  else if (!exits.west) nodeInfo.classList.add('pos-left');
  else nodeInfo.classList.add('pos-corner');

  // 4. Update Corridors & Signs
  dirs.forEach(dir => {
    const exit = exits[dir];
    const line = mazeStage.querySelector(`.corridor-line.${dir}`);
    const sign = mazeStage.querySelector(`.corridor-sign.${dir}`);
    
    if (exit) {
      line.classList.add('active');
      sign.classList.add('active');
      sign.textContent = exit.note || '';
    } else {
      line.classList.remove('active');
      sign.classList.remove('active');
      sign.textContent = '';
    }
  });
}

async function move(direction) {
  if (isTransitioning) return;
  const exit = MAZE.rooms[currentRoomId].exits[direction];
  if (!exit) return;

  isTransitioning = true;
  const slideTime = MAZE_CONFIG.transitionTime;
  const travelTime = MAZE_CONFIG.travelTime;
  
  // 1. Initial Stretch & Start Warp
  const stars = document.querySelectorAll('.star');
  stars.forEach(s => {
    if (direction === 'north' || direction === 'south') s.style.height = `${MAZE_CONFIG.warpStretch * 2}px`;
    else s.style.width = `${MAZE_CONFIG.warpStretch * 2}px`;
  });

  warpActive = true;
  initWarpStars();
  animateWarp(direction);
  document.body.classList.add('is-warping');

  // 2. Snap EXIT current room
  mazeStage.classList.add(`exit-${direction}`);
  await new Promise(r => setTimeout(r, slideTime));

  // 3. TRAVEL (Just stars raining, no nodes on screen)
  await new Promise(r => setTimeout(r, travelTime));

  // 4. ARRIVE (End Warp Effect)
  warpActive = false;
  document.body.classList.remove('is-warping');
  initStars();

  // 5. Snap ENTRY next room
  currentRoomId = exit.to;
  mazeStage.style.transition = 'none';
  mazeStage.classList.remove(...dirs.map(d => `exit-${d}`));
  mazeStage.classList.add(`enter-${direction}`);

  // save currentRoomId to localStorage
  window.localStorage.setItem('currentRoomId', currentRoomId);
  
  renderRoom(currentRoomId);
  mazeStage.offsetHeight; 

  mazeStage.style.transition = '';
  mazeStage.classList.remove(`enter-${direction}`);
  
  await new Promise(r => setTimeout(r, slideTime));

  isTransitioning = false;
}

window.addEventListener('keydown', e => {
  if (isTransitioning) return;
  switch(e.key) {
    case 'ArrowUp': case 'w': move('north'); break;
    case 'ArrowDown': case 's': move('south'); break;
    case 'ArrowLeft': case 'a': move('west'); break;
    case 'ArrowRight': case 'd': move('east'); break;
    case 'r': currentRoomId = 'about_node'; renderRoom(currentRoomId); break; // Reset position
    case 'Enter':
      const room = MAZE.rooms[currentRoomId];
      if (room.type === 'room' && room.href) window.location.href = room.href;
      break;
  }
});

initStars();
renderRoom(currentRoomId);
