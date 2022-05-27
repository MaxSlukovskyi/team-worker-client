import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Project} from "../models/Project";

const PROJECT_ADMIN_API = "http://localhost:8080/api/v1/admin/projects/";
const PROJECT_MANAGER_API = "http://localhost:8080/api/v1/manager/projects/";

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  constructor(private httpClient: HttpClient) { }

  public getAll(): Observable<any> {
    return this.httpClient.get(PROJECT_ADMIN_API + 'get/all');
  }

  public delete(id: number): Observable<any> {
    return this.httpClient.delete(PROJECT_ADMIN_API + 'delete/' + id);
  }

  public add(project: Project): Observable<any> {
    return this.httpClient.post(PROJECT_ADMIN_API + 'add', project);
  }

  public update(project: Project, id: number): Observable<any> {
    return this.httpClient.put(PROJECT_MANAGER_API + 'update/' + id, project);
  }

  public getAllByAuthManager(): Observable<any> {
    return this.httpClient.get(PROJECT_MANAGER_API + 'get/all');
  }
}
