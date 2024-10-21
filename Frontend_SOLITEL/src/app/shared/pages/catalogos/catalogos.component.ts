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
  catalogoSeleccionado!: string;
  catalogos: { value: string, nombre: string }[] = [
    { value: 'CategoriaDelito', nombre: 'Categoría Delito' },
    { value: 'Condicion', nombre: 'Condición' },
    { value: 'Delito', nombre: 'Delito' },
    { value: 'Fiscalia', nombre: 'Fiscalía' },
    { value: 'Modalidad', nombre: 'Modalidad' },
    { value: 'SubModalidad', nombre: 'Submodalidad' },
    { value: 'TipoDato', nombre: 'Tipo de Dato' },
    { value: 'TipoSolicitud', nombre: 'Tipo de Solicitud' }
  ];
  
  constructor(
    private delitoService: DelitoService,
    private categoriaService: CategoriaDelitoService,
    private condicionService: CondicionService,
    private modalidadService: ModalidadService,
    private subModalidadService: SubModalidadService,
    private tipoDatoService: TipoDatoService,
    private tipoSolicitudService: TipoSolicitudService
  ) {

    this.servicios = {
      'Delito': this.delitoService,
      'Modalidad': this.modalidadService,
      'SubModalidad': this.subModalidadService,
      'Condicion': this.condicionService,
      'CategoriaDelito': this.categoriaService,
      'TipoDato': this.tipoDatoService,
      'TipoSolicitud': this.tipoSolicitudService
    };

  }

  ngOnInit(): void {
    // Inicializamos el FormGroup con los controles
    this.formulario = new FormGroup({
      catalog: new FormControl('', Validators.required),
      name: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      dependency: new FormControl({ value: '', disabled: true }, Validators.required)  // Deshabilitado inicialmente
    });

    // Escuchar cambios en el campo "catalog"
    this.formulario.get('catalog')?.valueChanges.subscribe(selectedCatalog => {
      if (selectedCatalog) {
        this.catalogoSeleccionado = selectedCatalog; // Guardamos el catálogo seleccionado
        this.activarDependencias(selectedCatalog);
        this.actualizarTabla(selectedCatalog);
      }
    });
  }

  onSubmit(): void {
    if (this.formulario.valid) {
      const formData = this.formulario.value;
      this.insertarCatalogoSeleccionado(formData);
    }
  }

  onReset(): void {
    this.formulario.reset();
    this.encabezados = []; // Encabezado vacío para casos no implementados
    this.contenido = []; // Tabla vacía
  }

  get keys(): string[] {
    return this.contenido.length > 0 ? Object.keys(this.contenido[0]) : [];
  }

  optenerId(row: any): any {
    //devuelve la primera propiedad
    return row[Object.keys(row)[0]];
  }

  actualizarTabla(selectedCatalog: string): void {

    const servicio = this.servicios[selectedCatalog];

    servicio.obtener().subscribe((response: any) => {
      this.contenido = response;
      this.encabezados = this.keys;
    });

  }

  insertarCatalogoSeleccionado(formData: any) {

    const { catalog, name, description, dependency } = formData;

    const catalogDataMap: { [key: string]: any } = {
      'CategoriaDelito': { idCategoriaDelito: 0, nombre: name, descripcion: description },
      'Condicion': { tN_IdCondicion: 0, tC_Nombre: name, tC_Descripcion: description },
      'Delito': { tN_IdDelito: 0, tC_Nombre: name, tC_Descripcion: description, tN_IdCategoriaDelito: dependency },
      'Modalidad': { tN_IdModalidad: 0, tC_Nombre: name, tC_Descripcion: description },
      'SubModalidad': { tN_IdSubModalidad: 0, tC_Nombre: name, tC_Descripcion: description, tN_IdModalida: dependency },
      'TipoDato': { tN_IdTipoDato: 0, tC_Nombre: name, tC_Descripcion: description },
      'TipoSolicitud': { tN_IdTipoSolicitud: 0, tC_Nombre: name, tC_Descripcion: description }
    };

    const servicio = this.servicios[catalog];
    const data = catalogDataMap[catalog];

    if (servicio && data) {
      servicio.insertar(data).subscribe(
        (response: any) => {
          console.log(`Inserción de ${catalog} exitosa:`, response);
          this.actualizarTabla(this.catalogoSeleccionado);
        },
        (error: any) => {
          console.error(`Error al insertar ${catalog}:`, error);
        }
      );
    } else {
      console.log('No hay lógica implementada para este catálogo.');
    }

  }

  eliminarCatalogoSeleccionado(selectedCatalog: string, key: number) {

    const servicio = this.servicios[selectedCatalog];

    if (servicio && servicio.eliminar) {
      servicio.eliminar(key).subscribe((response: any) => {
        console.log(`Elemento eliminado de ${selectedCatalog}:`, response);
        this.actualizarTabla(selectedCatalog);
      });
    } else {
      console.log('Catálogo no implementado para eliminación.');
    }

  }

  activarDependencias(selectedCatalog: string): void {

    // Resetear el arreglo de dependencias
    this.dependencias = [];
    const dependencyControl = this.formulario.get('dependency');

    // Diccionario que mapea el catálogo al servicio correspondiente
    const serviceMap: { [key: string]: any } = {
      'Delito': this.categoriaService,
      'SubModalidad': this.modalidadService
    };

    // Obtener el servicio correspondiente al catálogo seleccionado
    const service = serviceMap[selectedCatalog];

    if (service && service.obtener) {
      // Si el catálogo tiene un servicio definido, obtener las dependencias
      service.obtener().subscribe((response: any) => {
        this.dependencias = response.map((item: any) => {
          // Usar un mapeo genérico según el tipo de dato
          return {
            id: item.idCategoriaDelito || item.tN_IdModalidad, // Adaptar para que funcione con ambos tipos
            nombre: item.nombre || item.tC_Nombre
          };
        });
        dependencyControl?.enable();  // Habilitar el control
      });
    } else {
      // Si el catálogo no tiene dependencias, deshabilitar el campo
      dependencyControl?.setValue('');  // Limpiar el valor del campo
      dependencyControl?.disable();  // Deshabilitar el control
    }

  }

}
