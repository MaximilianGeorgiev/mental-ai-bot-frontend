import { Component } from "@angular/core";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule, MatIconRegistry } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatToolbarModule } from "@angular/material/toolbar";
import { DomSanitizer } from "@angular/platform-browser";
import { find as findPlans } from "../api/plans";
import { CommonModule } from "@angular/common";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material/dialog";
import { CreatePlanDialog } from "../../shared/components/dialogs/auth/create-plan/create-plan.component";
import { AuthDialog } from "../../shared/components/dialogs/auth/auth-dialog.component";

const USER_ICON_URL = `<svg xmlns="http://www.w3.org/2000/svg" height="16" width="14" viewBox="0 0 448 512"><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2023 Fonticons, Inc.--><path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z"/></svg>`;
const LOGOUT_ICON_URL = `<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 512 512"><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2023 Fonticons, Inc.--><path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"/></svg>`;
const ADD_ICON_URL = `<svg xmlns="http://www.w3.org/2000/svg" height="16" width="14" viewBox="0 0 448 512"><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2023 Fonticons, Inc.--><path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"/></svg>`;

@Component({
  selector: "dashboard",
  templateUrl: "dashboard.component.html",
  standalone: true,
  imports: [MatExpansionModule, MatCardModule, MatIconModule, MatButtonModule, MatToolbarModule, CommonModule],
})
export class DashboardComponent {
  isPanelOpen = false;
  hasSelfCarePlan = false;

  constructor(public dialog: MatDialog, iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) {
    iconRegistry.addSvgIconLiteral("user", sanitizer.bypassSecurityTrustHtml(USER_ICON_URL));
    iconRegistry.addSvgIconLiteral("logout", sanitizer.bypassSecurityTrustHtml(LOGOUT_ICON_URL));
    iconRegistry.addSvgIconLiteral("add", sanitizer.bypassSecurityTrustHtml(ADD_ICON_URL));
  }

  async ngOnInit() {
    const queryParams = {
      searchByProperty: "userId",
      searchValue: JSON.parse(localStorage.getItem("loggedUser")!)._doc._id,
      findMany: true,
    };

    const { message } = await findPlans(queryParams);

    if (message.length > 0) this.hasSelfCarePlan = true;
  }

  openDialog() {
    const authDialogRef = this.dialog.open(CreatePlanDialog);
  }
}
