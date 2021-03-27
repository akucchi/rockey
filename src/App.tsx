import { ipcRenderer } from 'electron';
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import {ProjectContents} from "./components/ProjectContents";
import {Project} from "./interfaces/project";
import {basename} from "path";
const Hello = () => {
  const [project, setProject] = useState<Project>({"replays" : [], "cinematics": []});
  const [projectPath, setProjectPath] = useState<string | undefined>(undefined);
  const loadProject = (_event: any, project : Project, path: string) => {
      setProject(project);
      setProjectPath(path);
      console.log("loaded project:")
      console.log(project);
      console.log(path);
      document.title = `Rockey ${path}`;
    };
  const importReplay = (_event: any, path: string) => {
      console.log(project);
      console.log("imported replay:")
      console.log(path);
      //setProject({"replays" : [...project.replays, {name: basename(path, ".replay") , path}], "cinematics": project.cinematics})
      //setProject({...project, "replays" : [...project.replays, {name: basename(path, ".replay") , path}]});
      project.replays.push({name: basename(path, ".replay") , path});
      setProject(project);
      console.log(project.replays);
    };
  useEffect(() => {
    ipcRenderer.on("load-project", loadProject); 
    ipcRenderer.on("import-replay", importReplay); 
  }, []);
  useEffect(()=> {
    console.log(project);
  });
  return <ProjectContents replays={project.replays} cinematics={project.cinematics}/>;
};

export default function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" component={Hello} />
      </Switch>
    </Router>
  );
}
