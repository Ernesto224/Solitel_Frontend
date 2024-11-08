import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NavbarSimpleComponent } from '../../components/navbar-simple/navbar-simple.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { AuthenticacionService } from '../../services/authenticacion.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms'; // Importa FormsModule

interface Permiso {
  nombre: string;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    ReactiveFormsModule,
    FormsModule, // Asegúrate de importar FormsModule aquí también
    NavbarSimpleComponent,
    FooterComponent,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export default class LoginComponent {
  // Definición del formulario reactivo
  formulario!: FormGroup;
  inicioSesion: boolean = false;
  oficinas: any[] = [];
  usuario: any = null;
  usuarioAux: any = null;
  idOficinaSeleccionada: number = 0; // Inicializa la variable como número

  constructor(
    private authService: AuthenticacionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Inicialización del formulario con FormGroup y validadores
    this.formulario = new FormGroup({
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
    });
  }

  verificarInicioSesion(): void {
    // Validación de los campos del formulario
    const usernameControl = this.formulario.get('username');
    const passwordControl = this.formulario.get('password');

    if (usernameControl && passwordControl) {
      const username = usernameControl.value;
      const password = passwordControl.value;
      console.log('NOMBRE USUARIO: ' + username);
      console.log('PASSWORD: ' + password);
      this.usuario = this.authService.login(username, password);
      if (this.usuario !== null) {
        this.oficinas = this.usuario.oficina;
        this.inicioSesion = true;
      } else {
        this.inicioSesion = false;
      }
    } else {
      console.error('Username or password field is missing.');
    }
  }

  verOficinaSeleecionada() {
    console.log(this.idOficinaSeleccionada);
  }
  guardarOficinaEscogida(): void {
    this.oficinas.forEach((oficina) => console.log(oficina));
    console.log(this.idOficinaSeleccionada);
    const oficinaSeleccionada = this.oficinas.find(
      (oficina) => oficina.idOficina === Number(this.idOficinaSeleccionada)
    );
    console.log(oficinaSeleccionada);

    if (oficinaSeleccionada) {
      // Asignar la oficina seleccionada directamente a this.usuario.oficina
      this.usuarioAux = {
        ...this.usuario, // Copiar todos los datos del usuario actual
        oficina: {
          idOficina: oficinaSeleccionada.idOficina,
          nombre: oficinaSeleccionada.nombre,
          tipo: oficinaSeleccionada.tipo,
          rol: {
            nombre: oficinaSeleccionada.rol.nombre,
            permisos: oficinaSeleccionada.rol.permisos.map(
              (permiso: Permiso) => ({ nombre: permiso.nombre })
            ),
          },
        },
      };

      console.log('USUARIO');
      console.log(this.usuarioAux);
      console.log('USUARIO');
    } else {
      console.error('No se encontró la oficina seleccionada.');
    }
  }

  guardarUsuarioOficina(): void {
    this.guardarOficinaEscogida();
    console.log(this.usuarioAux.oficina);
    if (this.usuarioAux && this.usuarioAux.oficina) {
      this.authService.agregarUsuario(this.usuarioAux, this.usuario);
      console.log('Usuario guardado en la sesión');
    } else {
      console.error('No se pudo guardar el usuario en la sesión');
    }
  }

  // Método de envío del formulario
  onSubmit(): void {
    this.router.navigate(['/']);
  }
}
