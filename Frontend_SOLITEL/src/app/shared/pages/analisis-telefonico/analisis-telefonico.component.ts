import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs'; // Aquí se añade la importación
import {
  AnalisisTelefonicoService,
  SolicitudProveedor,
  OficinaAnalisis,
  RequerimentoAnalisis,
  SolicitudAnalisis,
  ObjetivoAnalisis
} from '../../services/analisis-telefonico.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Asegúrate de incluir FormsModule

@Component({
  selector: 'app-analisis-telefonico',
  templateUrl: './analisis-telefonico.component.html',
  styleUrls: ['./analisis-telefonico.component.css'],
  standalone: true, // Marca este componente como standalone
  imports: [CommonModule, FormsModule], // Asegúrate de importar FormsModule y CommonModule
})
export default class AnalisisTelefonicoComponent implements OnInit, OnDestroy {
  solicitudAnalisisId: number = 1;
  requerimientos: RequerimentoAnalisis[] = [];
  solicitudesProveedor: SolicitudProveedor[] = [];
  oficinasAnalisis: OficinaAnalisis[] = [];
  numerosUnicos: number[] = [];
  objetivosAnalista: ObjetivoAnalisis[] = [];

  // Propiedades vinculadas con ngModel
  numeroUnico: number | null = null;
  solicitudesProveedorSeleccionadas: number[] = [];
  oficinaAnalisis: number | null = null; // Cambiado a number, no string
  tipoAnalisis: string = 'Análisis Telefónico';
  objetivosAnalisis: string = '';
  fechaHecho: string = ''; // Inicialmente como string, luego lo convertiremos a Date
  otrosObjetivos: string = '';
  otrosDetalles: string = '';
  tipoObjetivo: string = '';
  objetivo: string = '';
  utilizadoPor: string = '';
  condicion: string = '';

  // Nueva propiedad para manejar archivos a analizar
  archivosAnalizar: string = ''; // Si es solo un archivo seleccionado, utiliza string. Si es una lista, utiliza string[].

  selectedIndex: number | null = null;
  editMode: boolean = false;

  private subscription = new Subscription();

  constructor(private analisisService: AnalisisTelefonicoService) {}

  ngOnInit(): void {
    this.cargarNumerosUnicos();
    this.cargarOficinasAnalisis();

    // Cargar las solicitudes según el número único
    this.numeroUnicoChange();
  }

  numeroUnicoChange(): void {
    if (this.numeroUnico) {
      this.cargarSolicitudesPorNumeroUnico(this.numeroUnico);
    }
  }

  // Cargar los números únicos desde el servicio
  cargarNumerosUnicos(): void {
    this.analisisService.obtenerNumerosUnicos().subscribe(
      (numeros) => {
        this.numerosUnicos = numeros;
      },
      (error) => {
        console.error('Error al cargar números únicos:', error);
      }
    );
  }

  // Cargar oficinas de análisis desde el servicio
  cargarOficinasAnalisis(): void {
    this.analisisService.obtenerOficinasAnalisis().subscribe(
      (oficinas) => {
        this.oficinasAnalisis = oficinas;
      },
      (error) => {
        console.error('Error al cargar oficinas de análisis:', error);
      }
    );
  }

  // Cargar solicitudes vinculadas al número único seleccionado
  cargarSolicitudesPorNumeroUnico(numeroUnico: number): void {
    this.analisisService
      .obtenerSolicitudesPorNumeroUnico(numeroUnico)
      .subscribe(
        (solicitudes) => {
          this.solicitudesProveedor = solicitudes;
        },
        (error) => {
          console.error('Error al cargar solicitudes:', error);
        }
      );
  }

  // Método para agregar un nuevo requerimiento o actualizar uno existente
  agregarRequerimiento(): void {
    const nuevoRequerimiento: RequerimentoAnalisis = {
      TN_IdRequerimento: this.requerimientos.length + 1, // Generamos un ID automáticamente
      TC_TipoObjetivo: this.tipoObjetivo,
      TC_Objetivo: this.objetivo,
      TC_UtilizadoPor: this.utilizadoPor,
      TC_Condicion: this.condicion,
    };

    if (this.editMode && this.selectedIndex !== null) {
      // Actualizar el requerimiento existente
      this.requerimientos[this.selectedIndex] = { ...nuevoRequerimiento };
      this.editMode = false;
      this.selectedIndex = null;
    } else {
      // Agregar un nuevo requerimiento
      this.requerimientos.push(nuevoRequerimiento);
    }

    // Limpiar los campos del formulario de requerimientos
    this.limpiarCamposRequerimiento();
  }

  // Limpiar los campos del formulario de requerimientos
  limpiarCamposRequerimiento(): void {
    this.tipoObjetivo = '';
    this.objetivo = '';
    this.utilizadoPor = '';
    this.condicion = '';
  }

  // Cargar el requerimiento seleccionado en el formulario para edición
  cargarRequerimientoEnFormulario(index: number): void {
    if (index !== null && index >= 0 && index < this.requerimientos.length) {
      const requerimiento = this.requerimientos[index];
      this.selectedIndex = index;
      this.editMode = true;
      this.tipoObjetivo = requerimiento.TC_TipoObjetivo;
      this.objetivo = requerimiento.TC_Objetivo;
      this.utilizadoPor = requerimiento.TC_UtilizadoPor;
      this.condicion = requerimiento.TC_Condicion;
    }
  }

  // Eliminar un requerimiento
  eliminarRequerimiento(index: number): void {
    if (index !== null && index >= 0 && index < this.requerimientos.length) {
      this.requerimientos.splice(index, 1);
      this.limpiarFormulario();
    }
  }

  // Enviar la solicitud completa
  enviarSolicitud(): void {
    if (!this.numeroUnico || !this.oficinaAnalisis || !this.fechaHecho || this.requerimientos.length === 0) {
      alert('Por favor, complete todos los campos requeridos.');
      return; // Stop the submission process if any field is empty
    }
    const solicitudCompleta: SolicitudAnalisis = {
      TN_IdSolicitudAnalisis: this.solicitudAnalisisId,
      TF_FechaDelHecho: new Date(this.fechaHecho), // Convertir string a Date
      TC_OtrosDetalles: this.otrosDetalles,
      TC_OtrosObjetivosDeAnalisis: this.otrosObjetivos,
      TB_Aprobado: false, // Por defecto no aprobado
      TN_NumeroSolicitud: this.numeroUnico!,
      TN_IdOficina: Number(this.oficinaAnalisis), // Convertir string a number
      requerimentos: this.requerimientos,
    };
  }

  // Limpiar el formulario completo
  limpiarFormulario(): void {
    this.numeroUnico = null;
    this.solicitudesProveedorSeleccionadas = [];
    this.oficinaAnalisis = null;
    this.tipoAnalisis = 'Análisis Telefónico';
    this.objetivosAnalisis = '';
    this.fechaHecho = '';
    this.otrosObjetivos = '';
    this.otrosDetalles = '';
    this.limpiarCamposRequerimiento();
    this.editMode = false;
    this.selectedIndex = null;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
