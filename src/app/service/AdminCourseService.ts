import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AdminCourseDto } from '../models/AdminCourseDto';

@Injectable({ providedIn: 'root' })
export class AdminCourseService {

  private readonly endpoint = 'http://localhost:8080/api/admin/courses';

  constructor(private readonly http: HttpClient) { }

  getAll(): Observable<AdminCourseDto[]> {
    return this.http.get<AdminCourseDto[]>(this.endpoint);
  }

  create(course: AdminCourseDto): Observable<AdminCourseDto> {
    return this.http.post<AdminCourseDto>(this.endpoint, course);
  }

  getById(id: string): Observable<AdminCourseDto> {
    return this.http.get<AdminCourseDto>(`${this.endpoint}/${id}`);
  }

  update(id: string, course: AdminCourseDto): Observable<AdminCourseDto> {
    return this.http.put<AdminCourseDto>(`${this.endpoint}/${id}`, course);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.endpoint}/${id}`);
  }

  // En AdminCourseService.ts
  getPaged(page: number, size: number, title?: string, published?: string): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (title && title.trim() !== '') {
      params = params.set('title', title);
    }

    // Si es 'ALL', no enviamos el parámetro para que en Java llegue como NULL
    if (published && published !== 'ALL') {
      params = params.set('published', published);
    }

    return this.http.get<any>(`${this.endpoint}/paged`, { params });
  }
}
