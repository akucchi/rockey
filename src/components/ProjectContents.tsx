import React from "react";
import {Cinematic, Project, Replay} from "../interfaces/project"

export function ProjectContents({replays, cinematics}: any) {
  return(
    <>
      {replays.map((replay: Replay) => (
        <div key={replay.name}>
          {replay.name}
        </div>
      ))}
      {cinematics.map((cinematic: Cinematic) => (
        <div key={cinematic.name}>
          {cinematic.name}
        </div>
      ))}

    </>);
}