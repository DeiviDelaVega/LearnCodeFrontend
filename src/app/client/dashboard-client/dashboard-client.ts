import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard-client',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard-client.html'
})
export class DashboardClient {

  menuOpen = false;
  userPhoto = '';

  constructor(private router: Router) {}

  ngOnInit() {
    this.userPhoto = localStorage.getItem('user_photo') || '';
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/'], { replaceUrl: true });
  }

  toggleTheme() {
    document.documentElement.classList.toggle('dark');
  }
}