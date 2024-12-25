// Authentication Routes
const authRoutes = {
  googleCallback: "http://localhost:8080/auth/google/callback",
  createToken: "http://localhost:8080/auth/token/create",
  checkToken: "http://localhost:8080/auth/token/check",
  fetchUser: "http://localhost:8080/auth/fetch/user",
  userFetch: "http://localhost:8080/auth/fetch",
};

// User Routes
const userRoutes = {
  changeUsername: "http://localhost:8080/users/change_username",
  friendsSearch: "http://localhost:8080/search/friends",
  friendRequest: "http://localhost:8080/friends/add",
  friendStatus: "http://localhost:8080/friends/status",
  friendsGet: "http://localhost:8080/friends/get",
};

// Status Routes
const statusRoutes = {
  statusFetch: "http://localhost:8080/status",
  statusChange: "http://localhost:8080/status/change",
};

// Room Routes
const roomRoutes = {
  roomFetch: "http://localhost:8080/rooms/fetch",
  createRoom: "http://localhost:8080/rooms/create",
};

// Channel Routes
const channelRoutes = {
  channelFetch: "http://localhost:8080/channel/fetch",
  channelCreate: "http://localhost:8080/channel/create",
  channelDelete: "http://localhost:8080/channel/delete",
  channelCache: "http://localhost:8080/message/channel/cache",
};

// WebSocket Routes
const socketRoutes = {
  messageSocket: "ws://localhost:8080/message",
  connectionSocket: "ws://localhost:8080/connection",
};

const routes = {
  ...authRoutes,
  ...userRoutes,
  ...statusRoutes,
  ...roomRoutes,
  ...channelRoutes,
  ...socketRoutes,
};

export default routes;
