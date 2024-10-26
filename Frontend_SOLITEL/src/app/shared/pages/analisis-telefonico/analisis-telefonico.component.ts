import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import {
  AnalisisTelefonicoService,
  SolicitudProveedor,
  OficinaAnalisis,
  RequerimentoAnalisis,
  SolicitudAnalisis,
  ObjetivoAnalisis,
  Archivo
} from '../../services/analisis-telefonico.service';

@Component({
  selector: 'app-analisis-telefonico',
  templateUrl: './analisis-telefonico.component.html',
  styleUrls: ['./analisis-telefonico.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, NgMultiSelectDropDownModule],
})
export default class AnalisisTelefonicoComponent implements OnInit, OnDestroy {
  solicitudAnalisisId: number = 1;
  requerimientos: RequerimentoAnalisis[] = [];
  solicitudesProveedor: SolicitudProveedor[] = [];
  oficinasAnalisis: OficinaAnalisis[] = [];
  numerosUnicos: number[] = [];
  objetivosAnalista: ObjetivoAnalisis[] = [];
  numeroUnico: number | null = null;
  solicitudesProveedorSeleccionadas: any[] = [];
  archivosAnalizarSeleccionados: any[] = [];
  objetivosAnalisisSeleccionados: any[] = [];
  oficinaAnalisis: number | null = null;
  tipoAnalisis: string = 'Análisis Telefónico';
  fechaHecho: string = '';
  otrosObjetivos: string = '';
  otrosDetalles: string = '';
  tipoObjetivo: string = '';
  objetivo: string = '';
  utilizadoPor: string = '';
  condicion: string = '';
  selectedIndex: number | null = null;
  archivos: Archivo[] = [
    { idArchivo: 1, nombreArchivo: 'Archivo 1' },
    { idArchivo: 2, nombreArchivo: 'Archivo 2' },
    { idArchivo: 3, nombreArchivo: 'Archivo 3' }
  ];

  dropdownSettingsSolicitudes = {
    singleSelection: false,
    idField: 'idSolicitudProveedor',
    textField: 'nombreProveedor',
    selectAllText: 'Seleccionar todos',
    unSelectAllText: 'Deseleccionar todos',
    itemsShowLimit: 3,
    allowSearchFilter: true
  };

  dropdownSettingsArchivos = {
    singleSelection: false,
    idField: 'idArchivo',
    textField: 'nombreArchivo',
    selectAllText: 'Seleccionar todos',
    unSelectAllText: 'Deseleccionar todos',
    itemsShowLimit: 3,
    allowSearchFilter: true
  };

  dropdownSettingsObjetivos = {
    singleSelection: false,
    idField: 'idObjetivo',
    textField: 'TC_Nombre',
    selectAllText: 'Seleccionar todos',
    unSelectAllText: 'Deseleccionar todos',
    itemsShowLimit: 3,
    allowSearchFilter: true
  };

  private subscription = new Subscription();

  constructor(private analisisService: AnalisisTelefonicoService) {}

  ngOnInit(): void {
    this.cargarNumerosUnicos();
    this.cargarOficinasAnalisis();
    this.cargarObjetivosAnalisis();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  cargarNumerosUnicos(): void {
    this.subscription.add(
      this.analisisService.obtenerNumerosUnicos().subscribe(
        (numeros) => (this.numerosUnicos = numeros),
        (error) => console.error('Error al cargar números únicos:', error)
      )
    );
  }

  cargarOficinasAnalisis(): void {
    this.subscription.add(
      this.analisisService.obtenerOficinasAnalisis().subscribe(
        (oficinas) => (this.oficinasAnalisis = oficinas),
        (error) => console.error('Error al cargar oficinas de análisis:', error)
      )
    );
  }

  cargarObjetivosAnalisis(): void {
    this.subscription.add(
      this.analisisService.obtenerObjetivosAnalisis().subscribe(
        (objetivos) => (this.objetivosAnalista = objetivos),
        (error) => console.error('Error al cargar objetivos de análisis:', error)
      )
    );
  }

  agregarRequerimiento(): void {
    const nuevoRequerimiento: RequerimentoAnalisis = {
      TN_IdRequerimento: this.requerimientos.length + 1,
      TC_TipoObjetivo: this.tipoObjetivo,
      TC_Objetivo: this.objetivo,
      TC_UtilizadoPor: this.utilizadoPor,
      TC_Condicion: this.condicion,
    };

    if (this.selectedIndex !== null) {
      this.requerimientos[this.selectedIndex] = { ...nuevoRequerimiento };
      this.selectedIndex = null;
    } else {
      this.requerimientos.push(nuevoRequerimiento);
    }
    this.limpiarCamposRequerimiento();
  }

  limpiarCamposRequerimiento(): void {
    this.tipoObjetivo = '';
    this.objetivo = '';
    this.utilizadoPor = '';
    this.condicion = '';
  }

  cargarRequerimientoEnFormulario(index: number): void {
    if (index !== null && index >= 0 && index < this.requerimientos.length) {
      const requerimiento = this.requerimientos[index];
      this.selectedIndex = index;
      this.tipoObjetivo = requerimiento.TC_TipoObjetivo;
      this.objetivo = requerimiento.TC_Objetivo;
      this.utilizadoPor = requerimiento.TC_UtilizadoPor;
      this.condicion = requerimiento.TC_Condicion;
    }
  }

  eliminarRequerimiento(index: number): void {
    if (index !== null && index >= 0 && index < this.requerimientos.length) {
      this.requerimientos.splice(index, 1);
      this.limpiarFormulario();
    }
  }

  enviarSolicitud(): void {
    if (!this.numeroUnico || !this.oficinaAnalisis || !this.fechaHecho || this.requerimientos.length === 0) {
      alert('Por favor, complete todos los campos requeridos.');
      return;
    }

    const solicitudCompleta: SolicitudAnalisis = {
      TN_IdSolicitudAnalisis: this.solicitudAnalisisId,
      TF_FechaDelHecho: new Date(this.fechaHecho),
      TC_OtrosDetalles: this.otrosDetalles,
      TC_OtrosObjetivosDeAnalisis: this.otrosObjetivos,
      TB_Aprobado: false,
      TN_NumeroSolicitud: this.numeroUnico!,
      TN_IdOficina: Number(this.oficinaAnalisis),
      requerimentos: this.requerimientos,
    };

    this.analisisService.agregarSolicitudAnalisis(solicitudCompleta).subscribe(
      (response) => {
        console.log('Solicitud enviada con éxito:', response);
        this.limpiarFormulario();
      },
      (error) => console.error('Error al enviar la solicitud:', error)
    );
  }

  limpiarFormulario(): void {
    this.numeroUnico = null;
    this.solicitudesProveedorSeleccionadas = [];
    this.archivosAnalizarSeleccionados = [];
    this.objetivosAnalisisSeleccionados = [];
    this.oficinaAnalisis = null;
    this.tipoAnalisis = 'Análisis Telefónico';
    this.fechaHecho = '';
    this.otrosObjetivos = '';
    this.otrosDetalles = '';
    this.limpiarCamposRequerimiento();
  }
}
