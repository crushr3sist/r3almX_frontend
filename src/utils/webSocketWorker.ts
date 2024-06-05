import webSocketService from "./ConnectionSocket";

self.addEventListener("message", (e) => {
  const { type, payload } = e.data;

  if (type === "SEND_MESSAGE") {
    webSocketService.sendMessage(payload);
  }
});

webSocketService.connectionSocket.onopen = () => {
  console.log("WebSocket connection opened");
};

webSocketService.connectionSocket.onmessage = (event) => {
  console.log("Received message:", event.data);
  self.postMessage({ type: "WEBSOCKET_MESSAGE", payload: event.data });
};

webSocketService.connectionSocket.onclose = () => {
  console.log("Websocket connection closed");
};
