
// Canvas sizes
const w = 640;
const h = 480;
const b = 10;
const hh = 55;
const bw = 2;

// Player/Collectible position bounds
const xMax = w - b - 35;
const xMin = b;
const yMax = h - b - 35;
const yMin = hh;

// Utility Functions
const random = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

export default {
  w, h, b, hh, bw, xMin, xMax, yMin, yMax,
  random,
  randomX: () => random(xMin, xMax),
  randomY: () => random(yMin, yMax),
};
