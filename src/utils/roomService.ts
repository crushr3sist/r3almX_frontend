import axios, { AxiosResponse } from "axios";
import { fetchToken } from "./login";
import { IChannel, IRoom } from "@/state/userSlice";

const API_URL = "http://10.1.1.207:8000/rooms/fetch";

export interface IRoomFetch {
  id: unknown;
  notifications: number;
  status: number;
  rooms: IRoom[];
  channels: IChannel[];
}

export const fetchRooms = async (): Promise<{
  rooms: IRoom[];
  channels: IChannel[];
}> => {
  try {
    const token = await fetchToken();
    const response: AxiosResponse<IRoomFetch> = await axios.get(API_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.data.status === 200) {
      return {
        rooms: response.data.rooms,
        channels: response.data.channels,
      };
    } else {
      throw new Error("Failed to fetch rooms");
    }
  } catch (error) {
    console.error("Error fetching rooms:", error);
    throw error;
  }
};
