import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClientCourse } from '../../models/ClientCourseDto';
import { ClientCourseService } from './service/CourseService';

@Component({
  selector: 'app-curso',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './curso.html',
  styleUrl: './curso.scss',
})
export class CursoComponent implements OnInit {

  courses: ClientCourse[] = [];
  filteredCourses: ClientCourse[] = [];

  searchTitle = '';
  showFilters = false;

  categories: string[] = [
    'Backend',
    'Frontend',
    'Mobile',
    'DevOps',
    'Data Science'
  ];

  selectedCategory: string | null = null;

  constructor(private courseService: ClientCourseService) {}

  ngOnInit(): void {
    this.loadCourses();
  }

  loadCourses(): void {
    this.courseService.list(this.searchTitle).subscribe({
      next: data => {
        this.courses = data;
      },
      error: err => console.error(err)
    });
  }

  search(): void {
    this.loadCourses();
  }
  
  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }

  getGlowClassByIndex(index: number): string {
  const glows = [
    'card-glow-cyan',
    'card-glow-indigo',
    'card-glow-pink',
    'card-glow-green',
    'card-glow-orange'
  ];

  return glows[index % glows.length];
}

  
}
