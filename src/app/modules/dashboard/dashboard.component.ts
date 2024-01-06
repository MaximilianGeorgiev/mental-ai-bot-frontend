import { Component } from "@angular/core";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule, MatIconRegistry } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatToolbarModule } from "@angular/material/toolbar";
import { DomSanitizer } from "@angular/platform-browser";
import { find as findPlans } from "../api/plans";
import { CommonModule } from "@angular/common";
import { MatDialog } from "@angular/material/dialog";
import { CreatePlanDialog } from "../../shared/components/dialogs/create-plan/create-plan.component";
import { UpdateProgressDialog } from "../../shared/components/dialogs/progress/update-progress.component";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { DailyTask, SelfCarePlan } from "../../types/plans";
import { Router } from "@angular/router";
import { Conversation } from "../../types/chat";
import { findConversation } from "../api/chat";

const USER_ICON_URL = `<svg xmlns="http://www.w3.org/2000/svg" height="16" width="14" viewBox="0 0 448 512"><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2023 Fonticons, Inc.--><path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z"/></svg>`;
const LOGOUT_ICON_URL = `<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 512 512"><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2023 Fonticons, Inc.--><path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"/></svg>`;
const ADD_ICON_URL = `<svg xmlns="http://www.w3.org/2000/svg" height="16" width="14" viewBox="0 0 448 512"><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2023 Fonticons, Inc.--><path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"/></svg>`;
const UPDATE_ICON_URL = `<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 512 512"><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2023 Fonticons, Inc.--><path d="M362.7 19.3L314.3 67.7 444.3 197.7l48.4-48.4c25-25 25-65.5 0-90.5L453.3 19.3c-25-25-65.5-25-90.5 0zm-71 71L58.6 323.5c-10.4 10.4-18 23.3-22.2 37.4L1 481.2C-1.5 489.7 .8 498.8 7 505s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L421.7 220.3 291.7 90.3z"/></svg>`;
const CONTINUE_CHAT_URL = `<svg xmlns="http://www.w3.org/2000/svg" height="16" width="18" viewBox="0 0 576 512"><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M284 224.8a34.1 34.1 0 1 0 34.3 34.1A34.2 34.2 0 0 0 284 224.8zm-110.5 0a34.1 34.1 0 1 0 34.3 34.1A34.2 34.2 0 0 0 173.6 224.8zm220.9 0a34.1 34.1 0 1 0 34.3 34.1A34.2 34.2 0 0 0 394.5 224.8zm153.8-55.3c-15.5-24.2-37.3-45.6-64.7-63.6-52.9-34.8-122.4-54-195.7-54a406 406 0 0 0 -72 6.4 238.5 238.5 0 0 0 -49.5-36.6C99.7-11.7 40.9 .7 11.1 11.4A14.3 14.3 0 0 0 5.6 34.8C26.5 56.5 61.2 99.3 52.7 138.3c-33.1 33.9-51.1 74.8-51.1 117.3 0 43.4 18 84.2 51.1 118.1 8.5 39-26.2 81.8-47.1 103.5a14.3 14.3 0 0 0 5.6 23.3c29.7 10.7 88.5 23.1 155.3-10.2a238.7 238.7 0 0 0 49.5-36.6A406 406 0 0 0 288 460.1c73.3 0 142.8-19.2 195.7-54 27.4-18 49.1-39.4 64.7-63.6 17.3-26.9 26.1-55.9 26.1-86.1C574.4 225.4 565.6 196.4 548.3 169.5zM285 409.9a345.7 345.7 0 0 1 -89.4-11.5l-20.1 19.4a184.4 184.4 0 0 1 -37.1 27.6 145.8 145.8 0 0 1 -52.5 14.9c1-1.8 1.9-3.6 2.8-5.4q30.3-55.7 16.3-100.1c-33-26-52.8-59.2-52.8-95.4 0-83.1 104.3-150.5 232.8-150.5s232.9 67.4 232.9 150.5C517.9 342.5 413.6 409.9 285 409.9z"/></svg>`;

@Component({
  selector: "dashboard",
  templateUrl: "dashboard.component.html",
  standalone: true,
  imports: [MatExpansionModule, MatCardModule, MatIconModule, MatButtonModule, MatToolbarModule, CommonModule, MatProgressBarModule],
})
export class DashboardComponent {
  isPlanPanelOpen = true;

  hasSelfCarePlan = false;
  hasConversations = false;
  userConversations: Conversation[] = [];
  userPlans: SelfCarePlan[] = [];

  constructor(public dialog: MatDialog, iconRegistry: MatIconRegistry, sanitizer: DomSanitizer, private router: Router) {
    iconRegistry.addSvgIconLiteral("user", sanitizer.bypassSecurityTrustHtml(USER_ICON_URL));
    iconRegistry.addSvgIconLiteral("logout", sanitizer.bypassSecurityTrustHtml(LOGOUT_ICON_URL));
    iconRegistry.addSvgIconLiteral("add", sanitizer.bypassSecurityTrustHtml(ADD_ICON_URL));
    iconRegistry.addSvgIconLiteral("update", sanitizer.bypassSecurityTrustHtml(UPDATE_ICON_URL));
    iconRegistry.addSvgIconLiteral("continue-chat", sanitizer.bypassSecurityTrustHtml(CONTINUE_CHAT_URL));
  }

  async ngOnInit() {
    const queryParams = {
      searchByProperty: "userId",
      searchValue: JSON.parse(localStorage.getItem("loggedUser")!)._doc._id,
      findMany: true,
    };

    const { message: plansFound } = await findPlans(queryParams);
    const { message: conversationsFound } = await findConversation(queryParams);

    if (plansFound.length > 0) {
      this.hasSelfCarePlan = true;
      this.userPlans = plansFound;
    }

    if (conversationsFound.length > 0) {
      this.hasConversations = true;
      this.userConversations = conversationsFound;
    }
  }

  openDialog(dialog: "CreatePlan" | "TrackProgress", plan?: SelfCarePlan, taskToUpdate?: DailyTask) {
    if (dialog === "CreatePlan") {
      this.dialog.open(CreatePlanDialog);
    } else if (dialog === "TrackProgress") {
      this.dialog.open(UpdateProgressDialog, { data: { plan, taskToUpdate } });
    }
  }

  openChat(conversationId?: any) {
    conversationId ? this.router.navigate([`/chat/${conversationId}`]) : this.router.navigate(["/chat"]);
  }

  logout() {
    localStorage.removeItem("loggedUser");
    localStorage.removeItem("token");
    this.router.navigate([""]);
  }

  displayTaskProgress({ metricQuantity, metric, percentCompleted }: DailyTask) {
    const progress = (percentCompleted / 100) * metricQuantity;

    return `${progress}/${metricQuantity} ${metric} (${percentCompleted}%)`;
  }

  displayShortDate(databaseDate: Date) {
    const date = new Date(databaseDate);
    return date.toISOString().split("T")[0];
  }
}
