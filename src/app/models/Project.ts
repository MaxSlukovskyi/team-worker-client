import {Position} from "./Position";
import {User} from "./User";

export interface Project{
  id: number;
  name: string;
  createTime: string;
  projectStage: string;
  projectType: string;
  manager: User;
  positions: Position[];
}
