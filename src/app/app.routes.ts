import { Routes } from '@angular/router';
import { DashboardComponent } from './modules/dashboard/dashboard.component';
import { GrantDashboardAccessGuard, RedirectLoggedUserGuard } from './guards/authenticated.guard';
import { ChatComponent } from './modules/chat/chat.component';

export const routes: Routes = [
    { path: 'dashboard', component: DashboardComponent, canActivate: [GrantDashboardAccessGuard] },
    { path: '', component: DashboardComponent, canActivate: [RedirectLoggedUserGuard] },
    { path: 'chat', component: ChatComponent},
];
