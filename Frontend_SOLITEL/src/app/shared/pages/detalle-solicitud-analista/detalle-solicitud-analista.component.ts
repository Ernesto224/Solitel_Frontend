import { Component, OnInit } from '@angular/core';
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
import { AlertaComponent } from '../../components/alerta/alerta.component';
import { AuthenticacionService } from '../../services/authenticacion.service';

interface Archivo {
  nombre: string;
  file: File;
  tipo: string;
  tamaño: number;
}

@Component({
  selector: 'app-detalle-solicitud-analista',
  standalone: true,
  imports: [CommonModule, FormsModule, TablaVisualizacionComponent, ModalInformacionComponent, ModalConfirmacionComponent,
    AlertaComponent
  ],
  templateUrl: './detalle-solicitud-analista.component.html',
  styleUrl: './detalle-solicitud-analista.component.css'
})
export default class DetalleSolicitudAnalistaComponent implements OnInit {

  idSolicitudAnalisisSeleccionada: number = 0;

  solicitudAnalisisSeleccionada: any = [];

  solicitudesProveedorAsociadas: string = '';

  oficinaSolicitante: any;

  tablaVisible: number = 0;

  archivos: any[] = [];

  archivosRespuesta: any[] = [];

  modalArchivosVisible = false;

  botonArchivosDeshabilitado: boolean = false;

  botonTramitarDeshabilitado: boolean = false;

  usuariosDisponibles: any[] = [];

  idUsuarioAsignadoSeleccionado: string = '';

  existeAsignacion: boolean = false;

  // Variables para alertas
  alertatipo: string = "error";
  alertaMensaje: string = "";
  alertaVisible: boolean = false;

  // Variables para alertas
  alertatipo1: string = "error";
  alertaMensaje1: string = "";
  alertaVisible1: boolean = false;


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

  //Variables para la tabla de Archivos de Respuesta
  encabezadosArchivosRespuesta: any[] = [
    { key: 'nombre', label: 'Nombre Documento' },
  ];

  accionesArchivosRespuesta: any[] = [
    {
      style: "border: none; background-color: #007BFF; padding: 6px 12px;",
      class: "btn btn-primary text-[#FFFFFF] px-4 py-2 rounded focus:outline-none focus:ring focus:ring-blue-300 flex items-center space-x-2", 
      action: (archivo: any) => this.quitarArchivoRespuesta(archivo),
      icon: 'delete'
    }
  ];

  encabezadosAccionesArchivosRespuesta: any[] = [
    'Quitar'
  ];

  //Variables para el modal de confirmacion
  modalTramitadoVisible = false;

  observacion: string = '';

  // Variable para obtener el usuario en sesion
  usuario: any = [];

  constructor(private route: ActivatedRoute,
    private archivoService: ArchivoService,
    private analisisTelefonicoService: AnalisisTelefonicoService,
    private router: Router,
    private authenticationService: AuthenticacionService
  ) { }

  ngOnInit(): void {

    this.idSolicitudAnalisisSeleccionada = Number(this.route.snapshot.paramMap.get('id'));
    this.solicitudAnalisisSeleccionada = history.state?.objeto;

    if (this.solicitudAnalisisSeleccionada && this.idSolicitudAnalisisSeleccionada) {
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
      if(this.solicitudAnalisisSeleccionada.nombreUsuarioAsignado ){
        this.idUsuarioAsignadoSeleccionado = this.solicitudAnalisisSeleccionada.nombreUsuarioAsignado;
      }
      this.usuario = this.authenticationService.getUsuario();
      this.cargarArchivos(this.idSolicitudAnalisisSeleccionada);
      this.obtenerUsuariosDisponibles();
    }


  }

  asignarUsuario() {
    this.analisisTelefonicoService.asignarUsuario(this.idSolicitudAnalisisSeleccionada, parseInt(this.idUsuarioAsignadoSeleccionado)).subscribe(response => {
      if (response.success) {
        this.alertatipo1 = "satisfaccion";
        this.alertaMensaje1 = response.message; // Mostrar el mensaje del backend
        this.alertaVisible1 = true;
        setTimeout(() => {
          this.alertaVisible1 = false;
        }, 3000);
      } else {
        this.alertatipo1 = "error";
        this.alertaMensaje1 = response.message; // Mostrar el mensaje de error del backend
        this.alertaVisible1 = true;
        setTimeout(() => {
          this.alertaVisible1 = false;
        }, 3000);
      }
    }, error => {
      // Manejo de errores en caso de problemas con la conexión o el servidor
      this.alertatipo1 = "error";
      this.alertaMensaje1 = "Hubo un problema de conexión con el servidor.";
      this.alertaVisible1 = true;
      setTimeout(() => {
        this.alertaVisible1 = false;
      }, 3000);
    });
  }

  obtenerUsuariosDisponibles(){
    this.usuariosDisponibles.push(this.authenticationService.usuarios[1]);
    console.log(this.usuariosDisponibles);
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

  seleccionarArchivosRespuesta(event: any) {
    const seleccionados = event.target.files as FileList;
    const tiposPermitidos = ['application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/pdf', 'text/plain'];
    const maxSizeInBytes = 5 * 1024 * 1024;
    const archivosValidos: Archivo[] = [];

    Array.from(seleccionados).forEach((file: File) => {
      const esTipoPermitido = tiposPermitidos.includes(file.type);
      const esTamañoPermitido = file.size <= maxSizeInBytes;

      if (!esTipoPermitido) {

        this.alertatipo = "error";
        this.alertaMensaje = `El archivo "${file.name}" no es de un tipo permitido. Solo se permiten .docx, .pdf, y .txt`;
        this.alertaVisible = true;
        setTimeout(() => {
          this.alertaVisible = false;
        }, 3000);
      }

      if (!esTamañoPermitido) {
        this.alertatipo = "error";
        this.alertaMensaje = `El archivo "${file.name}" excede el tamaño máximo de 5 MB`;
        this.alertaVisible = true;
        setTimeout(() => {
          this.alertaVisible = false;
        }, 3000);
      }

      if (esTipoPermitido && esTamañoPermitido) {
        archivosValidos.push({
          nombre: file.name,
          file: file,
          tipo: file.type,
          tamaño: file.size
        });
      }
    });

    this.archivosRespuesta = [...this.archivosRespuesta, ...archivosValidos];

    event.target.value = '';
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

  quitarArchivoRespuesta(archivo: any) {
    const index = this.archivosRespuesta.indexOf(archivo);

    if (index > -1) {
      this.archivosRespuesta.splice(index, 1);
    }
  }

  actualizarEstadoAnalizado(): void {
    this.analisisTelefonicoService.ActualizarEstadoAnalizadoSolicitudAnalisis(
      this.idSolicitudAnalisisSeleccionada,
      this.usuario.idUsuario,
      this.observacion || null
    ).subscribe(response => {
      console.log('Estado actualizado:', response);
    }, error => {
      console.error('Error al actualizar el estado:', error);
    });
  }

  abriModalConfirmarTramitado() {
    this.modalTramitadoVisible = true;
  }

  cerrarModalConfirmarTramiado() {
    this.observacion = '';
    this.modalTramitadoVisible = false;
  }

  volverABandeja() {
    this.router.navigate(['bandeja-analista']);
  }

  tramitarSolicitudAnalisis() {
    this.actualizarEstadoAnalizado();
    this.subirArchivosRespuesta();

    this.alertatipo1 = "satisfaccion";
    this.alertaMensaje1 = "Se respondio correctamente la solicitud de analisis";
    this.alertaVisible1 = true;
    setTimeout(() => {
      this.alertaVisible = false;
    }, 3000);
    this.volverABandeja();
  }

}
