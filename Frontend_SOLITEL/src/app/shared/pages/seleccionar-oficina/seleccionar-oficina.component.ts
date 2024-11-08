import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NavbarSimpleComponent } from '../../components/navbar-simple/navbar-simple.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { AuthenticacionService } from '../../services/authenticacion.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms'; // Importa FormsModule

@Component({
  selector: 'app-seleccionar-oficina',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, NavbarSimpleComponent, FooterComponent],
  templateUrl: './seleccionar-oficina.component.html',
  styleUrl: './seleccionar-oficina.component.css'
})
export default class SeleccionarOficinaComponent implements OnInit {

  oficinas: any[] = [];
  usuario: any = null;
  idOficinaSeleccionada: number = 0;

  constructor(
    private authService: AuthenticacionService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.oficinas = this.authService.getOficinas();
    this.usuario = this.authService.getUsuario();
  }

  guardarUsuarioOficina(): void {
    const oficinaSeleccionada = this.oficinas.find(
      (oficina) => oficina.idOficina === Number(this.idOficinaSeleccionada)
    );
    this.usuario.oficina = oficinaSeleccionada;
    this.authService.agregarUsuario(this.usuario);
    this.router.navigate(['']);
  }
}
