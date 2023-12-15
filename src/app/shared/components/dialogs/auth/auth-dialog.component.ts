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
import { ApiCallResult, LoginPayload, RegisterPayload } from "../../../../types/auth";
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
  usernameFormControl = new FormControl("", [Validators.required]);
  passwordFormControl = new FormControl("", [Validators.required]);
  // + register
  repeatPasswordFormControl = new FormControl("", [Validators.required]);
  genderFormControl = new FormControl("", [Validators.required]);
  goalsFormControl = new FormControl("", [Validators.required]);
  emailFormControl = new FormControl("", [Validators.required]);
  preferedActivitiesFormControl = new FormControl("", [Validators.required]);

  goalsOptions: SelectValue[] = createSelectValuesFromEnum(Goals);
  genderOptions: SelectValue[] = createSelectValuesFromEnum(Genders);
  preferedActivitiesOptions: SelectValue[] = createSelectValuesFromEnum(Activities);

  constructor(public dialogRef: MatDialogRef<AuthDialog>, @Inject(MAT_DIALOG_DATA) public data: AuthDialogData, private toastService: ToastService) {}

  loginFormHasError(): boolean {
    return this.usernameFormControl.hasError("required") || this.passwordFormControl.hasError("required");
  }

  registerFormHasError(): boolean {
    return (
      (this.loginFormHasError() || this.repeatPasswordFormControl.hasError("required")) ||
      this.genderFormControl.hasError("required") ||
      this.goalsFormControl.hasError("required") ||
      this.emailFormControl.hasError("required") ||
      this.preferedActivitiesFormControl.hasError("required")
    );
  }

  onClose(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    const formIssues = this.data.displayLoginForm ? this.loginFormHasError() : this.registerFormHasError();

    if (formIssues) {
      this.toastService.error(Notifications.INVALID_FORM_REQUIRED);
    } else {
      if (this.data.displayLoginForm) {
        login({ username: this.data.username, password: this.data.password }).then((response: ApiCallResult) => {
          response.success ? this.toastService.success(Notifications.LOGIN_SUCCESS) : this.toastService.error(Notifications.LOGIN_FAILURE);
        });
      }

      let payload: LoginPayload | RegisterPayload = {
        username: this.data.username,
        password: this.data.password,
      }

      if (!this.data.displayLoginForm) {
        if (this.data.password !== this.data.repeatPassword) {
          this.toastService.error(Notifications.PASSWORD_MISMATCH);
          return;
        }

        payload = {
          ...payload,
          email: this.data.email,
          gender: this.data.gender,
          country: this.data?.country,
          city: this.data?.city,
          preferedActivities: this.data.preferedActivities,
          goals: this.data.goals,
          age: this.data?.age,
        }
      }

      if (this.data.displayLoginForm) {
        login(payload).then((response: ApiCallResult) => {
          response.success ? this.toastService.success(Notifications.LOGIN_SUCCESS) : this.toastService.error(Notifications.LOGIN_FAILURE);
        });
      } else {
        register(payload as RegisterPayload).then((response: ApiCallResult) => {
          response.success ? this.toastService.success(Notifications.REGISTER_SUCCESS) : this.toastService.error(Notifications.REGISTER_FAILURE);
        });
      }
    }
  }
}
