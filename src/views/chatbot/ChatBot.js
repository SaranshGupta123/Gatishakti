import React, { useState, useEffect,useRef } from "react";
import "./chat.css";
import images from "component/Image";
import { ClipLoader } from "react-spinners";
import { generateText } from "services/api.services";

const ChatInterface = () => {
  const [chatState, setChatState] = useState({
    chatHistory: [],
    inputText: "",
    fname: "Malkangiri–Bhadrachalam-DPR",
    loading: false,
  });

  // Load chat history from localStorage on initial render
  useEffect(() => {
    const storedChatHistory = localStorage.getItem("chatHistory");
    if (storedChatHistory) {
      setChatState((prevState) => ({
        ...prevState,
        chatHistory: JSON.parse(storedChatHistory),
      }));
    }
  
  }, []);

  const handleSend = async () => {
    if (!chatState.inputText.trim()) return; // Do nothing if input is empty

    const question = chatState.inputText.trim();
    setChatState((prevState) => ({
      ...prevState,
      inputText: "",
      loading: true,
    }));

    // Add question to the chat history immediately
    const tempChat = {
      input: question,
      dpr: chatState.fname,
      output: "Loading...", // Placeholder for loading
    };
    const tempChatHistory = [...chatState.chatHistory, tempChat];
    setChatState((prevState) => ({
      ...prevState,
      chatHistory: tempChatHistory,
    }));

    try {
      const response = await generateText(chatState.fname, question);

      // Update the last chat with the actual response
      tempChatHistory[tempChatHistory.length - 1].output =
        response?.response || "No response received.";
      setChatState((prevState) => ({
        ...prevState,
        chatHistory: [...tempChatHistory],
        loading: false,
      }));
      localStorage.setItem("chatHistory", JSON.stringify(tempChatHistory));
    } catch (error) {
      console.error("Error:", error);

      // Update the last chat with an error message
      tempChatHistory[tempChatHistory.length - 1].output =
        "Failed to get a response. Please try again.";
      setChatState((prevState) => ({
        ...prevState,
        chatHistory: [...tempChatHistory],
        loading: false,
      }));
      localStorage.setItem("chatHistory", JSON.stringify(tempChatHistory));
    }
  };

  const clearChatHistory = () => {
    setChatState((prevState) => ({
      ...prevState,
      chatHistory: [],
    }));
    localStorage.removeItem("chatHistory");
  };

  const handleInputChange = (e) => {
    setChatState((prevState) => ({
      ...prevState,
      inputText: e.target.value,
    }));
  };

  const handleFnameChange = (e) => {
    setChatState((prevState) => ({
      ...prevState,
      fname: e.target.value,
    }));
  };

  return (
    <div className="container-fluid vh-100 d-flex text-light p-0">
      <div className="row flex-grow-1 g-0 position-relative">
        {/* Sidebar */}
        <div className="col-md-3 sidebar-wrapper">
          <div className="bg-black p-4 sidebar-content">
            <img
              className="mb-4"
              style={{ height: "auto", width: "150px" }}
              src={images.CompanyLogo}
              alt="main logo"
            />
            <div className="d-grid gap-3">
              <select
                className="form-select bg-dark text-light border-0 py-3 sidebar-select"
                value={chatState.fname}
                onChange={handleFnameChange}
              >
                <option value="Malkangiri–Bhadrachalam-DPR">
                  Malkangiri–Bhadrachalam-DPR
                </option>
                <option value="JUNAGARH-NABARANGPUR-DPR">
                  JUNAGARH-NABARANGPUR-DPR
                </option>
              </select>
              <button
                className="btn btn-dark text-start border-0 sidebar-btn py-3 rounded-3"
                onClick={clearChatHistory}
              >
                Clear Chat
              </button>
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="col-md-9 offset-md-3 d-flex flex-column chat-main">
          {/* Chat Messages */}
          <div className="flex-grow-1 overflow-auto p-4 chat-messages">
            {chatState.chatHistory.map((chat, index) => (
              <div
                key={index}
                className="mb-4 chat-message"
                style={{ backgroundColor: "#484a4c80", borderRadius: "1rem" }}
              >
                <div className="bg-dark bg-opacity-50 p-3 mb-2">
                  <p className="mb-0 fw-bold">{chat.input}</p>
                </div>
                <div className="bg-opacity-25 p-3 rounded-3">
                  {chatState.loading && index === chatState.chatHistory.length - 1 ? (
                    <ClipLoader
                      color={"#a03c64"}
                      size={25}
                      cssOverride={{
                        borderWidth: "4px",
                        display: "inline-block",
                      }}
                    />
                  ) : (
                    <p style={{ color: "#a5a3a3" }}>{chat.output}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Input Form */}
          <div className="chat-input-form">
            <div className="input-group p-4">
              <input
                type="text"
                placeholder="Type here to chat..."
                value={chatState.inputText}
                onChange={handleInputChange}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSend(); // Call handleSend when Enter is pressed
                  }
                }}
                className="flex-fill bg-dark text-light placeholder-muted rounded-pill px-3 py-2 border border-secondary focus-border-transparent"
              />
              <button
                className="send-button btn rounded-end"
                type="submit"
                onClick={handleSend}
              >
                &#x27A4;
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;



