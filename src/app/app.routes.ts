import { Routes } from '@angular/router';
import { DashboardComponent } from './modules/dashboard/dashboard.component';
import { GrantDashboardAccessGuard, RedirectLoggedUserGuard } from './guards/authenticated.guard';

export const routes: Routes = [
    { path: 'dashboard', component: DashboardComponent, canActivate: [GrantDashboardAccessGuard] },
    { path: '', component: DashboardComponent, canActivate: [RedirectLoggedUserGuard] },
];
