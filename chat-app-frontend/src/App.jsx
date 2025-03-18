import React from "react";
import Chat from "./componentes/chat";

const App = () => {
  return (
    <div className="min-h-screen bg-[#202123] text-[#ECECF1] flex flex-col">
      {/* Header */}
      <header className="w-full p-5 md:text-4xl flex justify-between text-2xl font-bold text-center md:text-left">
        <span className="flex items-center  gap-4">
          <img
            src="https://www.svgrepo.com/show/375527/ai-platform.svg"
            className="h-10"
          />

          <span>vnyAI</span>
        </span>
        <img
          src="https://www.svgrepo.com/show/109737/profile-user.svg"
          className="h-10"
        />
      </header>

      {/* Main Content */}
      <main className="flex flex-1 flex-col justify-center items-center  text-center">
        <Chat />
      </main>

      {/* Footer */}
      <footer className="h-16 flex justify-center items-center  text-sm md:text-xl px-4 text-center">
        vnyAI can make mistakes. Check important info.
      </footer>
    </div>
  );
};

export default App;
