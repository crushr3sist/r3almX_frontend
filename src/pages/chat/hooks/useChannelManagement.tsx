import { useUserState } from "@/providers/UserProvider";
import { useCallback, useEffect, useState } from "react";
import routes from "@/utils/routes";
import { _createNewChannel } from "@/utils/fetchers";
import instance from "@/utils/axios_instance";

export interface IChannels {
  author: string;
  id: string;
  channel_name: string;
  time_created: string;
  channel_description: string;
}

export const useChannelManagement = (roomId: string) => {
  const { roomsJoined, setLastRoomVisited } = useUserState();
  const [channels, setChannels] = useState<null | IChannels[]>(null);

  const currentRoom = roomsJoined.find((room) => room.id === roomId);

  const [channelId, setChannelId] = useState(
    currentRoom?.last_channel_visited_id || ""
  );

  useEffect(() => {
    const fetchChannels = async () => {
      if (!roomId) return;
      try {
        const response = await instance.get(
          `${routes.channelFetch}?room_id=${roomId}`
        );
        setChannels(response.data.channels);
      } catch (error) {
        console.error("Error fetching channels: ", error);
      }
    };
    fetchChannels();
  }, [roomId]);

  const handleClick = useCallback(
    (newChannelId: string, channelName: string, channelDesc: string) => {
      setChannelId(newChannelId);

      setLastRoomVisited({
        roomId,
        channelId: newChannelId,
        channelName,
        channelDesc,
      });
    },
    [setLastRoomVisited, roomId]
  );

  const updateRoom = async () => {
    if (!roomId) return;

    try {
      const response = await instance.get(
        `${routes.channelFetch}?room_id=${roomId}`
      );
      setChannels(response.data.channels);
    } catch (error) {
      console.error("Error fetching channels:", error);
    }
  };

  return {
    channels,
    channelId,
    handleClick,
    createNewChannel: _createNewChannel,
    updateRoom,
    lastVisitedChannelName: currentRoom?.last_channel_visited_name,
    lastVisitedChannelDesc: currentRoom?.last_channel_visited_desc,
    roomName: currentRoom?.room_name,
  };
};
