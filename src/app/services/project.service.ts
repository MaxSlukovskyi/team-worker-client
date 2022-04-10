import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Project} from "../models/Project";

const PROJECT_API = "http://localhost:8080/api/v1/admin/projects/"

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  constructor(private httpClient: HttpClient) { }

  public getAll(): Observable<any> {
    return this.httpClient.get(PROJECT_API + 'get/all');
  }

  public delete(id: number): Observable<any> {
    return this.httpClient.delete(PROJECT_API + 'delete/' + id);
  }

  public update(project: Project, id: number): Observable<any> {
    return this.httpClient.put(PROJECT_API + 'update/' + id, project);
  }

  public add(project: Project): Observable<any> {
    return this.httpClient.post(PROJECT_API + 'add', project);
  }
}
