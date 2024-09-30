import axios from "axios";
import routes from "./routes";
import { expTime, fetchToken, setToken, setTokenExpire } from "./login";
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
  const response = await axios.get(`${routes.userFetch}?token=${token}`);
  const user = response.data.user;
  return user;
};

export const statusFetcher = async (): Promise<string> => {
  const token = await fetchToken();
  const response = await axios.get(`${routes.statusFetch}?token=${token}`);
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

export const loginUser = async (
  username: string,
  password: string,
  setErrorMessage
) => {
  const navigate = useNavigate();

  try {
    const response = await axios.post(
      `${routes.createToken}?username=${username}&password=${password}`
    );

    if (response.status === 200) {
      await handleLoginSuccess(response.data.access_token);
      navigate("/");
    }
  } catch (error) {
    setErrorMessage("Login failed. Please check your credentials.");
  }
};

export const verifyToken = (token) => {
  return axios.get(`${routes.checkToken}?token=${token}`);
};

export const handleGoogleLogin = async (
  credentialResponse,
  setErrorMessage,
  setAuthPhase
) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  try {
    console.log(credentialResponse);

    const response = await axios.post(
      `${routes.googleCallBack}`,
      {
        code: credentialResponse.credential,
      },
      { headers: { "Content-Type": "application/json" } }
    );

    if (response.data.username_set) {
      await handleLoginSuccess(response.data.access_token);
      await dispatch(setAuthenticated());

      navigate("/");
    } else {
      await setToken(response.data.access_token);
      setAuthPhase(2); // Set authPhase to 2 using state setter
    }
  } catch (error) {
    console.error("Google login failed", error);
    setErrorMessage("Google login failed. Please try again.");
  }
};

export const handleLoginSuccess = async (token) => {
  const verifyTokenStatus = await verifyToken(token);
  const dispatch = useDispatch();

  if (verifyTokenStatus.status === 200) {
    await setToken(token);
    await setTokenExpire(expTime().toString());
    await dispatch(setAuthenticated());
  }
};

export const finaliseAuth = async (newUsername, setErrorMessage) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  if (newUsername) {
    try {
      const token = await fetchToken();

      const response = await axios.patch(
        `${routes.changeUsername}?username=${newUsername}&token=${token}`,
        null
      );
      console.log(response.status);
      if (response.status === 200) {
        await setToken(response.data.access_token);
        await dispatch(setAuthenticated());
        navigate("/");
      }
    } catch (error) {
      console.error(error);
      setErrorMessage("Failed to set new username. Please try again.");
    }
  }
};
