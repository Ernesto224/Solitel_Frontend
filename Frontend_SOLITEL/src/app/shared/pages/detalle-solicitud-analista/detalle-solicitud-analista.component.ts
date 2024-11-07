import { Component, OnInit  } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OficinaService } from '../../services/oficina.service';
import { ArchivoService } from '../../services/archivo.service';
import { AnalisisTelefonicoService } from '../../services/analisis-telefonico.service';
import { Router } from '@angular/router';



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
              private analisisTelefonicoService: AnalisisTelefonicoService,
              private router: Router) {}

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

  subirArchivos() {
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
      1, // Usuario Quemado en DB
      observacion || null
    ).subscribe(response => {
      console.log('Estado actualizado:', response);
    }, error => {
      console.error('Error al actualizar el estado:', error);
    });
  }

  volverABandeja() {
    this.router.navigate(['bandeja-analista']);
  }

  tramitarSolicitudAnalisis(){
    this.actualizarEstadoAnalizado();
    this.subirArchivos();
    this.volverABandeja();

  }

}
