import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ClientCourse } from '../../../models/ClientCourseDto';

@Injectable({
  providedIn: 'root'
})
export class ClientCourseService {

  private apiUrl = 'http://localhost:8080/api/courses';

  constructor(private http: HttpClient) { }

  list(title?: string): Observable<ClientCourse[]> {
    let params = new HttpParams();

    if (title) {
      params = params.set('title', title);
    }

    return this.http.get<ClientCourse[]>(this.apiUrl, { params });
  }

  getById(id: string): Observable<ClientCourse> {
    return this.http.get<ClientCourse>(`${this.apiUrl}/${id}`);
  }
}
