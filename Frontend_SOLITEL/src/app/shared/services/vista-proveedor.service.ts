import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VistaProveedorService {

  private apiUrl = 'https://tu-backend.com/api/requerimientos'; // Reemplaza con tu URL real del backend

  constructor(private http: HttpClient) { }

  // Método para obtener los datos de los requerimientos
  obtenerRequerimientos(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }
}
