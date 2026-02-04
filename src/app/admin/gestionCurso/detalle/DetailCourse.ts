import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminCourseService } from '../../../service/AdminCourseService';
import { AdminCourseDto } from '../../../models/AdminCourseDto';

@Component({
  selector: 'app-detalle',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './detalle.html',
})
export class DetailCourse implements OnInit {

  course!: AdminCourseDto;
  courseId!: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private courseService: AdminCourseService
  ) {}

  ngOnInit(): void {
    this.courseId = this.route.snapshot.paramMap.get('id')!;
    console.log('🆔 ID recibido:', this.courseId);

    this.loadCourse();
  }

  loadCourse(): void {
    this.courseService.getById(this.courseId).subscribe({
      next: (data) => {
        console.log('📦 Curso recibido:', data);
        this.course = data;
      },
      error: (err) => {
        console.error(err);
        alert('Error al cargar el curso');
        this.router.navigate(['/admin/gestionCurso/listado']);
      }
    });
  }

  volver(): void {
    this.router.navigate(['/admin/gestionCurso/listado']);
  }
}
