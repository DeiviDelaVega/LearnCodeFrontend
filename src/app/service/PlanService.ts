import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Plan } from '../models/Plan';

@Injectable({
  providedIn: 'root'
})
export class PlanService {

  private api = 'http://localhost:8080/api/plans';

  constructor(private http: HttpClient) {}

  getPlans(): Observable<Plan[]> {
    return this.http.get<Plan[]>(this.api);
  }
}
