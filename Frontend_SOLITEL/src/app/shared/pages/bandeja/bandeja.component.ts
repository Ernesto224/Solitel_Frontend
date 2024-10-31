import { Component, OnInit } from '@angular/core';
import { SolicitudProveedorService } from '../../services/solicitud-proveedor.service';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EstadoService } from '../../services/estado.service';
import { forkJoin } from 'rxjs';


@Component({
  selector: 'app-bandeja',
  standalone: true,
  imports: [
    SidebarComponent,
    FooterComponent,
    RouterOutlet,
    NavbarComponent,
    CommonModule,
    FormsModule
  ],
  templateUrl: './bandeja.component.html',
  styleUrl: './bandeja.component.css'
})
export default class BandejaComponent implements OnInit {

  contenidoPaginado: any[] = []; // Datos de contenido para la página actual
  solicitudes: any[] = [];  // Aquí guardamos los datos de las solicitudes
  solicitudesFiltradas: any[] = []; //Se van a guardar las solicitudes con los filtros aplicados
  pageNumber: number = 1;   // Número de página inicial
  pageSize: number = 5;    // Tamaño de página
  modalVisible = false;
  modalEstadoVisible = false;
  solicitudSeleccionada: any = null;
  filtroCaracter: string = '';

  //Filtro
  estadoSeleccionado: string = 'Creado';
  estadoTemporal: string = 'Creado';
  numeroUnicoFiltro: string = '';
  fechaInicioFiltro: string = '';
  fechaFinFiltro: string = '';
  cantidadSolicitudes: number = 0;
  estados: any[] = [];
  cantidadPorEstado: { nombre: string, cantidad: number }[] = [];
  estadosProveedor: any[] = []; // Lista de estados para "Proveedor"
  estadosAnalisis: any[] = [];  // Lista de estados para "Analisis"
  cantidadPorEstadoProveedor: { nombre: string, cantidad: number }[] = []; // Contador por estado para "Proveedor"
  cantidadPorEstadoAnalisis: { nombre: string, cantidad: number }[] = []; // Contador por estado para "Analisis"

  observacion: string = '';
  solicitudIdParaActualizar: number | null = null;
  nuevoEstado: string = '';
  modalRequerimientosVisible: boolean = false;
  filtroRequerimiento: string = '';

  columnasVisibles: { [key: string]: boolean } = {
    aprobar: false,
    sinEfecto: false,
    historico: false,
    ver: false,
    solicitud: false,
    consecutivo: false,
    numeroUnico: false,
    proveedor: false,
    enviadoPor: false,
    fechaCreacion: false,
    diasTranscurridos: false,
    estado: false,
    urgente: false,
    creadoPor: false,
    finalizar: false,
    requerimientos: false,
    devolver: false,
    aprobacion: false,
    legajo: false
  };

  constructor(private solicitudProveedorService: SolicitudProveedorService, private estadoService: EstadoService) { }

  ngOnInit(): void {
    forkJoin({
      solicitudes: this.solicitudProveedorService.obtener(),
      estados: this.estadoService.obtenerEstados()
    }).subscribe({
      next: ({ solicitudes, estados }) => {
        this.solicitudes = solicitudes;
        this.estados = estados;

        // Filtrar los estados en base al tipo "Proveedor" y "Analisis"
        this.estadosProveedor = estados.filter(estado => estado.tipo === 'Proveedor');
        this.estadosAnalisis = estados.filter(estado => estado.tipo === 'Analisis');

        this.contarSolicitudesPorEstado(); // Llama al conteo una vez que ambas listas están listas
        this.filtrarSolicitudes();
      },
      error: (err) => {
        console.error('Error al obtener datos:', err);
      }
    });
  }


  // Abre el modal con la solicitud seleccionada
  abrirModal(solicitud: any) {
    this.solicitudSeleccionada = solicitud;
    this.modalVisible = true;
    console.log('Solicitud seleccionada:', this.solicitudSeleccionada);
  }

  // Cierra el modal
  cerrarModal() {
    this.modalVisible = false;
    this.solicitudSeleccionada = null;
  }

  obtenerEstados() {
    this.estadoService.obtenerEstados().subscribe({
      next: (data: any[]) => {
        this.estados = data;

      },
      error: (err) => {
        console.error('Error al obtener los estados:', err);
      }
    });
  }

  actualizarColumnasVisibles(estado: string) {
    // Reiniciar todas las columnas a false
    this.columnasVisibles = {
      aprobar: false,
      sinEfecto: false,
      historico: false,
      ver: false,
      solicitud: false,
      consecutivo: false,
      numeroUnico: false,
      proveedor: false,
      enviadoPor: false,
      fechaCreacion: false,
      diasTranscurridos: false,
      estado: false,
      urgente: false,
      creadoPor: false,
      finalizar: false,
      requerimientos: false,
      devolver: false,
      aprobacion: false,
      legajo: false
    };

    // Definir las columnas visibles para cada estado en el orden indicado
    if (estado === 'Creado') {
      this.columnasVisibles = {
        aprobar: true,
        sinEfecto: true,
        historico: true,
        ver: true,
        solicitud: true,
        //consecutivo: true,
        numeroUnico: true,
        fechaCreacion: true,
        diasTranscurridos: true,
        estado: true,
        urgente: true,
        creadoPor: true
      };
    } else if (estado === 'Tramitado') {
      this.columnasVisibles = {
        finalizar: true,
        historico: true,
        sinEfecto: true,
        requerimientos: true,
        ver: true,
        solicitud: true,
        // consecutivo: true,
        numeroUnico: true,
        proveedor: true,
        // enviadoPor: true,
        fechaCreacion: true,
        diasTranscurridos: true,
        estado: true,
        urgente: true,
        creadoPor: true
      };
    } else if (estado === 'Sin Efecto') {
      this.columnasVisibles = {
        devolver: true,
        historico: true,
        requerimientos: true,
        ver: true,
        solicitud: true,
        numeroUnico: true,
        creadoPor: true,
        fechaCreacion: true,
        diasTranscurridos: true,
        estado: true,
        urgente: true
      };
    } else if (estado === 'Pendiente') {
      this.columnasVisibles = {
        sinEfecto: true,
        historico: true,
        ver: true,
        solicitud: true,
        // consecutivo: true,
        numeroUnico: true,
        aprobacion: true,
        fechaCreacion: true,
        diasTranscurridos: true,
        estado: true,
        urgente: true,
        creadoPor: true
      };
    } else if (estado === 'Finalizado') {
      this.columnasVisibles = {
        finalizar: true,
        historico: true,
        legajo: true,
        requerimientos: true,
        ver: true,
        solicitud: true,
        // consecutivo: true,
        numeroUnico: true,
        proveedor: true,
        // enviadoPor: true,
        fechaCreacion: true,
        diasTranscurridos: true,
        estado: true,
        urgente: true,
        creadoPor: true
      };
    } else if (estado === 'Legajo') {
      this.columnasVisibles = {
        devolver: true,
        historico: true,
        legajo: true,
        requerimientos: true,
        ver: true,
        solicitud: true,
        // consecutivo: true,
        numeroUnico: true,
        proveedor: true,
        // enviadoPor: true,
        fechaCreacion: true,
        diasTranscurridos: true,
        estado: true,
        urgente: true,
        creadoPor: true
      };
    } else if (estado === 'Solicitado') {
      this.columnasVisibles = {
        aprobar: true,
        sinEfecto: true,
        historico: true,
        ver: true,
        solicitud: true,
        //consecutivo: true,
        numeroUnico: true,
        fechaCreacion: true,
        diasTranscurridos: true,
        estado: true,
        urgente: true,
        creadoPor: true
      };
    }

    console.log('Estado seleccionado:', estado);
    console.log('Columnas visibles:', this.columnasVisibles);
  }



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

    console.log('Cantidad por estado - Proveedor:', this.cantidadPorEstadoProveedor);
    console.log('Cantidad por estado - Análisis:', this.cantidadPorEstadoAnalisis);
  }





  obtenerSolicitudes(): void {
    this.solicitudProveedorService.obtener().subscribe({
      next: (data: any) => {
        this.solicitudes = data;  // Guardamos las solicitudes
        console.log('Solicitudes obtenidas:', this.solicitudes); // Verificamos las solicitudes obtenidas
      },
      error: (err) => {
        console.error('Error al obtener las solicitudes:', err);
      }
    });
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
    this.estadoSeleccionado = 'Pendiente';
    this.numeroUnicoFiltro = '';
    this.fechaInicioFiltro = '';
    this.fechaFinFiltro = '';
  }

  filtrarSolicitudes() {
    this.estadoSeleccionado = this.estadoTemporal;
    this.solicitudesFiltradas = [...this.solicitudes];
    this.actualizarColumnasVisibles(this.estadoSeleccionado);

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

  abrirModalRequerimientos(solicitud: any) {
    this.solicitudSeleccionada = solicitud; // Asigna la solicitud seleccionada
    this.modalRequerimientosVisible = true; // Muestra el modal de requerimientos
  }
  
  cerrarModalRequerimientos() {
    this.modalRequerimientosVisible = false; // Cierra el modal de requerimientos
    this.solicitudSeleccionada = null; // Limpia la solicitud seleccionada
  }
  



  //Actualizacion de estados

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
