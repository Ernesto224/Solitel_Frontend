import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-tabla-catalogos',
  standalone: true,
  imports: [],
  templateUrl: './tabla-catalogos.component.html',
  styleUrl: './tabla-catalogos.component.css'
})
export class TablaCatalogosComponent {
  @Input() headers: string[] = [];  // Encabezados de la tabla
  @Input() data: any[] = [];        // Datos para las filas de la tabla

  get keys(): string[] {
    return this.data.length > 0 ? Object.keys(this.data[0]) : [];
  }

  // Método para eliminar una fila
  onDelete(row: any) {
    this.data = this.data.filter(item => item !== row);
    console.log('Fila eliminada:', row);
  }
}
