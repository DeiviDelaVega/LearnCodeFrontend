import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ClientCourse } from '../../models/ClientCourseDto';
import { ClientCourseService } from '../../service/CourseService';

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

  searchTitle: string = '';
  showFilters: boolean = false;

  categories: string[] = [
    'Backend',
    'Frontend',
    'Mobile',
    'DevOps',
    'Data Science'
  ];

  selectedCategory: string | null = null;

  constructor(private readonly courseService: ClientCourseService) { }

  ngOnInit(): void {
    this.loadCourses();
  }

  private loadCourses(): void {
    this.courseService.getAll().subscribe({
      next: (data) => {
        this.courses = data;
        this.filteredCourses = data; //listado directo
      },
      error: (err) => console.error('Error loading courses:', err),
    });
  }

 search(): void {
    const query = this.searchTitle.trim().toLowerCase();

    if (!query) {
      this.filteredCourses = this.courses;
      return;
    }

    this.filteredCourses = this.courses.filter((course) =>
      course.title.toLowerCase().includes(query)
    );
  }

  filterByCategory(category: string): void {
    this.selectedCategory = category;

    this.filteredCourses = this.courses.filter(course =>
      course.subtitle?.toLowerCase().includes(category.toLowerCase())
    );
  }

  clearFilters(): void {
    this.selectedCategory = null;
    this.filteredCourses = this.courses;
  }

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }

  isColor(value: string): boolean {
    return (
      value.startsWith('#') ||
      value.startsWith('rgb') ||
      value.startsWith('rgba')
    );
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

  getCardStyle(course: ClientCourse) {
    if (this.isColor(course.coverUrl)) {
      return {
        '--card-glow': course.coverUrl,
        'border-color': course.coverUrl,
      };
    }

    return {
      '--card-glow': 'rgba(0,255,255,0.25)', 
    };
  }


}
