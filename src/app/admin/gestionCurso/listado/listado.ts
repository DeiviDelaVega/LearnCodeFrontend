import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import Swal from 'sweetalert2';

import { AdminCourseService } from '../../../service/AdminCourseService';
import { AdminCourseDto } from '../../../models/AdminCourseDto';

@Component({
  selector: 'app-listado',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './listado.html',
  styleUrl: './listado.scss',
})
export class ListadoComponent implements OnInit {

  courses: AdminCourseDto[] = [];
  filteredCourses: AdminCourseDto[] = [];

  search: string = '';
  published: string = 'ALL';

  page: number = 0;
  totalPages: number = 0;

  constructor(
    private readonly router: Router,
    private readonly courseService: AdminCourseService
  ) { }

  ngOnInit(): void {
    this.loadCourses();
  }

  private loadCourses(): void {
    this.courseService.getAll().subscribe({
      next: (courses) => {
        this.courses = courses;
        this.filteredCourses = courses;
      },
      error: () => this.showError('Error cargando cursos')
    });
  }

  viewDetail(courseId: string): void {
    this.router.navigate(['/admin/gestionCurso/detalle', courseId]);
  }

  confirmDelete(courseId: string): void {
    Swal.fire({
      title: '¿Estás segura?',
      text: 'Este curso será eliminado permanentemente',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed) {
        this.deleteCourse(courseId);
      }
    });
  }

  private deleteCourse(courseId: string): void {
    this.courseService.delete(courseId).subscribe({
      next: () => {
        this.courses = this.courses.filter(c => c.id !== courseId);
        this.filteredCourses = this.filteredCourses.filter(c => c.id !== courseId);

        this.showSuccess('Curso eliminado correctamente');
      },
      error: () => this.showError('No se pudo eliminar el curso')
    });
  }

  applyFilters(): void {
    this.filteredCourses = this.courses.filter(course =>
      this.matchesSearch(course) && this.matchesPublished(course)
    );
  }

  resetFilters(): void {
    this.search = '';
    this.published = 'ALL';
    this.page = 0;
    this.filteredCourses = this.courses;
  }

  private matchesSearch(course: AdminCourseDto): boolean {
    return !this.search ||
      course.title.toLowerCase().includes(this.search.toLowerCase());
  }

  private matchesPublished(course: AdminCourseDto): boolean {
    return this.published === 'ALL' ||
      String(course.isPublished) === this.published;
  }

  changePage(page: number): void {
    this.page = page;
    this.loadCourses();
  }

  private showSuccess(message: string): void {
    Swal.fire({
      icon: 'success',
      title: 'Éxito',
      text: message,
      timer: 1500,
      showConfirmButton: false
    });
  }

  private showError(message: string): void {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: message
    });
  }
}
