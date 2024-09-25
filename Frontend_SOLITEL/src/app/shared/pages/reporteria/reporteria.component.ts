import { Component } from '@angular/core';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FooterComponent } from '../../components/footer/footer.component';

@Component({
  selector: 'app-reporteria',
  standalone: true,
  imports: [SidebarComponent, RouterOutlet, NavbarComponent, FooterComponent],
  templateUrl: './reporteria.component.html',
  styleUrl: './reporteria.component.css'
})
export default class ReporteriaComponent {

}
