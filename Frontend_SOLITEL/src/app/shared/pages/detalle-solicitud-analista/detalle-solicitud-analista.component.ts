import { Component, OnInit  } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OficinaService } from '../../services/oficina.service';
import { ArchivoService } from '../../services/archivo.service';
import { AnalisisTelefonicoService } from '../../services/analisis-telefonico.service';


@Component({
  selector: 'app-detalle-solicitud-analista',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './detalle-solicitud-analista.component.html',
  styleUrl: './detalle-solicitud-analista.component.css'
})
export default class DetalleSolicitudAnalistaComponent implements OnInit{

  idSolicitudAnalisisSeleccionada: number = 0;

  solicitudAnalisisSeleccionada: any;

  solicitudesProveedorAsociadas: string = '';

  oficinaSolicitante: any;

  tablaVisible: number = 0;

  modalVisible: boolean = false;

  archivos: any[] = [];

  archivosRespuesta: any[] = [];

  constructor(private route: ActivatedRoute, 
              private location: Location,
              private oficinaService: OficinaService,
              private archivoService: ArchivoService,
              private analisisTelefonicoService: AnalisisTelefonicoService) {}

  ngOnInit(): void {
    this.idSolicitudAnalisisSeleccionada = Number(this.route.snapshot.paramMap.get('id'));
    this.solicitudAnalisisSeleccionada = history.state?.objeto;
    this.solicitudesProveedorAsociadas = this.solicitudAnalisisSeleccionada.solicitudesProveedor.map((num: { idSolicitudProveedor: any; }) => num.idSolicitudProveedor).join(', ');
    this.consultarOficina(this.solicitudAnalisisSeleccionada.idOficina);
    this.cargarArchivos(this.idSolicitudAnalisisSeleccionada);
  }

  mostrarTabla(tablaId: number) {
    this.tablaVisible = tablaId;
  }

  abrirModal() {
    this.modalVisible = true;
  }

  cerrarModal() {
    this.modalVisible = false;
  }

  seleccionarArchivos(event: any) {
    const seleccionados = event.target.files as FileList; // Aseguramos que seleccionados es de tipo FileList
    
    this.archivosRespuesta = Array.from(seleccionados).map((file: File) => {
      return {
        nombre: file.name,  // Nombre del archivo
        file: file,         // El archivo como tal
        tipo: file.type,    // Tipo de archivo
        tamaño: file.size   // Tamaño del archivo
      };
    });
  }

  subirArchivos() {
    if (this.archivosRespuesta.length > 0) {
      this.archivosRespuesta.forEach((archivo: any) => {
        const formData = new FormData();
        formData.append('Nombre', archivo.nombre); 
        formData.append('file', archivo.file); 
        formData.append('FormatoAchivo', archivo.tipo); 
        formData.append('FechaModificacion', new Date().toISOString()); 
        formData.append('idSolicitudAnalisis', "33"); 
        
        this.archivoService.insertarArchivoRespuestaSolicitudAnalisis(formData).subscribe({
          next: response => {
            console.log('Archivo guardado con éxito:', archivo.nombre);
          },
          error: err => {
            console.error('Error al guardar el archivo:', archivo.nombre, err);
          }
        });
      });
    } else {
      alert('Por favor, selecciona archivos antes de subir');
    }
  }

  cargarArchivos(idSolicitudAnalisis: number): void {
    this.archivoService.obtenerArchivosDeSolicitudAnalisis(idSolicitudAnalisis).subscribe((archivos: any[]) => {
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

  quitarArchivos(){
    this.archivosRespuesta = [];
    this.cerrarModal();
  }

  consultarOficina(idOficina: number){
    this.oficinaService.obtenerUna(idOficina).subscribe(data => {
      this.oficinaSolicitante = data.nombre;
    });
  }

  actualizarEstadoAnalizado(): void {
    const observacion = prompt('Ingrese su observación:');
    this.analisisTelefonicoService.ActualizarEstadoAnalizadoSolicitudAnalisis(
      this.idSolicitudAnalisisSeleccionada,
      1, // Asumiendo que idUsuario es 1
      observacion || null // Enviar null si no hay observación
    ).subscribe(response => {
      console.log('Estado actualizado:', response);
    }, error => {
      console.error('Error al actualizar el estado:', error);
    });
  }

  tramitarSolicitudAnalisis(){
    this.subirArchivos();
    this.actualizarEstadoAnalizado();
  }

}
