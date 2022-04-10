import {User} from "./User";
import {Project} from "./Project";

export interface Task {
  id: number;
  name: string;
  description: string;
  createTime: string;
  dueTime: string;
  lastEditTime: string;
  startTime: string;
  endTime: string;
  priority: string;
  stage: string;
  type: string;
  overdue: boolean;
  creator: User;
  assignee: User;
  project: Project;
}
