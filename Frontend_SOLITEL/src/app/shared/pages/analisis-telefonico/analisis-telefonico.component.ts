import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { AnalisisTelefonicoService, Archivo } from '../../services/analisis-telefonico.service';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';

interface Requerimiento {
  idRequerimiento: number;
  tipoObjetivo: string;
  objetivo: string;
  utilizadoPor: string;
  condicion: string;
}

interface SolicitudProveedor {
  idSolicitudProveedor: number;
  numeroUnico: string;
  numeroCaso: string;
  imputado: string;
  ofendido: string;
  resenna: string;
  urgente: boolean;
  requerimientos: RequerimientoProveedor[];
  operadoras: Operadora[];
  usuarioCreador: Usuario;
  delito: Delito;
  categoriaDelito: CategoriaDelito;
  estado: Estado;
  fiscalia: Fiscalia;
  oficina: Oficina;
  modalidad: Modalidad;
  subModalidad: SubModalidad;
}

interface RequerimientoProveedor {
  idRequerimientoProveedor: number;
  fechaInicio: string;
  fechaFinal: string;
  requerimiento: string;
  tipoSolicitudes: TipoSolicitud[];
  datosRequeridos: DatoRequerido[];
}

interface TipoSolicitud {
  idTipoSolicitud: number;
  nombre: string;
  descripcion: string;
}

interface DatoRequerido {
  idDatoRequerido: number;
  datoRequerido: string;
  motivacion: string;
  idTipoDato: number;
}

interface Operadora {
  idProveedor: number;
  nombre: string;
}

interface Usuario {
  idUsuario: number;
  nombre: string;
  apellido: string;
  usuario: string;
  correoElectronico: string;
}

interface Delito {
  idDelito: number;
  nombre: string;
  descripcion: string;
  idCategoriaDelito: number;
}

interface CategoriaDelito {
  idCategoriaDelito: number;
  nombre: string;
  descripcion: string;
}

interface Estado {
  idEstado: number;
  nombre: string;
  descripcion: string;
  tipo: string;
}

interface Fiscalia {
  idFiscalia: number;
  nombre: string;
}

interface Oficina {
  idOficina: number;
  nombre: string;
  tipo: string;
}

interface Modalidad {
  idModalidad: number;
  nombre: string;
  descripcion: string;
}

interface SubModalidad {
  idSubModalidad: number;
  nombre: string;
  descripcion: string;
  idModalidad: number;
}

@Component({
  selector: 'app-analisis-telefonico',
  templateUrl: './analisis-telefonico.component.html',
  styleUrls: ['./analisis-telefonico.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, NgMultiSelectDropDownModule, NgxMaskDirective],
  providers: [provideNgxMask()]
})
export default class AnalisisTelefonicoComponent implements OnInit, OnDestroy {
  solicitudAnalisisId: number = 1;
  requerimientos: Requerimiento[] = [];
  oficinasAnalisis: any[] = [];
  numerosUnicos: number[] = [];
  objetivosAnalista: any[] = [];
  operadoras: Operadora[] = [];
  dropdownSettingsSolicitudes: any = {};
  dropdownSettingsArchivos: any = {};
  dropdownSettingsObjetivos: any = {};
  dropdownSettings: any = {};
  operadoraSeleccionada: any[] = [];
  numeroUnico: number | null = null;
  solicitudesProveedorSeleccionadas: SolicitudProveedor[] = [];
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
  condicionAnalisisEscogida: string = '';

  private subscription = new Subscription();

  constructor(private analisisService: AnalisisTelefonicoService) { }

  ngOnInit(): void {
    this.cargarNumerosUnicos();
    this.cargarOficinasAnalisis();
    this.cargarObjetivosAnalisis();
    this.inicializarDropdownSettings();
    this.obtenerCondiciones();
    this.obtenerTipoAnalisis();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  cargarSolicitudesPorNumeroUnico(numeroUnico: string): void {
    this.subscription.add(
      this.analisisService.obtenerSolicitudesPorNumeroUnico(numeroUnico).subscribe(
        (solicitudes) => {
          this.solicitudesProveedor = solicitudes;
          console.log("Solicitudes Proveedor cargadas");
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
      idField: 'idObjetivoAnalisis',
      textField: 'nombre',
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
          console.log("Objetivos recibidos:", objetivos);
          this.objetivosAnalista = objetivos;
          this.archivos = [
            { idArchivo: 1, nombreArchivo: 'Archivo 1', formatoArchivo: '.pdf' },
            { idArchivo: 2, nombreArchivo: 'Archivo 2', formatoArchivo: '.exe' },
            { idArchivo: 3, nombreArchivo: 'Archivo 3', formatoArchivo: '.doc' },
          ];
        },
        (error) => console.error('Error al cargar objetivos de análisis:', error)
      )
    );
  }

  agregarRequerimiento(): void {
    const nuevoRequerimiento: Requerimiento = {
      idRequerimiento: this.requerimientos.length + 1,
      tipoObjetivo: this.tipoObjetivo,
      objetivo: this.objetivo,
      utilizadoPor: this.utilizadoPor,
      condicion: this.condicionAnalisisEscogida,
    };

    if (this.selectedIndex !== null && this.selectedIndex >= 0) {
      this.requerimientos[this.selectedIndex] = { ...nuevoRequerimiento };
      this.selectedIndex = null;
    } else {
      this.requerimientos.push(nuevoRequerimiento);
    }
    this.limpiarCamposRequerimiento();
  }

  obtenerArchivosSolicitudProveedor(): void {
    this.analisisService.obtenerArchivosSolicitudProveedor(1).subscribe(
      (archivos) => {
        console.log("Archivos recibidos:", archivos);
        this.archivos = archivos;
      },
      (error) => console.error('Error al cargar archivos de la solicitud:', error)
    );
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
      this.tipoObjetivo = requerimiento.tipoObjetivo;
      this.objetivo = requerimiento.objetivo;
      this.utilizadoPor = requerimiento.utilizadoPor;
      this.condicion = requerimiento.condicion;
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
      idSolicitudAnalisis: 0,
      fechaDelHecho: new Date(this.fechaHecho).toISOString(),
      otrosDetalles: this.otrosDetalles || "Detalles no proporcionados",
      otrosObjetivosDeAnalisis: this.otrosObjetivos || "Objetivos adicionales no especificados",
      aprobado: false,
      fechaCrecion: new Date().toISOString(),
      numeroSolicitud: this.numeroUnico,
      idOficina: this.oficinaAnalisis,

      requerimientos: this.requerimientos.map((req) => ({
        idRequerimientoAnalisis: 0,
        objetivo: req.objetivo || "Objetivo no especificado",
        utilizadoPor: req.utilizadoPor || "Utilizado por no especificado",
        idTipo: 0,
        idAnalisis: req.idRequerimiento || 0
      })),
    };

    console.log("Solicitud JSON enviada:", JSON.stringify(solicitudCompleta));

    this.analisisService.agregarSolicitudAnalisis(solicitudCompleta).subscribe(
      (response) => {
        console.log('Solicitud enviada con éxito:', response);
        this.limpiarFormulario();
      },
      (error) => console.error('Error al enviar la solicitud:', error.error)
    );
  }

  obtenerCondiciones(): void {
    this.analisisService.obtenerCondiciones().subscribe(
      (condiciones) => {
        console.log("Condiciones recibidas:", condiciones);
        this.condicionesAnalisis = condiciones;
      },
      (error) => console.error('Error al cargar condiciones de análisis:', error)
    );
  }

  obtenerTipoAnalisis(): void {
    this.analisisService.obtenerTipoAnalisis().subscribe(
      (tipos) => {
        console.log("Tipos recibidos:", tipos);
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
  validarOtrosDetalles(): boolean {
    const regex = /^[a-zA-Z0-9\s.,;:!?()-]+$/;
    return regex.test(this.otrosDetalles) && this.otrosDetalles.length >= 20;
  }

  // Validación para el campo "Objetivo" (debe contener solo números, exactamente 8 caracteres)
  validarObjetivo(): boolean {
    const regex = /^\d{8}$/; // 8 dígitos numéricos
    return regex.test(this.objetivo);
  }

  // Validación para el campo "Utilizado por" (letras y espacios, mínimo 20 caracteres)
  validarUtilizadoPor(): boolean {
    const regex = /^[a-zA-Z\s]+$/;
    return regex.test(this.utilizadoPor) && this.utilizadoPor.length >= 20;
  }
}
