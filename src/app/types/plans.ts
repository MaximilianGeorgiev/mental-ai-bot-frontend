import { ActivityMetrics, TaskIntensities } from "../enums/plans.enum";
import { Activity } from "./user";

export interface DailyTask {
  activity: Activity;
  description: string;
  percentCompleted: number; // update everytime the user submits they worked towards their task
  dateUpdated: Date; // keep track of date updated to send reminders in case the user did not update today
  metric: ActivityMetric;
  metricQuantity: number;
}

export type ActivityMetric = keyof typeof ActivityMetrics;
export type TaskIntensity = keyof typeof TaskIntensities;
