import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoriaDelitoService {

  private urlServices: string = "https://localhost:7211/api/CategoriaDelito/";
  private urlObtener: string = "obtenerCategoriaDelito";
  private urlinsertar: string = "insertarCategoriaDelito";
  private urleliminar: string = "eliminarCategoriaDelito";

  constructor(private http: HttpClient) { }

  public obtener = (): Observable<any[]> => {
    return this.http.get<any[]>(`${this.urlServices}${this.urlObtener}`);
  }

  public insertar = (objeto: object): Observable<any> => {
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
