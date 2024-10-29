import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { AnalisisTelefonicoService, Archivo } from '../../services/analisis-telefonico.service';

interface Requerimiento {
  TN_IdRequerimento: number;
  TC_TipoObjetivo: string;
  TC_Objetivo: string;
  TC_UtilizadoPor: string;
  TC_Condicion: string;
}

@Component({
  selector: 'app-analisis-telefonico',
  templateUrl: './analisis-telefonico.component.html',
  styleUrls: ['./analisis-telefonico.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, NgMultiSelectDropDownModule],
})
export default class AnalisisTelefonicoComponent implements OnInit {
  solicitudAnalisisId: number = 1;
  requerimientos: Requerimiento[] = [];
  oficinasAnalisis: any[] = [];
  numerosUnicos: number[] = [];
  objetivosAnalista: any[] = [];
  operadoras: any[] = [];
  dropdownSettingsSolicitudes: any = {};
  dropdownSettingsArchivos: any = {};
  dropdownSettingsObjetivos: any = {};
  dropdownSettings: any = {};
  operadoraSeleccionada: any[] = [];
  numeroUnico: number | null = null;
  solicitudesProveedorSeleccionadas: any[] = [];
  archivosAnalizarSeleccionados: Archivo[] = [];
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
  solicitudesProveedor: any[] = [];
  archivos: Archivo[] = [];
  idObjetivoAnalisis: number = -1;
  condicionesAnalisis: any[] = [];
  tiposAnalisis: any[] = [];

  private subscription = new Subscription();

  constructor(
    private analisisService: AnalisisTelefonicoService,
  ) { }

  ngOnInit(): void {
    this.cargarNumerosUnicos();
    this.cargarOficinasAnalisis();
    this.cargarObjetivosAnalisis();
    this.inicializarDropdownSettings();
    this.obtenerCondiciones();
    this.obtenerTipoAnalisis();
  }

  cargarSolicitudesPorNumeroUnico(numeroUnico: string): void {
    this.subscription.add(
      this.analisisService.obtenerSolicitudesPorNumeroUnico(numeroUnico).subscribe(
        (solicitudes) => {
          this.solicitudesProveedor = solicitudes;
          console.log("Solicitudes Proveedor");
        },
        (error) => console.error('Error al cargar solicitudes:', error)
      )

    );
  }

  inicializarDropdownSettings(): void {
    this.dropdownSettingsSolicitudes = {
      singleSelection: false,
      idField: 'idSolicitudProveedor',
      textField: 'nombreProveedor',
      selectAllText: 'Seleccionar todos',
      unSelectAllText: 'Deseleccionar todos',
      itemsShowLimit: 3,
      allowSearchFilter: true,
    };
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'idProveedor',
      textField: 'nombre',
      selectAllText: 'Seleccionar Todo',
      unSelectAllText: 'Deseleccionar Todo',
      itemsShowLimit: 3,
      allowSearchFilter: true,
    };
    this.dropdownSettingsArchivos = {
      singleSelection: false,
      idField: 'idArchivo',
      textField: 'nombreArchivo',
      selectAllText: 'Seleccionar todos',
      unSelectAllText: 'Deseleccionar todos',
      itemsShowLimit: 3,
      allowSearchFilter: true,
    };
    this.dropdownSettingsObjetivos = {
      singleSelection: false,
      idField: 'tN_IdObjetivoAnalisis',
      textField: 'tC_Nombre',
      selectAllText: 'Seleccionar todos',
      unSelectAllText: 'Deseleccionar todos',
      itemsShowLimit: 3,
      allowSearchFilter: true,
    };
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
      this.analisisService.obtenerObjetivosAnalisis(this.idObjetivoAnalisis).subscribe(
        (objetivos) => {
          console.log("Objetivos recibidos:", objetivos); // Verifica la respuesta
          this.objetivosAnalista = objetivos; // Asigna los datos a la propiedad
          this.archivos = [
            { idArchivo: 1, nombreArchivo: 'Archivo 1' },
            { idArchivo: 2, nombreArchivo: 'Archivo 2' },
            { idArchivo: 3, nombreArchivo: 'Archivo 3' },
          ];
        },
        (error) => console.error('Error al cargar objetivos de análisis:', error)
      )
    );
  }

  agregarRequerimiento(): void {
    const nuevoRequerimiento: Requerimiento = {
      TN_IdRequerimento: this.requerimientos.length + 1,
      TC_TipoObjetivo: this.tipoObjetivo,
      TC_Objetivo: this.objetivo,
      TC_UtilizadoPor: this.utilizadoPor,
      TC_Condicion: this.condicion,
    };

    if (this.selectedIndex !== null && this.selectedIndex >= 0) {
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
    if (index >= 0 && index < this.requerimientos.length) {
      const requerimiento = this.requerimientos[index];
      this.selectedIndex = index;
      this.tipoObjetivo = requerimiento.TC_TipoObjetivo;
      this.objetivo = requerimiento.TC_Objetivo;
      this.utilizadoPor = requerimiento.TC_UtilizadoPor;
      this.condicion = requerimiento.TC_Condicion;
    }
  }

  eliminarRequerimiento(index: number): void {
    if (index >= 0 && index < this.requerimientos.length) {
      this.requerimientos.splice(index, 1);
      this.limpiarCamposRequerimiento();
    }
  }

  enviarSolicitud(): void {
    if (!this.numeroUnico || !this.oficinaAnalisis || !this.fechaHecho || this.requerimientos.length === 0) {
      alert('Por favor, complete todos los campos requeridos.');
      return;
    }

    const solicitudCompleta = {
      TF_FechaDelHecho: new Date(this.fechaHecho),
      TC_OtrosDetalles: this.otrosDetalles,
      TC_OtrosObjetivosDeAnalisis: this.otrosObjetivos,
      TB_Aprobado: false,
      TN_NumeroSolicitud: this.numeroUnico!,
      TN_IdOficina: Number(this.oficinaAnalisis),
      requerimentos: this.requerimientos,
      objetivosAnalisis: this.objetivosAnalisisSeleccionados.map(objetivo => ({
        IdObjetivoAnalisis: objetivo.tN_IdObjetivoAnalisis,
      })),
      solicitudesProveedor: this.solicitudesProveedorSeleccionadas.map(solicitud => ({
        IdSolicitud: solicitud.idSolicitudProveedor,
      })),
      condiciones: this.requerimientos.map(requerimiento => ({
        IdCondicion: this.condicionesAnalisis.find(cond => cond.nombre === requerimiento.TC_Condicion)?.idCondicion,
      })),
      archivos: this.archivosAnalizarSeleccionados.map(archivo => ({
        IdArchivo: archivo.idArchivo,
        NombreArchivo: archivo.nombreArchivo,
      }))
    };
    console.log(solicitudCompleta)

    this.analisisService.agregarSolicitudAnalisis(solicitudCompleta).subscribe(
      (response) => {
        console.log('Solicitud enviada con éxito:', response);
        this.limpiarFormulario();
      },
      (error) => console.error('Error al enviar la solicitud:', error)
    );
  }

  obtenerCondiciones(): void {
    this.analisisService.obtenerCondiciones().subscribe(
      (condiciones) => {
        console.log("Condiciones recibidas:", condiciones); // Verifica la respuesta
        this.condicionesAnalisis = condiciones;
      },
      (error) => console.error('Error al cargar condiciones de análisis:', error)
    );
  }

  obtenerTipoAnalisis(): void {
    this.analisisService.obtenerTipoAnalisis().subscribe(
      (tipos) => {
        console.log("Tipos recibidos:", tipos); // Verifica la respuesta
        this.tiposAnalisis = tipos;
      },
      (error) => console.error('Error al cargar tipos de análisis:', error)
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
