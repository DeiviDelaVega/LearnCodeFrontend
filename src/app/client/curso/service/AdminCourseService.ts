import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AdminCourseDto } from '../../../models/AdminCourseDto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AdminCourseService {

  private baseUrl = 'http://localhost:8080/api/admin/courses';

  constructor(private http: HttpClient) { }

  list(): Observable<AdminCourseDto[]> {
    return this.http.get<AdminCourseDto[]>(this.baseUrl);
  }

  create(course: AdminCourseDto): Observable<AdminCourseDto> {
    return this.http.post<AdminCourseDto>(this.baseUrl, course);
  }

  update(id: string, course: AdminCourseDto): Observable<AdminCourseDto> {
    return this.http.put<AdminCourseDto>(`${this.baseUrl}/${id}`, course);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
