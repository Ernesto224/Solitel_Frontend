import { Component, OnInit  } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OficinaService } from '../../services/oficina.service';
import { ArchivoService } from '../../services/archivo.service';
import { AnalisisTelefonicoService } from '../../services/analisis-telefonico.service';
import { Router } from '@angular/router';
import { TablaVisualizacionComponent } from '../../components/tabla-visualizacion/tabla-visualizacion.component';
import { ModalInformacionComponent } from '../../components/modal-informacion/modal-informacion.component';
import { ModalConfirmacionComponent } from '../../components/modal-confirmacion/modal-confirmacion.component';


@Component({
  selector: 'app-detalle-solicitud-analista',
  standalone: true,
  imports: [CommonModule, FormsModule, TablaVisualizacionComponent, ModalInformacionComponent, ModalConfirmacionComponent],
  templateUrl: './detalle-solicitud-analista.component.html',
  styleUrl: './detalle-solicitud-analista.component.css'
})
export default class DetalleSolicitudAnalistaComponent implements OnInit{

  idSolicitudAnalisisSeleccionada: number = 0;

  solicitudAnalisisSeleccionada: any = [];

  solicitudesProveedorAsociadas: string = '';

  oficinaSolicitante: any;

  tablaVisible: number = 0;

  archivos: any[] = [];

  archivosRespuesta: any[] = [];
  
  modalArchivosVisible = false;


  //Variables para la tabla de Requerimientos
  encabezadosRequerimientos: any[] = [
    { key: 'tipoDato', label: 'Tipo Objetivo' },
    { key: 'condicion', label: 'Condición Objetivo' },
    { key: 'utilizadoPor', label: 'Utilizado por' },
    { key: 'objetivo', label: 'Objetivo' }
  ];

  requerimientos: any[] = [];


  //Variables para la tabla de Objetivos
  encabezadosObjetivos: any[] = [
    { key: 'nombre', label: 'Objetivos de Análisis' }
  ];

  objetivos: any[] = [];


  //Variables para la tabla de Archivos 
  encabezadosArchivos: any[] = [
    { key: 'nombre', label: 'Nombre Documento' },
    { key: 'codigoHash', label: 'Código Hash' }
  ];

  accionesArchivos: any[] = [
    {
      style: "background-color: #1C355C;",
      class: "text-white px-4 py-2 m-1 rounded focus:outline-none focus:ring w-[55px]",
      action: (archivo: any) => this.descargarArchivo(archivo), 
      icon: 'download' 
    }
  ];

  encabezadosAccionesArchivos: any[] = [
    'Descargar'
  ];

  //Variables para el modal de confirmacion
  modalTramitadoVisible = false;

  observacion: string = '';

  constructor(private route: ActivatedRoute, 
              private location: Location,
              private oficinaService: OficinaService,
              private archivoService: ArchivoService,
              private analisisTelefonicoService: AnalisisTelefonicoService,
              private router: Router) {}

  ngOnInit(): void {

    this.idSolicitudAnalisisSeleccionada = Number(this.route.snapshot.paramMap.get('id'));
    this.solicitudAnalisisSeleccionada = history.state?.objeto;

    if(this.solicitudAnalisisSeleccionada && this.idSolicitudAnalisisSeleccionada){
      this.solicitudesProveedorAsociadas = this.solicitudAnalisisSeleccionada.solicitudesProveedor.map((num: { idSolicitudProveedor: any; }) => num.idSolicitudProveedor).join(', ');

    
      this.objetivos = this.solicitudAnalisisSeleccionada.objetivosAnalisis.map((obj: any) => ({
        nombre: obj.nombre
      }));
  
      this.requerimientos = this.solicitudAnalisisSeleccionada.requerimentos.map((req: { tipoDato: { nombre: any; }; condicion: { nombre: any; }; utilizadoPor: any; objetivo: any; }) => ({
        tipoDato: req.tipoDato.nombre,
        condicion: req.condicion.nombre,
        utilizadoPor: req.utilizadoPor,
        objetivo: req.objetivo
      }));
      
      //this.consultarOficina(this.solicitudAnalisisSeleccionada.idOficina);
      this.cargarArchivos(this.idSolicitudAnalisisSeleccionada);
    }


  }

  mostrarTabla(tablaId: number) {
    this.tablaVisible = tablaId;
  }

  abrirModalArchivosRespuesta() {
    this.modalArchivosVisible = true;
  }

  cerrarModalArchivosRespuesta() {
    this.modalArchivosVisible = false;
  }

  seleccionarArchivos(event: any) {
    const seleccionados = event.target.files as FileList; 
    this.archivosRespuesta = Array.from(seleccionados).map((file: File) => {
      return {
        nombre: file.name,  
        file: file,         
        tipo: file.type,   
        tamaño: file.size   
      };
    });
  }

  subirArchivosRespuesta() {
    if (this.archivosRespuesta.length > 0) {
      this.archivosRespuesta.forEach((archivo: any) => {
        const formData = new FormData();
        formData.append('Nombre', archivo.nombre); 
        formData.append('file', archivo.file); 
        formData.append('FormatoAchivo', archivo.tipo); 
        formData.append('FechaModificacion', new Date().toISOString()); 
        formData.append('idSolicitudAnalisis', String(this.idSolicitudAnalisisSeleccionada)); 
        
        this.archivoService.insertarArchivoRespuestaSolicitudAnalisis(formData).subscribe({
          next: response => {
          },
          error: err => {
            console.error('Error al guardar el archivo:', archivo.nombre, err);
          }
        });
      });
    }
  }

  cargarArchivos(idSolicitudAnalisis: number): void {
    this.archivoService.obtenerArchivosDeSolicitudAnalisis(idSolicitudAnalisis).subscribe((archivos: any[]) => {
      this.archivos = archivos;
    });
  }

  descargarArchivo(archivo: any): void {

    const byteCharacters = atob(archivo.contenido);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);

    const blob = new Blob([byteArray], { type: archivo.formatoArchivo });

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = archivo.nombre; 
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }

  quitarArchivos(){
    this.archivosRespuesta = [];
    this.cerrarModalArchivosRespuesta();
  }

  consultarOficina(idOficina: number){
    this.oficinaService.obtenerUna(idOficina).subscribe(data => {
      this.oficinaSolicitante = data.nombre;
    });
  }

  actualizarEstadoAnalizado(): void {
    this.analisisTelefonicoService.ActualizarEstadoAnalizadoSolicitudAnalisis(
      this.idSolicitudAnalisisSeleccionada,
      1, // Usuario Quemado en DB
      this.observacion || null
    ).subscribe(response => {
      console.log('Estado actualizado:', response);
    }, error => {
      console.error('Error al actualizar el estado:', error);
    });
  }

  abriModalConfirmarTramitado(){
    this.modalTramitadoVisible = true;
  }

  cerrarModalConfirmarTramiado(){
    this.observacion = '';
    this.modalTramitadoVisible = false;
  }

  volverABandeja() {
    this.router.navigate(['bandeja-analista']);
  }

  tramitarSolicitudAnalisis(){
    this.actualizarEstadoAnalizado();
    this.subirArchivosRespuesta();
    this.volverABandeja();
  }

}
