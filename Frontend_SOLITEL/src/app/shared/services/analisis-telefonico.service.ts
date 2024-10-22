import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

// Definir la interfaz para mapear la estructura completa de SolicitudProveedor
export interface SolicitudProveedor {
  TN_IdSolicitudProveedor: number;
  TN_NumeroUnico: number;
  TN_NumeroCaso: number;
  TC_Imputado: string;
  TC_Ofendido: string;
  TC_Resennia?: string;
  TN_DiasTranscurridos: number;
  TB_Urgente: boolean;
  TB_Aprobado: boolean;
  TF_FechaCrecion: Date;
  TF_FechaModificacion: Date;
  TN_IdUsuarioCreador: number;
  TN_IdDelito: number;
  TN_IdCategoriaDelito: number;
  TN_IdModalida: number;
  TN_IdEstado: number;
  TN_IdProveedor: number;
  TN_IdFiscalia: number;
  TN_IdOficina: number;
  TN_IdSubModalidad: number;
}

@Injectable({
  providedIn: 'root', // El servicio se inyecta globalmente
})
export class AnalisisTelefonicoService {
  // URL base para la API de solicitudes de análisis telefónico
  private urlServices: string = 'https://localhost:7211/api/SolicitudAnalisis/';
  private urlInsertar: string = 'insertarSolicitudAnalisis';
  private urlObtenerSolicitudesProveedor: string =
    'obtenerSolicitudesProveedor';

  constructor(private http: HttpClient) {}

  // Método para enviar una solicitud de análisis completa al backend
  public agregarSolicitudAnalisis(solicitudAnalisis: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      accept: 'text/plain',
    });
    return this.http.post(
      `${this.urlServices}${this.urlInsertar}`,
      solicitudAnalisis,
      { headers }
    );
  }

  // Método para obtener la lista de SolicitudProveedor filtrada por número único
  public obtenerSolicitudesProveedorPorNumeroUnico(
    numeroUnico: number
  ): Observable<
    {
      TN_IdSolicitudProveedor: number;
      TN_NumeroUnico: number;
      TC_Proveedor: string;
    }[]
  > {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      accept: 'application/json',
    });

    // Realizar la solicitud GET a la API, enviando el número único como parámetro
    return this.http.get<
      {
        TN_IdSolicitudProveedor: number;
        TN_NumeroUnico: number;
        TC_Proveedor: string;
      }[]
    >(
      `${this.urlServices}${this.urlObtenerSolicitudesProveedor}/${numeroUnico}`,
      { headers }
    );
  }
}
