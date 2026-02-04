import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminCourseService } from '../../../service/AdminCourseService';
import { AdminCourseDto } from '../../../models/AdminCourseDto';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-edit-course',
  imports: [CommonModule, FormsModule],
  templateUrl: './editar.html'
})
export class EditCourse implements OnInit {

  course!: AdminCourseDto;
  courseId!: string;

  iconPreview: string | null = null;
  selectedIconFile: File | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private courseService: AdminCourseService
  ) { }

  ngOnInit(): void {
    this.courseId = this.route.snapshot.paramMap.get('id')!;
    console.log('🆔 ID recibido:', this.courseId);

    this.loadCourse();
  }

  loadCourse(): void {
    this.courseService.getById(this.courseId).subscribe({
      next: (data) => {
        this.course = data;
        this.iconPreview = data.iconUrl;
      },
      error: () => {
        alert('Error al cargar el curso');
      }
    });
  }

  updateCourse(): void {
    this.courseService.update(this.courseId, this.course).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: '¡Curso actualizado!',
          text: 'Los cambios se guardaron correctamente',
          confirmButtonText: 'Aceptar'
        }).then(() => {
          this.router.navigate(['/admin/gestionCurso/listado']);
        });
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo actualizar el curso'
        });
      }
    });

  }

  onIconSelected(event: any): void {
    const file = event.target.files[0];
    if (!file) return;

    this.selectedIconFile = file;

    const reader = new FileReader();
    reader.onload = () => this.iconPreview = reader.result as string;
    reader.readAsDataURL(file);
  }
}
