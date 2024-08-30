import { fetchToken } from "./login";
import routes from "./routes";

class ConnectionSocket {
  connectionSocket: WebSocket;
  token: string;
  WEBSOCKET_URL: string;

  constructor() {
    this.token = "";
    this.WEBSOCKET_URL = "";

    this.initialize();
  }

  async initialize() {
    this.token = await fetchToken();
    this.WEBSOCKET_URL = `${
      routes.connectionSocket
    }?token=${this.token.toString()}`;

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
