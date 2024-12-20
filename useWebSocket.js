const { useState, useEffect } = require("react")

const useWebSocket = (url) => {
    const [messages, setMessages] = useState([]);
    const [ws, setWs] = useState(null);

    useEffect(() => {
        // Create a WebSocket connection
        const socket = new WebSocket(url);
        setWs(socket);
    
        // Listen for messages from the WebSocket server
        socket.onmessage = (event) => {
          setMessages((prevMessages) => [...prevMessages, event.data]);
        };
    
        // Cleanup WebSocket connection when the component is unmounted
        return () => {
          socket.close();
        };
      }, [url]);
    
      // Function to send a message to the WebSocket server
      const sendMessage = (message) => {
        if (ws) {
          ws.send(message);
        }
      };
    
      return { messages, sendMessage };
    };
    
export default useWebSocket;
