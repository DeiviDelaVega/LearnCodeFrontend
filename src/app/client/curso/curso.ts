import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ClientCourse } from '../../models/ClientCourseDto';
import { ClientCourseService } from '../../service/CourseService';
import { PlanService } from '../../service/PlanService';

@Component({
  selector: 'app-curso',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './curso.html',
  styleUrl: './curso.scss',
})
export class CursoComponent implements OnInit {

  courses: ClientCourse[] = [];
  filteredCourses: ClientCourse[] = [];
  subscriptionPlanCode!: string;

  searchTitle: string = '';
  showFilters: boolean = false;
  selectedCategory: string | null = null;
  selectedCourse: ClientCourse | null = null;
  showPricingModal: boolean = false;

  categories: string[] = [
    'Backend',
    'Frontend',
    'Mobile',
    'DevOps',
    'Data Science'
  ];

  constructor(
    private router: Router,
    private readonly courseService: ClientCourseService,
    private readonly planService: PlanService
  ) { }

  ngOnInit(): void {
    this.loadSubscription();
  }

  private loadCourses(): void {
    this.courseService.getAll().subscribe({
      next: (data) => {
        console.log("🔥 Cursos recibidos:", data);
        this.courses = data.map(course => ({
          ...course,
          unlocked:
            course.isFree ||
            course.requiredPlanCode === this.subscriptionPlanCode
        }));

        this.filteredCourses = this.courses;
      },
      error: (err) => console.error('Error loading courses:', err),
    });
  }

  private loadSubscription(): void {
    this.planService.getMySubscription().subscribe({
      next: (sub) => {
        this.subscriptionPlanCode = sub.planCode;
        this.loadCourses();
      }
    });
  }

  search(): void {
    const query = this.searchTitle.trim().toLowerCase();

    if (!query) {
      this.filteredCourses = this.courses;
      return;
    }

    this.filteredCourses = this.courses.filter((course) =>
      course.title.toLowerCase().includes(query)
    );
  }

  filterByCategory(category: string): void {
    this.selectedCategory = category;

    this.filteredCourses = this.courses.filter(course =>
      course.subtitle?.toLowerCase().includes(category.toLowerCase())
    );
  }

  clearFilters(): void {
    this.selectedCategory = null;
    this.filteredCourses = this.courses;
  }

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }

  isColor(value: string): boolean {
    return (
      value.startsWith('#') ||
      value.startsWith('rgb') ||
      value.startsWith('rgba')
    );
  }

  getGlowClassByIndex(index: number): string {
    const glows = [
      'card-glow-cyan',
      'card-glow-indigo',
      'card-glow-pink',
      'card-glow-green',
      'card-glow-orange'
    ];

    return glows[index % glows.length];
  }

  getCardStyle(course: ClientCourse) {
    if (this.isColor(course.coverUrl)) {
      return {
        '--card-glow': course.coverUrl,
        'border-color': course.coverUrl,
      };
    }

    return {
      '--card-glow': 'rgba(0,255,255,0.25)',
    };
  }

  onCourseClick(course: ClientCourse) {

    // 🔒 Curso bloqueado → modal
    if (!course.unlocked) {
      this.selectedCourse = course;
      this.showPricingModal = true;
      return;
    }

    // ✅ Curso desbloqueado → navegar normal
    console.log("Entrar al curso:", course.title);

    // aquí luego harás:
    // this.router.navigate(['/curso', course.id]);
  }

  goToPlans() {
    this.closeModal(); // opcional
    this.router.navigate(['/client/plans']);
  }

  closeModal() {
    this.showPricingModal = false;
  }
}
