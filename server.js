require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const noCache = require('nocache');
const bodyParser = require('body-parser');

const fccTestingRoutes = require('./routes/fcctesting.js');
const runner = require('./test-runner.js');;

const app = express();

const http = require("http").createServer(app);
const io = require("socket.io")(http);
const util = require('./public/utility').default;

app.use('/public', express.static(process.cwd() + '/public'));
app.use('/assets', express.static(process.cwd() + '/assets'));
app.use(noCache());
app.use(helmet({
  hidePoweredBy: {
    setTo: 'PHP 7.4.3'
  }
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Index page (static HTML)
app.route('/')
  .get(function(req, res) {
    res.sendFile(process.cwd() + '/views/index.html');
  });

//For FCC testing purposes
fccTestingRoutes(app);

// 404 Not Found Middleware
app.use(function(req, res, next) {
  res.status(404)
    .type('text')
    .send('Not Found');
});

const players = {};
const food = {}

const foodAvail = (food) => {
  const foodArr = Object.values(food)
  if (foodArr.length <= 0) return false
  return foodArr.reduce((acc, v) => !v.collected && !acc, true)
}

const makeFood = () => {
  if (!foodAvail(food)) {
    const nextId = Math.max(0, ...[Object.values(food).map(v => v.id)]) + 1
    food[nextId] = {
      id: nextId,
      x: util.randomX(),
      y: util.randomY(),
      value: 10
    }
    return true;
  }
  return false;
}
makeFood();

io.on("connection", socket => {
  socket.on("join", id => {
    console.log(`PlayerJoined: ${id} (${socket.id})`)
    players[socket.id] = {
      id: id,
      x: util.randomX(),
      y: util.randomY(),
      score: 0,
    };
    io.emit("players-updated", players);
    io.emit("food-updated", food);
  });
  socket.on("disconnect", () => {
    console.log(`PlayerLeft: ${socket.id}`)
    delete players[socket.id];
    io.emit("players-updated", players);
  });
  socket.on("player-move", (p) => {
    players[socket.id].x = p.x;
    players[socket.id].y = p.y;
    io.emit("players-updated", players);
  })
  socket.on('player-collect', fid => {
    console.log(`Player: ${socket.id} collecting food id ${fid}`);
    players[socket.id].score += food[fid].value;
    console.log(`Player: ${socket.id} score: ${players[socket.id].score}`)
    delete food[fid];
    makeFood();
    io.emit("players-updated", players);
    io.emit("food-updated", food);
  })
})



const portNum = process.env.PORT || 3000;
// Set up server and tests
const server = http.listen(portNum, () => {
  console.log(`Listening on port ${portNum}`);
  if (process.env.NODE_ENV === 'test') {
    console.log('Running Tests...');
    setTimeout(function() {
      try {
        runner.run();
      } catch (error) {
        console.log('Tests are not valid:');
        console.error(error);
      }
    }, 1500);
  }
});

module.exports = app; // For testing
