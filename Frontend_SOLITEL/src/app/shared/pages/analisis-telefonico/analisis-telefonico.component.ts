import { Component } from '@angular/core';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar.component';

@Component({
  selector: 'app-analisis-telefonico',
  standalone: true,
  imports: [SidebarComponent, FooterComponent, RouterOutlet, NavbarComponent],
  templateUrl: './analisis-telefonico.component.html',
  styleUrl: './analisis-telefonico.component.css',
})
export default class AnalisisTelefonicoComponent {
  
}
