import routes from "@/utils/routes";
import instance from "./axios_instance";

const fetchChannels = async (roomId: string, setChannels) => {
  try {
    const response = await instance.get(
      `${routes.channelFetch}?room_id=${roomId}`
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
    const response = await instance.post(
      `${routes.channelCreate}?channel_description=${channel_description}&channel_name=${channel_name}&room_id=${room_id}`
    );
    return response.data;
  } catch (e) {
    console.error(e);
  }
};

const fetchChannelMessages = async (setMessageHistory, room_id, channel_id) => {
  try {
    const response = await instance.get(
      `${routes.channelCache}?room_id=${room_id}&channel_id=${channel_id}`
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
