import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface ModuleFile {
  id: string;
  fileName: string;
  mimeType: string;
  base64?: string; // Vendrá opcional al listar, obligatorio al ver detalle
}

export interface CourseModule {
  id: string;
  order: number;
  title: string;
  files: ModuleFile[]; // En tu caso, lógica de 1 archivo por módulo
}

@Injectable({ providedIn: 'root' })
export class AdminContentService {
  private apiUrl = 'http://localhost:8080/api/admin/content';

  constructor(private http: HttpClient) {}

  // Obtener estructura del curso
  getModulesByCourse(courseId: string): Observable<CourseModule[]> {
    return this.http.get<CourseModule[]>(`${this.apiUrl}/course/${courseId}`);
  }

  createModule(courseId: string, title: string, order: number): Observable<CourseModule> {
    return this.http.post<CourseModule>(`${this.apiUrl}/module`, { courseId, title, order });
  }

  updateModule(moduleId: string, title: string): Observable<CourseModule> {
    return this.http.put<CourseModule>(`${this.apiUrl}/module/${moduleId}`, { title });
  }

  deleteModule(moduleId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/module/${moduleId}`);
  }

  uploadFile(moduleId: string, file: File): Observable<void> {
    return new Observable(observer => {
      const reader = new FileReader();
      reader.readAsDataURL(file); // Convertir a Base64
      reader.onload = () => {
        const base64Full = reader.result as string;
        // Quitamos el prefijo "data:application/pdf;base64," para enviar solo el string
        const base64 = base64Full.split(',')[1]; 
        
        const payload = {
          moduleId,
          fileName: file.name,
          mimeType: file.type,
          base64: base64
        };

        this.http.post(`${this.apiUrl}/file`, payload).subscribe({
          next: () => { observer.next(); observer.complete(); },
          error: (err) => observer.error(err)
        });
      };
    });
  }

  // Descargar/Ver archivo (trae el Base64)
  getFileContent(fileId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/file/${fileId}`);
  }

  deleteFile(fileId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/file/${fileId}`);
  }
}