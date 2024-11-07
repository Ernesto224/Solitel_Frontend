import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-alerta',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './alerta.component.html',
  styleUrls: ['./alerta.component.css']
})
export class AlertaComponent implements OnInit {
  @Input() tipo: string = 'satisfaccion';
  @Input() mensaje: string = '';
  @Input() visible: boolean = false;

  backgroundColor: string = '#ffffff'; // Fondo del contenedor
  color: string = '#000000';           // Color de todo el texto

  ngOnInit(): void {
    this.aplicarEstilos();
  }

  cerrarAlerta() {
    this.visible = false;
  }

  aplicarEstilos() {
    // Asignación de valores de estilo según el tipo
    switch (this.tipo) {
      case 'satisfaccion':
        this.backgroundColor = '#D7F6E4';
        this.color = '#416150';
        break;
      case 'error':
        this.backgroundColor = '#FFAEB0';
        this.color = '#700000';
        break;
      case 'advertencia':
        this.backgroundColor = '#FFCA28';
        this.color = '#000000';
        break;
      default:
        this.backgroundColor = '#D7F6E4';
        this.color = '#416150';
    }
  }
}
