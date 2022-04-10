import { Injectable } from '@angular/core';
import {User} from "../models/User";
import {UserAuth} from "../models/UserLogin";
import {Role} from "../models/Role";

const TOKEN_KEY = 'auth-token';
const USER_KEY = 'auth-user';
const USER_ROLE = 'auth-user-role';

@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {

  constructor() { }

  public saveToken(token: string): void {
    window.sessionStorage.removeItem(TOKEN_KEY);
    window.sessionStorage.setItem(TOKEN_KEY, token);
  }

  public getToken(): string {
    return <string>sessionStorage.getItem(TOKEN_KEY);
  }

  public saveUser(user: User): void {
    window.sessionStorage.removeItem(USER_KEY);
    window.sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  public getUser(): any {
    return JSON.parse(<string>sessionStorage.getItem(USER_KEY));
  }

  public setRole(role: Role): void {
    window.sessionStorage.setItem(USER_ROLE, role.name);
  }

  public getRole(): string {
    return <string>sessionStorage.getItem(USER_ROLE);
  }

  logOut(): void {
    window.sessionStorage.clear();
    window.location.reload();
  }
}
