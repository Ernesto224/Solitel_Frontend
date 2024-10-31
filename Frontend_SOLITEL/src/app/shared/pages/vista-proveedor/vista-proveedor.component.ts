import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-vista-proveedor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './vista-proveedor.component.html',
  styleUrls: ['./vista-proveedor.component.css']
})
export default class VistaProveedorComponent {
  // Lista de solicitudes con sus respectivos requerimientos
  solicitudes = [
    {
      id: '52-2024',
      requerimientos: [
        {
          detalleRequerimiento: 'Datos de abonado',
          observacion: '',
          numeroRequerido: '88888888, 99999999',
          tipoRequerimiento: 'Llamadas salientes celulares con radio bases, Llamadas salientes números fijos, Llamadas entrantes números fijos',
          fechaInicio: new Date('2024-07-01T14:31:14'),
          fechaFin: new Date('2024-07-31T14:31:14'),
          cantidadAdjuntos: 0,
          fechaModificacion: ''
        }
      ]
    },
    {
      id: '53-2024',
      requerimientos: [
        {
          detalleRequerimiento: 'Datos de IP',
          observacion: '',
          numeroRequerido: '192.115.81.81',
          tipoRequerimiento: 'Datos de IP',
          fechaInicio: new Date('2024-08-01T08:25:50'),
          fechaFin: new Date('2024-08-22T14:31:14'),
          cantidadAdjuntos: 0,
          fechaModificacion: ''
        }
      ]
    }
  ];

  // Variables de control y datos de la tabla
  requerimientos: any[] = []; // Requerimientos que se mostrarán en la tabla
  selectedSolicitudId: string | null = null; // ID de la solicitud seleccionada
  mostrarModal = false;
  requerimientoSeleccionado: any = null;
  archivosSeleccionados: any[] = []; // Archivos seleccionados
  registrosPorPagina = 5;
  paginaActual = 1;

  // Método para manejar el cambio de selección de ID de solicitud en el comboBox
  onSolicitudChange(): void {
    const solicitudSeleccionada = this.solicitudes.find(solicitud => solicitud.id === this.selectedSolicitudId);
    if (solicitudSeleccionada) {
      this.requerimientos = solicitudSeleccionada.requerimientos;
    } else {
      this.requerimientos = []; // Limpia la tabla si no hay solicitud seleccionada
    }
  }

  // Método para abrir el modal y establecer el requerimiento seleccionado
  abrirModal(item: any): void {
    this.requerimientoSeleccionado = item;
    this.mostrarModal = true;
  }

  // Método para cerrar el modal
  cerrarModal(): void {
    this.mostrarModal = false;
    this.requerimientoSeleccionado = null;
  }

  // Método para manejar la selección de archivos
  onFileSelect(event: any): void {
    const files = event.target.files;
    for (let i = 0; i < files.length; i++) {
      this.archivosSeleccionados.push({
        id: this.archivosSeleccionados.length + 1,
        nombre: files[i].name
      });
    }
  }

  seleccionarArchivo(): void {
    document.getElementById('archivo')?.click();
  }

  // Método para eliminar un archivo seleccionado
  eliminarArchivo(archivo: any): void {
    this.archivosSeleccionados = this.archivosSeleccionados.filter(a => a.id !== archivo.id);
  }

  // Método simulado para descargar un archivo
  descargarArchivo(archivo: any): void {
    console.log(`Descargando archivo: ${archivo.nombre}`);
  }

  // Método para calcular el total de registros en la página actual
  get totalRegistrosPagina(): number {
    return Math.min(this.paginaActual * this.registrosPorPagina, this.archivosSeleccionados.length);
  }

  // Método de paginación: archivos a mostrar en la página actual
  get archivosPaginados(): any[] {
    const inicio = (this.paginaActual - 1) * this.registrosPorPagina;
    const fin = inicio + this.registrosPorPagina;
    return this.archivosSeleccionados.slice(inicio, fin);
  }

  actualizarPaginacion(): void {
    this.paginaActual = 1; // Reinicia a la primera página al cambiar los registros por página
  }

  anteriorPagina(): void {
    if (this.paginaActual > 1) this.paginaActual--;
  }

  siguientePagina(): void {
    if (this.paginaActual * this.registrosPorPagina < this.archivosSeleccionados.length) this.paginaActual++;
  }

  cerrarSolicitud(): void {
    console.log('Solicitud cerrada/tramitada');
  }
}
