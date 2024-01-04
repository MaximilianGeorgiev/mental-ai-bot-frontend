import axios, { HttpStatusCode } from "axios";
import { ConversationPayload, GetQueryParams, MessagePayload } from "../../types/api";

const API_URL = "http://localhost:3000"; // use env

export const sendMessage = async (message: MessagePayload) => {
    try {
        const { data, status } = await axios({
          method: "POST",
          url: `${API_URL}/messages`,
          data: message,
        });
    
        return { success: status === HttpStatusCode.Created ? true : false, message: data };
      } catch {
        return { success: false, message: "Unable to send message." };
      }
};

export const createConversation = async (conversation: ConversationPayload) => {
    try {
        const { data, status } = await axios({
          method: "POST",
          url: `${API_URL}/conversations`,
          data: conversation,
        });
    
        return { success: status === HttpStatusCode.Created ? true : false, message: data };
      } catch {
        return { success: false, message: "Unable to create a new conversation." };
      }
};

export const findConversation = async ({ searchByProperty, searchValue, findMany }: GetQueryParams) => {
    try {
        const { status, data } = await axios({
          method: "GET",
          url: `${API_URL}/conversations/${searchByProperty}/${searchValue}/?many=${findMany}`,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          },
        });
    
        return { success: status === HttpStatusCode.Created || HttpStatusCode.Ok ? true : false, message: data };
      } catch {
        return { success: false, message: "Unable to fetch conversations." };
      }
};