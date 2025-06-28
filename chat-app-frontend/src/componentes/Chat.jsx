// import React, { useState } from "react";
// export default Chat;
import React, { useEffect, useState } from "react";
import axios from "axios";
// import { motion } from "motion/react";
import checkIcon from "./../../src/check-svgrepo-com.svg";
import copyIcon from "./../../src/copy-svgrepo-com.svg";
import { motion, AnimatePresence } from "framer-motion";
// import ReactMarkdown from "react-markdown";
const Chat = () => {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
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
        "http://localhost:5000/api/chat",
        // "https://vnyai-api.vercel.app/api/chat",
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

  const handleCopy = (text) => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = text;
    const plainText = tempDiv.textContent || tempDiv.innerText || "";
    navigator.clipboard.writeText(plainText);
    setCopied(true);
  };

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [copied]);
  return (
    <div className="w-full md:w-3/4 lg:w-2/3 flex flex-col justify-center items-center p-4">
      <h1 id="headingLine" className="m-4 text-4xl md:text-5xl">
        What can I help with?
      </h1>
      <div className="chat_container w-full max-h-[60vh] overflow-y-auto space-y-2">
        {chat.map((msg, index) => (
          <div
            key={index}
            className={`flex relative ${
              msg.user === "You" ? "justify-end" : "justify-start"
            } my-2`}
          >
            {/* <span className=""> */}
            <div
              className={`p-4 rounded-4xl md:text-2xl text-xl   md:max-w-[75%] ${
                msg.user === "You"
                  ? "bg-[#10A37F] text-white"
                  : "bg-[#333537] text-white"
              }`}
              dangerouslySetInnerHTML={{ __html: msg.text }}
            />

            <div className="absolute -bottom-11 mx-5">
              {/* <button
                onClick={() => {
                  const tempDiv = document.createElement("div");
                  tempDiv.innerHTML = msg.text; // msg.text contains HTML
                  const plainText =
                    tempDiv.textContent || tempDiv.innerText || "";
                  navigator.clipboard.writeText(plainText);
                }}
              >
                <img src={copyIcon} className="h-8 w-8" />
              </button> */}
              <button onClick={() => handleCopy(msg.text)}>
                <AnimatePresence mode="wait">
                  {copied ? (
                    <motion.img
                      key="check"
                      src={checkIcon}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.3 }}
                      className="h-8 w-8"
                    />
                  ) : (
                    <motion.img
                      key="copy"
                      src={copyIcon}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.3 }}
                      className="h-8 w-8"
                    />
                  )}
                </AnimatePresence>
              </button>
            </div>
            {/* </span> */}
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
