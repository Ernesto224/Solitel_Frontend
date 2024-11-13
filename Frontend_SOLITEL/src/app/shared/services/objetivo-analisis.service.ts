import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ObjetivoAnalisisService {

  private urlServices: string = "https://localhost:7211/api/ObjetivoAnalisis";

  constructor(private http: HttpClient) { }

  public obtener = (): Observable<any[]> => {
    return this.http.get<any[]>(`${this.urlServices}/obtenerObjetivoAnalisis`);
  }

  public insertar = (objeto: object): Observable<any> => {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'accept': 'text/plain'
    });
    return this.http.post(`${this.urlServices}/insertarObjetivoAnalisis`, objeto, { headers });
  }

  public eliminar = (id: number): Observable<any> => {
    return this.http.delete(`${this.urlServices}/eliminarObjetivoAnalisis?idObjetivoAnalisis=${id}`, {
      headers: { 'accept': 'text/plain' }
    });
  }

}
