import React, { ChangeEvent, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useRocketLeague, WIN64_PATH } from '../hooks/bakkesmod';
import { Cinematic, DollyCamPath } from '../interfaces/project';
import { AiOutlinePlus } from 'react-icons/ai';
import { writeFileSync } from 'fs';

type Props = {
  cinematic?: Cinematic;
  onChange(path: DollyCamPath): void;
};

const SnapshotList = styled.div`
  height: calc(35vh - 48px);
  overflow-x: hidden;
  overflow-y: scroll;
  &:hover {
    ::-webkit-scrollbar-thumb {
      background: #babbc0;
    }
  }
`;

const Snapshot = styled.div`
  display: grid;
  grid-template-columns: 7% 13% 6% 14% 14% 14% 8% 8% 8% calc(8% - 20px);
  width: 100vw;
`;

const SnapshotHeader = styled.div`
  display: grid;
  grid-template-columns: 7% 13% 6% 14% 14% 14% 8% 8% 8% 8%;
  width: 100vw;
  margin-bottom: 6px;
  height: 20px;
  div {
    margin: 2px;
    font-weight: 600;
  }
`;

const Button = styled.button`
  border: none;
  height: 20px;
`;

const SnapshotInput = styled.input`
  border: none;
  margin: 2px;
`;

const StyledCheckbox = styled.input`
  margin-left: 10px;
`;

const Checkbox = ({ label, value, onChange }: any) => (
  <label>
    <StyledCheckbox type="checkbox" value={value} onChange={onChange} />
    <span>{label}</span>
  </label>
);

export function PathEditor({ cinematic, onChange }: Props) {
  const { sendCommand, getDollyPath } = useRocketLeague();
  const [showPath, setShowPath] = useState(false);
  const [activatePath, setActivatePath] = useState(false);

  useEffect(() => {
    try {
      sendCommand(`dolly_render ${showPath ? 1 : 0}`);
    } catch {}
  }, [showPath]);

  useEffect(() => {
    try {
      if (activatePath) {
        sendCommand(`dolly_activate`);
      } else {
        sendCommand(`dolly_deactivate`);
      }
    } catch {}
  }, [activatePath]);

  const addSnapshot = async () => {
    sendCommand(`dolly_snapshot_take`);
    onChange(await getDollyPath());
  };

  const onFieldUpdate = (
    frame: number,
    field:
      | 'frame'
      | 'timestamp'
      | 'FOV'
      | 'location.x'
      | 'location.y'
      | 'location.z'
      | 'rotation.pitch'
      | 'rotation.roll'
      | 'rotation.yaw'
      | 'weight'
  ) => async (event: ChangeEvent<HTMLInputElement>) => {
    if (cinematic) {
      const key = frame.toString();
      const snapshots = { ...cinematic.snapshots };
      const value = parseFloat(event.target.value);
      if (field === 'location.x') {
        snapshots[key].location.x = value;
      } else if (field === 'location.y') {
        snapshots[key].location.y = value;
      } else if (field === 'location.z') {
        snapshots[key].location.z = value;
      } else if (field === 'rotation.pitch') {
        snapshots[key].rotation.pitch = value;
      } else if (field === 'rotation.roll') {
        snapshots[key].rotation.roll = value;
      } else if (field === 'rotation.yaw') {
        snapshots[key].rotation.yaw = value;
      } else {
        snapshots[key][field] = value;
      }
      writeFileSync(WIN64_PATH, JSON.stringify(snapshots));
      sendCommand(`dolly_path_load .rockey`);
      onChange(await getDollyPath());
    }
  };

  return (
    <div>
      <SnapshotHeader>
        <div>Frame</div>
        <div>Timestamp</div>
        <div>FOV</div>
        <div>X</div>
        <div>Y</div>
        <div>Z</div>
        <div>Pitch</div>
        <div>Roll</div>
        <div>Yaw</div>
        <div>Weight</div>
      </SnapshotHeader>
      <SnapshotList>
        {cinematic
          ? Object.keys(cinematic.snapshots)
              .map((key) => cinematic.snapshots[key])
              .sort((a, b) => a.frame - b.frame)
              .map((snapshot) => (
                <Snapshot key={snapshot.frame}>
                  <SnapshotInput
                    type="text"
                    onChange={onFieldUpdate(snapshot.frame, 'frame')}
                    value={snapshot.frame}
                  />
                  <SnapshotInput
                    type="text"
                    onChange={onFieldUpdate(snapshot.frame, 'timestamp')}
                    value={snapshot.timestamp}
                  />
                  <SnapshotInput
                    type="text"
                    onChange={onFieldUpdate(snapshot.frame, 'FOV')}
                    value={snapshot.FOV}
                  />
                  <SnapshotInput
                    type="text"
                    onChange={onFieldUpdate(snapshot.frame, 'location.x')}
                    value={snapshot.location.x}
                  />
                  <SnapshotInput
                    type="text"
                    onChange={onFieldUpdate(snapshot.frame, 'location.y')}
                    value={snapshot.location.y}
                  />
                  <SnapshotInput
                    type="text"
                    onChange={onFieldUpdate(snapshot.frame, 'location.z')}
                    value={snapshot.location.z}
                  />
                  <SnapshotInput
                    type="text"
                    onChange={onFieldUpdate(snapshot.frame, 'rotation.pitch')}
                    value={snapshot.rotation.pitch}
                  />
                  <SnapshotInput
                    type="text"
                    onChange={onFieldUpdate(snapshot.frame, 'rotation.roll')}
                    value={snapshot.rotation.roll}
                  />
                  <SnapshotInput
                    type="text"
                    onChange={onFieldUpdate(snapshot.frame, 'rotation.yaw')}
                    value={snapshot.rotation.yaw}
                  />
                  <SnapshotInput
                    type="text"
                    onChange={onFieldUpdate(snapshot.frame, 'weight')}
                    value={snapshot.weight}
                  />
                </Snapshot>
              ))
          : null}
      </SnapshotList>
      <Button disabled={cinematic === undefined} onClick={addSnapshot}>
        <AiOutlinePlus />
      </Button>
      <Checkbox
        label="Show path"
        value={showPath}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          setShowPath(event.target.checked)
        }
      />
      <Checkbox
        label="Activate path"
        value={activatePath}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          setActivatePath(event.target.checked)
        }
      />
    </div>
  );
}
