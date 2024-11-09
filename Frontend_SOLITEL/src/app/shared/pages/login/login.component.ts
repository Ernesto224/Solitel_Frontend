import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NavbarSimpleComponent } from '../../components/navbar-simple/navbar-simple.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { AlertaComponent } from '../../components/alerta/alerta.component';
import { AuthenticacionService } from '../../services/authenticacion.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NavbarSimpleComponent,
    FooterComponent,
    AlertaComponent
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export default class LoginComponent implements OnInit {

  // Definición del formulario reactivo
  alertatipo: string = "error";
  alertaMensaje: string = "";
  alertaVisible: boolean = false;
  formulario!: FormGroup;
  oficinas: any[] = [];
  usuario: any = null;
  idOficinaSeleccionada: number = 0; // Inicializa la variable como número

  constructor(
    private authService: AuthenticacionService,
    private router: Router
  ) { }

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
      this.usuario = this.authService.login(username, password);
      if (this.usuario !== null) {
        this.oficinas = this.usuario.oficina;
        this.usuario = {
          idUsuario: this.usuario.idUsuario,
          nombre: this.usuario.nombre,
          apellido: this.usuario.apellido,
          correoElectronico: this.usuario.correoElectronico,
          usuario: this.usuario.usuario,
          contrasennia: this.usuario.contrasennia,
          oficina: null
        };
        this.authService.agregarUsuario(this.usuario);
        this.authService.agregarOficinas(this.oficinas);
        this.router.navigate(['/seleccionar-oficina']);
      } else {
        this.alertaMensaje = "Loggin invalido";
        this.mostrarAlerta();
      }
    } else {
      console.error('Username or password field is missing.');
    }
  }

  mostrarAlerta(): void {
    this.alertaVisible = true;

    // Opcional: Cerrar la alerta después de unos segundos
    setTimeout(() => {
      this.alertaVisible = false;
    }, 3000); // 3 segundos
  }

}
