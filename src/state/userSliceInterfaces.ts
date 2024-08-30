export type TSstatus = "online" | "idle" | "dnd" | "offline";

export interface IUserState {
  userStatus: TSstatus;
  tokenChecked: boolean;
  isAuthenticated: boolean;
  notifications: number;
  username: string;
}

// Define the Channel interface
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

export interface ISetLastRoomVisitedPayload {
  roomId: string;
  channelId: string;
  channelName: string;
  channelDesc: string;
}

export interface IPinnedFriends {
  user_id: string;
  username: string;
  pic: string;
}
export interface IUserFetch {
  username: string;
  email: string;
  pic: string;
}
export interface IUserStateSlice {
  userState: {
    userStatus: "online" | "idle" | "dnd" | "offline";
    tokenChecked: boolean;
    isAuthenticated: boolean;
    notifications: number;
    username: string;
    email: string;
    pic: string;
  };
  roomsJoined: IRoom[];
  pinnedFriends: IPinnedFriends[];
}
