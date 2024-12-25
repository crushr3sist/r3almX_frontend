import { useSelector, useDispatch } from "react-redux";
import { setLastRoomVisited } from "@/state/userSlice";
import { useCallback, useEffect, useState } from "react";
import { RootState } from "@/state/store";
import { fetchToken } from "@/utils/login";
import axios from "axios";
import routes from "@/utils/routes";
import { _createNewChannel } from "@/utils/fetchers";
import { setChannelSelected } from "@/state/appSlice";

export const useChannelManagement = (roomId: string) => {
  const dispatch = useDispatch();
  const [channels, setChannels] = useState<any>(null);

  const roomsJoined = useSelector(
    (state: RootState) => state.userState.roomsJoined
  );
  const channelSelected = useSelector(
    (state: RootState) => state.appState.channelSelected
  );

  const currentRoom = roomsJoined.find((room) => room.id === roomId);

  const [channelId, setChannelId] = useState(
    currentRoom?.last_channel_visited_id || ""
  );

  useEffect(() => {
    const fetchChannels = async () => {
      if (!roomId) return;
      const token = await fetchToken();
      try {
        const response = await axios.get(
          `${routes.channelFetch}?room_id=${roomId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setChannels(response.data.channels);
      } catch (error) {
        console.log("Error fetching channels: ", error);
      }
    };
    fetchChannels();
  }, [roomId]);

  const handleClick = useCallback(
    (newChannelId: string, channelName: string, channelDesc: string) => {
      setChannelId(newChannelId);
      dispatch(
        setLastRoomVisited({
          roomId,
          channelId: newChannelId,
          channelName,
          channelDesc,
        })
      );
      dispatch(setChannelSelected(true));
    },
    [dispatch, roomId]
  );

  const updateRoom = async () => {
    const token = await fetchToken();

    if (!roomId) return;
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
  return {
    channels,
    channelId,
    handleClick,
    createNewChannel: _createNewChannel,
    updateRoom,
    channelSelected,
    // https://claude.site/artifacts/174a1f10-b83a-4b2e-b5a7-d64ed3d88eac
    lastVisitedChannelName: currentRoom?.last_channel_visited_name,
    lastVisitedChannelDesc: currentRoom?.last_channel_visited_desc,
    roomName: currentRoom?.room_name,
  };
};
