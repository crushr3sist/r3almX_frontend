import { fetchToken } from "@/utils/login";
import axios from "axios";

const token = await fetchToken();

const fetchChannels = async (roomId: string, setChannels, token) => {
  try {
    const response = await axios.get(
      `http://10.1.1.207:8000/channel/fetch?room_id=${roomId}`,
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

const createNewChannel = async (channel_description, channel_name, room_id) => {
  try {
    const response = await axios.post(
      `http://10.1.1.207:8000/channel/create?channel_description=${channel_description}&channel_name=${channel_name}&room_id=${room_id}`,
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
      `http://10.1.1.207:8000/message/channel/cache?room_id=${room_id}&channel_id=${channel_id}`,
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

export { fetchChannels, fetchChannelMessages, createNewChannel };
