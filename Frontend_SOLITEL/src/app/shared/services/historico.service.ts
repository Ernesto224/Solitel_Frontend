import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HistoricoService {
  
  private urlServices: string = "https://localhost:7211/api/Historial";
  private urlObtenerHistoricoAnalisis: string = '/Analisis';

  constructor(private http: HttpClient) { }

  public obtener = (idSolicitudProveedor: number): Observable<any> => {
    // Crea los parámetros de consulta
    const params = new HttpParams().set('idSolicitudProveedor', idSolicitudProveedor.toString());

    // Realiza la solicitud GET con los parámetros
    return this.http.get(this.urlServices, { params });
  }

  public obtenerHistoricoAnalisis = (idSolicitudAnalisis: number): Observable<any> => {
    // Crea los parámetros de consulta
    const params = new HttpParams().set('idSolicitudProveedor', idSolicitudAnalisis);

    // Realiza la solicitud GET con los parámetros
    return this.http.get(`${this.urlServices}${this.urlObtenerHistoricoAnalisis}`, { params });
  }
}
