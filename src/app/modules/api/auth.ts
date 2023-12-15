import axios from "axios";
import { LoginPayload, RegisterPayload } from "../../types/auth";
import { HttpStatusCode } from "@angular/common/http";

const API_URL = "http://localhost:3000"; // use env

export const login = async (payload: LoginPayload) => {
  try {
    const {
      data: { accessToken },
      status,
    } = await axios({
      method: "POST",
      url: `${API_URL}/auth/login`,
      data: payload,
    });
    
    return { success: status === HttpStatusCode.Created ? true : false, message: accessToken ?? "Incorrect login credentials." };
  } catch {
    return { success: false, message: "Unable to login." };
  }
};

export const register = async (payload: RegisterPayload) => {
  try {
    const {
      data,
      status,
    } = await axios({
      method: "POST",
      url: `${API_URL}/users`,
      data: payload,
    });
    
    return { success: status === HttpStatusCode.Created ? true : false, message: data };
  } catch {
    return { success: false, message: "Unable to register." };
  }
};
