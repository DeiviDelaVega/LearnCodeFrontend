import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpParams } from '@angular/common/http';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-listado-cliente',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './listado-cliente.html',
  styleUrl: './listado-cliente.scss',
})
export class ListadoClienteComponent implements OnInit {
  clientes: any[] = [];
  page = 0;
  size = 5;
  totalPages = 0;
  search = '';
  status = 'ALL';
  photo?: string;

  private apiUrl = 'http://localhost:8080/api/admin/gestionCliente';

  constructor(private http: HttpClient, private cd: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.cargarClientes();
  }

  aplicarFiltros(valor: string) {
    this.page = 0;
    this.search = valor;
    this.cargarClientes();
  }

  cargarClientes() {
    let params = new HttpParams()
      .set('page', this.page.toString())
      .set('size', this.size.toString())
      .set('role', 'USER')
      .set('search', this.search || '')
      .set('status', this.status || 'ALL');

    this.http.get<any>(this.apiUrl, { params }).subscribe(resp => {

      this.clientes = resp.content.map((c: any) => ({
        ...c,
        photo: c.photo || ''
      }));

      this.totalPages = resp.totalPages;
      this.page = resp.number;

      this.cd.detectChanges();
    });
  }


  resetFiltros() {
    this.search = '';
    this.status = 'ALL';
    this.page = 0;
    this.cargarClientes();
  }

  cambiarPagina(p: number) {
    if (p < 0 || p >= this.totalPages) return;
    this.page = p;
    this.cargarClientes();
  }
}
