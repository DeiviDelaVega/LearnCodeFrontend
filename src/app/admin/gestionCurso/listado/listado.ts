import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AdminCourseService } from '../../../service/AdminCourseService';
import { AdminCourseDto } from '../../../models/AdminCourseDto';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-listado',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './listado.html',
  styleUrl: './listado.scss',
})
export class ListadoComponent implements OnInit {

  courses: AdminCourseDto[] = [];
  pagesArray: number[] = [];

  search: string = '';
  published: string = 'ALL';
  page: number = 0;
  totalPages: number = 0;
  pageSize: number = 4;

  constructor(
    private readonly router: Router,
    private cd: ChangeDetectorRef,
    private readonly courseService: AdminCourseService
  ) { }

  ngOnInit(): void {
    this.loadCourses();
  }

  loadCourses(): void {
    this.courseService.getPaged(this.page, this.pageSize).subscribe({
      next: (res) => {
        this.courses = res.content;                  
        this.page = res.currentPage ?? 0;            
        this.totalPages = res.totalPages ?? 1;      
        this.pagesArray = Array.from({ length: this.totalPages }, (_, i) => i);
        this.cd.detectChanges();                    
      },
      error: () => this.showError('Error cargando cursos paginados')
    });
  }

  changePage(newPage: number): void {
    if (newPage < 0 || newPage >= this.totalPages) return;
    this.page = newPage;
    this.loadCourses(); 
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
        this.showSuccess('Curso eliminado correctamente');
        this.loadCourses(); 
      },
      error: () => this.showError('No se pudo eliminar el curso')
    });
  }

  applyFilters(): void {
    this.page = 0; 
    this.loadCourses(); 
  }

  resetFilters(): void {
    this.search = '';
    this.published = 'ALL';
    this.page = 0;
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
