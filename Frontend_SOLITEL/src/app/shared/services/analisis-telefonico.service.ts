import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Archivo {
  idArchivo: number;
  nombreArchivo: string;
}

@Injectable({
  providedIn: 'root',
})
export class AnalisisTelefonicoService {
  private baseUrl: string = 'https://localhost:7211/api/';
  private urlInsertar: string = 'SolicitudAnalisis';
  private urlObtenerSolicitudesProveedor: string = 'SolicitudProveedor/listarNumerosUnicosTramitados';
  private urlObtenerOficinas: string = 'Oficina/consultarOficinas';
  private urlObtenerSolicitudesPorNumeroUnico: string = 'SolicitudProveedor/consultarSolicitudesProveedorPorNumeroUnico';
  private urlObtenerObjetivoAnalisis: string = 'ObjetivoAnalisis/obtenerObjetivoAnalisis';
  private urlCondicionesAnalisis: string = "Condicion"
  private urlTiposAnalisis: string = "TipoAnalisis";

  constructor(private http: HttpClient) {}

  agregarSolicitudAnalisis(solicitudAnalisis: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      accept: 'text/plain',
    });
    return this.http.post(`${this.baseUrl}${this.urlInsertar}`, solicitudAnalisis, { headers });
  }

  obtenerNumerosUnicos(): Observable<number[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      accept: 'application/json',
    });
    return this.http.get<number[]>(`${this.baseUrl}${this.urlObtenerSolicitudesProveedor}`, { headers });
  }

  obtenerOficinasAnalisis(): Observable<any[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      accept: 'application/json',
    });
    return this.http.get<any[]>(`${this.baseUrl}${this.urlObtenerOficinas}`, { headers });
  }

  obtenerSolicitudesPorNumeroUnico(numeroUnico: string): Observable<any[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      accept: 'application/json',
    });
    return this.http.get<any[]>(`${this.baseUrl}${this.urlObtenerSolicitudesPorNumeroUnico}?numeroUnico=${numeroUnico}`, { headers });
  }
  obtenerObjetivosAnalisis(idObjetivo: number): Observable<any[]> {
    const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        accept: 'application/json',
    });

    // Asegúrate de que el nombre del parámetro sea exactamente el mismo que el backend espera
    const params = new HttpParams().set('idObtenerObjetivoAnalisis', idObjetivo.toString());

    return this.http.get<any[]>(`${this.baseUrl}${this.urlObtenerObjetivoAnalisis}`, { headers, params });
}

obtenerTipoAnalisis():Observable<any[]> {
  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    accept: 'application/json',
  });
  return this.http.get<any[]>(`${this.baseUrl}${this.urlTiposAnalisis}`, { headers });
 
}

obtenerCondiciones(): Observable<any[]>{
  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    accept: 'application/json',
  });
  return this.http.get<any[]>(`${this.baseUrl}${this.urlCondicionesAnalisis}`, { headers });
}


}
