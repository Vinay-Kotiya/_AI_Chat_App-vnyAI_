// import React, { useState } from "react";
// export default Chat;
import React, { useState } from "react";
import axios from "axios";
import { motion } from "motion/react";
// import ReactMarkdown from "react-markdown";
const Chat = () => {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!message.trim()) {
      alert("Message is required");
      return;
    }

    const updatedChat = [...chat, { user: "You", text: message }];
    setChat(updatedChat);
    setMessage("");
    document.getElementById("headingLine").style.display = "none";
    setLoading(true);

    try {
      const response = await axios.post(
        "https://vnyai-api.vercel.app/api/chat",
        { message },
        { headers: { "Content-Type": "application/json" } }
      );

      setChat([
        ...updatedChat,
        { user: "AI", text: formatResponse(response.data.response) },
      ]);
    } catch (error) {
      setChat([...updatedChat, { user: "AI", text: error.message }]);
      console.error(
        "Error sending message:",
        error.response?.data || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  const formatResponse = (response) => {
    return response
      .replace(/\n/g, "<br>")
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>");
  };

  return (
    <div className="w-full md:w-3/4 lg:w-2/3 flex flex-col justify-center items-center p-4">
      <h1 id="headingLine" className="m-4 text-4xl md:text-5xl">
        What can I help with?
      </h1>
      <div className="chat_container w-full max-h-[60vh] overflow-y-auto space-y-2">
        {chat.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.user === "You" ? "justify-end" : "justify-start"
            } my-2`}
          >
            <div
              className={`p-4 rounded-4xl md:text-2xl text-xl   md:max-w-[75%] ${
                msg.user === "You"
                  ? "bg-[#10A37F] text-white"
                  : "bg-[#333537] text-white"
              }`}
              dangerouslySetInnerHTML={{ __html: msg.text }}
            />
          </div>
        ))}
        {loading && (
          <div className="flex justify-start my-2">
            <div className="p-4 rounded-4xl md:text-2xl text-xl md:max-w-[75%] bg-[#333537] text-white">
              <motion.div
                className="w-6 h-6 border-4 border-t-white border-gray-400 rounded-full"
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              />
            </div>
          </div>
        )}
      </div>
      <div className="relative w-full mt-4">
        <textarea
          className="textarea_main bg-[#343541]  text-2xl p-6 pr-12  w-full rounded-4xl text-white focus:outline-none resize-none"
          rows="2" // Defines the visible height
          value={message}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()} // Shift+Enter for new line
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask me anything..."
        />
        <button
          onClick={sendMessage}
          className="absolute right-2 bottom-0 text-2xl transform -translate-y-1/2 bg-white text-black font-bold px-4 py-2 rounded-4xl"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
