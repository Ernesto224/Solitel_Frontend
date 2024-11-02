import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { saveAs } from 'file-saver';

@Injectable({
  providedIn: 'root'
})
export class ArchivoService {

  private baseUrl = 'https://localhost:7211';
  private urlInsertarArchivo = '/insertarArchivo_RequerimientoProveedor'

  constructor(private http: HttpClient) { }

  descargarArchivo(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/obtenerArchivoPorId?id=${id}`);
  }

  public insertarArchivo = (formData: FormData): Observable<any> => {
    return this.http.post(`${this.baseUrl}${this.urlInsertarArchivo}`, formData);
  }

  obtenerArchivosDeSolicitud(idRequerimiento: number): Observable<any[]> {
    const url = `${this.baseUrl}/ObtenerArchivosDeSolicitud?id=${idRequerimiento}`;
    return this.http.get<any[]>(url, { responseType: 'json' });
  }

}
