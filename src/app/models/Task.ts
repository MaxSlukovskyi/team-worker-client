import {User} from "./User";
import {Project} from "./Project";

export interface Task {
  id: number;
  name: string;
  description: string;
  createTime: Date;
  dueDate: Date;
  lastEditTime: Date;
  startTime: Date;
  endTime: Date;
  priority: string;
  stage: string;
  type: string;
  creator: User;
  assignee: User;
  project: Project;
}
