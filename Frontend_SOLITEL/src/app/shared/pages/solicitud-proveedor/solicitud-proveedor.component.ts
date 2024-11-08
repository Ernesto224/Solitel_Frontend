import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { DelitoService } from '../../services/delito.service';  // Importar el servicio de delitos
import { FiscaliaService } from '../../services/fiscalia.service';  // Importar el servicio de fiscalías
import { CategoriaDelitoService } from '../../services/categoria-delito.service';  // Importar el servicio de fiscalías
import { ModalidadService } from '../../services/modalidad.service';
import { SubModalidadService } from '../../services/sub-modalidad.service';
import { TipoSolicitudService } from '../../services/tipo-solicitud.service';
import { TipoDatoService } from '../../services/tipo-dato.service';
import { SolicitudProveedorService } from '../../services/solicitud-proveedor.service';  // Agregar el servicio
import { ProveedorService } from '../../services/proveedor.service'; // Para cargar operadoras
import { OficinaService } from '../../services/oficina.service'; // Para cargar oficinas
import { ArchivoService } from '../../services/archivo.service';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { AlertaComponent } from '../../components/alerta/alerta.component';

@Component({
  selector: 'app-solicitud-proveedor',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    FormsModule,
    NgMultiSelectDropDownModule,
    AlertaComponent
  ],
  templateUrl: './solicitud-proveedor.component.html',
  styleUrls: ['./solicitud-proveedor.component.css']
})
export default class SolicitudProveedorComponent {

  alertatipo: string = "error";
  alertaMensaje: string = "";
  alertaVisible: boolean = false;

  selectedFile: File | null = null;
  fileId: number = 0;

  // Estados y modales
  isModalOpen = false;
  isUrgent = false;
  errorMessage: string = '';
  // Listas dinámicas para desplegables (combobox)
  categoriasDelito: any[] = [];
  fiscalias: any[] = [];
  delitos: any[] = [];
  modalidades: any[] = [];
  subModalidades: any[] = [];
  tiposSolicitud: any[] = [];
  tiposDato: any[] = [];
  listaSolicitudes: any[] = [];
  operadoras: any[] = [];
  oficinas: any[] = [];

  // Declarar variables para el multi-select
  dropdownSettings = {};
  dropdownSettings2 = {};
  operadoraSeleccionada: any[] = [];

  tipoSolicitudSeleccionada: any[] = [];  // Array para almacenar las opciones seleccionadas

  // Selección de datos del formulario
  idOperadoraSeleccionada = 0;
  idOficinaSeleccionada = 0;
  idFiscaliaSeleccionada = 0;
  idDelitoSeleccionado = 0;
  idCategoriaDelitoSeleccionado = 0;
  idEstadoSeleccionado = 0;
  idModalidadSeleccionada = 0;
  idSubModalidadSeleccionada = 0;
  tipoDatoSeleccionado: any = null;
  selectedTipoDato = '';
  selectedDatoRequerido: any = null;

  // Variables del formulario
  numeroUnico: string = '';
  numeroCaso: string = '';
  imputado: string = '';
  ofendido: string = '';
  resennia: string = '';

  // Requerimientos adicionales del formulario
  requerimiento: string = '';
  fechaInicio: string = '';
  fechaFinal: string = '';

  // Información de "Datos Requeridos"
  datoRequerido: string = '';
  repitaDatoRequerido: string = '';
  motivation: string = '';
  listaDatosRequeridos: any[] = [];
  placeholderDatoRequerido: string = 'Ingrese el dato requerido'; // Propiedad para el placeholder
  maxlengthDatoRequerido: number = 0;
  tipoDatoSeleccionadoBloqueado: boolean = false; // Bloquea la selección del tipo de dato

  // Información de Usuario
  idUsuarioCreador: number = 1;  // Ejemplo de usuario por defecto

  // Otros campos de entidad
  idDelito: number = 0;
  idCategoriaDelito: number = 0;
  idEstado: number = 0;
  idFiscalia: number = 0;
  idOficina: number = 0;
  idModalida: number = 0;
  idSubModalidad: number = 0;

  // requrimiento que se está editando
  editingIndex: number | null = null;

  constructor(
    private solicitudProveedorService: SolicitudProveedorService,
    private delitoService: DelitoService,
    private proveedorService: ProveedorService,
    private oficinaService: OficinaService,
    private fiscaliaService: FiscaliaService,
    private categoriaService: CategoriaDelitoService,
    private modalidadService: ModalidadService,
    private subModalidadService: SubModalidadService,
    private tipoSolicitudService: TipoSolicitudService,
    private tipoDatoService: TipoDatoService,
    private archivoService: ArchivoService

  ) { }

  ngOnInit() {

    this.getCategories();
    this.getFiscalias();
    this.getDelitos();
    this.getModalidades();
    this.getSubModalidades();
    this.getTiposSolicitud();
    this.getTiposDato();
    this.getOperadoras();  // Cargar operadoras
    //this.getOficinas();    // Cargar oficinas

    // Configuración para el Multi-Select Dropdown
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'idProveedor',
      textField: 'nombre',
      selectAllText: 'Seleccionar Todo',
      unSelectAllText: 'Deseleccionar Todo',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };



    this.dropdownSettings2 = {
      singleSelection: false,
      idField: 'idTipoSolicitud',       // Cambia 'id' por el campo de ID que uses en `tiposSolicitud`
      textField: 'nombre', // Cambia 'nombre' por el campo de texto que uses en `tiposSolicitud`
      selectAllText: 'Seleccionar Todo',
      unSelectAllText: 'Deseleccionar Todo',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };

  }

  private validarNumUnico = (nombre: string) => {
    //se verifica que solo incluya caracteres y su rango
    return /^[0-9]{2}-[0-9]{6}-[0-9]{4}-[a-z]{2}$/.test(nombre);
  };

  private validarNombrePersona = (nombre: string) => {
    // Permite letras con tildes, ñ, Ñ y espacios, pero sin caracteres especiales
    return /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(nombre);
  };

  private validarResenaYRequerimiento = (texto: string) => {
    // Permite cualquier texto que no contenga signos de exclamación
    return /^[^!]+$/.test(texto);
  };

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  insertarArchivo() {
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('TC_Nombre', this.selectedFile.name);
      formData.append('file', this.selectedFile);  // Renombrado a 'file'
      formData.append('TC_FormatoAchivo', this.selectedFile.type);
      formData.append('TF_FechaModificacion', '2024-10-10');

      console.log(formData);

      this.archivoService.insertarArchivo(formData).subscribe({
        next: response => {
          console.log('Archivo guardado con exito', response);
          alert('Archivo guardado con éxito');
        },
        error: err => {
          console.error('Error al guardar el archivo:', err);
        }
      });
    }
  }

  descargarArchivo(id: number): void {
    this.archivoService.descargarArchivo(id).subscribe(response => {
      // Decodifica el contenido Base64 a un Blob
      const byteCharacters = atob(response.contenidoArchivo);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: response.tipoArchivo });

      // Crea la URL para el archivo Blob
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = response.nombreArchivo; // Usa el nombre del archivo desde la respuesta
      document.body.appendChild(a);
      a.click();

      // Limpia el DOM y revoca la URL
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, error => {
      console.error('Error al descargar el archivo:', error);
    });
  }

  onCategoriaDelitoChange(): void {
    if (this.idCategoriaDelitoSeleccionado) {
      this.delitoService.obtenerPorCategoria(this.idCategoriaDelitoSeleccionado)
        .subscribe(
          (response: any) => {
            this.delitos = response; // Cargar delitos en el dropdown
            this.idDelitoSeleccionado = 0; // Resetear el valor de "Delito" seleccionado
          },
          (error: any) => {
            console.error('Error al obtener delitos:', error);
            this.delitos = []; // Dejar vacío si hay un error
          }
        );
    } else {
      this.delitos = []; // Dejar vacío si no hay categoría seleccionada
      this.idDelitoSeleccionado = 0;
    }
  }

  onModalidadChange(): void {
    if (this.idModalidadSeleccionada) {
      this.subModalidadService.obtenerPorModalidad(this.idModalidadSeleccionada)
        .subscribe(
          (response: any) => {
            this.subModalidades = response; // Cargar submodalidades en el dropdown
            this.idSubModalidadSeleccionada = 0; // Resetear el valor de "Submodalidad" seleccionado
          },
          (error: any) => {
            console.error('Error al obtener submodalidades:', error);
            this.subModalidades = []; // Dejar vacío si hay un error
          }
        );
    } else {
      this.subModalidades = []; // Dejar vacío si no hay modalidad seleccionada
      this.idSubModalidadSeleccionada = 0;
    }
  }

  getOperadoras() {
    this.proveedorService.obtener().subscribe({
      next: (data: any[]) => {
        this.operadoras = data;
      },
      error: (err: any) => {
        console.error();
      }
    });
  }

  getOficinas() {
    this.oficinaService.obtener().subscribe({
      next: (data: any[]) => {
        this.oficinas = data;
      },
      error: (err: any) => {
        console.error();
      }
    });
  }

  editarSolicitud(index: number) {
    // Guardamos el índice de la solicitud que estamos editando
    this.editingIndex = index;

    // Obtener la solicitud que se va a editar
    const solicitud = this.listaSolicitudes[index];

    // Cargar los datos de la solicitud en los campos del formulario
    this.tipoSolicitudSeleccionada = solicitud.tipoSolicitudes;  // Cargar tipos de solicitud
    this.requerimiento = solicitud.tC_Requerimiento;             // Cargar el requerimiento
    this.fechaInicio = solicitud.tF_FechaInicio;                 // Cargar fecha de inicio
    this.fechaFinal = solicitud.tF_FechaFinal;                   // Cargar fecha final
    this.listaDatosRequeridos = solicitud.datosRequeridos;       // Cargar datos requeridos
    this.tipoDatoSeleccionadoBloqueado = true;
  }

  actualizarSolicitud() {
    if (this.editingIndex !== null) {
      if (this.tipoSolicitudSeleccionada.length > 0
        && this.requerimiento && this.fechaInicio
        && this.fechaFinal && this.listaDatosRequeridos.length > 0) {

        //se extrae el fromulario
        const solicitud = this.listaSolicitudes[this.editingIndex];

        // Actualizar la solicitud con los valores del formulario
        solicitud.tipoSolicitudes = this.tipoSolicitudSeleccionada;  // Cargar tipos de solicitud
        solicitud.tC_Requerimiento = this.requerimiento;             // Cargar el requerimiento
        solicitud.tF_FechaInicio = this.fechaInicio;                 // Cargar fecha de inicio
        solicitud.tF_FechaFinal = this.fechaFinal;                   // Cargar fecha final
        solicitud.datosRequeridos = this.listaDatosRequeridos;

        // Limpiar el índice de edición y los campos del formulario
        this.editingIndex = null;
        this.tipoDatoSeleccionadoBloqueado = false;
        this.limpiarFormulario();
        this.alertaMensaje = 'Requerimiento editado exitosamente.';
        this.alertatipo = 'satisfaccion';
        this.mostrarAlerta();

      } else {

        this.alertaMensaje = 'Debe completar todos los campos para agregar un requerimiento.';
        this.alertatipo = 'error';
        this.mostrarAlerta();
      }
    }
  }

  guardarSolicitud() {
    if (
      (this.validarNumUnico(this.numeroUnico) == true || this.numeroCaso) &&
      this.validarNombrePersona(this.imputado) &&
      this.validarNombrePersona(this.ofendido) &&
      this.validarResenaYRequerimiento(this.resennia) &&
      !!this.idFiscaliaSeleccionada &&
      this.operadoraSeleccionada.length >= 1 &&
      !!this.idOficinaSeleccionada &&
      !!this.idCategoriaDelitoSeleccionado &&
      !!this.idDelitoSeleccionado &&
      this.listaSolicitudes.length >= 1
    ) {
      const solicitudProveedor = {
        idSolicitudProveedor: 0,
        numeroUnico: this.numeroUnico || "",
        numeroCaso: this.numeroCaso || "",
        imputado: this.imputado || "string",
        ofendido: this.ofendido || "string",
        resennia: this.resennia || "string",
        urgente: this.isUrgent || false,
        fechaCreacion: new Date().toISOString(),

        requerimientos: this.listaSolicitudes.map(solicitud => ({
          idRequerimientoProveedor: 0,
          fechaInicio: solicitud.tF_FechaInicio || new Date().toISOString(),
          fechaFinal: solicitud.tF_FechaFinal || new Date().toISOString(),
          requerimiento: solicitud.tC_Requerimiento || "string",

          tipoSolicitudes: solicitud.tipoSolicitudes.map((tipo: any) => ({
            idTipoSolicitud: tipo.idTipoSolicitud,
            nombre: tipo.nombre,
            descripcion: tipo.descripcion || "Descripción no proporcionada"
          })),

          datosRequeridos: solicitud.datosRequeridos.map((dato: any) => ({
            idDatoRequerido: dato.tN_IdDatoRequerido || 0,
            datoRequeridoContenido: dato.tC_DatoRequerido || "string",
            motivacion: dato.tC_Motivacion || "string",
            idTipoDato: dato.tN_IdTipoDato
          }))
        })),

        operadoras: this.operadoraSeleccionada.map(operadora => ({
          idProveedor: operadora.idProveedor,
          nombre: operadora.nombre
        })),

        usuarioCreador: {
          idUsuario: 1,
          nombre: "Juan",
          apellido: "Pérez",
          usuario: "jperez",
          correoElectronico: "jperez@example.com"
        },

        delito: {
          idDelito: this.idDelitoSeleccionado,
          nombre: "Delito X",
          descripcion: "Descripción del delito",
          idCategoriaDelito: this.idCategoriaDelitoSeleccionado
        },

        categoriaDelito: {
          idCategoriaDelito: this.idCategoriaDelitoSeleccionado,
          nombre: "Categoría X",
          descripcion: "Descripción de la categoría"
        },

        estado: {
          idEstado: 4,
          nombre: "Creado",
          descripcion: "Solicitud creada",
          tipo: "string"
        },

        fiscalia: {
          idFiscalia: this.idFiscaliaSeleccionada,
          nombre: this.fiscalias.find(f => f.tN_IdFiscalia === this.idFiscaliaSeleccionada)?.tC_Nombre || "Desconocido"
        },

        oficina: {
          idOficina: this.idOficinaSeleccionada,
          nombre: this.oficinas.find(o => o.tN_IdOficina === this.idOficinaSeleccionada)?.tC_Nombre || "Desconocido",
          tipo: "string"
        },

        modalidad: {
          idModalidad: this.idModalidadSeleccionada,
          nombre: "Modalidad X",
          descripcion: "Descripción de la modalidad"
        },

        subModalidad: {
          idSubModalidad: this.idSubModalidadSeleccionada,
          nombre: "Submodalidad X",
          descripcion: "Descripción de la submodalidad",
          idModalida: this.idModalidadSeleccionada
        }
      };

      // Llamar al servicio para enviar la solicitud
      this.solicitudProveedorService.insertarSolicitudProveedor(solicitudProveedor).subscribe({
        next: response => {
          this.alertaMensaje = 'Solicitud guardada con éxito.';
          this.alertatipo = 'satisfaccion';
          this.mostrarAlerta();
          this.limpiarTodo();
        },
        error: err => {
          this.alertaMensaje = `Error al guardar la solicitud: ${err}`;
          this.alertatipo = 'error';
          this.mostrarAlerta();
        }
      });

    } else {
      let errores = [];

      if (!(this.validarNumUnico(this.numeroUnico) == true || this.numeroCaso)) {
        errores.push("Número único o número de caso");
      }
      if (!this.validarNombrePersona(this.imputado)) {
        errores.push("Nombre del imputado");
      }
      if (!this.validarNombrePersona(this.ofendido)) {
        errores.push("Nombre del ofendido");
      }
      if (!this.validarResenaYRequerimiento(this.resennia)) {
        errores.push("Reseña y requerimiento");
      }
      if (!this.idFiscaliaSeleccionada) {
        errores.push("Fiscalía seleccionada");
      }
      if (this.operadoraSeleccionada.length < 1) {
        errores.push("Operadora seleccionada");
      }
      if (!this.idOficinaSeleccionada) {
        errores.push("Oficina seleccionada");
      }
      if (!this.idCategoriaDelitoSeleccionado) {
        errores.push("Categoría de delito seleccionada");
      }
      if (!this.idDelitoSeleccionado) {
        errores.push("Delito seleccionado");
      }
      if (this.listaSolicitudes.length < 1) {
        errores.push("Lista de solicitudes con al menos un elemento");
      }

      // Mostrar alert con los errores
      if (errores.length > 0) {
        this.alertaMensaje = "Los siguientes campos son requeridos o tienen errores:\n- " + errores.join("\n- ");
        this.alertatipo = 'error';
        this.mostrarAlerta();
      }
    }
  }

  eliminarSolicitud(index: number) {
    // Eliminar la solicitud seleccionada usando el índice
    this.listaSolicitudes.splice(index, 1);
  }

  limpiarTodo() {
    // Limpiar las variables de selección del formulario
    this.numeroUnico = '';
    this.numeroCaso = '';
    this.imputado = '';
    this.ofendido = '';
    this.resennia = '';
    this.isUrgent = false;

    // Limpiar las selecciones de listas desplegables
    this.idOperadoraSeleccionada = 0;
    this.idOficinaSeleccionada = 0;
    this.idFiscaliaSeleccionada = 0;
    this.idDelitoSeleccionado = 0;
    this.idCategoriaDelitoSeleccionado = 0;
    this.idEstadoSeleccionado = 0;
    this.idModalidadSeleccionada = 0;
    this.idSubModalidadSeleccionada = 0;

    // Limpiar las listas
    this.tipoSolicitudSeleccionada = [];
    this.operadoraSeleccionada = [];
    this.listaSolicitudes = [];
    this.listaDatosRequeridos = [];

    // Limpiar las variables adicionales
    this.requerimiento = '';
    this.fechaInicio = '';
    this.fechaFinal = '';
    this.datoRequerido = '';
    this.repitaDatoRequerido = '';
    this.motivation = '';

    // Limpiar el campo de tipo de dato y resetear su placeholder y maxlength
    this.tipoDatoSeleccionado = null;
    this.placeholderDatoRequerido = 'Ingrese el dato requerido';
    this.maxlengthDatoRequerido = 100; // Restablecer el límite de caracteres a un valor por defecto

    // Limpiar mensajes de error o cualquier otra notificación
    this.errorMessage = '';

    // Restablecer cualquier índice de edición
    this.editingIndex = null;

    // Desbloquear cualquier campo bloqueado previamente
    this.tipoDatoSeleccionadoBloqueado = false; // Bloquea la selección del tipo de dato
    this.tipoDatoSeleccionadoBloqueado = false;

    // Si el modal está abierto, ciérralo
    this.isModalOpen = false;

    console.log('Formulario completamente limpio');
  }

  limpiarFormulario() {

    this.tipoDatoSeleccionadoBloqueado = false;

    // Limpiar el campo de tipo de solicitud
    this.tipoSolicitudSeleccionada = [];

    // Limpiar los campos de fecha inicio y fecha final
    this.fechaInicio = "";
    this.fechaFinal = "";

    // Limpiar el campo de requerimiento
    this.requerimiento = '';
    this.listaDatosRequeridos = [];

    this.resetForm();
  }

  agregarSolicitud() {
    if (this.tipoSolicitudSeleccionada.length > 0
      && this.requerimiento && this.fechaInicio
      && this.fechaFinal && this.listaDatosRequeridos.length > 0) {

      // Crear el objeto de solicitud con la estructura solicitada
      const nuevaSolicitud = {
        tN_IdRequerimientoProveedor: 0, // Asumimos que es nuevo
        tF_FechaInicio: this.fechaInicio, // Fecha inicio desde el formulario
        tF_FechaFinal: this.fechaFinal,   // Fecha final desde el formulario
        tC_Requerimiento: this.requerimiento, // Requerimiento desde el formulario
        tipoSolicitudes: this.tipoSolicitudSeleccionada,
        datosRequeridos: this.listaDatosRequeridos // Lista de datos requeridos
      };

      // Agregar la nueva solicitud a la lista de solicitudes
      this.listaSolicitudes.push(nuevaSolicitud);
      this.tipoDatoSeleccionadoBloqueado = false;
      this.limpiarFormulario();
      this.alertaMensaje = 'Requerimiento agregado exitosamente.';
      this.alertatipo = 'satisfaccion';
      this.mostrarAlerta();

    } else {

      this.alertaMensaje = 'Debe completar todos los campos para agregar un requerimiento.';
      this.alertatipo = 'error';
      this.mostrarAlerta();
    }
  }

  mostrarAlerta(): void {
    this.alertaVisible = true;

    // Opcional: Cerrar la alerta después de unos segundos
    setTimeout(() => {
      this.alertaVisible = false;
    }, 3000); // 3 segundos
  }

  getDelitos() {
    this.delitoService.obtener().subscribe({
      next: (data: any[]) => {
        this.delitos = data;
      },
      error: (err: any) => {

      }
    });
  }

  getTiposDato() {
    this.tipoDatoService.obtener().subscribe({
      next: (data: any[]) => {
        this.tiposDato = data;
      },
      error: (err: any) => {
        console.error('');
      }
    });
  }

  getTiposSolicitud() {
    this.tipoSolicitudService.obtener().subscribe({
      next: (data: any[]) => {
        this.tiposSolicitud = data;
        console.log(this.tiposSolicitud);
      },
      error: (err: any) => {
        console.error('');
      }
    });
  }

  getSubModalidades() {
    this.subModalidadService.obtener().subscribe({
      next: (data: any[]) => {
        this.subModalidades = data;
      },
      error: (err: any) => {
        console.error('');
      }
    });
  }

  getModalidades() {
    this.modalidadService.obtener().subscribe({
      next: (data: any[]) => {
        this.modalidades = data;
      },
      error: (err: any) => {
        console.error();
      }
    });
  }

  getCategories() {
    this.categoriaService.obtener().subscribe({
      next: (data: any[]) => {
        this.categoriasDelito = data;
      },
      error: (err: any) => {

      }
    });
  }

  getFiscalias() {
    this.fiscaliaService.obtener().subscribe({
      next: (data: any[]) => {
        this.fiscalias = data;
        console.log(this.fiscalias);
      },
      error: (err: any) => {
        console.error();
      }
    });
  }

  resetForm() {
    this.datoRequerido = '';
    this.repitaDatoRequerido = '';
    this.motivation = '';
  }

  logTipoDato() {
    console.log("Tipo de Dato seleccionado:", this.tipoDatoSeleccionado);
  }

  agregarDatoRequerido() {
    console.log("tipoDatoSeleccionado antes de agregar:", this.tipoDatoSeleccionado); // Verificación

    if (this.datoRequerido && this.repitaDatoRequerido && this.motivation && this.tipoDatoSeleccionado) {

      if (this.datoRequerido === this.repitaDatoRequerido) {
        // El ID y el nombre del tipo de dato se toman directamente del objeto seleccionado
        const nuevoDato = {
          tN_IdDatoRequerido: this.tipoDatoSeleccionado.tN_IdTipoDato, // Asigna el ID correcto
          tC_DatoRequerido: this.datoRequerido,
          tC_Motivacion: this.motivation,
          tN_IdTipoDato: this.tipoDatoSeleccionado.idTipoDato, // El ID del tipo de dato seleccionado
          tC_NombreTipoDato: this.tipoDatoSeleccionado.tC_Nombre // El nombre del tipo de dato seleccionado
        };

        this.listaDatosRequeridos.push(nuevoDato); // Agregar el dato a la lista
        this.tipoDatoSeleccionadoBloqueado = true;
        this.resetForm();  // Limpiar los campos del formulario
        this.errorMessage = '';  // Limpiar el mensaje de error

        console.log("Nuevo dato agregado:", nuevoDato);
        console.log("Lista de datos requeridos:", this.listaDatosRequeridos);
      } else {
        this.errorMessage = 'Los campos "Dato Requerido" y "Repita el Dato Requerido" deben coincidir.';
      }
    } else {
      this.errorMessage = 'Todos los campos son obligatorios. Por favor, verifique.';

    }




  }

  getListaDatosFormateados(): string {
    return this.listaDatosRequeridos.map(item => `${item.tC_DatoRequerido}`).join(', ');
  }

  onDatoRequeridoChange(event: any) {
    const idSeleccionado = event.target.value;  // Obtenemos el ID del dato requerido seleccionado
    console.log("ID seleccionado para eliminar:", idSeleccionado);
    this.selectedDatoRequerido = event.target.value;  // Asignamos el objeto seleccionado

    // Buscar el objeto completo basado en el ID del dato requerido seleccionado
    this.selectedDatoRequerido = this.listaDatosRequeridos.find(
      item => item.tN_IdDatoRequerido === parseInt(idSeleccionado)  // Comparar por el ID en lugar del datoRequerido
    );

    console.log("Dato seleccionado:", this.selectedDatoRequerido);
  }

  eliminarDatoRequerido() {
    if (this.selectedDatoRequerido) {
      this.listaDatosRequeridos = this.listaDatosRequeridos.filter(
        item => item !== this.selectedDatoRequerido
      );

      console.log("Dato eliminado:", this.selectedDatoRequerido);
      console.log("Lista actualizada de datos requeridos:", this.listaDatosRequeridos);

      // Limpiar la selección
      this.selectedDatoRequerido = null;
      if (this.listaDatosRequeridos.length === 0) {
        this.tipoDatoSeleccionadoBloqueado = false;
      }

    } else {
      console.error("No hay ningún dato seleccionado para eliminar.");
    }
  }

  onTipoDatoChange() {

    if (this.tipoDatoSeleccionadoBloqueado == false) {

      if (this.tipoDatoSeleccionado?.nombre === 'IMEI') {
        this.maxlengthDatoRequerido = 15;  // Límite para IMEI (15 dígitos)
        this.placeholderDatoRequerido = '123456789087654'
      } else if (this.tipoDatoSeleccionado?.nombre === 'Número Nacional') {
        this.maxlengthDatoRequerido = 8;  // Límite para número de teléfono (10 dígitos)
        this.placeholderDatoRequerido = '2222-2222'
      } else if (this.tipoDatoSeleccionado?.nombre === 'IP') {
        this.maxlengthDatoRequerido = 15;  // Límite para email
        this.placeholderDatoRequerido = '192.168.111.111'
      } else if (this.tipoDatoSeleccionado?.nombre === 'Número Internacional') {
        this.maxlengthDatoRequerido = 14;  // Límite para email
        this.placeholderDatoRequerido = '+1 305 123-4567'
      } else {
        this.maxlengthDatoRequerido = 100;  // Valor por defecto
        this.placeholderDatoRequerido = 'Ingrese el dato requerido'
      }

    } else {
      this.errorMessage = 'No se pueden cambiar el tipo de dato.';

    }
  }

  toggleUrgente() {
    // Cambiar el estado de urgente (true/false)
    this.isUrgent = !this.isUrgent;
    console.log("Urgente: ", this.isUrgent ? 1 : 0);
  }

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  isCategoriaDelitoDisabled: boolean = false;

  isFiscaliaDisabled: boolean = false;

  isDelitoDisabled: boolean = false;

  buscarInfoNumeroUnico(numeroUnico: string){
    this.solicitudProveedorService.consultarInfoNumeroUnico(numeroUnico).subscribe({
      next: (data: any) => {

        this.idCategoriaDelitoSeleccionado = data.categoriaDelitoDTO.idCategoriaDelito;
        this.idFiscaliaSeleccionada = data.fiscaliaDTO.idFiscalia;
        this.idDelitoSeleccionado = data.delitoDTO.idDelito;
        this.imputado = String(data.imputado);
        this.ofendido = String(data.ofendido);
        this.resennia = String(data.resennia);

        this.isCategoriaDelitoDisabled = true;
        this.isDelitoDisabled = true;
        this.isFiscaliaDisabled = true;
        
      },
      error: (err: any) => {
        this.errorMessage = err;

        this.idCategoriaDelitoSeleccionado = 0;
        this.idFiscaliaSeleccionada = 0;
        this.idDelitoSeleccionado = 0;
        this.imputado = '';
        this.ofendido = '';
        this.resennia = '';

        this.isCategoriaDelitoDisabled = false;
        this.isDelitoDisabled = false;
        this.isFiscaliaDisabled = false;
      }
    });
  }

}

