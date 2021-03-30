const WebSocket = require('ws');
const { copyFile } = require('fs/promises');

const BAKKESMOD_SERVER = 'ws://127.0.0.1:9002';
const RCON_PASSWORD = 'password';

const PLUGINS_PATH = `${process.env.APPDATA}\\bakkesmod\\bakkesmod\\plugins`;

const ws = new WebSocket(BAKKESMOD_SERVER);

const sleep = (m) => new Promise(r => setTimeout(r, m));

ws.on('open', async () => {
  ws.send(`rcon_password ${RCON_PASSWORD}`);
  ws.send(`plugin unload rockeyplugin`);
  await sleep(1000);
  await copyFile("./x64/Release/RockeyPlugin.dll", `${PLUGINS_PATH}\\RockeyPlugin.dll`);
  ws.send(`plugin load rockeyplugin`);
  ws.close();
});
