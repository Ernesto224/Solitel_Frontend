import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SolicitudProveedorService {

  private urlServices: string = "https://localhost:7211/api/SolicitudProveedor/";
  private urlInsertar: string = "insertarSolicitudProveedor";
  constructor(private http: HttpClient) { }
  public obtener = (pageNumber: number, pageSize: number): Observable<any> => {
    return this.http.get(`${this.urlServices}consultarSolicitudesProveedor?pageNumber=${pageNumber}&pageSize=${pageSize}`);
  }
  public insertarSolicitudProveedor = (solicitud: any): Observable<any> => {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'accept': 'text/plain'
    });
    return this.http.post(`${this.urlServices}${this.urlInsertar}`, solicitud, { headers });
  }

}
