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

  solicitudes: any[] = [];  // Aquí guardamos los datos de las solicitudes
  solicitudesFiltradas: any[] = []; //Se van a guardar las solicitudes con los filtros aplicados
  pageNumber: number = 1;   // Número de página inicial
  pageSize: number = 5;    // Tamaño de página
  modalVisible = false;
  solicitudSeleccionada: any = null;
  filtroCaracter: string = '';

  //Filtro
  estadoSeleccionado: string = 'Pendiente';
  numeroUnicoFiltro: string = '';
  fechaInicioFiltro: string = '';
  fechaFinFiltro: string = '';
  cantidadSolicitudes: number = 0;
  estados: any[] = [];
  cantidadPorEstado: { nombre: string, cantidad: number }[] = [];

  columnasVisibles: { [key: string]: boolean } = {
    aprobar: true,
    sinEfecto: true,
    historico: true,
    ver: true,
    numeroCaso: true,
    numeroUnico: true,
    fechaCreacion: true,
    diasTranscurridos: true,
    estado: true,
    urgente: true,
    creadoPor: true
  };

  constructor(private solicitudProveedorService: SolicitudProveedorService, private estadoService: EstadoService) { }

  ngOnInit(): void {
    // Utiliza forkJoin para esperar a que ambas solicitudes estén listas antes de ejecutar el conteo
    forkJoin({
      solicitudes: this.solicitudProveedorService.obtener(),
      estados: this.estadoService.obtenerEstados()
    }).subscribe({
      next: ({ solicitudes, estados }) => {
        this.solicitudes = solicitudes;
        console.log(this.solicitudes);
        this.estados = estados;
        this.contarSolicitudesPorEstado(); // Llama al conteo una vez que ambas llamadas han finalizado
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
    // Definir las columnas visibles para cada estado
    if (estado === 'creado') {
      this.columnasVisibles = {
        aprobar: true,
        sinEfecto: true,
        historico: true,
        ver: true,
        solicitud: true,
        consecutivo: true,
        numeroUnico: true,
        fechaCreacion: true,
        diasTranscurridos: true,
        estado: true,
        urgente: true,
        creadoPor: true
      };
    } else if (estado === 'tramitado') {
      this.columnasVisibles = {
        finalizar: true,
        historico: true,
        sinEfecto: true,
        requerimientos: true,
        ver: true,
        solicitud: true,
        consecutivo: true,
        numeroUnico: true,
        proveedor: true,
        enviadoPor: true,
        fechaCreacion: true,
        diasTranscurridos: true,
        estado: true,
        urgente: true,
        creadoPor: true
      };
    } else if (estado === 'sin efecto') {
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
    } else if (estado === 'pendiente') {
      this.columnasVisibles = {
        sinEfecto: true,
        historico: true,
        ver: true,
        solicitud: true,
        consecutivo: true,
        numeroUnico: true,
        aprobacion: true,
        fechaCreacion: true,
        diasTranscurridos: true,
        estado: true,
        urgente: true,
        creadoPor: true
      };
    } else if (estado === 'finalizado') {
      this.columnasVisibles = {
        finalizar: true,
        historico: true,
        legajo: true,
        requerimientos: true,
        ver: true,
        solicitud: true,
        consecutivo: true,
        numeroUnico: true,
        proveedor: true,
        enviadoPor: true,
        fechaCreacion: true,
        diasTranscurridos: true,
        estado: true,
        urgente: true,
        creadoPor: true
      };
    } else if (estado === 'legajo') {
      this.columnasVisibles = {
        finalizar: true,
        historico: true,
        legajo: true,
        requerimientos: true,
        ver: true,
        solicitud: true,
        consecutivo: true,
        numeroUnico: true,
        proveedor: true,
        enviadoPor: true,
        fechaCreacion: true,
        diasTranscurridos: true,
        estado: true,
        urgente: true,
        creadoPor: true
      };
    }
  }
  

  contarSolicitudesPorEstado() {
    // Aseguramos que usamos las propiedades correctas y que coincidan los nombres de estado
    this.cantidadPorEstado = this.estados.map(estado => {
      const nombreEstado = estado.nombre; // Cambiamos esto a `nombre` en lugar de `tC_Nombre`
      const cantidad = this.solicitudes.filter(solicitud => solicitud.estado?.nombre === nombreEstado).length;
  
      console.log(`Contando solicitudes para el estado: ${nombreEstado}, cantidad: ${cantidad}`); // Validación de coincidencia
      
      return {
        nombre: nombreEstado,
        cantidad: cantidad
      };
    });
  
    console.log('Resultado final de cantidadPorEstado:', this.cantidadPorEstado); // Confirmación final del resultado
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
    this.filtrarPorEstado();
  }

  filtrarPorEstado() {

  }

  filtrarPorNumeroUnico() {

  }



  filtrarSolicitudes() {
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
  }
  

}
