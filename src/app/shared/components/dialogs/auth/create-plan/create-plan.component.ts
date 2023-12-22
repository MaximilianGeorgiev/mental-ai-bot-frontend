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
import { MatSelectModule } from "@angular/material/select";
import { SelectValue } from "../../../../../types/ui";
import { TaskIntensities } from "../../../../../enums/plans.enum";
import { createSelectValuesFromEnum } from "../../../../../utils/ui-utils";
import { find as findActivityProperties } from "../../../../../modules/api/activity-properites";
import { DailyTask, TaskIntensity } from "../../../../../types/plans";
import { Activity } from "../../../../../types/user";
import { create as createPlan } from "../../../../../modules/api/plans";
import { MatNativeDateModule } from "@angular/material/core";
import { MatDatepickerModule } from "@angular/material/datepicker";

export interface CreatePlanDialogData {
  intensity: "light" | "moderate" | "intense";
  endDate: Date;
  activitiesNotSpecified: boolean;
}

@Component({
  selector: "create-plan-dialog",
  templateUrl: "create-plan.component.html",
  standalone: true,
  imports: [
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
export class CreatePlanDialog {
  intensity = TaskIntensities.MODERATE;
  endDate: Date = new Date();
  activitiesNotSpecified: boolean = false;
  taskIntensityOptions: SelectValue[] = createSelectValuesFromEnum(TaskIntensities);
  activitiesGenerated: Partial<DailyTask[]> = [];
  activitiesApproved: boolean = false;

  endDateFormControl = new FormControl("", [Validators.required]);
  intensityFormControl = new FormControl("", [Validators.required]);

  constructor(public dialogRef: MatDialogRef<CreatePlanDialog>, private toastService: ToastService) {}

  onClose(): void {
    this.dialogRef.close();
  }

  formHasError(): boolean {
    return this.endDateFormControl.hasError("required") || this.intensityFormControl.hasError("required");
  }

  // Generate daily tasks to be included in the plan and allow user to approve/regenerate the tasks
  async generateSelfCarePlanActivities() {
    if (this.formHasError()) {
      this.toastService.error(Notifications.INVALID_FORM_REQUIRED);
      return;
    }

    const userPreferedActivities = JSON.parse(localStorage.getItem("loggedUser")!)._doc.preferedActivities;

    if (!userPreferedActivities) {
      this.activitiesNotSpecified = true;
      return;
    }

    let dailyTasks: DailyTask[] = [];
    let preferedActivitiesIterated = 0;

    // Fetch additional info for the activities
    for await (const activity of userPreferedActivities) {
      if (preferedActivitiesIterated > 2) break; // generate a plan with 2 daily tasks for now

      const { message: activityInfo } = await findActivityProperties({ searchByProperty: "activityName", searchValue: activity, findMany: false });

      console.log("act" + JSON.stringify(activityInfo));
      dailyTasks.push({
        activity: activityInfo.activityName as Activity,
        description: activityInfo.benefits,
        metric: activityInfo.metric,
        metricQuantity:
          this.intensity === TaskIntensities.LIGHT
            ? activityInfo.metricQuantityLight
            : this.intensity === TaskIntensities.MODERATE
            ? activityInfo.metricQuantityModerate
            : this.intensity === TaskIntensities.INTENSE
            ? activityInfo.metricQuantityIntense
            : "",
        dateUpdated: new Date(),
        percentCompleted: 0,
      });

      preferedActivitiesIterated++;
    }

    this.activitiesGenerated = [...dailyTasks];
  }

  async generateSelfCarePlan() {
    if (this.activitiesApproved) {
      let selfCarePlan = {
        description: "",
        progress: 0,
        isCompleted: false,
        targetDate: this.endDate,
        dailyTasks: this.activitiesGenerated as DailyTask[],
        userId: JSON.parse(localStorage.getItem("loggedUser")!)._id,
      };

      const { success } = await createPlan(selfCarePlan);

      if (success) {
        this.toastService.success(Notifications.CREATEPLAN_SUCCESS);
      } else {
        this.toastService.error(Notifications.CREATEPLAN_FAILURE);
      }
    } else {
      this.toastService.error(Notifications.CREATEPLAN_NOT_APPROVED);
    }
  }
}
