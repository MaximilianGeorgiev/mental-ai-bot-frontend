import { findAll as findAllActivities } from "../modules/api/activity-properites";


// Generating a self care plan when the user does not want to take into account personal preferences
export const selectRandomActivities = async (count: number = 3) => {
  const { success, message: activitiesFound } = await findAllActivities();
  const randomizedActivities = [];

  if (success && activitiesFound.length > 0) {
    for (let i = 0; i < count; i++) {
      randomizedActivities.push(activitiesFound[Math.floor(Math.random() * activitiesFound.length)]);
    }

    return [...randomizedActivities];
  }

  return [];
};
