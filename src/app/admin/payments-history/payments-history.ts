import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentService } from '../../service/PaymentService';
import { Payment } from '../../models/payment';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-payments-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './payments-history.html',
  styleUrl: './payments-history.scss',
})
export class PaymentsHistoryComponent implements OnInit {
  payments: Payment[] = [];
  loading = true;

  constructor(
    private paymentService: PaymentService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loadPayments();

    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      this.loadPayments();
    });
  }

  loadPayments(): void {
    this.loading = true;

    this.paymentService.getAllPayments().subscribe({
      next: (data: Payment[]) => {
        this.payments = data;
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Error cargando pagos', err);
        this.loading = false;
      },
    });
  }
}
