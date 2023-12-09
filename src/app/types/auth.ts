import { Activity, Gender, Goal } from "./user";

export interface LoginPayload {
  username: string;
  password: string;
}

export interface RegisterPayload extends LoginPayload {
  email: string;
  gender: Gender;
  country?: string;
  city?: string;
  goals: Goal[];
  preferedActivities?: Activity[];
  age?: number;
}

export interface ApiCallResult {
  status: boolean;
  message: Object;
}
