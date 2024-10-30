import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { AnalisisTelefonicoService, Archivo } from '../../services/analisis-telefonico.service';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
interface Requerimiento {
  TN_IdRequerimento: number;
  TC_TipoObjetivo: string;
  TC_Objetivo: string;
  TC_UtilizadoPor: string;
  TC_Condicion: string;
}

interface SolicitudProveedor {
  idSolicitudProveedor: number;
  numeroUnico: string;
  numeroCaso: string;
  imputado: string;
  ofendido: string;
  resennia: string;
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
  tN_IdRequerimientoProveedor: number;
  tF_FechaInicio: string;
  tF_FechaFinal: string;
  tC_Requerimiento: string;
  tipoSolicitudes: TipoSolicitud[];
  datosRequeridos: DatoRequerido[];
}

interface TipoSolicitud {
  idTipoSolicitud: number;
  nombre: string;
  descripcion: string;
}

interface DatoRequerido {
  tN_IdDatoRequerido: number;
  tC_DatoRequerido: string;
  tC_Motivacion: string;
  tN_IdTipoDato: number;
}

interface Operadora {
  idProveedor: number;
  nombre: string;
}

interface Usuario {
  tN_IdUsuario: number;
  tC_Nombre: string;
  tC_Apellido: string;
  tC_Usuario: string;
  tC_CorreoElectronico: string;
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
  tN_IdEstado: number;
  tC_Nombre: string;
  tC_Descripcion: string;
  tC_Tipo: string;
}

interface Fiscalia {
  idFiscalia: number;
  nombre: string;
}

interface Oficina {
  tN_IdOficina: number;
  tC_Nombre: string;
  tC_Tipo: string;
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
  idModalida: number;
}

@Component({
  selector: 'app-analisis-telefonico',
  templateUrl: './analisis-telefonico.component.html',
  styleUrls: ['./analisis-telefonico.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, NgMultiSelectDropDownModule, NgxMaskDirective],
  providers:[provideNgxMask()]
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

  constructor(
    private analisisService: AnalisisTelefonicoService,
  ) {}

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
          console.log("Objetivos recibidos:", objetivos);
          this.objetivosAnalista = objetivos;
          this.archivos = [
            { idArchivo: 1, nombreArchivo: 'Archivo 1', TC_FormatoAchivo:'.pdf' },
            { idArchivo: 2, nombreArchivo: 'Archivo 2', TC_FormatoAchivo:'.exe'},
            { idArchivo: 3, nombreArchivo: 'Archivo 3' ,TC_FormatoAchivo:'.doc'},
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
      TC_Condicion: this.condicionAnalisisEscogida,
    };

    if (this.selectedIndex !== null && this.selectedIndex >= 0) {
      this.requerimientos[this.selectedIndex] = { ...nuevoRequerimiento };
      this.selectedIndex = null;
    } else {
      this.requerimientos.push(nuevoRequerimiento);
    }
    this.limpiarCamposRequerimiento();
  }

  obtenerArchivosSolicitudProveedor(): void{
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
    // Verificación de campos requeridos
    if (!this.numeroUnico || !this.oficinaAnalisis || !this.fechaHecho || this.requerimientos.length === 0) {
        alert('Por favor, complete todos los campos requeridos.');
        return;
    }

    // Conversión de número único a número
    const numeroSolicitud = typeof this.numeroUnico === 'string' ? parseInt(this.numeroUnico, 10) : this.numeroUnico;

    const solicitudCompleta = {
        tN_IdSolicitudAnalisis: 0,
        tF_FechaDelHecho: new Date(this.fechaHecho).toISOString(),
        tC_OtrosDetalles: this.otrosDetalles || "Detalles no proporcionados",
        tC_OtrosObjetivosDeAnalisis: this.otrosObjetivos || "Objetivos adicionales no especificados",
        tB_Aprobado: false,
        tF_FechaCrecion: new Date().toISOString(),
        tN_NumeroSolicitud: numeroSolicitud || 0, // Verifica que sea un número
        tN_IdOficina: Number(this.oficinaAnalisis) || 0,

        // Requerimientos
        requerimentos: (this.requerimientos || []).map((requerimiento) => ({
            tN_IdRequerimientoAnalisis: 0,
            tC_Objetivo: requerimiento.TC_Objetivo || "Objetivo no especificado",
            tC_UtilizadoPor: requerimiento.TC_UtilizadoPor || "Utilizado por no especificado",
            tN_IdTipo: 0,
            tN_IdAnalisis: requerimiento.TN_IdRequerimento || 0
        })),

        // Objetivos de análisis
        objetivosAnalisis: (this.objetivosAnalisisSeleccionados || []).map((objetivo) => ({
            tN_IdObjetivoAnalisis: objetivo.tN_IdObjetivoAnalisis || 0,
            tC_Nombre: objetivo.tC_Nombre || "Nombre no especificado",
            tC_Descripcion: objetivo.tC_Descripcion || "Descripción no especificada"
        })),

        // Solicitudes de proveedor
        solicitudesProveedor: (this.solicitudesProveedorSeleccionadas || []).map((solicitud) => ({
            idSolicitudProveedor: solicitud.idSolicitudProveedor || 0,
            numeroUnico: solicitud.numeroUnico || "string",
            numeroCaso: solicitud.numeroCaso || "Caso no especificado",
            imputado: solicitud.imputado || "Imputado no especificado",
            ofendido: solicitud.ofendido || "Ofendido no especificado",
            resennia: solicitud.resennia || "Reseña no especificada",
            urgente: solicitud.urgente || false,
            requerimientos: (solicitud.requerimientos || []).map((requerimiento) => ({
                tN_IdRequerimientoProveedor: requerimiento.tN_IdRequerimientoProveedor || 0,
                tF_FechaInicio: requerimiento.tF_FechaInicio || new Date().toISOString(),
                tF_FechaFinal: requerimiento.tF_FechaFinal || new Date().toISOString(),
                tC_Requerimiento: requerimiento.tC_Requerimiento || "Requerimiento no especificado",
                tipoSolicitudes: (requerimiento.tipoSolicitudes || []).map((tipo) => ({
                    idTipoSolicitud: tipo.idTipoSolicitud || 0,
                    nombre: tipo.nombre || "Nombre no especificado",
                    descripcion: tipo.descripcion || "Descripción no especificada"
                })),
                datosRequeridos: (requerimiento.datosRequeridos || []).map((dato) => ({
                    tN_IdDatoRequerido: dato.tN_IdDatoRequerido || 0,
                    tC_DatoRequerido: dato.tC_DatoRequerido || "Dato requerido no especificado",
                    tC_Motivacion: dato.tC_Motivacion || "Motivación no especificada",
                    tN_IdTipoDato: dato.tN_IdTipoDato || 0
                }))
            })),

            operadoras: (solicitud.operadoras || []).map((operadora) => ({
                idProveedor: operadora.idProveedor || 0,
                nombre: operadora.nombre || "Proveedor no especificado"
            })),

            usuarioCreador: {
                tN_IdUsuario: solicitud.usuarioCreador?.tN_IdUsuario || 0,
                tC_Nombre: solicitud.usuarioCreador?.tC_Nombre || "Nombre no especificado",
                tC_Apellido: solicitud.usuarioCreador?.tC_Apellido || "Apellido no especificado",
                tC_Usuario: solicitud.usuarioCreador?.tC_Usuario || "Usuario no especificado",
                tC_CorreoElectronico: solicitud.usuarioCreador?.tC_CorreoElectronico || "Correo no especificado"
            },

            // Delito y detalles asociados
            delito: solicitud.delito || {
                idDelito: 0,
                nombre: "Delito no especificado",
                descripcion: "Descripción del delito",
                idCategoriaDelito: 0
            },
            categoriaDelito: solicitud.categoriaDelito || {
                idCategoriaDelito: 0,
                nombre: "Categoría no especificada",
                descripcion: "Descripción de la categoría"
            },
            estado: solicitud.estado || {
                tN_IdEstado: 1,
                tC_Nombre: "Estado no especificado",
                tC_Descripcion: "Descripción del estado",
                tC_Tipo: "Tipo no especificado"
            },
            fiscalia: solicitud.fiscalia || {
                idFiscalia: 0,
                nombre: "Fiscalía no especificada"
            },
            oficina: solicitud.oficina || {
                tN_IdOficina: 0,
                tC_Nombre: "Oficina no especificada",
                tC_Tipo: "Tipo de oficina no especificado"
            },
            modalidad: solicitud.modalidad || {
                idModalidad: 0,
                nombre: "Modalidad no especificada",
                descripcion: "Descripción de la modalidad"
            },
            subModalidad: solicitud.subModalidad || {
                idSubModalidad: 0,
                nombre: "Submodalidad no especificada",
                descripcion: "Descripción de la submodalidad",
                idModalida: 0
            }
        })),

        // Tipo de análisis y condiciones
        tipoAnalisis: (this.tiposAnalisis || []).map((tipo) => ({
            idTipoAnalisis: tipo.idTipoAnalisis || 0,
            nombre: tipo.nombre || "Tipo de análisis no especificado",
            descripcion: tipo.descripcion || "Descripción no especificada"
        })),
        condiciones: [
            {
                idCondicion: this.condicionesAnalisis.find(condicion => condicion.nombre === this.condicionAnalisisEscogida)?.idCondicion || 0,
                nombre: this.condicionAnalisisEscogida,
                descripcion: "Descripción de la condición seleccionada"
            }
        ],
        archivos: (this.archivosAnalizarSeleccionados || []).map((archivo) => ({
            tN_IdArchivo: archivo.idArchivo || 0,
            tC_Nombre: "Archivo no especificado",
            tV_Contenido: "",
            tC_FormatoAchivo: archivo.TC_FormatoAchivo || "Sin formato",
            tF_FechaModificacion: new Date().toISOString()
        }))
    };

    console.log("Solicitud JSON enviada:", JSON.stringify(solicitudCompleta));

    // Envío de la solicitud y manejo de errores
    this.analisisService.agregarSolicitudAnalisis(solicitudCompleta).subscribe(
        response => {
            console.log('Solicitud enviada con éxito:', response);
            this.limpiarFormulario();
        },
        error => console.error('Error al enviar la solicitud:', error.error)
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
  validarObjetivo(): boolean {
    const regex = /^[a-zA-Z\s]+$/;
    return regex.test(this.objetivo) && this.objetivo.length ==8 ;
  }

  // Validación para el campo "Utilizado Por" (letras y espacios, mínimo 20 caracteres)
  validarUtilizadoPor(): boolean {
    const regex = /^[a-zA-Z\s]+$/;
    return regex.test(this.utilizadoPor) && this.utilizadoPor.length >= 20;
  }

  // Validación para "Otros Detalles" (letras, números, signos de puntuación, mínimo 20 caracteres)
  validarOtrosDetalles(): boolean {
    const regex = /^[a-zA-Z0-9\s.,;:!?()\-]+$/;
    return regex.test(this.otrosDetalles) && this.otrosDetalles.length >= 20;
  }

  // Método general para verificar todas las validaciones
  validarCampos(): boolean {
    return this.validarObjetivo() && this.validarUtilizadoPor() && this.validarOtrosDetalles();
  }
}


