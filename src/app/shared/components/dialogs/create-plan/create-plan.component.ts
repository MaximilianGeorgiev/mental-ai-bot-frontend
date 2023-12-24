import {  Component } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose } from "@angular/material/dialog";
import { MatButtonModule } from "@angular/material/button";
import { FormControl, FormsModule, Validators } from "@angular/forms";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";
import { ToastService, AngularToastifyModule } from "angular-toastify";
import { Notifications } from "../../../../enums/notifications.enum";
import { MatSelectModule } from "@angular/material/select";
import { SelectValue } from "../../../../types/ui";
import { TaskIntensities } from "../../../../enums/plans.enum";
import { createSelectValuesFromEnum } from "../../../../utils/ui-utils";
import { find as findActivityProperties } from "../../../../modules/api/activity-properites";
import { DailyTask, TaskIntensity } from "../../../../types/plans";
import { Activity } from "../../../../types/user";
import { create as createPlan } from "../../../../modules/api/plans";
import { MatNativeDateModule } from "@angular/material/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatIconModule, MatIconRegistry } from "@angular/material/icon";
import { DomSanitizer } from "@angular/platform-browser";
import { selectRandomActivities } from "../../../../utils/helper-functions";

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
export class CreatePlanDialog {
  intensity = TaskIntensities.MODERATE;
  endDate: Date = new Date();
  activitiesNotSpecified: boolean = false;
  taskIntensityOptions: SelectValue[] = createSelectValuesFromEnum(TaskIntensities);
  activitiesGenerated: Partial<DailyTask[]> = [];
  activitiesApproved: boolean = false;

  endDateFormControl = new FormControl("", [Validators.required]);
  intensityFormControl = new FormControl("", [Validators.required]);

  DISCARD_ICON_URL = `<svg xmlns="http://www.w3.org/2000/svg" height="16" width="14" viewBox="0 0 448 512"><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2023 Fonticons, Inc.--><path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"/></svg>`;
  APPROVE_ICON_URL = `<svg xmlns="http://www.w3.org/2000/svg" height="16" width="14" viewBox="0 0 448 512"><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2023 Fonticons, Inc.--><path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"/></svg>`;

  constructor(public dialogRef: MatDialogRef<CreatePlanDialog>, iconRegistry: MatIconRegistry, sanitizer: DomSanitizer, private toastService: ToastService) {
    iconRegistry.addSvgIconLiteral("discard", sanitizer.bypassSecurityTrustHtml(this.DISCARD_ICON_URL));
    iconRegistry.addSvgIconLiteral("approve", sanitizer.bypassSecurityTrustHtml(this.APPROVE_ICON_URL));
  }

  onClose(): void {
    this.dialogRef.close();
  }

  formHasError(): boolean {
    return this.endDateFormControl.hasError("required") || this.intensityFormControl.hasError("required");
  }

  // Generate daily tasks to be included in the plan and allow user to approve/regenerate the tasks
  async generateSelfCarePlanActivities(disregardPreferences: boolean = false) {
    if (this.formHasError()) {
      this.toastService.error(Notifications.INVALID_FORM_REQUIRED);
      return;
    }

    let dailyTasks: DailyTask[] = [];
    let preferedActivitiesIterated = 0;

    // generate based on user preferences
    if (!disregardPreferences) {
      const userPreferedActivities = JSON.parse(localStorage.getItem("loggedUser")!)._doc.preferedActivities;

      if (!userPreferedActivities) {
        this.activitiesNotSpecified = true;
        return;
      }

      // Fetch additional info for the activities
      for await (const activity of userPreferedActivities) {
        if (preferedActivitiesIterated > 2) break; // generate a plan with 2 daily tasks for now

        const { message: activityInfo } = await findActivityProperties({ searchByProperty: "activityName", searchValue: activity, findMany: false });

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
    } else {
      // generate random plan
      const randomActivities = await selectRandomActivities();

      if (randomActivities.length > 0) {
        for (const activityInfo of randomActivities) {
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
        }
      }
    }

    this.toastService.success(disregardPreferences ? Notifications.CREATEPLAN_ACTIVITIES_REGENERATED : Notifications.CREATEPLAN_ACTIVITIES_GENERATED);
    this.activitiesGenerated = [...dailyTasks];
  }

  async generateSelfCarePlan() {
    let selfCarePlan = {
      description: "A personalized self care plan which will help you improve your overall physical and mental health.",
      progress: 0,
      isCompleted: false,
      targetDate: this.endDate,
      dailyTasks: this.activitiesGenerated as DailyTask[],
      userId: await JSON.parse(localStorage.getItem("loggedUser")!)._doc._id,
    };


    const { success } = await createPlan(selfCarePlan);

    if (success) {
      this.toastService.success(Notifications.CREATEPLAN_SUCCESS);
      this.onClose();
    } else {
      this.toastService.error(Notifications.CREATEPLAN_FAILURE);
    }
  }
}
