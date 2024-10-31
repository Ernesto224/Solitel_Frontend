import { Component, OnInit } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { FooterComponent } from '../footer/footer.component';
import BandejaComponent from "../../pages/bandeja/bandeja.component";
import { AuthenticacionService } from '../../services/authenticacion.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [SidebarComponent, CommonModule, RouterLink, RouterLinkActive, FooterComponent, BandejaComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {

  isSidebarVisible = false;
  isProfileDropdownVisible = false;
  usuarioNombre = ''; // Nombre del usuario
  usuarioOficina = ''; // Oficina del usuario

  constructor(private authService: AuthenticacionService) { }

  ngOnInit(): void {
    // Obtener datos del usuario al iniciar el componente
    const usuario = this.authService.getUsuario();
    if (usuario) {
      this.usuarioNombre = usuario.nombre;
      this.usuarioOficina = usuario.oficina.nombre;
    }
  }

  toggleSidebar() {
    this.isSidebarVisible = !this.isSidebarVisible;
  }

  toggleProfileDropdown() {
    this.isProfileDropdownVisible = !this.isProfileDropdownVisible;
  }

  logout() {
    this.authService.logout(); // Llamada al servicio para cerrar sesión
    window.location.href = '/login'; // Redirigir a la página de inicio de sesión
  }

  changeOffice() {
    // Lógica para cambiar de oficina si está disponible
    console.log('Cambiar de oficina');
  }

}