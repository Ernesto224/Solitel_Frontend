import { Routes } from '@angular/router';
import DistribucionComponent from './shared/pages/distribucion/distribucion.component';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./shared/pages/login/login.component'),
  },
  {
    path: '',
    component: DistribucionComponent,
    children: [
      //se colocan todas las rutas asociadas a las paginas o vistas
      {
        path: 'analisis-telefonico',
        loadComponent: () =>
          import(
            './shared/pages/analisis-telefonico/analisis-telefonico.component'
          ),
      },
      {
        path: 'bandeja',
        loadComponent: () => import('./shared/pages/bandeja/bandeja.component'),
      },
      {
        path: 'reporteria',
        loadComponent: () =>
          import('./shared/pages/reporteria/reporteria.component'),
      },
      {
        path: 'solicitud-proveedor',
        loadComponent: () =>
          import(
            './shared/pages/solicitud-proveedor/solicitud-proveedor.component'
          ),
      },
      {
        path: 'catalogos',
        loadComponent: () =>
          import('./shared/pages/catalogos/catalogos.component'),
      },
      {
        //redireccionamiento en caso de ruta vacia
        path: '',
        redirectTo: 'bandeja',
        pathMatch: 'full',
      },
    ],
  },
  {
    //redireccion en caso de ruta no existente
    path: '**',
    redirectTo: 'login',
  },
];
