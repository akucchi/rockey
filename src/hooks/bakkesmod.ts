import { readFileSync } from 'fs';
import { useEffect, useState } from 'react';
import { DollyCamPath } from '../interfaces/project';

export const BAKKESMOD_SERVER = 'ws://127.0.0.1:9002';
export const RCON_PASSWORD = 'password';

// TODO: Find Rocket League path.
export const WIN64_PATH = `C:/Program Files (x86)/Steam/steamapps/common/rocketleague/Binaries/Win64/.rockey`;

export const useRocketLeague = () => {
  const [ws] = useState<WebSocket>(new WebSocket(BAKKESMOD_SERVER));

  useEffect(() => {
    ws.addEventListener('open', () => {
      ws.send(`rcon_password ${RCON_PASSWORD}`);
      ws.send(`dolly_render 0`);
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

  const getDollyPath = async () => {
    ws.send(`dolly_path_save .rockey`);
    await new Promise((r) => setTimeout(r, 300));
    let path: DollyCamPath = JSON.parse(readFileSync(WIN64_PATH).toString());
    Object.keys(path).forEach((key) => {
      path[key].frame = Math.round(path[key].frame * 100) / 100;
    });
    return path;
  };

  return {
    unrealCommand,
    loadReplay,
    sendCommand: (command: string) => ws.send(command),
    getDollyPath,
  };
};
