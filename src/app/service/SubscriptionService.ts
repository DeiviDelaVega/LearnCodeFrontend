// src/app/services/subscription.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subscription } from '../models/Subscription';

@Injectable({ providedIn: 'root' })
export class SubscriptionService {
  
  private api = 'http://localhost:8080/api/subscription';

  constructor(private http: HttpClient) {}

  getMySubscription() {
    return this.http.get<Subscription>(`${this.api}/me`);
  }

  cancelMySubscription() {
    return this.http.post(
      'http://localhost:8080/api/subscription/cancel',
      {},
      {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('google_token'),
        },
      },
    );
  }
}
