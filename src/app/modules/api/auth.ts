import axios from "axios";
import { LoginPayload, RegisterPayload } from "../../types/api";
import { HttpStatusCode } from "@angular/common/http";

const API_URL = "http://localhost:3000"; // use env

export const login = async (payload: LoginPayload) => {
  try {
    const {
      data: { accessToken, loggedUser },
      status,
    } = await axios({
      method: "POST",
      url: `${API_URL}/auth/login`,
      data: payload,
    });

    return { success: status === HttpStatusCode.Created ? true : false, message: accessToken && loggedUser ? { accessToken, loggedUser } : "Incorrect login credentials." };
  } catch {
    return { success: false, message: "Unable to login." };
  }
};

export const register = async (payload: RegisterPayload) => {
  try {
    const { data, status } = await axios({
      method: "POST",
      url: `${API_URL}/users`,
      data: payload,
    });

    return { success: status === HttpStatusCode.Created ? true : false, message: data };
  } catch {
    return { success: false, message: "Unable to register." };
  }
};

export const isUserLoggedIn = async () => {
  const loggedUserId = JSON.parse(localStorage.getItem("loggedUser")!)._doc._id;
  const authToken = localStorage.getItem("token");

  if (!loggedUserId || !authToken) return { success: false };

  try {
    const { status } = await axios({
      method: "GET",
      url: `${API_URL}/authenticated`,
      data: {
        id: loggedUserId,
      },
      headers: {
        Authorization: `Bearer ${authToken}`
      },
    });

    return { success: status === HttpStatusCode.Ok ? true : false };
  } catch {
    return { success: false };
  }
};
