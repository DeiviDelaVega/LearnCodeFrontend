import { Component } from '@angular/core';
import { AdminCourseDto } from '../../../models/AdminCourseDto';
import { AdminCourseService } from '../../../client/curso/service/AdminCourseService';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-crear',
  imports: [FormsModule,],
  templateUrl: './crear.html',
  styleUrl: './crear.scss',
})
export class InsertCourse {

  course: AdminCourseDto = {
    id: '',
    title: '',
    subtitle: '',
    description: '',
    iconUrl: '',
    coverUrl: '',
    isFree: false,
    requiredPlanCode: '',
    isPublished: false,
    createdAt: new Date().toISOString(),
  };

  constructor(private courseService: AdminCourseService, private router: Router) { }

  createCourse() {
    this.courseService.create(this.course).subscribe({
      next: (res) => {
        console.log('Curso creado', res);
        alert('Curso creado exitosamente!');
      },
      error: (err) => {
        console.error('Error al crear curso', err);
        alert('Ocurrió un error al crear el curso.');
      }
    });
  }

}

