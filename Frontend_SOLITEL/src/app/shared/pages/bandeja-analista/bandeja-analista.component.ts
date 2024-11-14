import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EstadoService } from '../../services/estado.service';
import { AnalisisTelefonicoService } from '../../services/analisis-telefonico.service';
import { AuthenticacionService } from '../../services/authenticacion.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bandeja-analista',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './bandeja-analista.component.html',
  styleUrl: './bandeja-analista.component.css'
})
export default class BandejaAnalistaComponent implements OnInit {

  usuario: any = {};
  usuarioId: number = 0;
  oficinaId: number = 0;

  estadosPermitidos: string[] = ["Finalizado", "En Análisis", "Analizado"];
  estados: any[] = [];
  encabezados: any[] = [];
  solicitudesAnalisis: any[] = [];

  numeroDePagina: number = 1;
  cantidadDeRegistros: number = 5;
  solicitudesAnalisisFiltradas: any[] = [];
  solicitudesAnalisisPaginadas: any[] = [];

  estadoColumnas: { [key: string]: { headers: string[] } } = {
    9: {
      headers: ['Solicitud telefónica', 'Número único', 'Investigador', 'Oficina', 'Aprobado por', 'Fecha creación S.A.', 'Fecha aprobación S.A.', 'Asignada a', 'Fecha de asignación', 'Estado solicitud', 'Urgente', 'Fecha analizada']
    },
    11: {
      headers: ['Solicitud telefónica', 'Número único', 'Investigador', 'Oficina', 'Aprobado por', 'Fecha creación S.A.', 'Fecha aprobación S.A.', 'Asignada a', 'Fecha de asignación', 'Estado solicitud', 'Urgente', 'Fecha analizada']
    },
    12: {
      headers: ['Solicitud telefónica', 'Número único', 'Investigador', 'Oficina', 'Aprobado por', 'Fecha creación S.A.', 'Fecha aprobación S.A.', 'Asignada a', 'Fecha de asignación', 'Estado solicitud', 'Urgente', 'Fecha analizada']
    }
  };

  estadoTemporal: number = 11;
  estadoSeleccionado: number = 11;
  numeroUnicoFiltro: string = '';
  fechaInicioFiltro: string = '';
  fechaFinFiltro: string = '';
  filtroCaracter: string = '';
  isSwitchDisabled: boolean = false;

  solicitudSeleccionada: any = null;
  solicitudIdParaActualizar: number | null = null;

  isModalVisible: boolean = false;
  modalEstadoVisible = false;
  observacion: string = '';
  nuevoEstado: string = '';

  constructor(
    private analisisTelefonicoService: AnalisisTelefonicoService,
    private estadoService: EstadoService,
    private autenticate: AuthenticacionService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.obtenerDatosDeUsuario();
    this.modalVisible();
    setTimeout(() => {
      this.obtenerEstados();
      this.obtenerSolicitudesAnalisis();
    }, 3000);
  }

  //obtener datos
  obtenerDatosDeUsuario(): void{
    this.usuario = this.autenticate.getUsuario();
    this.usuarioId = this.autenticate.verificarPermisosVerDatosAnalistas(this.usuario);
    this.oficinaId = this.usuario.oficina.idOficina;
  }

  obtenerEstados(): void {
    this.estadoService.obtenerEstados(this.usuarioId, this.oficinaId)
      .subscribe({
        next: (estados) => {
          this.estados = estados;
          this.estados = this.estados.filter(estado => estado.tipo === 'Analisis');//se filtran los estados por tipo
          this.estados = this.estados.filter((estado) => {
            return this.estadosPermitidos.includes(estado.nombre)
          }
          );//se filtran los estados permitidos en la vista
        },
        error: (err) => {
          console.error('Error al obtener datos:', err);
        }
      });
  }

  obtenerSolicitudesAnalisis(): void {
    this.analisisTelefonicoService.obtenerBandejaAnalista(this.estadoSeleccionado, 
      this.fechaInicioFiltro, this.fechaFinFiltro, this.numeroUnicoFiltro, this.oficinaId, this.usuarioId)
      .subscribe({
        next: (value) => {
          this.solicitudesAnalisis = value;
          console.log(this.solicitudesAnalisis);
          this.reiniciarDatosDeTabla();
          console.log(this.solicitudesAnalisisFiltradas);
          this.actualizarPaginacion();
          console.log(this.solicitudesAnalisisPaginadas);
          this.modalInvisible();
        },
        error: (err) => {
          console.error('Error al obtener solicitudes de análisis:', err);
          this.modalInvisible();
        },
      });
  }

  verDetalle(solicitud: any) {
    this.router.navigate(['detalle-solicitud-analista', solicitud.idSolicitudAnalisis], {
      state: { objeto: solicitud }
    });
  }

  cambiarPagina(incremento: number): void {
    const maxPage = Math.ceil(this.solicitudesAnalisisFiltradas.length / this.cantidadDeRegistros);
    const newPage = this.numeroDePagina + incremento;

    if (newPage >= 1 && newPage <= maxPage) {
      this.numeroDePagina = newPage;
      this.actualizarPaginacion(); // Actualizar los datos mostrados en la página actual
    }
  }

  cambiarTamanoPagina(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.cantidadDeRegistros = +value;
    this.numeroDePagina = 1; // Reinicia la página al cambiar el tamaño de página
    this.actualizarPaginacion();
  }

  actualizarPaginacion() {
    const inicio = (this.numeroDePagina - 1) * this.cantidadDeRegistros;
    const fin = inicio + this.cantidadDeRegistros;
    this.solicitudesAnalisisPaginadas = this.solicitudesAnalisisFiltradas.slice(inicio, fin);
  }

  limpiarFiltros() {
    this.numeroUnicoFiltro = '';
    this.fechaInicioFiltro = '';
    this.fechaFinFiltro = '';
    this.filtroCaracter = '';
    this.reiniciarDatosDeTabla();
    console.log(this.solicitudesAnalisisFiltradas);
    this.actualizarPaginacion();
    console.log(this.solicitudesAnalisisPaginadas);
  }


  filtrarSolicitudes() {
    console.log(this.estadoSeleccionado);
    this.obtenerSolicitudesAnalisis();
  }

  aplicarFiltroCaracter() {
    if (this.filtroCaracter) {
      const filtro = this.filtroCaracter.toLowerCase();
  
      // Helper function to format dates to dd/MM/yyyy
      const formatFecha = (fecha: string | null) => {
        if (!fecha) return '';
        const date = new Date(fecha);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
      };
  
      // Filtro principal basado en los criterios solicitados
      this.solicitudesAnalisisFiltradas = this.solicitudesAnalisis.filter(solicitud =>
        solicitud.idSolicitudAnalisis?.toString().includes(filtro) || // Filtrado por idSolicitudAnalisis (si aplica)
        solicitud.idSolicitudProveedor?.toString().includes(filtro) || // Filtrado por idSolicitudProveedor (si aplica)
        (solicitud.fechaCreacion && formatFecha(solicitud.fechaCreacion).includes(filtro)) || // Filtrado por fecha
        (solicitud.proveedor?.nombre?.toLowerCase().includes(filtro) || // Filtrado por proveedor
         solicitud.operadoras?.some((prov: any) => prov.nombre?.toLowerCase().includes(filtro))) || // Filtrado por operadoras si aplica
        (solicitud.usuarioCreador?.nombre?.toLowerCase().includes(filtro) || // Filtrado por nombre de usuario creador
         solicitud.nombreUsuarioCreador?.toLowerCase().includes(filtro)) // Filtrado por nombre de usuario creador directamente si existe
      );
  
      this.actualizarPaginacion();
    }
  }

  reiniciarDatosDeTabla(): void {
    this.numeroDePagina = 1;
    this.solicitudesAnalisisFiltradas = this.solicitudesAnalisis;
    this.encabezados = this.estadoColumnas[this.estadoSeleccionado].headers;
  }

  obtenerOpcionesPorEstado(estado: string): string[] {
    switch (estado) {
      case "En Análisis":
        return ["Ver histórico", "Ver Solicitud"];
      default:
        return [];
    }
  }

  modalVisible(): void {
    this.isModalVisible = true;
  }

  modalInvisible(): void {
    this.isModalVisible = false;
  }
}
