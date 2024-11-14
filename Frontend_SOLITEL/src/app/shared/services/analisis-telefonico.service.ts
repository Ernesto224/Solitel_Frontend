import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Archivo {
  idArchivo: number;
  nombre: string; // Cambiado a 'nombre' para coincidir con la respuesta
  contenido: string; // Agregado para almacenar el contenido del archivo
  formatoArchivo: string;
  fechaModificacion: string; // Agregado para la fecha de modificación
}

export interface Condicion {
  idCondicion: number;
  nombre: string;
  descripcion: string;
}
export interface TipoDato {
  idTipoDato: number;
  nombre: string;
  descripcion: string;
}

@Injectable({
  providedIn: 'root',
})
export class AnalisisTelefonicoService {

  private baseUrl: string = 'https://localhost:7211/api/';
  private urlObtenerBandejaAnalista: string = 'SolicitudAnalisis/obtenerBandejaAnalista';
  private urlObtenerSolicitudesAnalisis: string = 'SolicitudAnalisis/consultar';
  private urlInsertar: string = 'SolicitudAnalisis';
  private urlObtenerSolicitudesProveedor: string =
    'SolicitudProveedor/listarNumerosUnicosTramitados';
  private urlObtenerOficinas: string = 'Oficina/ObtenerOficinas';
  private urlObtenerSolicitudesPorNumeroUnico: string =
    'SolicitudProveedor/consultarSolicitudesProveedorPorNumeroUnico';
  private urlObtenerObjetivoAnalisis: string =
    'ObjetivoAnalisis/obtenerObjetivoAnalisis';
  private urlCondicionesAnalisis: string = 'Condicion';
  private urlTiposAnalisis: string = 'TipoAnalisis';
  private readonly baseUrlArchivos: string = 'https://localhost:7211/api';
  private readonly urlArchivoSoliProveedor: string =
    'obtenerArchivosDeSolicitudesProveedor';
  private readonly urlObtenerTipoDato: string = 'TipoDato';
  private readonly urlActualizarEstadoAnalizado: string = 'ActualizarEstadoAnalizadoSolicitudAnalisis'

  constructor(private http: HttpClient) { }

  obtener(): Observable<any[]> {
    return this.http.get<any[]>(
      `https://localhost:7211/api/SolicitudAnalisis/consultar`
    );
  }

  agregarSolicitudAnalisis(solicitudAnalisis: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      accept: 'text/plain',
    });
    return this.http.post(
      `${this.baseUrl}${this.urlInsertar}`,
      solicitudAnalisis,
      { headers }
    );
  }

  obtenerNumerosUnicos(): Observable<number[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      accept: 'application/json',
    });
    return this.http.get<number[]>(
      `${this.baseUrl}${this.urlObtenerSolicitudesProveedor}`,
      { headers }
    );
  }

  obtenerSolicitudesAnalisis(idEstado?: number, fechainicio?: string, fechaFin?: string, numeroUnico?: string, idOficina?: number, idUsuario?: number): Observable<any[]> {
    let params = new HttpParams();

    // Agregar los parámetros solo si tienen un valor definido
    if (idEstado !== undefined) {
      params = params.set('idEstado', idEstado.toString());
    }
    if (fechainicio) {
      params = params.set('fechainicio', fechainicio);
    }
    if (fechaFin) {
      params = params.set('fechaFin', fechaFin);
    }
    if (numeroUnico) {
      params = params.set('numeroUnico', numeroUnico);
    }
    if (idOficina !== undefined) {
      params = params.set('idOficina', idOficina.toString());
    }
    if (idUsuario !== undefined) {
      params = params.set('idUsuario', idUsuario.toString());
    }

    return this.http.get<any[]>(`${this.baseUrl}${this.urlObtenerSolicitudesAnalisis}`, { params });
  }

  obtenerOficinasAnalisis(): Observable<any[]> {
    const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    });

    return this.http.get<any[]>(`${this.baseUrl}${this.urlObtenerOficinas}?tipo=Analisis`, {
        headers,
    });
}


obtenerSolicitudesPorNumeroUnico(numeroUnico: string, usuarioActual: any): Observable<any[]> {
  const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
  });
  console.log("USUARIO OFICINA: "+usuarioActual.idUsuario)
  console.log("ID OFICINA "+usuarioActual.oficina.idOficina)
  const url = `${this.baseUrl}${this.urlObtenerSolicitudesPorNumeroUnico}?numeroUnico=${numeroUnico}&idUsuario=${usuarioActual.idUsuario}&idOficina=${usuarioActual.oficina.idOficina}`;

  return this.http.get<any[]>(url, { headers });
}


  obtenerObjetivosAnalisis(idObjetivo: number): Observable<any[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      accept: 'application/json',
    });

    const params = new HttpParams().set(
      'idObjetivoAnalisis',
      idObjetivo.toString()
    );

    return this.http.get<any[]>(
      `${this.baseUrl}${this.urlObtenerObjetivoAnalisis}`,
      { headers, params }
    );
  }

  obtenerTipoAnalisis(): Observable<any[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      accept: 'application/json',
    });
    return this.http.get<any[]>(`${this.baseUrl}${this.urlTiposAnalisis}`, {
      headers,
    });
  }

  obtenerCondiciones(): Observable<any[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      accept: 'application/json',
    });
    return this.http.get<Condicion[]>(
      `${this.baseUrl}${this.urlCondicionesAnalisis}`,
      { headers }
    );
  }

  obtenerArchivosSolicitudProveedor(
    idSolicitudes: number[]
  ): Observable<any[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });

    // Añadir cada `idSolicitudes` al objeto `HttpParams`
    let params = new HttpParams();
    idSolicitudes.forEach((id) => {
      params = params.append('idSolicitudes', id.toString());
    });

    // Construir la URL sin barras adicionales
    const url = `${this.baseUrlArchivos}/${this.urlArchivoSoliProveedor}`;
    return this.http.get<any[]>(url, { headers, params });
  }

  ObtenerTiposDato(): Observable<any[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      accept: 'application/json',
    });
    return this.http.get<TipoDato[]>(
      `${this.baseUrl}${this.urlObtenerTipoDato}`,
      {
        headers,
      }
    );
  }

  ActualizarEstadoAnalizadoSolicitudAnalisis(idSolicitudAnalisis: number, idUsuario: number, observacion: string | null): Observable<any> {
    const headers = new HttpHeaders({
      'accept': 'text/plain',
      'Content-Type': 'application/json'
    });

    const url = `${this.baseUrl}SolicitudAnalisis/ActualizarEstadoAnalizadoSolicitudAnalisis?idSolicitudAnalisis=${idSolicitudAnalisis}&idUsuario=${idUsuario}&observacion=${observacion}`;

    return this.http.put<any>(url, {}, { headers });
  }

  finalizarSolicitudAnalisis(idSolicitudAnalisis: number, idUsuario: number, observacion: string | null): Observable<any> {
    const headers = new HttpHeaders({
      'accept': 'text/plain',
      'Content-Type': 'application/json'
    });

    const url = `${this.baseUrl}SolicitudAnalisis/actualizarEstadoFinalizado?id=${idSolicitudAnalisis}&idUsuario=${idUsuario}&observacion=${observacion}`;

    return this.http.put<any>(url, {}, { headers });
  }

  obtenerBandejaAnalista(estado: number, fechaInicio?: string, fechaFin?: string, numeroUnico?: string, idOficina?: number, idUsuario?: number): Observable<any[]> {
    let params = new HttpParams();

    // Adding parameters only if they are defined
    if (estado !== undefined) {
      params = params.set('idEstado', estado.toString());
    }
    if (fechaInicio) {
      params = params.set('fechaInicio', fechaInicio);
    }
    if (fechaFin) {
      params = params.set('fechaFin', fechaFin);
    }
    if (numeroUnico) {
      params = params.set('numeroUnico', numeroUnico);
    }
    if (idOficina !== undefined) {
      params = params.set('idOficina', idOficina.toString());
    }
    if (idUsuario !== undefined) {
      params = params.set('idUsuario', idUsuario.toString());
    }

    // No need for headers unless specific headers are necessary
    return this.http.get<any[]>(`${this.baseUrl}${this.urlObtenerBandejaAnalista}`, { params });
  }

  ActualizarEstadoLegajoolicitudAnalisis(idSolicitudAnalisis: number, idUsuario: number, observacion: string | null): Observable<any> {
    const headers = new HttpHeaders({
      'accept': 'text/plain',
      'Content-Type': 'application/json'
    });

    const url = `${this.baseUrl}SolicitudAnalisis/actualizarEstadoLegajo?id=${idSolicitudAnalisis}&idUsuario=${idUsuario}&observacion=${observacion}`;

    return this.http.put<any>(url, {}, { headers });
  }

  aprobarSolicitudAnalisis(idSolicitudAnalisis: number, idUsuario: number, observacion: string | null): Observable<any> {
    const headers = new HttpHeaders({
      'accept': 'text/plain',
      'Content-Type': 'application/json'
    });

    const url = `${this.baseUrl}SolicitudAnalisis/AprobarSolicitudAnalisis?idSolicitudAnalisis=${idSolicitudAnalisis}&idUsuario=${idUsuario}&observacion=${observacion}`;

    return this.http.put<any>(url, {}, { headers });
  }

  devolverAnalizado(idSolicitudAnalisis: number, idUsuario: number, observacion: string | null): Observable<any> {
    const headers = new HttpHeaders({
      'accept': 'text/plain',
      'Content-Type': 'application/json'
    });

    const url = `${this.baseUrl}SolicitudAnalisis/devolverAnalizado?id=${idSolicitudAnalisis}&idUsuario=${idUsuario}&observacion=${observacion}`;

    return this.http.put<any>(url, {}, { headers });
  }

}
