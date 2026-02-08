import { HttpClient } from '@angular/common/http';
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

  getPaged(page: number, size: number) {
    return this.http.get<any>(
      `${this.endpoint}/paged?page=${page}&size=${size}`
    );
  }

}
