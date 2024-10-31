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

  constructor(private http: HttpClient) { }

  public obtener = (pageNumber: number, pageSize: number): Observable<any[]> => {
    return this.http.get<any[]>(`${this.urlServices}${this.urlObtener}/${pageNumber}/${pageSize}`);
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

  public moverEstadoASinEfecto = (idSolicitudProveedor: number): Observable<any> => {
    const headers = new HttpHeaders({
      'accept': 'text/plain'
    });
    return this.http.put<any[]>(`${this.urlServices}${this.urlMoverEstadoSinEfecto}/${idSolicitudProveedor}`, {}, { headers });
  };

}

