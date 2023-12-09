import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose } from "@angular/material/dialog";
import { MatButtonModule } from "@angular/material/button";
import { FormControl, FormsModule, Validators } from "@angular/forms";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { CommonModule } from "@angular/common";
import { login, register } from "../../../../modules/api/auth";
import { ReactiveFormsModule } from "@angular/forms";

export interface AuthDialogData {
  username: string;
  password: string;
  displayLoginForm: boolean;
}

@Component({
  selector: "auth-dialog",
  templateUrl: "auth-dialog.component.html",
  standalone: true,
  imports: [
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
  ],
})
export class AuthDialog {
  usernameFormContorl = new FormControl("", [Validators.required]);
  passwordFormControl = new FormControl("", [Validators.required]);

  constructor(public dialogRef: MatDialogRef<AuthDialog>, @Inject(MAT_DIALOG_DATA) public data: AuthDialogData) {
    console.log("test " + JSON.stringify(data));
  }

  onClose(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    console.log("errs " + this.usernameFormContorl.hasError("required"));

    if (this.usernameFormContorl.hasError("required") || this.passwordFormControl.hasError("required")) {
      // TO DO: Add toast
    } else {
      this.data.displayLoginForm ? login({ username: this.data.username, password: this.data.password }) : undefined;
    }
  }
}
