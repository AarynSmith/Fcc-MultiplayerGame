import Player from './Player.mjs';
import Collectible from './Collectible.mjs';
import Icons from './icons.mjs';
import util from './utility.mjs';

const icons = new Icons();
const socket = io();

const Canvg = canvg.Canvg;
const canvas = document.getElementById('game-window');
const context = canvas.getContext('2d');

// Game Globals
const playerID = util.random(10, 20);
let running = false;
let players = {};
let food = {};
const keys = {};

// Event Listeners
document.getElementById('join').addEventListener('click', () => {
  for (let i = 10; i < 40; i++) {
    if (i !== playerID) socket.emit('join', i);
  }
});

document.addEventListener('keydown', e => {
  switch (e.key) {
    case 'w': return keys.up = true;
    case 'a': return keys.left = true;
    case 's': return keys.down = true;
    case 'd': return keys.right = true;
  }
})
document.addEventListener('keyup', e => {
  switch (e.key) {
    case 'w': return keys.up = false;
    case 'a': return keys.left = false;
    case 's': return keys.down = false;
    case 'd': return keys.right = false;
  }
})

// Socket event functions
socket.emit("join", playerID);
socket.on('food-updated', (f) =>
  Object.values(f).forEach(i => food[i.id] = new Collectible(i)))
socket.on('players-updated', v => {
  Object.values(v).forEach(p => players[p.id] = new Player(p))
  if (!running) {
    running = true;
    loop();
  }
});

// Game loop
function loop() {
  movePlayer();
  drawBackground();
  drawPlayers();
  drawFood();
  drawHUD();
  window.requestAnimationFrame(() => loop());
}

function movePlayer() {
  const p = players[playerID]
  const prevPos = [p.x, p.y]
  Object.entries(keys).forEach(([k, v]) => {
    if (v) {
      p.movePlayer(k, p.speed)
    }
  })

  if (p.x <= util.xMin || p.x >= util.xMax) p.x = prevPos[0];
  if (p.y <= util.yMin || p.y >= util.yMax) p.y = prevPos[1];

  if (p.x !== prevPos[0] || p.y !== prevPos[1]) {
    Object.entries(food).forEach(([k, f]) => {
      if (!food[k].collected && p.collision(f)) {
        socket.emit('player-collect', f.id);
        food[k].collected = true;
      }
    })
    socket.emit('player-move', p)
  }
}

function drawFood() {
  Object.values(food).forEach(f => {
    const icon = Canvg.fromString(context,
      icons.collectibleIcons[f.icon], {
      ignoreDimensions: true,
      ignoreClear: true,
      offsetX: f.x,
      offsetY: f.y,
    });
    icon.start();
    icon.stop();
  });
}

function drawPlayers() {
  Object.values(players).forEach(p => {
    const icon = Canvg.fromString(context,
      p.id === playerID ? icons.playerIcon : icons.opponentIcon, {
      ignoreDimensions: true,
      ignoreClear: true,
      offsetX: p.x,
      offsetY: p.y,
    });
    icon.start();
    icon.stop();
  })
}

function drawBackground() {
  context.clearRect(0, 0, util.w, util.h); // clear canvas
  context.fillStyle = 'green';
  context.fillRect(0, 0, util.w, util.h);
}

function drawHUD() {
  // Draw Game Border
  context.strokeStyle = 'brown';
  context.lineWidth = util.bw;
  context.strokeRect(util.b, util.hh, util.w - util.b * 2, util.h - util.hh - util.b);

  // Draw Controls
  context.fillStyle = 'brown';
  context.font = 'bold 12px courier new';
  context.textAlign = 'start';
  context.textBaseline = 'middle';
  context.fillText('Controls: WASD', util.b + 5, util.hh / 2);

  // Draw Ranks 
  context.textAlign = 'end';
  const rankText = players[playerID].calculateRank(players);
  const scoreText = `Score: ${players[playerID].score}`;
  context.fillText(rankText, util.w - util.b - 5, util.hh / 3);
  context.fillText(scoreText, util.w - util.b - 5, 2 * util.hh / 3)

  // Draw Title
  context.font = 'bold 26px courier new';
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillText('Ogres Love Ice Cream', util.w / 2, util.hh / 2);
}
