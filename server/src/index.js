// @flow
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

type Player = {
  id: string,
  name: string,
};

type WebSocketData = {
  id: string,
  name: ?string,
};

const getWSData = (ws): WebSocketData => {
  return ws.data;
}

const getNamedPlayerList = (): Array<Player> => {
  const players: Array<WebSocketData> = [...wssMap.values()].map(getWSData);
  return (players.filter(p => p.name !== null): any);
};

const broadcast = (data) => {
  console.log('broadcasting', data);
  wss.clients.forEach(ws => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(data));
    }
  })
}

const onNewName = (ws, m_id, newName: string) => {
  if (!newName) {
    return;
  }
  if (newName === ws.data.name) {
    // no change
    ws.send(JSON.stringify({
      m_id,
      error: true,
      message: 'NAME UNCHANGED',
    }))
    return;
  }
  if (nameSet.has(newName)) {
    ws.send(JSON.stringify({
      m_id,
      error: true,
      message: 'NAME TAKEN',
    }));
    return;
  }
  ws.send(JSON.stringify({
    m_id,
    error: false,
    id: ws.data.id,
  }));
  nameSet.delete(ws.data.name);
  ws.data.name = newName;
  nameSet.add(ws.data.name);
  // Update clients
  broadcast({
    players: getNamedPlayerList(),
  });
};

const onResRequested = (ws, m_id, data) => {
  console.log('res requested: ', m_id);
  if ('newName' in data) {
    onNewName(ws, m_id, data.newName);
    return;
  }
  ws.send(JSON.stringify({
    m_id,
    error: true,
    message: 'UNKNOWN REQUEST',
  }));
}

wss.on('connection', ws => {
  const id: string = uid.seq();
  console.log('new ws connection: id', id);
  // Set handlers
  ws.on('message', message => {
    console.log(' message', message);
    let data = null;
    try {
      data = JSON.parse(message);
    } catch (e) {
      console.error('parse error: ', message);
      data = {};
    }
    console.log(data);
    if ('m_id' in data) {
      onResRequested(ws, data.m_id, data.data);
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

  // Send player list
  console.log('connection open?');
  console.log(ws.readyState);
  ws.send(JSON.stringify({
    players: getNamedPlayerList(),
  }));
});
