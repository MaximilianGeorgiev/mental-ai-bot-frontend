import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router } from "@angular/router";
import { isUserLoggedIn } from "../modules/api/auth";

@Injectable({
  providedIn: "root",
})
export class GrantDashboardAccessGuard {
  constructor(private router: Router) {}

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    const { success: isAccessAllowed } = await isUserLoggedIn();

    if (!isAccessAllowed) {
      this.router.navigate(["/"]);
    }

    return isAccessAllowed;
  }
}

// Redirect user to dashboard (authenticated screen) if they are logged
@Injectable({
  providedIn: "root",
})
export class RedirectLoggedUserGuard {
  constructor(private router: Router) {}

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    const { success: isAccessAllowed } = await isUserLoggedIn();

    if (isAccessAllowed) {
      this.router.navigate(["/dashboard"]);
    }

    return isAccessAllowed;
  }
}
