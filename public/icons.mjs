const playerLocation = '/public/icons/player.svg';
const opponentLocation = '/public/icons/opponent.svg';
const collectibleLocations = [
   `/public/icons/colIcon1.svg`, `/public/icons/colIcon2.svg`,
   `/public/icons/colIcon3.svg`, `/public/icons/colIcon4.svg`,
   `/public/icons/colIcon5.svg`, `/public/icons/colIcon6.svg`,
]

export default function() {
   this.playerLocation = playerLocation
   this.opponentLocation = opponentLocation
   this.collectibleLocations = collectibleLocations
   try {
      fetch(playerLocation)
         .then(res => res.text())
         .then(d => this.playerIcon = d);
      fetch(opponentLocation)
         .then(res => res.text())
         .then(d => this.opponentIcon = d);
      this.collectibleIcons = [];
      collectibleLocations.forEach(l => {
         fetch(l)
            .then(res => res.text())
            .then(d => this.collectibleIcons.push(d))
      })
   } catch (e) { }
}
