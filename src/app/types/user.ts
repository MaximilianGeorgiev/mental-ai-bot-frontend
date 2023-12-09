import { Genders, Activities, Goals, UserRoles } from "../enums/users.enum";

export type Gender = keyof typeof Genders;
export type Activity = keyof typeof Activities;
export type Goal = keyof typeof Goals;
export type Role = keyof typeof UserRoles;