import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose } from "@angular/material/dialog";
import { MatButtonModule } from "@angular/material/button";
import { FormControl, FormsModule, Validators } from "@angular/forms";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";
import { ToastService, AngularToastifyModule } from "angular-toastify";
import { Notifications } from "../../../../../enums/notifications.enum";
import { ApiCallResult, LoginPayload, RegisterPayload } from "../../../../../types/api";
import { MatSelectModule } from "@angular/material/select";



@Component({
  selector: "create-plan-dialog",
  templateUrl: "create-plan.component.html",
  standalone: true,
  imports: [
    MatSelectModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    CommonModule,
    AngularToastifyModule,
  ],
})
export class CreatePlanDialog {
  // login
  usernameFormControl = new FormControl("", [Validators.required]);
  passwordFormControl = new FormControl("", [Validators.required]);
  // + register
  repeatPasswordFormControl = new FormControl("", [Validators.required]);
  genderFormControl = new FormControl("", [Validators.required]);
  goalsFormControl = new FormControl("", [Validators.required]);
  emailFormControl = new FormControl("", [Validators.required]);
  preferedActivitiesFormControl = new FormControl("", [Validators.required]);

  constructor(public dialogRef: MatDialogRef<CreatePlanDialog>, private toastService: ToastService) {}


  onClose(): void {
    this.dialogRef.close();
  }

}
