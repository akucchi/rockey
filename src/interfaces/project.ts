
export interface Replay {
    name: string;
    path: string;
    //TODO: support relative paths
}
export interface DollyCamPath {
    [Key: string]: {
        FOV: number;
        frame: number;
        location: {
            x: number
            y: number
            z: number
        };
        rotation: {
            pitch: number;
            roll: number;
            yaw: number;
        };
        timestamp: number;
        weight: number;
    }
}
export interface Cinematic {
    name: string;
    snapshots: DollyCamPath;
}
export interface Project {
    replays: Replay[];
    cinematics: Cinematic[];
}