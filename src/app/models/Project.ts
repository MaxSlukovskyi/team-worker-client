import {Position} from "./Position";

export interface Project{
  id: number;
  name: string;
  createTime: string;
  projectStage: string;
  projectType: string;
  //tasks: Task[];
  positions: Position[];
}
