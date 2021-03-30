import { useEffect, useState } from 'react';

const BAKKESMOD_SERVER = 'ws://127.0.0.1:9002';
const RCON_PASSWORD = 'password';

export const useRocketLeague = () => {
  const [ws] = useState<WebSocket>(new WebSocket(BAKKESMOD_SERVER));

  useEffect(() => {
    ws.addEventListener('open', () => {
      ws.send(`rcon_password ${RCON_PASSWORD}`);
    });
    return () => ws.close();
  }, [ws]);

  const unrealCommand = (command: string) => {
    console.log(`unreal_command ${JSON.stringify(command)}`);
    ws.send(`unreal_command ${JSON.stringify(command)}`);
  };

  const loadReplay = (map: string, replayPath: string) => {
    const replay =
      '..%5c..%5c..%5c..%5c..%5c..%5c..%5c' +
      replayPath.replace('C:\\', '').replaceAll('\\', '%5c');
    unrealCommand(
      `open ${map}?Game=TAGame.GameInfo_Replay_TA?Replay=${replay}`
    );
  };

  return {
    unrealCommand,
    loadReplay,
    sendCommand: (command: string) => ws.send(command),
  };
};
