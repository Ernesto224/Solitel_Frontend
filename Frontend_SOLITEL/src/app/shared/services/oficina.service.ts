import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OficinaService {

  private urlServices: string = "https://localhost:7211/api/Oficina/";
  private urlObtener: string = "consultarOficinas";
  private urlinsertar: string = "insertarOficina";
  private urleliminar: string = "eliminarOficina";

  constructor(private http: HttpClient) { }

  public obtener = (): Observable<any> => {
    return this.http.get(`${this.urlServices}${this.urlObtener}`);
  }

  public obtenerUna = (idOficina: number): Observable<any> => {
    return this.http.get(`${this.urlServices}${this.urlObtener}/${idOficina}`);
  }

  public insertar = (objeto: any): Observable<any> => {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'accept': 'text/plain'
    });
    return this.http.post(`${this.urlServices}${this.urlinsertar}`, objeto, { headers });
  }

  public eliminar = (id: number): Observable<any> => {
    return this.http.delete(`${this.urlServices}${this.urleliminar}/${id}`, {
      headers: { 'accept': 'text/plain' }
    });
  }

}
