import { Component } from '@angular/core';
import { AdminCourseDto } from '../../../models/AdminCourseDto';
import { AdminCourseService } from '../../../service/AdminCourseService';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-crear',
  imports: [ CommonModule, FormsModule],
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

  createCourse(): void {
  this.courseService.create(this.course).subscribe({
    next: () => {
      Swal.fire({
        icon: 'success',
        title: '¡Curso creado!',
        text: 'El curso se creó correctamente',
        timer: 1500,
        showConfirmButton: false
      }).then(() => {
        this.router.navigate(['/admin/gestionCurso/listado']);
      });
    },
    error: () => {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo crear el curso'
      });
    }
  });
}



  iconPreview: string | null = null;

  onIconSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      this.iconPreview = reader.result as string;
      this.course.iconUrl = this.iconPreview; // guardamos texto base64
    };
    reader.readAsDataURL(file);
  }



}

