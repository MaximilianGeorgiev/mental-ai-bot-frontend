import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { isUserLoggedIn } from '../modules/api/auth';

@Injectable({
  providedIn: 'root',
})
export class IsAuthenticatedGuard {
  constructor(private router: Router) {
  }

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    const { success: isAccessAllowed } = await isUserLoggedIn();

    if (!isAccessAllowed) {
      this.router.navigate(['/']);
    }

    return isAccessAllowed;
  }
}
