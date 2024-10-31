import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VistaProveedorService } from '../../services/vista-proveedor.service';
import { ArchivoService } from '../../services/archivo.service'; // Importa el servicio de archivo
import { Observable } from 'rxjs';
import { saveAs } from 'file-saver'; // Importación correcta de saveAs

@Component({
  selector: 'app-vista-proveedor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './vista-proveedor.component.html',
  styleUrls: ['./vista-proveedor.component.css']
})
export default class VistaProveedorComponent implements OnInit {
  solicitudes: any[] = [];
  requerimientos: any[] = [];
  selectedSolicitudId: string | null = null;
  mostrarModal = false;
  requerimientoSeleccionado: any = null;
  archivosSeleccionados: any[] = [];
  registrosPorPagina = 5;
  paginaActual = 1;
  idSeleccionado:number = 0;

  constructor(
    private vistaProveedorService: VistaProveedorService,
    private archivoService: ArchivoService
  ) {}

  ngOnInit(): void {
    this.obtenerTodasLasSolicitudes();
  }

  obtenerTodasLasSolicitudes(): void {
    this.vistaProveedorService.obtenerTodasLasSolicitudesProveedor().subscribe(
      (data) => {
        console.log(data)
        this.solicitudes = data;
      },
      (error) => {
        console.error('Error al obtener las solicitudes:', error);
      }
    );
  }

  obtenerSolicitudPorId(idSolicitud: number): void {
    this.vistaProveedorService.obtenerSolicitudProveedorPorId(idSolicitud).subscribe(
      (data) => {
        this.requerimientos = data.requerimientos;
      },
      (error) => {
        console.error('Error al obtener la solicitud por ID:', error);
      }
    );
  }

  onSolicitudChange(): void {
    if (this.selectedSolicitudId === '0') {
      this.obtenerTodasLasSolicitudes();
    } else if (this.selectedSolicitudId) {
      const idSolicitud = parseInt(this.selectedSolicitudId, 10);
      this.obtenerSolicitudPorId(idSolicitud);
    } else {
      this.requerimientos = [];
    }
  }

  abrirModal(item: any): void {
    this.requerimientoSeleccionado = item;
    this.mostrarModal = true;
  }

  cerrarModal(): void {
    this.mostrarModal = false;
    this.requerimientoSeleccionado = null;
  }

  onFileSelect(event: any): void {
    const files = event.target.files;
    for (let i = 0; i < files.length; i++) {
      this.archivosSeleccionados.push({
        id: this.archivosSeleccionados.length + 1,
        nombre: files[i].name,
        file: files[i] // Guarda el archivo en sí para poder subirlo
      });
    }
  }

  seleccionarArchivo(): void {
    document.getElementById('archivo')?.click();
  }

  eliminarArchivo(archivo: any): void {
    this.archivosSeleccionados = this.archivosSeleccionados.filter(a => a.id !== archivo.id);
  }

  descargarArchivo(archivo: any): void {
    const archivoId = archivo.id; // Suponiendo que el archivo tiene un ID asignado
    this.archivoService.descargarArchivo(archivoId).subscribe(
      (response) => {
        // Usa FileSaver para descargar el archivo recibido
        saveAs(new Blob([response]), archivo.nombre);
      },
      (error) => {
        console.error(`Error al descargar el archivo ${archivo.nombre}:`, error);
      }
    );
  }

  subirArchivo(): void {
    const formData = new FormData();
    this.archivosSeleccionados.forEach((archivo) => {
      formData.append('files', archivo.file, archivo.nombre);
    });

    this.archivoService.insertarArchivo(formData).subscribe(
      (response) => {
        console.log('Archivos subidos con éxito:', response);
      },
      (error) => {
        console.error('Error al subir archivos:', error);
      }
    );
  }

  get totalRegistrosPagina(): number {
    return Math.min(this.paginaActual * this.registrosPorPagina, this.archivosSeleccionados.length);
  }

  get archivosPaginados(): any[] {
    const inicio = (this.paginaActual - 1) * this.registrosPorPagina;
    const fin = inicio + this.registrosPorPagina;
    return this.archivosSeleccionados.slice(inicio, fin);
  }

  actualizarPaginacion(): void {
    this.paginaActual = 1;
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
