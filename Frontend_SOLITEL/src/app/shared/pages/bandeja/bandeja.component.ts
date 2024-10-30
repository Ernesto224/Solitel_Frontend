import { Component, OnInit } from '@angular/core';
import { SolicitudProveedorService } from '../../services/solicitud-proveedor.service';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EstadoService } from '../../services/estado.service';  

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


  constructor(private solicitudProveedorService: SolicitudProveedorService, private estadoService: EstadoService) { }

  ngOnInit(): void {
    // Hacemos la solicitud después de que la vista esté completamente cargada
    this.obtenerSolicitudes(this.pageNumber, this.pageSize);
    this.obtenerEstados();
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

  obtenerSolicitudes(pageNumber: number, pageSize: number): void {
    this.solicitudProveedorService.obtener(pageNumber, pageSize).subscribe({
      next: (data: any) => {
        this.solicitudes = data;  // Guardamos los datos de la solicitud
      },
      error: (err) => {
        console.log('');
        if (err.status === 0) {
          console.log('');
        }
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
    this.obtenerSolicitudes(this.pageNumber, this.pageSize);
  }

  cambiarTamanoPagina(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.pageSize = +value;
    this.obtenerSolicitudes(this.pageNumber, this.pageSize);
  }

  filtrarPorEstado() {
    const idEstado = parseInt(this.estadoSeleccionado, 10);  // Convertir el estado seleccionado a número
console.log(this.pageNumber)
    this.solicitudProveedorService.obtenerSolicitudesPorEstado(idEstado,this.pageNumber,this.pageSize).subscribe({
      next: (data: any) => {
        this.solicitudes = data;  // Actualizamos las solicitudes filtradas por estado
        this.cantidadSolicitudes = this.solicitudes.length;  // Actualizamos la cantidad en el badge
      },
      error: (err) => {
        console.log('Error al filtrar solicitudes por estado', err);
      }
    });
  }

  limpiarFiltros() {
    this.estadoSeleccionado = 'Pendiente';
    this.numeroUnicoFiltro = '';
    this.fechaInicioFiltro = '';
    this.fechaFinFiltro = '';
    this.filtrarPorEstado();
  }

  filtrarSolicitudes() {
    let solicitudesFiltradas = this.solicitudes;

    // Filtro por estado
    if (this.estadoSeleccionado) {
      this.filtrarPorEstado();
    }

    // Filtro por número único
    if (this.numeroUnicoFiltro) {
      solicitudesFiltradas = solicitudesFiltradas.filter(solicitud => solicitud.numeroUnico.includes(this.numeroUnicoFiltro));
    }

    // Filtro por fecha de inicio
    if (this.fechaInicioFiltro) {
      solicitudesFiltradas = solicitudesFiltradas.filter(solicitud => new Date(solicitud.fecha) >= new Date(this.fechaInicioFiltro));
    }

    // Filtro por fecha de fin
    if (this.fechaFinFiltro) {
      solicitudesFiltradas = solicitudesFiltradas.filter(solicitud => new Date(solicitud.fecha) <= new Date(this.fechaFinFiltro));
    }

    console.log('Solicitudes filtradas:', solicitudesFiltradas);
  }



}
