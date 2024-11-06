import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VistaProveedorService } from '../../services/vista-proveedor.service';
import { ArchivoService } from '../../services/archivo.service'; // Importa el servicio de archivo
import { Observable } from 'rxjs';
import { saveAs } from 'file-saver'; // Importación correcta de saveAs
import { SolicitudProveedorService } from '../../services/solicitud-proveedor.service';

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
  solicitudSeleccionada: any = null;
  archivosPorRequerimiento: { [key: number]: any[] } = {}; // Almacenar archivos por requerimiento
  archivosPaginados: any[] = []; // Variable para almacenar archivos paginados
  totalArchivos: number = 0; // Total de archivos para la paginación


  constructor(
    private vistaProveedorService: VistaProveedorService,
    private archivoService: ArchivoService,
    private solicitudProveedorService: SolicitudProveedorService
  ) {}

  ngOnInit(): void {
    this.obtenerTodasLasSolicitudes();
  }

  obtenerTodasLasSolicitudes(): void {
    this.vistaProveedorService.obtenerTodasLasSolicitudesProveedor().subscribe(
      (data) => {
        console.log(data);
        // Filtrar solicitudes con estado 'Pendiente'
        this.solicitudes = data.filter((solicitud: any) => 
          solicitud.estado && solicitud.estado.nombre === 'Pendiente'
        );
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

  onSolicitudChange(event: any) {
    const selectedId = +event.target.value; // Convertir el valor a número si es necesario
    this.solicitudSeleccionada = this.solicitudes.find(
      solicitud => solicitud.idSolicitudProveedor === selectedId
    );
    this.requerimientos = this.solicitudSeleccionada.requerimientos;
    console.log('Solicitud seleccionada:', this.solicitudSeleccionada);
  }

enviarTodosLosArchivos(): void {
  if(this.archivosPorRequerimiento != null){
      for (const idRequerimiento in this.archivosPorRequerimiento) {
          const archivos = this.archivosPorRequerimiento[idRequerimiento];
          if (archivos && archivos.length > 0) {
              archivos.forEach(archivo => {
                  const formData = new FormData();
                  formData.append('Nombre', archivo.nombre); // Nombre del archivo
                  formData.append('file', archivo.file); // El archivo en sí
                  formData.append('FormatoAchivo', archivo.file.type); // Formato del archivo
                  formData.append('FechaModificacion', new Date().toISOString()); // Fecha de modificación
                  formData.append('idRequerimiento', idRequerimiento); // ID del requerimiento

                  // Log de FormData para depuración
                  const formDataObj: { [key: string]: any } = {};
                  formData.forEach((value, key) => {
                      formDataObj[key] = value;
                  });
                  console.log('Contenido de FormData:', formDataObj);

                  // Llama al servicio para insertar el archivo
                  this.archivoService.insertarArchivo(formData).subscribe({
                      next: response => {
                          console.log('Archivo guardado con éxito:', response);
                          alert('Archivo guardado con éxito');
                      },
                      error: err => {
                          console.error('Error al guardar el archivo:', err);
                      }
                  });
              });
          } else {
              console.log('No hay archivos para el requerimiento:', idRequerimiento);
          }
        }
  }
  this.archivosPorRequerimiento = {};
}

  abrirModal(item: any): void {
    this.requerimientoSeleccionado = item;
    this.mostrarModal = true;
    this.actualizarArchivosPaginados(); // Llama a este método al abrir el modal
  }

  cerrarModal(): void {
    this.mostrarModal = false;
    this.requerimientoSeleccionado = null;
  }

  onFileSelect(event: any, idRequerimiento: number): void {
    const files: FileList = event.target.files;
    if (files.length > 0) {
      const archivosSeleccionados = this.archivosPorRequerimiento[idRequerimiento] || [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        // Verificar si el archivo ya está en la lista
        const existe = archivosSeleccionados.some(archivo => archivo.nombre === file.name);
        if (!existe) {
          archivosSeleccionados.push({
            nombre: file.name,
            file: file
          });
        }
      }
      this.archivosPorRequerimiento[idRequerimiento] = archivosSeleccionados;
    }
    this.actualizarPaginacion();
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

  transformarArchivos() {
    this.archivosSeleccionados = Object.keys(this.archivosPorRequerimiento).flatMap(key => 
      this.archivosPorRequerimiento[+key] // Usamos +key para convertirlo a número
    );
  }

  get totalRegistrosPagina(): number {
    return Math.min(this.paginaActual * this.registrosPorPagina, this.archivosSeleccionados.length);
  }


  actualizarArchivosPaginados(): void {
    const startIndex = (this.paginaActual - 1) * this.registrosPorPagina;
    const endIndex = startIndex + this.registrosPorPagina;
    this.archivosPaginados = this.archivosPorRequerimiento[this.requerimientoSeleccionado.idRequerimientoProveedor]?.slice(startIndex, endIndex) || [];
    this.totalArchivos = this.archivosPorRequerimiento[this.requerimientoSeleccionado.idRequerimientoProveedor]?.length || 0;
  }

  actualizarPaginacion(): void {
    this.paginaActual = 1; // Reinicia a la primera página al cambiar el número de registros por página
    this.actualizarArchivosPaginados(); // Actualiza la paginación
  }
   

  anteriorPagina(): void {
    if (this.paginaActual > 1) this.paginaActual--;
  }

  siguientePagina(): void {
    if (this.paginaActual * this.registrosPorPagina < this.archivosSeleccionados.length) this.paginaActual++;
  }

  actualizarEstadoATramitado(): void {
    const observacion = prompt('Ingrese su observación:');
    this.solicitudProveedorService.moverEstadoATramitado(
      this.solicitudSeleccionada.idSolicitudProveedor,
      1, // Asumiendo que idUsuario es 1
      observacion || null // Enviar null si no hay observación
    ).subscribe(response => {
      console.log('Estado actualizado:', response);
    }, error => {
      console.error('Error al actualizar el estado:', error);
    });
  }

  limpiarPagina(){
    this.solicitudes = [];
    this.requerimientos = [];
    this.selectedSolicitudId = null;
    this.mostrarModal = false;
    this.requerimientoSeleccionado = null;
    this.archivosSeleccionados = [];
    this.registrosPorPagina = 5;
    this.paginaActual = 1;
    this.solicitudSeleccionada = null;
    this.archivosPorRequerimiento = {}; // Almacenar archivos por requerimiento
    this.archivosPaginados = []; // Variable para almacenar archivos paginados
    this.totalArchivos = 0; // Total de archivos para la paginación
    }

  cerrarSolicitud(): void {
    this.enviarTodosLosArchivos();
    this.actualizarEstadoATramitado();
    this.limpiarPagina();
    this.obtenerTodasLasSolicitudes();
  }
}
