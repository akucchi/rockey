import React, { useEffect, useRef, useState } from 'react';
import { desktopCapturer } from 'electron';
import { getUserMedia } from '../utils/userMedia';

export function Preview({ sendCommand }: any) {
  const video = useRef<HTMLVideoElement>(null);
  const [keys] = useState<Map<string, boolean>>(new Map());

  const onMouseMove = (event: MouseEvent) => {
    sendCommand(`rockey_cam_rotate ${event.movementX} ${event.movementY}`);
  };

  const onKeyUp = (event: KeyboardEvent) => {
    keys.set(event.key, false);
  };

  const onKeyDown = (event: KeyboardEvent) => {
    keys.set(event.key, true);
  };

  const handleInterval = () => {
    if (keys.get('q') && !keys.get('e')) sendCommand(`rockey_roll -1`);
    if (keys.get('e') && !keys.get('q')) sendCommand(`rockey_roll 1`);
    if (keys.get('w') && !keys.get('s')) {
      sendCommand(`rockey_cam_move 1 0`);
    }
    if (keys.get('s') && !keys.get('w')) {
      sendCommand(`rockey_cam_move -1 0`);
    }
    if (keys.get('a') && !keys.get('d')) {
      sendCommand(`rockey_cam_move 0 1`);
    }
    if (keys.get('d') && !keys.get('a')) {
      sendCommand(`rockey_cam_move 0 -1`);
    }
  };

  const handleStream = (stream: MediaStream) => {
    if (video.current) {
      let interval: NodeJS.Timeout | null = null;
      video.current.srcObject = stream;
      video.current.onloadedmetadata = () => video.current!.play();
      video.current.onmousedown = (event) => {
        if (event.button === 2) {
          video.current!.requestPointerLock();
          document.addEventListener('mousemove', onMouseMove, false);
          document.addEventListener('keyup', onKeyUp, false);
          document.addEventListener('keydown', onKeyDown, false);
          interval = setInterval(handleInterval, 20);
        }
      };
      video.current.onmouseup = (event) => {
        if (event.button === 2) {
          document.exitPointerLock();
          document.removeEventListener('mousemove', onMouseMove, false);
          document.removeEventListener('keyup', onKeyUp, false);
          document.removeEventListener('keydown', onKeyDown, false);
          keys.clear();
          if (interval) clearInterval(interval);
        }
      };
    }
  };

  useEffect(() => {
    desktopCapturer.getSources({ types: ['window'] }).then(async (sources) => {
      for (const source of sources) {
        if (source.name === 'Rocket League (64-bit, DX11, Cooked)') {
          try {
            const stream = await getUserMedia(source.id);
            handleStream(stream);
          } catch (e) {
            console.error(e);
          }
        }
      }
    });
  }, [video]);

  return <video width="640" height="360" ref={video} />;
}
