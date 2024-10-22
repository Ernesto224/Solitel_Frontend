import { Component, OnInit } from '@angular/core';
import { SolicitudProveedorService } from '../../services/solicitud-proveedor.service';
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
export default class BandejaComponent {

  solicitudes: any[] = [];  // Aquí guardamos los datos de las solicitudes
  pageNumber: number = 1;   // Número de página inicial
  pageSize: number = 10;    // Tamaño de página

  constructor(private solicitudProveedorService: SolicitudProveedorService) {}

  ngOnInit(): void {
    this.obtenerSolicitudes(this.pageNumber, this.pageSize);
  }

  obtenerSolicitudes(pageNumber: number, pageSize: number): void {
    this.solicitudProveedorService.obtener(pageNumber, pageSize).subscribe({
      next: (data: any) => {
        this.solicitudes = data;  // Guardamos los datos de la solicitud
      },
      error: (err) => {
        console.error('Error al cargar las solicitudes:', err);
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
}
