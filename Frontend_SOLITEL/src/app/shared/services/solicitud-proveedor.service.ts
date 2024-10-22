import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SolicitudProveedorService {

  private urlServices: string = "https://localhost:7211/api/SolicitudProveedor/";

  constructor(private http: HttpClient) { }

  public obtener = (pageNumber: number, pageSize: number): Observable<any> => {
    return this.http.get(`${this.urlServices}consultarSolicitudesProveedor?pageNumber=${pageNumber}&pageSize=${pageSize}`);
  }
}
