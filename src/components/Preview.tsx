import React, { useEffect, useRef } from 'react';
import { desktopCapturer } from 'electron';
import { getUserMedia } from '../utils/userMedia';

export function Preview() {
  const video = useRef<HTMLVideoElement>(null);

  const updatePosition = (event: MouseEvent) => {
    console.log(event.movementX, event.movementY);
  };

  const handleStream = (stream: MediaStream) => {
    if (video.current) {
      video.current.srcObject = stream;
      video.current.onloadedmetadata = () => video.current!.play();
      video.current.onmousedown = (event) => {
        if (event.button === 2) {
          video.current!.requestPointerLock();
          document.addEventListener('mousemove', updatePosition, false);
        }
      };
      video.current.onmouseup = (event) => {
        if (event.button === 2) {
          document.exitPointerLock();
          document.removeEventListener('mousemove', updatePosition, false);
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
