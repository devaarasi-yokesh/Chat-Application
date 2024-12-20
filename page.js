'use client'
import { useState, useEffect } from "react";
import styles from "./page.module.css";
import useWebSocket from "./useWebSocket";


export default function Home() {
  const { messages, sendMessage } = useWebSocket('ws://localhost:3000'); // WebSocket server URL
  const [input, setInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(input);  // Send message to WebSocket server
    setInput('');  // Clear the input
  };

  return (
    <div>
      <h1>Real-Time Chat</h1>
      <div>
        <h2>Messages:</h2>
        {messages.map((msg, index) => (
          <p key={index}>{msg}</p>
        ))}
      </div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message"
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
