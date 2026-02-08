import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';

import { AdminCourseService } from '../../../service/AdminCourseService';
import { PlanService } from '../../../service/PlanService';
import { CloudinaryService } from '../../../service/CloudinaryService';
import { AdminCourseDto } from '../../../models/AdminCourseDto';
import { Plan } from '../../../models/Plan';

@Component({
  selector: 'app-edit-course',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './editar.html'
})
export class EditCourse implements OnInit {

  form!: FormGroup;
  plans: Plan[] = [];
  courseId!: string;
  iconPreview: string | null = null;
  selectedIconFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private courseService: AdminCourseService,
    private planService: PlanService,
    private cloudinaryService: CloudinaryService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.courseId = this.route.snapshot.paramMap.get('id')!;
    this.loadPlans();
    this.initForm();
    this.loadCourse();
  }

  private initForm(): void {
    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      subtitle: ['', [Validators.required, Validators.minLength(5)]],
      description: ['', [Validators.required, Validators.minLength(20)]],
      coverUrl: ['#000000', Validators.required],
      isFree: [false],
      requiredPlanCode: [''],
      isPublished: [false]
    });

    // Validación dinámica de plan requerido
    this.form.get('isFree')?.valueChanges.subscribe(isFree => {
      const planCtrl = this.form.get('requiredPlanCode');
      if (!isFree) {
        planCtrl?.setValidators([Validators.required]);
      } else {
        planCtrl?.clearValidators();
        planCtrl?.setValue('');
      }
      planCtrl?.updateValueAndValidity();
    });
  }

  private loadPlans(): void {
    this.planService.getPlans().subscribe({
      next: plans => this.plans = plans.filter(p => p.code !== 'FREE'),
      error: () => Swal.fire('Error', 'No se pudieron cargar los planes', 'error')
    });
  }

  private loadCourse(): void {
    this.courseService.getById(this.courseId).subscribe({
      next: (course) => {
        this.form.patchValue(course);
        this.iconPreview = course.iconUrl;

        // Si el curso es gratis, anulamos el plan
        if (course.isFree) {
          this.form.get('requiredPlanCode')?.setValue('');
        }

        this.cd.detectChanges();
      },
      error: () => Swal.fire('Error', 'No se pudo cargar el curso', 'error')
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

  updateCourse(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      Swal.fire('Formulario inválido', 'Completa todos los campos correctamente', 'warning');
      return;
    }

    const courseData: AdminCourseDto = {
      ...this.form.value,
      iconUrl: this.iconPreview || '', // mantener icono actual si no hay cambio
      id: this.courseId,
      createdAt: new Date().toISOString()
    } as AdminCourseDto;

    const save = () => {
      this.courseService.update(this.courseId, courseData).subscribe({
        next: () => {
          Swal.fire('¡Curso actualizado!', '', 'success').then(() => {
            this.router.navigate(['/admin/gestionCurso/listado']);
          });
        },
        error: () => Swal.fire('Error', 'No se pudo actualizar el curso', 'error')
      });
    };

    if (this.selectedIconFile) {
      this.cloudinaryService.uploadIcon(this.selectedIconFile).subscribe({
        next: url => {
          courseData.iconUrl = url;
          save();
        },
        error: () => Swal.fire('Error', 'No se pudo subir la imagen', 'error')
      });
    } else {
      save();
    }
  }

  volver(): void {
    this.router.navigate(['/admin/gestionCurso/listado']);
  }

}
