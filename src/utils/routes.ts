import { fetchToken } from "./login";

const _userToken = await fetchToken();
export default {
  userToken: _userToken,
  login: "http://localhost:8000/auth/login",
  statusFetch: "http://localhost:8000/status",
  userFetch: "http://localhost:8000/auth/fetch",
  roomFetch: "http://localhost:8000/rooms/fetch",
  messageSocket: "ws://localhost:8000/message",
  createRoom: "http://localhost:8000/rooms/create",
  connectionSocket: "ws://localhost:8000/connection",
  channelFetch: "http://localhost:8000/channel/fetch",
  channelCreate: "http://localhost:8000/channel/create",
  channelDelete: "http://localhost:8000/channel/delete",
  channelCache: "http://localhost:8000/message/channel/cache",
  friendsSearch: "http://localhost:8000/search/friends",
  fetchUser: "http://localhost:8000/auth/fetch/user",
  friendRequest: "http://localhost:8000/friends/add",
  friendStatus: "http://localhost:8000/friends/status",
  friendsGet: "http://localhost:8000/friends/get",
};
