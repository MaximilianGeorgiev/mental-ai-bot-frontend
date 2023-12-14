import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose } from "@angular/material/dialog";
import { MatButtonModule } from "@angular/material/button";
import { FormControl, FormsModule, Validators } from "@angular/forms";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { CommonModule } from "@angular/common";
import { login, register } from "../../../../modules/api/auth";
import { ReactiveFormsModule } from "@angular/forms";
import { ToastService, AngularToastifyModule } from "angular-toastify";
import { Notifications } from "../../../../enums/notifications.enum";
import { ApiCallResult } from "../../../../types/auth";
import { Activity, Gender, Goal } from "../../../../types/user";
import { SelectValue } from "../../../../types/ui";
import { MatSelectModule } from "@angular/material/select";
import { Activities, Genders, Goals } from "../../../../enums/users.enum";
import { createSelectValuesFromEnum } from "../../../../utils/ui-utils";

export interface AuthDialogData {
  // form control
  displayLoginForm: boolean;
  // login only
  username: string;
  password: string;
  // + register
  email?: string;
  repeatPassword?: string;
  gender?: Gender;
  country?: string;
  city?: string;
  preferedActivities?: Activity[];
  goals?: Goal[];
  age?: number;
}

@Component({
  selector: "auth-dialog",
  templateUrl: "auth-dialog.component.html",
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
export class AuthDialog {
  // login
  usernameFormContorl = new FormControl("", [Validators.required]);
  passwordFormControl = new FormControl("", [Validators.required]);
  // + register

  goalsOptions: SelectValue[] = createSelectValuesFromEnum(Goals);
  genderOptions: SelectValue[] = createSelectValuesFromEnum(Genders);
  preferedActivitiesOptions: SelectValue[] = createSelectValuesFromEnum(Activities);

  constructor(public dialogRef: MatDialogRef<AuthDialog>, @Inject(MAT_DIALOG_DATA) public data: AuthDialogData, private toastService: ToastService) {}

  onClose(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.usernameFormContorl.hasError("required") || this.passwordFormControl.hasError("required")) {
      this.toastService.error(Notifications.INVALID_FORM_REQUIRED);
    } else {
      if (this.data.displayLoginForm) {
        login({ username: this.data.username, password: this.data.password }).then((response: ApiCallResult) => {
          response.success ? this.toastService.success(Notifications.LOGIN_SUCCESS) : this.toastService.error(Notifications.LOGIN_FAILURE);
        });
      }
      this.data.displayLoginForm ? login({ username: this.data.username, password: this.data.password }) : undefined;
    }
  }
}
