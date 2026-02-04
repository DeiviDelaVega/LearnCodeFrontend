import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule  } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule ],
  templateUrl: './home.html',
  styleUrls: ['./home.scss']
})
export class HomeComponent implements OnInit {

  menuOpen = false;
  userName = 'Usuario';
  userPhoto = '';

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.userName = localStorage.getItem('user_name') || 'Usuario';
    this.userPhoto = localStorage.getItem('user_photo') || '';
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/'], { replaceUrl: true });
  }
}
