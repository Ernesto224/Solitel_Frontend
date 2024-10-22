import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { AnalisisTelefonicoService } from '../../services/analisis-telefonico.service';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-analisis-telefonico',
  standalone: true,
  templateUrl: './analisis-telefonico.component.html',
  styleUrls: ['./analisis-telefonico.component.css'],
  imports: [
    SidebarComponent,
    FooterComponent,
    RouterOutlet,
    NavbarComponent,
    ReactiveFormsModule,
    CommonModule,
  ],
})
export default class AnalisisTelefonicoComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  solicitudAnalisisId: number = 1; // Cambia esto por el ID correspondiente
  requerimientos: any[] = [];
  private subscription: Subscription = new Subscription();

  constructor(
    private fb: FormBuilder,
    private analisisTelefonicoService: AnalisisTelefonicoService
  ) {}

  ngOnInit(): void {
    this.inicializarFormulario();
    this.obtenerSolicitudesAnalisis(); // Simulación o carga de datos reales
  }

  // Inicializar el formulario reactivo con validaciones
  inicializarFormulario(): void {
    this.form = this.fb.group({
      objetivo: ['', Validators.required],
      utilizadoPor: ['', Validators.required],
      tipoObjetivo: ['', Validators.required],
    });
  }

  // Simular la carga de requerimientos o cargar desde el backend
  obtenerSolicitudesAnalisis(): void {
    this.requerimientos = [
      {
        tN_IdRequerimientoAnalisis: 1,
        tC_Objetivo: 'Objetivo 1',
        tC_UtilizadoPor: 'Usuario 1',
        tN_IdTipo: 1,
      },
      {
        tN_IdRequerimientoAnalisis: 2,
        tC_Objetivo: 'Objetivo 2',
        tC_UtilizadoPor: 'Usuario 2',
        tN_IdTipo: 2,
      },
    ];
  }

  // Agregar un nuevo requerimiento desde el formulario
  agregarRequerimiento(): void {
    if (this.form.valid) {
      const nuevoRequerimiento = {
        tN_IdRequerimientoAnalisis: this.requerimientos.length + 1,
        tC_Objetivo: this.form.value.objetivo,
        tC_UtilizadoPor: this.form.value.utilizadoPor,
        tN_IdTipo: this.form.value.tipoObjetivo,
        tN_IdAnalisis: this.solicitudAnalisisId,
      };

      this.requerimientos.push(nuevoRequerimiento); // Agregar al arreglo local
      console.log('Requerimiento agregado con éxito:', nuevoRequerimiento);
      this.form.reset(); // Limpiar el formulario tras la adición
    } else {
      console.error('Formulario inválido');
    }
  }

  // Editar un requerimiento existente usando el índice
  editarRequerimiento(index: number): void {
    const requerimiento = this.requerimientos[index];

    requerimiento.tC_Objetivo = this.form.value.objetivo;
    requerimiento.tC_UtilizadoPor = this.form.value.utilizadoPor;
    requerimiento.tN_IdTipo = this.form.value.tipoObjetivo;

    console.log('Requerimiento editado con éxito:', requerimiento);
  }

  // Cargar datos de un requerimiento en el formulario para editar
  cargarRequerimientoEnFormulario(index: number): void {
    const requerimiento = this.requerimientos[index];
    this.form.patchValue({
      objetivo: requerimiento.tC_Objetivo,
      utilizadoPor: requerimiento.tC_UtilizadoPor,
      tipoObjetivo: requerimiento.tN_IdTipo,
    });
  }

  // Eliminar un requerimiento desde el frontend (sin backend)
  eliminarRequerimiento(index: number): void {
    this.requerimientos.splice(index, 1); // Eliminar del arreglo
    console.log('Requerimiento eliminado:', index);
  }

  // Enviar la solicitud completa con todos los requerimientos al backend
  enviarSolicitud(): void {
    const solicitudCompleta = {
      tN_IdAnalisis: this.solicitudAnalisisId,
      requerimientos: this.requerimientos, // Arreglo de requerimientos añadidos
    };

    this.subscription.add(
      this.analisisTelefonicoService
        .agregarSolicitudAnalisis(solicitudCompleta)
        .subscribe((response) => {
          console.log('Solicitud enviada con éxito:', response);
        })
    );
  }

  // Desuscribirse al destruir el componente
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
