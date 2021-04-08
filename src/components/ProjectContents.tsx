import React from 'react';
import styled from 'styled-components';
import { useRocketLeague } from '../hooks/bakkesmod';
import { Cinematic, Replay } from '../interfaces/project';

const Main = styled.div`
  margin: 4px;
  height: calc(100% - 36px);
  overflow-y: scroll;
  overflow-x: hidden;
  &:hover {
    ::-webkit-scrollbar-thumb {
      background: #babbc0;
    }
  }
  h3 {
    margin: 0;
  }
`;

const Item = styled.div`
  padding: 4px;
  margin-right: 4px;
  border-bottom: 1px solid #babbc0;
  &:hover {
    cursor: pointer;
  }
`;

export function ProjectContents({ replays, cinematics, onChange }: any) {
  const { loadReplay } = useRocketLeague();

  return (
    <Main>
      {replays.length ? <h3>Replays</h3> : null}
      {replays.map((replay: Replay) => (
        <Item
          key={replay.name}
          onClick={() => loadReplay('Park_P', replay.path)}
        >
          {replay.name}
        </Item>
      ))}
      {cinematics.length ? <h3>Cinematics</h3> : null}
      {cinematics.map((cinematic: Cinematic) => (
        <Item key={cinematic.name} onClick={() => onChange(cinematic.name)}>
          {cinematic.name}
        </Item>
      ))}
    </Main>
  );
}
