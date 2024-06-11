let connectionSocket;

onmessage = function (event) {
  if (event.data.type === "connect") {
    connectionSocket = new WebSocket(event.data.url);
    connectionSocket.onmessage = function (wsEvent) {
      const receivedData = JSON.parse(wsEvent.data);
      postMessage({
        type: "WEBSOCKET_MESSAGE",
        payload: receivedData,
      });
    };
  }
  console.log("Received message:", event.data);
  postMessage({ type: "WEBSOCKET_MESSAGE", payload: event.data });
};

onclose = function () {
  console.log("Websocket connection closed");
};
