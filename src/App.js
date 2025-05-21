import React, { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./views/Index";
import ChatBot from "./views/chatbot/ChatBot";
import "./App.css";
import PresentationViewer from "./views/PresentationViewer";
import WelcomePage from "./views/landingPage/WelcomePage";
import SorCheckModule from "./views/sorCheck/SorCheckModule";

const App = () => {
  const [chatHistory, setChatHistory] = useState([]);

  const clearHistory = () => {
    localStorage.removeItem("chatHistory");
    setChatHistory([]);
    window.location.reload();
    console.log("Chat history cleared");
  };
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<WelcomePage/>} /> 
          <Route path="/template" element={<Index />}/>
          <Route path="/chatbot" element={<ChatBot clearHistory={clearHistory} />}/>
          <Route path="/ppt-generation" element={<PresentationViewer/>} />
          <Route path="/sor" element={<SorCheckModule/>} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
