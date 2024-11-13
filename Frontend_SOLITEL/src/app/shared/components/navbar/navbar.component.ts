import { Component, OnInit } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FooterComponent } from '../footer/footer.component';
import { AuthenticacionService } from '../../services/authenticacion.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [SidebarComponent, CommonModule, RouterLink, FooterComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {

  isSidebarVisible = false;
  isProfileDropdownVisible = false;
  usuarioNombre = ''; // Nombre del usuario
  usuarioOficina = ''; // Oficina del usuario

  constructor(
    private authService: AuthenticacionService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Obtener datos del usuario al iniciar el componente
    const usuario = this.authService.getUsuario();
    if (usuario) {
      this.usuarioNombre = usuario.nombre + ' ' + usuario.apellido;
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
    this.router.navigate(['/login']);// Redirigir a la página de inicio de sesión
  }

  changeOffice() {
    this.router.navigate(['/seleccionar-oficina']); // Redirigir a la página de inicio de sesión
  }

}