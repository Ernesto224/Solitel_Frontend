import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tabla-visualizacion',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tabla-visualizacion.component.html',
  styleUrl: './tabla-visualizacion.component.css'
})
export class TablaVisualizacionComponent {
  @Input() headers: string[] = [];
  @Input() data: any[] = [];
  @Input() actionsheaders: string[] = [];
  @Input() actions: { label: string; icon: string; action: (row: any) => void }[] = []; // Configuración de botones
  @Input() dataLength: number = 0;

  pageNumber: number = 1;
  pageSize: number = 5;

  changePageSize(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.pageSize = +target.value;
    this.pageNumber = 1;
  }

  changePageNumber(offset: number) {
    const maxPage = Math.ceil(this.data.length / this.pageSize);
    const newPage = this.pageNumber + offset;

    if (newPage >= 1 && newPage <= maxPage) {
      this.pageNumber = newPage;
    }
  }

  get paginatedData() {
    const startIndex = (this.pageNumber - 1) * this.pageSize;
    return this.data.slice(startIndex, startIndex + this.pageSize);
  }

  get keys(): string[] {
    return this.data.length > 0 ? Object.keys(this.data[0]) : [];
  }
}
