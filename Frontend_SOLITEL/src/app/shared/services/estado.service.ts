import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EstadoService {

  private urlObtenerEstados: string = "https://localhost:7211/api/Estado";

  constructor(private http: HttpClient) { }

  // Método para obtener los estados desde la API
  public obtenerEstados(): Observable<any[]> {
    return this.http.get<any[]>(`${this.urlObtenerEstados}`);
  }
}
