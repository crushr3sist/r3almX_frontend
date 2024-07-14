import axios from "axios";
import { fetchToken } from "./login";
import { IRoom } from "@/state/userSlice";
import routes from "./routes";

export const fetchRooms = async (): Promise<{
  rooms: IRoom[];
}> => {
  try {
    const token = await fetchToken();
    const response = await axios.get(routes.roomFetch, {
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
