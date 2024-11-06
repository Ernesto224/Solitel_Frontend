import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthenticacionService {
  private usuarioKey = 'usuario';

  // Usuarios quemados para pruebas
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
          permisos: [{ nombre: 'Crear solicitudes de analisis' }],
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
    contrasennia: 'Melgara1212!!',
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

  usuarios = [this.usuarioPrueba, this.usuarioPrueba2];

  constructor() {}

  private isSessionStorageAvailable(): boolean {
    return (
      typeof window !== 'undefined' && typeof sessionStorage !== 'undefined'
    );
  }

  login(username: string, password: string): void {
    if (this.isSessionStorageAvailable()) {
      const usuario = this.usuarios.find(
        (user) => user.usuario === username && user.contrasennia === password
      );

      if (usuario) {
        sessionStorage.setItem(this.usuarioKey, JSON.stringify(usuario));
        console.log('Login successful');
      } else {
        console.error('Invalid username or password');
      }
    } else {
      console.error('Session storage is not available');
    }
  }

  logout(): void {
    if (this.isSessionStorageAvailable()) {
      sessionStorage.removeItem(this.usuarioKey);
    }
  }

  getUsuario(): any {
    if (this.isSessionStorageAvailable()) {
      const usuario = sessionStorage.getItem(this.usuarioKey);
      return usuario ? JSON.parse(usuario) : null;
    }
    return null;
  }

  tienePermiso(permiso: string): boolean {
    const usuario = this.getUsuario();
    if (!usuario) {
      return false;
    }
  
    for (const oficina of usuario.oficina) {
      if (oficina.rol.permisos.some((p: { nombre: string }) => p.nombre === permiso || p.nombre === 'todos')) {
        return true;
      }
    }
    return false;
  }
  

  isAuthenticated(): boolean {
    return this.getUsuario() !== null;
  }
}
