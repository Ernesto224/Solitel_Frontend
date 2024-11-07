import { Component, OnInit  } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-detalle-solicitud-analista',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './detalle-solicitud-analista.component.html',
  styleUrl: './detalle-solicitud-analista.component.css'
})
export default class DetalleSolicitudAnalistaComponent implements OnInit{

  idSolicitudAnalisisSeleccionada: number = 0;

  tablaVisible: number = 0;

  modalVisible: boolean = false;

  archivos: File[] = [];

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.idSolicitudAnalisisSeleccionada = Number(this.route.snapshot.paramMap.get('id'));
    console.log(this.idSolicitudAnalisisSeleccionada);
  }


  obtenerDetalleRegistro(id: number) {
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
    const seleccionados = event.target.files;
    this.archivos = Array.from(seleccionados); // Convierte la selección en un array de archivos
  }

  subirArchivos() {
    if (this.archivos.length > 0) {
      console.log('Archivos para subir:', this.archivos);
      // Aquí puedes implementar la lógica para enviar los archivos a un servidor o API
      alert('Archivos subidos correctamente');
    } else {
      alert('Por favor, selecciona archivos antes de subir');
    }
  }

  

}
