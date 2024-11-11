import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { DatePipe } from '@angular/common';
import { SolicitudProveedorService } from '../../services/solicitud-proveedor.service';
import { HistoricoService } from '../../services/historico.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EstadoService } from '../../services/estado.service';
import { ArchivoService } from '../../services/archivo.service';
import { TablaVisualizacionComponent } from '../../components/tabla-visualizacion/tabla-visualizacion.component';
import { ModalInformacionComponent } from '../../components/modal-informacion/modal-informacion.component';
import { ModalConfirmacionComponent } from '../../components/modal-confirmacion/modal-confirmacion.component';
import { AnalisisTelefonicoService } from '../../services/analisis-telefonico.service';
import { AlertaComponent } from '../../components/alerta/alerta.component';
import { AuthenticacionService } from '../../services/authenticacion.service';


@Component({
  selector: 'app-bandeja',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TablaVisualizacionComponent,
    ModalInformacionComponent,
    ModalConfirmacionComponent,
    AlertaComponent
  ],
  providers: [
    DatePipe
  ],
  templateUrl: './bandeja.component.html',
  styleUrl: './bandeja.component.css'
})
export default class BandejaComponent implements OnInit {

  // Variables relacionadas con el usuario
  usuario: any = {};
  usuarioId: any = null;
  oficinaId: any = null;

  // Estados y seleccionados
  estadoSeleccionado: any = {};
  estadoTemporal: string = 'Creado';
  idEstadoSeleccionado: number = 3;
  estados: any[] = [];
  estadosProveedor: any[] = [];
  estadosAnalisis: any[] = [];

  // Variables para solicitudes
  solicitudes: any[] = [];
  solicitudesFiltradas: any[] = [];
  solicitudesPaginadas: any[] = [];
  solicitudSeleccionada: any = null;
  solicitudIdParaActualizar: number | null = null;

  // Filtros
  numeroUnicoFiltro: string = '';
  fechaInicioFiltro: string = '';
  fechaFinFiltro: string = '';
  filtroCaracter: string = '';

  // Variables de configuración y control de visualización
  mostrarTablaProveedor: boolean = true;
  isSwitchDisabled: boolean = false;
  isModalVisible: boolean = false;
  modalSolicitud = false;
  modalEstadoVisible = false;
  modalHistoricoVisible = false;
  modalRequerimientosVisible: boolean = false;
  modalArchivosUACVisible: boolean = false;
  modalArchivosInformeFinalVisible: boolean = false;
  modalHistoricoAnalisisVisible: boolean = false;
  modalLegajorAnalisis: boolean = false;
  modalAprobarAnalisis: boolean = false;
  modalDevolverAnalizado: boolean = false;
  modalFinalizarAnalisis: boolean = false;
  subirArchivosInformeFinalOpcion: boolean = false;

  // Variables relacionadas con la paginación y visibilidad
  numeroDePagina: number = 1;
  cantidadDeRegistros: number = 5;
  columnasVisibles: { [key: string]: boolean } = {};

  // Variables para alertas
  alertatipo: string = "error";
  alertaMensaje: string = "";
  alertaVisible: boolean = false;

  // Variables relacionadas con encabezados y columnas
  encabezados: any[] = [];
  encabezadosRequerimientos: any[] = [
    { key: 'requerimiento', label: 'Requerimiento' },
    { key: 'tipoSolicitudes', label: 'Tipo Solicitud' },
    { key: 'datosRequeridos', label: 'Datos Requeridos' },
    { key: 'fechaInicio', label: 'Fecha Inicio' },
    { key: 'fechaFinal', label: 'Fecha Final' }
  ];
  encabezadosHistorico: any[] = [
    { key: 'idSolicitudProveedor', label: 'Solicitud' },
    { key: 'numeroUnico', label: 'Número Único' },
    { key: 'estado', label: 'Estado' },
    { key: 'fechaEstado', label: 'Fecha Estado' },
    { key: 'usuario', label: 'Usuario' },
    { key: 'observacion', label: 'Observación' }
  ];
  encabezadosRequerimientosTramitados: any[] = [
    { key: 'requerimiento', label: 'Requerimiento' },
    { key: 'numRequerido', label: 'Núm. requerido' },
    { key: 'rangoFechas', label: 'Rango de fechas' },
    { key: 'observacion', label: 'Observación' }
  ];
  encabezadosArchivosUAC: any[] = [
    { key: 'nombre', label: 'Nombre Documento' }
  ];
  encabezadosAccionesArchivosUAC: any[] = [
    'Descargar'
  ];
  encabezadosArchivosInforme: any[] = [
    { key: 'nombre', label: 'Nombre Documento' }
  ];
  encabezadosAccionesArchivosInforme: any[] = [
    'Descargar'
  ];
  encabezadosHistoricoAnalisis: any[] = [
    { key: 'idSolicitudAnalisis', label: 'Solicitud' },
    { key: 'estado', label: 'Estado' },
    { key: 'fechaEstado', label: 'Fecha Estado' },
    { key: 'usuario', label: 'Usuario' },
    { key: 'observacion', label: 'Observación' }
  ];
  encabezadosAccionesRequerimientosTramitados: any[] = [
    'Archivos'
  ];

  // Objetos complejos
  estadoColumnas: { [key: string]: { [key: string]: { headers: string[], columnasVisibles: {} } } } = {
    Proveedor: {
      Creado: {
        headers: ['Aprobar', 'Sin efecto', 'Histórico', 'Ver', 'Solicitud', 'Número único', 'Fecha creación', 'Días transcurridos', 'Estado', 'Urgente', 'Creado por'],
        columnasVisibles: { aprobar: true, sinEfecto: true, historico: true, ver: true, solicitud: true, numeroUnico: true, fechaCreacion: true, diasTranscurridos: true, estado: true, urgente: true, creadoPor: true }
      },
      Finalizado: {
        headers: ['Devolver', 'Histórico', 'Sin efecto', 'Requerimientos', 'Ver', 'Solicitud', 'Número único', 'Proveedor', 'Fecha creación', 'Días transcurridos', 'Estado', 'Urgente', 'Creado por'],
        columnasVisibles: { devolver: true, historico: true, sinEfecto: true, requerimientos: true, ver: true, solicitud: true, numeroUnico: true, operador: true, fechaCreacion: true, diasTranscurridos: true, estado: true, urgente: true, creadoPor: true }
      },
      'Sin Efecto': {
        headers: ['Devolver', 'Histórico', 'Requerimientos', 'Ver', 'Solicitud', 'Número único', 'Fecha creación', 'Días transcurridos', 'Estado', 'Urgente', 'Creado por'],
        columnasVisibles: { devolver: true, historico: true, requerimientos: true, ver: true, solicitud: true, numeroUnico: true, creadoPor: true, fechaCreacion: true, diasTranscurridos: true, estado: true, urgente: true }
      },
      Pendiente: {
        headers: ['Sin efecto', 'Histórico', 'Ver', 'Solicitud', 'Número único', 'Aprobación', 'Fecha creación', 'Días transcurridos', 'Estado', 'Urgente', 'Creado por'],
        columnasVisibles: { sinEfecto: true, historico: true, ver: true, solicitud: true, numeroUnico: true, aprobacion: true, fechaCreacion: true, diasTranscurridos: true, estado: true, urgente: true, creadoPor: true }
      },
      Tramitado: {
        headers: ['Finalizar', 'Histórico', 'Legajo', 'Requerimientos', 'Ver', 'Solicitud', 'Número único', 'Proveedor', 'Fecha creación', 'Días transcurridos', 'Estado', 'Urgente', 'Creado por'],
        columnasVisibles: { finalizar: true, historico: true, legajo: true, requerimientos: true, ver: true, solicitud: true, numeroUnico: true, operador: true, fechaCreacion: true, diasTranscurridos: true, estado: true, urgente: true, creadoPor: true }
      },
      Solicitado: {
        headers: ['Aprobar', 'Sin efecto', 'Histórico', 'Ver', 'Solicitud', 'Número único', 'Fecha creación', 'Días transcurridos', 'Estado', 'Urgente', 'Creado por'],
        columnasVisibles: { aprobar: true, sinEfecto: true, historico: true, ver: true, solicitud: true, numeroUnico: true, fechaCreacion: true, diasTranscurridos: true, estado: true, urgente: true, creadoPor: true }
      },
      Legajo: {
        headers: ['Devolver', 'Histórico', 'Legajo', 'Requerimientos', 'Ver', 'Solicitud', 'Número único', 'Proveedor', 'Fecha creación', 'Días transcurridos', 'Estado', 'Urgente', 'Creado por'],
        columnasVisibles: { devolver: true, historico: true, legajo: true, requerimientos: true, ver: true, solicitud: true, numeroUnico: true, operador: true, fechaCreacion: true, diasTranscurridos: true, estado: true, urgente: true, creadoPor: true }
      }
    },
    Analisis: {
      'En Analisis': {
        headers: ['Histórico', 'Requerimientos', 'Ver', 'Solicitud', 'Número único', 'Proveedor', 'Fecha sol. telef.', 'Fecha sol. análisis', 'Urgente'],
        columnasVisibles: { historico: true, requerimientos: true, ver: true, solicitud: true, numeroUnico: true, proveedor: true, FechaSolTelef: true, FechaSolAanálisis: true, urgente: true }
      },
      Analizando: {
        headers: ['Histórico', 'Requerimientos', 'Ver', 'Solicitud', 'Número único', 'Proveedor', 'Fecha sol. telef.', 'Fecha sol. análisis', 'Urgente'],
        columnasVisibles: { historico: true, requerimientos: true, ver: true, solicitud: true, numeroUnico: true, proveedor: true, FechaSolTelef: true, FechaSolAanálisis: true, urgente: true }
      },
      'Aprobar Analisis': {
        headers: ['Histórico', 'Requerimientos', 'Ver', 'Solicitud', 'Número único', 'Proveedor', 'Fecha sol. telef.', 'Fecha sol. análisis', 'Urgente'],
        columnasVisibles: { historico: true, requerimientos: true, ver: true, solicitud: true, numeroUnico: true, proveedor: true, FechaSolTelef: true, FechaSolAanálisis: true, urgente: true }
      },
      Finalizado: {
        headers: ['Histórico', 'Requerimientos', 'Ver', 'Solicitud', 'Número único', 'Proveedor', 'Fecha sol. telef.', 'Fecha sol. análisis', 'Urgente'],
        columnasVisibles: { historico: true, requerimientos: true, ver: true, solicitud: true, numeroUnico: true, proveedor: true, FechaSolTelef: true, FechaSolAanálisis: true, urgente: true }
      },
      Legajo: {
        headers: ['Histórico', 'Requerimientos', 'Ver', 'Solicitud', 'Número único', 'Proveedor', 'Fecha sol. telef.', 'Fecha sol. análisis', 'Urgente'],
        columnasVisibles: { historico: true, requerimientos: true, ver: true, solicitud: true, numeroUnico: true, proveedor: true, FechaSolTelef: true, FechaSolAanálisis: true, urgente: true }
      }
    }
  };

  // Variables relacionadas con archivos
  archivos: any[] = [];
  archivosUAC: any[] = [];
  archivosInformeFinal: any[] = [];
  archivosInformeFinalDB: any[] = [];
  idSolicitudAnalisisSeleccionada: number = 0;

  // Variables relacionadas con acciones
  accionesrequerimientosRespondidos: any[] = [
    {
      style: "background-color: #1C355C;",
      class: "text-white px-4 py-2 rounded focus:outline-none focus:ring w-[55px]",
      action: (requerimiento: any) => this.cargarArchivos(requerimiento.idRequerimientoProveedor),
      icon: 'folder'
    }
  ];
  accionesArchivosUAC: any[] = [
    {
      style: "background-color: #1C355C;",
      class: "text-white px-4 py-2 m-1 rounded focus:outline-none focus:ring w-[55px]",
      action: (archivo: any) => this.descargarArchivo(archivo),
      icon: 'download'
    }
  ];
  accionesArchivosInforme: any[] = [
    {
      style: "background-color: #1C355C;",
      class: "text-white px-4 py-2 m-1 rounded focus:outline-none focus:ring w-[55px]",
      action: (archivo: any) => this.descargarArchivo(archivo),
      icon: 'download'
    }
  ];

  // Variables relacionadas con observaciones y estados
  observacion: string = '';
  nuevoEstado: string = '';
  observacionLegajoAnalisis: string = '';
  observacionAprobarAnalisis: string = '';
  observacionDevolverAnalizado: string = '';
  observacionFinalizarAnalisis: string = '';

  // Variables relacionadas con historiales y requerimientos
  historicoDeSolicitudSeleccionada: any[] = [];
  historicoDeSolicitudAnalisisSeleccionada: any[] = [];
  requerimientosDeSolicitudSeleccionada: any[] = [];
  requerimientosRespondidos: any[] = [];

  constructor(
    private solicitudProveedorService: SolicitudProveedorService,
    private analisisTelefonicoService: AnalisisTelefonicoService,
    private estadoService: EstadoService,
    private archivoService: ArchivoService,
    private historicoService: HistoricoService,
    private datePipe: DatePipe,
    private autenticate: AuthenticacionService
  ) { }

  ngOnInit(): void {
    this.obtenerDatosDeUsuario();
    this.obtenerEstados();
    this.obtenerSolicitudes();
  }

  //obtener datos
  obtenerDatosDeUsuario(): void {
    this.usuario = this.autenticate.getUsuario();
    this.usuarioId = this.usuario.idUsuario;
    this.oficinaId = this.usuario.oficina.idOficina;
  }

  obtenerEstados(): void {
    this.estadoService.obtenerEstados(this.usuarioId, this.oficinaId).subscribe({
      next: (estados) => {
        this.estados = estados;
        this.estadosProveedor = estados.filter(estado => estado.tipo === 'Proveedor');
        this.estadosAnalisis = estados.filter(estado => estado.tipo === 'Analisis');
        this.estadoSeleccionado = this.estados[0];
      },
      error: (err) => {
        console.error('Error al obtener datos:', err);
      }
    });
  }

  obtenerSolicitudes(): void {
    this.modalVisible();
    this.solicitudProveedorService.obtener(this.idEstadoSeleccionado, this.fechaInicioFiltro,
      this.fechaFinFiltro, this.numeroUnicoFiltro, this.oficinaId, this.usuarioId).subscribe({
        next: (value) => {
          this.solicitudes = value;
          this.reiniciarDatosDeTabla();
          this.actualizarPaginacion();
          this.modalInvisible();
        },
        error: (err) => {
          console.error('Error al obtener datos:', err);
          this.modalInvisible();
        },
      });
  }

  obtenerSolicitudesAnalisis(): void {
    this.modalVisible();
    this.analisisTelefonicoService.obtenerSolicitudesAnalisis(this.idEstadoSeleccionado, this.fechaInicioFiltro,
      this.fechaFinFiltro, this.numeroUnicoFiltro, this.oficinaId, this.usuarioId).subscribe({
        next: (value) => {
          this.solicitudes = value;
          this.reiniciarDatosDeTabla();
          this.actualizarPaginacion();
          this.modalInvisible();
        },
        error: (err) => {
          console.error('Error al obtener solicitudes de análisis:', err);
          this.modalInvisible();
        }
      });
  }

  obtenerOpcionesPorEstado(estado: string): string[] {
    switch (estado) {
      case "En Análisis":
        return ["Ver histórico", "Ver Solicitud"];
      case "Analizado":
        return ["Ver histórico", "Ver Solicitud", "Descargar informe UAC", "Agregar informe", "Finalizar solicitud de análisis", "Enviar a legajo solicitud de análisis"];
      case "Aprobar Analisis":
        return ["Ver histórico", "Ver Solicitud", "Descargar informe UAC", "Descargar informe de Investigador", "Devolver al estado anterior", "Aprobar Solicitud"];
      case "Finalizado":
        return ["Ver histórico", "Ver Solicitud", "Descargar informe UAC", "Descargar informe de Investigador", "Devolver al estado anterior"];
      case "Legajo":
        return ["Ver histórico", "Ver Solicitud", "Descargar informe UAC", "Descargar informe de Investigador", "Devolver al estado anterior"];
      default:
        return [];
    }
  }

  //modales
  reiniciarDatosDeTabla(): void {
    this.numeroDePagina = 1;
    this.solicitudesFiltradas = this.solicitudes;
    this.encabezados = this.estadoColumnas[this.estadoSeleccionado.tipo][this.estadoSeleccionado.nombre].headers;
    this.columnasVisibles = this.estadoColumnas[this.estadoSeleccionado.tipo][this.estadoSeleccionado.nombre].columnasVisibles;
  }

  abrirModalDeDetalles(solicitud: any) {
    this.solicitudSeleccionada = solicitud;
    this.solicitudProveedorService.obtenerUna(this.solicitudSeleccionada.idSolicitudProveedor).subscribe({
      next: (data: any) => {
        this.solicitudSeleccionada = data;
        this.requerimientosDeSolicitudSeleccionada = this.solicitudSeleccionada.requerimientos.map((requerimiento: any) => ({
          requerimiento: requerimiento.requerimiento || 'N/A', // Si el requerimiento no está presente, asignamos 'N/A'
          tipoSolicitudes: requerimiento.tipoSolicitudes.map((tipo: any) => tipo.nombre).join(', ') || 'N/A', // Mapear los tipos de solicitud y unirlos con coma
          datosRequeridos: requerimiento.datosRequeridos.map((dato: any) => dato.datoRequeridoContenido).join(', ') || 'N/A', // Mapear los datos requeridos y unirlos
          fechaInicio: this.datePipe.transform(requerimiento.fechaInicio, 'MM/dd/yyyy') || 'N/A', // Formatear la fecha de inicio
          fechaFinal: this.datePipe.transform(requerimiento.fechaFinal, 'MM/dd/yyyy') || 'N/A' // Formatear la fecha final
        }));
        this.modalSolicitud = true;
      }
    });
  }

  cerrarModalDeDetalles() {
    this.modalSolicitud = false;
    this.solicitudSeleccionada = null;
  }

  abrirModalHistorico(solicitud: any) {
    this.solicitudSeleccionada = solicitud;
    console.log(this.solicitudSeleccionada);
    this.obtenerHistoricoSolicitud(this.solicitudSeleccionada.idSolicitudProveedor);
    this.modalHistoricoVisible = true;
  }

  cerrarModalHistorico() {
    this.modalHistoricoVisible = false;
    this.solicitudSeleccionada = null;
  }

  abrirModalRequerimientos(solicitud: any) {
    this.solicitudSeleccionada = solicitud;

    this.solicitudProveedorService.obtenerUna(this.solicitudSeleccionada.idSolicitudProveedor).subscribe({
      next: (data: any) => {
        this.solicitudSeleccionada = data;
        this.requerimientosRespondidos = this.solicitudSeleccionada.requerimientos.map((requerimiento: any) => ({
          idRequerimientoProveedor: requerimiento.idRequerimientoProveedor,
          requerimiento: requerimiento.requerimiento || 'N/A',
          numRequerido: requerimiento.datosRequeridos.map((dato: any) => dato.datoRequeridoContenido).join(', ') || 'N/A',
          rangoFechas: `${requerimiento.fechaInicio} al ${requerimiento.fechaFinal}` || 'N/A',
          observacion: requerimiento.observacion || 'N/A'
        }));
        this.modalRequerimientosVisible = true;
      }
    });
  }

  cerrarModalRequerimientos() {
    this.solicitudSeleccionada = null;
    this.requerimientosRespondidos = [];
    this.archivos = [];
    this.modalRequerimientosVisible = false;
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

  closeModal() {
    this.isModalVisible = false; // Método para cerrar el modal
  }

  obtenerHistoricoSolicitud(idSolicitudProveedor: number): void {
    this.historicoService.obtener(idSolicitudProveedor).subscribe({
      next: (data: any) => {
        this.historicoDeSolicitudSeleccionada = data;
        this.historicoDeSolicitudSeleccionada = this.historicoDeSolicitudSeleccionada.map((item: any) => ({
          idSolicitudProveedor: this.solicitudSeleccionada.idSolicitudProveedor,
          numeroUnico: this.solicitudSeleccionada.numeroUnico,
          estado: item.estadoDTO.nombre || 'N/A',
          fechaEstado: this.datePipe.transform(item.fechaEstado, 'MM/dd/yyyy HH:mm:ss') || 'N/A',
          usuario: item.usuarioDTO.nombre || 'N/A',
          observacion: item.observacion || 'N/A'
        }));
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
    const maxPage = Math.ceil(this.solicitudesFiltradas.length / this.cantidadDeRegistros);
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

  limpiarFiltros() {
    this.estadoSeleccionado = this.estadoTemporal;
    this.numeroUnicoFiltro = '';
    this.fechaInicioFiltro = '';
    this.fechaFinFiltro = '';
    this.filtrarSolicitudes();
  }

  actualizarPaginacion() {
    const inicio = (this.numeroDePagina - 1) * this.cantidadDeRegistros;
    const fin = inicio + this.cantidadDeRegistros;
    this.solicitudesPaginadas = this.solicitudesFiltradas.slice(inicio, fin);
  }

  onEstadoChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const selectedOption = selectElement.selectedOptions[0];
    if (selectedOption) {
      const estadoString: string = selectedOption.getAttribute('data-idEstado') ?? '';
      this.estadoSeleccionado = JSON.parse(estadoString);
      this.idEstadoSeleccionado = this.estadoSeleccionado.idEstado;
      this.estadoTemporal = this.estadoSeleccionado.nombre;
    }
  }

  trackByEstadoId(index: number, estado: any): number {
    return estado.idEstado; // Usa el ID del estado como clave única
  }

  filtrarSolicitudes() {
    if (this.estadoSeleccionado) {
      // Determinar si mostrar la tabla de Proveedor o de Análisis
      this.mostrarTablaProveedor = this.estadoSeleccionado.tipo === 'Proveedor' ? true : false;
    }
    if (this.mostrarTablaProveedor) this.obtenerSolicitudes();
    if (!this.mostrarTablaProveedor) this.obtenerSolicitudesAnalisis();
  }

  jsonEstado(tipo: string, nombre: string): string {
    return JSON.stringify({ tipo, nombre });
  }

  aplicarFiltroCaracter() {
    if (this.filtroCaracter) {
      const filtro = this.filtroCaracter.toLowerCase();
      this.solicitudesFiltradas = this.solicitudesFiltradas.filter(solicitud =>
        solicitud.numeroCaso?.toLowerCase().includes(filtro) ||
        solicitud.imputado?.toLowerCase().includes(filtro) ||
        solicitud.ofendido?.toLowerCase().includes(filtro) ||
        solicitud.usuarioCreador?.nombre.toLowerCase().includes(filtro) ||
        solicitud.usuarioCreador?.apellido?.toLowerCase().includes(filtro) ||
        solicitud.delito?.nombre.toLowerCase().includes(filtro) ||
        solicitud.operadoras[0]?.nombre.toLowerCase().includes(filtro)
      );
    }
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

  onSwitchClick(event: Event, idSolicitudProveedor: number, aprobado: boolean) {

    event.preventDefault();

    this.abrirModalCambioEstado(idSolicitudProveedor, 'Aprobar');
    if (aprobado) {
      this.isSwitchDisabled = true; // Bloquear el switch después de aprobar
    }
  }

  confirmarCambioEstado() {
    if (this.solicitudIdParaActualizar) {
      const usuario = this.autenticate.getUsuario();
      this.solicitudProveedorService.actualizarEstado(
        this.solicitudIdParaActualizar,
        this.nuevoEstado,
        usuario.idUsuario,
        this.observacion
      ).subscribe(
        response => {
          // Eliminar la solicitud de la lista de solicitudes filtradas // NO HACE FALTA PORQUE LA TABLA SE RECARGA
          this.solicitudesFiltradas = this.solicitudesFiltradas.filter(solicitud => solicitud.idSolicitudProveedor !== this.solicitudIdParaActualizar);
          this.cerrarModalCambioEstado();
          this.obtenerSolicitudes();
        },
        error => {
          console.error("Error al actualizar el estado:", error);
        }
      );
    }
  }


  // Metodos para funciones de archivos UAC
  abrirModalArchivosUAC(idSolicitudAnalisis: number) {
    this.cargarArchivosUAC(idSolicitudAnalisis);
    this.modalArchivosUACVisible = true;
  }

  cerrarModalArchivosUAC() {
    this.modalArchivosUACVisible = false;
    this.archivosUAC = [];
  }

  cargarArchivosUAC(idSolicitudAnalisis: number) {
    this.archivoService.obtenerArchivosRespuestaDeSolicitudAnalisis(idSolicitudAnalisis).subscribe({
      next: (archivos: any[]) => {
        this.archivosUAC = archivos;
      },
      error: (err) => {
        console.error('Error al cargar archivos:', err);
      }
    });
  }


  // Metodos para funciones de archivos Informe Final
  abrirModalArchivosInformeFinal(idSolicitudAnalisis: number, estadoSolicitud: string) {
    if (estadoSolicitud == "Finalizado") {
      this.subirArchivosInformeFinalOpcion = false;
    } else {
      this.subirArchivosInformeFinalOpcion = true;
    }
    this.idSolicitudAnalisisSeleccionada = idSolicitudAnalisis;
    this.cargarArchivosInformeFinal(idSolicitudAnalisis);
    this.modalArchivosInformeFinalVisible = true;
  }

  cerrarModalArchivosInformeFinal() {
    this.idSolicitudAnalisisSeleccionada = 0;
    this.modalArchivosInformeFinalVisible = false;
    this.archivosInformeFinal = [];
    this.archivosInformeFinalDB = [];
  }

  seleccionarArchivosInformeFinal(event: any) {
    const seleccionados = event.target.files as FileList;
    this.archivosInformeFinal = Array.from(seleccionados).map((file: File) => {
      return {
        nombre: file.name,
        file: file,
        tipo: file.type,
        tamaño: file.size
      };
    });
  }

  subirArchivosInformeFinal() {
    if (this.archivosInformeFinal.length > 0 && this.idSolicitudAnalisisSeleccionada != 0) {
      this.archivosInformeFinal.forEach((archivo: any) => {
        const formData = new FormData();
        formData.append('Nombre', archivo.nombre);
        formData.append('file', archivo.file);
        formData.append('FormatoAchivo', archivo.tipo);
        formData.append('FechaModificacion', new Date().toISOString());
        formData.append('idSolicitudAnalisis', String(this.idSolicitudAnalisisSeleccionada));

        this.archivoService.insertarArchivoInformeSolicitudAnalisis(formData).subscribe({
          next: response => {
            this.alertatipo = "satisfaccion";
            this.alertaMensaje = "Archivos Subidos con Exito";
            this.alertaVisible = true;
            setTimeout(() => {
              this.alertaVisible = false;
            }, 3000);
            this.cargarArchivosInformeFinal(this.idSolicitudAnalisisSeleccionada);
          },
          error: err => {
            console.error('Error al guardar el archivo:', archivo.nombre, err);
          }
        });
      });
    } else {
      console.log('No hay archivos que subir');
    }
  }

  cargarArchivosInformeFinal(idSolicitudAnalisis: number) {
    this.archivoService.obtenerArchivosInformeFinalSolicitudAnalisis(idSolicitudAnalisis).subscribe({
      next: (archivos: any[]) => {
        this.archivosInformeFinalDB = archivos;
      },
      error: (err) => {
        console.error('Error al cargar archivos:', err);
      }
    });
  }

  // Metodos para modal historico Analisis
  abrirModalHistoricoAnalisis(idSolicitudAnalisis: number) {
    this.obtenerHistoricoSolicitudAnalisis(idSolicitudAnalisis);
    this.modalHistoricoAnalisisVisible = true;
  }

  cerrarModalHistoricoAnalisis() {
    this.modalHistoricoAnalisisVisible = false;
  }

  obtenerHistoricoSolicitudAnalisis(idSolicitudAnalisis: number): void {
    this.historicoService.obtenerHistoricoAnalisis(idSolicitudAnalisis).subscribe({
      next: (data: any) => {
        this.historicoDeSolicitudSeleccionada = data;
        this.historicoDeSolicitudAnalisisSeleccionada = this.historicoDeSolicitudSeleccionada.map((item: any) => ({
          idSolicitudAnalisis: item.idAnalisis,
          estado: item.estadoDTO.nombre || 'N/A',
          fechaEstado: this.datePipe.transform(item.fechaEstado, 'MM/dd/yyyy HH:mm:ss') || 'N/A',
          usuario: item.usuarioDTO.nombre || 'N/A',
          observacion: item.observacion || 'N/A'
        }));
      },
      error: (err) => {
        console.log('')
        if (err.status === 0) {
          console.log('');
        }
      }
    })
  }

  // Metodos para mover a Legajo Analisis
  abrirModalLegajoAnalisis(idSolicitudAnalisis: number) {
    this.idSolicitudAnalisisSeleccionada = idSolicitudAnalisis;
    this.modalLegajorAnalisis = true;
  }

  cerrarModalLegajoAnalisis() {
    this.idSolicitudAnalisisSeleccionada = 0;
    this.modalLegajorAnalisis = false;
  }

  actualizarEstadoLegajoAnalisis() {
    this.analisisTelefonicoService.ActualizarEstadoLegajoolicitudAnalisis(this.idSolicitudAnalisisSeleccionada, 1, this.observacionLegajoAnalisis).subscribe({
      next: response => {
        this.alertatipo = "satisfaccion";
        this.alertaMensaje = "Solicitud de Analisis Movida a Legajo";
        this.alertaVisible = true;
        setTimeout(() => {
          this.alertaVisible = false;
        }, 3000);

        this.observacionLegajoAnalisis = '';
        this.obtenerSolicitudesAnalisis();
      },
      error: err => {
        console.error('Error al mover a legajo la solicitud de analisis:', err);
      }
    });
    this.cerrarModalLegajoAnalisis();
  }


  // Metodos para aprobar Analisis
  abrirModalAprobarAnalisis(idSolicitudAnalisis: number) {
    this.idSolicitudAnalisisSeleccionada = idSolicitudAnalisis;
    this.modalAprobarAnalisis = true;
  }

  cerrarModalAprobarAnalisis() {
    this.idSolicitudAnalisisSeleccionada = 0;
    this.modalAprobarAnalisis = false;
  }

  aprobarSolicitudAnalisis() {
    this.analisisTelefonicoService.aprobarSolicitudAnalisis(this.idSolicitudAnalisisSeleccionada, 1, this.observacionAprobarAnalisis).subscribe({
      next: response => {
        this.alertatipo = "satisfaccion";
        this.alertaMensaje = "Solicitud de Analisis Aprobada";
        this.alertaVisible = true;
        setTimeout(() => {
          this.alertaVisible = false;
        }, 3000);
        this.observacionAprobarAnalisis = '';
        this.obtenerSolicitudesAnalisis();
      },
      error: err => {
        console.error('Error al aprobar la solicitud de analisis:', err);
      }
    });
    this.cerrarModalAprobarAnalisis();
  }

  // Metodos para devolver a Analizado
  abrirModalDevolverAnalizado(idSolicitudAnalisis: number) {
    this.idSolicitudAnalisisSeleccionada = idSolicitudAnalisis;
    this.modalDevolverAnalizado = true;
  }

  cerrarModalDevolverAnalizado() {
    this.idSolicitudAnalisisSeleccionada = 0;
    this.modalDevolverAnalizado = false;
  }

  devolverAnalizadoSolicitudAnalisis() {
    this.analisisTelefonicoService.devolverAnalizado(this.idSolicitudAnalisisSeleccionada, 1, this.observacionDevolverAnalizado).subscribe({
      next: response => {
        this.alertatipo = "satisfaccion";
        this.alertaMensaje = "Solicitud de Analisis devuelta a Analizado";
        this.alertaVisible = true;
        setTimeout(() => {
          this.alertaVisible = false;
        }, 3000);
        this.observacionDevolverAnalizado = '';
        this.aprobarSolicitudAnalisis();
      },
      error: err => {
        console.error('Error al devolver la solicitud de analisis:', err);
      }
    });
    this.cerrarModalDevolverAnalizado();
  }


  // Metodos para finalizar solicitud Analisis
  abrirModalFinalizarAnalisis(idSolicitudAnalisis: number) {
    this.idSolicitudAnalisisSeleccionada = idSolicitudAnalisis;
    this.modalFinalizarAnalisis = true;
  }

  cerrarModalFinalizarAnalisis() {
    this.idSolicitudAnalisisSeleccionada = 0;
    this.modalFinalizarAnalisis = false;
  }

  finalizarSolicitudAnalisis() {
    this.analisisTelefonicoService.finalizarSolicitudAnalisis(this.idSolicitudAnalisisSeleccionada, 1, this.observacionFinalizarAnalisis).subscribe({
      next: response => {
        this.alertatipo = "satisfaccion";
        this.alertaMensaje = "Solicitud de Analisis Correctamente Finalizada";
        this.alertaVisible = true;
        setTimeout(() => {
          this.alertaVisible = false;
        }, 3000);
        this.observacionFinalizarAnalisis = '';
        this.obtenerSolicitudesAnalisis();
      },
      error: err => {
        console.error('Error al finalizar la solicitud de analisis:', err);
      }
    });
    this.cerrarModalFinalizarAnalisis();
  }

  modalVisible(): void {
    this.isModalVisible = true;
  }

  modalInvisible(): void {
    this.isModalVisible = false;
  }

}
