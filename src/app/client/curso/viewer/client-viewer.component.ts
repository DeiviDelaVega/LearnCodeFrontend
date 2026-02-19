import { Component, OnInit, inject, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ClientContentService } from '../service/ClientContentService';
import { CourseModule } from '../../../service/AdminContentService';
import { trigger, transition, style, animate } from '@angular/animations';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-client-viewer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './client-viewer.component.html',
  styleUrls: ['./client-viewer.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-out', style({ opacity: 1 }))
      ])
    ])
  ]
})
export class ClientViewerComponent implements OnInit {

  private route = inject(ActivatedRoute);
  private clientService = inject(ClientContentService);
  private sanitizer = inject(DomSanitizer);
  private cd = inject(ChangeDetectorRef);
  private zone = inject(NgZone);

  courseId: string = '';
  modules: CourseModule[] = [];
  completedModuleIds: Set<string> = new Set();
  
  currentModule: CourseModule | null = null;
  pdfUrl: SafeResourceUrl | null = null;
  isLoadingPdf = false;
  
  // Progreso
  progressPercentage = 0;

  ngOnInit() {
    this.courseId = this.route.snapshot.paramMap.get('id') || '';
    this.loadData();
  }

  loadData() {
    // 1. Cargar Módulos
    this.clientService.getModules(this.courseId).subscribe(mods => {
      this.zone.run(() => {
        this.modules = mods;
        
        // 2. Cargar Progreso
        this.clientService.getProgress(this.courseId).subscribe(completedIds => {
          this.completedModuleIds = new Set(completedIds);
          this.calculateProgress();
          
          // Auto-seleccionar el primero o el siguiente disponible
          if (this.modules.length > 0 && !this.currentModule) {
             this.selectModule(this.modules[0]);
          }
          this.cd.markForCheck();
        });
      });
    });
  }

  selectModule(module: CourseModule) {
    this.zone.run(() => {
        this.currentModule = module;
        this.pdfUrl = null;
        
        if (module.files && module.files.length > 0) {
            this.loadPdf(module.files[0].id);
        } else {
            this.isLoadingPdf = false;
        }
    });
  }

  loadPdf(fileId: string) {
    this.isLoadingPdf = true;
    this.cd.detectChanges();

    this.clientService.getFileContent(fileId).subscribe({
        next: (res: any) => {
            this.zone.run(() => {
                const url = this.base64ToBlobUrl(res.base64);
                this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
                this.isLoadingPdf = false;
                this.cd.markForCheck();
            });
        },
        error: () => {
            this.zone.run(() => this.isLoadingPdf = false);
        }
    });
  }

  markAsCompleted() {
    if (!this.currentModule?.id) return;
    
    // Optimista: Marcar visualmente ya
    this.completedModuleIds.add(this.currentModule.id!);
    this.calculateProgress();

    this.clientService.markAsCompleted(this.currentModule.id!).subscribe({
        next: () => {
            Swal.fire({
                icon: 'success',
                title: '¡Módulo Completado!',
                text: `Has completado el ${this.progressPercentage}% del curso`,
                timer: 2000,
                showConfirmButton: false,
                backdrop: `rgba(0,0,123,0.4)`
            });
        }
    });
  }

  calculateProgress() {
    if (this.modules.length === 0) {
        this.progressPercentage = 0;
        return;
    }
    const completedCount = this.modules.filter(m => this.completedModuleIds.has(m.id!)).length;
    this.progressPercentage = Math.round((completedCount / this.modules.length) * 100);
  }

  private base64ToBlobUrl(base64: string): string {
    try {
        const byteCharacters = atob(base64);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'application/pdf' });
        return URL.createObjectURL(blob);
    } catch { return ''; }
  }
}