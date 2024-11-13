// autenticado.guard.ts
import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthenticacionService } from '../services/authenticacion.service'; // Ajusta la ruta si es necesario

export const autenticadoGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthenticacionService); // Inyectar correctamente el servicio
  const router = inject(Router);

  // Verificar si el usuario está autenticado y tiene el permiso "todos"
  if (authService.isAuthenticated()) {
    console.log("Authent");
    return true;
  } else {
    // Si no está autenticado o no tiene permiso, redirige al login
    router.navigate(['/login']);
    return false;
  }
};
