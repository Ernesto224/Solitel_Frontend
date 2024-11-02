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

  // Método de envío del formulario
  onSubmit() {
    this.authService.login();
    this.router.navigate(['/']);
  }

}
