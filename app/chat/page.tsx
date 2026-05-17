"use client";
import { useState } from "react";

export default function ChatPage() {
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState("");

  const sendMessage = async () => {
    const res = await fetch(
      "https://your-n8n-domain/webhook/sodah-chat",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: message,
          aiNumber: "+971XXXXXXXX", // change later dynamically
        }),
      }
    );

    const data = await res.json();
    setReply(data.reply);
  };

  return (
    <main className="min-h-screen bg-[#0b1f1a] text-white flex flex-col items-center justify-center p-6">
      
      <h1 className="text-2xl mb-6">Sodah AI Chat</h1>

      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type message..."
        className="w-full max-w-md p-3 rounded bg-[#132f28]"
      />

      <button
        onClick={sendMessage}
        className="mt-4 bg-green-500 px-6 py-2 rounded"
      >
        Send
      </button>

      {reply && (
        <div className="mt-6 bg-[#132f28] p-4 rounded max-w-md">
          {reply}
        </div>
      )}
    </main>
  );
}