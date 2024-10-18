import { fetchToken } from "./login";

export default {
  userToken: await fetchToken(),
  statusFetch: "http://localhost:5000/status/get",
  statusChange: "http://localhost:5000/status/change",

  userFetch: "http://localhost:5000/auth/fetch",
  roomFetch: "http://localhost:5000/rooms/fetch",
  messageSocket: "ws://localhost:5000/message",
  createToken: "http://localhost:5000/auth/token",
  checkToken: "http://localhost:5000/auth/token/check",
  googleCallBack: "http://localhost:5000/auth/google/callback",
  changeUsername: "http://localhost:5000/auth/change_username",

  createRoom: "http://localhost:5000/rooms/create",
  connectionSocket: "ws://localhost:5000/connection",
  channelFetch: "http://localhost:5000/channel/fetch",
  channelCreate: "http://localhost:5000/channel/create",
  channelDelete: "http://localhost:5000/channel/delete",
  channelCache: "http://localhost:5000/message/channel/cache",
  friendsSearch: "http://localhost:5000/search/friends",
  fetchUser: "http://localhost:5000/auth/fetch/user",
  friendRequest: "http://localhost:5000/friends/add",
  friendStatus: "http://localhost:5000/friends/status",
  friendsGet: "http://localhost:5000/friends/get",
};
