import { Component, OnInit } from '@angular/core';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { TablaCatalogosComponent } from '../../components/tabla-catalogos/tabla-catalogos.component';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { CategoriaDelitoService } from '../../services/categoria-delito.service';
import { DelitoService } from '../../services/delito.service';
import { CondicionService } from '../../services/condicion.service';
import { ModalidadService } from '../../services/modalidad.service';
import { SubModalidadService } from '../../services/sub-modalidad.service';
import { TipoDatoService } from '../../services/tipo-dato.service';
import { TipoSolicitudService } from '../../services/tipo-solicitud.service';
import { CommonModule } from '@angular/common';
import { from } from 'rxjs';

@Component({
  selector: 'app-catalogos',
  standalone: true,
  imports: [
    SidebarComponent,
    FooterComponent,
    RouterOutlet,
    NavbarComponent,
    TablaCatalogosComponent,
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './catalogos.component.html',
  styleUrls: ['./catalogos.component.css']
})
export default class CatalogosComponent implements OnInit {

  catalogoForm!: FormGroup;
  dependencias: { id: string, nombre: string }[] = [];
  encabezadosTabla: any[] = [''];
  contenidoTabla: any[] = [];
  selectedCatalog!: string;  // Almacena el catálogo seleccionado
  
  constructor(
    private delitoService: DelitoService,
    private categoriaService: CategoriaDelitoService,
    private condicionService: CondicionService,
    private modalidadService: ModalidadService,
    private subModalidadService: SubModalidadService,
    private tipoDatoService: TipoDatoService,
    private tipoSolicitudService: TipoSolicitudService
  ) { }

  ngOnInit(): void {
    // Inicializamos el FormGroup con los controles
    this.catalogoForm = new FormGroup({
      catalog: new FormControl('', Validators.required),
      name: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      dependency: new FormControl({ value: '', disabled: true }, Validators.required)  // Deshabilitado inicialmente
    });

    // Escuchar cambios en el campo "catalog"
    this.catalogoForm.get('catalog')?.valueChanges.subscribe(selectedCatalog => {
      if (selectedCatalog) {
        this.selectedCatalog = selectedCatalog; // Guardamos el catálogo seleccionado
        this.actualizarDependencias(selectedCatalog);
        this.actualizarDatosTabla(selectedCatalog);
      }
    });
  }

  // Función para manejar el envío del formulario
  onSubmit(): void {
    if (this.catalogoForm.valid) {
      const formData = this.catalogoForm.value;
      console.log('Datos del formulario:', formData);
      this.enviarSolicitudBasadaEnCatalogo(formData);
    }
  }

  // Función para manejar el evento de limpiar el formulario
  onReset(): void {
    this.catalogoForm.reset();
    this.encabezadosTabla = [' ']; // Encabezado vacío para casos no implementados
    this.contenidoTabla = []; // Tabla vacía
  }

  // Actualizar dependencias (categorías de delitos o modalidades) basado en el catálogo seleccionado
  actualizarDependencias(selectedCatalog: string): void {
    this.dependencias = [];  // Resetear el arreglo de dependencias
    const dependencyControl = this.catalogoForm.get('dependency');

    switch (selectedCatalog) {

      case 'Delito':
        // Si es Delito, cargar categorías de delitos
        this.categoriaService.obtener().subscribe(response => {
          this.dependencias = response.map((cat: any) => ({ id: cat.idCategoriaDelito, nombre: cat.nombre }));  // Asigna las categorías
          dependencyControl?.enable();  // Habilitar el control
        });
        break;
      case 'SubModalidad':
        // Si es SubModalidad, cargar modalidades
        this.modalidadService.obtener().subscribe(response => {
          this.dependencias = response.map((mod: any) => ({ id: mod.tN_IdModalidad, nombre: mod.tC_Nombre }));  // Asigna las modalidades
          dependencyControl?.enable();  // Habilitar el control
        });
        break;

      default:
        // Para otros catálogos, deshabilitar el campo de dependencia
        dependencyControl?.setValue('');  // Limpiar el valor del campo
        dependencyControl?.disable();  // Deshabilitar el campo
    }
  }

  actualizarDatosTabla(selectedCatalog: string): void {
    switch (selectedCatalog) {
      case 'Delito':
        this.delitoService.obtener().subscribe((response: any) => {
          this.encabezadosTabla = ['tN_IdDelito', 'tC_Nombre', 'tN_IdCategoriaDelito', 'tN_IdCategoriaDelito', ' ']; // Encabezados para delitos
          this.contenidoTabla = response;
        });
        break;
  
      case 'Modalidad':
        this.modalidadService.obtener().subscribe((response: any) => {
          this.encabezadosTabla = ['tN_IdModalidad', 'tC_Nombre', 'tC_Descripcion']; // Encabezados para modalidades
          this.contenidoTabla = response;
        });
        break;
  
      case 'SubModalidad':
        this.subModalidadService.obtener().subscribe((response: any) => {
          this.encabezadosTabla = ['tN_IdSubModalidad', 'tC_Nombre', 'tC_Descripcion', 'tN_IdModalida', ' ']; // Encabezados para submodalidades
          this.contenidoTabla = response;
        });
        break;
  
      case 'Condicion':
        this.condicionService.obtener().subscribe((response: any) => {
          this.encabezadosTabla = ['tN_IdCondicion', 'tC_Nombre', 'tC_Descripcion']; // Encabezados para condiciones
          this.contenidoTabla = response;
        });
        break;
  
      case 'CategoriaDelito':
        this.categoriaService.obtener().subscribe((response: any) => {
          this.encabezadosTabla = ['idCategoriaDelito', 'nombre', 'descripcion']; // Encabezados para categoría delito
          this.contenidoTabla = response;
        });
        break;
  
      case 'TipoDato':
        this.tipoDatoService.obtener().subscribe((response: any) => {
          this.encabezadosTabla = ['tN_IdTipoDato', 'tC_Nombre', 'tC_Descripcion']; // Encabezados para tipo de datos
          this.contenidoTabla = response;
        });
        break;
  
      case 'TipoSolicitud':
        this.tipoSolicitudService.obtener().subscribe((response: any) => {
          this.encabezadosTabla = ['tN_IdTipoSolicitud', 'tC_Nombre', 'tC_Descripcion']; // Encabezados para tipo de solicitudes
          this.contenidoTabla = response;
        });
        break;
  
      default:
        this.encabezadosTabla = [' ']; // Encabezado vacío para casos no implementados
        this.contenidoTabla = []; // Tabla vacía
        break;
    }
  }
  
  // Función que envía una solicitud dependiendo del catálogo seleccionado
  enviarSolicitudBasadaEnCatalogo(formData: any) {
    const { catalog, name, description, dependency } = formData; // Desestructuramos los valores del formulario

    switch (catalog) {
      case 'CategoriaDelito':
        // Llamar al servicio para insertar "Categoria Delito"
        this.categoriaService.insertar({
          idCategoriaDelito: 0,
          nombre: name,
          descripcion: description
        }).subscribe(response => {
          console.log('Inserción de Categoria Delito exitosa:', response);
        }, error => {
          console.error('Error al insertar Categoria Delito:', error);
        });
        break;

      case 'Condicion':
        // Llamar al servicio para insertar "Condición"
        this.condicionService.insertar({
          tN_IdCondicion: 0,
          tC_Nombre: name,
          tC_Descripcion: description
        }).subscribe(response => {
          console.log('Inserción de Condición exitosa:', response);
        }, error => {
          console.error('Error al insertar Condición:', error);
        });
        break;

      case 'Delito':
        // Llamar al servicio para insertar "Delito"
        this.delitoService.insertar({
          tN_IdDelito: 0,
          tC_Nombre: name,
          tC_Descripcion: description,
          tN_IdCategoriaDelito: dependency // ID de la categoría de delito seleccionado
        }).subscribe(response => {
          console.log('Inserción de Delito exitosa:', response);
        }, error => {
          console.error('Error al insertar Delito:', error);
        });
        break;

      case 'Modalidad':
        // Llamar al servicio para insertar "Modalidad"
        this.modalidadService.insertar({
          tN_IdModalidad: 0,
          tC_Nombre: name,
          tC_Descripcion: description
        }).subscribe(response => {
          console.log('Inserción de Modalidad exitosa:', response);
        }, error => {
          console.error('Error al insertar Modalidad:', error);
        });
        break;

      case 'SubModalidad':
        // Llamar al servicio para insertar "SubModalidad"
        this.subModalidadService.insertar({
          tN_IdSubModalidad: 0,
          tC_Nombre: name,
          tC_Descripcion: description,
          tN_IdModalida: dependency // ID de la modalidad seleccionada
        }).subscribe(response => {
          console.log('Inserción de SubModalidad exitosa:', response);
        }, error => {
          console.error('Error al insertar SubModalidad:', error);
        });
        break;

      case 'TipoDato':
        // Llamar al servicio para insertar "Tipo Dato"
        this.tipoDatoService.insertar({
          tN_IdTipoDato: 0,
          tC_Nombre: name,
          tC_Descripcion: description
        }).subscribe(response => {
          console.log('Inserción de Tipo Dato exitosa:', response);
        }, error => {
          console.error('Error al insertar Tipo Dato:', error);
        });
        break;

      case 'TipoSolicitud':
        // Llamar al servicio para insertar "Tipo Solicitud"
        this.tipoSolicitudService.insertar({
          tN_IdTipoSolicitud: 0,
          tC_Nombre: name,
          tC_Descripcion: description
        }).subscribe(response => {
          console.log('Inserción de Tipo Solicitud exitosa:', response);
        }, error => {
          console.error('Error al insertar Tipo Solicitud:', error);
        });
        break;

      default:
        console.log('No hay lógica implementada para este catálogo.');
    }

    
  }

   // Método que se pasa como parámetro para eliminar una fila de la tabla
   eliminarElemento(row: any) {
    const selectedCatalog = this.selectedCatalog;
    if (!selectedCatalog) {
      return;
    }

    switch (selectedCatalog) {
      case 'CategoriaDelito':
        this.categoriaService.eliminar(row.idCategoriaDelito).subscribe(response => {
          console.log('Elemento eliminado de Categoria Delito:', response);
          this.actualizarDatosTabla(selectedCatalog);  // Refrescamos la tabla después de eliminar
        });
        break;

      case 'Condicion':
        this.condicionService.eliminar(row.tN_IdCondicion).subscribe(response => {
          console.log('Elemento eliminado de Condicion:', response);
          this.actualizarDatosTabla(selectedCatalog);
        });
        break;

      case 'Delito':
        this.delitoService.eliminar(row.tN_IdDelito).subscribe(response => {
          console.log('Elemento eliminado de Delito:', response);
          this.actualizarDatosTabla(selectedCatalog);
        });
        break;

      case 'Modalidad':
        this.modalidadService.eliminar(row.tN_IdModalidad).subscribe(response => {
          console.log('Elemento eliminado de Modalidad:', response);
          this.actualizarDatosTabla(selectedCatalog);
        });
        break;

      case 'SubModalidad':
        this.subModalidadService.eliminar(row.tN_IdSubModalidad).subscribe(response => {
          console.log('Elemento eliminado de SubModalidad:', response);
          this.actualizarDatosTabla(selectedCatalog);
        });
        break;

      case 'TipoDato':
        this.tipoDatoService.eliminar(row.tN_IdTipoDato).subscribe(response => {
          console.log('Elemento eliminado de Tipo Dato:', response);
          this.actualizarDatosTabla(selectedCatalog);
        });
        break;

      case 'TipoSolicitud':
        this.tipoSolicitudService.eliminar(row.tN_IdTipoSolicitud).subscribe(response => {
          console.log('Elemento eliminado de Tipo Solicitud:', response);
          this.actualizarDatosTabla(selectedCatalog);
        });
        break;

      default:
        console.log('Catálogo no implementado para eliminación.');
    }
  }
}
