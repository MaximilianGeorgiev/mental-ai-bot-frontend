import { Component, Input } from "@angular/core";
import { MatRippleModule } from "@angular/material/core";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { FormsModule } from "@angular/forms";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { RippleOnHoverDirective } from "./ripple.directive";

@Component({
  selector: "custom-ripple",
  templateUrl: "ripple.component.html",
  styleUrls: ["ripple.component.css"],
  standalone: true,
  imports: [MatCheckboxModule, FormsModule, MatFormFieldModule, MatInputModule, MatRippleModule, RippleOnHoverDirective],
})
export class CustomRipple {
  centered = false;
  disabled = false;
  unbounded = false;

  radius: number = 180;
  color: string = "gray";

  @Input() divText: string = "";
}
