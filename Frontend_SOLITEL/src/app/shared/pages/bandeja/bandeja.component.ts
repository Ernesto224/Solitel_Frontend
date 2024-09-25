import { Component } from '@angular/core';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar.component';

@Component({
  selector: 'app-bandeja',
  standalone: true,
  imports: [SidebarComponent, FooterComponent, RouterOutlet, NavbarComponent],
  templateUrl: './bandeja.component.html',
  styleUrl: './bandeja.component.css'
})
export default class BandejaComponent {

}
