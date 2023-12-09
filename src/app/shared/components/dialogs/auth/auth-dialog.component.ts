import { Component, Inject } from "@angular/core";
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef, MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose } from "@angular/material/dialog";
import { MatButtonModule } from "@angular/material/button";
import { FormsModule } from "@angular/forms";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { CommonModule } from "@angular/common";

export interface AuthDialogData {
  email: string;
  password: string;
  displayLoginForm: boolean;
}

@Component({
  selector: "auth-dialog",
  templateUrl: "auth-dialog.component.html",
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule, MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose, CommonModule],
})
export class AuthDialog {
  constructor(public dialogRef: MatDialogRef<AuthDialog>, @Inject(MAT_DIALOG_DATA) public data: AuthDialogData) {
    console.log("test " + JSON.stringify(data));
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
