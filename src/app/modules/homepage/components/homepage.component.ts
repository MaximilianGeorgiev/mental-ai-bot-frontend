import { Component } from "@angular/core";
import { CustomRipple } from "../../../shared/components/ripple/ripple.component";
import { MatButtonModule } from "@angular/material/button";
import { MatDialog } from "@angular/material/dialog";
import { AuthDialog } from "../../../shared/components/dialogs/auth/auth-dialog.component";

@Component({
  selector: "home-page",
  standalone: true,
  imports: [CustomRipple, MatButtonModule],
  templateUrl: "./homepage.component.html",
  styleUrl: "./homepage.component.css",
})
export class HomepageComponent {
  constructor(public dialog: MatDialog) {}

  openDialog(displayLoginForm: boolean) {
    const authDialogRef = this.dialog.open(AuthDialog, { data: { displayLoginForm } });

    authDialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }
}
