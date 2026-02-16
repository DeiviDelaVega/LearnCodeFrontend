import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Plan } from '../models/Plan';
import { Subscription } from '../models/Subscription';

@Injectable({
  providedIn: 'root'
})
export class PlanService {

  private API = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  getPlans(): Observable<Plan[]> {
    return this.http.get<Plan[]>(`${this.API}/plans`);
  }

  getMySubscription(): Observable<Subscription> {

  return this.http.get<Subscription>(
    `${this.API}/subscription/me`,
    {
      headers: {
        Authorization:
          'Bearer ' + localStorage.getItem('google_token')
      }
    }
  );
}
}
