class Player {
  constructor({x, y, score, id}) {
    this.x = x
    this.y = y
    this.score = score
    this.id = id
    this.speed = 5
    this.w = 32
    this.h = 32
  }

  movePlayer(dir, speed) {
    switch (dir) {
      case "up": return this.y -= speed
      case "down": return this.y += speed
      case "left": return this.x -= speed
      case "right": return this.x += speed
    }

  }

  collision(item) {
    // Rectangular collision detection from jeffThompson
    // https://jeffreythompson.org/collision-detection/rect-rect.php
    if (this.x + this.w >= item.x &&  // this right edge past item left
      this.x <= item.x + item.w &&    // this left edge past item right
      this.y + this.h >= item.y &&    // this top edge past item bottom
      this.y <= item.y + item.h) {    // this bottom edge past item top
      return true;
    }
    return false;
  }

  calculateRank(arr) {
    arr = Object.values(arr).sort((a, b) => b.score - a.score);
    for (let i = 0; i < arr.length; i++) {
      if (this.id === arr[i].id) return `Rank: ${i + 1} / ${arr.length}`
    }
  }
}

export default Player;
