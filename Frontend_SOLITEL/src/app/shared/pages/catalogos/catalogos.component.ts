import { Component } from '@angular/core';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { TablaCatalogosComponent } from '../../components/tabla-catalogos/tabla-catalogos.component';

@Component({
  selector: 'app-catalogos',
  standalone: true,
  imports: [SidebarComponent, FooterComponent, RouterOutlet, NavbarComponent, TablaCatalogosComponent],
  templateUrl: './catalogos.component.html',
  styleUrl: './catalogos.component.css'
})
export default class CatalogosComponent {
  tableHeaders = ['ID', 'Nombre', 'Descripción'];
  tableData = [
    { id: 1, nombre: 'Producto 1', descripcion: 'Descripción del producto 1' },
    { id: 2, nombre: 'Producto 2', descripcion: 'Descripción del producto 2' },
    { id: 3, nombre: 'Producto 3', descripcion: 'Descripción del producto 3' }
  ];
}
