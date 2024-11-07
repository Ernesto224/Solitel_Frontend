import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NavbarSimpleComponent } from '../../components/navbar-simple/navbar-simple.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { AuthenticacionService } from '../../services/authenticacion.service';
import { OficinaService } from '../../services/oficina.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms'; // Importa FormsModule

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    ReactiveFormsModule,
    FormsModule, // Asegúrate de importar FormsModule aquí también
    NavbarSimpleComponent,
    FooterComponent
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export default class LoginComponent {

  // Definición del formulario reactivo
  formulario!: FormGroup;
  inicioSesion: boolean = false;
  oficinas: any[] = [];
  usuario: any = null;
  idOficinaSeleccionada: number = 0; // Inicializa la variable como número

  constructor(
    private authService: AuthenticacionService,
    private router: Router,
    private oficinaService: OficinaService
  ) { }

  ngOnInit(): void {
    // Verificar si el usuario ya está autenticado
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/ruta-deseada']); // Cambia '/ruta-deseada' por la ruta a la que quieres redirigir
    }

    // Inicialización del formulario con FormGroup y validadores
    this.formulario = new FormGroup({
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required)
    });
    this.obtenerOficinas();
  }

  verificarInicioSesion(): void {
    // Validación de los campos del formulario
    const usernameControl = this.formulario.get('username');
    const passwordControl = this.formulario.get('password');
  
    if (usernameControl && passwordControl) {
      const username = usernameControl.value;
      const password = passwordControl.value;
      console.log("NOMBRE USUARIO: " + username);
      console.log("PASSWORD: " + password);
      this.usuario = this.authService.login(username, password);
      if (this.usuario !== null) {
        this.inicioSesion = true;
      } else {
        this.inicioSesion = false;
      }
    } else {
      console.error('Username or password field is missing.');
    }
  }

  verOficinaSeleecionada(){
    console.log(this.idOficinaSeleccionada);
  }

  guardarOficinaEscogida(): void {
    this.oficinas.forEach(oficina => console.log(oficina));
    console.log(this.idOficinaSeleccionada);
    console.log(this.oficinas.find(oficina => oficina.idOficina === this.idOficinaSeleccionada));
    this.usuario.oficina = this.oficinas.find(oficina => oficina.idOficina === Number(this.idOficinaSeleccionada));
  }

  guardarUsuarioOficina(): void {
    this.guardarOficinaEscogida();
    console.log(this.usuario.oficina);
    if (this.usuario && this.usuario.oficina) {
      this.authService.agregarUsuario(this.usuario);
      console.log("Usuario guardado en la sesión");
    } else {
      console.error('No se pudo guardar el usuario en la sesión');
    }
  }

  obtenerOficinas(): void {
    this.oficinaService.obtener().subscribe({
      next: (data: any[]) => {
        this.oficinas = data;
      },
      error: (err: any) => {
        console.error('Error al obtener oficinas:', err);
      }
    });
  }

  // Método de envío del formulario
  onSubmit(): void {
    this.router.navigate(['/']);
  }
}
