import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tabla-catalogos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tabla-catalogos.component.html',
  styleUrls: ['./tabla-catalogos.component.css']
})
export class TablaCatalogosComponent {
  @Input() headers: string[] = [];  // Los encabezados dinámicos
  @Input() data: any[] = [];        // Los datos dinámicos
  @Input() catalog: string = '';        // Los datos dinámicos
  @Input() onDelete!: (catalog: string, row: any) => void;  // Recibe la función de eliminar por parámetro

  get keys(): string[] {
    return this.data.length > 0 ? Object.keys(this.data[0]) : [];
  }
}
