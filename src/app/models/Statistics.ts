import {Position} from "./Position";

export interface Statistics {
  username: string,
  name: string,
  surname: string,
  position: Position[],
  percentageOnTime: number,
  totalCompletedTasks: number
}
