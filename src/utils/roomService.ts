import axios, { AxiosResponse } from "axios";
import { fetchToken } from "./login";
import { IRoom } from "@/state/userSlice";

const API_URL = "http://10.1.1.207:8000/rooms/fetch";

export const fetchRooms = async (): Promise<{
  rooms: IRoom[];
}> => {
  try {
    const token = await fetchToken();
    const response = await axios.get(API_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.data.status === 200) {
      return {
        rooms: response.data.rooms,
      };
    } else {
      throw new Error("Failed to fetch rooms");
    }
  } catch (error) {
    console.error("Error fetching rooms:", error);
    throw error;
  }
};
