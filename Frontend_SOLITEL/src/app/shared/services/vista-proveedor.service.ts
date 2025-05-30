import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VistaProveedorService {

  private apiUrl = 'https://localhost:7211/api/SolicitudProveedor'; // URL base de la API

  constructor(private http: HttpClient) { }

  // Método para obtener todas las solicitudes (envía idSolicitud=0)
  obtenerTodasLasSolicitudesProveedor(): Observable<any> {
    const url = `${this.apiUrl}/obtenerSolicitudesProveedorPorId?idSolicitud=0`;
    return this.http.get<any>(url);
  }

  // Método para obtener una solicitud específica según el id
  obtenerSolicitudProveedorPorId(idSolicitud: number): Observable<any> {
    const url = `${this.apiUrl}/obtenerSolicitudesProveedorPorId?idSolicitud=${idSolicitud}`;
    return this.http.get<any>(url);
  }
}
