import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ClientCourse } from '../models/ClientCourseDto';

@Injectable({ providedIn: 'root' })
export class ClientCourseService {

  private readonly endpoint = 'http://localhost:8080/api/courses';

  constructor(private readonly http: HttpClient) { }

  getAll(title?: string) {
    let url = this.endpoint;

    if (title && title.trim().length > 0) {
      url += `?title=${title}`;
    }

    return this.http.get<ClientCourse[]>(url);
  }

  getById(id: string): Observable<ClientCourse> {
    return this.http.get<ClientCourse>(`${this.endpoint}/${id}`);
  }
}
