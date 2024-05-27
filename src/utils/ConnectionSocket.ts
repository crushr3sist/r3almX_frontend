export default class ConnectionSocket {
  connectionSocket: WebSocket;

  constructor(url: string) {
    this.connectionSocket = new WebSocket(url);

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
