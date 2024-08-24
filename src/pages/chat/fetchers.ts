import routes from "@/utils/routes";
import axios from "axios";

const fetchChannels = async (roomId: string, setChannels) => {
  try {
    const response = await axios.get(
      `${routes.channelFetch}?room_id=${roomId}`,
      {
        headers: {
          Authorization: `Bearer ${routes.userToken}`,
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
          Authorization: `Bearer ${routes.userToken}`,
        },
      }
    );
    return response.data;
  } catch (e) {
    console.error(e);
  }
};

const fetchChannelMessages = async (setMessageHistory, room_id, channel_id) => {
  try {
    const response = await axios.get(
      `${routes.channelCache}?room_id=${room_id}&channel_id=${channel_id}`,
      {
        headers: {
          Authorization: `Bearer ${routes.userToken}`,
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
