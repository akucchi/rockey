import { ipcRenderer } from 'electron';
import { writeFileSync } from 'fs';
import { basename } from 'path';
import React, { ChangeEvent } from 'react';
import styled from 'styled-components';
import {
  BAKKESMOD_SERVER,
  RCON_PASSWORD,
  WIN64_PATH,
} from '../hooks/bakkesmod';
import { DollyCamPath, Project } from '../interfaces/project';
import { PathEditor } from './PathEditor';
import { Preview } from './Preview';
import { ProjectContents } from './ProjectContents';

const Layout = styled.div`
  display: grid;
  grid-template-columns: auto fit-content(100%);
`;

const NewCineInput = styled.input`
  outline: none;
  width: -webkit-fill-available;
  margin: 2px;
  border: 1px solid #babbc0;
  border-radius: 5px;
  height: 20px;
  &:focus {
    border: 1px solid #000;
  }
`;

const StyledProjectView = styled.div`
  width: calc(100vw - 65vh * (16 / 9));
  max-height: 65vh;
`;

interface State {
  currentCinematic: string | undefined;
  newCineName: string | undefined;
  project: Project;
  projectPath: string | undefined;
}
export default class ProjectManager extends React.Component<any, State> {
  private ws: WebSocket;

  constructor(props: any) {
    super(props);
    this.ws = new WebSocket(BAKKESMOD_SERVER);
    this.ws.addEventListener('open', () => {
      this.ws.send(`rcon_password ${RCON_PASSWORD}`);
    });
    this.state = {
      currentCinematic: undefined,
      newCineName: undefined,
      project: { replays: [], cinematics: [] },
      projectPath: undefined,
    } as State;
    ipcRenderer.on(
      'load-project',
      (_, loadedProject: Project, path: string) => {
        this.setState({ project: loadedProject, projectPath: path });
        document.title = `Rockey - ${path}`;
      }
    );
    ipcRenderer.on('import-replay', (_, importedReplayPath) => {
      this.setState({
        ...this.state,
        project: {
          ...this.state.project,
          replays: [
            ...this.state.project.replays,
            {
              name: basename(importedReplayPath, '.replay'),
              path: importedReplayPath,
            },
          ],
        },
      });
    });
  }

  newCinematic() {
    if (!this.state.newCineName) {
      return;
    }
    this.setState({
      ...this.state,
      currentCinematic: this.state.newCineName,
      project: {
        ...this.state.project,
        cinematics: [
          ...this.state.project.cinematics,
          {
            name: this.state.newCineName,
            snapshots: {},
          },
        ],
      },
    });
    this.ws.send(`dolly_path_clear`);
  }

  render() {
    const newCineNameChange = (event: ChangeEvent<HTMLInputElement>) => {
      this.setState({
        ...this.state,
        newCineName: event.target.value,
      });
    };

    const handleCineChange = (name: string) => {
      this.setState({
        ...this.state,
        currentCinematic: name,
      });

      if (name) {
        const cinematic = this.state.project.cinematics.filter(
          (e) => e.name === name
        )[0];
        writeFileSync(WIN64_PATH, JSON.stringify(cinematic.snapshots));
        // setTimeout(() => , 600);
        this.ws.send(`dolly_path_load .rockey`);
      }
    };

    const handlePathChange = (path: DollyCamPath) => {
      this.setState({
        ...this.state,
        project: {
          ...this.state.project,
          cinematics: this.state.project.cinematics.map((cine) => {
            if (cine.name === this.state.currentCinematic) {
              return {
                name: cine.name,
                snapshots: path,
              };
            }
            return cine;
          }),
        },
      });
    };

    const cinematic = this.state.currentCinematic
      ? this.state.project.cinematics.filter(
          (e) => e.name === this.state.currentCinematic
        )[0]
      : undefined;

    return (
      <>
        <Layout>
          <StyledProjectView>
            <ProjectContents
              replays={this.state.project.replays}
              cinematics={this.state.project.cinematics}
              onChange={handleCineChange}
            />
            <form
              onSubmit={(event) => {
                event.preventDefault();
                this.newCinematic();
              }}
            >
              <NewCineInput type="text" onChange={newCineNameChange} />
            </form>
          </StyledProjectView>
          <Preview />
        </Layout>
        <PathEditor cinematic={cinematic} onChange={handlePathChange} />
      </>
    );
  }
}
