import { Component, OnInit } from '@angular/core';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { CategoriaDelitoService } from '../../services/categoria-delito.service';
import { DelitoService } from '../../services/delito.service';
import { CondicionService } from '../../services/condicion.service';
import { ModalidadService } from '../../services/modalidad.service';
import { SubModalidadService } from '../../services/sub-modalidad.service';
import { TipoDatoService } from '../../services/tipo-dato.service';
import { TipoSolicitudService } from '../../services/tipo-solicitud.service';
import { OficinaService } from '../../services/oficina.service';
import { ProveedorService } from '../../services/proveedor.service';
import { FiscaliaService } from '../../services/fiscalia.service';
import { TipoAnalisisService } from '../../services/tipo-analisis.service';
import { ObjetivoAnalisisService } from '../../services/objetivo-analisis.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-catalogos',
  standalone: true,
  imports: [
    SidebarComponent,
    FooterComponent,
    RouterOutlet,
    NavbarComponent,
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './catalogos.component.html',
  styleUrls: ['./catalogos.component.css']
})
export default class CatalogosComponent implements OnInit {

  servicios!: { [key: string]: any };
  dependencias: { id: string, nombre: string }[] = [];
  formulario!: FormGroup;
  contenido: any[] = [];
  encabezados: any[] = [];
  contenidoPaginado: any[] = [];
  catalogos: { value: string, nombre: string }[] = [
    { value: 'CategoriaDelito', nombre: 'Categoría Delito' },
    { value: 'Condicion', nombre: 'Condición' },
    { value: 'Delito', nombre: 'Delito' },
    { value: 'Fiscalia', nombre: 'Fiscalía' },
    { value: 'Modalidad', nombre: 'Modalidad' },
    { value: 'SubModalidad', nombre: 'Submodalidad' },
    { value: 'TipoDato', nombre: 'Tipo de Dato' },
    { value: 'TipoSolicitud', nombre: 'Tipo de Solicitud' },
    { value: 'TipoAnalisis', nombre: 'Tipo de Analisis' },
    { value: 'Oficina', nombre: 'Oficina' },
    { value: 'Proveedor', nombre: 'Proveedor' },
    { value: 'ObjetivoAnalisis', nombre: 'Objetivo Analisis' }
  ];
  pageNumber: number = 1;
  pageSize: number = 5;
  catalogoSeleccionado!: string;

  constructor(
    private delitoService: DelitoService,
    private categoriaService: CategoriaDelitoService,
    private condicionService: CondicionService,
    private modalidadService: ModalidadService,
    private subModalidadService: SubModalidadService,
    private tipoDatoService: TipoDatoService,
    private tipoSolicitudService: TipoSolicitudService,
    private oficinaService: OficinaService,
    private proveedorService: ProveedorService,
    private fiscaliaService: FiscaliaService,
    private tipoAnalisisService: TipoAnalisisService,
    private objetivoAnalisis: ObjetivoAnalisisService
  ) {

    this.servicios = {
      'Delito': this.delitoService,
      'Modalidad': this.modalidadService,
      'SubModalidad': this.subModalidadService,
      'Condicion': this.condicionService,
      'CategoriaDelito': this.categoriaService,
      'TipoDato': this.tipoDatoService,
      'TipoSolicitud': this.tipoSolicitudService,
      'Oficina': this.oficinaService,
      'Proveedor': this.proveedorService,
      'Fiscalia': this.fiscaliaService,
      'TipoAnalisis': this.tipoAnalisisService,
      'ObjetivoAnalisis': this.objetivoAnalisis
    };

  }

  ngOnInit(): void {

    this.formulario = new FormGroup({
      catalog: new FormControl('', Validators.required),
      name: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      dependency: new FormControl({ value: '', disabled: true }, Validators.required)
    });

    this.formulario.get('catalog')?.valueChanges.subscribe(catalogo => {
      if (catalogo) {
        this.pageNumber = 1;
        this.obtenerDatos(catalogo);
        this.cargarDependencias(catalogo);
        this.bloquearCampos(catalogo);
        this.catalogoSeleccionado = catalogo;
      }
    });

  }

  onSubmit(): void {
    if (this.formulario.valid) {
      const formData = this.formulario.value;
      this.guardar(formData);
    }
  }

  onReset(): void {
    this.formulario.reset();
    this.encabezados = [];
    this.contenido = [];
    this.contenidoPaginado = [];
    this.pageNumber = 1;
    this.pageSize = 5;
  }

  obtenerDatos(catalogo: string): void {

    const servicio = this.servicios[catalogo];

    servicio.obtener().subscribe(
      (response: any) => {
        this.contenido = response;
        this.encabezados = this.keys;
        this.pageNumber = 1;
        this.actualizarContenidoPaginado();
      },
      (error: any) => {
        this.encabezados = [];
        this.contenido = [];
        alert(error.error);
      }
    );

  }

  cambiarTamanoPagina(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.pageSize = +target.value;
    this.pageNumber = 1; // Reinicia a la primera página
    this.actualizarContenidoPaginado();
  }

  cambiarPagina(direccion: number) {
    const maxPage = Math.ceil(this.contenido.length / this.pageSize);
    const nuevaPagina = this.pageNumber + direccion;

    if (nuevaPagina >= 1 && nuevaPagina <= maxPage) {
      this.pageNumber = nuevaPagina;
      this.actualizarContenidoPaginado();
    }
  }

  actualizarContenidoPaginado() {
    const inicio = (this.pageNumber - 1) * this.pageSize;
    const fin = inicio + this.pageSize;
    this.contenidoPaginado = this.contenido.slice(inicio, fin);
  }

  get keys(): string[] {
    return this.contenido.length > 0 ? Object.keys(this.contenido[0]) : [];
  }

  obtenerId(row: any): any {
    //devuelve la primera propiedad
    return row[Object.keys(row)[0]];
  }

  guardar(formulario: any) {

    const { catalog, name, description, dependency } = formulario;

    const formatosCatalogos: { [key: string]: any } = {
      'CategoriaDelito': { idCategoriaDelito: 0, nombre: name, descripcion: description },
      'Condicion': { idCondicion: 0, nombre: name, descripcion: description },
      'Delito': { idDelito: 0, nombre: name, descripcion: description, idCategoriaDelito: dependency },
      'Modalidad': { idModalidad: 0, nombre: name, descripcion: description },
      'SubModalidad': { idSubModalidad: 0, nombre: name, descripcion: description, idModalida: dependency },
      'TipoDato': { idTipoDato: 0, nombre: name, descripcion: description },
      'TipoSolicitud': { idTipoSolicitud: 0, nombre: name, descripcion: description },
      'Oficina': { idOficina: 0, nombre: name, tipo: description },
      'Proveedor': { idProveedor: 0, nombre: name },
      'Fiscalia': { idFiscalia: 0, nombre: name },
      'TipoAnalisis': { idTipoAnalisis: 0, nombre: name, descripcion: description },
      'ObjetivoAnalisis': { tN_IdObjetivoAnalisis: 0, tC_Nombre: name, tC_Descripcion: description }
    };

    const servicio = this.servicios[catalog];
    const data = formatosCatalogos[catalog];

    if (servicio && data) {
      servicio.insertar(data).subscribe(
        (response: any) => {
          console.log(`Inserción de ${catalog} exitosa:`, response);
          this.obtenerDatos(this.catalogoSeleccionado);
        },
        (error: any) => {
          console.error(`Error al insertar ${catalog}:`, error);
        }
      );
    } else {
      console.log('No hay lógica implementada para este catálogo.');
    }

  }

  eliminar(catalogo: string, key: number) {

    const servicio = this.servicios[catalogo];

    if (servicio && servicio.eliminar) {
      servicio.eliminar(key).subscribe(
        (response: any) => {
          console.log(`Elemento eliminado de ${catalogo}:`, response);
          this.obtenerDatos(catalogo);
        },
        (error: any) => {
          console.error(`Error al eliminar de ${catalogo}:`, error);
        }
      );
    } else {
      console.log('Catálogo no implementado para eliminación.');
    }

  }

  cargarDependencias(catalogo: string): void {
    const dependencyControl = this.formulario.get('dependency');

    // Diccionario que mapea el catálogo al servicio correspondiente
    const serviciosNecesarios: { [key: string]: any } = {
      'Delito': this.categoriaService,
      'SubModalidad': this.modalidadService
    };

    // Verificar si el catálogo requiere dependencias
    const service = serviciosNecesarios[catalogo];

    if (service) {
      // Si el catálogo tiene un servicio definido, cargar las dependencias
      service.obtener().subscribe(
        (response: any) => {
          // Mapear los datos de manera genérica
          this.dependencias = response.map((item: any) => ({
            id: item.idCategoriaDelito || item.idModalidad || item.id,  // Adaptar los IDs según el objeto
            nombre: item.nombre || item.descripcion  // Adaptar el nombre o descripción según el objeto
          }));

          // Habilitar el control de dependencias y limpiar su valor
          dependencyControl?.enable();
          dependencyControl?.setValue('');  // Limpiar el valor
        },
        (error: any) => {
          // Manejar el error de forma adecuada
          console.error('Error al cargar dependencias', error);
          dependencyControl?.setValue('');  // Limpiar el valor en caso de error
          dependencyControl?.disable();  // Deshabilitar en caso de error
        }
      );
    } else {
      // Si no es Delito ni SubModalidad, deshabilitar el campo de dependencias
      dependencyControl?.setValue('');  // Limpiar el valor del campo
      dependencyControl?.disable();  // Deshabilitar el control de dependencias
      this.dependencias = [];  // Limpiar las dependencias
    }
  }

  bloquearCampos(catalogo: string): void {
    const descriptionControl = this.formulario.get('description');
    const dependencyControl = this.formulario.get('dependency');

    // Bloquear los campos si el catálogo seleccionado es Fiscalía, Oficina o Proveedor
    if (catalogo === 'Fiscalia' || catalogo === 'Proveedor') {
      descriptionControl?.disable();  // Deshabilitar el campo de descripción
      dependencyControl?.disable();   // Deshabilitar el campo de dependencia
    } else {
      descriptionControl?.enable();   // Habilitar el campo de descripción
      if (catalogo === 'Delito' || catalogo === 'SubModalidad') {
        dependencyControl?.enable();  // Solo habilitar dependencias para Delito o SubModalidad
      } else {
        dependencyControl?.disable(); // Asegurarse de deshabilitar para otros catálogos
      }
    }
  }

}
