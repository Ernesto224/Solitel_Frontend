import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

// Interfaz para mapear la estructura completa de SolicitudProveedor
export interface SolicitudProveedor {
  idSolicitudProveedor: number;
  numeroUnico: number;
  nombreProveedor: string;
}

// Interfaz para las oficinas de análisis
export interface OficinaAnalisis {
  tN_IdOficina: number;
  tC_Nombre: string;
}

// Interfaz para SolicitudAnalisis y RequerimentoAnalisis
export interface SolicitudAnalisis {
  TN_IdSolicitudAnalisis: number;
  TF_FechaDelHecho: Date;
  TC_OtrosDetalles: string;
  TC_OtrosObjetivosDeAnalisis?: string; // Campo opcional
  TB_Aprobado: boolean;
  TF_FechaCrecion?: Date; // Campo opcional
  TN_NumeroSolicitud: number;
  TN_IdOficina: number;
  requerimentos: RequerimentoAnalisis[]; // Relación con la lista de requerimentos
}

export interface RequerimentoAnalisis {
  TN_IdRequerimento: number;
  TC_TipoObjetivo: string;
  TC_Objetivo: string;
  TC_UtilizadoPor: string;
  TC_Condicion: string;
}

export interface ObjetivoAnalisis{
  TN_IdObjetivoAnalisis: number;
  TC_Nombre: string;
  TC_Descripcion: string;
}

@Injectable({
  providedIn: 'root',
})
export class AnalisisTelefonicoService {
  private baseUrl: string = 'https://localhost:7211/api/';
  private urlInsertar: string = 'SolicitudAnalisis/insertarSolicitudAnalisis';
  private urlObtenerSolicitudesProveedor: string = 'SolicitudProveedor/listarNumerosUnicosTramitados';
  private urlObtenerOficinas: string = 'Oficina/consultarOficinas'; 
  private urlObtenerSolicitudesPorNumeroUnico: string = 'SolicitudProveedor/consultarSolicitudesProveedorPorNumeroUnico';
  private urlObtenerObjetivoAnalisis: string = ' ObjetivoAnalisis/obtenerObjetivoAnalisis';

  constructor(private http: HttpClient) {}

  // Enviar solicitud de análisis completa
    agregarSolicitudAnalisis(solicitudAnalisis: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      accept: 'text/plain',
    });
    return  this.http.post(`${this.baseUrl}${this.urlInsertar}`, solicitudAnalisis, { headers });
  }

  // Obtener la lista de números únicos de solicitudes
  obtenerNumerosUnicos(): Observable<number[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      accept: 'application/json',
    });
    return this.http.get<number[]>(`${this.baseUrl}${this.urlObtenerSolicitudesProveedor}`, { headers });
  }

  // Obtener todas las oficinas de análisis
  obtenerOficinasAnalisis(): Observable<OficinaAnalisis[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      accept: 'application/json',
    });
    return this.http.get<OficinaAnalisis[]>(`${this.baseUrl}${this.urlObtenerOficinas}`, { headers });
  }

  // Obtener las solicitudes vinculadas a un número único
  obtenerSolicitudesPorNumeroUnico(numeroUnico: number): Observable<SolicitudProveedor[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      accept: 'application/json',
    });
    return this.http.get<SolicitudProveedor[]>(`${this.baseUrl}${this.urlObtenerSolicitudesPorNumeroUnico}?numeroUnico=${numeroUnico}`, { headers });
  }

  obtenerObjetivosAnalisis(): Observable<ObjetivoAnalisis[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      accept: 'application/json',
    });
    return this.http.get<ObjetivoAnalisis[]>(`${this.baseUrl}${this.urlObtenerObjetivoAnalisis}`, { headers });
  }
}
