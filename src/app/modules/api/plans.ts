import axios, { HttpStatusCode } from "axios";
import { GetQueryParams, SelfCarePlanPayload } from "../../types/api";
import { SelfCarePlan } from "../../types/plans";

const API_URL = "http://localhost:3000"; // use env

export const find = async ({ searchByProperty, searchValue, findMany }: GetQueryParams) => {
  try {
    const { status, data } = await axios({
      method: "GET",
      url: `${API_URL}/plans/${searchByProperty}/${searchValue}/?many=${findMany}`,
    });

    return { success: status === HttpStatusCode.Created ? true : false, message: data };
  } catch {
    return { success: false, message: "Unable to fetch self care plans." };
  }
};

export const create = async (payload: SelfCarePlanPayload) => {
  try {
    const { data, status } = await axios({
      method: "POST",
      url: `${API_URL}/plans`,
      data: payload,
    });

    return { success: status === HttpStatusCode.Created ? true : false, message: data };
  } catch {
    return { success: false, message: "Unable to create self care plan." };
  }
};

export const update = async (payload: SelfCarePlan) => {
  try {
    const { data, status } = await axios({
      method: "PUT",
      url: `${API_URL}/plans/${payload._id}`,
      data: {
        databaseColumn: "object",
        columnValue: payload,
      },
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
    });

    return { success: status === HttpStatusCode.Ok || status === HttpStatusCode.Created ? true : false, message: data };
  } catch {
    return { success: false, message: "Unable to update self care plan." };
  }
};
