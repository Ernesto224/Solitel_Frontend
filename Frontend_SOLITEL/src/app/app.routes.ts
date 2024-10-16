import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        /*loadComponent: () => import(''),*/
        children: [//se colocan todas las rutas asociadas a las paginas o vistas
            {
                path: 'bandeja',
                loadComponent: () => import('./shared/pages/bandeja/bandeja.component')
            },
            {
                path: 'reporteria',
                loadComponent: () => import('./shared/pages/reporteria/reporteria.component')
            },
            {
                path: 'solicitud-analisis',
                loadComponent: () => import('./shared/pages/solicitud-analisis/solicitud-analisis.component')
            },
            {
                path: 'solicitud-proveedor',
                loadComponent: () => import('./shared/pages/solicitud-proveedor/solicitud-proveedor.component')
            },
            {
                path: 'catalogos',
                loadComponent: () => import('./shared/pages/catalogos/catalogos.component')
            },
            {//redireccionamiento en caso de ruta vacia
                path: '',
                redirectTo: 'bandeja',
                pathMatch:'full'
            }
        ]
    },
    {//redireccion en caso de ruta no existente
        path: '**',
        redirectTo: 'bandeja',
    }
];
