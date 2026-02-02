import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminCourseService } from '../../../client/curso/service/AdminCourseService';
import { RouterModule } from '@angular/router';
import { AdminCourseDto } from '../../../models/AdminCourseDto';

@Component({
  selector: 'app-listado',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './listado.html',
  styleUrl: './listado.scss',
})
export class ListadoComponent implements OnInit {
  courses: AdminCourseDto[] = [];

  search: string = '';
  published: string = 'ALL';
  page = 0;
  totalPages = 0;

  constructor(private courseService: AdminCourseService) { }

  ngOnInit(): void {
    this.loadCourses();
  }

  loadCourses() {
    this.courseService.list().subscribe({
      next: data => this.courses = data,
      error: err => console.error(err)
    });
  }


  delete(id: string) {
    if (!confirm('¿Eliminar curso?')) return;

    this.courseService.delete(id).subscribe({
      next: () => this.loadCourses(),
      error: err => console.error(err)
    });
  }


  aplicarFiltros() {
    let filtered = this.courses;

    if (this.search) {
      filtered = filtered.filter(c =>
        c.title.toLowerCase().includes(this.search.toLowerCase())
      );
    }

    if (this.published !== 'ALL') {
      const isPub = this.published === 'true';
      filtered = filtered.filter(c => c.isPublished === isPub);
    }

    this.courses = filtered;
  }

  resetFiltros() {
    this.search = '';
    this.published = 'ALL';
    this.page = 0;
    this.loadCourses();
  }

  cambiarPagina(page: number) {
    this.page = page;
    this.loadCourses();
  }


}

