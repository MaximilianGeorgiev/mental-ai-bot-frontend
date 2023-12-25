import { Routes } from '@angular/router';
import { DashboardComponent } from './modules/dashboard/dashboard.component';
import { IsAuthenticatedGuard } from './guards/authenticated.guard';

export const routes: Routes = [
    { path: 'dashboard', component: DashboardComponent, canActivate: [IsAuthenticatedGuard] },
];
