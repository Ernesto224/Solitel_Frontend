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

  pageNumber: number = 1;
  pageSize: number = 5;

  ngOnChanges(): void {
    this.pageNumber = 1;
  }

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

  showPagination(): boolean {
    return this.data.length > this.pageSize;
  }

  get paginatedData() {
    const startIndex = (this.pageNumber - 1) * this.pageSize;
    return this.data.slice(startIndex, startIndex + this.pageSize);
  }

  getValueByKey(item: any, key: string): any {
    return key.split('.').reduce((acc, part) => acc && acc[part], item) ?? 'N/A';
  }
}