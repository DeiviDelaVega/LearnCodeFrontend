import { ChangeDetectorRef, Component, NgZone, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

interface Slide {
  image: string;
  tag: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class DashboardComponent implements OnInit {
  menuOpen = false;
  isDarkMode: boolean = false;
  userName = 'Administrador';
  userPhoto = '';
  totalCourses = 0;
  totalUsers = 0;
  dailyIncome = 0;

  currentIndex: number = 0;
  slides: Slide[] = [
    {
      image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085',
      tag: 'Clientes',
      title: 'Gestión de Clientes',
      description: 'Revisa, agrega o bloquea usuarios, actualiza información y controla su estado.'
    },
    {
      image: 'https://images.unsplash.com/photo-1593642532973-d31b6557fa68',
      tag: 'Suscripciones',
      title: 'Control de Suscripciones',
      description: 'Administra planes activos, renueva suscripciones y verifica pagos pendientes.'
    },
    {
      image: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159',
      tag: 'Cursos',
      title: 'Gestión de Cursos',
      description: 'Crea, edita y publica cursos; organiza módulos y archivos asociados.'
    },
    {
      image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c',
      tag: 'Contenido',
      title: 'Revisión de Contenido',
      description: 'Verifica documentos, videos y recursos subidos por instructores.'
    }
  ];
  autoPlayInterval: any;

  constructor(
    private router: Router, 
    private http: HttpClient, 
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.userName = localStorage.getItem('user_name') || 'Admin';
    this.userPhoto = localStorage.getItem('user_photo') || '';

    this.isDarkMode = localStorage.getItem('theme') === 'dark';


    this.loadDashboardData();

    this.startAutoPlay();
  }

  ngOnDestroy(): void {
    if (this.autoPlayInterval) clearInterval(this.autoPlayInterval);
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/'], { replaceUrl: true });
  }

  startAutoPlay() {
    if (this.autoPlayInterval) clearInterval(this.autoPlayInterval);

    this.autoPlayInterval = setInterval(() => {
      this.ngZone.run(() => {
        this.currentIndex = (this.currentIndex + 1) % this.slides.length;
        this.cdr.detectChanges();
      });
    }, 5000);
  }

  nextSlide(): void {
    this.currentIndex = (this.currentIndex + 1) % this.slides.length;
    this.restartAutoPlay();
  }

  prevSlide(): void {
    this.currentIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
    this.restartAutoPlay();
  }

  goToSlide(index: number): void {
    this.currentIndex = index;
    this.restartAutoPlay();
  }

  private restartAutoPlay() {
    this.startAutoPlay();
  }

  toggleTheme() {
    document.documentElement.classList.toggle('dark');
    this.isDarkMode = !this.isDarkMode;
  }

  private loadDashboardData() {
    this.http.get<{
      totalCourses: number;
      totalUsers: number;
      dailyIncomeCents: number;
    }>('http://localhost:8080/api/admin/dashboard')
      .subscribe(data => {
        this.totalCourses = data.totalCourses;
        this.totalUsers = data.totalUsers;
        this.dailyIncome = data.dailyIncomeCents / 100;
      });
  }
}
