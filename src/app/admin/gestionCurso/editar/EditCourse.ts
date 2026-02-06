import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminCourseService } from '../../../service/AdminCourseService';
import { AdminCourseDto } from '../../../models/AdminCourseDto';
import { PlanService } from '../../../service/PlanService';
import { Plan } from '../../../models/Plan';
import { CloudinaryService } from '../../../service/CloudinaryService';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-edit-course',
  imports: [CommonModule, FormsModule],
  templateUrl: './editar.html'
})
export class EditCourse implements OnInit {

  plans: Plan[] = [];
  course!: AdminCourseDto;
  courseId!: string;

  iconPreview: string | null = null;
  selectedIconFile: File | null = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private planService: PlanService,
    private courseService: AdminCourseService,
  private cloudinaryService: CloudinaryService
  ) { }

  ngOnInit(): void {
    this.courseId = this.route.snapshot.paramMap.get('id')!;
    console.log('🆔 ID recibido:', this.courseId);

    this.loadPlans();
    this.loadCourse();
  }

  private loadPlans(): void {
    this.planService.getPlans().subscribe({
      next: (plans) => {
        this.plans = plans.filter(p => p.code !== 'FREE');
      },
      error: () => {
        Swal.fire('Error', 'No se pudieron cargar los planes', 'error');
      }
    });
  }

  loadCourse(): void {
    this.courseService.getById(this.courseId).subscribe({
      next: (data) => {
        this.course = data;
        this.iconPreview = data.iconUrl;

        // Si es gratis, no debe tener plan
        if (this.course.isFree) {
          this.course.requiredPlanCode = '';
        }
      },
      error: () => {
        Swal.fire('Error', 'Error al cargar el curso', 'error');
      }
    });
  }

  updateCourse(): void {

    // Validación
    if (!this.course.isFree && !this.course.requiredPlanCode) {
      Swal.fire(
        'Atención',
        'Debes seleccionar un plan para cursos no gratuitos',
        'warning'
      );
      return;
    }

    // Si es gratis, anulamos el plan
    if (this.course.isFree) {
      this.course.requiredPlanCode = null as any;
    }

    if (this.selectedIconFile) {
      this.cloudinaryService.uploadIcon(this.selectedIconFile).subscribe({
        next: (url) => {
          this.course.iconUrl = url;
          this.saveUpdate();
        },
        error: () => {
          Swal.fire('Error', 'No se pudo subir la imagen', 'error');
        }
      });
    } else {
      this.saveUpdate();
    }
  }

  private saveUpdate(): void {
    this.courseService.update(this.courseId, this.course).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: '¡Curso actualizado!',
          text: 'Los cambios se guardaron correctamente',
          timer: 1500,
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

  volver(): void {
    this.router.navigate(['/admin/gestionCurso/listado']);
  }

}
