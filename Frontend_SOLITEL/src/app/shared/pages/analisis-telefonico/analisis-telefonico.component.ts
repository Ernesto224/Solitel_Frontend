import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AnalisisTelefonicoService, SolicitudProveedor, OficinaAnalisis, RequerimentoAnalisis, SolicitudAnalisis } from '../../services/analisis-telefonico.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-analisis-telefonico',
  standalone: true, // Importamos los módulos necesarios
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './analisis-telefonico.component.html',
  styleUrls: ['./analisis-telefonico.component.css'],
})
export default class AnalisisTelefonicoComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  solicitudAnalisisId: number = 1;
  requerimientos: RequerimentoAnalisis[] = [];
  solicitudesProveedor: SolicitudProveedor[] = [];
  oficinasAnalisis: OficinaAnalisis[] = [];
  numerosUnicos: number[] = [];
  selectedIndex: number | null = null;
  editMode: boolean = false;
  private subscription = new Subscription();

  constructor(private fb: FormBuilder, private analisisService: AnalisisTelefonicoService) {}

  ngOnInit(): void {
    this.cargarNumerosUnicos();
    this.cargarOficinasAnalisis();

    // Inicializamos el form con los controles y validaciones
    this.form = this.fb.group({
      numeroUnico: ['', Validators.required],
      solicitudesProveedor: [''],
      oficinaAnalisis: ['', Validators.required],
      tipoAnalisis: ['', Validators.required],
      objetivosAnalisis: ['', Validators.required],
      fechaHecho: ['', Validators.required],
      otrosObjetivos: [''],
      otrosDetalles: [''],

      // Campos de registros de requerimientos
      tipoObjetivo: ['', Validators.required],
      objetivo: ['', Validators.required],
      utilizadoPor: ['', Validators.required],
      condicion: ['', Validators.required]
    });

    // Escuchar cambios en el número único para cargar las solicitudes relacionadas
    this.form.get('numeroUnico')?.valueChanges.subscribe((numeroUnico) => {
      if (numeroUnico) {
        this.cargarSolicitudesPorNumeroUnico(numeroUnico);
      }
    });
  }

  // Cargar los números únicos desde el servicio
  cargarNumerosUnicos(): void {
    this.analisisService.obtenerNumerosUnicos().subscribe(
      (numeros) => {
        this.numerosUnicos = numeros;
      },
      (error) => {
        console.error('Error al cargar números únicos:', error);
      }
    );
  }

  // Cargar oficinas de análisis desde el servicio
  cargarOficinasAnalisis(): void {
    this.analisisService.obtenerOficinasAnalisis().subscribe(
      (oficinas) => {
        this.oficinasAnalisis = oficinas;
      },
      (error) => {
        console.error('Error al cargar oficinas de análisis:', error);
      }
    );
  }

  // Cargar solicitudes vinculadas al número único seleccionado
  cargarSolicitudesPorNumeroUnico(numeroUnico: number): void {
    this.analisisService.obtenerSolicitudesPorNumeroUnico(numeroUnico).subscribe(
      (solicitudes) => {
        this.solicitudesProveedor = solicitudes;
      },
      (error) => {
        console.error('Error al cargar solicitudes:', error);
      }
    );
  }

  // Método para agregar un nuevo requerimiento o actualizar uno existente
  agregarRequerimiento(): void {
    const nuevoRequerimiento: RequerimentoAnalisis = {
      TN_IdRequerimento: this.requerimientos.length + 1,  // Generamos un ID automáticamente
      TC_TipoObjetivo: this.form.get('tipoObjetivo')?.value,
      TC_Objetivo: this.form.get('objetivo')?.value,
      TC_UtilizadoPor: this.form.get('utilizadoPor')?.value,
      TC_Condicion: this.form.get('condicion')?.value
    };
    
    if (this.editMode && this.selectedIndex !== null) {
      // Actualizar el requerimiento existente
      this.requerimientos[this.selectedIndex] = { ...nuevoRequerimiento };
      this.editMode = false;
      this.selectedIndex = null;
    } else {
      // Agregar un nuevo requerimiento
      this.requerimientos.push(nuevoRequerimiento);
    }

    // Limpiar el formulario después de agregar o editar
    this.form.patchValue({
      tipoObjetivo: '',
      objetivo: '',
      utilizadoPor: '',
      condicion: ''
    });
  }

  // Cargar el requerimiento seleccionado en el formulario para edición
  cargarRequerimientoEnFormulario(index: number): void {
    if (index !== null && index >= 0 && index < this.requerimientos.length) {
      const requerimiento = this.requerimientos[index];
      this.selectedIndex = index;
      this.editMode = true;
      this.form.patchValue({
        tipoObjetivo: requerimiento.TC_TipoObjetivo,
        objetivo: requerimiento.TC_Objetivo,
        utilizadoPor: requerimiento.TC_UtilizadoPor,
        condicion: requerimiento.TC_Condicion
      });
    }
  }

  // Eliminar un requerimiento
  eliminarRequerimiento(index: number): void {
    if (index !== null && index >= 0 && index < this.requerimientos.length) {
      this.requerimientos.splice(index, 1);
      this.limpiarFormulario();
    }
  }

  // Enviar la solicitud completa
  enviarSolicitud(): void {
    const solicitudCompleta: SolicitudAnalisis = {
      TN_IdSolicitudAnalisis: this.solicitudAnalisisId,
      TF_FechaDelHecho: this.form.get('fechaHecho')?.value,
      TC_OtrosDetalles: this.form.get('otrosDetalles')?.value,
      TC_OtrosObjetivosDeAnalisis: this.form.get('otrosObjetivos')?.value,
      TB_Aprobado: false,  // Por defecto no aprobado
      TN_NumeroSolicitud: this.form.get('numeroUnico')?.value,
      TN_IdOficina: this.form.get('oficinaAnalisis')?.value,
      requerimentos: this.requerimientos
    };

    console.log('Solicitud enviada con éxito:', solicitudCompleta);
    this.analisisService.agregarSolicitudAnalisis(solicitudCompleta).subscribe(
      (response) => {
        console.log('Respuesta del servidor:', response);
      },
      (error) => {
        console.error('Error al enviar la solicitud:', error);
      }
    );
  }

  // Limpiar el formulario y salir del modo edición
  limpiarFormulario(): void {
    this.form.reset(); // Restablecer los campos del formulario
    this.editMode = false; // Salir del modo de edición
    this.selectedIndex = null; // Reiniciar el índice seleccionado
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
