import axios, { AxiosResponse } from "axios";
import { fetchToken } from "./login";

interface Room {
  // Define the properties of a room object
  id: number;
  name: string;
  // Add other properties as per your data structure
}

const API_URL = "http://10.1.1.207:8000/rooms/fetch";

export const fetchRooms = async (): Promise<Room[]> => {
  try {
    const token = await fetchToken();
    const response: AxiosResponse<{ status: number; rooms: Room[] }> =
      await axios.get(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

    if (response.data.status === 200) {
      return response.data.rooms;
    } else {
      throw new Error("Failed to fetch rooms");
    }
  } catch (error) {
    console.error("Error fetching rooms:", error);
    throw error;
  }
};
