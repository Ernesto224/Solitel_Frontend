import { Component, OnInit } from '@angular/core';
import { SolicitudProveedorService } from '../../services/solicitud-proveedor.service';
import { HistoricoService } from '../../services/historico.service';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-bandeja',
  standalone: true,
  imports: [
    SidebarComponent,
    FooterComponent,
    RouterOutlet,
    NavbarComponent,
    CommonModule
  ],
  templateUrl: './bandeja.component.html',
  styleUrl: './bandeja.component.css'
})
export default class BandejaComponent implements OnInit {

  solicitudes: any[] = [];  // Aquí guardamos los datos de las solicitudes
  pageNumber: number = 1;   // Número de página inicial
  pageSize: number = 5;    // Tamaño de página
  modalVisible = false;
  modalHistoricoVisible = false;
  solicitudSeleccionada: any = null;
  historicoDeSolicitudSeleccionada: any = null;

  constructor(
    private solicitudProveedorService: SolicitudProveedorService,
    private historicoService: HistoricoService
  ) { }

  ngOnInit(): void {
    // Hacemos la solicitud después de que la vista esté completamente cargada
    this.obtenerSolicitudes(this.pageNumber, this.pageSize);
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

  abrirModalHistorico(solicitud: any){
    this.solicitudSeleccionada = solicitud;
    this.obtenerHistoricoSolicitud(this.solicitudSeleccionada.idSolicitudProveedor)
    console.log('Historico: ', this.historicoDeSolicitudSeleccionada);
    this.modalHistoricoVisible = true;
  }

  cerrarModalHistorico(){
    this.modalHistoricoVisible = false;
  }

  cambiarEstadoASinEfeceto(solicitud: any){
    const confirmacion = window.confirm("¿Estás seguro de que deseas realizar esta acción?");
    if (confirmacion) {
      this.solicitudSeleccionada = solicitud;
      this.solicitudProveedorService.moverEstadoASinEfecto(solicitud.idSolicitudProveedor)
        .subscribe({
          next: (respuesta) => {
            if (respuesta) {
              console.log("Estado cambiado con éxito.");
              this.obtenerSolicitudes(this.pageNumber, this.pageSize);
            } else {
              console.error("No se pudo cambiar el estado.");
            }
          },
          error: (error) => {
            console.error("Ocurrió un error en la solicitud:", error);
          }
        });
    }
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

  obtenerHistoricoSolicitud(idSolicitudProveedor: number): void {
    this.historicoService.obtener(idSolicitudProveedor).subscribe({
      next: (data: any) => {
        this.historicoDeSolicitudSeleccionada = data;
      },
      error: (err) => {
        console.log('')
        if(err.status === 0) {
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
    this.obtenerSolicitudes(this.pageNumber, this.pageSize);
  }

  cambiarTamanoPagina(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.pageSize = +value;
    this.obtenerSolicitudes(this.pageNumber, this.pageSize);
  }
}
