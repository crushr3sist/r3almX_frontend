// Authentication Routes
const authRoutes = {
  googleCallback: "http://localhost:5000/auth/google/callback",
  createToken: "http://localhost:5000/auth/token/create",
  checkToken: "http://localhost:5000/auth/token/verify",
  fetchUser: "http://localhost:5000/auth/fetch/user",
  userFetch: "http://localhost:5000/auth/fetch",
};

// User Routes
const userRoutes = {
  changeUsername: "http://localhost:5000/users/change_username",
  friendsSearch: "http://localhost:5000/search/friends",
  friendRequest: "http://localhost:5000/friends/add",
  friendStatus: "http://localhost:5000/friends/status",
  friendsGet: "http://localhost:5000/friends/get",
};

// Status Routes
const statusRoutes = {
  statusFetch: "http://localhost:5000/status/get",
  statusChange: "http://localhost:5000/status/change",
};

// Room Routes
const roomRoutes = {
  roomFetch: "http://localhost:5000/rooms/fetch",
  createRoom: "http://localhost:5000/rooms/create",
};

// Channel Routes
const channelRoutes = {
  channelFetch: "http://localhost:5000/channel/fetch",
  channelCreate: "http://localhost:5000/channel/create",
  channelDelete: "http://localhost:5000/channel/delete",
  channelCache: "http://localhost:5000/message/channel/cache",
};

// WebSocket Routes
const socketRoutes = {
  messageSocket: "ws://localhost:5000/message",
  connectionSocket: "ws://localhost:5000/connection",
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
