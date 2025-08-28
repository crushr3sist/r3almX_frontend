import routes from "./routes";
import { IRoom } from "@/providers/UserProvider";
import instance from "./axios_instance";

// Define user fetch interface locally since it was in the deleted Redux files
interface IUserFetch {
  username: string;
  email: string;
  pic: string;
}

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

export const updateUserStatus = (status: string): void => {
  const url = `${routes.statusChange}?new_status=${status}`;
  const token = localStorage.getItem("token"); // Directly get token for keepalive fetch

  // Use fetch with keepalive for reliability on unload
  // Axios/standard fetch can be cancelled by the browser on page navigation.
  fetch(url, {
    method: "POST",
    headers: {
      // Manually add the Authorization header
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    keepalive: true,
  });
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
      console.error("Failed to fetch rooms, status:", response.data.status);
      return { rooms: null };
    }
  } catch (error) {
    console.error("Error fetching rooms:", error);
    return { rooms: null };
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
