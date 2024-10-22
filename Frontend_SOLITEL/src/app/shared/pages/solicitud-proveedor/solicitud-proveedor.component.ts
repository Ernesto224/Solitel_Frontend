import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { DelitoService } from '../../services/delito.service';  // Importar el servicio de delitos
//import { FiscaliaService } from '../../services/fiscalia.service';  // Importar el servicio de fiscalías
import { CategoriaDelitoService } from '../../services/categoria-delito.service';  // Importar el servicio de fiscalías
import { ModalidadService } from '../../services/modalidad.service';
import { SubModalidadService } from '../../services/sub-modalidad.service';
import { TipoSolicitudService } from '../../services/tipo-solicitud.service';
import { TipoDatoService } from '../../services/tipo-dato.service';
import { SolicitudProveedorService } from '../../services/solicitud-proveedor.service';  // Agregar el servicio

@Component({
  selector: 'app-solicitud-proveedor',
  standalone: true,
  imports: [CommonModule, SidebarComponent, RouterOutlet, NavbarComponent, FooterComponent, FormsModule],
  templateUrl: './solicitud-proveedor.component.html',
  styleUrls: ['./solicitud-proveedor.component.css']
})
export default class SolicitudProveedorComponent {
  isModalOpen = false;
  isUrgent = false;
  categoriasDelito: any[] = [];
  fiscalias: any[] = [];
  delitos: any[] = [];
  modalidades: any[] = [];
  subModalidades: any[] = [];
  tiposSolicitud: any[] = [];
  tiposDato: any[] = [];
  listaSolicitudes: any[] = [];

  // Propiedades adicionales
  tipoSolicitudSeleccionada: any = '';   // Para almacenar el tipo de solicitud seleccionado
  requerimiento: string = '';            // Para almacenar el requerimiento
  fechaInicio: string = '';              // Para almacenar la fecha de inicio
  fechaFinal: string = '';               // Para almacenar la fecha final

  //dato requerido info
  datoRequerido: string = '';
  repitaDatoRequerido: string = '';
  motivation: string = '';
  tipoDatoSeleccionado: any = null;
  selectedTipoDato = '';
  errorMessage: string = '';
  listaDatosRequeridos: any[] = [];
  selectedDatoRequerido: any = null;

  // Propiedades para el resto de los campos del formulario
  numeroUnico: number = 0;
  numeroCaso: number = 0;
  imputado: string = '';
  ofendido: string = '';
  resennia: string = '';
  operadoras: any[] = [];  // Suponemos que esto se obtiene de otro lado
  idUsuarioCreador: number = 1;  // Ejemplo
  idDelito: number = 0;
  idCategoriaDelito: number = 0;
  idEstado: number = 0;
  idFiscalia: number = 0;
  idOficina: number = 0;
  idModalida: number = 0;
  idSubModalidad: number = 0;
  idDelitoSeleccionado: number = 0;
  idCategoriaDelitoSeleccionado: number = 0;
  idEstadoSeleccionado: number = 0;
  idOficinaSeleccionada: number = 0;
  idModalidadSeleccionada: number = 0;
  idSubModalidadSeleccionada: number = 0;





  constructor(
    private solicitudProveedorService: SolicitudProveedorService,
    private delitoService: DelitoService,
    // private fiscaliaService: FiscaliaService,
    private categoriaService: CategoriaDelitoService,
    private modalidadService: ModalidadService,
    private subModalidadService: SubModalidadService,
    private tipoSolicitudService: TipoSolicitudService,
    private tipoDatoService: TipoDatoService

  ) { }

  ngOnInit() {
    this.getCategories();
    // this.getFiscalias();
    this.getDelitos();
    this.getModalidades();
    this.getSubModalidades();
    this.getTiposSolicitud();
    this.getTiposDato();
  }

  guardarSolicitud() {
    const solicitudProveedor = {
      idSolicitudProveedor: 1,  // Nuevo registro
      numeroUnico: this.numeroUnico,
      numeroCaso: this.numeroCaso,
      imputado: this.imputado,
      ofendido: this.ofendido,
      resennia: this.resennia,
      urgente: this.isUrgent,
      requerimientos: this.listaSolicitudes, // Lista de requerimientos

      // Operadoras con valor quemado para ICE
      operadoras: [
        {
          tN_IdProveedor: 1,  // Valor de operadora quemada: ICE
          tC_Nombre: "ICE"    // El nombre de la operadora seleccionada
        }
      ],

      // Asignar la fiscalía seleccionada (id)
      idFiscalia: 1,
      idUsuarioCreador: 1, // Suponemos que es un usuario por defecto
      idDelito: this.idDelitoSeleccionado,
      idCategoriaDelito: this.idCategoriaDelitoSeleccionado,
      idEstado: 1,
      idOficina: 2,
      idModalida: this.idModalidadSeleccionada,
      idSubModalidad: this.idSubModalidadSeleccionada
    };

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


    console.log("Tipo de Solicitud Seleccionada: ", this.tipoSolicitudSeleccionada);
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
        tipoSolicitudes: [
          {
            tN_IdTipoSolicitud: this.tipoSolicitudSeleccionada.tN_IdTipoSolicitud,
            tC_Nombre: this.tipoSolicitudSeleccionada.tC_Nombre,
            tC_Descripcion: this.tipoSolicitudSeleccionada.tC_Descripcion || ''
          }
        ],
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
        console.error('Error al obtener delitos:', err);
      }
    });
  }

  getTiposDato() {
    this.tipoDatoService.obtener().subscribe({
      next: (data: any[]) => {
        this.tiposDato = data;
      },
      error: (err: any) => {
        console.error('Error al obtener tipos de dato:', err);
      }
    });
  }

  getTiposSolicitud() {
    this.tipoSolicitudService.obtener().subscribe({
      next: (data: any[]) => {
        this.tiposSolicitud = data;
      },
      error: (err: any) => {
        console.error('Error al obtener tipos de solicitud:', err);
      }
    });
  }

  getSubModalidades() {
    this.subModalidadService.obtener().subscribe({
      next: (data: any[]) => {
        this.subModalidades = data;
      },
      error: (err: any) => {
        console.error('Error al obtener submodalidades:', err);
      }
    });
  }


  getModalidades() {
    this.modalidadService.obtener().subscribe({
      next: (data: any[]) => {
        this.modalidades = data;
      },
      error: (err: any) => {
        console.error('Error al obtener modalidades:', err);
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
        console.error('Error al obtener categorías de delito:', err);
      }
    });
  }

  // Método para obtener fiscalías
  /*getFiscalias() {
    this.fiscaliaService.obtenerFiscalias().subscribe({
      next: (data: any[]) => {
        this.fiscalias = data;
        console.log(this.fiscalias);
      },
      error: (err: any) => {
        console.error('Error al obtener fiscalías:', err);
      }
    });
  }*/
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
          tN_IdTipoDato: this.tipoDatoSeleccionado.tN_IdTipoDato, // El ID del tipo de dato seleccionado
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

