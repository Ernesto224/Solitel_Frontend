import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal-procesando',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal-procesando.component.html',
  styleUrls: ['./modal-procesando.component.css']
})
export class ModalProcesandoComponent {
  @Input() isModalVisible: boolean = false; // Input para controlar la visibilidad del modal

  closeModal(): void {
    this.isModalVisible = false; // Método para cerrar el modal
  }
}
