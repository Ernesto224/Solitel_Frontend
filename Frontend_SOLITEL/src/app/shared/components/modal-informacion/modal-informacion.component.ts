import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal-informacion',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal-informacion.component.html',
  styleUrls: ['./modal-informacion.component.css']
})
export class ModalInformacionComponent {
  @Input() isModalOpen = false; // Asegúrate de que este valor se pase desde el componente padre

  closeModal() {
    this.isModalOpen = false;
  }
}