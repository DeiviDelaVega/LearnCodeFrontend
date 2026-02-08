import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

// Ahora sí encontrará el archivo si lo moviste a src/app/service/
import { AdminContentService, CourseModule } from '../../../service/AdminContentService';
@Component({
  selector: 'app-content-manager',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './content-manager.component.html',
  styleUrls: ['./content-manager.component.scss']
})
export class ContentManagerComponent implements OnInit {

  private route = inject(ActivatedRoute);
  private contentService = inject(AdminContentService);
  private sanitizer = inject(DomSanitizer);

  courseId: string = '';
  modules: CourseModule[] = [];
  
  // Estado de la UI
  currentModule: CourseModule | null = null;
  pdfUrl: SafeResourceUrl | null = null;
  isLoadingPdf = false;

  // Modales
  showModuleModal = false;
  showUploadModal = false;
  
  // Datos para formularios
  isEditing = false;
  moduleForm = { title: '' };
  selectedFile: File | null = null;

  ngOnInit() {
    this.courseId = this.route.snapshot.paramMap.get('id') || '';
    this.loadModules();
  }

  loadModules() {
    // TIPADO AGREGADO: (data: CourseModule[])
    this.contentService.getModulesByCourse(this.courseId).subscribe((data: CourseModule[]) => {
      this.modules = data;
      
      // Si ya teníamos un módulo seleccionado, actualizamos su referencia para ver los cambios (ej. nuevo archivo)
      if (this.currentModule) {
        const found = this.modules.find(m => m.id === this.currentModule!.id);
        if (found) {
          this.currentModule = found;
          // Si el módulo actualizado ya no tiene archivos, limpiamos el visor
          if (!found.files || found.files.length === 0) {
            this.pdfUrl = null;
          }
        }
      } 
      // Si no hay nada seleccionado, seleccionamos el primero por defecto
      else if (this.modules.length > 0) {
        this.selectModule(this.modules[0]);
      }
    });
  }

  selectModule(module: CourseModule) {
    this.currentModule = module;
    this.pdfUrl = null;

    // Si el módulo tiene archivo, cargarlo
    if (module.files && module.files.length > 0) {
      this.loadPdf(module.files[0].id);
    }
  }

  loadPdf(fileId: string) {
    this.isLoadingPdf = true;
    // TIPADO AGREGADO: (res: any)
    this.contentService.getFileContent(fileId).subscribe({
      next: (res: any) => {
        const byteCharacters = atob(res.base64);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        
        this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
        this.isLoadingPdf = false;
      },
      error: () => {
        this.isLoadingPdf = false;
        Swal.fire('Error', 'No se pudo cargar el PDF', 'error');
      }
    });
  }

  // --- Lógica de Módulos ---

  openCreateModule() {
    if (this.modules.length >= 5) {
      Swal.fire('Límite alcanzado', 'Solo puedes crear hasta 5 módulos', 'warning');
      return;
    }
    this.isEditing = false;
    this.moduleForm = { title: '' };
    this.showModuleModal = true;
  }

  openEditModule(module: CourseModule) {
    this.isEditing = true;
    this.currentModule = module;
    this.moduleForm = { title: module.title };
    this.showModuleModal = true;
  }

  saveModule() {
    if (!this.moduleForm.title.trim()) return;

    if (this.isEditing && this.currentModule) {
      // Editar
      // TIPADO AGREGADO: () => void
      this.contentService.updateModule(this.currentModule.id, this.moduleForm.title)
        .subscribe(() => {
          this.showModuleModal = false;
          this.loadModules();
          Swal.fire('Actualizado', 'Módulo editado correctamente', 'success');
        });
    } else {
      // Crear
      const nextOrder = this.modules.length + 1;
      this.contentService.createModule(this.courseId, this.moduleForm.title, nextOrder)
        .subscribe(() => {
          this.showModuleModal = false;
          this.loadModules();
          Swal.fire('Creado', 'Módulo creado correctamente', 'success');
        });
    }
  }

  deleteModule(moduleId: string) {
    Swal.fire({
      title: '¿Eliminar módulo?',
      text: 'Se eliminará también el PDF asociado.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.contentService.deleteModule(moduleId).subscribe(() => {
          this.currentModule = null;
          this.pdfUrl = null;
          this.loadModules();
          Swal.fire('Eliminado', 'Módulo eliminado', 'success');
        });
      }
    });
  }

  // --- Lógica de Archivos ---

  openUploadModal(module: CourseModule) {
    this.currentModule = module;
    this.selectedFile = null;
    this.showUploadModal = true;
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        Swal.fire('Formato incorrecto', 'Solo se permiten archivos PDF', 'error');
        return;
      }
      this.selectedFile = file;
    }
  }

  uploadFile() {
    if (!this.selectedFile || !this.currentModule) return;

    Swal.fire({
      title: 'Subiendo...',
      didOpen: () => Swal.showLoading()
    });

    this.contentService.uploadFile(this.currentModule.id, this.selectedFile).subscribe({
      next: () => {
        Swal.close();
        this.showUploadModal = false;
        Swal.fire('Éxito', 'PDF cargado correctamente', 'success');
        
        // Recargar módulos y si el actual es el que subimos, recargar su PDF
        this.loadModules();
        if (this.currentModule) {
           // Pequeño hack para forzar recarga visual si es necesario, 
           // aunque loadModules ya actualiza la referencia
        }
      },
      error: () => {
        Swal.close();
        Swal.fire('Error', 'No se pudo subir el archivo', 'error');
      }
    });
  }

  // IMPLEMENTACIÓN DE DELETE FILE
  deleteFile(fileId: string) {
    Swal.fire({
      title: '¿Eliminar PDF?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.contentService.deleteFile(fileId).subscribe(() => {
          Swal.fire('Eliminado', 'El archivo ha sido eliminado', 'success');
          this.pdfUrl = null; // Limpiar visor
          this.loadModules(); // Actualizar lista
        });
      }
    });
  }
}