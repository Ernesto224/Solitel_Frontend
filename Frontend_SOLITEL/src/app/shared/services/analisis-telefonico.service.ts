import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root', // El servicio se inyecta globalmente
})
export class AnalisisTelefonicoService {
  // URL base para la API de solicitudes de análisis telefónico
  private urlServices: string = 'https://localhost:7211/api/SolicitudAnalisis/';
  private urlInsertar: string = 'insertarSolicitudAnalisis';

  constructor(private http: HttpClient) {}

  // Método para enviar una solicitud de análisis completa al backend
  public agregarSolicitudAnalisis = (
    solicitudAnalisis: any
  ): Observable<any> => {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      accept: 'text/plain',
    });
    return this.http.post(
      `${this.urlServices}${this.urlInsertar}`,
      solicitudAnalisis,
      { headers }
    );
  };
}
