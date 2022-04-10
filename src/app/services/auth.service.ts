import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {User} from "../models/User";
import {UserAuth} from "../models/UserLogin";

const AUTH_API = "http://localhost:8080/api/v1/auth/"

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  public login(user: UserAuth): Observable<any> {
    return this.http.post(AUTH_API + 'login', {
      username: user.username,
      password: user.password
    });
  }

  public registration(user: UserAuth) {
      return this.http.post(AUTH_API + 'register', {
        username: user.username,
        password: user.password,
        name: user.name,
        surname: user.surname
      });
  }
}
