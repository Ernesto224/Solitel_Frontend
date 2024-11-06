import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NavbarSimpleComponent } from '../../components/navbar-simple/navbar-simple.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { AuthenticacionService } from '../../services/authenticacion.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    ReactiveFormsModule,
    NavbarSimpleComponent,
    FooterComponent
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export default class LoginComponent {

  // Definición del formulario reactivo
  formulario!: FormGroup;

  constructor(private authService: AuthenticacionService, private router: Router) { }

  ngOnInit(): void {
    // Inicialización del formulario con FormGroup
    this.formulario = new FormGroup({
      username: new FormControl(''),
      password: new FormControl('')
    });
  }

  verificarInicioSesion(): void {
    // Validación de los campos del formulario
    const usernameControl = this.formulario.get('username');
    const passwordControl = this.formulario.get('password');
  
    if (usernameControl && passwordControl) {
      const username = usernameControl.value;
      const password = passwordControl.value;
      console.log("NOMBRE USUARIO: "+username);
      console.log("PASSWORD: "+password);
      this.authService.login(username, password);
    } else {
      console.error('Username or password field is missing.');
    }
  }
  

  // Método de envío del formulario
  onSubmit() {
    this.router.navigate(['/']);
  }

}
