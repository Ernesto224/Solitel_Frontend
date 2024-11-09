import { Component, OnInit , ChangeDetectorRef } from '@angular/core';
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

  estados: any[] = [];
  estadosProveedor: any[] = [];
  estadosAnalisis: any[] = [];

  encabezados: any[] = [];
  solicitudes: any[] = [];
  solicitudesFiltradas: any[] = [];
  solicitudesPaginadas: any[] = [];
  solicitudesAnalisis: any[] = [];
  solicitudesAnalisisOriginales: any[] = []; // Nueva variable para mantener las solicitudes originales
  mostrarTablaProveedor: boolean = true; // Controla cuál tabla mostrar
  columnasVisibles: { [key: string]: boolean } = {};
  numeroDePagina: number = 1;
  cantidadDeRegistros: number = 5;

  cantidadPorEstadoProveedor: { idEstado: number, nombre: string, cantidad: number }[] = [];
  cantidadPorEstadoAnalisis: { idEstado: number, nombre: string, cantidad: number }[] = [];

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
    'En Análisis': {
      headers: ['Histórico', 'Requerimientos', 'Ver', 'Solicitud', 'Número único', 'Proveedor', 'Fecha sol. telef.', 'Fecha sol. análisis', 'Urgente'],
      actions: ['historico', 'ver', 'requerimientos'],
      columnasVisibles: { historico: true, requerimientos: true, ver: true, solicitud: true, numeroUnico: true, proveedor: true, FechaSolTelef: true, FechaSolAanálisis: true, urgente: true }
    },
    Analizado: {
      headers: ['Histórico', 'Requerimientos', 'Ver', 'Solicitud', 'Número único', 'Proveedor', 'Fecha sol. telef.', 'Fecha sol. análisis', 'Urgente'],
      actions: ['historico', 'ver', 'requerimientos'],
      columnasVisibles: { historico: true, requerimientos: true, ver: true, solicitud: true, numeroUnico: true, proveedor: true, FechaSolTelef: true, FechaSolAanálisis: true, urgente: true }
    },
    'Aprobar Análisis': {
      headers: ['Histórico', 'Requerimientos', 'Ver', 'Solicitud', 'Número único', 'Proveedor', 'Fecha sol. telef.', 'Fecha sol. análisis', 'Urgente'],
      actions: ['historico', 'ver', 'requerimientos'],
      columnasVisibles: { historico: true, requerimientos: true, ver: true, solicitud: true, numeroUnico: true, proveedor: true, FechaSolTelef: true, FechaSolAanálisis: true, urgente: true }
    }



  };

  estadoSeleccionado: string = 'Creado';
  estadoTemporal: string = 'Creado';
  idEstadoSeleccionado: number | null = null;
  numeroUnicoFiltro: string = '';
  fechaInicioFiltro: string = '';
  fechaFinFiltro: string = '';
  filtroCaracter: string = '';
  isSwitchDisabled: boolean = false; // Variable para controlar si el switch está habilitado

  solicitudSeleccionada: any = null;
  solicitudIdParaActualizar: number | null = null;

  // Variables para la alerta component
  alertatipo: string = "error";
  alertaMensaje: string = "";
  alertaVisible: boolean = false;

  modalVisible = false;
  encabezadosRequerimientos: any[] = [
    { key: 'requerimiento', label: 'Requerimiento' },
    { key: 'tipoSolicitudes', label: 'Tipo Solicitud' },
    { key: 'datosRequeridos', label: 'Datos Requeridos' },
    { key: 'fechaInicio', label: 'Fecha Inicio' },
    { key: 'fechaFinal', label: 'Fecha Final' }
  ];
  requerimientosDeSolicitudSeleccionada: any[] = [];

  isModalVisible: boolean = false;
  modalEstadoVisible = false;
  observacion: string = '';
  nuevoEstado: string = '';

  modalHistoricoVisible = false;
  encabezadosHistorico: any[] = [
    { key: 'idSolicitudProveedor', label: 'Solicitud' },
    { key: 'numeroUnico', label: 'Número Único' },
    { key: 'estado', label: 'Estado' },
    { key: 'fechaEstado', label: 'Fecha Estado' },
    { key: 'usuario', label: 'Usuario' },
    { key: 'observacion', label: 'Observación' }
  ];
  historicoDeSolicitudSeleccionada: any[] = [];

  modalRequerimientosVisible: boolean = false;
  encabezadosRequerimientosTramitados: any[] = [
    { key: 'requerimiento', label: 'Requerimiento' },
    { key: 'numRequerido', label: 'Núm. requerido' },
    { key: 'rangoFechas', label: 'Rango de fechas' },
    { key: 'observacion', label: 'Observación' }
  ];
  requerimientosRespondidos: any[] = [];
  encabezadosAccionesRequerimientosTramitados: any[] = [
    'Archivos'
  ];


  accionesrequerimientosRespondidos: any[] = [
    {
      style: "background-color: #1C355C;",
      class: "text-white px-4 py-2 rounded focus:outline-none focus:ring w-[55px]",
      action: (requerimiento: any) => this.cargarArchivos(requerimiento.idRequerimientoProveedor), // Acción para cargar archivos
      icon: 'folder' // Icono para el botón
    },
  ];

  archivos: any[] = [];


  // Variables necesarias para ver y descargar archivos UAC
  archivosUAC: any[] = [];
  modalArchivosUACVisible: boolean = false;
  encabezadosArchivosUAC: any[] = [
    { key: 'nombre', label: 'Nombre Documento' }
  ];
  accionesArchivosUAC: any[] = [
    {
      style: "background-color: #1C355C;",
      class: "text-white px-4 py-2 m-1 rounded focus:outline-none focus:ring w-[55px]",
      action: (archivo: any) => this.descargarArchivo(archivo),
      icon: 'download'
    }
  ];
  encabezadosAccionesArchivosUAC: any[] = [
    'Descargar'
  ];


  // Variables necesarias para agregar informe 
  modalArchivosInformeFinalVisible: boolean = false;
  subirArchivosInformeFinalOpcion: boolean = false;
  archivosInformeFinal: any[] = [];
  archivosInformeFinalDB: any[] = [];
  idSolicitudAnalisisSeleccionada: number = 0;
  encabezadosArchivosInforme: any[] = [
    { key: 'nombre', label: 'Nombre Documento' }
  ];
  accionesArchivosInforme: any[] = [
    {
      style: "background-color: #1C355C;",
      class: "text-white px-4 py-2 m-1 rounded focus:outline-none focus:ring w-[55px]",
      action: (archivo: any) => this.descargarArchivo(archivo),
      icon: 'download'
    }
  ];
  encabezadosAccionesArchivosInforme: any[] = [
    'Descargar'
  ];


  // Variables para el modal historico analisis
  historicoDeSolicitudAnalisisSeleccionada: any[] = [];
  modalHistoricoAnalisisVisible: boolean = false;
  encabezadosHistoricoAnalisis: any[] = [
    { key: 'idSolicitudAnalisis', label: 'Solicitud' },
    { key: 'estado', label: 'Estado' },
    { key: 'fechaEstado', label: 'Fecha Estado' },
    { key: 'usuario', label: 'Usuario' },
    { key: 'observacion', label: 'Observación' }
  ];


  // Variables para confirmar Legajo analisis
  modalLegajorAnalisis: boolean = false;
  observacionLegajoAnalisis: string = '';


  // Variables para aprobar analisis
  modalAprobarAnalisis: boolean = false;
  observacionAprobarAnalisis: string = '';


  // Variables para devolver Analizado
  modalDevolverAnalizado: boolean = false;
  observacionDevolverAnalizado: string = '';


  // Variables para finalizar una solicitud de analisis
  modalFinalizarAnalisis: boolean = false;
  observacionFinalizarAnalisis: string = '';



  constructor(
    private solicitudProveedorService: SolicitudProveedorService,
    private analisisTelefonicoService: AnalisisTelefonicoService,
    private estadoService: EstadoService,
    private archivoService: ArchivoService,
    private historicoService: HistoricoService,
    private datePipe: DatePipe,
    private cdr: ChangeDetectorRef

    
  ) { }

  ngOnInit(): void {
    this.cargarDatosBandeja();
  }

  cargarDatosBandeja() {
    this.isModalVisible = true; // Mostrar el modal al iniciar la operación

    // Simulación de una operación asíncrona
    setTimeout(() => {
      this.obtenerEstados();
      this.obtenerSolicitudes();
      this.obtenerSolicitudesAnalisis();
      this.contarSolicitudesPorEstado(); 
    }, 3000); // Simular 3 segundos de procesamiento
  }

  vaciarDatosBandeja() {
    this.solicitudes = [];
    this.solicitudesAnalisis = [];
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
        this.isModalVisible = false; // Ocultar el modal después de la operación
      },
      error: (err) => {
        console.error('Error al obtener datos:', err);
      },
    });
  }

  obtenerSolicitudesAnalisis(): void {
    console.log("Método obtenerSolicitudesAnalisis llamado");

    this.analisisTelefonicoService.obtenerSolicitudesAnalisis().subscribe({
      next: (value) => {
        this.solicitudesAnalisis = value;
        this.solicitudesAnalisisOriginales = value;
        this.filtrarSolicitudes(); // Si deseas aplicar algún filtro
      },
      error: (err) => {
        console.error('Error al obtener solicitudes de análisis:', err);
      }
    });
  }

  obtenerOpcionesPorEstado(estado: string): string[] {
    switch (estado) {
      case "En Análisis":
        return ["Ver histórico", "Ver Solicitud"];
      case "Analizado":
        return ["Ver histórico", "Ver Solicitud", "Descargar informe UAC", "Agregar informe", "Finalizar solicitud de análisis", "Enviar a legajo solicitud de análisis"];
      case "Aprobar Análisis":
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
    this.estadoSeleccionado = this.estadoTemporal;
    this.encabezados = this.estadoColumnas[this.estadoSeleccionado].headers;
    this.columnasVisibles = this.estadoColumnas[this.estadoSeleccionado].columnasVisibles;
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
        this.modalVisible = true;
      }
    });
  }

  cerrarModalDeDetalles() {
    this.modalVisible = false;
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

  contarSolicitudesPorEstado() {
    // Reiniciar contadores
    this.cantidadPorEstadoProveedor = [];
    this.cantidadPorEstadoAnalisis = [];

    // Filtrar y contar solicitudes agrupadas por tipo
    this.estados.forEach(estado => {
      const solicitudesFiltradas = estado.tipo === 'Proveedor'
        ? this.solicitudes.filter(solicitud => solicitud.estado?.idEstado === estado.idEstado)
        : this.solicitudesAnalisis.filter(solicitud => solicitud.estado?.idEstado === estado.idEstado);

      const contador = { idEstado: estado.idEstado, nombre: estado.nombre, cantidad: solicitudesFiltradas.length };

      if (estado.tipo === 'Proveedor') {
        this.cantidadPorEstadoProveedor.push(contador);
      } else {
        this.cantidadPorEstadoAnalisis.push(contador);
      }
    });
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

  filtrarSolicitudesAnalisis(): void {
    this.solicitudesAnalisis = this.solicitudesAnalisisOriginales.filter(solicitud =>
      solicitud.estado?.nombre === this.estadoTemporal &&
      ["En Análisis", "Analizado", "Aprobar Análisis", "Finalizado", "Legajo"].includes(solicitud.estado?.nombre)
    );
  
  }
  


  onEstadoChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const selectedOption = selectElement.selectedOptions[0];
  
    if (selectedOption) {
      const idEstado = selectedOption.getAttribute('data-idEstado');
      const nombreEstado = selectedOption.value;
  
      if (idEstado && nombreEstado) {
        this.idEstadoSeleccionado = parseInt(idEstado, 10);
        this.estadoTemporal = nombreEstado; 
        

        this.cdr.detectChanges();

      }
    }
  }
  
  trackByEstadoId(index: number, estado: any): number {
    return estado.idEstado; // Usa el ID del estado como clave única
  }
  




  filtrarSolicitudes() {
    if (this.idEstadoSeleccionado) {
      // Determinar si mostrar la tabla de Proveedor o de Análisis
      if (this.idEstadoSeleccionado >= 1 && this.idEstadoSeleccionado <= 7) {
        this.mostrarTablaProveedor = true;
        console.log('Mostrando tabla de Proveedor');
      } else if (this.idEstadoSeleccionado >= 9 && this.idEstadoSeleccionado <= 13) {
        this.mostrarTablaProveedor = false;
        console.log('Mostrando tabla de Análisis');
      } else {
        console.warn('ID de estado desconocido:', this.idEstadoSeleccionado);
      }
    }
    this.reiniciarDatosDeTabla();
    this.solicitudesFiltradas = this.solicitudes;

    this.aplicarFiltroEstado();
    this.aplicarFiltroNumeroUnico();
    this.aplicarFiltroFecha();
    this.aplicarFiltroCaracter();

    this.actualizarPaginacion();
    this.contarSolicitudesPorEstado();

    if (!this.mostrarTablaProveedor) {
      // Si es de análisis, aplica el filtro de solicitudes de análisis
      this.filtrarSolicitudesAnalisis();

    }
  }

  jsonEstado(tipo: string, nombre: string): string {
    return JSON.stringify({ tipo, nombre });
  }


  aplicarFiltroEstado() {
    if (this.estadoSeleccionado) {
      this.solicitudesFiltradas = this.solicitudesFiltradas.filter(solicitud =>
        solicitud.estado?.nombre === this.estadoSeleccionado
      );
    }
  }

  aplicarFiltroNumeroUnico() {
    if (this.numeroUnicoFiltro) {
      this.solicitudesFiltradas = this.solicitudesFiltradas.filter(solicitud =>
        solicitud.numeroUnico?.includes(this.numeroUnicoFiltro)
      );
    }
  }

  aplicarFiltroFecha() {
    if (this.fechaInicioFiltro) {
      const fechaInicio = new Date(this.fechaInicioFiltro);
      this.solicitudesFiltradas = this.solicitudesFiltradas.filter(solicitud =>
        new Date(solicitud.fechaCrecion) >= fechaInicio
      );
    }
    if (this.fechaFinFiltro) {
      const fechaFin = new Date(this.fechaFinFiltro);
      this.solicitudesFiltradas = this.solicitudesFiltradas.filter(solicitud =>
        new Date(solicitud.fechaCrecion) <= fechaFin
      );
    }
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

  onSwitchChange(idSolicitudProveedor: number, aprobado: boolean) {
    if (aprobado) {
      this.aprobarSolicitud(idSolicitudProveedor, 'Aprobar');
      this.isSwitchDisabled = true; // Bloquear el switch después de aprobar
    }
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
    if(estadoSolicitud == "Finalizado"){
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
    this.analisisTelefonicoService.ActualizarEstadoLegajoolicitudAnalisis(this.idSolicitudAnalisisSeleccionada, 1, this.observacionFinalizarAnalisis).subscribe({
      next: response => {
        this.alertatipo = "satisfaccion";
        this.alertaMensaje = "Solicitud de Analisis Movida a Legajo";
        this.alertaVisible = true;
        this.vaciarDatosBandeja();
        this.cargarDatosBandeja();
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
        this.observacionAprobarAnalisis = '';
        this.vaciarDatosBandeja();
        this.cargarDatosBandeja();
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
        this.observacionDevolverAnalizado = '';
        this.vaciarDatosBandeja();
        this.cargarDatosBandeja();
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
        this.observacionFinalizarAnalisis = '';
        this.vaciarDatosBandeja();
        this.cargarDatosBandeja();
      },
      error: err => {
        console.error('Error al finalizar la solicitud de analisis:', err);
      }
    });
    this.cerrarModalFinalizarAnalisis();
  }

}
