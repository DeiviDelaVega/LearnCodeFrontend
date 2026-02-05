import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';

import { PlanService } from '../../service/PlanService';
import { Plan } from '../../models/Plan';

@Component({
  selector: 'app-plans',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './plans.html'
})
export class PlansComponent implements OnInit {

  plans: Plan[] = [];

  loading = true;

  constructor(
    private planService: PlanService,
    private http: HttpClient
  ) {}

 ngOnInit(): void {

  this.planService.getPlans().subscribe({
    next: res => {

      console.log('PLANES BACKEND =>', res);

      this.plans = res;
      this.loading = false;
    },
    error: err => {
      console.error('ERROR PLANES =>', err);
      this.loading = false;
    }
  });

}

  buy(planCode: string) {

    this.http.post<any>(
      'http://localhost:8080/api/stripe/checkout',
      null,
      {
        params: { planCode },
        headers: {
          Authorization:
            'Bearer ' + localStorage.getItem('google_token')
        }
      }
    )
    .subscribe(res => {
      window.location.href = res.url;
    });
  }
}