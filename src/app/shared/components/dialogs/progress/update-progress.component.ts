import { Component, Inject } from "@angular/core";
import { MatDialogRef, MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatButtonModule } from "@angular/material/button";
import { FormControl, FormsModule, Validators } from "@angular/forms";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";
import { ToastService, AngularToastifyModule } from "angular-toastify";
import { MatSelectModule } from "@angular/material/select";
import { MatNativeDateModule } from "@angular/material/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatIconModule } from "@angular/material/icon";
import { MatRadioModule } from "@angular/material/radio";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { DailyTask, SelfCarePlan } from "../../../../types/plans";
import { Notifications } from "../../../../enums/notifications.enum";
import { update as updatePlan } from "../../../../modules/api/plans";

@Component({
  selector: "update-progress",
  templateUrl: "update-progress.component.html",
  standalone: true,
  imports: [
    MatCheckboxModule,
    MatRadioModule,
    MatIconModule,
    MatNativeDateModule,
    MatDatepickerModule,
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
  providers: [MatDatepickerModule, MatNativeDateModule],
})
export class UpdateProgressDialog {
  forDate: Date = new Date();
  trackPreviousDate: boolean = false;
  progress: number = 0;

  forDateFormControl = new FormControl("", [Validators.required]);
  progressFormControl = new FormControl("", [Validators.required]);

  constructor(
    public dialogRef: MatDialogRef<UpdateProgressDialog>,
    @Inject(MAT_DIALOG_DATA) public data: { plan: SelfCarePlan; taskToUpdate: DailyTask },
    private toastService: ToastService
  ) {}

  onClose(): void {
    this.dialogRef.close();
  }

  formHasError(): boolean {
    return this.progressFormControl.hasError("required") || this.progress === 0;
  }

  async updateProgress() {
    // If a previous date is specified validate if it wasn't already updated
    // TO DO: Store all dates when an update was made and prevent the user providing progress for dates when they
    // already updated. For now the flaw is that it can only validate with the "previouslyUpdate" property.
    const { dateUpdated, percentCompleted, activity, metricQuantity } = this.data.taskToUpdate;
    const {} = this.data.plan;

    // If the date provided is the same as the last update throw toast
    if (this.trackPreviousDate && this.forDate === dateUpdated) {
      this.toastService.error(Notifications.TRACKPROGRESS_INVALID_DATE);
      return;
    }

    // Throw error toast if no progress is provided
    if (this.formHasError()) {
      this.toastService.error(Notifications.INVALID_FORM_REQUIRED);
      return;
    }

    this.data.taskToUpdate.dateUpdated = new Date();
    this.data.taskToUpdate.percentCompleted += (this.progress / metricQuantity) * 100;

    this.data.plan.dailyTasks = [...this.data.plan.dailyTasks.filter((task: DailyTask) => task.activity !== activity), this.data.taskToUpdate];
    this.data.plan.progress = this.calculatePlanUpdatedPercentage(this.data.plan.dailyTasks);

    if (this.data.plan.progress >= 100) {
      this.data.plan.isCompleted = true;
    }

    const { success } = await updatePlan(this.data.plan);

    if (success) {
      this.toastService.success(Notifications.TRAKCPROGRESS_SUCCESS);
    } else {
      this.toastService.error(Notifications.TRACKPROGRESS_FAILURE);
    }
  }

  calculatePlanUpdatedPercentage(dailyTasks: DailyTask[]): number {
    let newPercentage = 0;

    dailyTasks.forEach((task: DailyTask) => (newPercentage += task.percentCompleted));
    return Number((newPercentage / dailyTasks.length).toFixed(2));
  }
}
