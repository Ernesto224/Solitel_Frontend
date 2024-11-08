import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { RouterOutlet } from '@angular/router';

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
    nombre: 'Jesner',
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

  constructor(private router: Router) {}

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
      localStorage.removeItem(this.usuarioKey);
    }
  }

  getUsuario(): any {
    if (this.isSessionStorageAvailable()) {
      const usuario = sessionStorage.getItem(this.usuarioKey);
      return usuario ? JSON.parse(usuario) : null;
    }
    console.log("NULL EN EL SESSION");
    return null;
  }
  tienePermiso(permiso: string): boolean {
    const usuario = this.getUsuario();
    if (!usuario || !usuario.oficina || !usuario.oficina.rol || !Array.isArray(usuario.oficina.rol.permisos)) {
      return false;
    }
  
    return usuario.oficina.rol.permisos.some((p: { nombre: string }) => p.nombre === permiso || p.nombre === 'todos');
  }
  
  agregarUsuario(usuario:any, usuarioOriginal:any){
    if (this.isSessionStorageAvailable()) {
        sessionStorage.setItem(this.usuarioKey, JSON.stringify(usuario));
        localStorage.setItem(this.usuarioKey, JSON.stringify(usuario));
        
    }
    if(this.getUsuario() !== null){
      this.router.navigate(['/']);
      console.log('Usuario CONFIRMADO');
    }
  }

  isAuthenticated(): boolean {
    return this.getUsuario() !== null;
  }
}
