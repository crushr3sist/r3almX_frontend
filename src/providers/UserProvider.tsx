import React, { createContext, useContext, useState, useCallback } from "react";

// Re-use existing interfaces
export type TSstatus = "online" | "idle" | "dnd" | "offline";

export interface IChannel {
  id: string;
  channel_name: string;
  time_created: string;
  channel_description: string;
  author: string;
}

export interface IRoom {
  id: string;
  room_name: string;
  members: string[];
  room_owner: string;
  invite_key: string;
  notifications: number;
  last_channel_visited_id: string;
  last_channel_visited_name: string;
  last_channel_visited_desc: string;
}

export interface IPinnedFriends {
  user_id: string;
  username: string;
  pic: string;
}

export interface ISetLastRoomVisitedPayload {
  roomId: string;
  channelId: string;
  channelName: string;
  channelDesc: string;
}

interface UserState {
  userStatus: TSstatus;
  notifications: number;
  username: string;
  email: string;
  pic: string;
}

interface UserContextType {
  // State
  userState: UserState;
  roomsJoined: IRoom[];
  pinnedFriends: IPinnedFriends[];

  // Actions - matching Redux action names exactly
  changeStatus: (status: TSstatus) => void;
  setStatus: (status: TSstatus) => void;
  incrementNotification: () => void;
  decrementNotification: () => void;
  setUsername: (username: string) => void;
  setPic: (pic: string) => void;
  setEmail: (email: string) => void;
  setLastRoomVisited: (payload: ISetLastRoomVisitedPayload) => void;
  incrementRoomNotification: (roomId: string) => void;
  decrementRoomNotification: (roomId: string) => void;
  addRoom: (room: IRoom) => void;
  addPinnedFriends: (friends: IPinnedFriends[]) => void;
  removeRoom: (roomId: string) => void;
  setRooms: (rooms: IRoom[]) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<React.PropsWithChildren<{}>> = ({
  children,
}) => {
  const [userState, setUserState] = useState<UserState>({
    userStatus: "offline",
    notifications: 0,
    username: "",
    email: "",
    pic: "",
  });

  const [roomsJoined, setRoomsJoined] = useState<IRoom[]>([]);
  const [pinnedFriends, setPinnedFriendsState] = useState<IPinnedFriends[]>([]);

  // Actions matching Redux exactly
  const changeStatus = useCallback((status: TSstatus) => {
    setUserState((prev) => ({ ...prev, userStatus: status }));
  }, []);

  const setStatus = useCallback((status: TSstatus) => {
    setUserState((prev) => ({ ...prev, userStatus: status }));
  }, []);

  const incrementNotification = useCallback(() => {
    setUserState((prev) => ({
      ...prev,
      notifications: prev.notifications + 1,
    }));
  }, []);

  const decrementNotification = useCallback(() => {
    setUserState((prev) => ({ ...prev, notifications: 0 }));
  }, []);

  const setUsername = useCallback((username: string) => {
    setUserState((prev) => ({ ...prev, username }));
  }, []);

  const setPic = useCallback((pic: string) => {
    setUserState((prev) => ({ ...prev, pic }));
  }, []);

  const setEmail = useCallback((email: string) => {
    setUserState((prev) => ({ ...prev, email }));
  }, []);

  const setLastRoomVisited = useCallback(
    (payload: ISetLastRoomVisitedPayload) => {
      const { roomId, channelId, channelName, channelDesc } = payload;
      setRoomsJoined((prev) =>
        prev.map((room) =>
          room.id === roomId
            ? {
                ...room,
                last_channel_visited_id: channelId,
                last_channel_visited_desc: channelDesc,
                last_channel_visited_name: channelName,
              }
            : room
        )
      );
    },
    []
  );

  const incrementRoomNotification = useCallback((roomId: string) => {
    setRoomsJoined((prev) =>
      prev.map((room) =>
        room.id === roomId
          ? { ...room, notifications: room.notifications + 1 }
          : room
      )
    );
  }, []);

  const decrementRoomNotification = useCallback((roomId: string) => {
    setRoomsJoined((prev) =>
      prev.map((room) =>
        room.id === roomId ? { ...room, notifications: 0 } : room
      )
    );
  }, []);

  const addRoom = useCallback((newRoom: IRoom) => {
    setRoomsJoined((prev) => {
      const roomExists = prev.some((room) => room.id === newRoom.id);
      if (!roomExists) {
        return [...prev, { ...newRoom, notifications: 0 }];
      }
      return prev;
    });
  }, []);

  const addPinnedFriends = useCallback((friends: IPinnedFriends[]) => {
    setPinnedFriendsState(friends);
  }, []);

  const removeRoom = useCallback((roomIdToRemove: string) => {
    setRoomsJoined((prev) => prev.filter((room) => room.id !== roomIdToRemove));
  }, []);

  const setRooms = useCallback((rooms: IRoom[]) => {
    if (Array.isArray(rooms) && rooms.length > 0) {
      setRoomsJoined(
        rooms.map((room) => ({
          ...room,
          notifications: room.notifications || 0,
          last_channel_visited_id: room.last_channel_visited_id || "",
          last_channel_visited_name: room.last_channel_visited_name || "",
          last_channel_visited_desc: room.last_channel_visited_desc || "",
        }))
      );
    } else {
      setRoomsJoined([]);
    }
  }, []);

  return (
    <UserContext.Provider
      value={{
        userState,
        roomsJoined,
        pinnedFriends,
        changeStatus,
        setStatus,
        incrementNotification,
        decrementNotification,
        setUsername,
        setPic,
        setEmail,
        setLastRoomVisited,
        incrementRoomNotification,
        decrementRoomNotification,
        addRoom,
        addPinnedFriends,
        removeRoom,
        setRooms,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserState = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUserState must be used within a UserProvider");
  }
  return context;
};
