import axios from "axios";
import routes from "./routes";
import { fetchToken, setToken, setTokenExpire } from "./login";
import { IRoom, IUserFetch } from "@/state/userSliceInterfaces";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setAuthenticated } from "@/state/userSlice";

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
  console.log(response.data);

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
      console.log("Failed to fetch rooms");
    }
  } catch (error) {
    console.log("Error fetching rooms:", error);
  }
};

export const verifyToken = (token) => {
  axios.get(`${routes.checkToken}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
