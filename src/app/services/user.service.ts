import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {User} from "../models/User";
import {Position} from "../models/Position";

const USER_ADMIN_API = "http://localhost:8080/api/v1/admin/users/";
const USER_API = "http://localhost:8080/api/v1/users/";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private httpClient: HttpClient) { }

  public getAll(): Observable<any> {
    return this.httpClient.get(USER_ADMIN_API + 'get/all');
  }

  public getUserByUsername(username: string): Observable<any> {
    return this.httpClient.get(USER_API + 'get/' + username);
  }

  public update(user: User, id: number): Observable<any> {
    return this.httpClient.put(USER_ADMIN_API + 'update/' + id, user);
  }

  public setPosition(id: number, position: Position): Observable<any> {
    return this.httpClient.put(USER_ADMIN_API + 'add/position/' + id, position);
  }

  public delete(id: number): Observable<any> {
    return this.httpClient.delete(USER_ADMIN_API + 'delete/' + id);
  }

  public getUsersByPosition(id: number): Observable<any> {
    return this.httpClient.get(USER_API + 'get/all/position/' + id);
  }

}
