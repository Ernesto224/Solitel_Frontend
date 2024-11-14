import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { AuthenticacionService } from '../../services/authenticacion.service';
import { AlertaComponent } from '../../components/alerta/alerta.component';
import {
  AnalisisTelefonicoService,
  Archivo,
  Condicion,
  TipoDato,
} from '../../services/analisis-telefonico.service';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';

interface Requerimiento {
  idRequerimientoAnalisis: number;
  objetivo: string;
  utilizadoPor: string;
  tipoDato: TipoDato;
  idAnalisis: number;
  condicion: Condicion;
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
  imports: [
    CommonModule,
    FormsModule,
    NgMultiSelectDropDownModule,
    NgxMaskDirective,
    AlertaComponent
  ],
  providers: [provideNgxMask()],
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
  tipoAnalisis: number = 0;
  fechaHecho: string = '';
  otrosObjetivos: string = '';
  otrosDetalles: string = '';
  objetivo: string = '';
  utilizadoPor: string = '';
  condicion: string = '';
  selectedIndex: number | null = null;
  solicitudesProveedor: any[] = [];
  archivos: Archivo[] = [];
  idObjetivoAnalisis: number = -1;
  condicionesAnalisis: Condicion[] = [];
  tiposAnalisis: any[] = [];
  condicionAnalisisEscogida: number = 0;
  idsSolicitudProveedarArchivo: number[] = [];
  solicitudCompletaAnalisis: any = null;
  TipoDatos: TipoDato[] = [];
  idTipoDatoSeleccionado: number = 0;
  usuarioActivo: any = null;
  alertatipo: string = "error";
  alertaMensaje: string = "";
  alertaVisible: boolean = false;
  editarRequerimiento: boolean = false;
  private subscription = new Subscription();

  // Control de modales
  mostrarConfirmacion = false;
  mostrarExito = false;

  // Usuario para obtener la oficina de creacion
  usuario: any = [];

  constructor(private analisisService: AnalisisTelefonicoService, private authService: AuthenticacionService) { }

  ngOnInit(): void {
    this.usuario = this.authService.getUsuario();
    this.cargarUsuarioEnSesion();
    this.cargarNumerosUnicos();
    this.cargarOficinasAnalisis();
    this.cargarObjetivosAnalisis();
    this.inicializarDropdownSettings();
    this.obtenerCondiciones();
    this.obtenerTipoAnalisis();
    this.cargarTiposDatos();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  mostrarConfirmacionModal() {
    this.mostrarConfirmacion = true;
  }

  confirmarGuardado() {
    this.mostrarConfirmacion = false;
    this.guardarSolicitudAnalisis();
  }

  cerrarModal() {
    this.mostrarConfirmacion = false;
    this.mostrarExito = false;
  }

  cargarSolicitudesPorNumeroUnico(numeroUnico: string): void {
    this.subscription.add(
      this.analisisService
        .obtenerSolicitudesPorNumeroUnico(numeroUnico, this.usuarioActivo)
        .subscribe(
          (solicitudes) => {
            this.solicitudesProveedor = solicitudes.map((solicitud) => ({
              ...solicitud,
              displayText: `${solicitud.idSolicitudProveedor} - ${solicitud.numeroUnico} - ${solicitud.nombreProveedor}`,
            }));
          },
          (error) => console.error('Error al cargar solicitudes:', error) // MOSTRAR MENSAJE POR ALERTA
        )
    );
  }

  inicializarDropdownSettings(): void {
    this.dropdownSettingsSolicitudes = {
      singleSelection: false,
      idField: 'idSolicitudProveedor',
      textField: 'displayText', // Muestra el valor combinado
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
      textField: 'nombreArchivo', // Mostrar el nombre combinado
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
        (error) => console.error('Error al cargar números únicos:', error) // MOSTRAR ERROR EN ALERTA
      )
    );
  }

  cargarOficinasAnalisis(): void {
    this.subscription.add(
      this.analisisService.obtenerOficinasAnalisis().subscribe(
        (oficinas) => (this.oficinasAnalisis = oficinas),
        (error) => console.error('Error al cargar oficinas de análisis:', error) // MOSTRAR ERROR EN ALERTA
      )
    );
  }

  cargarTiposDatos(): void {
    this.subscription.add(
      this.analisisService.ObtenerTiposDato().subscribe(
        (tipos) => (this.TipoDatos = tipos),
        (error) => console.error('Error al cargar tipos:', error) // MOSTRAR ERROR EN ALERTA
      )
    );
  }

  cargarUsuarioEnSesion() {
    this.usuarioActivo = this.authService.getUsuario();
  }

  obtenerArchivosSolicitudProveedor(): void {
    if (this.idsSolicitudProveedarArchivo.length > 0) {
      this.analisisService
        .obtenerArchivosSolicitudProveedor(this.idsSolicitudProveedarArchivo)
        .subscribe(
          (archivos) => {
            this.archivos = archivos.map((archivo) => ({
              ...archivo,
              nombreArchivo: `${archivo.nombre}.${archivo.formatoArchivo}`, // Concatenar el nombre y formato
            }));
          },
          (error) =>
            console.error('Error al cargar archivos de la solicitud:', error) // MOSTRAR ERROR EN ALERTA
        );
    } else {
      this.idsSolicitudProveedarArchivo = [];
      this.archivos = [];
    }
  }

  obtenerIdSolicitudProveedorArhivos(): void {
    this.idsSolicitudProveedarArchivo =
      this.solicitudesProveedorSeleccionadas.map(
        (solicitudes) => solicitudes.idSolicitudProveedor
      );
    this.obtenerArchivosSolicitudProveedor();
  }

  cargarObjetivosAnalisis(): void {
    this.subscription.add(
      this.analisisService
        .obtenerObjetivosAnalisis(this.idObjetivoAnalisis)
        .subscribe(
          (objetivos) => {
            this.objetivosAnalista = objetivos;
          },
          (error) =>
            console.error('Error al cargar objetivos de análisis:', error) // MOSTRAR ERROR EN ALERTA
        )
    );
  }

  agregarRequerimiento(): void {
    // Validar que todos los campos estén llenos y que los IDs no sean cero
    if (!this.objetivo || !this.utilizadoPor || this.idTipoDatoSeleccionado === 0 || this.condicionAnalisisEscogida === 0) {
      this.alertatipo = "error";
      this.alertaMensaje = "Debes llenar todos los campos de los requerimientos de análisis";
      this.mostrarAlerta();
      return;
    }
    const condicionSeleccionada =
      this.condicionesAnalisis.find(c => c.idCondicion === Number(this.condicionAnalisisEscogida));

    const tipoDatoSeleccionado = this.TipoDatos.find(tipo => tipo.idTipoDato === Number(this.idTipoDatoSeleccionado)) || {
      nombre: 'Tipo no especificado',
      descripcion: '',
    };
    const nuevoRequerimiento: Requerimiento = {
      idRequerimientoAnalisis: this.requerimientos.length + 1,
      objetivo: this.objetivo,
      utilizadoPor: this.utilizadoPor,
      tipoDato: {
        idTipoDato: 'idTipoDato' in tipoDatoSeleccionado ? tipoDatoSeleccionado.idTipoDato : this.idTipoDatoSeleccionado, // Verificación adicional
        nombre: tipoDatoSeleccionado.nombre,
        descripcion: tipoDatoSeleccionado.descripcion,
      },
      idAnalisis: this.requerimientos.length,
      condicion: condicionSeleccionada != null ? condicionSeleccionada : {
        idCondicion: 0,
        nombre: 'Nombre no especificado',
        descripcion: 'Descripción no especificada',
      },
    };

    this.requerimientos.push(nuevoRequerimiento);


    this.limpiarCamposRequerimiento();
  }

  editarRequerimientoAnalisis(): void {
    // Validar que todos los campos estén llenos y que los IDs no sean cero
    if (!this.objetivo || !this.utilizadoPor || this.idTipoDatoSeleccionado === 0 || this.condicionAnalisisEscogida === 0) {
      this.alertatipo = "error";
      this.alertaMensaje = "Debes llenar todos los campos de los requerimientos de análisis";
      this.mostrarAlerta();
      return;
    }
    const condicionSeleccionada =
      this.condicionesAnalisis.find(c => c.idCondicion === Number(this.condicionAnalisisEscogida));

    const tipoDatoSeleccionado = this.TipoDatos.find(tipo => tipo.idTipoDato === Number(this.idTipoDatoSeleccionado)) || {
      nombre: 'Tipo no especificado',
      descripcion: '',
    };
    const nuevoRequerimiento: Requerimiento = {
      idRequerimientoAnalisis: this.requerimientos.length + 1,
      objetivo: this.objetivo,
      utilizadoPor: this.utilizadoPor,
      tipoDato: {
        idTipoDato: 'idTipoDato' in tipoDatoSeleccionado ? tipoDatoSeleccionado.idTipoDato : this.idTipoDatoSeleccionado, // Verificación adicional
        nombre: tipoDatoSeleccionado.nombre,
        descripcion: tipoDatoSeleccionado.descripcion,
      },
      idAnalisis: this.requerimientos.length,
      condicion: condicionSeleccionada != null ? condicionSeleccionada : {
        idCondicion: 0,
        nombre: 'Nombre no especificado',
        descripcion: 'Descripción no especificada',
      },
    };



    if (this.selectedIndex !== null && this.selectedIndex >= 0) {
      this.requerimientos[this.selectedIndex] = { ...nuevoRequerimiento };
      this.editarRequerimiento = false;
      this.selectedIndex = null;
    } 

    this.limpiarCamposRequerimiento();
  }

  cargarRequerimientoEnFormulario(index: number): void {
    if (index >= 0 && index < this.requerimientos.length) {
      const requerimiento = this.requerimientos[index];
      this.selectedIndex = index;
      requerimiento.tipoDato.nombre || 'Tipo no especificado';
      this.objetivo = requerimiento.objetivo;
      this.utilizadoPor = requerimiento.utilizadoPor;
      this.condicionAnalisisEscogida = requerimiento.condicion.idCondicion;
      this.idTipoDatoSeleccionado = requerimiento.tipoDato.idTipoDato;
      this.editarRequerimiento = true;
    }
  }

  eliminarRequerimiento(index: number): void {
    if (index >= 0 && index < this.requerimientos.length) {
      this.requerimientos.splice(index, 1);
      this.limpiarCamposRequerimiento();
    }
  }
  enviarSolicitud(): void {
    if (
      (this.archivosAnalizarSeleccionados.length === 0) ||
      !this.numeroUnico ||
      !this.oficinaAnalisis ||
      !this.fechaHecho ||
      this.requerimientos.length === 0
    ) {
      this.alertatipo = "error";
      this.alertaMensaje = "Hay campos vacios";
      this.mostrarAlerta();
      return;
    }
    const numeroSolicitud =
      typeof this.numeroUnico === 'string'
        ? parseInt(this.numeroUnico, 10)
        : this.numeroUnico;
    const solicitudCompleta = {
      idSolicitudAnalisis: 0,
      fechaDelHecho: new Date(this.fechaHecho).toISOString(),
      otrosDetalles: this.otrosDetalles || 'Detalles no proporcionados',
      otrosObjetivosDeAnalisis:
        this.otrosObjetivos || 'Objetivos adicionales no especificados',
      aprobado: false,
      estado: {
        idEstado: 4,
        nombre: 'Estado no especificado',
        descripcion: 'Descripción del estado',
        tipo: 'Tipo no especificado',
      },
      fechaCreacion: new Date().toISOString(),
      numeroSolicitud: numeroSolicitud || 0,
      idOficinaSolicitante: Number(this.oficinaAnalisis) || 0,
      idOficinaCreacion: this.usuario.oficina.idOficina,
      idUsuarioCreador: Number(this.usuarioActivo.idUsuario) || 0,
      requerimentos: (this.requerimientos || []).map((requerimiento) => ({
        idRequerimientoAnalisis: requerimiento.idRequerimientoAnalisis,
        objetivo: requerimiento.objetivo || 'Objetivo no especificado',
        utilizadoPor:
          requerimiento.utilizadoPor || 'Utilizado por no especificado',
        tipoDatoDTO: {
          idTipoDato: requerimiento.tipoDato.idTipoDato || 0,
          nombre: requerimiento.tipoDato.nombre || 'Tipo no especificado',
          descripcion:
            requerimiento.tipoDato.descripcion || 'Nombre no especificado',
        },
        idAnalisis: requerimiento.idAnalisis || 0,
        condicion: requerimiento.condicion || {
          idCondicion: 0,
          nombre: 'Sin Nombre',
          descripcion: 'Sin descripción',
        },
      })),

      objetivosAnalisis: (this.objetivosAnalisisSeleccionados || []).map(
        (objetivo) => ({
          idObjetivoAnalisis: objetivo.idObjetivoAnalisis || 0,
          nombre: objetivo.nombre || 'Nombre no especificado',
          descripcion: objetivo.descripcion || 'Descripción no especificada',
        })
      ),

      solicitudesProveedor: (this.solicitudesProveedorSeleccionadas || []).map(
        (solicitud) => ({
          idSolicitudProveedor: solicitud.idSolicitudProveedor || 0,
          numeroUnico: solicitud.numeroUnico || 'string',
          numeroCaso: solicitud.numeroCaso || 'Caso no especificado',
          imputado: solicitud.imputado || 'Imputado no especificado',
          ofendido: solicitud.ofendido || 'Ofendido no especificado',
          resennia: solicitud.resenna || 'Reseña no especificada',
          urgente: solicitud.urgente || false,
          fechaCreacion: new Date().toISOString(),
          requerimientos: (solicitud.requerimientos || []).map(
            (requerimiento) => ({
              idRequerimientoProveedor:
                requerimiento.idRequerimientoProveedor || 0,
              fechaInicio:
                requerimiento.fechaInicio || new Date().toISOString(),
              fechaFinal: requerimiento.fechaFinal || new Date().toISOString(),
              requerimiento:
                requerimiento.requerimiento || 'Requerimiento no especificado',
              tipoSolicitudes: (requerimiento.tipoSolicitudes || []).map(
                (tipo) => ({
                  idTipoSolicitud: tipo.idTipoSolicitud || 0,
                  nombre: tipo.nombre || 'Nombre no especificado',
                  descripcion:
                    tipo.descripcion || 'Descripción no especificada',
                })
              ),
              datosRequeridos: (requerimiento.datosRequeridos || []).map(
                (dato) => ({
                  idDatoRequerido: dato.idDatoRequerido || 0,
                  datoRequeridoContenido:
                    dato.datoRequerido || 'Dato requerido no especificado',
                  motivacion: dato.motivacion || 'Motivación no especificada',
                  idTipoDato: dato.idTipoDato || 0,
                })
              ),
            })
          ),

          operadoras: (solicitud.operadoras || []).map((operadora) => ({
            idProveedor: operadora.idProveedor || 0,
            nombre: operadora.nombre || 'Proveedor no especificado',
          })),

          usuarioCreador: {
            idUsuario: solicitud.usuarioCreador?.idUsuario || 0,
            nombre:
              solicitud.usuarioCreador?.nombre || 'Nombre no especificado',
            apellido:
              solicitud.usuarioCreador?.apellido || 'Apellido no especificado',
            usuario:
              solicitud.usuarioCreador?.usuario || 'Usuario no especificado',
            correoElectronico:
              solicitud.usuarioCreador?.correoElectronico ||
              'Correo no especificado',
          },

          delito: solicitud.delito || {
            idDelito: 0,
            nombre: 'Delito no especificado',
            descripcion: 'Descripción del delito',
            idCategoriaDelito: 0,
          },
          categoriaDelito: solicitud.categoriaDelito || {
            idCategoriaDelito: 0,
            nombre: 'Categoría no especificada',
            descripcion: 'Descripción de la categoría',
          },
          estado: solicitud.estado || {
            idEstado: 1,
            nombre: 'Estado no especificado',
            descripcion: 'Descripción del estado',
            tipo: 'Tipo no especificado',
          },
          fiscalia: solicitud.fiscalia || {
            idFiscalia: 0,
            nombre: 'Fiscalía no especificada',
          },
          oficina: solicitud.oficina || {
            idOficina: 0,
            nombre: 'Oficina no especificada',
            tipo: 'Tipo de oficina no especificado',
          },
          modalidad: solicitud.modalidad || {
            idModalidad: 0,
            nombre: 'Modalidad no especificada',
            descripcion: 'Descripción de la modalidad',
          },
          subModalidad: solicitud.subModalidad || {
            idSubModalidad: 0,
            nombre: 'Submodalidad no especificada',
            descripcion: 'Descripción de la submodalidad',
            idModalidad: 0,
          },
        })
      ),

      tipoAnalisis: (this.tiposAnalisis || []).map((tipo) => ({
        idTipoAnalisis: tipo.idTipoAnalisis || 0,
        nombre: tipo.nombre || 'Tipo de análisis no especificado',
        descripcion: tipo.descripcion || 'Descripción no especificada',
      })),
      condiciones: [
        {
          idCondicion:
            this.condicionesAnalisis.find(
              (condicion) =>
                condicion.idCondicion === this.condicionAnalisisEscogida
            )?.idCondicion || 0,
          nombre: this.condicionAnalisisEscogida,
          descripcion: 'Descripción de la condición seleccionada',
        },
      ],
      archivos: (this.archivosAnalizarSeleccionados || []).map((archivo) => ({
        idArchivo: archivo.idArchivo || 0,
        nombre: archivo.nombre || 'Archivo no especificado',
        contenido: archivo.contenido || '',
        formatoAchivo: archivo.formatoArchivo || 'Sin formato',
        fechaModificacion: new Date().toISOString(),
      })),
    };

    this.solicitudCompletaAnalisis = solicitudCompleta;
    this.mostrarConfirmacionModal();
  }

  guardarSolicitudAnalisis() {
    this.analisisService
      .agregarSolicitudAnalisis(this.solicitudCompletaAnalisis)
      .subscribe(
        (response) => {
          this.mostrarExito = true;
          this.limpiarFormulario();
        },
        (error) => console.error('Error al enviar la solicitud:', error.error) // MOSTRAR ERROR EN ALERTA
      );
  }
  errorModalInfo() {
    this.alertatipo = "error";
    this.alertaMensaje = "Hubo un error al momento de realizar la petición";
    this.alertaVisible = true;
    setTimeout(() => {
      this.alertaVisible = false;
    }, 3000);

  }

  obtenerCondiciones(): void {
    this.analisisService.obtenerCondiciones().subscribe(
      (condiciones) => {
        this.condicionesAnalisis = condiciones;
      },
      (error) =>
        console.error('Error al cargar condiciones de análisis:', error) // MOSTRAR ERROR EN ALERTA
    );
  }
  obtenerTipoAnalisis(): void {
    this.analisisService.obtenerTipoAnalisis().subscribe(
      (tipos) => {
        this.tiposAnalisis = tipos;
      },
      (error) => console.error('Error al cargar tipos de análisis:', error) // MOSTRAR ERROR EN ALERTA
    );
  }

  limpiarCamposRequerimiento(): void {
    this.objetivo = '';
    this.utilizadoPor = '';
    this.condicion = '';
    this.idTipoDatoSeleccionado = 0;
    this.condicionAnalisisEscogida = 0;
  }

  limpiarFormulario(): void {
    this.numeroUnico = null;
    this.solicitudesProveedorSeleccionadas = [];
    this.archivosAnalizarSeleccionados = [];
    this.objetivosAnalisisSeleccionados = [];
    this.oficinaAnalisis = null;
    this.tipoAnalisis = 0;
    this.fechaHecho = '';
    this.otrosObjetivos = '';
    this.otrosDetalles = '';

    // Limpiar requerimientos y campos específicos de la solicitud
    this.requerimientos = [];
    this.solicitudCompletaAnalisis = null;

    // Limpiar configuraciones seleccionadas para los dropdowns y reiniciar opciones
    this.operadoraSeleccionada = [];
    this.condicionAnalisisEscogida = 0;
    this.idsSolicitudProveedarArchivo = [];

    // Resetear los campos específicos de los requerimientos
    this.limpiarCamposRequerimiento();

  }
  validarOtrosDetalles(): boolean {
    const regex = /^[a-zA-Z0-9\s.,;:!?()-]+$/;
    return regex.test(this.otrosDetalles) && this.otrosDetalles.length >= 20;
  }

  validarObjetivo(): boolean {
    const regex = /^\d{8}$/;
    return regex.test(this.objetivo);
  }

  validarUtilizadoPor(): boolean {
    const regex = /^[a-zA-Z\s]+$/;
    return regex.test(this.utilizadoPor) && this.utilizadoPor.length >= 20;
  }

  mostrarAlerta(): void {
    this.alertaVisible = true;

    // Opcional: Cerrar la alerta después de unos segundos
    setTimeout(() => {
      this.alertaVisible = false;
    }, 3000); // 3 segundos
  }
}
