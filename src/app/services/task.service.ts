import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Task} from "../models/Task";
import {StatisticsComponent} from "../admin/statistics/statistics.component";
import {StatisticsRequest} from "../models/StatisticsRequest";

const TASK_ADMIN_API = 'http://localhost:8080/api/v1/admin/tasks/';
const TASK_USER_API = 'http://localhost:8080/api/v1/tasks/'
const TASK_MANAGER_API = 'http://localhost:8080/api/v1/manager/task/'

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private httpClient: HttpClient) { }

  public getAllTasksForAdministrator(): Observable<any> {
    return this.httpClient.get(TASK_ADMIN_API + 'get/all');
  }

  public getAllTasksForManager(): Observable<any> {
    return this.httpClient.get(TASK_MANAGER_API + 'get/all');
  }

  public getTasksByStage(stage: string): Observable<any> {
    return this.httpClient.get(TASK_USER_API + 'get/all/' + stage);
  }

  public getTasksByStageForManager(stage: string): Observable<any> {
    return this.httpClient.get(TASK_MANAGER_API + 'get/all/' + stage);
  }

  public getTasksByStageForAdmin(stage: string): Observable<any> {
    return this.httpClient.get(TASK_ADMIN_API + 'get/all/' + stage);
  }

  public addTask(task: Task): Observable<any> {
    return this.httpClient.post(TASK_USER_API + 'add', task);
  }

  public updateTask(id: number, task: Task): Observable<any> {
    return this.httpClient.put(TASK_MANAGER_API + 'update/' + id, task);
  }

  public deleteTask(id: number): Observable<any> {
    return this.httpClient.delete(TASK_USER_API + 'delete/' + id);
  }

  public changeStage(id: number, stage: string): Observable<any> {
    return this.httpClient.put(TASK_USER_API + 'update/' + id + '/' + stage,'');
  }

  public getUserTasksByFilter(id: number, date: StatisticsRequest): Observable<any> {
    return this.httpClient.post(TASK_ADMIN_API + 'get/all/' + id, date);
  }
}
