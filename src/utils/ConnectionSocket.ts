import { fetchToken } from "./login";

class ConnectionSocket {
  connectionSocket: WebSocket;
  WEBSOCKET_URL = `ws://localhost:8000/connection?token=${async () =>
    await fetchToken()}`;

  constructor() {
    this.connectionSocket = new WebSocket(this.WEBSOCKET_URL);

    this.connectionSocket.onopen = () => {
      console.log("websocket connection opened");
    };

    this.connectionSocket.onmessage = (message) => {
      console.log("Received message:", message.data);
    };

    this.connectionSocket.onclose = () => {
      console.log("WebSocket connection closed.");
    };

    this.connectionSocket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };
  }

  sendMessage(message: string) {
    if (this.connectionSocket.readyState === WebSocket.OPEN) {
      this.connectionSocket.send(message);
    } else {
      console.log(
        "websocket is not open. Ready state is:",
        this.connectionSocket.readyState
      );
    }
  }

  closeConnection() {
    this.connectionSocket.close();
  }
}

export default ConnectionSocket;
