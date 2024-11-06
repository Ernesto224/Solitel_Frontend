import { Component, OnInit } from '@angular/core';
import { SolicitudProveedorService } from '../../services/solicitud-proveedor.service';
import { HistoricoService } from '../../services/historico.service';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EstadoService } from '../../services/estado.service';
import { ArchivoService } from '../../services/archivo.service';
import { TablaVisualizacionComponent } from '../../components/tabla-visualizacion/tabla-visualizacion.component';

@Component({
  selector: 'app-bandeja',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    FormsModule,
    TablaVisualizacionComponent
  ],
  templateUrl: './bandeja.component.html',
  styleUrl: './bandeja.component.css'
})
export default class BandejaComponent implements OnInit {

  estados: any[] = [];
  estadosProveedor: any[] = [];
  estadosAnalisis: any[] = [];

  encabezados: any[] = [];
  solicitudes: any[] = [];
  solicitudesFiltradas: any[] = [];
  columnasVisibles: { [key: string]: boolean } = {};
  pageNumber: number = 1;
  pageSize: number = 5;

  cantidadPorEstadoProveedor: { nombre: string, cantidad: number }[] = [];
  cantidadPorEstadoAnalisis: { nombre: string, cantidad: number }[] = [];
  estadoColumnas: { [key: string]: { headers: string[], actions: string[], columnasVisibles: {} } } = {
    Creado: {
      headers: ['Aprobar', 'Sin efecto', 'Histórico', 'Ver', 'Solicitud', 'Número único', 'Fecha creación', 'Días transcurridos', 'Estado', 'Urgente', 'Creado por'],
      actions: ['aprobar', 'sinEfecto', 'historico', 'ver'],
      columnasVisibles: { aprobar: true, sinEfecto: true, historico: true, ver: true, solicitud: true, numeroUnico: true, fechaCreacion: true, diasTranscurridos: true, estado: true, urgente: true, creadoPor: true }
    },
    Finalizado: {
      headers: ['Devolver', 'Histórico', 'Sin efecto', 'Requerimientos', 'Ver', 'Solicitud', 'Número único', 'Proveedor', 'Fecha creación', 'Días transcurridos', 'Estado', 'Urgente', 'Creado por'],
      actions: ['devolver', 'historico', 'sinEfecto', 'requerimientos'],
      columnasVisibles: { devolver: true, historico: true, sinEfecto: true, requerimientos: true, ver: true, solicitud: true, numeroUnico: true, proveedor: true, fechaCreacion: true, diasTranscurridos: true, estado: true, urgente: true, creadoPor: true }
    },
    'Sin Efecto': {
      headers: ['Devolver', 'Histórico', 'Requerimientos', 'Ver', 'Solicitud', 'Número único', 'Fecha creación', 'Días transcurridos', 'Estado', 'Urgente', 'Creado por'],
      actions: ['devolver', 'historico', 'requerimientos', 'ver'],
      columnasVisibles: { devolver: true, historico: true, requerimientos: true, ver: true, solicitud: true, numeroUnico: true, creadoPor: true, fechaCreacion: true, diasTranscurridos: true, estado: true, urgente: true }
    },
    Pendiente: {
      headers: ['Sin efecto', 'Histórico', 'Ver', 'Solicitud', 'Número único', 'Aprobación', 'Fecha creación', 'Días transcurridos', 'Estado', 'Urgente', 'Creado por'],
      actions: ['sinEfecto', 'historico', 'ver'],
      columnasVisibles: { sinEfecto: true, historico: true, ver: true, solicitud: true, numeroUnico: true, aprobacion: true, fechaCreacion: true, diasTranscurridos: true, estado: true, urgente: true, creadoPor: true }
    },
    Tramitado: {
      headers: ['Finalizar', 'Histórico', 'Legajo', 'Requerimientos', 'Ver', 'Solicitud', 'Número único', 'Proveedor', 'Fecha creación', 'Días transcurridos', 'Estado', 'Urgente', 'Creado por'],
      actions: ['finalizar', 'historico', 'legajo', 'requerimientos'],
      columnasVisibles: { finalizar: true, historico: true, legajo: true, requerimientos: true, ver: true, solicitud: true, numeroUnico: true, proveedor: true, fechaCreacion: true, diasTranscurridos: true, estado: true, urgente: true, creadoPor: true }
    },
    Solicitado: {
      headers: ['Aprobar', 'Sin efecto', 'Histórico', 'Ver', 'Solicitud', 'Número único', 'Fecha creación', 'Días transcurridos', 'Estado', 'Urgente', 'Creado por'],
      actions: ['aprobar', 'sinEfecto', 'historico', 'ver'],
      columnasVisibles: { aprobar: true, sinEfecto: true, historico: true, ver: true, solicitud: true, numeroUnico: true, fechaCreacion: true, diasTranscurridos: true, estado: true, urgente: true, creadoPor: true }
    },
    Legajo: {
      headers: ['Devolver', 'Histórico', 'Legajo', 'Requerimientos', 'Ver', 'Solicitud', 'Número único', 'Proveedor', 'Fecha creación', 'Días transcurridos', 'Estado', 'Urgente', 'Creado por'],
      actions: ['devolver', 'historico', 'legajo', 'requerimientos'],
      columnasVisibles: { devolver: true, historico: true, legajo: true, requerimientos: true, ver: true, solicitud: true, numeroUnico: true, proveedor: true, fechaCreacion: true, diasTranscurridos: true, estado: true, urgente: true, creadoPor: true }
    },
    EnAnálisis:{
      headers: ['Devolver', 'Histórico', 'Legajo', 'Requerimientos', 'Ver', 'Solicitud', 'Número único', 'Proveedor', 'Fecha creación', 'Días transcurridos', 'Estado', 'Urgente', 'Creado por'],
      actions: ['devolver', 'historico', 'legajo', 'requerimientos'],
      columnasVisibles: { devolver: true, historico: true, legajo: true, requerimientos: true, ver: true, solicitud: true, numeroUnico: true, proveedor: true, fechaCreacion: true, diasTranscurridos: true, estado: true, urgente: true, creadoPor: true }
    },
    Analizado:{
      headers: ['Devolver', 'Histórico', 'Legajo', 'Requerimientos', 'Ver', 'Solicitud', 'Número único', 'Proveedor', 'Fecha creación', 'Días transcurridos', 'Estado', 'Urgente', 'Creado por'],
      actions: ['devolver', 'historico', 'legajo', 'requerimientos'],
      columnasVisibles: { devolver: true, historico: true, legajo: true, requerimientos: true, ver: true, solicitud: true, numeroUnico: true, proveedor: true, fechaCreacion: true, diasTranscurridos: true, estado: true, urgente: true, creadoPor: true }
    }


  };

  estadoSeleccionado: string = 'Creado';
  estadoTemporal: string = 'Creado';
  numeroUnicoFiltro: string = '';
  fechaInicioFiltro: string = '';
  fechaFinFiltro: string = '';
  filtroCaracter: string = '';

  solicitudSeleccionada: any = null;
  solicitudIdParaActualizar: number | null = null;

  modalVisible = false;

  modalEstadoVisible = false;
  observacion: string = '';
  nuevoEstado: string = '';

  modalHistoricoVisible = false;
  historicoDeSolicitudSeleccionada: any = null;

  modalRequerimientosVisible: boolean = false;
  archivos: any[] = [];

  constructor(
    private solicitudProveedorService: SolicitudProveedorService,
    private estadoService: EstadoService,
    private archivoService: ArchivoService,
    private historicoService: HistoricoService
  ) { }

  ngOnInit(): void {
    this.obtenerEstados();
    this.obtenerSolicitudes();
  }

  //obtener datos
  obtenerEstados(): void {
    this.estadoService.obtenerEstados().subscribe({
      next: (estados) => {
        this.estados = estados;
        this.estadosProveedor = estados.filter(estado => estado.tipo === 'Proveedor');
        this.estadosAnalisis = estados.filter(estado => estado.tipo === 'Analisis');
      },
      error: (err) => {
        console.error('Error al obtener datos:', err);
      }
    });
  }

  obtenerSolicitudes(): void {
    this.solicitudProveedorService.obtener().subscribe({
      next: (value) => {
        this.solicitudes = value;
        this.contarSolicitudesPorEstado();
        this.filtrarSolicitudes();
      },
      error: (err) => {
        console.error('Error al obtener datos:', err);
      },
    });
  }

  //modales
  reiniciarDatosDeTabla(): void {
    this.estadoSeleccionado = this.estadoTemporal;
    this.encabezados = this.estadoColumnas[this.estadoSeleccionado].headers;
    this.columnasVisibles = this.estadoColumnas[this.estadoSeleccionado].columnasVisibles;
  }

  abrirModalDeDetalles(solicitud: any) {
    this.solicitudSeleccionada = solicitud;
    this.modalVisible = true;
  }

  cerrarModalDeDetalles() {
    this.modalVisible = false;
    this.solicitudSeleccionada = null;
  }

  abrirModalHistorico(solicitud: any) {
    this.solicitudSeleccionada = solicitud;
    this.obtenerHistoricoSolicitud(this.solicitudSeleccionada.idSolicitudProveedor);
    this.modalHistoricoVisible = true;
  }

  cerrarModalHistorico() {
    this.modalHistoricoVisible = false;
    this.solicitudSeleccionada = null;
  }

  abrirModalRequerimientos(solicitud: any) {
    this.solicitudSeleccionada = solicitud;
    this.modalRequerimientosVisible = true;
  }

  cerrarModalRequerimientos() {
    this.modalRequerimientosVisible = false;
    this.solicitudSeleccionada = null;
  }

  abrirModalCambioEstado(idSolicitudProveedor: number, estado: string) {
    this.solicitudIdParaActualizar = idSolicitudProveedor;
    this.nuevoEstado = estado;
    this.modalEstadoVisible = true;
  }

  cerrarModalCambioEstado() {
    this.modalEstadoVisible = false;
    this.observacion = '';
    this.solicitudIdParaActualizar = null;
    this.nuevoEstado = '';
  }

  //otros
  contarSolicitudesPorEstado() {
    // Reiniciar contadores
    this.cantidadPorEstadoProveedor = [];
    this.cantidadPorEstadoAnalisis = [];

    // Filtrar y contar solicitudes por tipo de estado
    this.cantidadPorEstadoProveedor = this.estadosProveedor.map(estado => {
      const nombreEstado = estado.nombre;
      const cantidad = this.solicitudes.filter(solicitud => solicitud.estado?.nombre === nombreEstado && solicitud.estado?.idEstado <= 7).length;
      return { nombre: nombreEstado, cantidad };
    });

    this.cantidadPorEstadoAnalisis = this.estadosAnalisis.map(estado => {
      const nombreEstado = estado.nombre;
      const cantidad = this.solicitudes.filter(solicitud => solicitud.estado?.nombre === nombreEstado && solicitud.estado?.idEstado >= 8 && solicitud.estado?.idEstado <= 13).length;
      return { nombre: nombreEstado, cantidad };
    });

  }

  obtenerHistoricoSolicitud(idSolicitudProveedor: number): void {
    this.historicoService.obtener(idSolicitudProveedor).subscribe({
      next: (data: any) => {
        this.historicoDeSolicitudSeleccionada = data;
      },
      error: (err) => {
        console.log('')
        if (err.status === 0) {
          console.log('');
        }
      }
    })
  }

  calcularDiasTranscurridos(fechaInicio: string): number {
    const fecha = new Date(fechaInicio);
    const hoy = new Date();
    const diferenciaEnMilisegundos = hoy.getTime() - fecha.getTime();
    const diasTranscurridos = Math.floor(diferenciaEnMilisegundos / (1000 * 60 * 60 * 24));
    return diasTranscurridos;
  }

  cambiarPagina(incremento: number): void {
    this.pageNumber += incremento;
    if (this.pageNumber < 1) {
      this.pageNumber = 1;
    }
    this.obtenerSolicitudes();
  }

  cambiarTamanoPagina(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.pageSize = +value;
    this.obtenerSolicitudes();
  }

  limpiarFiltros() {
    this.estadoSeleccionado = this.estadoTemporal;
    this.numeroUnicoFiltro = '';
    this.fechaInicioFiltro = '';
    this.fechaFinFiltro = '';
    this.reiniciarDatosDeTabla();
  }

  filtrarSolicitudes() {
    this.reiniciarDatosDeTabla();
    this.solicitudesFiltradas = [...this.solicitudes];

    if (this.estadoSeleccionado) {
      this.solicitudesFiltradas = this.solicitudesFiltradas.filter(
        solicitud => solicitud.estado?.nombre === this.estadoSeleccionado
      );
    }

    if (this.numeroUnicoFiltro) {
      this.solicitudesFiltradas = this.solicitudesFiltradas.filter(solicitud =>
        solicitud.numeroUnico?.includes(this.numeroUnicoFiltro)
      );
    }

    if (this.fechaInicioFiltro) {
      const fechaInicio = new Date(this.fechaInicioFiltro);
      this.solicitudesFiltradas = this.solicitudesFiltradas.filter(solicitud => {
        const fechaCreacion = new Date(solicitud.fechaCrecion);
        return fechaCreacion >= fechaInicio;
      });
    }

    if (this.fechaFinFiltro) {
      const fechaFin = new Date(this.fechaFinFiltro);
      this.solicitudesFiltradas = this.solicitudesFiltradas.filter(solicitud => {
        const fechaCreacion = new Date(solicitud.fechaCrecion);
        return fechaCreacion <= fechaFin;
      });
    }

    if (this.filtroCaracter) {
      const filtro = this.filtroCaracter.toLowerCase();
      this.solicitudesFiltradas = this.solicitudesFiltradas.filter(solicitud =>
        solicitud.numeroCaso?.toLowerCase().includes(filtro) ||
        solicitud.imputado?.toLowerCase().includes(filtro) ||
        solicitud.ofendido?.toLowerCase().includes(filtro) ||
        solicitud.usuarioCreador?.nombre.toLowerCase().includes(filtro) ||
        solicitud.usuarioCreador?.correoElectronico?.toLowerCase().includes(filtro) ||
        solicitud.delito?.nombre.toLowerCase().includes(filtro)
      );
    }

    this.obtenerSolicitudes();
    this.contarSolicitudesPorEstado();
  }

  cargarArchivos(idRequerimiento: number): void {
    this.archivoService.obtenerArchivosDeSolicitud(idRequerimiento).subscribe((archivos: any[]) => {
      this.archivos = archivos;
    });
  }

  descargarArchivo(archivo: any): void {
    console.log('Descargando archivo:', archivo.nombre);

    // Decodificar el contenido en Base64 y convertirlo a un array de bytes
    const byteCharacters = atob(archivo.contenido);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);

    // Crear un Blob a partir del array de bytes
    const blob = new Blob([byteArray], { type: archivo.formatoArchivo });

    // Crear URL y descargar el archivo
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = archivo.nombre; // Nombre del archivo
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url); // Liberar la URL
  }

  aprobarSolicitud(idSolicitudProveedor: number, estado: string) {
    this.solicitudIdParaActualizar = idSolicitudProveedor;
    this.nuevoEstado = estado;
    this.confirmarCambioEstado();
  }

  confirmarCambioEstado() {
    if (this.solicitudIdParaActualizar) {
      const idUsuario = 1;
      this.solicitudProveedorService.actualizarEstado(
        this.solicitudIdParaActualizar,
        this.nuevoEstado,
        idUsuario,
        this.observacion
      ).subscribe(
        response => {
          console.log(`Estado actualizado a '${this.nuevoEstado}' para la solicitud con ID:`, this.solicitudIdParaActualizar);

          // Eliminar la solicitud de la lista de solicitudes filtradas
          this.solicitudesFiltradas = this.solicitudesFiltradas.filter(solicitud => solicitud.idSolicitudProveedor !== this.solicitudIdParaActualizar);

          this.cerrarModalCambioEstado();
          this.obtenerSolicitudes();

        },
        error => {
          console.error("Error al actualizar el estado:", error);
        }
      );
    }
    this.contarSolicitudesPorEstado();
  }

}
