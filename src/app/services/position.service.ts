import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Position} from "../models/Position";
import {Observable} from "rxjs";

const POSITIONS_API = "http://localhost:8080/api/v1/admin/positions/";

@Injectable({
  providedIn: 'root'
})
export class PositionService {

  constructor(private httpClient: HttpClient) { }

  public addPosition(position: Position):Observable<any> {
    return this.httpClient.post(POSITIONS_API + 'add', position);
  }

  public deletePosition(id: number): Observable<any> {
    return this.httpClient.delete(POSITIONS_API + 'delete/' + id);
  }
}
