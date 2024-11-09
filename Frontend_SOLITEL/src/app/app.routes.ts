import { Routes } from '@angular/router';
import DistribucionComponent from './shared/pages/distribucion/distribucion.component';
import { autenticadoGuard } from './shared/guards/autenticado.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./shared/pages/login/login.component'),
  },
  {
    path: 'seleccionar-oficina',
    canActivate: [autenticadoGuard],
    loadComponent: () => import('./shared/pages/seleccionar-oficina/seleccionar-oficina.component'),
  },
  {
    path: '',
    component: DistribucionComponent,
    canActivateChild: [autenticadoGuard],
    children: [
      //se colocan todas las rutas asociadas a las paginas o vistas
      {
        path: 'analisis-telefonico',
        loadComponent: () =>
          import(
            './shared/pages/analisis-telefonico/analisis-telefonico.component'
          ),
      }, {
        path: 'vista-proveedor',
        loadComponent: () =>
          import(
            './shared/pages/vista-proveedor/vista-proveedor.component'
          ),
      },
      {
        path: 'bandeja-analista',
        loadComponent: () =>
          import('./shared/pages/bandeja-analista/bandeja-analista.component'),
      },
      {
        path: 'detalle-solicitud-analista/:id',
        loadComponent: () =>
          import('./shared/pages/detalle-solicitud-analista/detalle-solicitud-analista.component'),
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
