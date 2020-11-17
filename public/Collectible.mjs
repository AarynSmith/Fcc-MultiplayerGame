import Icons from './icons.mjs';
const icons = new Icons();

class Collectible {
  constructor({x, y, value, id}) {
    this.x = x
    this.y = y
    this.id = id
    this.icon = Math.floor(Math.random() * icons.collectibleLocations.length);
    this.w = 20;
    this.h = 32;
    this.collected = false;
  }
}

try {
  module.exports = Collectible;
} catch (e) { }

export default Collectible;
