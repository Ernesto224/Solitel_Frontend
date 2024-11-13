import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthenticacionService {
  private usuarioKey = 'usuario';
  private oficeKey = 'ofices';

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
      },{
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
            { nombre: 'Ver Solicitudes Analisis Oficina' },
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
            { nombre: 'Ver Solicitudes Analisis Propias' },
            { nombre: 'Responder Solicitudes Analisis' }
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

  login(username: string, password: string): any {
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

  logout(): void {
    if (this.isSessionStorageAvailable()) {
      sessionStorage.removeItem(this.usuarioKey);
    }
  }

  deleteOfice(): void {
    if (this.isSessionStorageAvailable()) {
      sessionStorage.removeItem(this.oficeKey);
    }
  }

  getUsuario(): any {
    if (this.isSessionStorageAvailable()) {
      const usuario = sessionStorage.getItem(this.usuarioKey);
      return usuario ? JSON.parse(usuario) : null;
    }
    return null;
  }

  getOficinas(): any {
    if (this.isSessionStorageAvailable()) {
      const oficina = sessionStorage.getItem(this.oficeKey);
      return oficina ? JSON.parse(oficina) : null;
    }
    return null;
  }

  tienePermiso(permiso: string): boolean {
    const usuario: any = this.getUsuario();
  
    // Verificación de la existencia de propiedades requeridas
    if (!usuario || !usuario.oficina || !usuario.oficina.rol || !Array.isArray(usuario.oficina.rol.permisos)) {
      return false;
    }
  
    // Verificación de permisos
    return usuario.oficina.rol.permisos.some((p: any) => p.nombre === permiso || p.nombre === 'todos');
  }
  
  

  agregarUsuario(usuario: any) {
    if (this.isSessionStorageAvailable()) {
      sessionStorage.setItem(this.usuarioKey, JSON.stringify(usuario));
    }
  }

  agregarOficinas(oficinas: any) {
    if (this.isSessionStorageAvailable()) {
      sessionStorage.setItem(this.oficeKey, JSON.stringify(oficinas));
    }
  }

  isAuthenticated(): boolean {
    return this.getUsuario() !== null;
  }

}
