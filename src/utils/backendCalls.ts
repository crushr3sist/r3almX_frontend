import axios from "axios";
import routes from "./routes";
import { fetchToken } from "./login";
import { IRoom, IUserFetch } from "@/state/userSliceInterfaces";

export const fetchFriends = async () => {
  const token = await fetchToken();

  const response = await axios.get(`${routes.friendsGet}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const userDataFetcher = async (): Promise<IUserFetch> => {
  const token = await fetchToken();
  const response = await axios.get(`${routes.userFetch}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const user = response.data.user;
  return user;
};

export const statusFetcher = async (): Promise<string> => {
  const token = await fetchToken();
  const response = await axios.get(`${routes.statusFetch}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const fetchRooms = async (): Promise<{
  rooms: IRoom[] | null;
}> => {
  const token = await fetchToken();
  try {
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
      console.error("Failed to fetch rooms");
    }
  } catch (error) {
    console.error("Error fetching rooms:", error);
  }
};
interface IUserStub {
  status: string;
  is_user_logged_in: boolean;
  user: string[];
}
export const verifyToken = async (token) => {
  const response = axios.get<IUserStub>(`${routes.checkToken}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response;
};
