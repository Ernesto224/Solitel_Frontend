import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthenticacionService {
  // Usuarios quemados para pruebas
  private usuarioPrueba = {
    idUsuario: 1,
    nombre: 'Eliecer',
    apellido: 'Melgara',
    correoElectronico: 'eliecermelgara1680@gmail.com',
    usuario: 'eliecer.melgara',
    contrasennia: 'asdfg123!',
    oficina: [
      {
        idOficina: 2,
        nombre: 'DELEGACION REGIONAL DE HEREDIA',
        tipo: 'Investigacion',
        rol: {
          nombre: 'Administrador',
          permisos: [{ nombre: 'todos' }],
        },
      },
      {
        idOficina: 3,
        nombre:
          'DELEGACION REGIONAL DE LIBERIA',
        tipo: 'Investigacion',
        rol: {
          nombre: 'Jefatura Investigador',
          permisos: [
            { nombre: 'Crear Solicitud Proveedor' },
            { nombre: 'Ver Solicitudes Proveedor Oficina' },
            { nombre: 'Crear Solicitudes Analisis' },
            { nombre: 'Ver Solicitudes Analisis Oficina' },
            { nombre: 'Aprobar Solicitudes Proveedor' },
            { nombre: 'Aprobar Solicitudes Analisis' },
            { nombre: 'Aprobación Automatica' },
          ],
        },
      },
      {
        idOficina: 11,
        nombre: 'UNIDAD DE ANALISIS CRIMINAL',
        tipo: 'Analisis',
        rol: {
          nombre: 'Jefatura Analista',
          permisos: [
            { nombre: 'Ver Solicitudes Analisis Oficina Analisis' },
            { nombre: 'Asignar Solicitudes Analisis' },
            { nombre: 'Responder Solicitudes Analisis' }
          ],
        },
      },
    ],
  };
  private usuarioPrueba2 = {
    idUsuario: 3,
    nombre: 'Daniel',
    apellido: 'Borges',
    correoElectronico: 'danielborges2514@gmail.com',
    usuario: 'daniel.borges',
    contrasennia: 'asdfg123!',
    oficina: [
      {
        idOficina: 3,
        nombre:
          'DELEGACION REGIONAL DE LIBERIA',
        tipo: 'Investigacion',
        rol: {
          nombre: 'Investigador',
          permisos: [
            { nombre: 'Crear Solicitud Proveedor' },
            { nombre: 'Ver Solicitudes Proveedor Propias' },
            { nombre: 'Crear Solicitudes Analisis' },
            { nombre: 'Ver Solicitudes Analisis Propias' },
          ],
        },
      },
      {
        idOficina: 11,
        nombre: 'UNIDAD DE ANALISIS CRIMINAL',
        tipo: 'Analisis',
        rol: {
          nombre: 'Analista',
          permisos: [
            { nombre: 'Ver Solicitudes Analisis Propias Analisis' },
            { nombre: 'Responder Solicitudes Analisis' }
          ],
        },
      },
    ],
  };
  usuarios = [this.usuarioPrueba, this.usuarioPrueba2];

  //Atributos de prueba
  private usuarioKey = 'usuario';
  private oficeKey = 'ofices';

  private gestionarPermisosAsignacion = {
    "todos": { valor: true },
    "Asignar Solicitudes Analisis": { valor: (usuario: any) => { return usuario.oficina.rol.nombre.includes('Jefatura') } },
  };

  constructor() { }

  private isSessionStorageAvailable(): boolean {
    return (
      typeof window !== 'undefined' && typeof sessionStorage !== 'undefined'
    );
  }

  public login(username: string, password: string): any {
    if (this.isSessionStorageAvailable()) {
      const usuario = this.usuarios.find(
        (user) => user.usuario === username && user.contrasennia === password
      );
      if (usuario) {
        console.log('Login successful')
        return usuario;
      } else {
        console.error('Invalid username or password');
      }
    } else {
      console.error('Session storage is not available');
    }
    return null;
  }

  public logout(): void {
    if (this.isSessionStorageAvailable()) {
      sessionStorage.removeItem(this.usuarioKey);
    }
  }

  public isAuthenticated(): boolean {
    return this.getUsuario() !== null;
  }

  public deleteOfice(): void {
    if (this.isSessionStorageAvailable()) {
      sessionStorage.removeItem(this.oficeKey);
    }
  }

  public getUsuario(): any {
    if (this.isSessionStorageAvailable()) {
      const usuario = sessionStorage.getItem(this.usuarioKey);
      return usuario ? JSON.parse(usuario) : null;
    }
    return null;
  }

  public getOficinas(): any {
    if (this.isSessionStorageAvailable()) {
      const oficina = sessionStorage.getItem(this.oficeKey);
      return oficina ? JSON.parse(oficina) : null;
    }
    return null;
  }

  public agregarUsuario(usuario: any): void {
    if (this.isSessionStorageAvailable()) {
      sessionStorage.setItem(this.usuarioKey, JSON.stringify(usuario));
    }
  }

  public agregarOficinas(oficinas: any): void {
    if (this.isSessionStorageAvailable()) {
      sessionStorage.setItem(this.oficeKey, JSON.stringify(oficinas));
    }
  }

  public tienePermiso(permiso: string): boolean {
    const usuario: any = this.getUsuario();

    // Verificación de la existencia de propiedades requeridas
    if (!usuario || !usuario.oficina || !usuario.oficina.rol || !Array.isArray(usuario.oficina.rol.permisos)) {
      return false;
    }

    // Verificación de permisos
    return usuario.oficina.rol.permisos.some((p: any) => p.nombre === permiso || p.nombre === 'todos');
  }

  private evaluarPermisos(usuario: any, permisos: any): any {
    // Recorre las claves del objeto permisos
    for (const permiso of usuario.oficina.rol.permisos) {
      console.log(permisos[permiso.nombre])
      if (permisos[permiso.nombre]) return typeof permiso.valor === 'function' ? permiso.valor(usuario) : permiso.valor;
    }
  }

  public verificarPermisosVerDatos(usuario: any) {
    // Si el usuario tiene el permiso para ver todas las solicitudes
    if (usuario.oficina.rol.permisos.some((permiso: any) =>
      permiso.nombre === 'Ver Solicitudes Proveedor Oficina' ||
      permiso.nombre === 'Ver Solicitudes Analisis Oficina')) {
      return undefined; // Permitir ver todas las solicitudes (sin filtrar por idUsuario)
    }

    // Si el usuario puede ver solo sus propias solicitudes (incluyendo los permisos adicionales)
    if (usuario.oficina.rol.permisos.some((permiso: any) =>
      permiso.nombre === 'Ver Solicitudes Proveedor Propias' ||
      permiso.nombre === 'Ver Solicitudes Analisis Propias')) {
      return usuario.idUsuario; // Retorna su propio idUsuario
    }

    // Valor predeterminado si no hay coincidencia de permisos
    return undefined;
  }

  public verificarPermisosVerDatosAnalistas(usuario: any) {

    // Si el usuario tiene el permiso para ver todas las solicitudes
    if (usuario.oficina.rol.permisos.some((permiso: any) =>
      permiso.nombre === 'Ver Solicitudes Analisis Oficina Analisis')
      && usuario.oficina.rol.nombre.includes('Analista')) {
      return undefined; // Permitir ver todas las solicitudes (sin filtrar por idUsuario)
    }

    // Si el usuario puede ver solo sus propias solicitudes (incluyendo los permisos adicionales)
    if (usuario.oficina.rol.permisos.some((permiso: any) =>
      permiso.nombre === 'Ver Solicitudes Analisis Propias Analisis')
      && usuario.oficina.rol.nombre.includes('Analista')) {
      return usuario.idUsuario; // Retorna su propio idUsuario
    }

    // Valor predeterminado si no hay coincidencia de permisos
    return undefined;
  }

  public verificarPermisosAprobacion(usuario: any) {

    // Verificar si el usuario tiene permisos específicos de aprobación
    if (usuario.oficina.rol.permisos.some((permiso: any) =>
      permiso.nombre === 'Aprobar Solicitudes Proveedor')) {
      return true;
    }

    if (usuario.oficina.rol.permisos.some((permiso: any) =>
      permiso.nombre === 'Aprobar Solicitudes Analisis')) {
      return true;
    }

    // No tiene permisos de aprobación
    return false;
  }

  public verificarPermisosAprobacionAutomatica(usuario: any) {

    if (usuario.oficina.rol.permisos.some((permiso: any) =>
      permiso.nombre === 'Aprobación Automatica')) {
      return true;
    }

    // No tiene permisos de aprobación
    return false;
  }

  public verificarPermisosAsignacion(usuario: any) {
    // Si el usuario tiene permiso para asignar todas las solicitudes
    if (this.gestionarPermisosAsignacion['todos'].valor) {
      return true; // Permitir asignar todas las solicitudes
    }

    // Verificar si el usuario tiene permisos específicos de asignación
    if (usuario.oficina.rol.permisos.some((permiso: any) =>
      permiso.nombre === 'Asignar Solicitudes Analisis' &&
      this.gestionarPermisosAsignacion['Asignar Solicitudes Analisis'].valor(usuario))) {
      return true;
    }

    // No tiene permisos de asignación
    return false;
  }

}
