import { DailyTask } from "./plans";
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

export interface GetQueryParams {
  searchByProperty: string;
  searchValue: string;
  findMany: boolean;
}

export interface ApiCallResult {
  success: boolean;
  message: Object;
}

export interface SelfCarePlanPayload {
  description: string;
  targetDate: Date;
  dailyTasks: DailyTask[];
  userId: string;
};

export interface MessagePayload {
  message: string;
  conversationId: string;
  timestamp: Date;
  type: string;
  userId?: string;
}

export interface ConversationPayload {
  dateCreated: Date;
  userId?: string;
  isGuest: boolean;
}
