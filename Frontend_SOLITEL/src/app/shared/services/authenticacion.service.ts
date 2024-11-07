import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthenticacionService {
  private usuarioKey = 'usuario';

  // Usuario quemado para pruebas
  private usuarioPrueba = {
    IdUsuario: 1,
    nombre: 'Eliecer',
    Apellido: 'Melgara',
    correoElectronico: 'eliecermelgara1680@gmail.com',
    usuario: 'eliecer.melgara',
    contrasennia: 'Melgara1212!',
    oficina: [
      {
        idOficina: 2,
        nombre: '0059-DELEGACION REGIONAL DE HEREDIA',
        tipo: 'Investigacion',
        rol: {
          nombre: 'Administrador',
          permisos: [{ nombre: 'todos' }],
        },
      },
    ],
  };
  private usuarioPrueba2 = {
    IdUsuario: 2,
    nombre: 'Eliecer',
    Apellido: 'Melgara',
    correoElectronico: 'eliecermelgara1680@gmail.com',
    usuario: 'eliecer.melgara',
    contrasennia: 'Melgara1212!',
    oficina: [
      {
        idOficina: 1,
        nombre:
          '1101-CENTRO JUDICIAL DE INTERVENCION DE LAS COMUNICACIONES (CJIC)',
        tipo: 'Investigacion',
        rol: {
          nombre: 'Jefatura de Investigador',
          permisos: [
            { nombre: 'Crear Solicitud Proveedor' },
            { nombre: 'Ver solicitudes propias' },
            { nombre: 'Crear solicitudes de analisis' },
            { nombre: 'Aprobar Solicitudes' },
          ],
        },
      },
      {
        idOficina: 2,
        nombre: '0059-DELEGACION REGIONAL DE HEREDIA',
        tipo: 'Investigacion',
        rol: {
          nombre: 'Investigador',
          permisos: [
            { nombre: 'Crear Solicitud Proveedor' },
            { nombre: 'Ver solicitudes propias' },
            { nombre: 'Crear solicitudes de analisis' },
          ],
        },
      },
    ],
  };
  constructor() {}

  // Comprobar si `sessionStorage` está disponible (para evitar errores en SSR)
  private isSessionStorageAvailable(): boolean {
    return (
      typeof window !== 'undefined' && typeof sessionStorage !== 'undefined'
    );
  }

  // Iniciar sesión guardando el usuario de prueba en sessionStorage
  login() {
    if (this.isSessionStorageAvailable()) {
      sessionStorage.setItem(
        this.usuarioKey,
        JSON.stringify(this.usuarioPrueba)
      );
    }
  }

  // Cerrar sesión
  logout() {
    if (this.isSessionStorageAvailable()) {
      sessionStorage.removeItem(this.usuarioKey);
    }
  }

  // Obtener usuario de la sesión
  getUsuario() {
    if (this.isSessionStorageAvailable()) {
      const usuario = sessionStorage.getItem(this.usuarioKey);
      return usuario ? JSON.parse(usuario) : null;
    }
    return null;
  }

  // Verificar si el usuario tiene permiso
  tienePermiso(permiso: string): boolean {
    const usuario = this.getUsuario();
    return (
      usuario &&
      usuario.rol.permisos.some((p: { nombre: string }) => p.nombre === permiso)
    );
  }

  // Verificar si el usuario está autenticado
  isAuthenticated(): boolean {
    return this.getUsuario() !== null;
  }
}
