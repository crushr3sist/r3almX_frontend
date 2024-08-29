import axios from "axios";

import routes from "./routes";
import { IRoom } from "@/state/userSliceInterfaces";

export const fetchRooms = async (): Promise<{
  rooms: IRoom[] | null;
}> => {
  try {
    const response = await axios.get(routes.roomFetch, {
      headers: {
        Authorization: `Bearer ${routes.userToken}`,
      },
    });

    if (response.data.status === 200) {
      return {
        rooms: response.data.rooms,
      };
    } else {
      console.log("Failed to fetch rooms");
    }
  } catch (error) {
    console.log("Error fetching rooms:", error);
  }
};
