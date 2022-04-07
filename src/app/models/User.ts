import {Position} from "./Position";
import {Role} from "./Role";

export interface User {
  id: number;
  username: string;
  name: string;
  surname: string;
  position: Position[];
  roles: Role[];
}
