import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SolicitudProveedorService {

  private urlServices: string = "https://localhost:7211/api/SolicitudProveedor/";
  private urlObtener: string = "consultarSolicitudesProveedor";
  private urlInsertar: string = "insertarSolicitudProveedor";
  private urlMoverEstadoSinEfecto: string = "moverEstadoASinEfecto";
  private urlObtenerPorEstado: string = "obtenerSolicitudesProveedorPorEstado";
  private urlMoverEstadoATramitado: string = "actualizarEstadoTramitado";

  constructor(private http: HttpClient) { }

  public obtener(): Observable<any[]> {
    return this.http.get<any[]>(`${this.urlServices}${this.urlObtener}`);
  }
  public obtenerSolicitudesPorEstado(idEstado: number, pageNumber: number, pageSize: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.urlServices}${this.urlObtenerPorEstado}?pageNumber=${pageNumber}&pageSize=${pageSize}&idEstado=${idEstado}`);
  }

  public insertarSolicitudProveedor = (solicitud: any): Observable<any> => {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'accept': 'text/plain'
    });
    return this.http.post(`${this.urlServices}${this.urlInsertar}`, solicitud, { headers });
  }

  public actualizarEstado(
    idSolicitudProveedor: number,
    estado: string,
    idUsuario: number,
    observacion: string = ''
  ): Observable<any> {
    // Definir el endpoint según el estado
    let endpoint: string;

    switch (estado) {
      case 'Sin Efecto':
        endpoint = 'actualizarEstadoSinEfecto';
        break;
      case 'Legajo':
        endpoint = 'actualizarEstadoLegajo';
        break;
      case 'Finalizar':
        endpoint = 'actualizarEstadoFinalizado';
        break;
      case 'Aprobar':
        endpoint = 'aprobarSolicitudProveedor';
        break;
      case 'Devolver':
        endpoint = 'devolverATramitado';
        break;
      default:
        throw new Error(`Estado no reconocido: ${estado}`);
    }

    // Definir el nombre del parámetro id según el estado
    const idParamName = (estado === 'Sin Efecto' || estado === 'Aprobar') ? 'idSolicitudProveedor' : 'id';

    // Construir la URL base con el parámetro id dinámico
    let url = `${this.urlServices}${endpoint}?${idParamName}=${idSolicitudProveedor}&idUsuario=${idUsuario}`;

    // Agregar 'observacion' solo si tiene valor
    if (observacion) {
      url += `&observacion=${observacion}`;
    }

    // Hacer la solicitud HTTP PUT
    return this.http.put(url, {});
  }


  public moverEstadoASinEfecto = (idSolicitudProveedor: number): Observable<any> => {
    const headers = new HttpHeaders({
      'accept': 'text/plain'
    });
    return this.http.put<any[]>(`${this.urlServices}${this.urlMoverEstadoSinEfecto}/${idSolicitudProveedor}`, {}, { headers });
  };

  moverEstadoATramitado(idSolicitudProveedor: number, idUsuario: number, observacion: string | null): Observable<any> {
    const headers = new HttpHeaders({
      'accept': 'text/plain',
      'Content-Type': 'application/json'
    });
  
    // Construye la URL con los parámetros
    const url = `${this.urlServices}${this.urlMoverEstadoATramitado}?idSolicitudProveedor=${idSolicitudProveedor}&idUsuario=${idUsuario}&observacion=${observacion}`;
  
    // Realiza la solicitud PUT a la URL construida
    return this.http.put<any>(url, {}, { headers });
  }

}

