import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FooterComponent } from '../../components/footer/footer.component';
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
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

@Component({
  selector: 'app-solicitud-proveedor',
  standalone: true,
  imports: [CommonModule,
    SidebarComponent,
    RouterOutlet,
    NavbarComponent,
    FooterComponent,
    FormsModule,
    NgMultiSelectDropDownModule],
  templateUrl: './solicitud-proveedor.component.html',
  styleUrls: ['./solicitud-proveedor.component.css']
})
export default class SolicitudProveedorComponent {
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
    private tipoDatoService: TipoDatoService

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

  // Método que se llama al cambiar la categoría de delito
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

  // Método para obtener las submodalidades al cambiar la modalidad seleccionada
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

  // Obtener operadoras
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

  // Obtener oficinas
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

  guardarSolicitud() {
    console.log(this.operadoraSeleccionada)
    console.log(this.tipoSolicitudSeleccionada);
    const solicitudProveedor = {
      idSolicitudProveedor: 0,
      numeroUnico: this.numeroUnico || 0,
      numeroCaso: this.numeroCaso || "string",
      imputado: this.imputado || "string",
      ofendido: this.ofendido || "string",
      resennia: this.resennia || "string",
      urgente: this.isUrgent || false,

      requerimientos: this.listaSolicitudes.map(solicitud => ({
        tN_IdRequerimientoProveedor: 0,
        tF_FechaInicio: solicitud.tF_FechaInicio || new Date().toISOString(),
        tF_FechaFinal: solicitud.tF_FechaFinal || new Date().toISOString(),
        tC_Requerimiento: solicitud.tC_Requerimiento || "string",

        tipoSolicitudes: solicitud.tipoSolicitudes.map((tipo: any) => ({
          IdTipoSolicitud: tipo.idTipoSolicitud,
          Nombre: tipo.nombre,
          Descripcion: tipo.descripcion || "Descripción no proporcionada"
        })),

        datosRequeridos: solicitud.datosRequeridos.map((dato: any) => ({
          tN_IdDatoRequerido: dato.tN_IdDatoRequerido || 0,
          tC_DatoRequerido: dato.tC_DatoRequerido || "string",
          tC_Motivacion: dato.tC_Motivacion || "string",
          tN_IdTipoDato: dato.tN_IdTipoDato
        }))
      })),

      operadoras: this.operadoraSeleccionada,

      usuarioCreador: { // Quemado
        tN_IdUsuario: 1,
        tC_Nombre: "Juan",
        tC_Apellido: "Pérez",
        tC_Usuario: "jperez",
        tC_CorreoElectronico: "jperez@example.com"
      },

      delito: {
        IdDelito: this.idDelitoSeleccionado,
        Nombre: "Delito X",
        Descripcion: "Descripción del delito",
        IdCategoriaDelito: this.idCategoriaDelitoSeleccionado
      },

      categoriaDelito: {
        IdCategoriaDelito: this.idCategoriaDelitoSeleccionado,
        Nombre: "Categoría X",
        Descripcion: "Descripción de la categoría"
      },

      estado: {
        TN_IdEstado: 4,
        TC_Nombre: "Creado",
        TC_Descripcion: "Solicitud creada"
      },

      fiscalia: {
        IdFiscalia: this.idFiscaliaSeleccionada,
        Nombre: this.fiscalias.find(f => f.tN_IdFiscalia === this.idFiscaliaSeleccionada)?.tC_Nombre || "Desconocido"
      },

      oficina: {
        tN_IdOficina: this.idOficinaSeleccionada,
        tC_Nombre: this.oficinas.find(o => o.tN_IdOficina === this.idOficinaSeleccionada)?.tC_Nombre || "Desconocido"
      },

      modalidad: {
        IdModalidad: this.idModalidadSeleccionada,
        Nombre: "Modalidad X",
        Descripcion: "Descripción de la modalidad"
      },

      subModalidad: {
        IdSubModalidad: this.idSubModalidadSeleccionada,
        Nombre: "Submodalidad X",
        Descripcion: "Descripción de la submodalidad",
        IdModalida: this.idModalidadSeleccionada
      }
    };

    console.log(solicitudProveedor.requerimientos);
    console.log(solicitudProveedor.subModalidad)

    // Llamar al servicio para enviar la solicitud
    this.solicitudProveedorService.insertarSolicitudProveedor(solicitudProveedor).subscribe({
      next: response => {
        console.log('Solicitud guardada con éxito', response);
        alert('Solicitud guardada con éxito');
      },
      error: err => {
        console.error('Error al guardar la solicitud:', err);
      }
    });
  }

  eliminarSolicitud(index: number) {
    // Eliminar la solicitud seleccionada usando el índice
    this.listaSolicitudes.splice(index, 1);
  }

  limpiarFormulario() {
    // Limpiar el campo de tipo de solicitud
    this.tipoSolicitudSeleccionada = [];

    // Limpiar los campos de fecha inicio y fecha final
    this.fechaInicio = "";
    this.fechaFinal = "";

    // Limpiar el campo de requerimiento
    this.requerimiento = '';
    this.listaDatosRequeridos = [];
  }

  agregarSolicitud() {



    console.log("Requerimiento: ", this.requerimiento);
    console.log("Fecha Inicio: ", this.fechaInicio);
    console.log("Fecha Final: ", this.fechaFinal);
    console.log("Datos Requeridos: ", this.listaDatosRequeridos);

    if (this.tipoSolicitudSeleccionada && this.requerimiento && this.fechaInicio && this.fechaFinal && this.listaDatosRequeridos.length > 0) {
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
      console.log('Lista de solicitudes:', this.listaSolicitudes);


      this.tipoSolicitudSeleccionada = [];
      this.requerimiento = '';
      this.listaDatosRequeridos = [];
      this.resetForm();
    } else {
      this.errorMessage = 'Debe completar todos los campos.';
    }
  }

  // Método para obtener delitos
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

  // Método para obtener categorías de delito
  getCategories() {
    this.categoriaService.obtener().subscribe({
      next: (data: any[]) => {
        this.categoriasDelito = data;
      },
      error: (err: any) => {

      }
    });
  }

  // Método para obtener fiscalías
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
    this.tipoDatoSeleccionado = '';
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

  getListaDatosFormateados(): string {
    return this.listaDatosRequeridos.map(item => `${item.tC_DatoRequerido}`).join(', ');
  }

  eliminarDatoRequerido() {
    if (this.selectedDatoRequerido) {
      // Filtrar la lista para excluir el objeto seleccionado por su ID
      this.listaDatosRequeridos = this.listaDatosRequeridos.filter(
        item => item.tN_IdDatoRequerido !== this.selectedDatoRequerido.tN_IdDatoRequerido
      );

      // Mostrar la lista después de la eliminación
      console.log("Lista de datos requeridos después de eliminar:", this.listaDatosRequeridos);

      // Limpiar la selección después de eliminar
      this.selectedDatoRequerido = null;
      console.log("Dato requerido eliminado con éxito");
    } else {
      this.errorMessage = 'Debe seleccionar un dato requerido para eliminarlo.';
    }
  }

  // Deshabilitar el cambio de tipo de dato después de seleccionarlo
  onTipoDatoChange(event: any) {
    if (this.listaDatosRequeridos.length === 0) {
      this.tipoDatoSeleccionado = event.target.value;
    } else {
      this.errorMessage = 'No se puede cambiar el tipo de dato hasta que termine la operación actual.';
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
}

