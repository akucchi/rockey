import { ipcRenderer } from "electron";
import { basename } from "path";
import React from "react";
import {Project} from "../interfaces/project";
import { ProjectContents } from "./ProjectContents";

interface State {
  project: Project;
  projectPath: string | undefined;
}
export default class ProjectManager extends React.Component<any, State> {
  constructor(props: any) {
    super(props);
    this.state = {project: {}, projectPath: undefined} as State;
    ipcRenderer.on("load-project", (_, loadedProject: Project, path: string)=> {
      this.setState({project: loadedProject, projectPath: path});
      document.title = `Rockey ${path}`;
    })
    ipcRenderer.on("import-replay", (_, importedReplayPath)=> {
      this.setState({
        ...this.state,
        project: {
          ...this.state.project,
          replays: [
            ...this.state.project.replays,
            {
              name: basename(importedReplayPath, ".replay"),
              path: importedReplayPath
            }
          ]
        }
      });
    })
  }
  render(){
    if(!this.state.project.replays || !this.state.project.cinematics) return(<></>);
    return (<ProjectContents replays={this.state.project.replays} cinematics={this.state.project.cinematics}/>);
  }
}