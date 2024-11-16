import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-tabla-visualizacion',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './tabla-visualizacion.component.html',
  styleUrl: './tabla-visualizacion.component.css'
})
export class TablaVisualizacionComponent implements OnChanges {
  @Input() headers: { key: string, label: string }[] = [];
  @Input() data: any[] = [];
  @Input() actionsheaders: string[] = [];
  @Input() actions: {
    label: string; icon: string; class: string;
    style: string; action: (row: any) => void
  }[] = []; // Configuración de botones

  numeroDePagina: number = 1;
  cantidadDeRegistros: number = 5;
  inicioRegistros: number = 1;
  finRegistros: number = 0;
  maxPagina: number = 1;

  ngOnChanges(): void {
    this.numeroDePagina = 1;
    this.actualizarPaginacion();
  }

  actualizarPaginacion() {
    // Calcular el índice de inicio y fin de la página actual
    const inicio = (this.numeroDePagina - 1) * this.cantidadDeRegistros;
    const fin = inicio + this.cantidadDeRegistros;

    // Calcular los datos paginados, sin modificar this.data
    this.finRegistros = Math.min(fin, this.data.length);
    this.maxPagina = Math.ceil(this.data.length / this.cantidadDeRegistros);
  }

  cambiarPagina(incremento: number): void {
    const maxPage = Math.ceil(this.data.length / this.cantidadDeRegistros);
    const newPage = this.numeroDePagina + incremento;

    if (newPage >= 1 && newPage <= maxPage) {
      this.numeroDePagina = newPage;
      this.actualizarPaginacion(); // Actualizar los datos mostrados en la página actual
    }
  }

  cambiarTamanoPagina(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.cantidadDeRegistros = +value;
    this.numeroDePagina = 1; // Reinicia la página a la primera cuando cambias el tamaño de página
    this.actualizarPaginacion();
  }

  irPrimeraPagina(): void {
    this.numeroDePagina = 1;
    this.actualizarPaginacion();
  }

  irUltimaPagina(): void {
    this.numeroDePagina = this.maxPagina;
    this.actualizarPaginacion();
  }

  showPagination(): boolean {
    return this.data.length > this.cantidadDeRegistros;
  }

  get paginatedData() {
    const startIndex = (this.numeroDePagina - 1) * this.cantidadDeRegistros;
    return this.data.slice(startIndex, startIndex + this.cantidadDeRegistros);
  }

  getValueByKey(item: any, key: string): any {
    return key.split('.').reduce((acc, part) => acc && acc[part], item) ?? 'N/A';
  }
}