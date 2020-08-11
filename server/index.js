const WebSocket = require('ws');
const { default: ShortUniqueId } = require('short-unique-id');
const uid = new ShortUniqueId();

const port = 3001;

const wss = new WebSocket.Server({
  port,
}, () => {
  console.log(`WebSocket Server started on port ${port}`);
});

const wssMap = new Map();
const nameSet = new Set();

const getNamedPlayerList = () => {
  const players = [...wssMap.values()].map(ws => ws.data);
  console.log(players);
  return players.filter(player => {
    player.name !== null;
  });
};

const broadcast = (data) => {
  wss.clients.forEach(ws => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(data));
    }
  })
}

wss.on('connection', ws => {
  const id = uid.seq();
  console.log('new ws connection: id', id);
  // Set handlers
  ws.on('message', message => {
    const {newName} = JSON.parse(message);
    if (newName) {
      if (ws.data.name === null) {
        wssMap.set(ws.data.id, ws);
      }
      ws.data.name = newName;
    }
  });
  ws.on('close', () => {
    console.log('ws connection closed');
    wssMap.delete(id);
  });

  // Update wssMap
  ws.data = {
    id,
    name: null,
  };
  wssMap.set(id, ws);

  // Update clients
  broadcast({
    players: getNamedPlayerList
  })
});
