import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EstadoService {

  private baseUrl: string = "https://localhost:7211/api/Estado";

  constructor(private http: HttpClient) { }

  // Método para obtener los estados desde la API
  public obtenerEstados(idUsuario?: number, idOficina?: number): Observable<any[]> {
    let params = new HttpParams();

    // Solo agrega los parámetros si tienen valores definidos
    if (idUsuario !== undefined) {
      params = params.set('idUsuario', idUsuario.toString());
    }
    if (idOficina !== undefined) {
      params = params.set('idOficina', idOficina.toString());
    }

    // Realiza la solicitud GET con los parámetros
    return this.http.get<any[]>(`${this.baseUrl}`, { params });
  }

}
