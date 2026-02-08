import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

import { AdminCourseService } from '../../../service/AdminCourseService';
import { PlanService } from '../../../service/PlanService';
import { CloudinaryService } from '../../../service/CloudinaryService';
import { Plan } from '../../../models/Plan';
import { AdminCourseDto } from '../../../models/AdminCourseDto';

@Component({
  selector: 'app-crear',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './crear.html',
  styleUrl: './crear.scss',
})
export class InsertCourse implements OnInit {

  plans: Plan[] = [];
  iconFile!: File;
  iconPreview: string | null = null;

  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private cloudinaryService: CloudinaryService,
    private courseService: AdminCourseService,
    private planService: PlanService,
    private router: Router
  ) {
    // ✅ Form inicializado aquí (sin error)
    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      subtitle: ['', [Validators.required, Validators.minLength(5)]],
      description: ['', [Validators.required, Validators.minLength(20)]],
      coverUrl: ['#000000', Validators.required],
      isFree: [false],
      requiredPlanCode: [''],
      isPublished: [false],
    });
  }

  ngOnInit(): void {

    // Planes
    this.planService.getPlans().subscribe({
      next: plans => {
        this.plans = plans.filter(p => p.code !== 'FREE');
      }
    });

    // Validación dinámica
    this.form.get("isFree")?.valueChanges.subscribe(isFree => {
      const planCtrl = this.form.get("requiredPlanCode");

      if (!isFree) {
        planCtrl?.setValidators([Validators.required]);
      } else {
        planCtrl?.clearValidators();
        planCtrl?.setValue('');
      }

      planCtrl?.updateValueAndValidity();
    });
  }

  createCourse(): void {

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      Swal.fire("Formulario inválido", "Completa todos los campos", "warning");
      return;
    }

    if (!this.iconFile) {
      Swal.fire("Imagen requerida", "Selecciona un icono", "warning");
      return;
    }

    this.cloudinaryService.uploadIcon(this.iconFile).subscribe({
      next: (url) => {

        const courseData: AdminCourseDto = {
          ...this.form.value,
          iconUrl: url,
          createdAt: new Date().toISOString(),
          id: ''
        } as AdminCourseDto;

        this.saveCourse(courseData);
      },

      error: () => {
        Swal.fire("Error", "No se pudo subir la imagen", "error");
      }
    });
  }

  private saveCourse(courseData: AdminCourseDto): void {

    this.courseService.create(courseData).subscribe({
      next: () => {
        Swal.fire({
          icon: "success",
          title: "¡Curso creado!",
          timer: 1500,
          showConfirmButton: false
        }).then(() => {
          this.router.navigate(['/admin/gestionCurso/listado']);
        });
      },

      error: () => {
        Swal.fire("Error", "No se pudo crear el curso", "error");
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
