import axios, { HttpStatusCode } from "axios";
import { GetQueryParams } from "../../types/api";

const API_URL = "http://localhost:3000"; // use env

export const find = async ({ searchByProperty, searchValue, findMany }: GetQueryParams) => {
  try {
    const { status, data } = await axios({
      method: "GET",
      url: `${API_URL}/activities/${searchByProperty}/${searchValue}/?many=${findMany}`,
    });

    return { success: status === HttpStatusCode.Created ? true : false, message: data };
  } catch {
    return { success: false, message: "Unable to fetch self care plans." };
  }
};