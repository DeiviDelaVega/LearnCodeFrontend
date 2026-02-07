import { Component, OnInit } from '@angular/core';
import { AdminCourseDto } from '../../../models/AdminCourseDto';
import { AdminCourseService } from '../../../service/AdminCourseService';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PlanService } from '../../../service/PlanService';
import { Plan } from '../../../models/Plan';
import Swal from 'sweetalert2';
import { CloudinaryService } from '../../../service/CloudinaryService'

@Component({
  selector: 'app-crear',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './crear.html',
  styleUrl: './crear.scss',
})
export class InsertCourse implements OnInit {

  plans: Plan[] = [];
  iconFile!: File;
  iconPreview: string | null = null;

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

  constructor(
    private cloudinaryService: CloudinaryService,
    private courseService: AdminCourseService,
    private planService: PlanService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.planService.getPlans().subscribe({
      next: plans => {
        this.plans = plans.filter(p => p.code !== 'FREE');
      }
    });
  }

  createCourse(): void {

    if (!this.iconFile) {
      Swal.fire('Imagen requerida', 'Selecciona un icono para el curso', 'warning');
      return;
    }

    this.cloudinaryService.uploadIcon(this.iconFile).subscribe({
      next: (url) => {
        this.course.iconUrl = url;
        this.saveCourse();
      },
      error: (err) => {
        console.log("🔥 ERROR COMPLETO:", err);
        console.log("🔥 ERROR BODY:", err.error);
        Swal.fire('Error', 'No se pudo subir la imagen', 'error');
      }

    });
  }

  private saveCourse(): void {
    this.courseService.create(this.course).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: '¡Curso creado!',
          timer: 1500,
          showConfirmButton: false
        }).then(() => {
          this.router.navigate(['/admin/gestionCurso/listado']);
        });
      },
      error: () => {
        Swal.fire('Error', 'No se pudo crear el curso', 'error');
      }
    });
  }

  onIconSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    this.iconFile = file;

    const reader = new FileReader();
    reader.onload = () => this.iconPreview = reader.result as string;
    reader.readAsDataURL(file);
  }

  volver(): void {
    this.router.navigate(['/admin/gestionCurso/listado']);
  }
}
