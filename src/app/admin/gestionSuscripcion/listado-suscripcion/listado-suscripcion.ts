import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpParams } from '@angular/common/http';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-listado-suscripcion',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './listado-suscripcion.html',
  styleUrl: './listado-suscripcion.scss',
})
export class ListadoSuscripcion implements OnInit {
  suscripciones: any[] = [];

  page = 0;
  size = 5;
  totalPages = 0;

  plan = 'TODO';
  status = 'TODO';

  private apiUrl = 'http://localhost:8080/api/admin/gestionSuscripcion';

  constructor(private http: HttpClient, private cd: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.cargarSuscripciones();
  }

  cargarSuscripciones() {
    let params = new HttpParams()
      .set('page', this.page.toString())
      .set('size', this.size.toString())
      .set('plan', this.plan)
      .set('status', this.status);

    this.http.get<any>(this.apiUrl, { params }).subscribe({
      next: resp => {
        this.suscripciones = resp.content ?? [];
        this.totalPages = resp.totalPages ?? 0;
        this.page = resp.number ?? 0;
        this.cd.detectChanges();
      },
      error: err => {
        console.error('ERROR:', err);
      }
    });
  }

  aplicarFiltros() {
    this.page = 0;
    this.cargarSuscripciones();
  }

  resetFiltros() {
    this.plan = 'TODO';
    this.status = 'TODO';
    this.page = 0;
    this.cargarSuscripciones();
  }

  cambiarPagina(p: number) {
    if (p < 0 || p >= this.totalPages) return;
    this.page = p;
    this.cargarSuscripciones();
  }
}
