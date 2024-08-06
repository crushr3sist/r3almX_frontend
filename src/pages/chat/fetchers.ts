import { fetchToken } from "@/utils/login";
import routes from "@/utils/routes";
import axios from "axios";

const token = await fetchToken();

const fetchChannels = async (roomId: string, setChannels, token) => {
  try {
    const response = await axios.get(
      `${routes.channelFetch}?room_id=${roomId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setChannels(response.data.channels);
  } catch (error) {
    console.error("Error fetching channels:", error);
  }
};

const _createNewChannel = async (
  channel_description,
  channel_name,
  room_id
) => {
  try {
    const response = await axios.post(
      `${routes.channelCreate}?channel_description=${channel_description}&channel_name=${channel_name}&room_id=${room_id}`,
      null,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (e) {
    console.error(e);
  }
};

const fetchChannelMessages = async (
  setMessageHistory,
  token,
  room_id,
  channel_id
) => {
  try {
    const response = await axios.get(
      `${routes.channelCache}?room_id=${room_id}&channel_id=${channel_id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const cachedMessages = response.data || [];
    const parsedMessages = cachedMessages.reverse().map((msg) => ({
      data: JSON.stringify(msg),
    }));

    setMessageHistory((prev) => [...prev, ...parsedMessages]);
  } catch (error) {
    console.error("Error fetching cached messages:", error);
  }
};

export { fetchChannels, fetchChannelMessages, _createNewChannel };
