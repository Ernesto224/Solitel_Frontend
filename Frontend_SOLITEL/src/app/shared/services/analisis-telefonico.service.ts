import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Archivo {
  idArchivo: number;
  nombre: string; // Cambiado a 'nombre' para coincidir con la respuesta
  contenido: string; // Agregado para almacenar el contenido del archivo
  formatoArchivo: string;
  fechaModificacion: string; // Agregado para la fecha de modificación
}

@Injectable({
  providedIn: 'root',
})
export class AnalisisTelefonicoService {
  private baseUrl: string = 'https://localhost:7211/api/';
  private urlObtenerSolicitudesAnalisis:  string = '/SolicitudAnalisis/consultar';
  private urlInsertar: string = 'SolicitudAnalisis';
  private urlObtenerSolicitudesProveedor: string =
    'SolicitudProveedor/listarNumerosUnicosTramitados';
  private urlObtenerOficinas: string = 'Oficina/consultarOficinas';
  private urlObtenerSolicitudesPorNumeroUnico: string =
    'SolicitudProveedor/consultarSolicitudesProveedorPorNumeroUnico';
  private urlObtenerObjetivoAnalisis: string =
    'ObjetivoAnalisis/obtenerObjetivoAnalisis';
  private urlCondicionesAnalisis: string = 'Condicion';
  private urlTiposAnalisis: string = 'TipoAnalisis';
  private readonly baseUrlArchivos: string = 'https://localhost:7211/api';
  private readonly urlArchivoSoliProveedor: string =
    'obtenerArchivosDeSolicitudesProveedor';
  private readonly urlObtenerTipoDato: string = 'TipoDato';
  constructor(private http: HttpClient) {}

  agregarSolicitudAnalisis(solicitudAnalisis: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      accept: 'text/plain',
    });
    return this.http.post(
      `${this.baseUrl}${this.urlInsertar}`,
      solicitudAnalisis,
      { headers }
    );
  }

  obtenerNumerosUnicos(): Observable<number[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      accept: 'application/json',
    });
    return this.http.get<number[]>(
      `${this.baseUrl}${this.urlObtenerSolicitudesProveedor}`,
      { headers }
    );
  }

  obtenerSolicitudesAnalisis(): Observable<any[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      accept: 'application/json',
    });
    return this.http.get<any[]>(`${this.baseUrl}${this.urlObtenerSolicitudesAnalisis}`, { headers });
  }
  
  obtenerOficinasAnalisis(): Observable<any[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      accept: 'application/json',
    });
    return this.http.get<any[]>(`${this.baseUrl}${this.urlObtenerOficinas}`, {
      headers,
    });
  }

  obtenerSolicitudesPorNumeroUnico(numeroUnico: string): Observable<any[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      accept: 'application/json',
    });
    return this.http.get<any[]>(
      `${this.baseUrl}${this.urlObtenerSolicitudesPorNumeroUnico}?numeroUnico=${numeroUnico}`,
      { headers }
    );
  }

  obtenerObjetivosAnalisis(idObjetivo: number): Observable<any[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      accept: 'application/json',
    });

    const params = new HttpParams().set(
      'idObjetivoAnalisis',
      idObjetivo.toString()
    );

    return this.http.get<any[]>(
      `${this.baseUrl}${this.urlObtenerObjetivoAnalisis}`,
      { headers, params }
    );
  }

  obtenerTipoAnalisis(): Observable<any[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      accept: 'application/json',
    });
    return this.http.get<any[]>(`${this.baseUrl}${this.urlTiposAnalisis}`, {
      headers,
    });
  }

  obtenerCondiciones(): Observable<any[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      accept: 'application/json',
    });
    return this.http.get<any[]>(
      `${this.baseUrl}${this.urlCondicionesAnalisis}`,
      { headers }
    );
  }
  obtenerArchivosSolicitudProveedor(
    idSolicitudes: number[]
  ): Observable<any[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });

    // Añadir cada `idSolicitudes` al objeto `HttpParams`
    let params = new HttpParams();
    idSolicitudes.forEach((id) => {
      params = params.append('idSolicitudes', id.toString());
    });

    // Construir la URL sin barras adicionales
    const url = `${this.baseUrlArchivos}/${this.urlArchivoSoliProveedor}`;
    return this.http.get<any[]>(url, { headers, params });
  }

  ObtenerTiposDato(): Observable<any[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      accept: 'application/json',
    });
    return this.http.get<any[]>(`${this.baseUrl}${this.urlObtenerTipoDato}`, {
      headers,
    });
  }
}
