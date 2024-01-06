import { Component, Input } from "@angular/core";
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
import { Router, RouterModule } from "@angular/router";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { createConversation, findConversation, getConversationMessages, sendMessage } from "../api/chat";
import { HttpStatusCode } from "axios";
import { ToastService } from "angular-toastify";
import { Notifications } from "../../enums/notifications.enum";
import { Conversation, Message } from "../../types/chat";
import { FormsModule } from "@angular/forms";
import { MatDividerModule } from "@angular/material/divider";

import { Location } from "@angular/common";
import { MessagePayload } from "../../types/api";

const USER_ICON_URL = `<svg xmlns="http://www.w3.org/2000/svg" height="16" width="14" viewBox="0 0 448 512"><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2023 Fonticons, Inc.--><path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z"/></svg>`;
const LOGOUT_ICON_URL = `<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 512 512"><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2023 Fonticons, Inc.--><path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"/></svg>`;
const SEND_ICON_URL = `<svg xmlns="http://www.w3.org/2000/svg" height="16" width="14" viewBox="0 0 448 512"><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2023 Fonticons, Inc.--><path d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z"/></svg>`;

@Component({
  selector: "chat-room",
  templateUrl: "chat.component.html",
  standalone: true,
  imports: [
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatExpansionModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    RouterModule,
    CommonModule,
    MatProgressBarModule,
    MatDividerModule,
  ],
})
export class ChatComponent {
  messageInput: string = "";
  userId = JSON.parse(localStorage.getItem("loggedUser")!)?._doc?._id;
  conversationId: string = "";
  loadedConversation: Conversation | null = null;
  guest: boolean = typeof this.userId === "undefined" ? true : false;
  conversationMessages: Message[] = [];
  username = JSON.parse(localStorage.getItem("loggedUser")!)?._doc?.username;

  constructor(iconRegistry: MatIconRegistry, sanitizer: DomSanitizer, private router: Router, private toast: ToastService, private location: Location) {
    iconRegistry.addSvgIconLiteral("user", sanitizer.bypassSecurityTrustHtml(USER_ICON_URL));
    iconRegistry.addSvgIconLiteral("logout", sanitizer.bypassSecurityTrustHtml(LOGOUT_ICON_URL));
    iconRegistry.addSvgIconLiteral("send", sanitizer.bypassSecurityTrustHtml(SEND_ICON_URL));
  }

  async ngOnInit(): Promise<void> {
    // extract conversation ID from route
    const routeElements = this.router.url?.split("/");
    let conversationParamFound;

    if (routeElements[2]) {
      conversationParamFound = routeElements[2];
    }

    // Conversation can be passed through the route or if not a new conversation has to be created
    // The user can be logged or a guest
    if (!conversationParamFound) {
      await this.createConversation();
    } else {
      await this.validateAndSetConversation(conversationParamFound);

      const { success, message: messagesFound } = await getConversationMessages(this.conversationId);

      if (success) this.conversationMessages = messagesFound;
      else this.toast.error(Notifications.FETCHMESSAGES_ERROR);
    }
  }

  async createConversation() {
    const {
      success,
      message: { _id: createdConversationId },
    } = await createConversation({
      dateCreated: new Date(),
      isGuest: this.guest,
      userId: this.userId,
    });

    if (success) {
      this.conversationId = createdConversationId;
      this.router.navigate(["/chat", createdConversationId]);
    }
  }

  async validateAndSetConversation(conversationId: string) {
    const { success, message: conversation } = await findConversation({ searchByProperty: "_id", searchValue: conversationId, findMany: false });

    // Either conversation doesn't exist or user is not the owner of that conversation and has no access
    if (!success) {
      this.toast.error(Notifications.LOADCONVERSATION_FAILURE + " " + conversation);
      return;
    }

    this.conversationId = conversationId;
    this.loadedConversation = conversation;

    this.toast.success(Notifications.LOADCONVERSATION_SUCCESS);
    this.router.navigate(["/chat", conversationId]);
  }

  async sendMessage() {
    let payload: MessagePayload = {
      message: this.messageInput,
      conversationId: this.conversationId,
      timestamp: new Date(),
      type: "User",
    };

    const loggedUserId = JSON.parse(localStorage.getItem("loggedUser")!)?._doc?._id;

    if (loggedUserId) {
      payload = {
        ...payload,
        userId: loggedUserId,
      };
    }

    const { success, message: createdMessage } = await sendMessage(payload);

    if (!success) this.toast.error(Notifications.SENDMESSAGE_ERROR);
    else this.conversationMessages.push(createdMessage);
  }
}
