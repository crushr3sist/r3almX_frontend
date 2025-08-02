import routes from "./routes";
import { IRoom, IUserFetch } from "@/state/userSliceInterfaces";
import instance from "./axios_instance";

export const fetchFriends = async () => {
  const response = await instance.get(`${routes.friendsGet}`);
  return response.data;
};

export const userDataFetcher = async (): Promise<IUserFetch> => {
  const response = await instance.get(`${routes.userFetch}`);
  const user = response.data.user;
  return user;
};

export const statusFetcher = async (): Promise<string> => {
  const response = await instance.get(`${routes.statusFetch}`);
  return response.data;
};

export const fetchRooms = async (): Promise<{
  rooms: IRoom[] | null;
}> => {
  try {
    const response = await instance.get(routes.roomFetch);

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

export const verifyToken = async () => {
  try {
    const response = await instance.get<IUserStub>(`${routes.checkToken}`);

    if (!response.data.is_user_logged_in) {
      return false;
    } else {
      return true;
    }
  } catch (error) {
    return false;
  }
};
