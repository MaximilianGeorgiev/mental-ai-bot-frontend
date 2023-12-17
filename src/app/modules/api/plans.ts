import axios, { HttpStatusCode } from "axios";
import { GetQueryParams, SelfCarePlanPayload } from "../../types/api";

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
