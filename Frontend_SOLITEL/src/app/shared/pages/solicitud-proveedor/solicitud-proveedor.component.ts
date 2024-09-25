import { Component } from '@angular/core';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FooterComponent } from '../../components/footer/footer.component';

@Component({
  selector: 'app-solicitud-proveedor',
  standalone: true,
  imports: [SidebarComponent, RouterOutlet, NavbarComponent, FooterComponent],
  templateUrl: './solicitud-proveedor.component.html',
  styleUrl: './solicitud-proveedor.component.css'
})
export default class SolicitudProveedorComponent {

}
