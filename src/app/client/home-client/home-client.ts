import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home-client',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home-client.html'
})
export class HomeClient {

  userName = 'Usuario';

  ngOnInit() {
    this.userName = localStorage.getItem('user_name') || 'Usuario';
  }

}