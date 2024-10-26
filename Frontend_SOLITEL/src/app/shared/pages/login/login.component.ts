import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FooterComponent } from '../../components/footer/footer.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ 
    RouterOutlet,
    CommonModule,
    ReactiveFormsModule,
    FooterComponent
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export default class LoginComponent {

   // Definición del formulario reactivo
   formulario!: FormGroup;

   constructor() {}
 
   ngOnInit(): void {
     // Inicialización del formulario con FormGroup
     this.formulario = new FormGroup({
       username: new FormControl('', Validators.required),
       password: new FormControl('', Validators.required)
     });
   }
 
   // Método de envío del formulario
   onSubmit() {
     if (this.formulario.valid) {
       const loginData = this.formulario.value;
       console.log('Formulario enviado:', loginData);
       // Aquí puedes agregar la lógica de autenticación, por ejemplo, enviando los datos a un servidor
     } else {
       console.log('Formulario inválido');
     }
   }

}
